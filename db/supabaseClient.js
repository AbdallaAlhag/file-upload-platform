// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mhaespahsyjklywwmmwg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
    persistSession: true,
    autoRefreshToken: true,
});

module.exports = supabase;
