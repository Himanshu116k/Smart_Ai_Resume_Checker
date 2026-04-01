const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model.js")



async function genrateInterViewReportControll(req,res){

    
    const resumeFile = req.file
    const resumeContent =  await (new pdfParse.PDFParse (Uint8Array.from(req.file.buffer)).getText())
    const {selfDescription,jobDescription} = req.body;

    const ai = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
 
        

        
    })

    console.log("This is from controller",ai);

    const interviewReport = await interviewReportModel.create({
        user:"69be802eb8d6aefd166d8787", //req.user.id || 
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        matchScore: ai.matchScore,
        // ...ai,
        technicalQuestions: ai.technicalQuestions,
        behavioralQuestion: ai.behavioralQuestions,
        skillGaps: ai.skillGaps,
        preparationPlan: ai.preparationPlan
        

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