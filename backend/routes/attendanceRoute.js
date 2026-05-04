const express = require("express");
const {
    checkIn,
    checkOut,
    getAttendanceByDate,
    getChildAttendance,
    updateAttendance,
    deleteAttendance,
}= require("../controllers/attendanceController");
const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");


const router = express.Router();


router.post("/check-in",  protectRoute, checkPermission("check_in"), checkIn); 
router.post("/check-out", protectRoute, checkPermission("check_out"),checkOut);

router.get("/", protectRoute, checkPermission("view_attendance"), getAttendanceByDate);
router.get("/:childId", protectRoute, checkPermission("view_attendance"), getChildAttendance);

router.put("/:id", protectRoute, checkPermission("update_attendance"), updateAttendance);
router.delete("/:id", protectRoute, checkPermission("delete_attendance"), deleteAttendance);



module.exports = router;


