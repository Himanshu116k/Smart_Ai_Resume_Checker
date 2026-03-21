const {Router} = require("express");
const authController = require("../controllers/auth.controllet.js")

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @description Register new User
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login a User
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);




module.exports = authRouter;