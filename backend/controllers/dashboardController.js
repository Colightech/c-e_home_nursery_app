
require("dotenv").config();
const usersModel = require("../model/usersModel");
const childModel = require("../model/childModel");




const getAdminStats = async (req, res) => {
  try {
    // total users
    const totalUsers = await usersModel.countDocuments({ isActive: true });

    // total children
    const totalChildren = await childModel.countDocuments();

    // caregivers only
    const caregivers = await usersModel.countDocuments({
      role: "caregiver",
      isActive: true,
    });

    // admins (optional if needed later)
    const admins = await usersModel.countDocuments({
      role: "admin",
      isActive: true,
    });

    // revenue (mock for now)
    const revenue = 0;
    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        children: totalChildren,
        caregivers,
        admins,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


const getAllChildren = async (req, res) => {
  try {
    const children = await childModel.find().select("-password"); // don’t return password

    res.status(200).json({
      success: true,
      count: children.length,
      children,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try { 
    const user = await usersModel.find().select("-password");
    if(!user) {
      return res.status(401).json({
        error : true,
        message: "No user found"
      })
    }
    res.status(200).json({
      success: true,
      data: user
    })
  } catch(error) {
    console.log("getAllUsers failed", error);
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}


const getAllParents = async (req, res) => {
  try { 
    const parents = await usersModel.find({ role: "parent"});
    if(!parents) {
      return res.status(401).json({
        error : true,
        message: "No parent found"
      })
    }
    res.status(200).json({
      success: true,
      data: parents
    })
  } catch(error) {
    console.log("getAllParents failed", error);
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}


const getAllCaregivers = async (req, res) => {
  try { 
    const caregivers = await usersModel.find({ role: "caregiver"});
    if(!caregivers) {
      return res.status(401).json({
        error : true,
        message: "No caregiver found"
      })
    }
    res.status(200).json({
      success: true,
      data: caregivers
    })
  } catch(error) {
    console.log("getAllCaregivers failed", error);
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}




module.exports = {
    getAdminStats,
    getAllChildren,
}

