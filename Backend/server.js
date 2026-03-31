const app = require("./src/app");
require("dotenv").config();
const connectionToDB = require("./src/config/database.js");


connectionToDB();



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})