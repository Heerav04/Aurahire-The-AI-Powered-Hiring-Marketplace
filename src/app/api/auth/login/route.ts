import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, name, role, phone, isSignUp, adminSecret } = await req.json();

    if (!role) {
      return NextResponse.json({ success: false, error: 'Role is required' }, { status: 400 });
    }

    let user;

    // --- ADMIN ULTRA-SECURE LOGIN BYPASS ---
    if (role === 'admin') {
      const EXPECTED_SECRET = process.env.ADMIN_SECRET || 'AuraAdmin2026!';

      if (adminSecret !== EXPECTED_SECRET) {
        // Immediate rejection, no DB query
        return NextResponse.json({ success: false, error: 'Invalid Security Key. Access Denied.' }, { status: 403 });
      }

      // Create a virtual admin user for the session
      user = {
        id: 'admin_master_001',
        name: 'System Admin',
        email: 'admin@aurahire.com',
        role: 'admin'
      };
    } else {
      // --- REGULAR USER LOGIN ---
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
      }

      if (isSignUp) {
        if (!name || !phone) {
          return NextResponse.json({ success: false, error: 'Name and phone are required for sign up' }, { status: 400 });
        }

        user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          return NextResponse.json({ success: false, error: 'Account already exists with this email' }, { status: 400 });
        }

        user = await prisma.user.create({
          data: {
            email,
            name,
            role,
            phone
          }
        });
      } else {
        user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return NextResponse.json({ success: false, error: 'Account not found. Please sign up.' }, { status: 404 });
        }

        if (user.role !== role) {
          return NextResponse.json({
            success: false,
            error: `This email is registered as a ${user.role}. Please use the correct role to sign in.`
          }, { status: 403 });
        }
      }
    }

    // 2. Set cookies and redirect
    const response = NextResponse.json({ success: true, user });

    // Cookie options
    const maxAge = 60 * 60 * 24 * 7; // 1 week

    response.cookies.set('userId', user.id, { path: '/', maxAge });
    response.cookies.set('userRole', user.role, { path: '/', maxAge });
    response.cookies.set('userName', user.name, { path: '/', maxAge });
    response.cookies.set('userEmail', user.email, { path: '/', maxAge });

    // Prevent caching to guarantee privacy when switching accounts
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
