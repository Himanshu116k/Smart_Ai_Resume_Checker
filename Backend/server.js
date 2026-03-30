const app = require("./src/app");
require("dotenv").config();
const connectionToDB = require("./src/config/database.js");
const {resume,selfDescription,jobDescription} = require("./src/services/temp.js")
const generateInterviewReport = require("../Backend/src/services/ai.services.js")


connectionToDB();
generateInterviewReport({resume,selfDescription,jobDescription})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})