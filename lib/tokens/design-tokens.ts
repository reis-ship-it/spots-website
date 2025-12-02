/**
 * SPOTS Design Tokens - Web Version
 * Extracted from Flutter app design system
 * Source: /Users/reisgordon/SPOTS/lib/core/theme/
 */

export const colors = {
  // Primary Brand Color
  electricGreen: '#00FF66',
  primary: '#00FF66',
  accent: '#00FF66',
  
  // Primary Variants
  primaryLight: '#66FF99',
  primaryDark: '#00CC52',
  
  // Core Neutrals
  black: '#000000',
  white: '#FFFFFF',
  
  // Greyscale Ramp (50-900)
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#E5E5E5',
  grey300: '#CCCCCC',
  grey400: '#B3B3B3',
  grey500: '#8A8A8A',
  grey600: '#6E6E6E',
  grey700: '#4D4D4D',
  grey800: '#1F1F1F',
  grey900: '#0B0B0B',
  
  // Semantic Colors
  error: '#FF4D4D',
  warning: '#FFC107',
  success: '#00FF66',
  
  // Surfaces and Text
  background: '#FFFFFF',
  surface: '#FFFFFF',
  textPrimary: '#121212',
  textSecondary: '#6E6E6E',
  textHint: '#B3B3B3',
  
  // Secondary
  secondary: '#6E6E6E',
} as const;

export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Font Sizes (from Flutter text styles)
  fontSize: {
    displayLarge: '32px',
    displayMedium: '28px',
    displaySmall: '24px',
    headlineLarge: '22px',
    headlineMedium: '20px',
    headlineSmall: '18px',
    titleLarge: '16px',
    titleMedium: '14px',
    titleSmall: '12px',
    bodyLarge: '16px',
    bodyMedium: '14px',
    bodySmall: '12px',
    appBarTitle: '18px',
    buttonText: '16px',
  },
  
  // Text Styles
  styles: {
    displayLarge: {
      fontSize: '32px',
      fontWeight: 700,
      color: colors.textPrimary,
    },
    displayMedium: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.textPrimary,
    },
    displaySmall: {
      fontSize: '24px',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    headlineLarge: {
      fontSize: '22px',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    headlineMedium: {
      fontSize: '20px',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    headlineSmall: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    titleLarge: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    titleMedium: {
      fontSize: '14px',
      fontWeight: 500,
      color: colors.textPrimary,
    },
    titleSmall: {
      fontSize: '12px',
      fontWeight: 500,
      color: colors.textSecondary,
    },
    bodyLarge: {
      fontSize: '16px',
      fontWeight: 400,
      color: colors.textPrimary,
    },
    bodyMedium: {
      fontSize: '14px',
      fontWeight: 400,
      color: colors.textPrimary,
    },
    bodySmall: {
      fontSize: '12px',
      fontWeight: 400,
      color: colors.textSecondary,
    },
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const;

export const borderRadius = {
  sm: '10px',
  md: '12px',
  lg: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  card: '0 1px 3px rgba(0, 0, 0, 0.12)',
} as const;

export const buttons = {
  padding: {
    horizontal: '24px',
    vertical: '12px',
  },
  borderRadius: borderRadius.sm,
  fontSize: typography.fontSize.buttonText,
  fontWeight: typography.fontWeight.semibold,
} as const;

export const inputs = {
  padding: {
    horizontal: '16px',
    vertical: '12px',
  },
  borderRadius: borderRadius.md,
  borderWidth: '1px',
  borderColor: colors.grey300,
  backgroundColor: colors.grey100,
  focusBorderColor: colors.electricGreen,
  focusBorderWidth: '2px',
} as const;

export const cards = {
  borderRadius: borderRadius.md,
  backgroundColor: colors.white,
  padding: spacing.lg,
  shadow: shadows.card,
} as const;

export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  buttons,
  inputs,
  cards,
} as const;

export default designSystem;

