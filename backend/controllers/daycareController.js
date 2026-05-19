
const daycareModel = require("../model/daycareModel");
const usersModel = require("../model/usersModel");
const logAudit = require("../utils/auditLogger");
const getDevice = require("../lib/getDevice");



// ================= CREATE =================
const createDaycare = async (req, res) => {
  try {

    const {   name, address, phone, email, capacity} = req.body;


    if (req.user.role !== "super-admin" && req.user.role !== "admin") {
        return res.status(403).json({
          error: true,
          message: "Not authorized to create daycare",
        });
    }

    let ownerId;

    if (req.user.role === "super-admin") {
        ownerId = req.user.id; // assign to admin
    } else {
        ownerId = req.user.id; // admin creates for self
    }


    if (!ownerId) {
        return res.status(400).json({
          error: true,
          message: "Owner (admin user) is required",
        });
    }


    const ownerUser = await usersModel.findById(ownerId);
    const allowedRoles = ["super-admin", "admin"];
    if (!ownerUser || !allowedRoles.includes(ownerUser.role)) {
      return res.status(400).json({
        message: "Owner must be a valid admin user",
      });
    }

    const existing = await daycareModel.findOne({ owner: ownerId });

    if (existing) {
        return res.status(400).json({
          error: true,
          message: "This admin already has a daycare",
        });
    }

    const daycare = await daycareModel.create({
      name,
      address: ownerUser.address,
      phone: ownerUser.phone,
      email: ownerUser.email,
      capacity,
      owner: ownerId,
    });

     const device = getDevice(req);

    await logAudit({
      action: "CREATE_DAYCARE",
      entityId: daycare._id,
      entityName: `${daycare.name}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "daycare",
      req,
    });

    res.status(201).json({
      success: true,
      message: "Daycare created successfully",
      data: daycare,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= GET ALL =================
const getAllDaycares= async (req, res) => {
  try {
    const daycares = await daycareModel.find({
      owner: req.user.id,   // 👈 filter by logged-in user
      deletedAt: null,
    }).populate("owner", "firstName lastName email");

    return res.status(201).json({
      count: daycares.length,
      data: daycares,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// ================= GET ONE =================
const getSingleDaycare = async (req, res) => {
  try {
    const daycare = await daycareModel.findById(req.params.id)
      .populate("owner", "firstName lastName email");

    if (!daycare || daycare.deletedAt) {
      return res.status(404).json({ message: "Daycare not found" });
    }

    res.json(daycare);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// ================= UPDATE =================
const updateDaycare = async (req, res) => {
  try {
    const daycare = await daycareModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!daycare) {
      return res.status(404).json({ message: "Daycare not found" });
    }

    const device = getDevice(req);

    await logAudit({
      action: "UPDATE_DAYCARE",
      entityId: daycare._id,
      entityName: `${daycare.name}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "daycare",
      req,
    });

    res.json({
      message: "Daycare updated",
      data: daycare,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= DELETE (SOFT DELETE) =================
const deleteDaycare = async (req, res) => {
  try {
    const daycare = await daycareModel.findById(req.params.id);

    if (!daycare) {
      return res.status(404).json({ message: "Daycare not found" });
    }

    daycare.deletedAt = new Date();
    daycare.isActive = false;
    await daycare.save();

    const device = getDevice(req);

    await logAudit({
      action: "SOFT_DELETE_DAYCARE",
      entityId: daycare._id,
      entityName: `${daycare.name}`, 
      status: "success",
      metadata: {
        time: new Date(),
        device: device.platform,
        deviceId: device.deviceId
      },
      source: "daycare",
      req,
    });

    res.json({ message: "Daycare deleted (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
    createDaycare,
    getAllDaycares,
    getSingleDaycare,
    updateDaycare,
    deleteDaycare,
}