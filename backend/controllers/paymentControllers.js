
const childModel = require("../model/childModel");
const paymentModel = require("../model/paymentModel");






// CREATE PAYMENT (Admin)
const createPayment = async (req, res) => {
  try {
    const { childId, amount, description, dueDate, bankName, 
        accountName, accountNumber, sortCode, serviceType } = req.body;

    const child = await childModel.findById(childId);
    if(!child) {
        return res.status(404).json({
            error: true,
            message: "Child not found",
        })
    }
 
    const payment = await paymentModel.create({
      childId: child._id,
      parentId: child.parentId,
      daycareId: child.daycareId,
      amount,
      description,
      dueDate,
      status: "due",
      
      paymentDetails: {
        bankName,
        accountName,
        accountNumber,
        sortCode,
        referencePrefix: "DAYCARE",
        serviceType: "",
      },
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log("ERROR CREATING PAYMENT", error.message);
    res.status(500).json({
        error: true,
        message: error.message,
    });
  }
};



const parentConfirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentModel.findById(paymentId);

    if (!payment) {
        return res.status(404).json({ 
            error: true,
            message: "Payment not found",
        });
    }

    payment.status = "awaiting_admin";
    payment.parentConfirmedAt = new Date();

    await payment.save();

    // notify admin (socket optional)
    const io = req.app.get("io");
    io.emit("admin_payment_alert", payment);

    res.json({
      success: true,
      message: "Payment submitted for admin review",
      payment,
    });
  } catch (error) {
    res.status(500).json({ 
        error: true,
        message: error.message,
    });
  }
};



const adminConfirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentModel.findById(paymentId);

    if (!payment) {
        return res.status(404).json({ 
            error: true,
            message: "Payment not found",
        });
    }

    payment.status = "paid";
    payment.adminConfirmedAt = new Date();

    await payment.save();

    // notify parent
    const io = req.app.get("io");
    io.emit("payment_confirmed", payment);

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ 
        error: true,
        message: error.message,
    });
  }
};



const getParentPayments = async (req, res) => {
  try {
    const parentId = req.user._id;

    const payments = await paymentModel.find({ parentId })
      .populate("childId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({ 
        error: true,
        message: error.message,
    });
  }
};



const getAllPayments = async (req, res) => {
  try {

    const payments = await paymentModel.find()
      .populate("childId")
      .populate("parentId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });

  } catch (error) {

    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};



module.exports = {
    createPayment,
    parentConfirmPayment,
    adminConfirmPayment,
    getParentPayments,
    getAllPayments,
}













