import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RecruiterDashboardClient from "./RecruiterDashboardClient";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/api/auth/logout");
  }

  // 1. Fetch current logged-in recruiter profile
  const recruiter = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!recruiter || recruiter.role !== "recruiter") {
    redirect("/api/auth/logout");
  }

  // 2. Fetch all applications from the database, filtered by recruiter owner ID
  const applications = await prisma.application.findMany({
    where: {
      job: {
        company: {
          ownerId: recruiter.id
        }
      }
    },
    include: {
      seeker: true,
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

  // 3. Fetch all jobs posted by the recruiter
  const postedJobs = await prisma.job.findMany({
    where: {
      company: {
        ownerId: recruiter.id
      }
    },
    include: {
      company: true,
      applications: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <RecruiterDashboardClient 
      initialApplications={applications} 
      initialJobs={postedJobs}
      currentUser={recruiter} 
    />
  );
}
