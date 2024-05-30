const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/sign-token", (req, res)=>{
    //Mock user object
    const user = {
        _id: 1,
        username: "test",
        password: "test",
    };

    //Creating a token using the sign() method
        //The sign() method takes in three arguments: 1.Payload (JSON Object), 2.Secret Key (String stored in environmental variable), 3.Options Object (Information specifying how to create JWT - type of algorithm, expiration time, etc.)
    const token = jwt.sign({user}, process.env.JWT_SECRET);

    //Send the token BACk to the client
    res.json({token});

});

router.post("/verify-token", (req, res)=>{
    try{
            //We can access the token from the request object - It is found in req.headers.authorization
        //The returned JSON Object has the word "Bearer" before the actual token, but we need ONLY the token and not the word "Bearer" so we can use it in the verify() method correctly - Therefore, we need to use the split() method to extract only the actual token value --> NOTE: split(separator, limit) method works by taking the string and converting it into an array with elements being created based upon the kind of separator we indicate (which matches how the string's unique elements are being separated from each other - It can be through commas, dashes, periods, or simply spaces) --> Here, the string is separated by a space so we include quotations and a space between them inside as the argument for the split() method, and since the token value is the second element of the newly formed array, we choose the index position of [1]
    const token = req.headers.authorization.split(" ")[1];
    //Using the verify() method
        //The verify() method takes three arguments: 1.token , 2.secret key , 3.options object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({decoded}); //The return value of the verify() method is the payload that was used in CREATING the token itself - Here, it returns the mock user data we used to create the JWT
    }catch(error){
        res.status(401).json({error: "Invalid Token"}); //If the token is invalid, the method will throw an error
    }

});

module.exports = router;