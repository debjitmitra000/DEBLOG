const express = require("express");
const { isAuth,upload } = require("../middlewares");
const { uploadFile, getSignedUrl, deleteFile, userDeleteFiles } = require("../controller");

const router = express.Router();


router.post("/upload-file",isAuth,upload.single("image"),uploadFile);


router.get("/signed-url/:fileName",isAuth,getSignedUrl);


router.delete("/delete-files",isAuth,userDeleteFiles);


router.delete("/delete-file/:fileName",isAuth,deleteFile);


module.exports = router;
