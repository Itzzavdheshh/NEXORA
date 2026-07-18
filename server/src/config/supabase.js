const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Server-side client: disable all session persistence so the service-role key
// is always used as the Authorization header for every request. Without this,
// calling signUp() or signInWithPassword() on the shared singleton stores the
// user's JWT internally, causing subsequent table queries to run under that
// user's identity instead of bypassing RLS as the service role.
const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

module.exports = supabase;