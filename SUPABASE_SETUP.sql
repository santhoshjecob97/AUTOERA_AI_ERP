-- 1. Enable Row Level Security (RLS)
-- This ensures users can ONLY see their own data.

-- Create profiles table (links to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  business_name text,
  role text default 'dealer_admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create service_jobs table
create table public.service_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  customer_name text not null,
  vehicle_model text not null,
  issue text,
  status text default 'Pending',
  priority text default 'Medium',
  technician text,
  bay text,
  estimated_cost numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.service_jobs enable row level security;

create policy "Users can view own jobs" on public.service_jobs
  for select using (auth.uid() = user_id);

create policy "Users can insert own jobs" on public.service_jobs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own jobs" on public.service_jobs
  for update using (auth.uid() = user_id);

-- Create database function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, business_name)
  values (new.id, new.email, new.raw_user_meta_data->>'business_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
