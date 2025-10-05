// backend/supabaseClient.js
require("dotenv").config(); // must be at the top!

const { createClient } = require("@supabase/supabase-js");

// Debug: remove or comment these lines after verifying
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
