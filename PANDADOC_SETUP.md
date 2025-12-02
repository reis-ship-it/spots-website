# PandaDoc eSign Setup Guide

## ✅ Switched to PandaDoc!

Since Inkless API isn't accessible, we've switched to **PandaDoc eSign** which has:
- ✅ **FREE eSign plan** with unlimited signatures
- ✅ **Clear API documentation**
- ✅ **Easy setup**

---

## 🚀 Quick Setup

### Step 1: Create PandaDoc Account

1. Go to **https://www.pandadoc.com**
2. Sign up for **FREE eSign plan**
3. Complete registration

### Step 2: Get API Key

1. Go to **Settings → API**
2. Generate new API key
3. Copy the API key

### Step 3: Create NDA Template

1. In PandaDoc dashboard, go to **Templates**
2. Click **Create Template**
3. Upload your `SPOTS_NDA_fillable_v3.pdf`
4. Add signature fields where needed
5. Save template
6. **Important:** Copy the Template **UUID** (not just the ID)

### Step 4: Set Up Webhook

1. Go to **Settings → Webhooks**
2. Add webhook endpoint:
   - URL: `https://yourdomain.com/api/pandadoc-webhook`
   - Events: Select "Document Completed" or "Document Status Changed"
3. Copy the webhook secret

### Step 5: Update Environment Variables

```env
PANDADOC_API_KEY=your-api-key-here
PANDADOC_API_BASE=https://api.pandadoc.com/public/v1
PANDADOC_TEMPLATE_ID=your-template-uuid-here
PANDADOC_WEBHOOK_SECRET=your-webhook-secret-here
```

---

## 📚 API Documentation

**PandaDoc Developer Docs:**
- Main: https://developers.pandadoc.com
- Create Document: https://developers.pandadoc.com/reference/create-document-from-template
- Send Document: https://developers.pandadoc.com/reference/send-document
- Webhooks: https://developers.pandadoc.com/reference/webhooks

---

## ✅ Benefits

- 🆓 **FREE** - Unlimited signatures on eSign plan
- 📖 **Well-documented** - Clear API docs
- 🔧 **Easy setup** - Standard REST API
- ✅ **Reliable** - Established platform

---

## 🔧 Code Structure

The integration is in:
- `/lib/pandadoc/client.ts` - API client
- `/app/api/pandadoc-webhook/route.ts` - Webhook handler

All ready to use once you have your API key!

---

**Ready when you get your PandaDoc credentials!** 🚀

