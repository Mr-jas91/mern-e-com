import multer from "multer";
import { Path } from "path";
import { ApiError } from "../../utils/ApiError";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
function filetypes(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        "Invalid file type. Only JPG, JPEG, PNG, GIF files are allowed."
      ),
      false
    );
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    filetypes(file, cb);
  },
}).array("images", 5);

export default upload;
