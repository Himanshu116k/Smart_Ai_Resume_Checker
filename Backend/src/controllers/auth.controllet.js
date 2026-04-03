const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model.js")





/**
 * @name registerUserController
 * @description register new user with expects username, email,Password in the request .body
 * @access Public 
 */

async function registerUserController(req,res) {

    try{

        const  {username,email,password} = req.body;
        console.log("username,email,password is ",username,email,password);

        if(!username || !email || !password){
            console.log("All fields are required");

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

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new userModel({
            username,
            email,
            Password:hashedPassword
        })
        await user.save();
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
        console.error("Error in registerUserController:", err);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }


    
}



/**
 * @name loginUserController
 * @description login a user , expects email and password in the request.body
 * @access Public
 */


async function loginUserController(req,res){

    try{


        const {email,password} = req.body;
        console.log("email and password is ",email,password);
        if(!email || !password){
            console.log("All fields are required");
            return res.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        }

        const user = await userModel.findOne({email});
        console.log("user is ",user);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found in a Database"
            })
        }

        const isPasswordIsValid = await bcrypt.compare(password,user.Password);
        if(!isPasswordIsValid){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }    
        
         const token = jwt.sign({
            id:user._id,username:user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
        )

        res.cookie("token",token,{
        httpOnly: true,
        secure: false,       // ⚠️ true in production (HTTPS)
        sameSite: "Lax", 
        })
        res.status(200).json({
            success:true,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })

        


    }catch(err){

         console.error("Error in registerUserController:", err);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}



/**
 * @name logoutUserController
 * @description clear the token from the client and add the token in a blacklist
 * @access Public
 */
async function logoutUserController(req,res) {

    console.log("res is ",res);
    const token = req.cookies.token;

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    
    res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })
    
}


/**
 * @name getMeController
 * @description get the current user
 * @access Private 
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id || req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}



module.exports ={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}