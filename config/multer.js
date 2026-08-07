// config/multer.js

const multer = require('multer')

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime", 
  "video/webm",
]

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize:  100 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
   if (allowedTypes.includes(file.mimetype)) {
  callback(null, true);
} else {
  callback(
    new Error("Only JPG, PNG, WebP, MP4, MOV, and WebM files are allowed.")
  );
}
  },
})

module.exports = upload