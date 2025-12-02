# SPOTS Design Tokens Reference

This document contains the extracted design tokens from the SPOTS Flutter app, converted for web use.

**Source Files:**
- `/Users/reisgordon/SPOTS/lib/core/theme/colors.dart`
- `/Users/reisgordon/SPOTS/lib/core/theme/app_theme.dart`
- `/Users/reisgordon/SPOTS/lib/core/theme/text_styles.dart`

---

## Colors

### Primary Brand Color
- **Electric Green**: `#00FF66` (RGB: 0, 255, 102)
  - Primary brand accent color
  - Used for: CTAs, links, highlights, success states

### Primary Variants
- **Primary Light**: `#66FF99`
- **Primary Dark**: `#00CC52`

### Core Neutrals
- **Black**: `#000000`
- **White**: `#FFFFFF`

### Greyscale Scale (50-900)
- **Grey 50**: `#FAFAFA`
- **Grey 100**: `#F5F5F5`
- **Grey 200**: `#E5E5E5`
- **Grey 300**: `#CCCCCC`
- **Grey 400**: `#B3B3B3`
- **Grey 500**: `#8A8A8A`
- **Grey 600**: `#6E6E6E`
- **Grey 700**: `#4D4D4D`
- **Grey 800**: `#1F1F1F`
- **Grey 900**: `#0B0B0B`

### Semantic Colors
- **Error**: `#FF4D4D`
- **Warning**: `#FFC107`
- **Success**: `#00FF66` (same as Electric Green)

### Text Colors
- **Text Primary**: `#121212`
- **Text Secondary**: `#6E6E6E`
- **Text Hint**: `#B3B3B3`

### Surface Colors
- **Background**: `#FFFFFF`
- **Surface**: `#FFFFFF`
- **Secondary**: `#6E6E6E`

---

## Typography

### Font Family
- **Font**: Inter (Google Fonts)
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Font Sizes

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| Display Large | 32px | Bold (700) | Hero headings |
| Display Medium | 28px | Bold (700) | Section headings |
| Display Small | 24px | Semibold (600) | Subsection headings |
| Headline Large | 22px | Semibold (600) | Large headlines |
| Headline Medium | 20px | Semibold (600) | Medium headlines |
| Headline Small | 18px | Semibold (600) | Small headlines |
| Title Large | 16px | Semibold (600) | Large titles |
| Title Medium | 14px | Medium (500) | Medium titles |
| Title Small | 12px | Medium (500) | Small titles |
| Body Large | 16px | Normal (400) | Large body text |
| Body Medium | 14px | Normal (400) | Medium body text |
| Body Small | 12px | Normal (400) | Small body text |
| AppBar Title | 18px | Semibold (600) | Navigation titles |
| Button Text | 16px | Semibold (600) | Button labels |

---

## Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| XS | 4px | Tight spacing |
| SM | 8px | Small spacing |
| MD | 12px | Medium spacing |
| LG | 16px | Large spacing |
| XL | 24px | Extra large spacing |
| XXL | 32px | 2x large spacing |
| XXXL | 48px | 3x large spacing |

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| SM | 10px | Buttons, small elements |
| MD | 12px | Cards, inputs, larger elements |
| LG | 16px | Large containers |
| Full | 9999px | Pills, circles |

---

## Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| SM | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| MD | `0 4px 6px rgba(0, 0, 0, 0.1)` | Medium elevation |
| LG | `0 10px 15px rgba(0, 0, 0, 0.1)` | Large elevation |
| Card | `0 1px 3px rgba(0, 0, 0, 0.12)` | Card shadows |

---

## Component Styles

### Buttons
- **Padding**: 24px horizontal, 12px vertical
- **Border Radius**: 10px
- **Font Size**: 16px
- **Font Weight**: 600 (Semibold)
- **Background**: Grey 200 (default), Electric Green (primary)
- **Text Color**: Black (on grey), Black (on electric green)

### Inputs
- **Padding**: 16px horizontal, 12px vertical
- **Border Radius**: 12px
- **Border Width**: 1px (default), 2px (focused)
- **Border Color**: Grey 300 (default), Electric Green (focused)
- **Background**: Grey 100
- **Text Color**: Text Primary

### Cards
- **Border Radius**: 12px
- **Background**: White
- **Padding**: 16px
- **Shadow**: Card shadow

---

## Design Principles

### Minimalist Aesthetic
- **Color Palette**: Black/grey/white with electric green accent
- Keep design clean and uncluttered
- Use electric green sparingly for emphasis and CTAs

### Consistent Styling
- **Border Radius**: 10-12px for buttons/cards
- **Button Padding**: 24px horizontal, 12px vertical
- **Typography**: Inter font family throughout
- **Spacing**: Consistent spacing scale

### Accessibility
- High contrast text (Text Primary on White)
- Clear visual hierarchy
- Focus states with electric green border (2px)

---

## Usage in Web Project

### TypeScript/JavaScript
```typescript
import { colors, typography, spacing, borderRadius } from './design-tokens';

const buttonStyle = {
  backgroundColor: colors.electricGreen,
  padding: `${spacing.md} ${spacing.xl}`,
  borderRadius: borderRadius.sm,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize.buttonText,
  fontWeight: typography.fontWeight.semibold,
};
```

### CSS/SCSS
```css
@import './design-tokens.css';

.button {
  background-color: var(--color-electric-green);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
  font-size: var(--font-size-button-text);
  font-weight: var(--font-weight-semibold);
}
```

---

## Files Generated

1. **`design-tokens.ts`** - TypeScript/JavaScript tokens object
2. **`design-tokens.css`** - CSS variables for styling
3. **`DESIGN_TOKENS.md`** - This reference document

These files should be integrated into the Next.js project during implementation.

