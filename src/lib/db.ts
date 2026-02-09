import type { D1Database } from '@cloudflare/workers-types';

export type SectionKey = 'head' | 'home' | 'about' | 'projects' | 'certifications' | 'experiences';

export async function getSection<T = unknown>(
  db: D1Database,
  key: SectionKey
): Promise<T | null> {
  const stmt = db.prepare('SELECT content FROM sections WHERE key = ?').bind(key);
  const row = await stmt.first<{ content: string }>();
  if (!row) return null;
  try {
    return JSON.parse(row.content) as T;
  } catch {
    return null;
  }
}

export async function getAllSections(db: D1Database): Promise<Record<string, unknown>> {
  const { results } = await db.prepare('SELECT key, content FROM sections').all<{ key: string; content: string }>();
  const out: Record<string, unknown> = {};
  for (const row of results || []) {
    try {
      out[row.key] = JSON.parse(row.content);
    } catch {
      out[row.key] = null;
    }
  }
  return out;
}

export async function updateSection(
  db: D1Database,
  key: SectionKey,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .prepare(
        'INSERT INTO sections (key, content, updated_at) VALUES (?, ?, datetime("now")) ON CONFLICT(key) DO UPDATE SET content = excluded.content, updated_at = datetime("now")'
      )
      .bind(key, content)
      .run();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export function isAllowedAdmin(db: D1Database, email: string): Promise<boolean> {
  return db
    .prepare('SELECT 1 FROM admin_users WHERE email = ?')
    .bind(email.toLowerCase())
    .first()
    .then((r) => !!r);
}
