const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zvazeearuwvotdmqveyf.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2YXplZWFydXd2b3RkbXF2ZXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODY4NDUsImV4cCI6MjA4NjI2Mjg0NX0.PWL32fyq5v_o9gfmVBrtRCHwOZVtv-Eit0h8TF6acS0";

// Extract projectId from URL
export const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
export const publicAnonKey = supabaseAnonKey;
