# Email Debugging Guide

## 🔍 How to Diagnose Email Issues

### Step 1: Test Email Configuration

Visit this URL (replace with your Vercel domain):
```
https://your-vercel-domain.vercel.app/api/test-email?email=reisjgordon@gmail.com
```

This will:
- ✅ Check if Resend API key is configured
- ✅ Test sending an email
- ✅ Show any errors

### Step 2: Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Logs"** tab
3. Look for email-related errors:
   - `❌ Error sending signed NDA`
   - `❌ Error sending access email`
   - `📧 Preparing to send access email`

### Step 3: Check Resend Dashboard

1. Go to **https://resend.com/emails**
2. Check if emails are being sent
3. Look for:
   - Failed deliveries
   - Bounced emails
   - Spam reports

### Step 4: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, check:

- ✅ `RESEND_API_KEY` is set
- ✅ `RESEND_FROM_EMAIL` is set to `onboarding@resend.dev` (or your verified domain)
- ✅ `OWNER_EMAIL` is set to `reisjgordon@gmail.com`

---

## 🐛 Common Email Issues

### Issue 1: "From" Email Not Verified

**Error:** Email sent but bounced/failed

**Fix:**
- Use Resend's test domain: `onboarding@resend.dev`
- OR verify your own domain in Resend

### Issue 2: API Key Invalid

**Error:** Authentication failed

**Fix:**
- Check `RESEND_API_KEY` in Vercel
- Regenerate key in Resend dashboard if needed

### Issue 3: Emails Going to Spam

**Solution:**
- Verify your domain in Resend
- Use a custom domain for "from" email

### Issue 4: Emails Not Sending (Silent Failure)

**Check:**
- Vercel logs for errors
- Resend dashboard for delivery status
- Test endpoint: `/api/test-email`

---

## 📋 Expected Email Flow

After signing NDA, you should receive:

1. **Access Email** (to signer)
   - Subject: "Access to SPOTS Pitch Deck"
   - Contains link to view pitch deck

2. **Signed NDA Email** (to signer)
   - Subject: "Your Signed SPOTS NDA - Copy"
   - Contains signed PDF attachment

3. **Owner Notification** (to you)
   - Subject: "Signed NDA Received from [Name]"
   - Contains signed PDF attachment

---

## 🧪 Quick Test

1. **Test email endpoint:**
   ```
   https://your-domain.vercel.app/api/test-email?email=reisjgordon@gmail.com
   ```

2. **Sign an NDA** and check:
   - Vercel logs (should show email sending logs)
   - Your email inbox
   - Spam folder

3. **Check Resend dashboard:**
   - https://resend.com/emails
   - See delivery status

---

## 🔧 Next Steps

If emails still aren't working:

1. **Check Vercel logs** for specific error messages
2. **Test with test endpoint** to isolate the issue
3. **Verify Resend API key** is correct
4. **Check Resend dashboard** for delivery status

Share the error messages from Vercel logs and I'll help fix them!

