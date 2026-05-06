

const multer = require("multer");

const storage = multer.memoryStorage();

const uploadLimit = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

module.exports = uploadLimit;