//Import
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

//Variables
    //Length of Salt String
const SALT_LENGTH = 12;


router.post("/signup", async (req, res) => {
    try{
        //First, we CHECK if username is already taken
        const userInDatabase = await User.findOne({username: req.body.username});
        if(userInDatabase){
            return res.status(400).json({error: "Username already taken"});
        }
        //Next, we CREATE a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
        });
        const token = jwt.sign({username: user.username, _id: user._id}, process.env.JWT_SECRET);
        res.status(201).json({user, token});
    }catch(error){
        res.status(400).json({error: error.message});
    }    
});

router.post("/signin", async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        //NOTE: Here, we are using the logic if "user" exists in the database and if the comparison of the provided password is EQUAL to the encrypted/hashed password in the databse for that user that we found (matched the username provided) to respond with a successful authorization message
        if(user && bcrypt.compareSync(req.body.password, user.hashedPassword)){ //The compareSync() method takes two arguments: 1.The provided password, 2.The password form the user object stored in our databse (password is "hashed" or encrypted)
            const token = jwt.sign({username: user.username, _id: user._id}, process.env.JWT_SECRET);
            res.status(200).json({token});
        }else{
            res.status(401).json({error: "Invalid username or password"});
        }
    }catch(error){
        res.status(400).json({error: error.message});
    }
});


//Export
module.exports = router;