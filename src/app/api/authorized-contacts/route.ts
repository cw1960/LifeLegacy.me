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
      full_name, 
      relationship, 
      email, 
      phone,
      address,
      access_level,
      notes
    } = data;
    
    if (!full_name || !relationship || !access_level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create contact record in database
    const { data: contact, error: contactError } = await supabase
      .from('authorized_contacts')
      .insert({
        client_id: clientData.id,
        full_name,
        relationship,
        email: email || null,
        phone: phone || null,
        address: address || null,
        access_level,
        notes: notes || null
      })
      .select()
      .single();
      
    if (contactError) {
      console.error('Contact creation error:', contactError);
      return NextResponse.json({ error: 'Failed to create contact record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Contact created successfully', 
      contact 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error handling contact creation:', error);
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
    
    // Get contacts from database
    const { data: contacts, error } = await supabase
      .from('authorized_contacts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching contacts:', error);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
    
    return NextResponse.json({ contacts });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
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
    const contactId = searchParams.get('id');
    
    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }
    
    // Delete the contact record from the database
    const { error: deleteError } = await supabase
      .from('authorized_contacts')
      .delete()
      .eq('id', contactId)
      .eq('client_id', clientId);
      
    if (deleteError) {
      console.error('Error deleting contact record:', deleteError);
      return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Contact deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
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
      full_name, 
      relationship, 
      email, 
      phone,
      address,
      access_level,
      notes
    } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }
    
    // Build update object with only the fields that are provided
    const updateData: any = {};
    if (full_name) updateData.full_name = full_name;
    if (relationship) updateData.relationship = relationship;
    if (access_level) updateData.access_level = access_level;
    
    // These fields can be null/undefined if they're being removed
    updateData.email = email;
    updateData.phone = phone;
    updateData.address = address;
    updateData.notes = notes;
    
    // Update the contact in the database
    const { data: contact, error: updateError } = await supabase
      .from('authorized_contacts')
      .update(updateData)
      .eq('id', id)
      .eq('client_id', clientId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating contact:', updateError);
      return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Contact updated successfully',
      contact
    });
    
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 