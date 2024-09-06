const notFound = require("./notfound");

const {
    signup,
    signin,
    gencode,
    verifyemail,
    forgotCode,
    recoverPassword,
    changePassword,
    updateProfile,
    currentUser,
    getProfilePic,
    userDelete,
} = require("./auth");


const { 
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getSingleCategory,
    userDeleteCategories
} = require("./category");


const { 
    uploadFile,
    getSignedUrl,
    deleteFile,
    userDeleteFiles,
} = require("./file");


const { 
    addPost,
    updatePost,
    deletePost,
    getPost,
    getSinglePost,
    userDeletePosts,
} = require("./post")



module.exports = {

    //auth
    notFound,
    signup,
    signin,
    gencode,
    verifyemail,
    forgotCode,
    recoverPassword,
    changePassword,
    updateProfile,
    currentUser,
    getProfilePic,
    userDelete,

    //category
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getSingleCategory,
    userDeleteCategories,

    //file
    uploadFile,
    getSignedUrl,
    deleteFile,
    userDeleteFiles,

    //post
    addPost,
    updatePost,
    deletePost,
    getPost,
    getSinglePost,
    userDeletePosts
}