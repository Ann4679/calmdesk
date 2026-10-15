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
