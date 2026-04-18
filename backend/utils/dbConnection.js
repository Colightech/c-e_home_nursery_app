
require("dotenv").config()
const mongoose = require("mongoose")

//  VERY IMPORTANT (put here)
mongoose.set("bufferCommands", false);

const connectDB = async () => {
    
    try {
        const conn = await mongoose.connect(process.env.MOGODB_URL)
        console.log(`connected to database @ ${conn.connection.host}`)
    } catch (error) {
        console.log("error connecting with database", error.message);
        process.exit(1);
    }
}

module.exports = connectDB