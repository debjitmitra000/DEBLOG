const path = require("path");
const { validateExtension } = require("../validator/file");
const { 
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} = require("../utils/handleCloudinary");
const { File } = require("../model");

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      res.code = 400;
      throw new Error("File is not selected");
    }

    const ext = path.extname(file.originalname);
    const isValidExt = validateExtension(ext);
    if (!isValidExt) {
      res.code = 400;
      throw new Error("Only .jpg Or .jpeg Or .png Format Is Allowed");
    }

    const uploadResult = await uploadFileToCloudinary({ file });
    if (!uploadResult) {
      res.code = 500;
      throw new Error("File upload failed");
    }

    const newFile = new File({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      format: uploadResult.format,
      size: file.size,
      mimetype: file.mimetype,
      createdBy: req.user._id,
    });

    await newFile.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "File Uploaded Successfully",
      data: { 
        public_id: uploadResult.public_id, 
        url: uploadResult.url,
        _id: newFile._id 
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async(req, res, next) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      res.code = 400;
      throw new Error("File ID is required");
    }
    
    const file = await File.findById(fileId);
    if (!file) {
      res.code = 404;
      throw new Error("File not found");
    }
    
    // Change this to return signedUrl instead of url
    res.status(200).json({
      code: 200,
      status: true,
      message: "URL Generated Successfully",
      data: { signedUrl: file.url }, // Return as signedUrl to match frontend expectations
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async(req, res, next) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      res.code = 400;
      throw new Error("File ID is required");
    }

    const file = await File.findById(fileId);
    if (!file) {
      res.code = 404;
      throw new Error("File not found");
    }

    const deleteResult = await deleteFileFromCloudinary(file.public_id);
    if (!deleteResult) {
      res.code = 500;
      throw new Error("Failed to delete file from Cloudinary");
    }

    await File.findByIdAndDelete(fileId);

    res.status(200).json({
      code: 200,
      status: true,
      message: "File Deleted Successfully"
    });
  } catch (error) {
    next(error);
  }
};

const userDeleteFiles = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const files = await File.find({ createdBy: _id });

    if (files.length > 0) {
      for (const file of files) {
        const deleteResult = await deleteFileFromCloudinary(file.public_id);
        if (!deleteResult) {
          console.warn(`Failed to delete file with public_id: ${file.public_id} from Cloudinary`);
          // Continue with the rest even if one fails
        }
      }
      
      await File.deleteMany({ createdBy: _id });

      res.status(200).json({
        code: 200,
        status: true,
        message: "All files created by the user have been deleted successfully",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: true,
        message: "No files",
      });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  uploadFile,
  getSignedUrl,
  deleteFile,
  userDeleteFiles
};