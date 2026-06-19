import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, resumeText, resumeName, aiMatchScore, aiMatchReason } = body;

    if (!jobId || !resumeText) {
      return NextResponse.json({ success: false, error: 'Job ID and Resume Text are required' }, { status: 400 });
    }

    // 1. Get logged-in user from cookies
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated. Please login first.' }, { status: 401 });
    }

    const seeker = await prisma.user.findUnique({ where: { id: userId } });
    if (!seeker || seeker.role !== 'seeker') {
      return NextResponse.json({ success: false, error: 'Access denied. Only job seekers can apply.' }, { status: 403 });
    }

    // 2. Check if application already exists
    const existing = await prisma.application.findFirst({
      where: { jobId, seekerId: seeker.id }
    });

    if (existing) {
      const updated = await prisma.application.update({
        where: { id: existing.id },
        data: {
          resumeText,
          resumeName: resumeName || seeker.resumeName || 'resume.pdf',
          structuredResume: seeker.structuredResume,
          aiMatchScore: typeof aiMatchScore === 'number' ? aiMatchScore : null,
          aiMatchReason
        }
      });
      return NextResponse.json({ success: true, application: updated, updatedExisting: true });
    }

    // 3. Create Application
    const application = await prisma.application.create({
      data: {
        jobId,
        seekerId: seeker.id,
        resumeText,
        resumeName: resumeName || seeker.resumeName || 'resume.pdf',
        structuredResume: seeker.structuredResume,
        aiMatchScore: typeof aiMatchScore === 'number' ? aiMatchScore : null,
        aiMatchReason
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

