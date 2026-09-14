# Apuntes de Cultos

Aplicación web estilo blog para registrar **cultos**, junto con cada **cita bíblica** y su **explicación/apunte**. Lista para conectarse a [Supabase](https://supabase.com).

## Funcionalidades

- Crear y listar cultos (título, fecha, predicador, lugar, descripción).
- Agregar varias citas bíblicas a un culto (libro, capítulo, versículos, texto del pasaje y explicación).
- Eliminar citas y cultos.
- Búsqueda por título, predicador o lugar.
- Diseño limpio tipo blog, responsive.

## Stack

- React 19 + TypeScript + Vite
- React Router
- Supabase (PostgreSQL + RLS)

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear la base de datos en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre **SQL Editor** y ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
   - Crea las tablas `cultos` y `citas_biblicas`.
   - Activa Row Level Security con políticas de lectura pública y escritura anónima (demo).
   - Para usar autenticación, reemplaza las políticas de escritura anónima por las de `authenticated` que vienen comentadas en el archivo.

### 3. Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
copy .env.example .env
```

Abre `.env` y pega tus claves (Supabase Dashboard > **Project Settings > API**):

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU-ANON-KEY
```

> La app funciona en modo "solo lectura" si no configuras Supabase, avisándote con un banner.

### 4. Ejecutar

```bash
npm run dev
```

## Estructura

```
supabase/schema.sql       # Esquema SQL + políticas RLS
src/
  lib/supabase.ts         # Cliente de Supabase
  types/index.ts          # Tipos (Culto, CitaBiblica)
  hooks/useCultos.ts      # Hooks y operaciones CRUD
  components/             # Header, CultoCard, CitaBiblicaForm/Card
  pages/                  # Home, CrearCulto, CultoDetalle
```

## Despliegue

Puedes publicar en cualquier hosting de estáticos: [Netlify](https://netlify.com), [Vercel](https://vercel.com) o [Cloudflare Pages](https://pages.cloudflare.com), con `npm run build` y la carpeta `dist` como salida.