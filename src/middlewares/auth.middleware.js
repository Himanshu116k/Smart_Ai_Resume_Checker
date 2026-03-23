const jwt = require("jsonwebtoken")


function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not Provided"
        })
    }

    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next();



    } catch (err) {
        return res.status(401).json({
            sucess:false,
            message:"Invalid Token"
        })
    }


     
}

module.exports = authUser;