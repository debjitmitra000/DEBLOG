const changePasswordValidator = ({oldPassword, newPassword})=>{
    const errors = {
        oldPassword: "", 
        newPassword: ""
    };


    if (!oldPassword) {
        errors.oldPassword = "Old password is required";
    } 

    if (!newPassword) {
        errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
        errors.newPassword = "Password must be between 6 and 13 characters";
    } else if (newPassword.length > 13) {
        errors.newPassword = "Password must be between 6 and 13 characters";
    } else if (!/[A-Z]/.test(newPassword)) {
        errors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
        errors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
        errors.newPassword = "Password must contain at least one number";
    }

    if(oldPassword && oldPassword === newPassword){
        errors.newPassword = "You are providing old password";
    }

    return errors
}

export default changePasswordValidator;