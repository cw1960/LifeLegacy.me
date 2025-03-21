import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

async function executeSql(sql: string): Promise<any> {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Prefer': 'params=single-object',
      },
      body: JSON.stringify({
        query: sql,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SQL execution failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'prisma', 'supabase.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the content into individual statements
    // This splitting logic handles more complex SQL with functions, triggers, etc.
    const statements = [];
    let currentStatement = '';
    let inFunction = false;
    
    sqlContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines when building statements
      if (trimmedLine.startsWith('--') || trimmedLine === '') {
        return;
      }
      
      // Check if we're entering a function/trigger definition
      if (trimmedLine.includes('FUNCTION') || trimmedLine.includes('TRIGGER')) {
        inFunction = true;
      }
      
      // Add the line to the current statement
      currentStatement += line + '\n';
      
      // Check if the statement is complete
      if ((trimmedLine.endsWith(';') && !inFunction) || 
          (inFunction && trimmedLine === '$$;')) {
        statements.push(currentStatement.trim());
        currentStatement = '';
        inFunction = false;
      }
    });
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    console.log(`Found ${statements.length} SQL statements to execute.`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await executeSql(statement);
        console.log(`Successfully executed statement ${i + 1}`);
      } catch (err) {
        console.error(`Exception executing statement ${i + 1}:`, err);
      }
    }

    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initDatabase(); 