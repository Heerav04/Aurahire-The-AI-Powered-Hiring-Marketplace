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

    // 2. Fetch Recruiter with Companies and Jobs
    const recruiter = await prisma.user.findUnique({
      where: { 
        id,
        role: 'recruiter'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        companies: {
          select: {
            id: true,
            name: true,
            industry: true,
            description: true,
            jobs: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                title: true,
                location: true,
                employmentType: true,
                createdAt: true,
                _count: {
                  select: {
                    applications: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, recruiter });
  } catch (error) {
    console.error('Error fetching recruiter details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
