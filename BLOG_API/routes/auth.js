const express = require("express");
const validate = require("../validator/validator");
const {isAuth} = require("../middlewares");

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
    userDelete
} = require("../controller");

const {
    signUpValidator,
    signInValidator,
    sendCodeValidator,
    emailVerifyValidator,
    recoverPasswordValidator,
    changePasswordValidator,
    updateProfileValidator
} = require("../validator/auth");

const router = express.Router();




router.post("/signup",signUpValidator,validate,signup);


router.post("/signin",signInValidator,validate,signin);


router.post("/send-verification-code",sendCodeValidator,validate,gencode);


router.post("/verify-email",emailVerifyValidator,validate,verifyemail);


router.post("/forgot-password-code",sendCodeValidator,validate,forgotCode);


router.post("/recover-password",recoverPasswordValidator,validate,recoverPassword);


router.put("/change-password",isAuth,changePasswordValidator,validate,changePassword);


router.put("/update-profile",isAuth,updateProfileValidator,validate,updateProfile);


router.get("/current-user",isAuth,currentUser);


router.get("/profile-pic", isAuth, getProfilePic);


router.delete("/delete-account",isAuth,userDelete);

module.exports = router;