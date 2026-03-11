import { describe, it, expect } from 'vitest';
import {
  createSession,
  verifySession,
  getSessionCookie,
  setSessionCookie,
  clearSessionCookie,
  getSessionSecret,
} from './auth';

const SECRET = 'test-secret-at-least-32-characters-long';

describe('auth', () => {
  it('getSessionSecret returns null when env has no SESSION_SECRET', () => {
    expect(getSessionSecret({})).toBeNull();
    expect(getSessionSecret({ FOO: 'bar' })).toBeNull();
  });

  it('getSessionSecret returns value from env', () => {
    expect(getSessionSecret({ SESSION_SECRET: SECRET })).toBe(SECRET);
  });

  it('createSession and verifySession roundtrip', async () => {
    const token = await createSession('user@example.com', SECRET);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    const payload = await verifySession(token, SECRET);
    expect(payload).not.toBeNull();
    expect(payload?.email).toBe('user@example.com');
    expect((payload?.exp ?? 0) > Date.now()).toBe(true);
  });

  it('verifySession returns null for invalid token', async () => {
    expect(await verifySession('invalid', SECRET)).toBeNull();
    expect(await verifySession('', SECRET)).toBeNull();
    const token = await createSession('a@b.com', SECRET);
    expect(await verifySession(token, 'wrong-secret')).toBeNull();
  });

  it('getSessionCookie parses cookie header', () => {
    const token = 'abc123';
    const cookie = setSessionCookie(token, 'http://localhost');
    const headers = new Headers({ Cookie: cookie });
    expect(getSessionCookie(headers)).toBe(token);
  });

  it('getSessionCookie returns null when no cookie', () => {
    expect(getSessionCookie(new Headers())).toBeNull();
  });

  it('setSessionCookie returns valid Set-Cookie string', () => {
    const s = setSessionCookie('token', 'http://localhost');
    expect(s).toContain('portfolio_session=');
    expect(s).toContain('HttpOnly');
    expect(s).toContain('SameSite=Lax');
  });

  it('clearSessionCookie returns cookie that clears session', () => {
    const s = clearSessionCookie();
    expect(s).toContain('portfolio_session=;');
    expect(s).toContain('Max-Age=0');
  });
});
