// Resume Template Data

export const resume = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    summary: "Experienced professional with a passion for technology and innovation",
  },
  
  experience: [
    {
      jobTitle: "Senior Software Engineer",
      company: "Tech Company Inc.",
      startDate: "2021-01-15",
      endDate: "Present",
      description: "Led development of scalable web applications",
      responsibilities: [
        "Designed and implemented REST APIs",
        "Mentored junior developers",
        "Managed database optimization projects",
      ],
    },
    {
      jobTitle: "Junior Software Engineer",
      company: "StartUp Solutions",
      startDate: "2019-06-01",
      endDate: "2020-12-31",
      description: "Developed full-stack web applications",
      responsibilities: [
        "Built responsive user interfaces",
        "Wrote unit tests",
        "Collaborated with product team",
      ],
    },
  ],

  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "State University",
      graduationDate: "2019-05-15",
      gpa: "3.8",
    },
  ],

  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "Git",
    "Docker",
    "Team Leadership",
    "Problem Solving",
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      dateObtained: "2022-03-20",
    },
  ],

  projects: [
    {
      projectName: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://github.com/johndoe/ecommerce",
    },
  ],
};

// Self Description Template
export const selfDescription = {
  overview:
    "I am a detail-oriented Full Stack Developer with 5+ years of experience in building scalable web applications. I have a strong foundation in both frontend and backend technologies.",

  strengths: [
    "Strong problem-solving skills with ability to break down complex tasks",
    "Excellent communication and team collaboration abilities",
    "Self-motivated learner who stays updated with latest technologies",
    "Experience in Agile development methodologies",
  ],

  achievements: [
    "Successfully delivered 15+ projects on time and within budget",
    "Improved application performance by 40% through optimization",
    "Mentored 5 junior developers helping them grow their careers",
  ],

  careerGoals:
    "Looking to leverage my expertise in a senior role where I can contribute to cutting-edge projects and mentor junior developers.",

  workStyle:
    "I thrive in collaborative environments and prefer working with teams that value innovation and continuous learning.",

  keyCompetencies: [
    "Full Stack Development",
    "Database Design",
    "API Development",
    "Problem Solving",
    "Team Leadership",
    "Agile Methodologies",
  ],
};

// Job Description Template
export const jobDescription = {
  jobTitle: "Senior Full Stack Developer",
  company: "Tech Innovations Inc.",
  employmentType: "Full-time",
  
  jobSummary:
    "We are seeking an experienced Full Stack Developer to join our growing team and help build innovative web solutions for our clients.",

  requiredSkills: [
    "5+ years of professional web development experience",
    "Proficiency in JavaScript/TypeScript",
    "Experience with React or Vue.js",
    "Backend development with Node.js or Python",
    "SQL and NoSQL database experience",
    "RESTful API design and development",
    "Git version control",
    "Strong understanding of software design patterns",
  ],

  responsibilities: [
    "Design and implement scalable web applications",
    "Collaborate with product and design teams",
    "Write clean, maintainable, and well-documented code",
    "Perform code reviews for team members",
    "Optimize application performance",
    "Participate in agile ceremonies and planning",
    "Mentor junior developers",
    "Troubleshoot and debug production issues",
  ],

  qualifications: {
    required: [
      "Bachelor's degree in Computer Science or related field",
      "5+ years of professional experience in web development",
      "Proven track record of delivering projects",
      "Strong communication skills",
    ],
    preferred: [
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Open source contributions",
      "Experience with CI/CD pipelines",
      "Familiarity with testing frameworks",
    ],
  },

  benefits: [
    "Competitive salary package",
    "Health insurance",
    "Professional development opportunities",
    "Remote work flexibility",
    "Flexible working hours",
  ],

  location: "New York, NY",
  salary: "$120,000 - $150,000 per year",

  keyRequirements: [
    "Strong programming skills",
    "Ability to work in a team environment",
    "Problem-solving mindset",
    "Passion for learning",
  ],
};

export default {
  resume,
  selfDescription,
  jobDescription,
};
