# Pitch Deck Editing Guide

## ✅ Yes, You Can Edit Everything!

The pitch deck is built with React components, which means it's **completely editable** as simple files. No special tools, no complex exports—just edit the files directly.

---

## How Easy Is It?

### Example: Editing Slide Content

Each slide is a separate file. Here's what editing looks like:

**File: `app/deck/components/SlideHero.tsx`**

```tsx
// Current content
export function SlideHero() {
  return (
    <section className="hero-slide">
      <h1>SPOTS</h1>
      <p>Opening doors to experiences, communities, people, meaning</p>
    </section>
  );
}
```

**To change it, just edit the text:**

```tsx
// Edited content - just change the text!
export function SlideHero() {
  return (
    <section className="hero-slide">
      <h1>SPOTS</h1>
      <p>Your tagline here - just edit this!</p>  {/* ← Changed this */}
    </section>
  );
}
```

That's it! Save the file, and the changes appear on your site.

---

## What You Can Edit

### ✅ **Text Content** (Super Easy)
- Headlines
- Paragraphs
- Bullet points
- Call-to-action text
- Contact information

### ✅ **Styling** (Easy)
- Colors (using design tokens)
- Font sizes
- Spacing
- Layout adjustments

### ✅ **Structure** (Moderate)
- Add/remove slides
- Reorder slides
- Change slide layouts

### ✅ **Images & Media** (Easy)
- Replace images
- Add new images
- Update graphics

### ✅ **Interactions** (Moderate to Advanced)
- Animation timing
- Scroll behavior
- Interactive elements

---

## Editing Methods

### Method 1: Direct File Editing (Recommended)

Each slide is a separate component file. Open the file, change the text, save.

**File Structure:**
```
/app/deck/components/
  SlideHero.tsx          ← Edit hero slide here
  SlideProblem.tsx       ← Edit problem slide here
  SlidePhilosophy.tsx    ← Edit philosophy slide here
  ... and so on
```

### Method 2: Content Configuration File (Even Easier!)

We can structure it so all content is in one easy-to-edit file:

**File: `lib/pitch-deck-content.ts`**
```typescript
export const pitchDeckContent = {
  hero: {
    title: "SPOTS",
    tagline: "Opening doors to experiences, communities, people, meaning"
  },
  problem: {
    title: "The Problem",
    points: [
      "Finding your spots, your people, your community is hard",
      "Current solutions are either too generic or too gamified"
    ]
  },
  // ... all content in one place
}
```

Then slides just reference this file. **To edit, you only change one file!**

Would you like me to set it up this way? It makes editing even easier.

---

## Common Edits

### Changing Text
```tsx
// Before
<h1>The Problem</h1>

// After
<h1>The Challenge We're Solving</h1>  // Just edit and save!
```

### Updating Colors
```tsx
// Uses design tokens - change once, applies everywhere
import { colors } from '@/lib/tokens/design-tokens';

<div style={{ color: colors.electricGreen }}>  // Easy to change
```

### Adding a Slide
1. Create new file: `SlideNew.tsx`
2. Add to slide list in main deck file
3. Done!

### Removing a Slide
1. Delete the slide component file
2. Remove from slide list
3. Done!

---

## No Coding Required

For simple text changes, you don't need to know code:
- Just find the text in the file
- Change it to what you want
- Save the file

The structure is clear and readable.

---

## Version Control

Since it's all code files:
- ✅ Git tracks all changes
- ✅ Easy to see what changed
- ✅ Easy to revert if needed
- ✅ Can collaborate with others

---

## Making It Even Easier

I can set up the pitch deck in a way that makes editing **super simple**:

### Option A: Content File Approach
- All text content in one easy-to-edit file
- Separate from design/layout code
- Non-technical users can edit easily

### Option B: Markdown Files
- Each slide's content in a markdown file
- Even easier to read and edit
- Still gets rendered beautifully

### Option C: Simple Component Files
- One file per slide
- Clear, readable structure
- Edit directly in any code editor

**Which approach would you prefer?** I recommend Option A (content file) for easiest editing, but all options work great.

---

## After You Edit

1. **Save the file**
2. **Site auto-updates** (if using Vercel's live reload)
3. **Or push to GitHub** → Vercel auto-deploys

No export process, no re-upload, no hassle.

---

## Bottom Line

**Yes, you'll be able to edit everything easily!**

- ✅ Change any text instantly
- ✅ Update colors/styling
- ✅ Add/remove slides
- ✅ No special tools needed
- ✅ Just edit files and save

**Want me to make it even easier to edit?** I can structure it with a content configuration file so you only edit one simple file for all text content.

---

## Questions?

**Q: Do I need to know code?**  
A: For simple text changes, no! Just edit the text in the file. The structure will be clear.

**Q: What if I break something?**  
A: All changes are in Git, so you can always revert. Plus, I'll document everything clearly.

**Q: Can I add images easily?**  
A: Yes! Just add the image file and reference it. Super simple.

**Q: Will changes break the design?**  
A: No! The design structure stays intact. You're just editing content.

Let me know if you want the "super easy" content file approach, and I'll set it up that way! 🚀

