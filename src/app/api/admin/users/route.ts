import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify admin role
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all'; // 'all', 'seeker', 'recruiter'
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // 2. Build Prisma query
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }
    
    if (roleFilter !== 'all') {
      whereClause.role = roleFilter;
    } else {
      // Don't show admins in the regular user list
      whereClause.role = { not: 'admin' };
    }

    // 3. Fetch users — allowlist sortBy to prevent Prisma crash on arbitrary fields
    const allowedSortFields = ['name', 'email', 'role', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        [safeSortBy]: safeOrder
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Include basic relation counts for stats
        _count: {
          select: {
            posts: true,
            companies: true,
            applications: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
