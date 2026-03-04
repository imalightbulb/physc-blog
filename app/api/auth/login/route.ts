export const dynamic = "force-static";

import { NextResponse } from 'next/server';
import { createSessionToken, getSessionCookieName, getSessionMaxAge, hasAdminConfig, isAdminEnabled, verifyAdminPassword } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!hasAdminConfig()) {
    return NextResponse.json({ error: 'Admin is not configured.' }, { status: 500 });
  }

  const body = await req.json().catch(() => null) as { password?: string } | null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyAdminPassword(password)) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getSessionCookieName(),
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getSessionMaxAge(),
  });
  return response;
}
