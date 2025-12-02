# Quick Setup - Custom Signature System

## 🚀 Fast Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `pdf-lib` - Overlay signature on PDF
- `signature_pad` - Draw signature component

### 2. Move NDA PDF

Copy your NDA PDF to the public folder:

```bash
cp SPOTS_NDA_fillable_v3.pdf public/SPOTS_NDA_fillable_v3.pdf
```

Or manually move it to: `public/SPOTS_NDA_fillable_v3.pdf`

### 3. Set Environment Variables

Add to your `.env.local`:

```env
# Owner email (where you receive signed NDAs)
OWNER_EMAIL=your-email@example.com

# Resend email (already configured)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Adjust Signature Position

Open `app/api/sign-nda/route.ts` and find:

```typescript
const signatureX = 100;      // X position (left-to-right)
const signatureY = 150;      // Y position (top-to-bottom)
const signatureWidth = 200;  // Width of signature
const signatureHeight = 60;  // Height of signature
```

**How to find the right position:**
1. Open your NDA PDF
2. Find where the signature should go
3. Note the pixel coordinates (or estimate)
4. Update the values above

**Tip:** Start with these defaults and adjust after testing!

### 5. Test!

1. Start dev server: `npm run dev`
2. Fill out access form
3. Sign the NDA
4. Check your email for the signed PDF
5. Verify signature appears correctly

---

## ✅ That's It!

The system is ready. Users can now:
- Sign NDAs directly on your website
- Receive a copy via email
- You receive a copy automatically
- Access is granted after signing

---

## 🔧 Troubleshooting

**PDF not found?**
- Make sure `SPOTS_NDA_fillable_v3.pdf` is in `public/` folder
- Check the filename matches exactly

**Signature position wrong?**
- Adjust coordinates in `app/api/sign-nda/route.ts`
- PDF coordinates start from bottom-left (0,0)
- Y coordinate is measured from bottom, so higher Y = lower on page

**Emails not sending?**
- Check `RESEND_API_KEY` is set
- Check `OWNER_EMAIL` is set
- Check Resend dashboard for errors

---

## 📚 Full Documentation

See `CUSTOM_SIGNATURE_COMPLETE.md` for complete details!

