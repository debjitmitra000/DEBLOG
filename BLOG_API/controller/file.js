const path = require("path");
const { validateExtension } = require("../validator/file");
const { 
  uploadFileToSupabase,
   generateSignedurl, 
   deleteFileFromSupabase 
} = require("../utils/supabase");
const { File } = require("../model");

const uploadFile = async (req,res,next) => {
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

    const key = await uploadFileToSupabase({ file, ext });
    if (!key) {
      res.code = 500;
      throw new Error("File upload failed");
    }

    const newFile = new File({
      id: key,
      size: file.size,
      mimetype: file.mimetype,
      createdBy: req.user._id,
    });

    await newFile.save();

    res.status(201).json({code: 201,status: true,message: "File Uploaded Successfully",data: { key, _id: newFile._id },
    });

  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async(req,res,next)=>{
  try {
    const { fileName } = req.params;
    if (!fileName) {
      res.code = 400;
      throw new Error("File name is required");
    }

    const signedUrl = await generateSignedurl(fileName);
    if (!signedUrl) {
      res.code = 500;
      throw new Error("File name is required");
    }
    res.status(200).json({code: 200,status: true,message: "Signed Url Generated Successfully",data: {signedUrl},
    });

  } catch (error) {
    next(error);
  }
};

const deleteFile = async(req,res,next)=>{
  try {
    const { fileName } = req.params;
    if (!fileName) {
      res.code = 400;
      throw new Error("File name is required");
    }
    const deleteFile = await deleteFileFromSupabase(fileName);
    if (!deleteFile) {
      res.code = 500;
      throw new Error("Failed to delete file");
    }

    await File.findOneAndDelete({id:fileName});

    res.status(200).json({code: 200,status: true,message: "File Deleted Successfully"});

  } catch (error) {
    next(error);
  }
};

const userDeleteFiles = async (req, res, next) => {
  try {
      const {_id} = req.user;  
      const files = await File.find({ createdBy: _id });
      console.log(files)

      if (files.length > 0) {
        for (const file of files) {
          const deleteFromSupabase = await deleteFileFromSupabase(file.id);
          if (!deleteFromSupabase) {
            res.code = 500;
            throw new Error(`Failed to delete file with ID: ${file.id} from Supabase`);
          }
        }
      await File.deleteMany({ createdBy: _id });

      res.status(200).json({
          code: 200,
          status: true,
          message: "All files created by the user have been deleted successfully",
      });
      }else if(files.length === 0){
        res.status(200).json({
            code: 200,
            status: true,
            message: "No files",
        });
      }

  } catch (error) {
      console.log(error.message)
      next(error);
  }
}

module.exports = { 
  uploadFile,
  getSignedUrl,
  deleteFile,
  userDeleteFiles 
};
