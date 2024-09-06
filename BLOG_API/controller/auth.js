const {User,File} = require("../model");
const comparePassword = require("../utils/compare");
const hashedPassword = require("../utils/hashPassword");
const generateCode = require("../utils/generateCode");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendmail");


const signup = async (req,res,next)=>{
    try {
        const {name,email,password,role} = req.body;
        
        const isEmailExist = await User.findOne({email});
        if(isEmailExist){
            res.code = 400;
            throw new Error("Email Already Exists");
        }

        const hashPass = await hashedPassword(password);

        const newUser = new User({name,email,password : hashPass,role});
        await newUser.save();
        res.status(201).json({code:201,status:true,message:"User Signed Up Successfully"});
    } catch (error) {
        next(error);
    }
};

const signin = async(req,res,next)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email}).populate("profilePic");
        if(!user){
            res.code = 401;
            throw new Error("Invalid Crdentials");
        }

        const match = await comparePassword(password,user.password);
        if(!match){
            res.code = 401;
            throw new Error("Invalid Crdentials");
        }

        user.password =undefined
        const token = generateToken(user);

        res.status(200).json({ code: 200, status: true, message: "Successful Signin",data:{token,user}});     
    } catch (error) {
        next(error);
    }
};

const gencode = async (req,res,next)=>{
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.code = 404;
            throw new Error("User Not Found");
        }

        if(user.isVerified){
            res.code = 400;
            throw new Error("User Already Verified");
        }

        const code = generateCode();

        user.varificationCode = code;
        await user.save();

        await sendEmail({
            emailTo: user.email,
            subject: "Email Verification Code",
            code: code,
            content: "Verify Your Accaunt",
            senderName: user.name
        });

        res.status(200).json({code:200,status:true,message:"Verification Code Send To Email"});

    } catch (error) {
        next(error);
    }
};

const verifyemail = async (req,res,next)=>{
    try {
        const {email,code} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.code =404;
            throw new Error("User Not Found");
        }
        if(user.varificationCode !== code){
            res.code =400;
            throw new Error("Invalid Code");
        }

        user.isVerified = true;
        user.varificationCode = null;

        await user.save();

        res.status(201).json({code:201,status:true,message:"User Verified"});

    } catch (error) {
        next(error);
    }
};

const forgotCode = async (req,res,next)=>{
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.code = 404;
            throw new Error("User Not Found");
        }

        const code = generateCode();
        user.recoverCode = code;
        await user.save();

        await sendEmail({
            emailTo: user.email,
            subject: "Forgot Password Code",
            code: code,
            content: "Change Your Password",
            senderName: user.name,
        })

        res.status(200).json({code:200,status:true,message:"Recovery Code Send To Email"});
        
    } catch (error) {
        next(error);
    }
};

const recoverPassword = async (req,res,next)=>{
    try {
        const {email,code,password} =  req.body;

        const user = await User.findOne({email});
        if(!user){
            res.code = 404;
            throw new Error("User Not Found");
        }

        if(code !== user.recoverCode){
            res.code =400;
            throw new Error("Invalid Code");
        }

        const hashPass = await hashedPassword(password);

        user.password = hashPass;
        user.recoverCode = null;

        await user.save();

        res.status(201).json({code:201,status:true,message:"Password Has Been Changed"});


    } catch (error) {
        next(error);
    }
};

const changePassword = async (req,res,next)=>{
    try {
        const{oldPassword,newPassword} = req.body;
        const {_id} = req.user;
        const user = await User.findById(_id);
        if(!user){
            res.code = 404;
            throw new Error("User Not Found");
        }

        const match = comparePassword(oldPassword,user.password);
        if(!match){
            res.code = 400;
            throw new Error("Old Passwond Does Not Match");
        }
        if(oldPassword === newPassword){
            res.code = 400;
            throw new Error("You Are Providing Old Password");
        }

        const hashPassword = await hashedPassword(newPassword);

        user.password = hashPassword;
        await user.save();

        res.status(201).json({code:201,status:true,message:"Password Has Been Changed"});

    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { name, email, profilePic } = req.body;

        if (!name && !email && !profilePic) {
            res.code = 400;
            throw new Error("No Fields Provided To Update");
        }

        const user = await User.findById(_id);
        if (!user) {
            res.code = 404;
            throw new Error("User Not Found");
        }

        if (email && email !== user.email) {
            const emailExist = await User.findOne({ email });
            if (emailExist) {
                res.code = 400;
                throw new Error("Email Already In Use");
            }
        }

        if (name === user.name && email === user.email && profilePic === user.profilePic) {
            res.status(400).json({ code: 400, status: false, message: "No Changes Detected" });
            return;
        }

        if (name) {
            user.name = name;
        }
        if (email && email !== user.email) {
            user.email = email;
            user.isVerified = false; 
        }
        if (profilePic) {
            const file = await File.findById(profilePic);
            if (!file) {
                res.code = 404;
                throw new Error("Profile Picture File Not Found");
            }
            user.profilePic = profilePic;
        }

        await user.save();

        res.status(201).json({
            code:201,
            status:true,message:"Profile Updated Successfully",data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    profilePic: user.profilePic
                }
            }
        });
        
    } catch (error) {
        next(error);
    }
};

const currentUser = async (req,res,next) => {
    try {
        const {_id} = req.user;

        const user = await User.findById(_id).select("-password -varificationCode -recoverCode").populate("profilePic");
        if(!user){
            res.code =404;
            throw new Error("User Not Found");  
        }

        res.status(200).json({code:200,status:true,message:"Current User Found Successfully",data:{user}});


    } catch (error) {
        next(error);
    }
}

const getProfilePic = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const user = await User.findById(_id).populate("profilePic");
        if (!user) {
            res.code = 404;
            throw new Error("User Not Found");
        }

        if (!user.profilePic) {
            res.code = 404;
            throw new Error("Profile Picture Not Found");
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Profile Picture Retrieved Successfully",
            data: {
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
    }
};

const userDelete = async (req, res, next) => {
    try {
        const {_id} = req.user;  
        const user = await User.findById(_id);

        if (user) {
        await User.findOneAndDelete(_id);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Account has been deleted successfully",
        });
        }else{
            res.status(200).json({
                code: 200,
                status: true,
                message: "Not Found",
            });
        }

    } catch (error) {
        console.log(error.message)
        next(error);
    }
}

module.exports = {
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
    userDelete
};

