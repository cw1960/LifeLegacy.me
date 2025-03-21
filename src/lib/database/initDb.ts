import { supabase } from '../supabase/client';

/**
 * Initializes the database tables required for the application
 */
export async function initDatabase() {
  console.log('Checking database setup...');
  
  try {
    // Check if professionals table exists
    const { error: checkError } = await supabase
      .from('professionals')
      .select('id')
      .limit(1);
      
    if (checkError && checkError.message.includes('relation "public.professionals" does not exist')) {
      console.log('Creating professionals table...');
      
      // Instead of trying to create the table directly, guide the user
      console.warn('Database tables are missing. Please run the SQL initialization script from prisma/supabase_lowercase.sql in your Supabase dashboard SQL editor.');
      
      return { 
        success: false, 
        error: new Error('Missing database tables. Please run the initialization script.'),
        missingTables: true
      };
    } else {
      console.log('Professionals table already exists');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
}

/**
 * Checks if the database is properly set up
 */
export async function checkDatabaseSetup() {
  try {
    // Check if professionals table exists
    const { error } = await supabase
      .from('professionals')
      .select('id')
      .limit(1);
      
    if (error && error.message.includes('relation "public.professionals" does not exist')) {
      return { exists: false, error };
    }
    
    return { exists: true };
  } catch (error) {
    console.error('Error checking database setup:', error);
    return { exists: false, error };
  }
}
