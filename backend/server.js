require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/dbConnection");
const cookieParser = require("cookie-parser");



const port = process.env.PORT || 5000;

const app = express();


app.set("trust proxy", true);


app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.get("/", (req, res) => {
    res.send(`Testing express server on port ${port}`)
})



// app.use("/api/admin", authRoute);



const runServer = async () => {
    try {
        // Database Connection
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.log("Database connection error", error.message);
        process.exit(1);
    }
}

runServer();