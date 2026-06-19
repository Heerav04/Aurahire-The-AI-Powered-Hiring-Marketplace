import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, location, employmentType, salaryRange, domain, description } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and Description are required' }, { status: 400 });
    }

    // 1. Get logged-in recruiter from cookies
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated. Please login first.' }, { status: 401 });
    }

    const recruiter = await prisma.user.findUnique({
      where: { id: userId },
      include: { companies: true }
    });

    if (!recruiter || recruiter.role !== 'recruiter') {
      return NextResponse.json({ success: false, error: 'Access denied. Only recruiters can post jobs.' }, { status: 403 });
    }

    // Resolve or auto-create company for recruiter
    let company = recruiter.companies[0];
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: `${recruiter.name}'s Company`,
          ownerId: recruiter.id
        }
      });
    }

    // 2. Create the Job
    const job = await prisma.job.create({
      data: {
        title,
        location,
        employmentType,
        salaryRange,
        domain,
        description,
        companyId: company.id
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
