const {Router} = require("express");
const authController = require("../controllers/auth.controllet.js")

const authRouter = Router();


/**
 * @name POST /api/auth/register
 * @description Register new User
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);




module.exports = authRouter;