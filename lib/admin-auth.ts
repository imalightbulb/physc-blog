import crypto from 'crypto';
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

interface SessionPayload {
  exp: number;
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || '';
}

export function isAdminEnabled(): boolean {
  return process.env.ENABLE_ADMIN === 'true';
}

export function hasAdminConfig(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret());
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf-8');
}

function sign(value: string): string {
  const secret = getSessionSecret();
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function createSessionToken(): string {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token || !hasAdminConfig()) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (!safeCompare(signature, expected)) return false;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as SessionPayload;
    return Number.isFinite(parsed.exp) && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected || !password) return false;
  return safeCompare(password, expected);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}

interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
}

export function isAdminAuthenticated(cookieStore: CookieStoreLike): boolean {
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || '';
  return verifySessionToken(token);
}
