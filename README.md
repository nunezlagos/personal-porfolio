# Personal Portfolio (Astro + Cloudflare D1)

Portafolio estático con Astro, base de datos D1 (SQLite en Cloudflare) y panel de administración con SSO Google.

## Estructura

- `src/layouts/` – Layouts (BaseLayout, AdminLayout)
- `src/components/` – Componentes reutilizables (Navbar, Home, About, Projects, etc.)
- `src/pages/` – Páginas y API (index, admin-dashboard, api/auth, api/sections)
- `src/css/` – Estilos (root, secciones, admin)
- `src/lib/` – Lógica compartida (db, auth, defaults)
- `public/` – Assets estáticos (js, css/plugins, images, fonts)
- `schema.sql` / `seed.sql` – Esquema y datos iniciales D1

## Requisitos

- Node 18+
- Cuenta Cloudflare (para D1 en producción)
- Google Cloud: crear credenciales OAuth 2.0 (tipo “Aplicación web”) para SSO

## Instalación

```bash
npm install
```

## Variables de entorno (nunca subas secretos al repo)

Copia `.dev.vars.example` a `.dev.vars` y rellena:

- `GOOGLE_CLIENT_ID` – ID de cliente OAuth de Google
- `GOOGLE_CLIENT_SECRET` – Secreto del cliente (guárdalo solo en .dev.vars o en Cloudflare Dashboard)
- `SESSION_SECRET` – Clave para firmar la sesión (ej: `openssl rand -hex 32`)
- `PUBLIC_APP_URL` – URL de la app (en local: `http://localhost:3333`, para que coincida con el SSO)

**Importante seguridad:** No subas nunca `.env` ni `.dev.vars` al repositorio. Si en algún momento expusiste el **Secreto del cliente** de Google (por ejemplo en un chat o en un commit), debes ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → tu cliente OAuth → generar un **nuevo secreto** y revocar el anterior. El ID de cliente puede quedarse igual.

## Base de datos (D1 / SQLite local)

Crear tablas y datos iniciales en local:

```bash
npm run db:local:create
npm run db:local:seed
```

Para permitir tu correo en el panel admin, ejecuta en la base local (o en D1 por Dashboard):

```sql
INSERT INTO admin_users (email) VALUES ('tu-email@gmail.com');
```

En producción (D1 remoto):

```bash
npm run db:remote:create
npm run db:remote:seed
```

## Desarrollo local

```bash
npm run dev
```

La app corre en **http://localhost:3333**. El panel admin está en http://localhost:3333/admin-dashboard.

Para que el SSO con Google funcione en local:
1. En Google Cloud Console → Credenciales → tu cliente OAuth 2.0 → “URIs de redirección autorizados” agrega: `http://localhost:3333/api/auth/callback`
2. En `.dev.vars` define `PUBLIC_APP_URL=http://localhost:3333`

## Build y preview

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test
npm run test:coverage
```

Incluyen pruebas de auth, sanitización y cobertura de `src/lib`.

## Despliegue en Cloudflare

1. Conectar el repo a Cloudflare Pages (o Workers).
2. Configurar la base D1 `personal-portfolio` y enlazarla al binding `DB` en el proyecto.
3. Añadir en “Settings > Environment variables” (o Secrets):  
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `PUBLIC_APP_URL`.
4. En “Authorized redirect URIs” de Google OAuth, añadir:  
   `https://tu-dominio.com/api/auth/callback`.

## Rutas

- `/` – Portafolio (datos desde D1 o valores por defecto)
- `/admin-dashboard` – Login con Google y resumen
- `/admin-dashboard/sections` – Listado de secciones
- `/admin-dashboard/sections/[key]` – Editar sección (JSON)
- `/api/auth/login` – Redirige a Google OAuth
- `/api/auth/callback` – Callback OAuth, crea sesión
- `/api/auth/logout` – Cierra sesión
- `/api/sections/[key]` – GET (lectura) / PUT (actualizar, requiere sesión)
