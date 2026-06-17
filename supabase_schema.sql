-- Supabase SQL Database Schema & Seed Script
-- -------------------------------------------------------------
-- Instructions:
-- 1. Open your Supabase Project Dashboard.
-- 2. Go to the "SQL Editor" page from the left navigation.
-- 3. Click "New query".
-- 4. Paste this entire file contents into the editor and click "Run".
-- -------------------------------------------------------------

-- 1. Profiles Table
-- Holds application roles and additional farmer profile parameters
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text check (role in ('farmer', 'expert', 'admin')) default 'farmer',
  avatar text,
  language text default 'en',
  phone text,
  state text,
  district text,
  village text,
  farm_size text,
  crops text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Crop Diagnosis Scans Table
create table if not exists public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  crop text not null,
  disease text not null,
  confidence numeric not null,
  severity text not null,
  status text not null,
  img text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on scans
alter table public.scans enable row level security;

create policy "Users can view their own scans." on public.scans
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own scans." on public.scans
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own scans." on public.scans
  for update using (auth.uid() = user_id or user_id is null);

-- 3. Voice Consultation Logs Table
create table if not exists public.voice_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  query text not null,
  response text not null,
  lang text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on voice_logs
alter table public.voice_logs enable row level security;

create policy "Users can view their own voice logs." on public.voice_logs
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own voice logs." on public.voice_logs
  for insert with check (auth.uid() = user_id or user_id is null);

-- 4. Alerts & Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  type text not null,
  sev text not null,
  title text not null,
  msg text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications." on public.notifications
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can update their own notifications." on public.notifications
  for update using (auth.uid() = user_id or user_id is null);

-- 5. Expert Review Queue Table
create table if not exists public.expert_queries (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references public.profiles(id) on delete set null,
  farmer_name text not null,
  crop text not null,
  disease text not null,
  conf numeric not null,
  query text not null,
  status text not null check (status in ('pending', 'answered')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on expert_queries
alter table public.expert_queries enable row level security;

create policy "Expert queries viewable by authenticated users." on public.expert_queries
  for select using (auth.role() = 'authenticated' or farmer_id is null);

create policy "Farmers can insert queries." on public.expert_queries
  for insert with check (auth.uid() = farmer_id or farmer_id is null);

create policy "Experts can update queries." on public.expert_queries
  for update using (true);

-- 6. Trigger for Automatic Profile Creation on auth.users Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, avatar, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New Farmer'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'farmer'),
    coalesce(new.raw_user_meta_data->>'avatar', 'RK'),
    coalesce(new.raw_user_meta_data->>'language', 'en')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Bind the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Seed Initial Mock Data
-- Seeds rows with null user_id so they are globally readable as demo records
insert into public.scans (crop, disease, confidence, severity, status, img) values
('Tomato', 'Late Blight', 96, 'High', 'treated', 'photo-1416879595882-3373a0480b5b'),
('Onion', 'Purple Blotch', 88, 'Medium', 'consulting', 'photo-1416879595882-3373a0480b5b'),
('Tomato', 'Healthy', 99, 'None', 'healthy', 'photo-1464226184884-fa280b87c399'),
('Wheat', 'Rust', 92, 'High', 'treated', 'photo-1500651230702-0e2d8a49d4ad');

insert into public.voice_logs (query, response, lang) values
('Tomato leaves turning yellow, what should I do?', 'Yellow leaves on tomatoes may indicate nitrogen deficiency or early blight. Check for spots — if present, apply Mancozeb 2g/L. If no spots, apply 19:19:19 NPK fertilizer.', 'Hindi'),
('When is the best time to spray fungicide?', 'Spray fungicide in the early morning (before 9 AM) or late evening (after 5 PM) to avoid evaporation and ensure maximum absorption. Avoid spraying if rain is forecast within 4 hours.', 'Hindi'),
('What fertilizer for onions before harvest?', 'Stop nitrogen fertilizers 3 weeks before harvest. Apply potassium sulphate (SOP) at 50kg/acre to improve bulb size and shelf life.', 'Hindi');

insert into public.notifications (type, sev, title, msg, read) values
('weather', 'high', 'Rain Alert', 'Heavy rain expected Tue–Wed. Avoid all spraying.', false),
('price', 'medium', 'Tomato Prices Up', 'Tomato prices at Vashi APMC up ₹240/qtl today.', false),
('disease', 'high', 'Late Blight Alert', 'Outbreak reported in Nashik district. Check your crops.', false),
('system', 'low', 'Scan Complete', 'Your Tomato scan result is ready to view.', true),
('price', 'low', 'Market Update', 'Onion prices dropped ₹80/qtl at Azadpur.', true),
('system', 'low', 'Profile Updated', 'Your farm profile was updated successfully.', true);

insert into public.expert_queries (farmer_name, crop, disease, conf, query, status) values
('Ramesh Kumar', 'Tomato', 'Late Blight', 88, 'Brown spots spreading fast. Is it Late Blight?', 'pending'),
('Priya Devi', 'Chilli', 'Leaf Curl', 82, 'Leaves curling inward. Used neem oil, no effect.', 'pending'),
('Sukhwinder S.', 'Wheat', 'Yellow Rust', 91, 'Yellow streaks on leaves. Spreading to nearby rows.', 'answered'),
('Kavitha Reddy', 'Cotton', 'Bollworm', 86, 'Small holes in bolls. Worms visible.', 'answered');
