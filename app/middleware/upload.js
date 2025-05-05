const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only certain file types
// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png|pdf/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, JPEG, JPG, and PNG files are allowed"));
//   }
// };
const fileFilter = (req, file, cb) => {
  cb(null, true); // Accept all file types
};

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// }).array("document", 5);

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).any()

module.exports = upload;


// File filter to allow only certain file types
// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png|pdf/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, JPEG, JPG, and PNG files are allowed"));
//   }
// };


