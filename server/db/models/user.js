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
    // user_type:{
    //     type :mongoose.Schema.Types.ObjectId,
    //     ref : "usertypes"
    // },
    image :{
        type : String,
    },
    password_token:{
        type : String
    }

});

 let add= mongoose.model("user", user);
 module.exports = add