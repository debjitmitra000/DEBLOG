const { File, Category, Post } = require("../model");

const addPost = async (req, res, next) => {
    try {
        const { title, description, content, file, category } = req.body;
        const { _id } = req.user;
        
        if (file) {
            const isFileExist = await File.findById(file);
            if (!isFileExist) {
                res.code = 404;
                throw new Error("File Not Found");
            }
        }

        const isCategoryExist = await Category.findById(category)
        if (!isCategoryExist) {
            res.code = 404;
            throw new Error("Category Not Found");
        }

        const newPost = new Post({
            title,
            description,
            content,
            file,
            category,
            updatedBy: _id,
        })

        await newPost.save();

        res.status(201).json({ code: 201, status: true, message: "Post Added Successfully" });

    } catch (error) {
        next(error);
    }
}

const updatePost = async (req, res, next) => {
    try {
        const { title, description, content, file, category } = req.body;
        const { id } = req.params;
        const { _id } = req.user;
        
        if (file) {
            const isFileExist = await File.findById(file);
            if (!isFileExist) {
                res.code = 404;
                throw new Error("File Not Found");
            }
        }

        const isCategoryExist = await Category.findById(category)
        if (!isCategoryExist) {
            res.code = 404;
            throw new Error("Category Not Found");
        }

        const post = await Post.findById(id);
        if (!post) {
            res.code = 404;
            throw new Error("Post Not Found");
        }

        post.title = title ? title : post.title;
        post.description = description;
        post.content = content ? content : post.content;
        post.file = file;
        post.category = category ? category : post.category;
        post.updatedBy = _id;

        await post.save();

        res.status(200).json({ code: 200, status: true, message: "Post Updated Successfully", data: { post } });

    } catch (error) {
        next(error);
    }
}

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            res.code = 404;
            throw new Error("Post Not Found");
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ code: 200, status: true, message: "Post Deleted Successfully" });

    } catch (error) {
        next(error);
    }
}

const getPost = async (req, res, next) => {
    try {
        const { page, search, category } = req.query;

        let query = {};
        if (search) {
            const Search = RegExp(search, "i");
            query = { $or: [{ title: Search }, { description: Search }, { content: Search }] };
        }

        if (category) {
            query = { ...query, category };
        }

        const pageNo = parseInt(page) || 1;
        const sizeNo = 12;

        const totalResult = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalResult / sizeNo);

        const posts = await Post.find(query)
            .populate("file")
            .populate("category")
            .populate("updatedBy", "-password -recoverCode -varificationCode")
            .skip((pageNo - 1) * sizeNo)
            .limit(sizeNo)
            .sort({ _id: -1 });

        res.status(200).json({ 
            code: 200, 
            status: true, 
            message: "Posts Fetched Successfully", 
            data: { posts, totalResult, totalPages, page } 
        });

    } catch (error) {
        next(error);
    }
}

const getSinglePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id)
            .populate("file")
            .populate("category")
            .populate("updatedBy", "-password -recoverCode -varificationCode");
            
        if (!post) {
            res.code = 404;
            throw new Error("Post Not Found");
        }
        
        res.status(201).json({ 
            code: 201, 
            status: true, 
            message: "Post Fetched Successfully", 
            data: { post } 
        });
        
    } catch (error) {
        next(error);
    }
}

const userDeletePosts = async (req, res, next) => {
    try {
        const { _id } = req.user;  
        const posts = await Post.find({ updatedBy: _id });

        if (posts.length > 0) {
            await Post.deleteMany({ updatedBy: _id });

            res.status(200).json({
                code: 200,
                status: true,
                message: "All posts created by the user have been deleted successfully",
            });
        } else {
            res.status(200).json({
                code: 200,
                status: true,
                message: "No posts",
            });
        }

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    addPost,
    updatePost,
    deletePost,
    getPost,
    getSinglePost,
    userDeletePosts
}