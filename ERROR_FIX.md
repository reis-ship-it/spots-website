# Error Fix - Request Access Route

## 🐛 Issue Found

**Location:** `app/api/request-access/route.ts` (line 22-26)

**Problem:** Using `.single()` throws an error when no record exists, which breaks the flow for new users.

**Original Code:**
```typescript
const { data: existing } = await supabaseAdmin
  .from('nda_access')
  .select('*')
  .eq('email', email)
  .single();  // ❌ Throws error if no record found
```

## ✅ Fix Applied

Changed to `.maybeSingle()` which returns `null` if no record exists instead of throwing an error.

**Fixed Code:**
```typescript
const { data: existing, error: existingError } = await supabaseAdmin
  .from('nda_access')
  .select('*')
  .eq('email', email)
  .maybeSingle();  // ✅ Returns null if no record found

if (existingError) {
  throw existingError;
}
```

## 📋 What This Fixes

- ✅ First-time users won't get errors when requesting access
- ✅ The code properly handles both existing and new records
- ✅ Error handling is more robust

## 🔍 Common Error Scenarios to Check

If you're still seeing errors, check:

1. **Database table exists?**
   - Run the SQL script in `SUPABASE_SETUP_GUIDE.md`
   - Verify table `nda_access` exists in Supabase

2. **Environment variables set?**
   - Check `.env.local` has all Supabase keys
   - Verify keys are correct

3. **Supabase connection working?**
   - Test connection in Supabase dashboard
   - Check network/firewall issues

4. **Check terminal logs:**
   ```bash
   npm run dev
   # Look for error messages in the terminal
   ```

## 🚀 Testing

Try requesting access again - it should work now for both:
- ✅ New users (first time)
- ✅ Existing users (already in database)

