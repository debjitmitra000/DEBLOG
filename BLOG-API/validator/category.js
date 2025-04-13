const {check,param} = require("express-validator");
const mongoose = require("mongoose");

const addCategoryValidator = [
    check("title")
    .notEmpty()
    .withMessage("Title Is Required"),
];

const idValidator = [
    param("id").custom(async (id)=>{
        if(id && !mongoose.Types.ObjectId.isValid(id)){
            throw "Invalid Category Id"
        }
    })
]

module.exports = {
    addCategoryValidator,
    idValidator
}