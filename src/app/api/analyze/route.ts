import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// @ts-ignore
import PDFParser from 'pdf2json';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    let resumeText = "";
    let file: File | null = null;
    let filename = "";
    let jobs: any[] = [];

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const data = await req.formData();
      file = data.get('resume') as unknown as File;
      const jobsStr = data.get('jobs') as string;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 1. Parse PDF text locally to maintain privacy and integrity
      resumeText = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
      filename = file.name;
      jobs = JSON.parse(jobsStr || '[]');
    } else {
      const body = await req.json();
      resumeText = body.resumeText || "";
      filename = body.resumeName || "resume.pdf";
      jobs = body.jobs || [];
    }

    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    // 2. Call AI for analysis
    const prompt = `
You are an expert technical recruiter and ATS system.

Candidate Resume Text:
---
${resumeText.substring(0, 4000)}
---

Jobs Available:
${JSON.stringify(jobs.slice(0, 10).map(j => ({ ...j, description: (j.description || '').substring(0, 500) })))}

Task:
1. Extract an array of the candidate's top 6-8 key professional skills (e.g., technical, medical, financial, or soft skills depending on their industry).
2. For each job in the Jobs Available array, calculate a match score (0-100) based on how well the resume fits the job title and requirements. Ensure scores are calculated out of 100 (e.g. 85, not 8.5).
3. Provide a very short 1-sentence match reason for each job explaining the score.
4. Perform a general ATS review of the resume. Generate an overall evaluation score (0-100) indicating how professional and complete it is, a list of formatting errors/warnings (e.g. missing links, structural issues, missing contact info), and a list of specific optimization suggestions for the resume.
5. Extract a clean, formalized JSON resume model representing the candidate's profile in standard schemas.

Return the results STRICTLY as a JSON object. Ensure the format is exactly:
{
  "skills": ["Skill1", "Skill2", "Skill3"],
  "atsFeedback": {
    "score": 75,
    "formattingErrors": ["Missing contact link", "No phone number shown"],
    "suggestions": ["Add more project metrics", "Add TypeScript keywords"]
  },
  "structuredResume": {
    "basics": { "name": "Candidate Name", "email": "candidate@email.com", "phone": "123-456", "location": "City, State", "headline": "Current Job Title" },
    "education": [
      { "institution": "University Name", "degree": "Degree and Major", "endDate": "2024" }
    ],
    "workExperience": [
      { "company": "Company Name", "position": "Job Title", "duration": "2023 - Present", "highlights": ["Accomplishment 1", "Accomplishment 2"] }
    ],
    "projects": [
      { "name": "Project Name", "description": "Key details", "technologies": ["React", "TypeScript"] }
    ]
  },
  "scores": [
    { "jobId": "job_id_string_from_input", "matchScore": 85, "matchReason": "Good fit..." }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "google/gemma-4-31b-it:free",
      messages: [{ role: "user", content: prompt }]
    });

    let content = completion.choices[0].message.content || "{}";
    
    // Robust JSON parsing to handle LLM markdown quirks
    let aiResponse;
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd);
      }
      aiResponse = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response as JSON. Raw content:", content);
      // Return partial results so the user still gets resume text value
      return NextResponse.json({ 
        success: true, 
        analysis: {
          skills: [],
          scores: [],
          atsFeedback: { score: 0, formattingErrors: ["AI analysis returned incomplete results. Try re-uploading."], suggestions: [] },
          structuredResume: { basics: { name: "", email: "", phone: "", location: "", headline: "" }, education: [], workExperience: [], projects: [] }
        }, 
        resumeText, 
        resumeName: filename,
        warning: 'AI returned partial results due to formatting issues.'
      });
    }

    // Ensure structure exists so frontend doesn't crash
    if (!aiResponse.skills) aiResponse.skills = [];
    if (!aiResponse.scores) aiResponse.scores = [];
    if (!aiResponse.atsFeedback) {
      aiResponse.atsFeedback = {
        score: 70,
        formattingErrors: [],
        suggestions: []
      };
    }
    if (!aiResponse.structuredResume) {
      aiResponse.structuredResume = {
        basics: { name: "", email: "", phone: "", location: "", headline: "" },
        education: [],
        workExperience: [],
        projects: []
      };
    }

    // 3. Save to User record in database if authenticated
    const userId = req.cookies.get('userId')?.value;
    if (userId) {
      const skillsStr = aiResponse.skills.join(', ');
      const atsFeedbackStr = JSON.stringify(aiResponse.atsFeedback);
      const structuredResumeStr = JSON.stringify(aiResponse.structuredResume, null, 2);

      await prisma.user.update({
        where: { id: userId },
        data: {
          resumeText,
          resumeName: filename,
          structuredResume: structuredResumeStr,
          skills: skillsStr,
          atsFeedback: atsFeedbackStr
        }
      });
    }

    return NextResponse.json({ success: true, analysis: aiResponse, resumeText, resumeName: filename });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

