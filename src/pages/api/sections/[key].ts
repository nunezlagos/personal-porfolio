import type { APIRoute } from 'astro';
import { getSection, updateSection, isAllowedAdmin, type SectionKey } from '@/lib/db';
import { verifySession, getSessionCookie, getSessionSecret } from '@/lib/auth';
import { getEnv } from '@/lib/env';

const VALID_KEYS: SectionKey[] = ['head', 'home', 'about', 'projects', 'certifications', 'experiences'];

function isValidKey(k: string): k is SectionKey {
  return VALID_KEYS.includes(k as SectionKey);
}

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key;
  if (!key || !isValidKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid section key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const db = (locals.runtime?.env as { DB?: import('@cloudflare/workers-types').D1Database })?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const content = await getSection(db, key);
  if (content === null) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const key = params.key;
  if (!key || !isValidKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid section key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const runtimeEnv = locals.runtime?.env as Record<string, unknown> | undefined;
  const env = { ...getEnv(runtimeEnv), ...runtimeEnv } as Record<string, string | undefined> & { DB?: import('@cloudflare/workers-types').D1Database };
  const db = env.DB;
  const secret = getSessionSecret(env);
  if (!db || !secret) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const cookie = getSessionCookie(request.headers);
  if (!cookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const session = await verifySession(cookie, secret);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const allowed = await isAllowedAdmin(db, session.email);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  let body: string;
  try {
    const raw = await request.json();
    body = typeof raw === 'string' ? raw : JSON.stringify(raw);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const result = await updateSection(db, key, body);
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error ?? 'Update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
