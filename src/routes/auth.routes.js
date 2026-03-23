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


/**
 * @route GET /api/auth/logout
 * @description clear the token from the client and add the token in a blacklist
 * @access Public
 */
authRouter.get('/logout',authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description get the current user
 * @access Private
 */
authRouter.get("/get-me",)



module.exports = authRouter;