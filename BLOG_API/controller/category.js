const { Category, User } = require("../model");

const addCategory = async(req,res,next)=>{
    try {
        const{title,description} = req.body;
        const {_id} = req.user;

        const isCategoryExist = await Category.findOne({title});
        if(isCategoryExist){
            res.code = 400;
            throw new Error("Category Already Exists");
        }


        const user = await User.findById(_id);
        if(!user){
            res.code = 404;
            throw new Error("User Not Found");
        }

        const newCategory = new Category({title,description,updatedBy: _id});

        await newCategory.save();

        res.status(201).json({code: 201,status: true, message: "Category Added Successfully"})

    } catch (error) {
        next(error);
    }
}

const updateCategory = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const{_id} = req.user;
        const {title,description} = req.body;

        const category = await Category.findById(id);
        if(!category){
            res.code = 404;
            throw new Error("Category Not Found");
        }

        const isCategoryExist = await Category.findOne({title})
        if(isCategoryExist && String(isCategoryExist._id) !== String(category._id)){
            res.code = 400;
            throw new Error("Title Already Exists");
        }

        category.title = title ? title : category.title;
        category.description = description;
        category.updatedBy = _id;

        await category.save();

        res.status(200).json({code: 200,status: true, message: "Category Updated Successfully", data:{category}})

    } catch (error) {
        next(error);
    }
}

const deleteCategory = async (req,res,next)=>{
    try {
        const {id} = req.params;

        const  category = await Category.findById(id);
        if(!category) {
            res.code = 404;
            throw new Error("Category Not Found");
        }
    
        await Category.findByIdAndDelete(id);

        res.status(200).json({code: 200,status: true, message: "Deleted Successfully"});

    } catch (error) {
        next(error);
    }
}

const getCategory = async (req,res,next)=>{
    try {
        const {page,search,size} = req.query;

        let query = {};
        if(search){
            const Search = RegExp(search,"i");
            query = {$or: [{title: Search},{description: Search}]};
        }

        const pageNo = parseInt(page) || 1;
        const sizeNo = parseInt(size) || 10;

        const totalResult = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalResult/sizeNo);

        const categories = await Category.find(query).skip((pageNo-1)*sizeNo).limit(sizeNo).sort({_id: -1});

        res.status(200).json({code: 200,status: true, message: "Categories Fetched Successfully",data:{categories,totalResult,totalPages,page}});

    } catch (error) {
        next(error);
    }
}

const getSingleCategory = async (req,res,next)=>{
    try {
        const {id} = req.params;

        const category = await Category.findById(id);
        if(!category){
            res.code = 404;
            throw new Error("Category Not Found");
        }
        
        res.status(201).json({code: 201,status: true, message: "Category Fetched Successfully",data:{category}})
        
    } catch (error) {
        next(error);
    }
}

const userDeleteCategories = async (req, res, next) => {
    try {
        const {_id} = req.user;  
        const categories = await Category.find({ updatedBy: _id });

        if (categories.length > 0) {
        await Category.deleteMany({ updatedBy: _id });

        res.status(200).json({
            code: 200,
            status: true,
            message: "All categories created by the user have been deleted successfully",
        });
        }else if(Category.length === 0){
            res.status(200).json({
                code: 200,
                status: true,
                message: "No Category",
            });
        }

    } catch (error) {
        console.log(error.message)
        next(error);
    }
}

module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getSingleCategory,
    userDeleteCategories
}