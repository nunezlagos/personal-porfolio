import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const outPath = join(root, 'src', 'data', 'biblioteca.json');

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const PDF_EXT = ['.pdf'];

function listImages(dir, baseUrl) {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir, { withFileTypes: true });
  return files
    .filter((f) => f.isFile() && IMG_EXT.some((e) => f.name.toLowerCase().endsWith(e)))
    .map((f) => baseUrl + '/' + encodeURIComponent(f.name));
}

function listPdfs(dir, baseUrl) {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir, { withFileTypes: true });
  return files
    .filter((f) => f.isFile() && PDF_EXT.some((e) => f.name.toLowerCase().endsWith(e)))
    .map((f) => baseUrl + '/' + encodeURIComponent(f.name));
}

const proyectosDir = join(publicDir, 'biblioteca', 'proyectos');
const certificadosDir = join(publicDir, 'biblioteca', 'certificados');
const cvDir = join(publicDir, 'biblioteca', 'cv');

const data = {
  proyectos: listImages(proyectosDir, '/biblioteca/proyectos'),
  certificados: listImages(certificadosDir, '/biblioteca/certificados'),
  cv: listPdfs(cvDir, '/biblioteca/cv'),
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('Escrito:', outPath);
