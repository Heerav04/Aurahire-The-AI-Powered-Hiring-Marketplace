import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import JobBrowseClient from "./JobBrowseClient";

export const dynamic = "force-dynamic"; // Ensure fresh jobs are fetched

export default async function JobBrowsePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const userName = cookieStore.get("userName")?.value || "Guest Seeker";
  const userEmail = cookieStore.get("userEmail")?.value || "";

  if (!userId) {
    redirect("/login");
  }

  // Fetch real jobs from SQLite database
  const allJobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <JobBrowseClient 
      allJobs={allJobs} 
      userName={userName} 
      userEmail={userEmail} 
    />
  );
}
