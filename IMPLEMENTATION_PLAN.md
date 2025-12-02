# SPOTS Pitchdeck Website - Comprehensive Implementation Plan
## NDA-Gated Pitch Deck with Vercel, Supabase, and Inkless (FREE)

---

## 1. Architecture Overview

### Tech Stack
- **Frontend/Backend**: Next.js 14+ (App Router) deployed on Vercel
- **Database**: Supabase (PostgreSQL)
- **E-Signature**: Inkless (FREE - Unlimited signatures)
- **Email**: Resend (recommended by Vercel, perfect for transactional emails)
- **Authentication**: Session-based (httpOnly cookies)

### Architecture Flow
```
User → Landing Page → Request Access Form → Inkless NDA → Webhook → Access Email → Pitch Deck
```

---

## 2. User Flow (Detailed)

1. **Landing Page** (`/`)
   - Branded hero section
   - Brief explanation: "To view our pitch deck, please sign an NDA"
   - Request access form (name, email, company [optional])

2. **Submit Request** (`POST /api/request-access`)
   - Validate email format
   - Check if email already has pending/completed access
   - Create/update Supabase record with status `pending`
   - Trigger DocuSign envelope creation
   - Return success response

3. **Confirmation Screen** (`/request-sent`)
   - "Check your email" message
   - Instructions: "You'll receive an NDA to sign via Inkless"

4. **Inkless Signing** (External)
   - User receives email from Inkless
   - User signs NDA in Inkless interface
   - Inkless completes document

5. **Webhook Processing** (`POST /api/inkless-webhook`)
   - Verify webhook signature for security
   - Parse envelope completion event
   - Update Supabase: status → `completed`
   - Generate secure, time-limited access token
   - Send access email with token link

6. **Access Email**
   - Contains link: `https://yourdomain.com/access?token={token}`
   - Token expires in 30 days (configurable)

7. **Access Link** (`GET /access?token={token}`)
   - Validate token exists and is not expired
   - Verify status is `completed`
   - Create secure session cookie (httpOnly, secure, sameSite)
   - Redirect to `/deck`

8. **Pitch Deck** (`/deck`)
   - Protected route (middleware checks session)
   - Display full pitch deck (slides, embedded content, etc.)
   - If no valid session → redirect to `/`

---

## 3. Database Schema (Supabase)

### Table: `nda_access`

```sql
CREATE TABLE nda_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  envelope_id VARCHAR(255) UNIQUE, -- DocuSign envelope ID
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, expired
  access_token VARCHAR(255) UNIQUE, -- Generated token for access link
  token_expires_at TIMESTAMPTZ,
  nda_version VARCHAR(50) DEFAULT '1.0', -- Track NDA versions
  signed_at TIMESTAMPTZ, -- When DocuSign completed
  accessed_at TIMESTAMPTZ, -- When user first accessed deck
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

-- Anonymous cannot read (we'll use service role in API routes)
CREATE POLICY "No anonymous access" ON nda_access
  FOR SELECT USING (false);
```

---

## 4. API Routes (Next.js App Router)

### `/api/request-access` (POST)
**Purpose**: Handle access requests and trigger DocuSign envelope

**Request Body**:
```typescript
{
  name: string;
  email: string;
  company?: string;
}
```

**Logic**:
1. Validate inputs (email format, required fields)
2. Check for existing record by email
3. If exists and status is `completed`, return error: "Access already granted"
4. If exists and status is `pending`, reuse existing record
5. Create new record in Supabase (status: `pending`)
6. Create DocuSign envelope using template
   - Use template ID from environment variable
   - Pre-fill signer name and email
   - Set return URL to your domain
7. Store `envelope_id` in Supabase
8. Return success response

**Response**:
```typescript
{
  success: boolean;
  message: string;
  envelopeId?: string; // For debugging
}
```

---

### `/api/docusign-webhook` (POST)
**Purpose**: Handle DocuSign Connect webhook events

**Security**: 
- Verify webhook signature using DocuSign HMAC
- Validate request origin (optional: IP whitelist)

**Logic**:
1. Verify webhook signature
2. Parse webhook payload (XML or JSON format)
3. Extract: `envelopeId`, `status`, `recipientEmail`, `completedDateTime`
4. Find record by `envelope_id` in Supabase
5. If status is `completed`:
   - Generate secure random token (32+ characters)
   - Set token expiration (30 days from now)
   - Update record:
     - `status` → `completed`
     - `access_token` → generated token
     - `token_expires_at` → expiration timestamp
     - `signed_at` → completedDateTime
6. Send access email via email service (Resend/SendGrid)
   - Include personalized message
   - Include access link with token
7. Return 200 OK to DocuSign

**Error Handling**:
- Log all errors for debugging
- Return 200 to DocuSign even on errors (to avoid retries for non-critical issues)
- Set up alerting for failed webhooks

---

### `/api/access` (GET)
**Purpose**: Validate token and create session

**Query Params**:
- `token`: Access token from email link

**Logic**:
1. Extract token from query parameter
2. Query Supabase for record with matching token
3. Validate:
   - Token exists
   - Status is `completed`
   - Token is not expired (`token_expires_at > NOW()`)
4. If valid:
   - Create session cookie with:
     - `email`
     - `nda_version`
     - `signed_at`
     - Expiration: 30 days
   - Update `accessed_at` timestamp (first access only)
   - Redirect to `/deck`
5. If invalid:
   - Redirect to `/` with error message: "Invalid or expired access link"

---

### Middleware: `/middleware.ts`
**Purpose**: Protect `/deck` route

**Logic**:
1. Check for session cookie on `/deck` requests
2. If no cookie or invalid cookie:
   - Redirect to `/`
3. If valid cookie:
   - Allow request to proceed

---

## 5. Frontend Pages

### `/` (Landing/Request Access)
- Modern, branded design
- Hero section with SPOTS branding
- Access request form:
  - Name (required)
  - Email (required)
  - Company (optional)
  - Submit button
- Form validation (client-side)
- Loading state during submission
- Error handling and display

### `/request-sent`
- Confirmation message
- Instructions about checking email
- Link back to home

### `/deck` (Protected)
- Full pitch deck presentation using **React components**
- **Design Philosophy**: Simple, interactive, clear, intuitive, easily followed
- **Style**: Cool but not crazy - minimalist aesthetic matching SPOTS
- Uses SPOTS design tokens for consistent branding
- Analytics tracking: Records `accessed_at` timestamp on first view
- Modern, responsive design matching SPOTS app aesthetic
- Interactive elements that feel natural and guide users through content

---

## 6. Environment Variables

```env
# Vercel
VERCEL_URL=your-domain.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# DocuSign
DOCUSIGN_ACCOUNT_ID=your-account-id
DOCUSIGN_INTEGRATION_KEY=your-integration-key
DOCUSIGN_USER_ID=your-user-id
DOCUSIGN_RSA_PRIVATE_KEY=your-private-key
DOCUSIGN_OAUTH_BASE_PATH=https://demo.docusign.net/restapi
DOCUSIGN_TEMPLATE_ID=your-template-id
DOCUSIGN_WEBHOOK_SECRET=your-webhook-secret

# Email Service (Resend - Recommended by Vercel)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Config
NDA_VERSION=1.0
ACCESS_TOKEN_EXPIRY_DAYS=30
SESSION_COOKIE_NAME=spots_nda_session
```

---

## 7. Setup Steps (Detailed)

### Step 1: Vercel Setup (Account Needed)
1. Create Vercel account (free tier is sufficient)
2. Install Vercel CLI: `npm i -g vercel`
3. Initialize project: `vercel init`
4. Connect GitHub repository
5. Deploy to get domain URL (needed for DocuSign config)

### Step 2: Supabase Setup
1. ✅ **Supabase account already exists** - use existing account
2. Create new project for pitchdeck website (or use existing project)
3. Save credentials:
   - Project URL
   - `anon` key (public, safe for client-side)
   - `service_role` key (secret, server-side only)
4. Create `nda_access` table using schema above
5. Set up RLS policies
6. Test connection from local environment
7. **Analytics**: Use `accessed_at` field to track who viewed the pitch deck (queryable in Supabase dashboard)

### Step 3: DocuSign Setup (Account Needed)
1. Create DocuSign developer account (free developer account available)
2. Create Integration Key:
   - Go to Admin → Integrations → Apps and Keys
   - Create new Integration Key
   - Note: Integration Key, User ID, Account ID
3. Set up OAuth (JWT Grant):
   - Generate RSA key pair
   - Store private key securely
   - Add public key to DocuSign
   - Grant consent for the integration
4. Create NDA Template (only template needed):
   - ✅ Upload `SPOTS_NDA_fillable_v3.pdf` (confirmed: NDA version v3)
   - Set signer role
   - Add signature fields
   - Save template ID
5. Create Connect Webhook:
   - Go to Admin → Integrations → Connect
   - Create new Connect configuration
   - Endpoint: `https://yourdomain.com/api/docusign-webhook`
   - Events: Select "Envelope Completed"
   - Save webhook secret (for HMAC verification)

### Step 4: Email Service Setup - Resend (Recommended by Vercel)
**Why Resend:**
- ✅ Recommended by Vercel for transactional emails
- ✅ Simple API, perfect for access emails
- ✅ Free tier: 3,000 emails/month (more than enough)
- ✅ Great deliverability
- ✅ Easy integration with Next.js

**Setup Steps:**
1. Create Resend account (free tier available: 3,000 emails/month)
2. Verify domain (or use Resend's test domain for development)
3. Create API key
4. Store in environment variables

**Note:** Vercel doesn't have a built-in email service, but Resend is their recommended solution and works perfectly for this use case.

### Step 5: Next.js Project Setup
1. Initialize Next.js project: `npx create-next-app@latest`
2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js docusign-esign
   npm install resend # or sendgrid
   npm install zod # for validation
   npm install cookies-next # for cookie management
   ```
3. Set up project structure:
   ```
   /app
     /api
       /request-access
       /docusign-webhook
       /access
     /deck
     /request-sent
     page.tsx (landing)
   /lib
     /supabase.ts
     /docusign.ts
     /email.ts
     /auth.ts
   /middleware.ts
   ```
4. Add environment variables to `.env.local`
5. Implement all routes and pages
6. Test locally with Vercel dev or `npm run dev`

### Step 6: Testing
1. Test full flow locally:
   - Submit access request
   - Verify Supabase record created
   - Manually trigger webhook (or wait for DocuSign)
   - Test access link
   - Verify session creation
   - Access deck page
2. Test error cases:
   - Invalid email
   - Expired token
   - Missing session
   - Duplicate requests
3. Test security:
   - Webhook signature verification
   - SQL injection (Supabase handles this)
   - XSS protection

### Step 7: Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy
5. Update DocuSign webhook URL with production domain
6. Test full flow in production

---

## 8. Security Considerations

### Webhook Security
- **HMAC Verification**: Always verify DocuSign webhook signatures
- **IP Whitelisting**: Optionally whitelist DocuSign IP ranges

### Token Security
- **Cryptographically Random**: Use `crypto.randomBytes()` for token generation
- **Expiration**: Set reasonable expiration (30 days recommended)
- **Single Use (Optional)**: Consider invalidating token after first use

### Session Security
- **httpOnly Cookies**: Prevent XSS attacks
- **Secure Flag**: Only send over HTTPS
- **SameSite**: Prevent CSRF attacks
- **Short Expiration**: Match session expiry to token expiry

### API Security
- **Rate Limiting**: Implement rate limiting on `/api/request-access`
- **Input Validation**: Validate and sanitize all inputs
- **Error Messages**: Don't leak sensitive info in error messages

### Database Security
- **RLS Policies**: Use Row Level Security in Supabase
- **Service Role**: Only use service role key in server-side code
- **Connection Strings**: Never expose service role key to client

---

## 9. Enhanced Features (Future Considerations)

1. **Admin Dashboard**
   - View all access requests
   - Resend access emails
   - Revoke access
   - Analytics (views, signups, etc.)

2. **Analytics**
   - Track deck views
   - Track time spent on deck
   - Track slide-by-slide engagement

3. **Multi-Version NDA Support**
   - Track which NDA version user signed
   - Force re-signing for new NDA versions

4. **Access Management**
   - Allow users to request new access link
   - Extend expiration dates
   - Bulk access grants

5. **Enhanced Email**
   - Beautiful HTML email templates
   - Reminder emails for unsigned NDAs
   - Follow-up emails after deck access

---

## 10. Implementation Priority

### Phase 1: MVP (Minimum Viable Product)
1. ✅ Supabase setup and schema
2. ✅ Landing page with form
3. ✅ `/api/request-access` endpoint
4. ✅ DocuSign integration (envelope creation)
5. ✅ Basic webhook handler
6. ✅ Access link generation and email
7. ✅ Token validation and session creation
8. ✅ Protected deck page
9. ✅ Basic error handling

### Phase 2: Polish
1. Enhanced UI/UX design
2. Loading states and animations
3. Better error messages
4. Email template design
5. Security hardening

### Phase 3: Enhancements
1. Admin dashboard
2. Analytics
3. Advanced features

---

## 11. Troubleshooting Guide

### DocuSign Envelope Not Created
- Check integration key and OAuth setup
- Verify template ID is correct
- Check API credentials and permissions
- Review DocuSign API logs

### Webhook Not Firing
- Verify webhook URL is accessible (public HTTPS)
- Check DocuSign Connect configuration
- Verify webhook events are selected
- Check server logs for incoming requests

### Token Validation Failing
- Check token format in database
- Verify expiration logic
- Check timezone handling
- Review token generation code

### Session Not Persisting
- Check cookie settings (domain, path, secure)
- Verify middleware logic
- Check browser cookie settings
- Review session creation code

---

## 12. Code Structure Example

```
/spots-pitchdeck-website
  /app
    /api
      /request-access
        route.ts
      /docusign-webhook
        route.ts
      /access
        route.ts
    /deck
      page.tsx
      components/
        SlideShow.tsx
    /request-sent
      page.tsx
    page.tsx (landing)
    layout.tsx
  /lib
    /supabase
      client.ts
      server.ts
    /docusign
      client.ts
      envelope.ts
    /email
      client.ts
      templates.ts
    /auth
      session.ts
    /tokens
      design-tokens.ts
      design-tokens.css
    /utils
      validation.ts
      tokens.ts
  /styles
    globals.css
  /middleware.ts
  /types
    /database.ts
    /docusign.ts
  .env.local.example
  package.json
  next.config.js
  README.md
```

---

## 13. Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "docusign-esign": "^6.3.0",
    "resend": "^2.0.0",
    "zod": "^3.22.0",
    "cookies-next": "^5.0.0",
    "crypto": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 14. Pitch Deck Format Recommendations

### Recommended Format: **Custom React Component (Best for Web)**

**Why this is best:**
- ✅ Native web experience (fast, smooth transitions)
- ✅ Can use SPOTS design tokens directly
- ✅ Fully responsive and mobile-friendly
- ✅ Interactive elements possible (animations, embeds)
- ✅ Better SEO and accessibility
- ✅ Easy to update without re-exporting

**Implementation:**
- Use a library like:
  - `react-presentation` or `reveal.js` (React wrapper)
  - Custom slide component with smooth transitions
  - Each slide as a React component
- Slides stored as data/configuration or individual components
- Easy to iterate and update

**Alternative Formats (if needed):**

1. **Canva** (Good middle ground)
   - Create deck in Canva
   - Export as HTML/interactive presentation
   - Embed or convert to React components
   - **Pros**: Easy to design, visual editor
   - **Cons**: Less flexibility, harder to customize

2. **PDF Embed** (Simplest)
   - Export from Keynote/Slides/Canva as PDF
   - Use PDF.js or react-pdf-viewer
   - **Pros**: Quick to set up, familiar format
   - **Cons**: Less engaging, harder to track slide views, file size

3. **Keynote/Slides Export** (If you already have it)
   - Export as HTML or images
   - Convert to React components
   - **Pros**: Use existing design work
   - **Cons**: Export process needed for updates

### Recommendation
**Start with Custom React Components** - Build slides as React components using SPOTS design tokens. This gives you:
- Full control over design and branding
- Smooth, modern web experience
- Easy updates and iterations
- Perfect integration with your design system

---

## 15. Design Tokens Integration

### Overview
The pitchdeck website will use SPOTS app design tokens for consistent branding and visual identity.

### ✅ Design Tokens Extracted

**Source Files (Flutter App):**
- `/Users/reisgordon/SPOTS/lib/core/theme/colors.dart`
- `/Users/reisgordon/SPOTS/lib/core/theme/app_theme.dart`
- `/Users/reisgordon/SPOTS/lib/core/theme/text_styles.dart`

**Web Files Created:**
- ✅ `design-tokens.ts` - TypeScript/JavaScript tokens object
- ✅ `design-tokens.css` - CSS variables for styling
- ✅ `DESIGN_TOKENS.md` - Complete reference documentation

### Key Design Tokens

**Primary Brand Color:**
- Electric Green: `#00FF66` (primary accent color)

**Color Palette:**
- Black: `#000000`
- White: `#FFFFFF`
- Greyscale: 50-900 scale (grey50 through grey900)
- Error: `#FF4D4D`
- Warning: `#FFC107`
- Success: `#00FF66`

**Typography:**
- Font Family: Inter (Google Fonts)
- Font Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Font Sizes: 12px - 32px scale

**Design Principles:**
- Minimalist: black/grey/white with electric green accent
- Border Radius: 10-12px for buttons/cards
- Button Padding: 24px horizontal, 12px vertical

### Integration Plan

1. **In Next.js Project Structure:**
   ```
   /lib
     /tokens
       design-tokens.ts (copy from root)
       design-tokens.css (copy from root)
   /styles
     globals.css (import design-tokens.css)
   ```

2. **Implementation Steps:**
   - Copy `design-tokens.ts` and `design-tokens.css` to project
   - Import CSS variables in `globals.css`
   - Import TypeScript tokens in components
   - Apply consistently across all pages

3. **Usage Examples:**
   ```typescript
   // In components
   import { colors, typography, spacing } from '@/lib/tokens/design-tokens';
   
   // In CSS
   background-color: var(--color-electric-green);
   font-family: var(--font-family);
   ```

4. **Shared Design Language**
   - Landing page matches SPOTS app aesthetic exactly
   - Pitch deck uses same colors, fonts, spacing
   - Buttons, forms, and UI elements follow SPOTS patterns
   - Electric green used sparingly for CTAs and accents

### ✅ Status: Ready for Implementation
Design tokens have been extracted and converted. Ready to integrate during Phase 1 implementation.

---

## 16. Analytics & Tracking

### View Tracking in `nda_access` Table

The database schema already includes analytics tracking:

**Fields for Analytics:**
- `accessed_at` - Timestamp when user first viewed the pitch deck
- `created_at` - When they requested access
- `signed_at` - When they completed the NDA
- `status` - Current access status
- `email`, `name`, `company` - User identification

**Viewing Analytics:**

1. **In Supabase Dashboard:**
   - Query the `nda_access` table
   - Filter by `status = 'completed'` to see who has access
   - Filter by `accessed_at IS NOT NULL` to see who viewed the deck
   - Sort by `accessed_at` to see most recent viewers

2. **Simple Query Example:**
   ```sql
   -- Who viewed the pitch deck
   SELECT name, email, company, accessed_at, signed_at
   FROM nda_access
   WHERE status = 'completed' 
     AND accessed_at IS NOT NULL
   ORDER BY accessed_at DESC;
   ```

3. **Future Enhancement** (Optional):
   - Add view count field for multiple views
   - Track time spent per slide
   - Add analytics dashboard page

**No Additional Setup Required** - The `accessed_at` field automatically tracks when users first access the deck via the `/access` route.

---

## 17. Next Steps

### Immediate Actions

1. **Review and approve this plan** ✅

2. **Set up accounts:**
   - ✅ Supabase: Already have account
   - ⚠️ Vercel: Create account (free tier)
   - ⚠️ DocuSign: Create developer account (free for development)
   - ⚠️ Resend: Create account (free tier available)

3. **Prepare pitch deck:**
   - Choose format (recommended: Custom React components)
   - Create deck content
   - Share design tokens/design system for SPOTS app

4. **Set up design tokens:**
   - Share location/access to SPOTS design tokens
   - Or provide design system documentation
   - Colors, typography, spacing values

5. **Choose NDA PDF:**
   - Select which NDA version to use (v3, fillable, or v2)
   - This will be uploaded to DocuSign as template

### Implementation Phase

6. Create Next.js project structure
7. Set up Supabase database and table
8. Implement Phase 1 MVP features
9. Integrate SPOTS design tokens
10. Test locally with all integrations
11. Deploy to Vercel
12. Configure DocuSign webhook with production URL
13. Test full production flow
14. Create pitch deck slides
15. Iterate and polish

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Status**: Ready for Implementation

