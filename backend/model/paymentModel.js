
const mongoose = require("mongoose");




const paymentSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    daycareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Daycare",
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "Daycare Fee",
    },

    dueDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "due",
        "pending_confirmation",
        "awaiting_admin",
        "confirmed",
        "paid",
        "overdue",
      ],
      default: "due",
    },

    parentConfirmedAt: Date,
    adminConfirmedAt: Date,

    // ✅ PAYMENT INSTRUCTIONS (MANUAL PAYMENT NOW)
    paymentDetails: {
        bankName: {
            type: String,
            default: "",
        },

        accountName: {
            type: String,
            default: "C & E HOME NURSERY",
        },

        accountNumber: {
            type: String,
            default: "",
        },

        sortCode: {
            type: String,
            default: "",
        },

        referencePrefix: {
            type: String,
            default: "DAYCARE",
        },

        serviceType: {
            type: String,
            default: "",
        },
        },

        // future gateway support
        paymentMethod: {
            type: String,
            enum: ["manual", "card", "transfer"],
            default: "manual",
        },

        reference: {
            type: String,
            default: null,
        },

        notes: String,
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;

