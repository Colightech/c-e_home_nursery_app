const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGIN_FAILED",
        "REGISTER",
        "LOGOUT",
        "UPDATE",
        "DELETE",
        "HARD_DELETE",
        "SOFT_DELETE",
        "ACTIVATE",
        "RESET_PASSWORD",
      ],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // dynamic reference
      default : null,
    },

    entityName: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },

    metadata: {
      type: Object, // store payload, errors, etc
    },

    source: {
      type: String, // webhook, worker, system
    },

    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ entityId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

const auditLogModel = mongoose.model("AuditLog", auditLogSchema);

module.exports = auditLogModel;