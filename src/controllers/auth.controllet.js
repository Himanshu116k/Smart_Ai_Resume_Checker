const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




/**
 * @name registerUserController
 * @description register new user with expects username, email,Password in the required .body
 * @access Public 
 */

async function registerUserController(req,res) {

    try{

        const  {username,email,Password} = req.body;

        if(!username || !email || !Password){

            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        /**
         *@description checking by both email and username
         */

        const isUserExist = await userModel.findOne({
            $or:[{username},{email}]
        });

        if(isUserExist){
            return res.status(400).json({
                success:false,
                message:"Account already exist in Database"
            })
        }

        const hashedPassword = await bcrypt.hash(Password,10);

        const newUser = new userModel({
            username,
            email,
            Password:hashedPassword
        })

        const token = jwt.sign({
            id:user._id,username:user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
        )

        res.cookie("token",token)
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })

    }catch(err){

    }


    
}

module.exports ={
    registerUserController
}