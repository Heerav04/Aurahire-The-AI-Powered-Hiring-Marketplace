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

    // 2. Fetch Seeker with Applications
    const seeker = await prisma.user.findUnique({
      where: { 
        id,
        role: 'seeker'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        headline: true,
        applications: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            aiMatchScore: true,
            job: {
              select: {
                id: true,
                title: true,
                location: true,
                employmentType: true,
                company: {
                  select: {
                    name: true,
                    owner: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!seeker) {
      return NextResponse.json({ error: 'Seeker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, seeker });
  } catch (error) {
    console.error('Error fetching seeker details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
