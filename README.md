# Personal portfolio

Portafolio estático con Astro. Contenido en `src/data/*.json`; imágenes y PDFs en `public/biblioteca/` (proyectos, certificados, cv).

## Instalación

```bash
bun install
# o, si usas npm y en PowerShell da error de "ejecución de scripts":
# cmd /c "npm install"
```

## Comandos

- `bun run dev` o `npm run dev` — desarrollo (puerto 3333)
- `bun run build` o `npm run build` — build para producción
- `bun run biblioteca` — regenera la lista de imágenes/PDFs en `src/data/biblioteca.json`
- `bun run robots` — regenera `public/robots.txt`

El contenido del sitio sale **solo** de los JSON en `src/data` (head, home, about, projects, certifications, experiences, etc.). No hay datos por defecto en código; editá los JSON y volvé a hacer build y desplegar.

### Proyectos (`projects.json`)

Opcional por ítem: **`videoUrl`** (YouTube u otro) para el botón «Video explicativo» en el modal. **`url`** → Sitio, **`repository`** → Código.

### Experiencia laboral (`experiences.json`)

Cada trabajo puede incluir `highlights`: estudios, titulaciones, certificados o proyectos en paralelo. Usá **`dateFrom`** y **`dateTo`** (igual que el trabajo) para mostrar el rango en el timeline. Si solo tenés una fecha, podés usar **`date`** como texto libre.

### Contacto

El modal de contacto abre **WhatsApp** (`wa.me`) con mensaje prefijado. Número y texto están en `ContactModal.astro` (`waPhone`, `waMessage`).
