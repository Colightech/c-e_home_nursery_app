require("dotenv").config();
const jwt = require("jsonwebtoken");


const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "1d",
    }
  );
};


const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      email: user.email,
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