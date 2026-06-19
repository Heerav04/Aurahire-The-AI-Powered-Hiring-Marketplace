-- ==========================================
-- AuraHire Supabase Production Schema
-- ==========================================

-- 1. Enable pgvector for Semantic Search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('seeker', 'recruiter')) NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  employment_type TEXT,
  salary_range TEXT,
  description TEXT NOT NULL,
  embedding vector(1024), -- embedding dimension size
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) NOT NULL,
  seeker_id UUID REFERENCES profiles(id) NOT NULL,
  resume_url TEXT NOT NULL,
  ai_match_score INTEGER CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
  ai_match_reason TEXT,
  extracted_skills JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- 5. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 6. Define Policies for Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Define Policies for Jobs
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Recruiters can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

-- 8. Define Policies for Applications
CREATE POLICY "Seekers can view own applications" ON applications FOR SELECT USING (auth.uid() = seeker_id);
CREATE POLICY "Recruiters can view applications for their jobs" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
);
CREATE POLICY "Seekers can insert applications" ON applications FOR INSERT WITH CHECK (auth.uid() = seeker_id);

-- ==========================================
-- Manual Step Reminder:
-- Remember to create the "resumes" Storage Bucket in the Supabase Dashboard and ensure it is marked as Private.
-- ==========================================
