const {check,param} = require("express-validator");
const mongoose = require("mongoose");

const addPostValidator = [
    check("title")
    .notEmpty()
    .withMessage("Title Is Required"),

    check("content")
    .notEmpty()
    .withMessage("Content Is Required"),

    check("file")
    .custom(async (file)=>{
        if(file && !mongoose.Types.ObjectId.isValid(file)){
            throw "Invalid File Id";
        }
    }),

    check("category")
    .notEmpty()
    .withMessage("Category Is Required")
    .custom(async (category)=>{
        if(category && !mongoose.Types.ObjectId.isValid(category)){
            throw "Invalid File Id";
        }
    }),
];

const updatePostValidator = [
    check("file")
    .custom(async (file)=>{
        if(file && !mongoose.Types.ObjectId.isValid(file)){
            throw "Invalid File Id";
        }
    }),

    check("category")
    .custom(async (category)=>{
        if(category && !mongoose.Types.ObjectId.isValid(category)){
            throw "Invalid File Id";
        }
    }),
];

const idValidator = [
    param("id").custom(async(id)=>{
        if(id && !mongoose.Types.ObjectId.isValid(id)){
            throw "Invalid Post Id"
        }
    })
]

module.exports = {
    addPostValidator,
    updatePostValidator,
    idValidator,
}