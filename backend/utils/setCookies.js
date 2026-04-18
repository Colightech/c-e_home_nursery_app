const {generateAccessToken, generateRefreshToken} = require("./generateToken");


const setCookies = (res, admin) => {

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

   // Access Token (short)
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // ✅ prevents XSS
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
  });

  
  // Refresh Token (long)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // ✅ prevents XSS
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

module.exports = setCookies;