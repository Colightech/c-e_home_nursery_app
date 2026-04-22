
const express = require("express");
const {
  registerUser,
  loginUser,   
  getCurrentUser,
  getAllChildren,        // admin
  updateUser,
  refreshAccessToken,
  deleteUser,
  logoutUser,            // admin (hard delete if you support it)
  softDeleteUser,     // admin
  reactivateUser,     // admin
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");



const router = express.Router();


 //ADMIN
router.post("/register", protectRoute, checkPermission("create_user"), registerUser);

//PUBLIC
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Student/Teacher/Parent updates their own profile
router.post("/logout", protectRoute, logoutUser);


 // Users (admin-managed)
router.get("/me",               protectRoute, checkPermission("view_users"),     getCurrentUser);
router.put("/:id/update",       protectRoute, checkPermission("update_user"),     updateUser);
router.delete("/:id/delete",    protectRoute, checkPermission("delete_user"),     deleteUser);
router.put("/:id/softdelete",   protectRoute, checkPermission("update_user"),     softDeleteUser);
router.put("/:id/reactivate",   protectRoute, checkPermission("update_user"),     reactivateUser);
router.get("/children",         protectRoute, checkPermission("view_users"),     getAllChildren);



module.exports = router;
