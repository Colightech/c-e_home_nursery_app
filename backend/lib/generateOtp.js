const crypto = require("crypto");

function generateOtp() {
    
    const otp = crypto.randomBytes(32).toString("hex");
    return otp;
}

module.exports = generateOtp;