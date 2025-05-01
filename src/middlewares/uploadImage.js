import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
   "image/jpeg", "image/png", "image/jpg",
   "icon/jpeg", "icon/png", "icon/jpg",
   "video/mp4", "video/avi", "video/mov","application/pdf"
  ]

  if (file.fieldname === "image" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "cv" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "videoOrPhotos" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "tubeImage" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "medicalFiles" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if(file.fieldname === "photo" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if(file.fieldname === "icon" && allowedTypes.includes(file.mimetype)) {
    cb(null, true);   
  } else {
    cb(new Error("Invalid file type. Only images (JPEG, PNG, JPG) and videos (MP4, MOV, AVI) and PDFs are allowed."));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

export default upload;