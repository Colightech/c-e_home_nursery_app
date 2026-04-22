require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const usersModel = require("../model/usersModel");
const logAudit = require("../utils/auditLogger");
const setCookies = require("../utils/setCookies");
const { generateAccessToken } = require("../utils/generateToken");
const childModel = require("../model/childModel");
const sendEmail = require("../lib/sendEmail");
const generateOtp = require("../lib/generateOtp");
const sendVerificationEmail = require("../lib/sendVerificationEmail");
const validateChildBusinessRules = require("../lib/validateChildBusinessRules");
const rolePermissions = require("../lib/rolePermissions");
const getDevice = require("../lib/getDevice");




// REGISTER ADMIN
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, phone, 
        profilePicture, role, dateOfBirth, gender, daycareId, child } = req.body;

    // basic required
    if (!firstName || !lastName || !email || !password || !role || !phone) {
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
    const existing = await usersModel.findOne({ email });
    if (existing) {
      return res.status(400).json({
        error: true,
        message: "Admin already exists",
      });
    }

    // Check if phone is already registered
    const existingPhone = await usersModel.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        error: true,
        message: "Phone number already in use",
      });
    }

  
    let user; 
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // validate first
      if (role === "parent") {
        if (!child || !child.firstName || !child.lastName) {
          throw new Error("Child information is required for parent registration");
        }
        validateChildBusinessRules(child);
      }
      // create user
      const createdUser = await usersModel.create([{
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        profilePicture,
        role,
        dateOfBirth,
        gender,
        daycareId,
        permissions: rolePermissions(role)
      }], { session });

      user = createdUser[0]; 

      // create child
      if (role === "parent") {
        await childModel.create([{
          ...child,
          parentId: user._id
        }], { session });
      }
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }


    await sendVerificationEmail(email);

    const device = getDevice(req);

    await logAudit({
      action: "REGISTER",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
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
    const user = await usersModel.findOne({ email }).select("+password");

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
      count: children.length,
      children,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


// Admin updates any user
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       firstName,
//       lastName,
//       email,
//       address,
//       phone,
//       profilePicture,
//       dateOfBirth,
//       gender,
//       daycareId,
//       child
//     } = req.body;

//     const oldUser = await usersModel.findById(id);
//     if (!oldUser) {
//       return res.status(404).json({
//         error: true,
//         message: "User not found"
//       });
//     }

//     // Only update provided fields
//     const updatePayload = {};
//     if (firstName) updatePayload.firstName = firstName;
//     if (lastName) updatePayload.lastName = lastName;
//     if (email) updatePayload.email = email;
//     if (address) updatePayload.address = address;
//     if (phone) updatePayload.phone = phone;
//     if (profilePicture) updatePayload.profilePicture = profilePicture;
//     if (dateOfBirth) updatePayload.dateOfBirth = dateOfBirth;
//     if (gender) updatePayload.gender = gender;
//     if (daycareId) updatePayload.daycareId = daycareId;

//     const updatedUser = await usersModel
//       .findByIdAndUpdate(id, updatePayload, {
//         new: true,
//         runValidators: true
//       })
//       .select("-password");

//     // CHILD UPDATE (FIXED)
//     if (updatedUser.role === "parent" && child) {
//       validateChildBusinessRules(child);

//       await childModel.updateMany(
//         { parentId: updatedUser._id }, // ✅ correct filter
//         { $set: child },               // ✅ correct update syntax
//         { runValidators: true }
//       );
//     }

//     // AUDIT LOG (FIXED)
//     await logAudit({
//       action: `UPDATE_${updatedUser.role.toUpperCase()}`,
//       entityId: updatedUser._id,
//       entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
//       status: "success",
//       metadata: {
//         time: new Date(),
//         device: "web",
//       },
//       source: "auth",
//       details: {
//         before: {
//           firstName: oldUser.firstName,
//           lastName: oldUser.lastName,
//           phone: oldUser.phone,
//           role: oldUser.role
//         },
//         after: {
//           firstName: updatedUser.firstName,
//           lastName: updatedUser.lastName,
//           phone: updatedUser.phone,
//           role: updatedUser.role
//         },
//         updatedBy: {
//           firstName: req.user.firstName,
//           lastName: req.user.lastName,
//           email: req.user.email,
//           role: req.user.role
//         }
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       user: updatedUser
//     });

//   } catch (err) {
//     return res.status(500).json({
//       error: true,
//       message: err.message
//     });
//   }
// };


const updateUser = async (req, res) => {
  let session;
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      address,
      phone,
      profilePicture,
      dateOfBirth,
      gender,
      daycareId,
      child
    } = req.body;

    // 🔹 1. Find user first
    const oldUser = await usersModel.findById(id);
    if (!oldUser) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }


    // Validate child ONLY if needed
    if (oldUser.role === "parent") {
      if (!child || !child.firstName || !child.lastName) {
          throw new Error("Child information is required for parent update");
        }
      validateChildBusinessRules(child);
    }

    // 🔹 3. START TRANSACTION
    session = await mongoose.startSession();
    session.startTransaction();

    // 🔹 4. Build update payload
    const updatePayload = {};
    if (firstName) updatePayload.firstName = firstName;
    if (lastName) updatePayload.lastName = lastName;
    if (email) updatePayload.email = email;
    if (address) updatePayload.address = address;
    if (phone) updatePayload.phone = phone;
    if (profilePicture) updatePayload.profilePicture = profilePicture;
    if (dateOfBirth) updatePayload.dateOfBirth = dateOfBirth;
    if (gender) updatePayload.gender = gender;
    if (daycareId) updatePayload.daycareId = daycareId;

    // 🔹 5. Update USER
    const updatedUser = await usersModel.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
        session
      }
    ).select("-password");

    // 🔹 6. Update CHILD (only if parent)
    if (updatedUser.role === "parent" && child) {
      await childModel.updateMany(
        { parentId: updatedUser._id },
        { $set: child },
        { runValidators: true, session }
      );
    }

    // 🔹 7. COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    // 🔹 8. AUDIT LOG
    await logAudit({
      action: "UPDATE",
      entityId: updatedUser._id,
      entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      status: "success",
      metadata: {
        time: new Date(),
        device: "mobile"
      },
      source: "auth",
      req,
      details: {
        before: {
          firstName: oldUser.firstName,
          lastName: oldUser.lastName,
          phone: oldUser.phone,
          role: oldUser.role
        },
        after: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          role: updatedUser.role
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const user = await usersModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    //delete ALL children if parent
    if (user.role === "parent") {
      await childModel.deleteMany({ parentId: user._id });
    }

    //hard delete user
    await usersModel.findByIdAndDelete(user._id);

    //audit log
    await logAudit({
      action: "HARD_DELETE",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`,
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        deletedBy: {
          firstName: req.user.firstName,
          email: req.user.email,
          role: req.user.role,
        }
      },
      source: "auth",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "User permanently deleted"
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

// Instead of permanently deleting user it is better to deactivate the user
// so that the record remaine in the system for audit and future reference
const softDeleteUser  = async (req, res) => {
  try {
    const user = await usersModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    //delete children (if parent)
    if (user.role === "parent") {
      await childModel.updateMany(
        { parentId: user._id },
        {
          isActive: false,
          deletedAt: new Date(),
          deletedBy: req.user._id
        }
      );
    }

    //soft delete user
    user.isActive = false;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save();

    // 🧾 audit log
    await logAudit({
      action: "SOFT_DELETE",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`,
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        deletedBy: {
          firstName: req.user.firstName,
          email: req.user.email,
          role: req.user.role,
        }
      },
      source: "auth",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};



const reactivateUser  = async (req, res) => {
  try {
    const user = await usersModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    //delete children (if parent)
    if (user.role === "parent") {
      await childModel.updateMany(
        { parentId: user._id },
        {
          isActive: true,
          deletedAt: null,
          deletedBy: null,
        }
      );
    }

    //soft delete user
    user.isActive = true;
    user.deletedAt = null;
    user.deletedBy = null;
    await user.save();

    // audit log
    await logAudit({
      action: "RE_ACTIVATE",
      entityId: user._id,
      entityName: `${user.firstName} ${user.lastName}`,
      status: "success",
      metadata: {
        time: new Date(),
        device: "web",
        activatedBy: {
          firstName: req.user.firstName,
          email: req.user.email,
          role: req.user.role,
        }
      },
      source: "auth",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "User re-activated successfully"
    });

  } catch (error) {
    return res.status(500).json({
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

    const user = await usersModel.findById(decoded.id);

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






// ACCOUNT VERIFICATION CONTROLLER
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: true,
        message: "Email and Otp are required."
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await usersModel.findOne({
      email,
      verificationOtp: hashedOtp,
      verificationOtpExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // mark verified
    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpiresAt = null;
    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const user = await usersModel.findOne({ email });

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

    const title = "Verify Your Email Address";
    const message = `
        Hello ${user.firstName},

        Your verification code is: ${otp}

        ⏳ This code will expire in 60 minutes.

        If you didn't request this, please ignore this email.`;

    await sendEmail(user.email, title, message);

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


// Generate reset password Otp and send
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
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
    const expiresAt = Date.now() + 15 * 60 * 1000;

    user.passwordResetOtp = hashedOtp;
    user.passwordResetOtpExpiresAt = expiresAt;
    user.otpLastSentAt = Date.now();
    await user.save();

    const title = "Password Reset Request";
    const message = `
        Hello ${user.firstName},
	      You requested to reset your password.
        Your reset code is: ${otp}
        ⏳ This code will expire in 15 minutes.
        If you didn't request this, please ignore this email.`;
    await sendEmail(user.email, title, message);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error"
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: true,
        message: "Email, Otp and new password are required."
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await usersModel.findOne({
      email,
      passwordResetOtp: hashedOtp,
      passwordResetOtpExpiresAt: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.password = newPassword;

    // Clear reset fields
    user.passwordResetOtp = null;
    user.passwordResetOtpExpiresAt = null;
    await user.save();

    await logAudit({
      action: "RESET_PASSWORD",
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
      message: "Password reset successfully",
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
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
}

