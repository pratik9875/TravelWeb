-- Run this in Supabase: SQL Editor > New query > paste > Run

create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('hotel','restaurant')),
  city text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  price_min int,
  price_max int,
  tags text[] default '{}',
  why_we_picked text,
  phone text,
  photos text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now()
);

create index places_city_idx on places (city);
create index places_type_idx on places (type);

-- Row Level Security: public can read published places, nobody can write from the browser
alter table places enable row level security;

create policy "Public can read published places"
  on places for select
  using (is_published = true);
