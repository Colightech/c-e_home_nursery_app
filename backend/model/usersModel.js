
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")



const userSchema = new mongoose.Schema(
    {
        firstName: {
            type : String,
            required : true
        },
        lastName: {
            type : String,
            required : true
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true,
            select : false
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
            unique : true
        },
        profilePicture: {
            type: String,
            default: '',
        },
        role: {
        type: String,
        enum: ["super-admin", "admin", "caregiver", "parent"],
        default: "parent",
        },
        permissions: {
            type: [String],
            default: []
        },
        daycareId : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Daycare"
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        verificationOtp : {
            type : String,
            default : '',
        },
        verificationOtpExpiresAt : {
            type : Number,
            default : 0
        },
        otpLastSentAt: { 
            type: Number,
            default: null
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        passwordResetOtp : {
            type : String,
            default : '',
        },
        passwordResetOtpExpiresAt : {
            type : String,
            default : 0
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
    }, 
    { timestamps: true }
);


// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model('User', userSchema);

module.exports = userModel
