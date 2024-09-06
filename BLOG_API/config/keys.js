const dotenv = require("dotenv");

dotenv.config();

const {
    PORT,
    CONNECTION_URL,
    JWT_SECRET_KEY,
    SEND_EMAIL_FROM,
    EMAIL_TEMP_PASSWORD,
    SUPABASE_URL,
    SUPABASE_KEY,
    SUPABASE_BUCKET_NAME,
    SUPABASE_SERVICE_KEY,
} = process.env

module.exports = {
    port : PORT,
    connectionUrl : CONNECTION_URL,
    jwtSecretKey: JWT_SECRET_KEY,
    senderEmail : SEND_EMAIL_FROM,
    senderPassword : EMAIL_TEMP_PASSWORD,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY,
    supabaseBucketName: SUPABASE_BUCKET_NAME,
    supabaseServiceKey: SUPABASE_SERVICE_KEY,
};