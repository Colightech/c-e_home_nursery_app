const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  occupation: {
    type: String,
  },
  childrenIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // link to Student model
      required: true,
      unique: true,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to parent user account
    required: true,
    unique: true,
  },
  // Common soft-delete fields
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
}, { timestamps: true });

const parentModel = mongoose.model("Parent", parentSchema);

module.exports = parentModel;
