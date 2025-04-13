const {check,body} =require("express-validator");

const signUpValidator = [
    check("name")
    .notEmpty()
    .withMessage("Name Is Required"),


    check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),


    check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({min:6,max:13})
    .withMessage("Password Must Be Between 6 To 13 Charecters")
    .matches(/[A-Z]/)
    .withMessage("Password Must Contain At Least One Uppercase Letter")
    .matches(/[a-z]/)
    .withMessage("Password Must Contain At Least One Lowercase Letter")
    .matches(/[0-9]/)
    .withMessage("Password Must Contain At Least One Number")
];

const signInValidator = [
    check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),


    check("password")
    .notEmpty()
    .withMessage("Password Is Required")
];

const sendCodeValidator = [
    check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),
];

const emailVerifyValidator = [
    check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),

    check("code")
    .notEmpty()
    .withMessage("Verification Code Is Required")
];

const recoverPasswordValidator = [
    check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),

    check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({min:6,max:13})
    .withMessage("Password Must Be Between 6 To 13 Charecters")
    .matches(/[A-Z]/)
    .withMessage("Password Must Contain At Least One Uppercase Letter")
    .matches(/[a-z]/)
    .withMessage("Password Must Contain At Least One Lowercase Letter")
    .matches(/[0-9]/)
    .withMessage("Password Must Contain At Least One Number")
]

const changePasswordValidator = [
    check("oldPassword")
    .notEmpty()
    .withMessage("Password Is Required"),

    check("newPassword")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({min:6,max:13})
    .withMessage("Password Must Be Between 6 To 13 Charecters")
    .matches(/[A-Z]/)
    .withMessage("Password Must Contain At Least One Uppercase Letter")
    .matches(/[a-z]/)
    .withMessage("Password Must Contain At Least One Lowercase Letter")
    .matches(/[0-9]/)
    .withMessage("Password Must Contain At Least One Number")
]

const updateProfileValidator = [
    body().custom(value => {
        if (!value.name && !value.email && !value.profilePic) {
            throw new Error("At Least One Of 'Name' Or 'Email' Or 'Profile Picture' Must Be Provided");
        }
        return true;
    }),

    check("name")
    .optional()
    .notEmpty()
    .withMessage("Name Cannot Be Empty"),

    check("email")
    .optional()
    .notEmpty()
    .withMessage("Email Cannot Be Empty")
    .isEmail()
    .withMessage("Not A Valid Email"),

    check("profilePic")
    .optional()
    .notEmpty()
    .withMessage("Profile Picture Cannot Be Empty")
    .isMongoId()
    .withMessage("Profile Picture Must Be A Valid ID")
]

module.exports = {
    signUpValidator,
    signInValidator,
    sendCodeValidator,
    emailVerifyValidator,
    recoverPasswordValidator,
    changePasswordValidator,
    updateProfileValidator
};