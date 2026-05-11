
const express = require("express");
const {
  registerUser,
  loginUser,
  fetchAllUsers,
  getCurrentUser,        
  updateUser,
  refreshAccessToken,
  deleteUser,
  logoutUser,            
  softDeleteUser,     
  reactivateUser,     
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
router.get("/me",               protectRoute, checkPermission("view_users"),    getCurrentUser);
router.get("/users",            protectRoute, checkPermission("view_users"),    fetchAllUsers);

router.put("/:id/update",       protectRoute, checkPermission("update_user"),   updateUser);
router.delete("/:id/delete",    protectRoute, checkPermission("delete_user"),   deleteUser);
router.put("/:id/softdelete",   protectRoute, checkPermission("update_user"),   softDeleteUser);
router.put("/:id/reactivate",   protectRoute, checkPermission("update_user"),   reactivateUser);



module.exports = router;
