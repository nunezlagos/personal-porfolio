import type { APIRoute } from 'astro';
import { getStaticSection, type SectionKey } from '@/lib/content';
import { verifySession, getSessionCookie, getSessionSecret, isAllowedAdmin } from '@/lib/auth';
import { getEnv } from '@/lib/env';

const VALID_KEYS: SectionKey[] = ['head', 'home', 'about', 'projects', 'certifications', 'experiences'];

function isValidKey(k: string): k is SectionKey {
  return VALID_KEYS.includes(k as SectionKey);
}

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key || !isValidKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid section key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const content = getStaticSection(key);
  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  });
};

/** Guarda en src/data/*.json cuando hay filesystem (dev local); si no, 501. */
export const PUT: APIRoute = async ({ params, request, locals }) => {
  const key = params.key;
  if (!key || !isValidKey(key)) {
    return new Response(JSON.stringify({ error: 'Invalid section key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const env = getEnv(locals.runtime?.env as Record<string, unknown> | undefined) as Record<string, string | undefined>;
  const secret = getSessionSecret(env);
  const cookie = getSessionCookie(request.headers);
  if (!secret || !cookie) {
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
  if (!isAllowedAdmin(env, session.email)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  let body: string;
  try {
    const raw = await request.json();
    body = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = typeof process !== 'undefined' && process.cwd ? process.cwd() : '';
    if (!root) throw new Error('No cwd');
    const filePath = path.join(root, 'src', 'data', `${key}.json`);
    const dataDir = path.join(root, 'src', 'data');
    if (!fs.existsSync(dataDir)) throw new Error('src/data no encontrado');
    fs.writeFileSync(filePath, body, 'utf-8');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error:
          'No se pudo guardar en disco (en producción no hay filesystem). Edita los JSON en src/data y vuelve a desplegar.',
        detail: e instanceof Error ? e.message : String(e),
      }),
      {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
