import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create Supabase client (allow empty values during build, validate at runtime)
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    // Read env vars at runtime (not at module load time)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing Supabase environment variables. ' +
        'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel dashboard.'
      );
    }
    
    // Validate URL format
    try {
      const url = new URL(supabaseUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }
    } catch (error: any) {
      throw new Error(
        `Invalid Supabase URL: "${supabaseUrl}". ` +
        `Must be a valid HTTP or HTTPS URL. Error: ${error.message}`
      );
    }
    
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  
  return supabaseAdminInstance;
}

// Server-side Supabase client with service role key (bypasses RLS)
// Lazy initialization to avoid build-time errors
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = client[prop as keyof SupabaseClient];
    
    // Handle methods that return builders (like .from())
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  },
}) as SupabaseClient;

