-- Éco-Score Web: Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  total_weight_mb DECIMAL(10,4) NOT NULL,
  total_requests INTEGER NOT NULL DEFAULT 0,
  js_size_kb DECIMAL(10,2) DEFAULT 0,
  css_size_kb DECIMAL(10,2) DEFAULT 0,
  image_size_kb DECIMAL(10,2) DEFAULT 0,
  performance_score INTEGER DEFAULT 0,
  energy_kwh DECIMAL(10,6) NOT NULL,
  co2_grams DECIMAL(10,4) NOT NULL,
  eco_score INTEGER NOT NULL CHECK (eco_score >= 0 AND eco_score <= 100),
  rating TEXT NOT NULL CHECK (rating IN ('green', 'moderate', 'heavy')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own scans
CREATE POLICY "Users read own scans"
  ON public.scans FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert scans
CREATE POLICY "Users insert own scans"
  ON public.scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own scans
CREATE POLICY "Users delete own scans"
  ON public.scans FOR DELETE
  USING (auth.uid() = user_id);

-- Public scans readable by anyone (for shareable links)
CREATE POLICY "Public scans are readable"
  ON public.scans FOR SELECT
  USING (is_public = true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_public ON public.scans(id) WHERE is_public = true;
