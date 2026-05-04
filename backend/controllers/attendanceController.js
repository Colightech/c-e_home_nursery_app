const attendanceMdel = require("../model/attendanceMdel");







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

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







const checkOut = async (req, res) => {
  try {
    const { childId, checkedOutBy } = req.body;

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

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await attendanceMdel.findByIdAndDelete(id);

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