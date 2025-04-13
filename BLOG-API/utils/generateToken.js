const jwt = require('jsonwebtoken');
const {jwtSecretKey} = require("../config/keys")

const generateToken = (user)=>{
    const token = jwt.sign(
        {
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        },jwtSecretKey,{expiresIn:"7d"}
    );
    return token;
}

module.exports = generateToken;