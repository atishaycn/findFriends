create extension if not exists pgcrypto;

do $$
begin
  create type round_status as enum ('active', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type invite_status as enum ('pending', 'claimed', 'blocked_return', 'locked');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type connection_kind as enum ('tree', 'closing_loop');
exception
  when duplicate_object then null;
end $$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  prompt text,
  starter_participant_id uuid,
  status round_status not null default 'active',
  completed_at timestamptz,
  completion_connection_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  auth_user_id uuid not null,
  display_name text not null,
  email text not null,
  parent_participant_id uuid references participants(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (round_id, auth_user_id)
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  inviter_participant_id uuid not null references participants(id) on delete cascade,
  token text not null unique,
  status invite_status not null default 'pending',
  claimed_by_participant_id uuid references participants(id) on delete set null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  from_participant_id uuid not null references participants(id) on delete cascade,
  to_participant_id uuid not null references participants(id) on delete cascade,
  kind connection_kind not null,
  created_at timestamptz not null default now(),
  unique (round_id, from_participant_id, to_participant_id)
);

create unique index if not exists participants_round_lower_display_name_idx
  on participants (round_id, lower(display_name));

create index if not exists participants_auth_user_round_idx
  on participants (auth_user_id, round_id);

create index if not exists invites_round_inviter_idx
  on invites (round_id, inviter_participant_id, created_at desc);

create index if not exists connections_round_idx
  on connections (round_id, created_at asc);

do $$
begin
  alter table rounds
    add column prompt text;
exception
  when duplicate_column then null;
end $$;

do $$
begin
  alter table rounds
    add constraint rounds_starter_participant_id_fkey
    foreign key (starter_participant_id)
    references participants(id)
    on delete set null;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table rounds
    add constraint rounds_completion_connection_id_fkey
    foreign key (completion_connection_id)
    references connections(id)
    on delete set null;
exception
  when duplicate_object then null;
end $$;

drop trigger if exists rounds_set_updated_at on rounds;
create trigger rounds_set_updated_at
before update on rounds
for each row
execute function set_updated_at();
