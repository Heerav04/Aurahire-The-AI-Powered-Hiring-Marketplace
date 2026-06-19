import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharva", "Kabir", "Rishi", "Darsh", "Ananya", "Diya", "Aditi", "Isha", "Neha", "Pooja", "Priya", "Rahul", "Rohit", "Sneha", "Kavya", "Riya", "Aarohi", "Avni", "Kriti", "Shruti", "Siddharth", "Vikram", "Rohan", "Raj", "Sanjay", "Anil", "Sunil", "Karan", "Karthik", "Abhishek", "Manish", "Deepak", "Amit", "Naveen", "Vikas", "Gaurav", "Prakash", "Swati", "Divya", "Shilpa", "Megha", "Priyanka", "Anjali", "Ritu", "Sonam"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Desai", "Joshi", "Reddy", "Rao", "Nair", "Menon", "Bose", "Das", "Mukherjee", "Banerjee", "Chatterjee", "Kapoor", "Chopra", "Ahluwalia", "Agarwal", "Bansal", "Mishra", "Pandey", "Shukla", "Tiwari", "Yadav", "Chauhan", "Rajput", "Kaur", "Iyer", "Pillai", "Gowda", "Hegde", "Bhattacharya", "Sen", "Bhatt", "Roy", "Saha"];
const companyPrefixes = ["Tech", "Global", "NextGen", "Alpha", "Data", "Cloud", "Inno", "Smart", "Future", "Quantum", "Cyber", "Bio", "Eco", "Fin", "Health", "Agile", "Apex", "Nova", "Stellar", "Vanguard", "Optima", "Synergy", "Infosys", "Wipro", "TCS", "HCL", "TechMahindra"];
const companySuffixes = ["Solutions", "Systems", "Technologies", "Corp", "Inc", "Group", "Dynamics", "Labs", "Partners", "Innovations", "Networks", "Logistics", "Ventures", "Studios", "Software", "Consulting", "Analytics", "AI", "India"];
const industries = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Marketing", "Entertainment", "Real Estate", "Transportation"];

const jobProfiles = [
  {
    title: "Data Scientist",
    skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "PyTorch", "Data Visualization", "Pandas", "Scikit-Learn", "Statistics", "A/B Testing", "Spark"],
    responsibilities: [
      "Developed predictive models to forecast customer churn with 85% accuracy.",
      "Engineered data pipelines using Apache Spark and Python.",
      "Designed and implemented machine learning algorithms for recommendation systems.",
      "Conducted statistical analysis on massive datasets to uncover business insights.",
      "Built interactive dashboards using Tableau and PowerBI.",
      "Optimized deep learning models for production deployment."
    ],
    summaries: [
      "Analytical Data Scientist with a passion for deriving actionable insights from complex datasets.",
      "Machine Learning expert with a track record of deploying scalable predictive models.",
      "Detail-oriented Data Scientist experienced in Python, R, and big data technologies."
    ]
  },
  {
    title: "Data Analyst",
    skills: ["SQL", "Excel", "Tableau", "PowerBI", "Python", "Data Cleaning", "Reporting", "Google Analytics", "Looker", "Data Mining"],
    responsibilities: [
      "Created comprehensive reports detailing weekly KPI progress.",
      "Cleaned and transformed raw data into usable formats for business analysis.",
      "Automated Excel reporting macros to save 10 hours per week.",
      "Analyzed user behavior data to identify conversion bottlenecks.",
      "Maintained data integrity across multiple databases.",
      "Presented data findings to executive stakeholders using PowerBI."
    ],
    summaries: [
      "Detail-driven Data Analyst adept at translating raw numbers into compelling business narratives.",
      "Results-oriented analyst with extensive experience in SQL and data visualization tools.",
      "Business-minded Data Analyst specializing in operational efficiency and reporting."
    ]
  },
  {
    title: "Data Operations Analyst",
    skills: ["Data Entry", "SQL", "ETL", "Data Quality", "Salesforce", "Jira", "Process Optimization", "Excel", "Data Governance"],
    responsibilities: [
      "Monitored daily ETL processes and resolved data quality issues.",
      "Streamlined data entry procedures, reducing errors by 30%.",
      "Maintained Salesforce data hygiene and deduplication.",
      "Collaborated with engineering to improve data pipeline reliability.",
      "Conducted regular audits of company databases.",
      "Documented standard operating procedures for data governance."
    ],
    summaries: [
      "Process-focused Data Operations Analyst ensuring high data quality and system reliability.",
      "Diligent operations specialist with a knack for optimizing data workflows.",
      "Organized Data Ops Analyst skilled in maintaining large-scale CRM systems."
    ]
  },
  {
    title: "Business Analyst",
    skills: ["Requirements Gathering", "Agile", "Scrum", "Visio", "Jira", "SQL", "Business Process Modeling", "Stakeholder Management", "UAT"],
    responsibilities: [
      "Gathered and documented business requirements for enterprise software projects.",
      "Facilitated daily stand-ups and sprint planning as a Scrum Master.",
      "Created detailed process flow diagrams using Microsoft Visio.",
      "Conducted User Acceptance Testing (UAT) with key stakeholders.",
      "Bridged the gap between business needs and technical implementation.",
      "Analyzed market trends to recommend strategic product features."
    ],
    summaries: [
      "Strategic Business Analyst adept at aligning technical solutions with business goals.",
      "Experienced BA specializing in Agile methodologies and enterprise software delivery.",
      "Analytical thinker with exceptional stakeholder management and documentation skills."
    ]
  },
  {
    title: "Full Stack Developer",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS", "Git", "Next.js", "GraphQL"],
    responsibilities: [
      "Architected and developed a full-stack e-commerce platform using Next.js and Node.js.",
      "Designed RESTful and GraphQL APIs for seamless frontend integration.",
      "Optimized database queries in PostgreSQL, improving load times by 40%.",
      "Implemented responsive UIs with React and Tailwind CSS.",
      "Set up CI/CD pipelines using GitHub Actions and Docker.",
      "Mentored junior developers and conducted code reviews."
    ],
    summaries: [
      "Versatile Full Stack Developer with deep expertise in the MERN/PERN stack.",
      "End-to-end engineer passionate about building scalable, user-centric web applications.",
      "Problem-solving developer experienced in both cloud architecture and frontend design."
    ]
  },
  {
    title: "Web Developer",
    skills: ["HTML5", "CSS3", "JavaScript", "PHP", "WordPress", "jQuery", "Bootstrap", "SEO", "Web Performance", "Figma"],
    responsibilities: [
      "Developed custom WordPress themes and plugins for corporate clients.",
      "Ensured cross-browser compatibility and mobile responsiveness.",
      "Optimized website load speeds, achieving a 95+ score on Google Lighthouse.",
      "Implemented SEO best practices to increase organic traffic.",
      "Translated Figma designs into pixel-perfect web pages.",
      "Managed website hosting, domains, and SSL certificates."
    ],
    summaries: [
      "Creative Web Developer specializing in fast, responsive, and accessible websites.",
      "Experienced developer with a strong background in CMS platforms and frontend fundamentals.",
      "Dedicated Web Developer focused on delivering exceptional digital experiences."
    ]
  },
  {
    title: "Front-end Developer",
    skills: ["React", "Vue.js", "TypeScript", "CSS/SASS", "Tailwind CSS", "Redux", "Webpack", "Jest", "UI/UX", "Accessibility (a11y)"],
    responsibilities: [
      "Built highly interactive user interfaces using React and Redux.",
      "Implemented complex state management for enterprise dashboards.",
      "Collaborated closely with UX designers to refine application workflows.",
      "Wrote comprehensive unit tests using Jest and React Testing Library.",
      "Championed web accessibility, ensuring WCAG 2.1 AA compliance.",
      "Refactored legacy codebases to modern React functional components."
    ],
    summaries: [
      "UI-focused Front-end Developer with a passion for building intuitive web applications.",
      "React specialist dedicated to writing clean, maintainable, and tested code.",
      "Detail-oriented developer who bridges the gap between design and engineering."
    ]
  },
  {
    title: "Back-end Developer",
    skills: ["Node.js", "Python", "Java", "Go", "Microservices", "REST APIs", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"],
    responsibilities: [
      "Designed scalable microservices architecture using Node.js and Docker.",
      "Implemented robust authentication and authorization systems.",
      "Optimized high-traffic APIs to handle 10k+ requests per second.",
      "Integrated third-party payment gateways like Stripe and PayPal.",
      "Managed database migrations and schema design for complex applications.",
      "Configured distributed caching systems using Redis to reduce database load."
    ],
    summaries: [
      "Systems-thinking Back-end Developer experienced in designing scalable APIs.",
      "Database and server architecture expert focused on high-performance backend solutions.",
      "Security-conscious engineer adept at building robust microservices."
    ]
  },
  {
    title: "AI Developer",
    skills: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Hugging Face", "NLP", "Computer Vision", "C++", "CUDA"],
    responsibilities: [
      "Fine-tuned Large Language Models (LLMs) for domain-specific customer support.",
      "Developed computer vision pipelines for real-time object detection.",
      "Integrated OpenAI APIs into existing SaaS platforms.",
      "Optimized deep learning model inference speeds using TensorRT.",
      "Built Retrieval-Augmented Generation (RAG) systems for internal knowledge bases.",
      "Researched and implemented state-of-the-art NLP architectures."
    ],
    summaries: [
      "Innovative AI Developer specializing in applied machine learning and generative AI.",
      "Deep learning practitioner with experience deploying models to production environments.",
      "Forward-thinking engineer focused on building intelligent, AI-driven applications."
    ]
  },
  {
    title: "AI Integrator",
    skills: ["API Integration", "Python", "Node.js", "Prompt Engineering", "LangChain", "Vector Databases (Pinecone)", "Automation", "Zapier"],
    responsibilities: [
      "Seamlessly integrated AI features into legacy enterprise software.",
      "Designed robust prompt engineering frameworks for consistent AI outputs.",
      "Managed vector databases (Pinecone) for semantic search capabilities.",
      "Automated business workflows using AI agents and Zapier.",
      "Monitored AI system performance and token usage costs.",
      "Trained internal teams on leveraging new AI integrations."
    ],
    summaries: [
      "Solutions-oriented AI Integrator connecting powerful AI models with practical business needs.",
      "Expert in prompt engineering and LLM orchestration frameworks.",
      "Bridging the gap between cutting-edge AI research and production software."
    ]
  },
  {
    title: "Business Development Executive",
    skills: ["B2B Sales", "Lead Generation", "CRM (Salesforce)", "Negotiation", "Account Management", "Market Research", "Cold Calling", "Strategic Partnerships"],
    responsibilities: [
      "Identified and closed $500k+ in new business within the first year.",
      "Developed strategic partnerships with key industry players.",
      "Managed the full sales cycle from prospecting to contract negotiation.",
      "Conducted thorough market research to identify new expansion opportunities.",
      "Maintained a robust pipeline using Salesforce CRM.",
      "Delivered compelling product presentations to C-level executives."
    ],
    summaries: [
      "Results-driven Business Development Executive with a proven track record of revenue growth.",
      "Strategic sales professional specializing in enterprise B2B software solutions.",
      "Relationship-builder adept at negotiating complex contracts and driving expansion."
    ]
  }
];

const locations = ["Bangalore, KA", "Mumbai, MH", "Hyderabad, TG", "Pune, MH", "Chennai, TN", "Gurugram, HR", "Noida, UP", "Delhi, NCR", "Remote", "Hybrid", "Kolkata, WB", "Ahmedabad, GJ"];
const types = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];

function randomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements(arr: any[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomName() {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function generateRandomEmail(name: string, domain: string) {
  return `${name.replace(' ', '.').toLowerCase()}${randomNumber(1, 999)}@${domain}.com`;
}

// Generate a date strictly within the past 7 days
function generateRecentDate() {
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  return new Date(randomNumber(sevenDaysAgo, now));
}

function generateUniqueResume(name: string, email: string, profile: any) {
  const selectedSkills = randomElements(profile.skills, randomNumber(5, 8)).join(", ");
  const summary = randomElement(profile.summaries);
  
  const expCount = randomNumber(2, 3);
  let experienceStr = "";
  
  let currentYear = new Date().getFullYear();
  
  for (let i = 0; i < expCount; i++) {
    const startYear = currentYear - randomNumber(2, 4);
    const endYear = i === 0 ? "Present" : currentYear.toString();
    const company = `${randomElement(companyPrefixes)} ${randomElement(companySuffixes)}`;
    
    // Pick 2-3 random responsibilities
    const resps = randomElements(profile.responsibilities, randomNumber(2, 3))
      .map(r => `- ${r}`)
      .join("\n");

    experienceStr += `${company} - ${i === 0 ? profile.title : 'Junior ' + profile.title}\n${startYear} - ${endYear}\n${resps}\n\n`;
    currentYear = startYear;
  }

  const degrees = ["B.Tech", "M.Tech", "B.E.", "MCA", "MBA", "B.Sc", "M.Sc"];
  const majors = ["Computer Science", "Information Technology", "Electronics & Communication", "Data Science", "Business Administration"];
  const universities = ["IIT Bombay", "NIT Trichy", "BITS Pilani", "Delhi University", "Anna University", "VIT Vellore", "SRM Institute", "Manipal University", "Jadavpur University", "Osmania University"];
  const edu = `${randomElement(degrees)} in ${randomElement(majors)}\n${randomElement(universities)}, ${currentYear - randomNumber(1, 4)}`;

  return `
Name: ${name}
Email: ${email}
Phone: +91 ${randomNumber(70000,99999)}${randomNumber(10000,99999)}
Location: ${randomElement(locations)}

PROFESSIONAL SUMMARY
${summary}

EXPERIENCE
${experienceStr.trim()}

EDUCATION
${edu}

SKILLS
${selectedSkills}
  `.trim();
}

async function main() {
  console.log('Clearing database...');
  
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.connection.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared.');

  // Create Admin
  console.log('Creating Admin...');
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'System Admin',
      role: 'admin',
      headline: 'Platform Administrator',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`,
      createdAt: generateRecentDate()
    }
  });

  // Create Recruiters and Jobs
  console.log('Generating ~50 Recruiters, Companies, and Jobs...');
  const RECRUITER_COUNT = 50;
  const jobs: { id: string, profile: any }[] = [];

  for (let i = 0; i < RECRUITER_COUNT; i++) {
    const name = generateRandomName();
    const email = generateRandomEmail(name, 'recruiting');
    const recruiterDate = generateRecentDate();
    
    const recruiter = await prisma.user.create({
      data: {
        email,
        name,
        role: 'recruiter',
        headline: 'Talent Acquisition Specialist',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
        createdAt: recruiterDate
      }
    });

    const companyName = `${randomElement(companyPrefixes)} ${randomElement(companySuffixes)}`;
    const companyDate = generateRecentDate();
    const company = await prisma.company.create({
      data: {
        name: companyName,
        description: `Leading provider of innovative solutions in the ${randomElement(industries)} sector.`,
        industry: randomElement(industries),
        ownerId: recruiter.id,
        createdAt: companyDate
      }
    });

    const numJobs = randomNumber(1, 2);
    for (let j = 0; j < numJobs; j++) {
      const profile = randomElement(jobProfiles);
      const jobDate = generateRecentDate();
      
      const reqs = randomElements(profile.responsibilities, 3)
        .map(r => `- Experience with: ${r.split(' ').slice(0, 5).join(' ')}...`)
        .join("\n");

      const job = await prisma.job.create({
        data: {
          title: profile.title,
          location: randomElement(locations),
          employmentType: randomElement(types),
          salaryRange: `$${randomNumber(50, 120)}k - $${randomNumber(130, 250)}k`,
          domain: company.industry,
          description: `**About the Role:**\nWe are looking for an experienced ${profile.title} to join our growing team at ${companyName}. You will be responsible for driving key initiatives and working closely with cross-functional teams.\n\n**Requirements:**\n${reqs}\n- Strong communication skills\n- Ability to work independently\n\n**Required Skills:**\n${randomElements(profile.skills, 5).join(', ')}`,
          companyId: company.id,
          createdAt: jobDate
        }
      });
      jobs.push({ id: job.id, profile });
    }
  }

  // Create Seekers
  console.log('Generating ~100 Seekers with HIGHLY UNIQUE, role-specific resumes...');
  const SEEKER_COUNT = 100;
  const seekers = [];

  for (let i = 0; i < SEEKER_COUNT; i++) {
    const name = generateRandomName();
    const email = generateRandomEmail(name, 'gmail');
    const profile = randomElement(jobProfiles);
    const seekerDate = generateRecentDate();
    
    const resumeText = generateUniqueResume(name, email, profile);

    const seeker = await prisma.user.create({
      data: {
        email,
        name,
        role: 'seeker',
        headline: profile.title,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
        resumeName: `${name.replace(' ', '_')}_Resume.pdf`,
        resumeText: resumeText,
        createdAt: seekerDate
      }
    });

    seekers.push({ ...seeker, profile });
  }

  // Generate Applications
  console.log('Generating Applications...');
  let applicationCount = 0;

  for (const seeker of seekers) {
    const numApps = randomNumber(2, 6);
    
    // Favor jobs that match the seeker's profile
    const matchingJobs = jobs.filter(j => j.profile.title === seeker.profile.title);
    const nonMatchingJobs = jobs.filter(j => j.profile.title !== seeker.profile.title);
    
    const appliedJobsSet = new Set<any>();
    
    // Add some matching jobs if available
    if (matchingJobs.length > 0) {
      const matchCount = Math.min(matchingJobs.length, randomNumber(1, numApps));
      const selected = randomElements(matchingJobs, matchCount);
      selected.forEach(j => appliedJobsSet.add(j));
    }

    // Fill the rest with random jobs
    while(appliedJobsSet.size < numApps && nonMatchingJobs.length > 0) {
      appliedJobsSet.add(randomElement(nonMatchingJobs));
    }

    for (const job of Array.from(appliedJobsSet)) {
      // If it's a matching job title, score is high
      const isMatch = job.profile.title === seeker.profile.title;
      const matchScore = isMatch ? randomNumber(80, 99) : randomNumber(30, 65);
      
      let reason = '';
      if (matchScore >= 80) {
        reason = `Highly qualified candidate. Excellent overlap in required skills. Experience as a ${seeker.profile.title} perfectly matches the job description.`;
      } else if (matchScore >= 60) {
        reason = `Moderate match. Has some relevant technical experience but may be lacking specific domain knowledge required for a ${job.profile.title} role.`;
      } else {
        reason = `Low match. The candidate's background as a ${seeker.profile.title} does not align well with the core requirements of this position.`;
      }

      await prisma.application.create({
        data: {
          jobId: job.id,
          seekerId: seeker.id,
          resumeText: seeker.resumeText || '',
          resumeName: seeker.resumeName || 'resume.pdf',
          aiMatchScore: matchScore,
          aiMatchReason: reason,
          createdAt: generateRecentDate() // Applied recently
        }
      });
      applicationCount++;
    }
  }

  console.log(`Seeding complete! Generated ${applicationCount} individualized applications.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
