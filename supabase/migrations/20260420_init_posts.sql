-- Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '익명',
    message TEXT NOT NULL,
    password TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public select" ON public.posts FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert" ON public.posts FOR INSERT WITH CHECK (true);

-- Allow public update access (Validation at application level)
CREATE POLICY "Allow public update" ON public.posts FOR UPDATE USING (true);

-- Allow public delete access (Validation at application level)
CREATE POLICY "Allow public delete" ON public.posts FOR DELETE USING (true);
