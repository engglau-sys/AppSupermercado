-- ==============================================================================
-- SCHEMA SUPABASE PARA APPSUPERMERCADO
-- Executar este script no SQL Editor do Supabase para configurar a base de dados
-- ==============================================================================

-- 1. Ativar extensões necessárias
create extension if not exists "uuid-ossp";

-- 2. Tabela de Famílias
create table if not exists public.families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Utilizadores / Membros de Família
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references public.families(id) on delete cascade not null,
  name text not null,
  avatar_color text not null default '#2E7D32',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Itens da Lista de Compras
create table if not exists public.shopping_items (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references public.families(id) on delete cascade not null,
  name text not null,
  quantity numeric(8, 2) not null default 1,
  unit text not null default 'un',
  category text not null check (category in (
    'Lacticínios',
    'Fruta',
    'Legumes',
    'Carne',
    'Peixe',
    'Congelados',
    'Bebidas',
    'Limpeza',
    'Higiene',
    'Outros'
  )),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_purchased boolean not null default false,
  purchased_by uuid references public.users(id) on delete set null,
  purchased_at timestamp with time zone,
  notes text
);

-- 5. Índices de Desempenho
create index if not exists idx_shopping_items_family on public.shopping_items(family_id);
create index if not exists idx_shopping_items_status on public.shopping_items(is_purchased);
create index if not exists idx_shopping_items_category on public.shopping_items(category);

-- 6. Políticas de Segurança (Row Level Security - RLS)
alter table public.families enable row level security;
alter table public.users enable row level security;
alter table public.shopping_items enable row level security;

-- Política de leitura/escrita aberta para os membros (configurável com Supabase Auth)
create policy "Acesso a itens da família" on public.shopping_items
  for all using (true) with check (true);

create policy "Acesso a membros da família" on public.users
  for all using (true) with check (true);

create policy "Acesso a famílias" on public.families
  for all using (true) with check (true);
