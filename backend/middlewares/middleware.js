
require("dotenv").config();
const jwt = require("jsonwebtoken");
const usersModel = require("../model/usersModel");
const rolePermissions = require("../lib/rolePermissions");




const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    const user = await usersModel.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: true,
        message: "Invalid user",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Authentication failed",
    });
  }
};



const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error : true,
        message: 'Access denied'
      });
    }
    next();
  };
};



const superAdminRoute = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "super-admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. super-admin only."
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Authorization error"
    });
  }
};



const adminRoute = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. admin only."
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Authorization error"
    });
  }
};



// middlewares/isTeacher.js
const caregiverRoute = (req, res, next) => {
  try {
    // user should already be attached to req.user by auth middleware
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized. Please log in.",
      });
    }

    if (req.user.role !== "caregiver") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Only caregiver can create assignments.",
      });
    }

    next(); // continue if caregiver
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error" });
  }
};




const checkPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = rolePermissions(req.user.role);

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: "Forbidden! Access denied." });
    }

    next();
  };
};


module.exports = { protectRoute, restrictTo, superAdminRoute, adminRoute, caregiverRoute, checkPermission};
