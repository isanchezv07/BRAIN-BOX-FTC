// @Isanchezv
// src/lib/Supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getSupabaseAdmin = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error("❌ ERROR: Falta SUPABASE_SERVICE_ROLE_KEY en el .env");
    return supabase; 
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
};