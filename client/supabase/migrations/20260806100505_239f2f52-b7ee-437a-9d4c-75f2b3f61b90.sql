-- roles
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles_select_own" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- certificates
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  player_name text not null,
  quiz_id text not null,
  quiz_title text not null,
  level_name text not null,
  category text not null,
  score integer not null,
  max_score integer not null,
  percentage integer not null,
  issued_at timestamptz not null default now()
);
create index certificates_user_idx on public.certificates(user_id);
grant select, insert on public.certificates to authenticated;
grant select on public.certificates to anon;
grant all on public.certificates to service_role;
alter table public.certificates enable row level security;
create policy "certificates_public_verify" on public.certificates for select to anon, authenticated using (true);
create policy "certificates_insert_own" on public.certificates for insert to authenticated with check (auth.uid() = user_id);

-- progress
create table public.quiz_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  mode text not null default 'full',
  seed text,
  answers jsonb not null default '{}'::jsonb,
  flagged jsonb not null default '[]'::jsonb,
  current_index integer not null default 0,
  elapsed_seconds integer not null default 0,
  version integer not null default 1,
  device_label text,
  updated_at timestamptz not null default now(),
  unique (user_id, quiz_id)
);
grant select, insert, update, delete on public.quiz_progress to authenticated;
grant all on public.quiz_progress to service_role;
alter table public.quiz_progress enable row level security;
create policy "quiz_progress_own" on public.quiz_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- admin authored content
create table public.custom_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  level_id text not null,
  level_name text not null,
  title text not null,
  description text not null default '',
  category text not null default 'General',
  difficulty text not null default 'Medium',
  topic text not null default 'General',
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.custom_sections to anon, authenticated;
grant insert, update, delete on public.custom_sections to authenticated;
grant all on public.custom_sections to service_role;
alter table public.custom_sections enable row level security;
create policy "custom_sections_read_published" on public.custom_sections for select to anon, authenticated using (published = true);
create policy "custom_sections_admin_read" on public.custom_sections for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "custom_sections_admin_write" on public.custom_sections for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "custom_sections_admin_update" on public.custom_sections for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "custom_sections_admin_delete" on public.custom_sections for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.custom_questions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.custom_sections(id) on delete cascade,
  text text not null,
  options jsonb not null,
  correct_option_index integer not null default 0,
  explanation text not null default '',
  difficulty text not null default 'Medium',
  topic text not null default 'General',
  published boolean not null default true,
  position integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index custom_questions_section_idx on public.custom_questions(section_id);
grant select on public.custom_questions to anon, authenticated;
grant insert, update, delete on public.custom_questions to authenticated;
grant all on public.custom_questions to service_role;
alter table public.custom_questions enable row level security;
create policy "custom_questions_read_published" on public.custom_questions for select to anon, authenticated using (published = true);
create policy "custom_questions_admin_read" on public.custom_questions for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "custom_questions_admin_write" on public.custom_questions for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "custom_questions_admin_update" on public.custom_questions for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "custom_questions_admin_delete" on public.custom_questions for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger custom_sections_touch before update on public.custom_sections for each row execute function public.touch_updated_at();
create trigger custom_questions_touch before update on public.custom_questions for each row execute function public.touch_updated_at();
create trigger quiz_progress_touch before update on public.quiz_progress for each row execute function public.touch_updated_at();