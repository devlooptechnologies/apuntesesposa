-- =============================================================
-- Esquema de base de datos para "Apuntes de Cultos"
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- Tabla de cultos (servicios/cultos registrados)
create table if not exists public.cultos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  fecha date not null default current_date,
  predicador text,
  lugar text,
  descripcion text,
  created_at timestamptz not null default now()
);

-- Tabla de citas bíblicas asociadas a un culto
create table if not exists public.citas_biblicas (
  id uuid primary key default gen_random_uuid(),
  culto_id uuid not null references public.cultos(id) on delete cascade,
  libro text not null,
  capitulo integer not null,
  versiculo_inicio integer not null,
  versiculo_fin integer,
  texto text,
  explicacion text,
  created_at timestamptz not null default now()
);

-- Índice para búsqueda rápida por culto
create index if not exists idx_citas_culto
  on public.citas_biblicas (culto_id);

-- Índice para ordenar cultos por fecha
create index if not exists idx_cultos_fecha
  on public.cultos (fecha desc);

-- =============================================================
-- Políticas de Row Level Security (RLS)
-- Permitir lectura pública (solo lectura) por defecto.
-- Descomenta la parte de autenticación si quieres escritura
-- protegida con login.
-- =============================================================

alter table public.cultos enable row level security;
alter table public.citas_biblicas enable row level security;

-- Lectura: cualquiera puede leer
create policy "Lectura pública de cultos"
  on public.cultos for select
  using (true);

create policy "Lectura pública de citas"
  on public.citas_biblicas for select
  using (true);

-- Escritura: anónima permitida (para demo).
-- Si usas autenticación, reemplaza las siguientes por:
--
--   create policy "Escritura autenticada de cultos"
--     on public.cultos for insert
--     to authenticated
--     with check (auth.uid() is not null);
--
--   create policy "Edición autenticada de cultos"
--     on public.cultos for update
--     to authenticated
--     using (auth.uid() is not null);
--
--   create policy "Eliminación autenticada de cultos"
--     on public.cultos for delete
--     to authenticated
--     using (auth.uid() is not null);
--
-- y lo mismo para citas_biblicas.

create policy "Escritura anónima de cultos"
  on public.cultos for insert
  to anon
  with check (true);

create policy "Edición anónima de cultos"
  on public.cultos for update
  to anon
  using (true);

create policy "Eliminación anónima de cultos"
  on public.cultos for delete
  to anon
  using (true);

create policy "Escritura anónima de citas"
  on public.citas_biblicas for insert
  to anon
  with check (true);

create policy "Edición anónima de citas"
  on public.citas_biblicas for update
  to anon
  using (true);

create policy "Eliminación anónima de citas"
  on public.citas_biblicas for delete
  to anon
  using (true);