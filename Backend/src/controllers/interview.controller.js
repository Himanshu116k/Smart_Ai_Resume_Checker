const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model.js")



async function genrateInterViewReportControll(req,res){

    
    const resumeFile = req.file
    const resumeContent =  await (new pdfPfarse.PDFParse (req.file.buffer).getText())
    const {selfDescription,jobDescription} = req.body;

    const generateInterviewReportByAi = await generateInterviewReport({
        resume:resumeContent,
        selfDescription,
        jobDescription

        
    })

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent,
        selfDescription,
        technicalQuestion,
        ...generateInterviewReportByAi

})
res.status(201).json({
    success:true,
    message:"Interview Report Genrated successfully",
    interviewReport
})
}






module.exports = {
    genrateInterViewReportControll

}