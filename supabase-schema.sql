-- ============================================================
-- CASTING APP — Supabase Schema
-- Run this in Supabase SQL Editor (once)
-- ============================================================

-- Admins table
create table admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz default now()
);

-- Talents table
create table talents (
  id uuid primary key default gen_random_uuid(),
  sheet_row_id text unique,        -- timestamp from Google Sheets (dedup key)
  timestamp text,
  nama text not null,
  ttl text,
  age int,
  gender text,
  email text,
  telp text,
  alamat text,
  pendidikan text,
  tinggi numeric,
  berat numeric,
  rambut text,
  mata text,
  baju text,
  sepatu text,
  pengalaman_info text,
  pengalaman_akting text,
  pengalaman_vo text,
  bahasa text,
  keterampilan text,
  link_portofolio text,
  sosmed text,
  -- Admin-managed fields
  foto_link text default '',
  video_link text default '',
  status text not null default 'Baru'
    check (status in ('Baru', 'Dipanggil', 'Lolos', 'Tidak Lolos', 'On Hold')),
  catatan text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tahun int not null,
  deskripsi text default '',
  tipe text default '',
  status text default 'Aktif',
  created_at timestamptz default now()
);

-- Talent ↔ Project junction
create table talent_projects (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid references talents(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  role text default '',
  catatan_project text default '',
  terpilih boolean default false,
  created_at timestamptz default now(),
  unique(talent_id, project_id)
);

-- Indexes for filtering performance
create index on talents(status);
create index on talents(gender);
create index on talents(age);
create index on talents(tinggi);
create index on talents(berat);
create index on talents(nama);

-- Disable Row Level Security for server-side (service key bypasses anyway)
alter table admins disable row level security;
alter table talents disable row level security;
alter table projects disable row level security;
alter table talent_projects disable row level security;

-- ============================================================
-- SEED: Insert first admin
-- Replace password_hash with bcrypt hash of your password
-- Generate at: https://bcrypt-generator.com (rounds=12)
-- ============================================================
-- insert into admins (username, password_hash, role)
-- values ('admin', '$2a$12$YOUR_BCRYPT_HASH_HERE', 'admin');

-- Or use the /api/auth/setup-admin endpoint (recommended)
