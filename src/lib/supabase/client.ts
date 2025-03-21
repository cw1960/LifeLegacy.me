import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Database } from "@/lib/supabase/database.types";

export const createClient = () => {
  return createClientComponentClient<Database>();
};

/**
 * Creates a Supabase client for use in browser components
 */
export const supabase = createClient(); 