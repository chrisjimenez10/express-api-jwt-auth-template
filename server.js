//Import
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const testJWTRouter = require("./controllers/test-jwt.js");
const usersRouter = require("./controllers/users.js");
const profilesRouter = require("./controllers/profiles.js");

//Connect to MongoDB Database
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/test-jwt", testJWTRouter);
app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);

//Server
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});