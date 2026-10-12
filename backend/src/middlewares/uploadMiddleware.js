import multer from "multer";
import path from "path";

// 1. Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // upload file path
  },
  filename: (req, file, cb) => {
    // timestamp for make a file uniqe
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 2. File filter (Security) - PDF, Docs, Images 
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images, PDFs and Docx files are allowed!"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter
});