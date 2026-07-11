import robotstxt from 'generate-robotstxt';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'robots.txt');

const AI_BOT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'Meta-ExternalAgent',
  'Applebot-Extended',
  'Cohere-AI',
];

const policies = [
  { userAgent: '*', disallow: '/' },
  ...AI_BOT_USER_AGENTS.map((ua) => ({ userAgent: ua, disallow: '/' })),
];

robotstxt({
  policy: policies,
  sitemap: null,
  host: null,
}).then((content) => {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, 'utf-8');
  console.log('Escrito:', outPath);
});
