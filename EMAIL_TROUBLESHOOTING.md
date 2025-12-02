# Email Troubleshooting Guide

## 🚨 Not Receiving Emails?

### Step 1: Check Vercel Logs

**Most Important:** Check your Vercel logs to see what's happening!

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Logs"** tab  
3. Filter for recent requests
4. Look for:
   - `📧 Preparing to send access email`
   - `✅ Email sent successfully`
   - `❌ Error sending email`
   - `⚠️ OWNER_EMAIL not set`

**This will tell us exactly what's wrong!**

---

### Step 2: Test Email Configuration

Visit this URL (replace with your Vercel domain):
```
https://your-vercel-domain.vercel.app/api/test-email?email=reisjgordon@gmail.com
```

This will:
- ✅ Test if Resend is configured
- ✅ Try sending a test email
- ✅ Show any errors

---

### Step 3: Check Resend Dashboard

1. Go to **https://resend.com/emails**
2. Check the **"Emails"** tab
3. Look for:
   - Are emails being sent?
   - Any failed deliveries?
   - Bounced emails?

---

### Step 4: Verify Environment Variables in Vercel

**Critical:** Make sure these are set in Vercel Dashboard:

1. **RESEND_API_KEY** = `re_S3xff6Rx_ETjFYZub5MzzAT1ZjhUJeF9G`
2. **RESEND_FROM_EMAIL** = `onboarding@resend.dev`
3. **OWNER_EMAIL** = `reisjgordon@gmail.com`

**Important:** Make sure all three environments are checked (Production, Preview, Development)

---

## 🐛 Common Issues

### Issue 1: Emails Being Sent But Not Received

**Possible Causes:**
- Going to spam folder
- Email address typo
- Provider blocking emails

**Check:**
- Spam/junk folder
- Check Resend dashboard for delivery status

### Issue 2: "From" Email Not Verified

**Error in logs:** "From email not verified"

**Fix:**
- Use `onboarding@resend.dev` (Resend's test domain)
- OR verify your own domain in Resend

### Issue 3: API Key Invalid

**Error in logs:** "Authentication failed" or "Invalid API key"

**Fix:**
- Check `RESEND_API_KEY` is correct in Vercel
- Regenerate key in Resend dashboard if needed

### Issue 4: Silent Failures

**Problem:** Errors are caught but not visible

**Solution:**
- Check Vercel logs (they now have better logging)
- Look for `❌` error messages
- Check Resend dashboard for failed sends

---

## 📋 What Should Happen

After signing an NDA, you should receive:

1. **Access Email** (to the person who signed)
   - Subject: "Access to SPOTS Pitch Deck"
   - Contains link to view pitch deck

2. **Signed NDA Copy** (to the person who signed)
   - Subject: "Your Signed SPOTS NDA - Copy"
   - Contains signed PDF attachment

3. **Owner Notification** (to you at reisjgordon@gmail.com)
   - Subject: "Signed NDA Received from [Name]"
   - Contains signed PDF attachment

---

## 🔍 Debug Checklist

- [ ] Check Vercel logs for error messages
- [ ] Test email endpoint: `/api/test-email`
- [ ] Check Resend dashboard for sent emails
- [ ] Verify environment variables in Vercel
- [ ] Check spam folder
- [ ] Verify email addresses are correct

---

## 🆘 Still Not Working?

**Share with me:**
1. What do you see in **Vercel logs**? (copy the error messages)
2. What happens when you visit `/api/test-email?email=reisjgordon@gmail.com`?
3. Do you see any emails in **Resend dashboard**?

This will help me diagnose the exact issue!

