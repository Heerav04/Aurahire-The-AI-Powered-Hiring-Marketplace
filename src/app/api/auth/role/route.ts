import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/role
 * Returns the current user's role from the session cookie.
 * Lightweight — no DB query needed.
 */
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;
  const userRole = req.cookies.get('userRole')?.value;
  const userName = req.cookies.get('userName')?.value;

  if (!userId || !userRole) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    role: userRole,
    userId,
    userName: userName ? decodeURIComponent(userName) : undefined,
  });
}
