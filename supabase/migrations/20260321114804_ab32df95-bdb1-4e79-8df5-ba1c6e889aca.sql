
-- CRM Guests
create table public.crm_guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_e164 text not null unique,
  wa_id text,
  language text default 'nl',
  email text,
  notes text,
  opted_in_marketing boolean default false,
  opted_in_at timestamptz,
  booking_id uuid references public.bookings(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.crm_guests enable row level security;
create policy "Authenticated users can manage crm_guests" on public.crm_guests for all to authenticated using (true) with check (true);

-- CRM Conversations
create table public.crm_conversations (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.crm_guests(id) on delete cascade,
  status text not null default 'active',
  channel text not null default 'whatsapp',
  csw_expires_at timestamptz,
  last_message_at timestamptz,
  unread_count integer default 0,
  created_at timestamptz default now()
);
alter table public.crm_conversations enable row level security;
create policy "Authenticated users can manage crm_conversations" on public.crm_conversations for all to authenticated using (true) with check (true);

-- CRM Messages
create table public.crm_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.crm_conversations(id) on delete cascade,
  wamid text,
  direction text not null,
  message_type text not null default 'text',
  content text,
  metadata jsonb default '{}',
  status text default 'sent',
  sent_at timestamptz default now(),
  delivered_at timestamptz,
  read_at timestamptz
);
alter table public.crm_messages enable row level security;
create policy "Authenticated users can manage crm_messages" on public.crm_messages for all to authenticated using (true) with check (true);

-- Enable realtime for messages
alter publication supabase_realtime add table crm_messages;

-- CRM Templates
create table public.crm_templates (
  id uuid primary key default gen_random_uuid(),
  template_name text not null unique,
  category text not null,
  language text not null default 'nl',
  status text default 'pending',
  body_text text,
  header_type text,
  buttons jsonb default '[]',
  last_synced_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table public.crm_templates enable row level security;
create policy "Authenticated users can manage crm_templates" on public.crm_templates for all to authenticated using (true) with check (true);

-- Integration Configs
create table public.integration_configs (
  id uuid primary key default gen_random_uuid(),
  integration_type text not null unique,
  display_name text not null,
  status text not null default 'disconnected',
  config jsonb default '{}',
  last_health_check timestamptz,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.integration_configs enable row level security;
create policy "Authenticated users can manage integration_configs" on public.integration_configs for all to authenticated using (true) with check (true);

-- Seed integration configs
insert into public.integration_configs (integration_type, display_name, status) values
  ('whatsapp', 'WhatsApp Cloud API', 'disconnected'),
  ('n8n', 'N8N Automations', 'disconnected'),
  ('email', 'E-mail (SMTP)', 'disconnected'),
  ('payments', 'Betalingen', 'disconnected'),
  ('calendar', 'Kalender', 'disconnected');

-- Increment unread RPC
create or replace function public.increment_unread(conv_id uuid)
returns void as $$
  update crm_conversations
  set unread_count = unread_count + 1
  where id = conv_id;
$$ language sql security definer set search_path = public;
