import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generateStrongPassword } from '@/lib/utils/password';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Parse request body
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      );
    }
    
    // Find the invitation by token
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();
    
    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation token' },
        { status: 404 }
      );
    }
    
    // Check if the invitation has expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 410 }
      );
    }
    
    // Generate a temporary password
    const password = generateStrongPassword();
    
    // Create a new user account for the client
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        is_client: true,
        organization_id: invitation.organization_id,
      }
    });
    
    if (authError || !authUser.user) {
      console.error('Error creating user account:', authError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }
    
    // Create client record
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: authUser.user.id,
        organization_id: invitation.organization_id,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        email: invitation.email,
        notes: invitation.notes,
      })
      .select()
      .single();
    
    if (clientError) {
      console.error('Error creating client record:', clientError);
      return NextResponse.json(
        { error: 'Failed to create client record' },
        { status: 500 }
      );
    }
    
    // Update invitation status to accepted
    const { error: updateError } = await supabase
      .from('client_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);
    
    if (updateError) {
      console.error('Error updating invitation status:', updateError);
      // This is not a critical error, so we can continue
    }
    
    // Return success with the temporary password
    // In a production app, this would typically be emailed to the user
    // or they would be prompted to set their own password
    return NextResponse.json({
      message: 'Invitation accepted successfully',
      temporaryPassword: password,
      client: {
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
      }
    });
    
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 }
    );
  }
} 