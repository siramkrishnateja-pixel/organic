import { createBrowserClient } from '@supabase/ssr';

// Use a singleton pattern to ensure we only create one client per browser session
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
