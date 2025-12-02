# Deploy to Vercel - Quick Guide

## ✅ GitHub Repository Ready!

**Repository:** https://github.com/reis-ship-it/spots-website

---

## 🚀 Deploy to Vercel (5 minutes)

### Option 1: Import from GitHub (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign in (use GitHub to connect your account)

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Find **"spots-website"** in your GitHub repositories
   - Click **"Import"**

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **`./`** (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables:**
   Click **"Environment Variables"** and add ALL these:

   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://nfzlwgbvezwwrutqpedy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5MDUsImV4cCI6MjA3OTA4MTkwNX0.TimlFKPLvhF7NU1JmaiMVbkq0KxSJoiMlyhA8YIUef0
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memx3Z2J2ZXp3d3J1dHFwZWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUwNTkwNSwiZXhwIjoyMDc5MDgxOTA1fQ.MuKjnwCzNMbpSaf440ANq7aox3hyQNPIU3qR8y7JEd4

   # Resend
   RESEND_API_KEY=re_S3xff6Rx_ETjFYZub5MzzAT1ZjhUJeF9G
   RESEND_FROM_EMAIL=onboarding@resend.dev

   # Owner Email
   OWNER_EMAIL=reisjgordon@gmail.com

   # App Config
   NDA_VERSION=2
   ACCESS_TOKEN_EXPIRY_DAYS=30
   SESSION_COOKIE_NAME=spots_nda_session
   ```

   **⚠️ Important:** Make sure to add these for **Production, Preview, and Development** environments.

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://spots-website-xxxxx.vercel.app`

---

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
cd "/Users/reisgordon/SPOTS WEBSITE"
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? spots-website
# - Directory? ./
# - Override settings? No

# Add environment variables in Vercel dashboard after first deploy
```

---

## ✅ After Deployment

1. **Get Your Domain:**
   - Vercel will assign: `https://spots-website-xxxxx.vercel.app`
   - Or use your custom domain if you have one

2. **Test the Site:**
   - Visit your Vercel URL
   - Test the full flow:
     - Request access
     - Sign NDA
     - Receive emails
     - View pitch deck

3. **Update Environment Variables (if needed):**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Update `RESEND_FROM_EMAIL` if you verify your own domain

---

## 🔧 Important Notes

### Environment Variables Security
- ✅ Never commit `.env.local` to GitHub (already in `.gitignore`)
- ✅ All environment variables must be added in Vercel dashboard
- ✅ Keys are kept secure by Vercel

### Auto-Deployment
- ✅ Every push to `main` branch automatically deploys
- ✅ Pull requests get preview deployments
- ✅ All deployments are logged in Vercel dashboard

### Domain Configuration
- You can add a custom domain in Vercel Dashboard → Settings → Domains
- Vercel handles SSL certificates automatically

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure `package.json` has correct dependencies

### Environment Variables Not Working
- Check they're added for the correct environment (Production/Preview)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Site Works Locally But Not on Vercel
- Verify all environment variables are set in Vercel
- Check build logs for errors
- Make sure database table exists in Supabase

---

## 📚 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test the live site
3. ✅ Verify emails are sending
4. ✅ Test NDA signing flow
5. ✅ Share with others!

---

**Your site will be live at:** https://spots-website-xxxxx.vercel.app
(Replace xxxxx with your actual Vercel deployment URL)

Happy deploying! 🚀

