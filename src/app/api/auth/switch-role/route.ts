import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const newRole = user.role === 'seeker' ? 'recruiter' : 'seeker';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    const response = NextResponse.json({ success: true, role: updatedUser.role });
    
    // Update role cookie
    const maxAge = 60 * 60 * 24 * 7; // 1 week
    response.cookies.set('userRole', updatedUser.role, { path: '/', maxAge });
    
    return response;
  } catch (error) {
    console.error('Error switching role:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
