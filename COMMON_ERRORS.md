# Common Errors & Fixes

## ✅ FIXED: Request Access Error

**Bug Found:** Line 26 in `app/api/request-access/route.ts`
- Using `.single()` throws error when no record exists
- **FIXED:** Changed to `.maybeSingle()` ✅

---

## 🔍 Other Common Errors

### 1. "Missing Supabase environment variables"
**Fix:**
- Check `.env.local` exists
- Verify all Supabase keys are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2. "Table 'nda_access' does not exist"
**Fix:**
- Run the SQL script from `SUPABASE_SETUP_GUIDE.md` in Supabase SQL Editor
- Create the `nda_access` table

### 3. "Invalid or expired token"
**Fix:**
- Token might have expired (1 hour for signing)
- Request access again to get a new token

### 4. "Failed to load PDF"
**Fix:**
- Ensure `SPOTS_NDA_fillable_v3.pdf` is in `public/` folder
- Check file path: `public/SPOTS_NDA_fillable_v3.pdf`

### 5. "Error sending email"
**Fix:**
- Check `RESEND_API_KEY` is set in `.env.local`
- Verify Resend account is active
- Check Resend dashboard for errors

### 6. Database connection errors
**Fix:**
- Verify Supabase project is active
- Check internet connection
- Verify keys are correct (no typos)

---

## 🐛 If You Saw an Error

**Please share:**
1. The error message (exact text)
2. When it happened (requesting access? signing? viewing deck?)
3. Browser console errors (F12 → Console tab)
4. Terminal/server errors (if running `npm run dev`)

This will help me identify the exact issue!

---

## ✅ Quick Test

After the fix, try:
1. Fill out access request form
2. Should redirect to sign page (no errors)
3. Sign the NDA
4. Should receive emails

If you still see errors, share the details and I'll fix them!

