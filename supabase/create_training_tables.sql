-- Create training_courses table
create table if not exists training_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  duration text,
  lessons integer,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create training_sessions table
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references training_courses(id) on delete cascade,
  date date not null,
  time time not null,
  duration integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
