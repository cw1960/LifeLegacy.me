import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get client ID for the logged-in user
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();
      
    if (clientError || !clientData) {
      return NextResponse.json({ error: 'Client record not found' }, { status: 404 });
    }
    
    // Get request body
    const data = await request.json();
    const { 
      account_name, 
      account_type, 
      username, 
      email,
      website_url,
      notes,
      recovery_info,
      is_password_stored
    } = data;
    
    if (!account_name || !account_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create online account record in database
    const { data: account, error: accountError } = await supabase
      .from('online_accounts')
      .insert({
        client_id: clientData.id,
        account_name,
        account_type,
        username: username || null,
        email: email || null,
        website_url: website_url || null,
        notes: notes || null,
        recovery_info: recovery_info || null,
        is_password_stored: is_password_stored || false
      })
      .select()
      .single();
      
    if (accountError) {
      console.error('Account creation error:', accountError);
      return NextResponse.json({ error: 'Failed to create account record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Account created successfully', 
      account 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error handling account creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get client ID for the logged-in user
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();
      
    if (clientError || !clientData) {
      return NextResponse.json({ error: 'Client record not found' }, { status: 404 });
    }
    
    const clientId = clientData.id;
    
    // Get online accounts from database
    const { data: accounts, error } = await supabase
      .from('online_accounts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching accounts:', error);
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
    
    return NextResponse.json({ accounts });
    
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get client ID for the logged-in user
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();
      
    if (clientError || !clientData) {
      return NextResponse.json({ error: 'Client record not found' }, { status: 404 });
    }
    
    const clientId = clientData.id;
    
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');
    
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    // Delete the account record from the database
    const { error: deleteError } = await supabase
      .from('online_accounts')
      .delete()
      .eq('id', accountId)
      .eq('client_id', clientId);
      
    if (deleteError) {
      console.error('Error deleting account record:', deleteError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Account deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get client ID for the logged-in user
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single();
      
    if (clientError || !clientData) {
      return NextResponse.json({ error: 'Client record not found' }, { status: 404 });
    }
    
    const clientId = clientData.id;
    
    const data = await request.json();
    const { 
      id,
      account_name, 
      account_type, 
      username, 
      email,
      website_url,
      notes,
      recovery_info,
      is_password_stored
    } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    // Build update object with only the fields that are provided
    const updateData: any = {};
    if (account_name) updateData.account_name = account_name;
    if (account_type) updateData.account_type = account_type;
    
    // These fields can be null/undefined if they're being removed
    updateData.username = username;
    updateData.email = email;
    updateData.website_url = website_url;
    updateData.notes = notes;
    updateData.recovery_info = recovery_info;
    updateData.is_password_stored = is_password_stored;
    
    // Update the account in the database
    const { data: account, error: updateError } = await supabase
      .from('online_accounts')
      .update(updateData)
      .eq('id', id)
      .eq('client_id', clientId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating account:', updateError);
      return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Account updated successfully',
      account
    });
    
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 