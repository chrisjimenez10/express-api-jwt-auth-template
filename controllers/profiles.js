const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        //NOTE: This conditional comparison checks if the "id" of the user that was authenticated MATCHES the user "id" that created a particular resource - This is very helpful in setting restrictions to resources (i.e. only users that created a particular resource can gain access to their own resource, no one else)  
        if(req.user._id !== req.params.userId){
            return res.status(401).json({error: "Unauthorized"})
        }
        res.json({user});
    }catch(error){
        if (res.statusCode === 404){
            res.status(404).json({error: error.message});
        }else{
            res.status(500).json({error: error.message});
        }
    }
});

module.exports = router;