import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.origin + '/admin-dashboard',
      'Set-Cookie': clearSessionCookie(),
    },
  });
};
