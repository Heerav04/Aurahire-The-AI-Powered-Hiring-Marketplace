import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    const userRole = req.cookies.get('userRole')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Admin virtual session — no DB record exists
    if (userId === 'admin_master_001' || userRole === 'admin') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin_master_001',
          name: 'System Admin',
          email: 'admin@aurahire.com',
          role: 'admin',
          applications: []
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: {
          select: {
            jobId: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    const response = NextResponse.json({ success: true, message: 'Account deleted' });
    
    // Clear cookies
    response.cookies.delete('userId');
    response.cookies.delete('userRole');
    response.cookies.delete('userName');
    response.cookies.delete('userEmail');
    
    return response;
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
