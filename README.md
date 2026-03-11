# Personal portfolio

Portafolio estático con Astro. Contenido en `src/data/*.json`; imágenes y PDFs en `public/biblioteca/` (proyectos, certificados, cv).

## Comandos

- `npm run dev` — desarrollo (puerto 3333)
- `npm run build` — build para producción
- `npm run biblioteca` — regenera la lista de imágenes/PDFs para el admin

## Admin

Panel en `/admin-dashboard`. Login con Google; emails en `.dev.vars` (ALLOWED_ADMIN_EMAILS). Los cambios se editan en los JSON de `src/data` y se vuelve a desplegar.
