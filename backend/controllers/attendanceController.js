const attendanceMdel = require("../model/attendanceMdel");
const logAudit = require("../utils/auditLogger");
const getDevice = require("../lib/getDevice");




const checkIn = async (req, res) => {
  try {
    const { childId, daycareId, checkedInBy } = req.body;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    //Define cutoff time (9:00 AM)
    const cutoff = new Date();
    cutoff.setHours(9, 0, 0, 0);

    //Determine status
    let status = "present";
    if (now > cutoff) {
      status = "late";
    }

    const existing = await attendanceMdel.findOne({ childId, date: today });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await attendanceMdel.create({
      childId,
      daycareId,
      date: today,
      timeIn: now,
      checkedInBy,
      status, // 👈 set here
      recordedBy: req.user.id,
    });

    const device = getDevice(req);

    await logAudit({
      action: "ATTENDANCE_CHECK_IN",
      entityId: attendance._id,
      entityName: "Attendance", 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "Attendance_check_in",
      req,
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const checkOut = async (req, res) => {
  try {
    const { childId, checkedOutBy } = req.body;

    if (!childId || !checkedOutBy) {
      return res.status(403).json({
        error: true,
        message: "childId and checkedOutBy are required"
      })
    }

    const today = new Date().toISOString().split("T")[0];

    const attendance = await attendanceMdel.findOne({ childId, date: today });

    if (!attendance) {
      return res.status(404).json({ message: "No check-in found" });
    }

    if (attendance.timeOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    attendance.timeOut = new Date();
    attendance.checkedOutBy = checkedOutBy;

    await attendance.save();

    const device = getDevice(req);
    await logAudit({
      action: "ATTENDANCE_CHECK_OUT",
      entityId: attendance._id,
      entityName: "Attendance", 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "Attendance_check_out",
      req,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const records = await attendanceMdel.find({ date })
      .populate("childId")
      .populate("recordedBy");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getChildAttendance = async (req, res) => {
  try {
    const { childId } = req.params;

    const records = await attendanceMdel.find({ childId }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await attendanceMdel.findByIdAndUpdate(id, req.body, {
      new: true,
    });


    const device = getDevice(req);
    await logAudit({
      action: "UPDATE_ATTENDANCE",
      entityId: updated._id,
      entityName: "Attendance", 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "Update_Attendance",
      req,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await attendanceMdel.findByIdAndDelete(id);

    const device = getDevice(req);
    await logAudit({
      action: "DELETE_ATTENDANCE",
      entityId: id,
      entityName: "Attendance", 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "Delete_Attendance",
      req,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





module.exports = {
    checkIn,
    checkOut,
    getAttendanceByDate,
    getChildAttendance,
    updateAttendance,
    deleteAttendance,
}