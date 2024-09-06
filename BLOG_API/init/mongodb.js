const mongoose = require("mongoose");
const {connectionUrl} = require("../config/keys")

const connectMongoDb = async()=>{
    try {
        await mongoose.connect(connectionUrl);
        console.log(`Database Connected`)
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectMongoDb;