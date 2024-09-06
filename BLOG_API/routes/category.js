const express = require("express");
const validate = require("../validator/validator");
const { isAuth,isAdmin } = require("../middlewares");

const { 
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getSingleCategory,
    userDeleteCategories
} = require("../controller");

const { 
    addCategoryValidator,
    idValidator
} = require("../validator/category");

const router = express.Router();



router.post("/",isAuth,isAdmin,addCategoryValidator,validate,addCategory);


router.put("/:id",isAuth,isAdmin,idValidator,validate,updateCategory);


router.delete("/delete-category",isAuth,userDeleteCategories);


router.delete("/:id",isAuth,isAdmin,idValidator,validate,deleteCategory);


router.get("/",isAuth,getCategory);


router.get("/:id",isAuth,idValidator,validate,getSingleCategory);




module.exports = router;