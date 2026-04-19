const mongoose = require("mongoose");


const emergencyContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  relationship: String,
}, { _id: false });


const authorizedContactSchema = new mongoose.Schema({
    name: String,
    address: String,
    relationship: String,
    hasLegalContactRight: {
        type: Boolean,
        default: false,
    },
    details: String,
}, { _id: false });


const medicalInfoSchema = new mongoose.Schema({
  allergies: {
    hasAllergies: { type: Boolean, default: false },
    details: String,
  },

  medicalConditions: {
    hasCondition: { type: Boolean, default: false },
    details: String,
  },

  vaccinationsUpToDate: Boolean,
  vaccinationDetails: String,
}, { _id: false });


const doctorSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
}, { _id: false });


const verificationSchema = new mongoose.Schema({
  birthCertificate: { type: Boolean, default: false },
  parentIdVerified: { type: Boolean, default: false },
  proofOfAddress: { type: Boolean, default: false },
  verifiedBy: String,
  verifiedAt: Date,
}, { _id: false });



const childSchema = new mongoose.Schema(
    {
        firstName: {
            type : String,
            required : true,
        },
        lastName: {
            type : String,
            required : true,
        },
        address: {
            type: String,
            required: true,
        },
        homeLanguage: String,
        pickupPassword: String,
        dateOfBirth: {
            type: String,
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        daycareId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Daycare",
        },

        //Sections
        emergencyContacts: [emergencyContactSchema],

        authorizedContacts: [authorizedContactSchema],

        medicalInfo: medicalInfoSchema,

        doctor: doctorSchema,

        verification: verificationSchema,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Child", childSchema);