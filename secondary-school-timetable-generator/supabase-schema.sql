-- School Management System Database Schema
-- Run this SQL in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher',
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  teacher_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  term TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Duty reports table
CREATE TABLE IF NOT EXISTS duty_reports (
  id TEXT PRIMARY KEY,
  teacher_name TEXT NOT NULL,
  date TEXT NOT NULL,
  present_count INTEGER DEFAULT 0,
  absent_count INTEGER DEFAULT 0,
  events_summary TEXT,
  day_end_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Release state table
CREATE TABLE IF NOT EXISTS release_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT UNIQUE NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simplicity (all users can read/write)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE duty_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE release_state DISABLE ROW LEVEL SECURITY;

-- Insert default admin
INSERT INTO users (id, name, username, password, role, subjects)
VALUES ('admin-1', 'Academic Admin', 'admin', 'admin123', 'admin', '{}')
ON CONFLICT (id) DO NOTHING;
