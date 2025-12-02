import type { NextRequest } from 'next/server';

/**
 * Get the base URL for the site
 * Works in both server and client contexts
 */
export function getBaseUrl(request?: Request | NextRequest): string {
  // If request is provided, extract URL from it (most reliable)
  if (request) {
    try {
      const url = new URL(request.url);
      return `${url.protocol}//${url.host}`;
    } catch (error) {
      // If URL parsing fails, fall through to env vars
      console.warn('Failed to parse request URL:', error);
    }
  }
  
  // Try NEXT_PUBLIC_SITE_URL first (most reliable - set explicitly)
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: check env vars
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Try VERCEL_URL (Vercel provides this automatically)
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl.startsWith('http')) {
      return vercelUrl.replace(/\/$/, '');
    }
    return `https://${vercelUrl.replace(/\/$/, '')}`;
  }
  
  // Fallback
  return 'http://localhost:3000';
}

