const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.services")

async function genrateInterViewReportControll(req,res){

    
    const resumeFile = req.file
    const resumeContent = pdfPfarse (req.file.buffer)
    const {selfDescription,jobDescription} = req.body;

    const generateInterviewReportByAi = await generateInterviewReport({
        resume:resumeContent,
        selfDescription,
        jobDescription
    })


}







module.exports = {
    genrateInterViewReportControll

}