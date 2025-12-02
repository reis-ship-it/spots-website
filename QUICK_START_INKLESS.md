# 🚀 Quick Start with Inkless

## ✅ Migration Complete!

Your website has been **fully switched from DocuSign to Inkless**.

---

## 🎯 What You Need to Do

### Step 1: Get Inkless API Key (5 minutes)

**Email:** hello@useinkless.com

**Message template:**
```
Hi,

I'd like to request an API key for Inkless. I need it for:
- Use case: NDA signatures for pitch deck access
- Estimated volume: [your estimate] signatures per month
- Purpose: Gating access to an investor pitch deck

Thank you!
```

They'll email you back with your API key.

---

### Step 2: Create NDA Template (10 minutes)

1. Go to **https://useinkless.com** and log in
2. Upload your `SPOTS_NDA_fillable_v3.pdf`
3. Add signature fields where needed
4. **Important:** Enable "Auto-release signatures when complete"
5. Save template and **copy the Template ID**

---

### Step 3: Set Up Webhook (5 minutes)

1. In Inkless dashboard, go to Webhooks/Settings
2. Add webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/inkless-webhook`
   - Events: Select "document.signed" or "document.completed"
3. **Copy the webhook secret**

---

### Step 4: Update Environment Variables (2 minutes)

Update your `.env.local`:

```env
INKLESS_API_KEY=paste-your-api-key-here
INKLESS_API_BASE=https://api.useinkless.com
INKLESS_TEMPLATE_ID=paste-your-template-id-here
INKLESS_WEBHOOK_SECRET=paste-your-webhook-secret-here
```

---

## ✅ That's It!

Once you have:
- ✅ API key
- ✅ Template ID  
- ✅ Webhook secret

Just add them to your environment variables and you're ready to go!

---

## 📝 Files Changed

All code is updated. The only thing you need to do is:
1. Get Inkless credentials (above)
2. Add them to environment variables
3. Deploy/test

**Everything else is done!** 🎉

---

## 💡 Why Inkless is Better

- ✅ **FREE** - Unlimited signatures (vs DocuSign's paid plans)
- ✅ **Simpler** - Just API key (no OAuth complexity)
- ✅ **Same functionality** - All features work the same

---

## 📚 Need Help?

- **Setup Details:** See `SETUP.md`
- **Migration Info:** See `MIGRATION_TO_INKLESS.md`
- **Alternatives:** See `FREE_ESIGN_ALTERNATIVES.md`

---

**Ready when you get your Inkless API key!** 🚀

