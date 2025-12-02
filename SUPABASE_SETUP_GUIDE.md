# Supabase Setup Guide - Step by Step

This guide walks you through setting up Supabase **before** you need to share your keys.

---

## 📋 Overview

You need to:
1. ✅ Create a Supabase project (if you don't have one)
2. ✅ Create the `nda_access` table
3. ✅ Set up security policies (RLS)
4. ✅ Get your API keys

**Time needed:** ~10 minutes

---

## Step 1: Create/Select Supabase Project

1. Go to **https://supabase.com** and log in
2. **If you don't have a project:**
   - Click **"New Project"** or **"New Project"** button
   - Enter project name: `spots-pitchdeck` (or any name you prefer)
   - Enter database password (save this somewhere safe - you won't need it for this project, but keep it for reference)
   - Select a region close to you
   - Click **"Create new project"**
   - Wait 2-3 minutes for project to initialize

3. **If you already have a project:**
   - Select it from your dashboard

---

## Step 2: Open SQL Editor

1. In your Supabase project dashboard, look for **"SQL Editor"** in the left sidebar
2. Click on it
3. Click **"New query"** button (top right)

---

## Step 3: Create the Database Table

Copy and paste this entire SQL script into the SQL Editor:

```sql
-- Create the nda_access table
CREATE TABLE nda_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  envelope_id VARCHAR(255) UNIQUE, -- Optional: not used with custom signatures, but kept for compatibility
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, expired
  access_token VARCHAR(255) UNIQUE, -- Generated token for access link
  token_expires_at TIMESTAMPTZ,
  nda_version VARCHAR(50) DEFAULT '1.0', -- Track NDA versions
  signed_at TIMESTAMPTZ, -- When NDA was signed
  accessed_at TIMESTAMPTZ, -- When user first accessed deck
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_nda_access_email ON nda_access(email);
CREATE INDEX idx_nda_access_envelope_id ON nda_access(envelope_id);
CREATE INDEX idx_nda_access_token ON nda_access(access_token);
CREATE INDEX idx_nda_access_status ON nda_access(status);

-- Enable Row Level Security (RLS)
ALTER TABLE nda_access ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (used by API routes)
CREATE POLICY "Service role full access" ON nda_access
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: No anonymous access (blocks direct public access)
CREATE POLICY "No anonymous access" ON nda_access
  FOR SELECT USING (false);
```

4. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
5. You should see a success message: ✅ "Success. No rows returned"

---

## Step 4: Verify Table Was Created

1. In the left sidebar, click **"Table Editor"**
2. You should see `nda_access` in the list of tables
3. Click on it to see the columns

**Expected columns:**
- `id` (uuid)
- `email` (varchar)
- `name` (varchar)
- `company` (varchar)
- `envelope_id` (varchar)
- `status` (varchar)
- `access_token` (varchar)
- `token_expires_at` (timestamptz)
- `nda_version` (varchar)
- `signed_at` (timestamptz)
- `accessed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

---

## Step 5: Get Your API Keys

1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"API"** in the settings menu
3. You'll see several values. You need these **3 keys**:

### a) Project URL
- Look for **"Project URL"** or **"Reference ID"**
- Copy this value
- Example: `https://abcdefghijklmnop.supabase.co`
- **Use this for:** `NEXT_PUBLIC_SUPABASE_URL`

### b) Anon/Public Key
- Look for **"anon"** or **"public"** key
- Click **"Reveal"** to see the full key
- Copy this long string (starts with `eyJ...`)
- **Use this for:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### c) Service Role Key (IMPORTANT - Keep Secret!)
- Look for **"service_role"** key
- ⚠️ **Warning:** This key has admin access. Never share it publicly!
- Click **"Reveal"** to see the full key
- Copy this long string (starts with `eyJ...`)
- **Use this for:** `SUPABASE_SERVICE_ROLE_KEY`
- **Keep this secret!** Only use in server-side code (which we do)

---

## Step 6: Add Keys to Your Project

Now you can add these keys to your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nfzlwgbvezwwrutqpedy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5MDUsImV4cCI6MjA3OTA4MTkwNX0.TimlFKPLvhF7NU1JmaiMVbkq0KxSJoiMlyhA8YIUef0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUwNTkwNSwiZXhwIjoyMDc5MDgxOTA1fQ.MuKjnwCzNMbpSaf440ANq7aox3hyQNPIU3qR8y7JEd4
```

**Where to find:**
- Open your project's `.env.local` file
- Replace the placeholder values with your actual keys from Step 5

---

## ✅ You're Done!

Once you've completed these steps:
- ✅ Table is created
- ✅ Security policies are set up
- ✅ You have all your API keys

**Next steps:**
- Add your Supabase keys to `.env.local`
- Set up Resend for emails (see `SETUP.md`)
- Test the flow!

---

## 🔒 Security Notes

### What is Row Level Security (RLS)?
RLS ensures that:
- ✅ Anonymous users cannot read/write directly to the database
- ✅ Only your server-side API routes (using service_role) can access the data
- ✅ This protects your data from unauthorized access

### Why Two Keys?
- **Anon Key**: Public key that can be exposed in client-side code (but RLS blocks direct access)
- **Service Role Key**: Secret admin key that bypasses RLS - **only use server-side!**

### Your Setup is Secure ✅
- Service role key is only used in API routes (server-side)
- RLS policies block anonymous access
- All database access goes through your secure API routes

---

## 🐛 Troubleshooting

### Table Already Exists Error
If you see "relation 'nda_access' already exists":
- The table might already be created
- Check Table Editor to verify
- If you want to recreate it, first run: `DROP TABLE nda_access CASCADE;`

### Can't Find API Keys
- Make sure you're in the **Settings → API** section
- Keys might be hidden - click **"Reveal"** buttons
- If you can't find them, you might not have the right permissions

### RLS Policy Error
If you get an error about policies:
- Make sure you ran ALL the SQL commands (including the CREATE POLICY commands)
- Try running them one section at a time
- Check that RLS is enabled: `ALTER TABLE nda_access ENABLE ROW LEVEL SECURITY;`

---

## 📚 Quick Reference

**Table Name:** `nda_access`

**Key Fields:**
- `email` - User's email address
- `status` - 'pending' or 'completed'
- `access_token` - Token for pitch deck access
- `signed_at` - When NDA was signed
- `accessed_at` - When user viewed the deck

**Environment Variables Needed:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

That's it! You're ready to use Supabase with your pitch deck website! 🚀

