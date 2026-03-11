import type { APIRoute } from 'astro';
import { getEnv } from '@/lib/env';

export const GET: APIRoute = async ({ redirect, request, locals }) => {
  const env = getEnv(locals.runtime?.env as Record<string, unknown> | undefined);
  const clientId = env.GOOGLE_CLIENT_ID;
  const appUrl = env.PUBLIC_APP_URL || new URL(request.url).origin;
  if (!clientId) {
    return new Response(JSON.stringify({ error: 'OAuth not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const redirectUri = `${appUrl}/api/auth/callback`;
  const scope = 'openid email profile';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  return redirect(url, 302);
};
