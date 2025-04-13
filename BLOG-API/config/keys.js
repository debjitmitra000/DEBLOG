const dotenv = require("dotenv");

dotenv.config();

const {
    PORT,
    CONNECTION_URL,
    JWT_SECRET_KEY,
    SEND_EMAIL_FROM,
    EMAIL_TEMP_PASSWORD,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env

module.exports = {
    port : PORT,
    connectionUrl : CONNECTION_URL,
    jwtSecretKey: JWT_SECRET_KEY,
    senderEmail : SEND_EMAIL_FROM,
    senderPassword : EMAIL_TEMP_PASSWORD,
    cloudinaryCloudName: CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: CLOUDINARY_API_KEY,
    cloudinaryApiSecret: CLOUDINARY_API_SECRET,
};