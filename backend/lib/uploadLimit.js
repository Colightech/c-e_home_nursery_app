

const multer = require("multer");
const path = require("path");
const fs = require("fs");



// const storage = multer.memoryStorage();

// const uploadLimit = multer({
//   storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // 100MB limit
//   },
// });

// module.exports = uploadLimit;




const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  },
});

const uploadLimit = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});


module.exports = uploadLimit;