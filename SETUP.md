# SPOTS Pitchdeck Website - Setup Guide

Complete setup instructions for the NDA-gated pitch deck website.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (you already have this ✅)
- Vercel account (need to create)
- PandaDoc account (need to create - FREE eSign plan with unlimited signatures)
- Resend account (need to create)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all environment variables (see below)

3. **Set up Supabase database:**
   - Run the SQL schema (see Database Setup below)

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Navigate to `http://localhost:3000`

## Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Vercel (auto-set in production, optional for local)
VERCEL_URL=your-domain.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PandaDoc eSign (FREE - Unlimited signatures)
PANDADOC_API_KEY=your-pandadoc-api-key
PANDADOC_API_BASE=https://api.pandadoc.com/public/v1
PANDADOC_TEMPLATE_ID=your-template-uuid
PANDADOC_WEBHOOK_SECRET=your-webhook-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Config
NDA_VERSION=1.0
ACCESS_TOKEN_EXPIRY_DAYS=30
SESSION_COOKIE_NAME=spots_nda_session
```

## Database Setup (Supabase)

1. Go to your Supabase project SQL Editor

2. Run this SQL to create the `nda_access` table:

```sql
CREATE TABLE nda_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  envelope_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  access_token VARCHAR(255) UNIQUE,
  token_expires_at TIMESTAMPTZ,
  nda_version VARCHAR(50) DEFAULT '1.0',
  signed_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_nda_access_email ON nda_access(email);
CREATE INDEX idx_nda_access_envelope_id ON nda_access(envelope_id);
CREATE INDEX idx_nda_access_token ON nda_access(access_token);
CREATE INDEX idx_nda_access_status ON nda_access(status);

-- Row Level Security (RLS) policies
ALTER TABLE nda_access ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by API routes)
CREATE POLICY "Service role full access" ON nda_access
  FOR ALL USING (auth.role() = 'service_role');

-- Anonymous cannot read
CREATE POLICY "No anonymous access" ON nda_access
  FOR SELECT USING (false);
```

## PandaDoc Setup

1. **Create Account:**
   - Go to **https://www.pandadoc.com**
   - Sign up for **FREE eSign plan**
   - Complete registration

2. **Get API Key:**
   - Go to **Settings → API** in PandaDoc dashboard
   - Generate new API key
   - Copy the API key (use in PANDADOC_API_KEY)

3. **Create NDA Template:**
   - In PandaDoc dashboard, go to **Templates**
   - Click **Create Template** or **New Template**
   - Upload `SPOTS_NDA_fillable_v3.pdf` (from your files)
   - Add signature fields where needed
   - Save template
   - **Important:** Copy the Template **UUID** (not just the name/ID)
   - Use this UUID in PANDADOC_TEMPLATE_ID

4. **Set up Webhook:**
   - Go to **Settings → Webhooks** in PandaDoc dashboard
   - Add webhook endpoint:
     - URL: `https://yourdomain.com/api/pandadoc-webhook`
     - Events: Select "Document Completed" or "Document Status Changed"
   - Save webhook secret (use in PANDADOC_WEBHOOK_SECRET)

**API Documentation:** https://developers.pandadoc.com

## Resend Setup

1. **Create Account:**
   - Go to https://resend.com
   - Create account (free tier: 3,000 emails/month)

2. **Get API Key:**
   - Dashboard → API Keys
   - Create new API key
   - Use in RESEND_API_KEY

3. **Verify Domain (optional):**
   - For production, verify your domain
   - Or use Resend's test domain for development

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add all environment variables in Vercel dashboard
   - Deploy

3. **Update PandaDoc Webhook:**
   - Update webhook URL with your Vercel domain
   - Format: `https://your-domain.vercel.app/api/pandadoc-webhook`

## Editing the Pitch Deck

The pitch deck content is in **ONE file** for easy editing:

**File:** `/lib/pitch-deck-content.ts`

Just edit the text strings in this file to update the entire pitch deck! No coding knowledge needed.

See `PITCH_DECK_EDITING_GUIDE.md` for detailed instructions.

## Testing the Flow

1. **Request Access:**
   - Go to landing page
   - Fill out form with your email
   - Submit

2. **Sign NDA:**
   - Check email for PandaDoc NDA signature request
   - Sign the NDA

3. **Receive Access:**
   - After signing, you'll receive access email
   - Click the access link

4. **View Deck:**
   - You'll be redirected to the pitch deck
   - Session is created automatically

## Troubleshooting

### PandaDoc Document Not Sent
- Check API key is correct
- Verify template UUID is correct (not just template name)
- Check API base URL is set correctly
- Review PandaDoc API documentation for any changes

### Webhook Not Firing
- Verify webhook URL is accessible (public HTTPS)
- Check PandaDoc webhook configuration
- Verify webhook events are selected (Document Completed)
- Check webhook payload format matches expected structure
- Review PandaDoc webhook documentation

### Email Not Sending
- Check Resend API key
- Verify email domain is configured
- Check Resend dashboard for errors

### Session Not Working
- Check cookie settings (domain, path, secure)
- Verify middleware logic
- Check browser cookie settings

## Project Structure

```
/spots-pitchdeck-website
  /app
    /api
      /request-access     # Handle access requests
      /pandadoc-webhook   # Handle PandaDoc webhooks
      /access             # Validate token & create session
    /deck                 # Pitch deck page
    /request-sent         # Confirmation page
    page.tsx              # Landing page
  /lib
    /tokens               # Design tokens
    /supabase             # Supabase client
    /pandadoc             # PandaDoc eSign integration
    /email                # Email service
    /auth                 # Session management
    pitch-deck-content.ts # ✨ EASY EDITING - All pitch deck content here!
  middleware.ts           # Protect /deck route
```

## Support

For issues or questions, refer to:
- `IMPLEMENTATION_PLAN.md` - Full technical documentation
- `PITCH_DECK_EDITING_GUIDE.md` - How to edit pitch deck
- `DESIGN_TOKENS.md` - Design system reference

## Next Steps

1. ✅ Set up all accounts
2. ✅ Configure environment variables
3. ✅ Create Supabase database
4. ✅ Set up PandaDoc template and webhook
5. ✅ Deploy to Vercel
6. ✅ Test the full flow
7. ✅ Edit pitch deck content as needed

Happy building! 🚀

