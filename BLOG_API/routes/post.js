const express = require("express");
const validate = require("../validator/validator");
const isAuth = require("../middlewares/isAuth");

const { 
    addPost,
    updatePost,
    deletePost,
    getPost,
    getSinglePost,
    userDeletePosts,
} = require("../controller/post");

const { 
    addPostValidator, 
    updatePostValidator,
    idValidator,
} = require("../validator/post");


const router = express.Router();

router.post("/",isAuth,addPostValidator,validate,addPost);

router.put("/:id",isAuth,updatePostValidator,idValidator,validate,updatePost);

router.delete("/delete-posts",isAuth,userDeletePosts);

router.delete("/:id",isAuth,idValidator,validate,deletePost);

router.get("/",isAuth,getPost);

router.get("/:id",isAuth,idValidator,validate,getSinglePost);




module.exports = router;