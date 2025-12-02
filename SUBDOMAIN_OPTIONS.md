# Subdomain Options for Pitch Deck

## 🎯 Your Current Setup

**Current Domain:** `spots-site.vercel.app`

You have several options for housing the pitch deck on a separate subdomain:

---

## ✅ Option 1: Custom Domain Subdomain (Recommended)

**Best for:** Professional appearance, branding control

### Setup:

1. **Add Custom Domain to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Add DNS records Vercel provides to your domain registrar
   - Wait for verification

2. **Add Subdomain:**
   - In Vercel Domains settings, add: `pitchdeck.yourdomain.com`
   - Or `deck.yourdomain.com`, `pitch.yourdomain.com`, etc.
   - Vercel automatically handles SSL

3. **Result:**
   - Main site: `yourdomain.com` or `www.yourdomain.com`
   - Pitch deck: `pitchdeck.yourdomain.com` (points to same deployment)

**Pros:**
- ✅ Professional custom domain
- ✅ Same codebase, different domain
- ✅ Easy to share: "Visit pitchdeck.yourdomain.com"
- ✅ Can use same deployment or separate project

**Cons:**
- ⚠️ Requires owning a domain (~$10-15/year)

---

## ✅ Option 2: Separate Vercel Project (Same Repository)

**Best for:** Complete isolation, different deployments

### Setup:

1. **Create New Vercel Project:**
   - Vercel Dashboard → Add New Project
   - Import same GitHub repository
   - Name it: `spots-pitchdeck` or `spots-deck`

2. **Configure:**
   - Framework: Next.js (auto-detected)
   - Same environment variables
   - Gets its own domain: `spots-pitchdeck-xxxxx.vercel.app`

3. **Add Custom Subdomain:**
   - Add `pitchdeck.yourdomain.com` to this project
   - Or keep the Vercel subdomain

**Pros:**
- ✅ Completely separate deployments
- ✅ Independent version control
- ✅ Can have different configs
- ✅ Easier to manage separately

**Cons:**
- ⚠️ Need to duplicate environment variables
- ⚠️ Two deployments to manage

---

## ✅ Option 3: Path-Based (No Subdomain)

**Best for:** Simplicity, same domain

### Current Setup (Already Works!):

- Main site: `spots-site.vercel.app/`
- Pitch deck: `spots-site.vercel.app/deck`
- NDA signing: `spots-site.vercel.app/sign-nda`

**Pros:**
- ✅ Already configured
- ✅ No additional setup
- ✅ Simple URLs

**Cons:**
- ⚠️ Less "separate" feeling
- ⚠️ Still on main domain

---

## ✅ Option 4: Vercel Rewrites (Advanced)

**Best for:** Custom routing, same deployment

You can use Vercel rewrites to route a subdomain to a specific path:

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/deck/$1",
      "has": [
        {
          "type": "host",
          "value": "pitchdeck.yourdomain.com"
        }
      ]
    }
  ]
}
```

**Pros:**
- ✅ Single deployment
- ✅ Custom routing
- ✅ Same codebase

**Cons:**
- ⚠️ Requires custom domain
- ⚠️ More complex setup

---

## 🎯 My Recommendation

**Option 1: Custom Domain Subdomain** is best because:

1. **Professional:**
   - `pitchdeck.yourdomain.com` looks great
   - Easy to remember and share

2. **Same Deployment:**
   - Use the existing project
   - Just add the subdomain in Vercel

3. **Flexible:**
   - Can keep `spots-site.vercel.app` for testing
   - Use custom domain for production

4. **Cost:**
   - Only need one domain (~$10-15/year)
   - Vercel hosting is free

---

## 🚀 Quick Setup (Option 1)

### If You Have a Domain:

1. **In Vercel Dashboard:**
   - Project → Settings → Domains
   - Add Domain: `yourdomain.com`
   - Add DNS records to your registrar
   - Wait for verification

2. **Add Subdomain:**
   - Click "Add" again
   - Enter: `pitchdeck.yourdomain.com`
   - Vercel handles the rest!

3. **Update Environment Variables:**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Emails will use the custom domain

4. **Done!** 🎉
   - `yourdomain.com` → Main site
   - `pitchdeck.yourdomain.com` → Pitch deck

---

## 💡 Don't Have a Domain?

**Popular Options:**
- **Namecheap:** ~$10/year
- **Cloudflare:** ~$10/year (often cheapest)
- **Google Domains:** ~$12/year

**Or:** Use Option 3 (path-based) - it's already working!

---

## ❓ Which Option Do You Prefer?

Let me know which option you'd like to use, and I can help set it up!

