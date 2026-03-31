const mongoose = require('mongoose')


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"question is required"]

    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({

    question:{
        type:String,
        required:[true,"question is required"]

    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }  


},{
    _id:false
})



const skillGapSchema = new mongoose.Schema({


    skill:{
        type:String,
        required:[true,"skill gap is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"Severity  is required"]
    }

},{
    _id:false
})


const preprationPlanSchema = new mongoose.Schema({


    day:{

        type:Number,
        required:[true,"Day is Required"]
    },
    focus:{
       type:String,
       required:[true,"focus is required"]

    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]




})
const interviewReportSchema  = new mongoose.Schema({
    
    jobDescription:{
        type:String,
        required:[true,"job description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String,
        required:[true,"self description is required"]
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preprationPlanSchema],
    user:{
       type:String
    
    }

     




},{
    timestamps:true
})

const interviewReportModel =mongoose.model("InterviewReport",interviewReportSchema);
module.exports = interviewReportModel;