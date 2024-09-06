const isEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
const signupValidator = ({name,email,password,confirmPassword})=>{
    const errors = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    if (!name) {
        errors.name = "Name is required";
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!isEmail(email)) {
        errors.email = "Invalid email";
    }

    if (!password) {
        errors.password = "Password is required";
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

    if (password !== confirmPassword) {
        errors.confirmPassword = "Password doesn't match";
    }

    return errors
}

export default signupValidator;