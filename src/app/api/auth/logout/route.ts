import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete('userId');
  response.cookies.delete('userRole');
  response.cookies.delete('userName');
  response.cookies.delete('userEmail');

  // Prevent caching of logout states to enforce user isolation
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

  return response;
}

export async function GET(req: NextRequest) {
  const url = new URL('/login', req.url);
  const response = NextResponse.redirect(url);
  
  response.cookies.delete('userId');
  response.cookies.delete('userRole');
  response.cookies.delete('userName');
  response.cookies.delete('userEmail');

  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

  return response;
}
