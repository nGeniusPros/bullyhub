create table public.social_posts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    dog_id uuid references public.dogs(id),
    post_text text not null,
    platforms text[] not null,
    media_urls text[],
    ayrshare_post_id text,
    status text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.social_posts enable row level security;

create policy "Users can view their own social posts"
    on public.social_posts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own social posts"
    on public.social_posts for insert
    with check (auth.uid() = user_id);