
const express = require("express");
const { getAdminStats, getAllChildren } = require("../controllers/dashboardController");
const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");



const router = express.Router();


router.get("/children",         protectRoute, checkPermission("view_users"),     getAllChildren);
router.get("/stats",            protectRoute, checkPermission("view_users"),  getAdminStats);



module.exports = router;
