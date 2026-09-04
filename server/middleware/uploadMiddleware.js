import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Create Upload Directory
|--------------------------------------------------------------------------
*/

const createUploadDirectory = (folder) => {
  const directory = path.join(
    process.cwd(),
    "uploads",
    folder
  );

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true,
    });
  }

  return directory;
};

/*
|--------------------------------------------------------------------------
| Allowed File Types
|--------------------------------------------------------------------------
*/

const allowedImageTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const allowedVideoTypes = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

/*
|--------------------------------------------------------------------------
| Determine Upload Folder
|--------------------------------------------------------------------------
*/

const getUploadFolder = (req) => {
  if (req.baseUrl.includes("teachers")) {
    return "teachers";
  }

  if (req.baseUrl.includes("announcements")) {
    return "announcements";
  }

  if (req.baseUrl.includes("gallery")) {
    return "gallery";
  }

  if (
    req.baseUrl.includes(
      "student-daily-activities"
    )
  ) {
    return "student-activities";
  }

  return "students";
};

/*
|--------------------------------------------------------------------------
| Determine File Prefix
|--------------------------------------------------------------------------
*/

const getFilePrefix = (req) => {
  if (req.baseUrl.includes("teachers")) {
    return "teacher";
  }

  if (req.baseUrl.includes("announcements")) {
    return "announcement";
  }

  if (req.baseUrl.includes("gallery")) {
    return "gallery";
  }

  if (
    req.baseUrl.includes(
      "student-daily-activities"
    )
  ) {
    return "activity";
  }

  return "student";
};

/*
|--------------------------------------------------------------------------
| Storage Configuration
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getUploadFolder(req);

    cb(
      null,
      createUploadDirectory(folder)
    );
  },

  filename: (req, file, cb) => {
    const prefix = getFilePrefix(req);

    /*
     * Never trust the original filename or extension.
     * Generate the extension from the validated MIME type.
     */

    const extension =
      allowedImageTypes[file.mimetype] ||
      allowedVideoTypes[file.mimetype];

    if (!extension) {
      return cb(
        new Error("Unsupported file type."),
        false
      );
    }

    const uniqueName =
      `${prefix}-${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`;

    cb(null, uniqueName);
  },
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  const isGallery =
    req.baseUrl.includes("gallery");

  const isStudentActivity =
    req.baseUrl.includes(
      "student-daily-activities"
    );

  const isAllowedImage =
    Object.prototype.hasOwnProperty.call(
      allowedImageTypes,
      file.mimetype
    );

  const isAllowedVideo =
    Object.prototype.hasOwnProperty.call(
      allowedVideoTypes,
      file.mimetype
    );

  /*
   * Gallery and Student Daily Activity
   * allow images and videos.
   */

  if (
    isGallery ||
    isStudentActivity
  ) {
    if (
      isAllowedImage ||
      isAllowedVideo
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed."
      ),
      false
    );
  }

  /*
   * Students, Teachers and Announcements
   * allow images only.
   */

  if (isAllowedImage) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, PNG and WEBP images are allowed."
    ),
    false
  );
};

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
|
| Photos:
|   Students
|   Teachers
|   Announcements
|
| Maximum: 10 MB
|
| Gallery / Student Activities:
|   Images / Videos
|
| Maximum: 100 MB
|
|--------------------------------------------------------------------------
*/

const uploadImage = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      100 * 1024 * 1024,
    files: 1,
  },
});

export default uploadImage;