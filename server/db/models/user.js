const mongoose = require('mongoose');


const user = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
    },
    phoneno:{
        type : Number,
        required : true,
    },
    password:{
        type : String,
        required : true,
    },
    otp: {
        type: String,
        required: true,
      },
      expirationTime: {
        type: Date,
        required: true,
      },
    image :{
        type : String,
    },
    password_token:{
        type : String
    }

});

 let add= mongoose.model("user", user);
 module.exports = add