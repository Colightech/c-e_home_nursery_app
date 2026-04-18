require("dotenv").config();
const jwt = require("jsonwebtoken");


const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "1d",
    }
  );
};


const generateRefreshToken = (admin) => {
  return jwt.sign(
    { 
      id: admin._id,
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_REFRESH_TOKEN,
    { 
      expiresIn: "7d",
    }
  );
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
};