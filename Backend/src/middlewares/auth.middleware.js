const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model.js")


async function authUser(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not provided"
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      success: false,
      message: "Token is blacklisted"
    });
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