const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    

    username:{
        type:String,
        unique:[true,"user alrady taken"],
        required:true
    },
    email:{

        type:String,
        unique:[true,'Account already exist in Database'],
        required:true
    },
    Password:{

        type:String,
        required:true
    },



    }
    

)

const userModel = mongoose.model("user",userSchema);
module.exports = userModel;