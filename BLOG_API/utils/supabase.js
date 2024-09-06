const supabase = require('../init/supabase');
const generate12code = require('../utils/generate12code');
const { supabaseBucketName } = require('../config/keys');

const uploadFileToSupabase = async ({ file, ext }) => {
  const fileName = `${generate12code()}_${Date.now()}${ext}`;
  const { error } = await supabase.storage
    .from(supabaseBucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error('Error Uploading File:', error);
    return null;
  }

  return fileName;
};

const generateSignedurl = async (fileName)=>{
  const { data,error } = await supabase.storage
  .from(supabaseBucketName)
  .createSignedUrl(fileName,60);

  if (error) {
    console.error('Error Generating Signed Url:', error);
    return null;
  }

  return data.signedUrl
}

const deleteFileFromSupabase = async (fileName) =>{
  const { data,error } = await supabase.storage
  .from(supabaseBucketName)
  .remove([fileName]);

  if (error) {
    console.error('Error Deleting File:', error);
    return null;
  }

  return data;
}

module.exports = { uploadFileToSupabase,generateSignedurl,deleteFileFromSupabase };
