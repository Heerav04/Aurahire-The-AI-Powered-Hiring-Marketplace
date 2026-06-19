import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Verify admin role
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Job with Applications and Candidate Details
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true
              }
            }
          }
        },
        applications: {
          orderBy: [
            { aiMatchScore: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
            seeker: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                headline: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
