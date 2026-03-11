import type { APIRoute } from 'astro';
import { createSession, setSessionCookie, getSessionSecret, isAllowedAdmin } from '../../../lib/auth';
import { getEnv } from '@/lib/env';

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const runtimeEnv = locals.runtime?.env as Record<string, unknown> | undefined;
  const env = getEnv(runtimeEnv) as Record<string, string | undefined>;
  const appUrl = env.PUBLIC_APP_URL || url.origin;
  try {
    const code = url.searchParams.get('code');
    const clientId = env.GOOGLE_CLIENT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET;
    const secret = getSessionSecret(env);

    if (!code || !clientId || !clientSecret || !secret) {
      return Response.redirect(appUrl + '/admin-dashboard?error=auth_config', 302);
    }

    const redirectUri = `${appUrl}/api/auth/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      return Response.redirect(appUrl + '/admin-dashboard?error=token', 302);
    }
    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;
    if (!accessToken) {
      return Response.redirect(appUrl + '/admin-dashboard?error=token', 302);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      return Response.redirect(appUrl + '/admin-dashboard?error=userinfo', 302);
    }
    const user = await userRes.json();
    const email = user.email;
    if (!email) {
      return Response.redirect(appUrl + '/admin-dashboard?error=email', 302);
    }

    if (!isAllowedAdmin(env, email)) {
      return Response.redirect(appUrl + '/admin-dashboard?error=forbidden', 302);
    }

    const token = await createSession(email, secret);
    const cookie = setSessionCookie(token, appUrl);
    return new Response(null, {
      status: 302,
      headers: {
        Location: appUrl + '/admin-dashboard',
        'Set-Cookie': cookie,
      },
    });
  } catch {
    return Response.redirect(appUrl + '/admin-dashboard?error=token', 302);
  }
};
