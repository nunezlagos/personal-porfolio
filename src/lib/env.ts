import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

let devVarsCache: Record<string, string> | null = null;

function loadDevVars(): Record<string, string> {
  if (devVarsCache) return devVarsCache;
  try {
    const paths = [
      join(process.cwd(), '.dev.vars'),
      join(process.cwd(), '.env'),
    ];
    for (const p of paths) {
      if (existsSync(p)) {
        const content = readFileSync(p, 'utf-8');
        const out: Record<string, string> = {};
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eq = trimmed.indexOf('=');
          if (eq < 0) continue;
          const key = trimmed.slice(0, eq).trim();
          let val = trimmed.slice(eq + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          out[key] = val;
        }
        devVarsCache = out;
        return out;
      }
    }
  } catch {}
  devVarsCache = {};
  return {};
}

export function getEnv(runtimeEnv: Record<string, unknown> | undefined): Record<string, string | undefined> {
  const fromRuntime = (runtimeEnv ?? {}) as Record<string, string | undefined>;
  const hasRuntimeVars = fromRuntime.GOOGLE_CLIENT_ID ?? fromRuntime.SESSION_SECRET;
  if (hasRuntimeVars) return fromRuntime;
  const dev = loadDevVars();
  return { ...dev, ...fromRuntime };
}
