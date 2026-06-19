async function testAI() {
  console.log("Testing AI Analysis API...");
  try {
    const resumeText = `
Name: John Doe
Email: john.doe@example.com
Phone: 555-123-4567

PROFESSIONAL SUMMARY
Experienced Software Engineer with a focus on Frontend Development, React, and TypeScript.

EXPERIENCE
Tech Solutions Inc - Frontend Engineer
2020 - Present
- Built responsive web applications using React and Next.js
- Integrated GraphQL APIs
- Improved web performance by 20%

EDUCATION
B.S. in Computer Science
State University, 2019

SKILLS
JavaScript, TypeScript, React, Next.js, CSS, HTML, Node.js
    `;

    const jobs = [
      {
        id: "job1",
        title: "Frontend Developer",
        description: "Looking for a skilled frontend developer with React and TypeScript experience. Must know Next.js."
      },
      {
        id: "job2",
        title: "Backend Data Engineer",
        description: "We need a data engineer strong in Python, SQL, and Apache Spark. React is a minor plus."
      }
    ];

    const response = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        resumeName: "John_Doe_Resume.pdf",
        jobs
      })
    });

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testAI();
