require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const logAudit = require("../utils/auditLogger");
const setCookies = require("../utils/setCookies");
const { generateAccessToken } = require("../utils/generateToken");
const childModel = require("../model/childModel");
const sendEmail = require("../lib/sendEmail");
const generateOtp = require("../lib/generateOtp");




// REGISTER ADMIN
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, phone, 
        profilePicture, role, dateOfBirth, gender } = req.body;

    // basic required
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        error: true,
        message: "firstName, lastName, email, password, and role are required.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email Format",
      });
    }

    // Password validation
    const passSpecialRegex = /[!@#$%^&*(),.?":{}|<>]/; // at least one special char
    const passUpperRegex = /[A-Z]/; // at least one uppercase
    const passNumberRegex = /[0-9]/; // at least one number

    if (
      password.length < 8 ||
      !passSpecialRegex.test(password) ||
      !passUpperRegex.test(password) ||
      !passNumberRegex.test(password)
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Password must be 8+ chars, with one special char, number, and uppercase letter",
      });
    }

    // Check if exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({
        error: true,
        message: "Admin already exists",
      });
    }

    // Check if phone is already registered
    const existingPhone = await userModel.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        error: true,
        message: "Phone number already in use",
      });
    }

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });


    if ( user.role === "parent") {
        await childModel.create(req.body)
    }


    await logAudit({
      action: "REGISTER",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
      },
      source: "auth",
      req,
    });

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      data : {
        id : user._id,
        name : `${user.firstName} ${user.lastName}`,
        email : user.email,
        phone : user.phone,
        role : user.role,
        profile : user.profilePicture,
      },
    });

  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


// LOGIN ADMIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required"
       });
    }

    // Include password explicitly
    const user = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }


    //Check if inactive
    if (!user.isActive) {
      return res.status(403).json({
        error: true,
        message: "Account disabled",
      });
    }


    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        
        await logAudit({
            action: "LOGIN_FAILED",
            entityId: user._id,
            entityName: `${user.firstName} ${user.lastName}`, 
            status: "failed",
            metadata: {
            time: new Date(),
            device: "web",
            },
            source: "auth",
            req,
        });


        return res.status(400).json({
            error: true,
            message: "Invalid credentials",
        });
    }

    await user.save();

    setCookies(res, user);

    await logAudit({
      action: "LOGIN",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
      },
      source: "auth",
      req,
    });


    return res.status(200).json({
        success: true,
        message: "Login successful",
        data : {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
        },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


const logoutUser = async (req, res) => {

  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: true,
      message: "Not authenticated",
    });
  }

  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });


  await logAudit({
    action: "LOGOUT",
    entityId: user._id,
    entityName: `${user.firstName} ${user.lastName}`, 
    status: "success",
    metadata: {
      time: new Date(),
      device: "web",
    },
    source: "auth",
    req,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfull",
  });
};


const getCurrentUser = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profile: user.profilePicture,
      },
    });

  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Invalid or expired token",
    });
  }
};


const getAllChildren = async (req, res) => {
  try {
    const children = await childModel.find().select("-password"); // don’t return password

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


// Admin updates any user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Common fields always in userModel
    const { firstName, lastName, email, phone, address, phone, 
        profilePicture, dateOfBirth, gender } = req.body;

    const oldUser = await userModel.findById(id);
    if (!oldUser) {
      return res.status(404).json({
        error: true,
        message: "oldUser not found"
      });
    }

    const updatedUser  = await userModel.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, address, phone, 
        profilePicture, dateOfBirth, gender },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
 

    // Cascade updates based on parent role
    if (updatedUser.role === "parent") {
        await childModel.findByIdAndUpdate(
        {parentId : updatedUser._id},
        req.body,
        { new: true, runValidators: true }
      );
    }
    // Create audit log
    await logAudit({
      action: `UPDATE_${updatedUser.role.toUpperCase()}`,
      entityId: user._id,
      entityName: `${updatedUser.firstName} ${updatedUser.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
      },
      source: "auth",
      req,
      details: {
        before: {
          firstName: oldUser.firstName,
          lastName: oldUser.lastName,
          phone: oldUser.phone,
          role : oldUser.role
        },
        after: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          role : updatedUser.role
        },
        updatedBy : {
          firstName : req.user.firstName,
          lastName : req.user.lastName,
          email : req.user.email,
          role : req.user.role
        }
      },
      req
    });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user : updatedUser
    });

  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    await logAudit({
      action: `DELETE_${user.role.toUpperCase()}`, // DELETE_PARENT
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        deletedBy : { 
          firstName : req.user.firstName,
          email : req.user.email,
          role : req.user.role,
        }
      },
      source: "auth",
      req,
    });

    res.status(200).json({
      success: true,
      message: "User and related profile deleted"
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};


// Instead of permanently deleting user it is better to deactivate the user
// so that the record remaine in the system for audit and future reference
const softDeleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({
      error: true,
      message: "User not found"
    });

    // Deactivate user
    await userModel.findByIdAndUpdate(user._id, {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: req.user._id
    }, { new: true });


    await logAudit({
      action: `SOFT_DELETE_${user.role.toUpperCase()}`, // DELETE_PARENT
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        deletedBy : { 
          firstName : req.user.firstName,
          email : req.user.email,
          role : req.user.role,
        }
      },
      source: "auth",
      req,
    });

    res.status(200).json({
      success: true,
      message: "User deactivated (soft-deleted)"
    });

  } catch (e) {
    res.status(500).json({
      error: true,
      message: e.message
    });
  }
};




const reactivateUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({
      error: true,
      message: "User not found"
    });

    await userModel.findByIdAndUpdate(user._id, {
      isActive: true,
      deletedAt: null,
      deletedBy: null
    });

     await logAudit({
      action: `ACTIVATE_${user.role.toUpperCase()}`, // DELETE_PARENT
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        deletedBy : { 
          firstName : req.user.firstName,
          email : req.user.email,
          role : req.user.role,
        }
      },
      source: "auth",
      req,
    });

    res.status(200).json({
      success: true,
      message: "User reactivated"
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};




const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true, // ✅ prevents XSS
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.json({ success: true });

  } catch (err) {
    return res.status(401).json({ message: "Refresh failed" });
  }
};






// ACCOUNT VERIFICATION CONTROLLERS
const verifyEmail = async (req, res) => {
  try {
    const { token, id } = req.query;

    // Basic validation
    if (!token || !id) {
      return res.status(400).json({
        error: true,
        message: "Token and user ID are required."
      });
    }

     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      _id : id,
      verificationOtp : hashedToken,
      verificationOtpExpiresAt : { $gt: Date.now() } // not expired
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid or expired token."
      });
    }

    user.isVerified = true;
    user.verificationOtp = "";
    user.verificationOtpExpiresAt = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in."
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};



const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required."
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        error: true,
        message: "User already verified"
      });
    }

    const resendOtp = generateOtp();
     const hashedToken = crypto.createHash("sha256").update(resendOtp).digest("hex");
    user.verificationOtp = hashedToken;
    user.verificationOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();


    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${resendOtp}&id=${user._id}`;
    const title = "Verify Your Email Address";
    const desc = `Hello ${user.name || 'there'},
      Please click the link below to verify your email address:
      ${verifyUrl}
      This link will expire in 24 hours.
      If you didn't request this, please ignore this email.`;

    await sendEmail(email, title, desc);

    res.status(200).json({
      success: true,
      message: "Verification email resent"
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    });
  }
};


// PASSWORD RESET
// Generate reset password Otp and send
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    // Generate reset token
    const resetOtp = generateOtp();
    const hashedToken = crypto.createHash("sha256").update(resetOtp).digest("hex");
      

    // Store hashed token + expiry in DB
    user.passwordResetOtp = hashedToken;
    user.passwordResetOtpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetOtp}&id=${user._id}`;


    const title = "Password Reset Request";
    const message = `
      Hello ${user.firstName},
      You requested to reset your password. Please use the link below:
      ${resetUrl}
      This link is valid for 15 minutes.
    `;

    await sendEmail(user.email, title, message);

    return res.status(200).json({
      error: false,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({error: true,
      message: "Server error"
    });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { token, id } = req.query; // token & id from reset link
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      _id: id,
      passwordResetOtp: hashedToken,
      passwordResetOtpExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid or expired token",
      });
    }

    user.password = newPassword;

    // Clear reset fields
    user.passwordResetOtp = "";
    user.passwordResetOtpExpiresAt = 0;
    await user.save();

    await logAudit({
      action: `RESET_PASSWORD_${user.role.toUpperCase()}`,
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
      },
      source: "auth",
      req,
    });

    return res.status(200).json({
      success : true,
      message: "Password has been reset successfully",
    });
    
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error"
    });
  }
};




module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getAllChildren,
    updateUser,
    deleteUser,
    softDeleteUser,
    reactivateUser,
    refreshAccessToken,

    verifyEmail,
}

