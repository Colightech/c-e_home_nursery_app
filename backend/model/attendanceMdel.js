const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    daycareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Daycare",
      required: true,
    },

    date: {
      type: String, // e.g. "2026-05-04"
      required: true,
    },

    // ⏰ Time tracking
    timeIn: {
      type: Date,
      default: null,
    },

    timeOut: {
      type: Date,
      default: null,
    },

    // 👤 Who dropped child
    checkedInBy: {
      name: String,
      relationship: String,
    },

    // 👤 Who picked child
    checkedOutBy: {
      name: String,
      relationship: String,
    },

    //Status
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    notes: {
      type: String,
    },

    //  Staff who recorded
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);

// Prevent duplicate attendance per child per day
attendanceSchema.index({ childId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);


