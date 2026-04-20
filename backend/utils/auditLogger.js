
const mongoose = require("mongoose");
const auditLogModel = require("../model/auditLogModel");
const getClientIp = require("../utils/getClientIp");

const logAudit = async ({
  action,
  entityId,
  entityName,
  status = "pending",
  metadata = {},
  source,
  req = null,
}) => {
  try {

    // 🔥 VERY IMPORTANT: Prevent crash if DB not ready
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ DB not ready, skipping audit log");
      return;
    }

    await auditLogModel.create({
      action,
      entityId,
      entityName,
      status,
      metadata,
      source,
      ip: getClientIp(req),
      userAgent: req?.headers?.["user-agent"] || "worker/system", // ✅ FIXED
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

module.exports = logAudit;
