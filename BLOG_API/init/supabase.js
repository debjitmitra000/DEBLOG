const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseServiceKey } = require('../config/keys');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
