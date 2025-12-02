# ⚠️ CRITICAL: Add Environment Variables in Vercel

## 🚨 Error You're Seeing

```
Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

This means **environment variables are not set in Vercel**!

---

## ✅ Quick Fix

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your **"spots-website"** project

2. **Add Environment Variables:**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar
   - Add each variable below

3. **For Each Variable:**
   - Click **"Add New"**
   - Enter the **Key** (name)
   - Enter the **Value**
   - **IMPORTANT:** Check all three boxes:
     - ☑️ Production
     - ☑️ Preview  
     - ☑️ Development
   - Click **"Save"**

---

## 📋 Required Environment Variables

Copy and paste these **EXACTLY**:

```
NEXT_PUBLIC_SUPABASE_URL
```
Value:
```
https://nfzlwgbvezwwrutqpedy.supabase.co
```

---

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5MDUsImV4cCI6MjA3OTA4MTkwNX0.TimlFKPLvhF7NU1JmaiMVbkq0KxSJoiMlyhA8YIUef0
```

---

```
SUPABASE_SERVICE_ROLE_KEY
```
Value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUwNTkwNSwiZXhwIjoyMDc5MDgxOTA1fQ.MuKjnwCzNMbpSaf440ANq7aox3hyQNPIU3qR8y7JEd4
```

---

```
RESEND_API_KEY
```
Value:
```
re_S3xff6Rx_ETjFYZub5MzzAT1ZjhUJeF9G
```

---

```
RESEND_FROM_EMAIL
```
Value:
```
onboarding@resend.dev
```

---

```
OWNER_EMAIL
```
Value:
```
reisjgordon@gmail.com
```

---

```
NDA_VERSION
```
Value:
```
2
```

---

```
ACCESS_TOKEN_EXPIRY_DAYS
```
Value:
```
30
```

---

```
SESSION_COOKIE_NAME
```
Value:
```
spots_nda_session
```

---

## ✅ After Adding Variables

1. **Redeploy:**
   - Go to **"Deployments"** tab
   - Click the **three dots** (⋯) on the latest deployment
   - Click **"Redeploy"**

   OR

   - Make a small change and push to GitHub (triggers auto-deploy)

2. **Test:**
   - Try the `/api/request-access` endpoint again
   - It should work now!

---

## 🔍 How to Verify Variables Are Set

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see all 9 variables listed
3. Each should show: `Production`, `Preview`, `Development` checked

---

## ⚠️ Common Mistakes

- ❌ Only adding to Production (need all three)
- ❌ Typos in variable names (case-sensitive!)
- ❌ Extra spaces or quotes around values
- ❌ Missing the `https://` in the Supabase URL

---

**Once you add these and redeploy, the error will be fixed!** 🚀

