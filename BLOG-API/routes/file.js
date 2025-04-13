const express = require("express");
const { isAuth, upload } = require("../middlewares");
const { uploadFile, getSignedUrl, deleteFile, userDeleteFiles } = require("../controller");

const router = express.Router();

router.post("/upload-file", isAuth, upload.single("image"), uploadFile);
router.get("/file-url/:fileId", isAuth, getSignedUrl);
router.delete("/delete-files", isAuth, userDeleteFiles);
router.delete("/delete-file/:fileId", isAuth, deleteFile);

module.exports = router;