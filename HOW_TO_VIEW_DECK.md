# How to View the /deck Page

The `/deck` page is protected and requires authentication. Here are your options:

---

## ✅ Option 1: Quick Dev Access (Development Only)

**Fastest way to view the deck during development:**

1. **Visit this URL on your local dev server:**
   ```
   http://localhost:3000/api/dev-access
   ```

2. **You'll be automatically redirected to `/deck`**

**Note:** This only works in development mode (not on Vercel production).

---

## ✅ Option 2: Full Production Flow

**How users (and you) will access it normally:**

1. **Request Access:**
   - Go to: `https://spots-site.vercel.app/`
   - Fill out the form with your name and email
   - Submit

2. **Sign NDA:**
   - You'll be redirected to `/sign-nda`
   - Sign the NDA (draw or type your name)

3. **Receive Access Email:**
   - Check your email for the access link
   - (Note: Currently goes to owner email due to domain verification)

4. **Click Access Link:**
   - Opens `/deck` automatically
   - Session is created for 30 days

---

## ✅ Option 3: Temporarily Disable Protection (Quick Test)

**For local testing, you can temporarily disable middleware:**

1. **Comment out the middleware check:**
   ```typescript
   // In middleware.ts, temporarily comment out the redirect:
   if (request.nextUrl.pathname.startsWith('/deck')) {
     // const session = getSession(request);
     // if (!isValidSession(session)) {
     //   return NextResponse.redirect(new URL('/', request.url));
     // }
   }
   ```

2. **Visit `/deck` directly:**
   ```
   http://localhost:3000/deck
   ```

3. **Remember to uncomment after testing!**

---

## 🎯 Recommended Approach

**For Development:**
- Use **Option 1** (`/api/dev-access`) - Quick and easy

**For Testing Full Flow:**
- Use **Option 2** - Goes through complete NDA process

**For Quick Preview:**
- Use **Option 3** - Temporarily disable protection

---

## 📋 Quick Reference

### Development URLs:
- **Dev Access:** `http://localhost:3000/api/dev-access`
- **Direct Deck:** `http://localhost:3000/deck` (if middleware disabled)

### Production URLs:
- **Main Site:** `https://spots-site.vercel.app/`
- **Deck:** `https://spots-site.vercel.app/deck` (after authentication)

---

**Try Option 1 first - it's the fastest!** 🚀

