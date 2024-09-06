const recoverPasswordValidator = ({email, code, password})=>{
    const errors = {
        oldPassword: "", 
        newPassword: ""
    };


    if (!email) {
        errors.email = "Email is required";
    } 

    if (!code) {
        errors.code = "Code is required";
    } 

    if (!password) {
        errors.password = "New password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be between 6 and 13 characters";
    } else if (password.length > 13) {
        errors.password = "Password must be between 6 and 13 characters";
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number";
    }

    return errors
}

export default recoverPasswordValidator;