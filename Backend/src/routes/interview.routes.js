const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware.js")
const interViewController =require("../controllers/interview.controller.js")
const interviewRoute = express.Router()
const upload = require("../middlewares/file.middleware.js")

/**
 * @route POST /api/interview
 * @description genrate new interview report on the basis of user data 
 * @access private
 */
interviewRoute.post("/",authMiddleware.authUser, upload.single("resume"),interViewController.genrateInterViewReportControll)





module.export = interviewRoute;