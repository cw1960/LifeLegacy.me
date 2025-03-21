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
      document_name, 
      document_type, 
      location, 
      storage_details, 
      contact_name, 
      contact_info, 
      notes 
    } = data;
    
    if (!document_name || !document_type || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create physical document record in database
    const { data: document, error: documentError } = await supabase
      .from('physical_documents')
      .insert({
        client_id: clientData.id,
        document_name,
        document_type,
        location,
        storage_details: storage_details || null,
        contact_name: contact_name || null,
        contact_info: contact_info || null,
        notes: notes || null
      })
      .select()
      .single();
      
    if (documentError) {
      console.error('Document creation error:', documentError);
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Document created successfully', 
      document 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error handling document creation:', error);
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
    
    // Get physical documents from database
    const { data: documents, error } = await supabase
      .from('physical_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
    
    return NextResponse.json({ documents });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
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
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }
    
    // Delete the document record from the database
    const { error: deleteError } = await supabase
      .from('physical_documents')
      .delete()
      .eq('id', documentId)
      .eq('client_id', clientId);
      
    if (deleteError) {
      console.error('Error deleting document record:', deleteError);
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Document deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting document:', error);
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
      document_name, 
      document_type, 
      location, 
      storage_details, 
      contact_name, 
      contact_info, 
      notes 
    } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }
    
    // Build update object with only the fields that are provided
    const updateData: any = {};
    if (document_name) updateData.document_name = document_name;
    if (document_type) updateData.document_type = document_type;
    if (location) updateData.location = location;
    
    // These fields can be null/undefined if they're being removed
    updateData.storage_details = storage_details;
    updateData.contact_name = contact_name;
    updateData.contact_info = contact_info;
    updateData.notes = notes;
    
    // Update the document in the database
    const { data: document, error: updateError } = await supabase
      .from('physical_documents')
      .update(updateData)
      .eq('id', id)
      .eq('client_id', clientId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating document:', updateError);
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Document updated successfully',
      document
    });
    
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 