import * as jose from 'jose';

const COOKIE_NAME = 'portfolio_session';
const MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionPayload {
  email: string;
  exp: number;
}

export function getSessionSecret(env: Record<string, string | undefined>): string | null {
  return env.SESSION_SECRET ?? env.SESSION_SECRET ?? null;
}

export async function createSession(email: string, secret: string): Promise<string> {
  return await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(MAX_AGE + 's')
    .setIssuedAt()
    .sign(new TextEncoder().encode(secret));
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret));
    if (!payload.email || typeof payload.email !== 'string') return null;
    return { email: payload.email as string, exp: (payload.exp ?? 0) * 1000 };
  } catch {
    return null;
  }
}

export function getSessionCookie(headers: Headers): string | null {
  const cookie = headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setSessionCookie(token: string, baseUrl: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${baseUrl.startsWith('https') ? '; Secure' : ''}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
