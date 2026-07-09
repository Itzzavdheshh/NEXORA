// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// const supabase = createClient(supabaseUrl, supabaseSecretKey);

// module.exports = supabase;


const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Secret Key Prefix:", supabaseSecretKey?.substring(0, 15));

const supabase = createClient(supabaseUrl, supabaseSecretKey);

module.exports = supabase;