const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, //NOTE: The "unique" property in a Mongoose Schema is used to ensure that there CANNOT be duplicate documents with the same value for this property (Here, it would refer to the username - In other words, there CANNOT be two documents with the same username) --> If there is an attempt to create a document with the same value as an existing one in the collection already, Mongoose will throw an error and we MUST capture that error to instruct the user about it (The error code for a duplicate key i MongoDB is "11000" --> Therefore, in our error handling we would do something like: if(error.code === 11000){console.error("Duplicate key error:", error.message)} )
    },
    hashedPassword: {
        type: String,
        required: true,
    },
});

//Removing Hashed Password from Response with the set() method and the "toJSON" option
    //Here, the set() method takes two arguments: 1.Key (String) - The option's name to set, 2.Value (Object) = The option's value we want to set --> The option name refers to the specific option we are configuring for the schema and in this case, we are configuring "toJSON" which is an option that allows us to define a custom transformation for when a document is converted to JSON 
        //The Value (Object) will have the property "transform" and this property takes a callback function with two arguments: 1.The original document from the database, 2.What is RETURNED when the fucntion is run
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword; //Here, we indicate that we want to delete the "hashedPassword" field from the document we are fetching from the database BEFORE it returns via res.json({user});
    }
});


//Model
const User = mongoose.model("User", userSchema);

//Export
module.exports = User;