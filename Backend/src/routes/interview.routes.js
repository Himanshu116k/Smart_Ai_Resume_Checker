const express = require("express");
const { Router } = require("express"); // ✅ FIX
const authMiddleware = require("../middlewares/auth.middleware.js");
const interViewController = require("../controllers/interview.controller.js");
const upload = require("../middlewares/file.middleware.js");

const interviewRoute = Router();

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user data 
 * @access private
 */
interviewRoute.post(
  "/",
  //authMiddleware, // ✅ added
  upload.single("resume"),
  interViewController.genrateInterViewReportControll
);

module.exports = interviewRoute; // ✅ FIX