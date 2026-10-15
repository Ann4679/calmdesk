/*
# CalmDesk — Create tables for tasks, journal entries, check-ins, and profiles

This migration creates the four core tables for the CalmDesk productivity app.
Each table is owner-scoped (multi-user with sign-in), so every user sees only their own data.

## 1. New Tables

### tasks
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), references auth.users, cascades on delete)
- `title` (text, not null)
- `description` (text, defaults to empty string)
- `priority` (text, not null — 'High' | 'Medium' | 'Low')
- `status` (text, not null — 'In Progress' | 'To Do' | 'Completed')
- `due_date` (date, not null)
- `created_at` (timestamptz, defaults to now())

### journal_entries
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), references auth.users, cascades on delete)
- `title` (text, not null)
- `body` (text, not null)
- `entry_date` (date, not null)
- `created_at` (timestamptz, defaults to now())

### check_ins
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), references auth.users, cascades on delete)
- `entry_date` (date, not null)
- `mood` (integer, 1-5, not null)
- `energy` (integer, 1-5, not null)
- `note` (text, defaults to empty string)
- `created_at` (timestamptz, defaults to now())
- Unique constraint on (user_id, entry_date) — one check-in per day

### profiles
- `id` (uuid, primary key — matches auth.users.id)
- `display_name` (text, not null, defaults to 'User')
- `subtitle` (text, not null, defaults to 'STUDENT')
- `avatar` (text, not null — URL or base64 data URI, defaults to a placeholder)
- `updated_at` (timestamptz, defaults to now())

## 2. Security — Row Level Security

All tables have RLS enabled with owner-scoped policies (4 per table: SELECT, INSERT, UPDATE, DELETE).
Policies use auth.uid() = user_id for ownership checks.
The profiles table uses auth.uid() = id since its primary key IS the user's auth id.
All policies are scoped TO authenticated.

## 3. Indexes

- tasks(user_id) — for filtering tasks by owner
- journal_entries(user_id) — for filtering entries by owner
- check_ins(user_id) — for filtering check-ins by owner

## 4. Important Notes

1. user_id columns default to auth.uid() so inserts that omit user_id succeed.
2. profiles table does NOT have a user_id column — its `id` IS the auth user id.
3. One check-in per day enforced via unique constraint on (user_id, entry_date).
*/

-- ==================== TASKS ====================
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status text NOT NULL CHECK (status IN ('In Progress', 'To Do', 'Completed')),
  due_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tasks" ON tasks;
CREATE POLICY "select_own_tasks" ON tasks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tasks" ON tasks;
CREATE POLICY "insert_own_tasks" ON tasks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tasks" ON tasks;
CREATE POLICY "update_own_tasks" ON tasks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tasks" ON tasks;
CREATE POLICY "delete_own_tasks" ON tasks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- ==================== JOURNAL_ENTRIES ====================
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  entry_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_journal" ON journal_entries;
CREATE POLICY "select_own_journal" ON journal_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_journal" ON journal_entries;
CREATE POLICY "insert_own_journal" ON journal_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_journal" ON journal_entries;
CREATE POLICY "update_own_journal" ON journal_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_journal" ON journal_entries;
CREATE POLICY "delete_own_journal" ON journal_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_journal_user_id ON journal_entries(user_id);

-- ==================== CHECK_INS ====================
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 5),
  energy integer NOT NULL CHECK (energy >= 1 AND energy <= 5),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checkins" ON check_ins;
CREATE POLICY "select_own_checkins" ON check_ins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checkins" ON check_ins;
CREATE POLICY "insert_own_checkins" ON check_ins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checkins" ON check_ins;
CREATE POLICY "update_own_checkins" ON check_ins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checkins" ON check_ins;
CREATE POLICY "delete_own_checkins" ON check_ins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON check_ins(user_id);

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'User',
  subtitle text NOT NULL DEFAULT 'STUDENT',
  avatar text NOT NULL DEFAULT 'https://i.pravatar.cc/150?img=12',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- No DELETE policy: profiles are removed via auth.users cascade, not by the client.