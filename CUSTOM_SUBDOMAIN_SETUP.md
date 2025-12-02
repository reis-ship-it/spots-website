# Quick Setup: Custom Subdomain for Pitch Deck

## 🎯 Goal

Set up `pitchdeck.yourdomain.com` to serve the pitch deck.

---

## ✅ Option A: Same Deployment (Easiest)

**Use your existing Vercel project, just add the subdomain.**

### Steps:

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain: `yourdomain.com`
   - Follow Vercel's instructions to add DNS records
   - Wait for verification (usually 5-30 minutes)

2. **Add Subdomain:**
   - In the same Domains page, click **"Add"** again
   - Enter: `pitchdeck.yourdomain.com`
   - Vercel automatically handles SSL and routing

3. **Both domains work:**
   - `yourdomain.com` → Your site
   - `pitchdeck.yourdomain.com` → Your site (same content)
   - Both serve the same Next.js app

4. **Optional: Route subdomain to `/deck`:**
   - If you want `pitchdeck.yourdomain.com` to automatically show the deck:
   - I can add middleware to detect the subdomain and redirect to `/deck`

**Result:** Both domains serve your site! 🎉

---

## ✅ Option B: Separate Project (Complete Isolation)

**Create a new Vercel project just for the pitch deck.**

### Steps:

1. **Create New Project:**
   - Vercel Dashboard → **Add New** → **Project**
   - Import your GitHub repo: `spots-website`
   - Name it: `spots-pitchdeck`

2. **Configure:**
   - Framework: Next.js (auto-detected)
   - Copy all environment variables from your main project
   - Deploy

3. **Get Domain:**
   - Gets: `spots-pitchdeck-xxxxx.vercel.app`
   - Or add custom: `pitchdeck.yourdomain.com`

4. **Modify (Optional):**
   - Can modify this project to only show `/deck` route
   - Or keep full app but deploy separately

**Result:** Completely separate deployments! 🚀

---

## 🔧 Optional: Auto-Redirect Subdomain to Deck

If you want `pitchdeck.yourdomain.com` to automatically redirect to `/deck`, I can add middleware:

```typescript
// middleware.ts - detects subdomain and redirects
if (hostname === 'pitchdeck.yourdomain.com') {
  // Redirect to /deck
}
```

**Want me to add this?**

---

## 💡 Recommendation

**Option A (Same Deployment)** is easiest:
- ✅ Single deployment
- ✅ Single codebase
- ✅ Easy to manage
- ✅ Both domains work immediately

**Option B (Separate Project)** if you want:
- ✅ Different deployments
- ✅ Can modify one without affecting the other
- ✅ Separate versioning

---

## ❓ Which Do You Prefer?

1. **Same deployment** - Add subdomain to existing project?
2. **Separate project** - Create new project for pitch deck?
3. **Keep path-based** - Use `spots-site.vercel.app/deck`?

Let me know and I'll help set it up! 🚀

