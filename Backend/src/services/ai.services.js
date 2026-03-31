    // const {GoogleGenAI} = require("@google/genai");
    const {z}= require("zod")
    const { zodToJsonSchema } = require("zod-to-json-schema");
    const axios = require("axios");


    // const ai = new GoogleGenAI({
    //     apiKey:process.env.GOOGLE_GENAI_API_KEY
    // });

    const interviewReportSchema = z.object({
        matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
        technicalQuestions: z.array(z.object({
            question: z.string().describe("The technical question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
        behavioralQuestions: z.array(z.object({
            question: z.string().describe("The technical question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
        skillGaps: z.array(z.object({
            skill: z.string().describe("The skill which the candidate is lacking"),
            severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
        })).describe("List of skill gaps in the candidate's profile along with their severity"),
        preparationPlan: z.array(z.object({
            day: z.number().describe("The day number in the preparation plan, starting from 1"),
            focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
            tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
        })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
        title: z.string().describe("The title of the job for which the interview report is generated"),
    })





    async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

     const prompt = `
You are an expert technical interviewer.

Analyze the candidate profile and job description deeply.

Return STRICT JSON in this format:

{
  "matchScore": number (0-100),
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "skillGaps": [
    { "skill": "", "severity": "low|medium|high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": "", "tasks": [""] }
  ],
  "title": string
}

IMPORTANT:
- Generate at least 5 technical questions
- Generate at least 3 behavioral questions
- Identify real skill gaps
- Provide a 5–7 day preparation plan
- Score must NOT be 0 unless completely irrelevant

Candidate Data:

Resume:
${JSON.stringify(resume, null, 2)}

Self Description:
${JSON.stringify(selfDescription, null, 2)}

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Return ONLY JSON.
`;

        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "google/gemma-3n-e2b-it:free",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.3
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            let text = response.data.choices[0].message.content;

            // ✅ Clean JSON safely
            const start = text.indexOf("{");
            const end = text.lastIndexOf("}") + 1;
            text = text.slice(start, end);

            const parsed = JSON.parse(text);

            console.dir(parsed, { depth: null });
            return parsed;

        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }


    module.exports = generateInterviewReport;