const crypto = require("crypto");
const generateOtp = require("./generateOtp");
const sendEmail = require("./sendEmail");
const usersModel = require("../model/usersModel");

const sendVerificationEmail = async (email) => {
  try {
    const user = await usersModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    //Prevent OTP spam (60 seconds cooldown)
    if (
      user.otpLastSentAt &&
      Date.now() - user.otpLastSentAt < 60 * 1000
    ) {
      throw new Error("Please wait before requesting another OTP");
    }

    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000;

    user.verificationOtp = hashedOtp;
    user.verificationOtpExpiresAt = expiresAt;
    user.otpLastSentAt = Date.now();
    await user.save();

    const title = "Account created, verify Your Email Address";
    const message = `
        Hello ${user.firstName},

        yuor account has been created successfully,

        Your verification code is: ${otp}

        ⏳ This code will expire in 60 minutes.

        If you didn't request this, please ignore this email.`;

    await sendEmail(user.email, title, message);

  } catch (error) {
    console.error("Send verification email failed:", error.message);
    throw error;
  }
};

module.exports = sendVerificationEmail;