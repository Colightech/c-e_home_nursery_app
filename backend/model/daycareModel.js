const mongoose = require("mongoose");


const daycareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);


const daycareModel = mongoose.model("Daycare", daycareSchema);


module.exports = daycareModel;