-- Enable RLS on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Allow public read" ON public.posts FOR SELECT USING (true);

-- Allow anyone to insert posts
CREATE POLICY "Allow public insert" ON public.posts FOR INSERT WITH CHECK (true);

-- Allow public to update posts (The app handles password validation in frontend)
CREATE POLICY "Allow public update" ON public.posts FOR UPDATE USING (true);

-- Allow public to delete posts (The app handles password validation in frontend)
CREATE POLICY "Allow public delete" ON public.posts FOR DELETE USING (true);
