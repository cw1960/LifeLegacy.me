import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import crypto from 'crypto';

// POST handler for creating invitations
export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.log('No session found - user is not authenticated');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('User authenticated:', session.user.id);

  try {
    // Parse request body
    const { firstName, lastName, email, notes } = await request.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }
    
    // Check if user is a registered professional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('id, organization_id')
      .eq('user_id', session.user.id)
      .single();
    
    console.log('Professional check result:', { professional, error: professionalError });
    
    if (professionalError || !professional) {
      console.log('Professional not found for user ID:', session.user.id);
      console.log('Error details:', professionalError);
      
      return NextResponse.json(
        { error: 'User is not registered as a professional' },
        { status: 403 }
      );
    }
    
    // Check if client with this email already exists in this organization
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .eq('organization_id', professional.organization_id)
      .maybeSingle();
    
    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this email already exists in your organization' },
        { status: 409 }
      );
    }
    
    // Check if there's already a pending invitation for this email
    const { data: existingInvitation } = await supabase
      .from('client_invitations')
      .select('id, status')
      .eq('email', email)
      .eq('organization_id', professional.organization_id)
      .maybeSingle();
    
    if (existingInvitation) {
      const status = existingInvitation.status;
      if (status === 'pending') {
        return NextResponse.json(
          { error: 'An invitation is already pending for this email address' },
          { status: 409 }
        );
      } else if (status === 'accepted') {
        return NextResponse.json(
          { error: 'This email has already accepted an invitation' },
          { status: 409 }
        );
      }
    }
    
    // Generate invitation token and set expiration date (30 days from now)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Create invitation record
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .insert({
        organization_id: professional.organization_id,
        professional_id: professional.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        notes: notes || null,
        token: token,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();
    
    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }
    
    // TODO: Send invitation email with token
    console.log(`Would send invitation email to ${email} with token ${token}`);
    
    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        status: invitation.status,
        created_at: invitation.created_at,
      }
    });
    
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 }
    );
  }
}

// GET handler for retrieving invitations
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.log('GET: No session found - user is not authenticated');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('GET: User authenticated:', session.user.id);
  
  try {
    // Check if user is a registered professional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('id, organization_id')
      .eq('user_id', session.user.id)
      .single();
    
    console.log('GET: Professional check result:', { professional, error: professionalError });
    
    if (professionalError || !professional) {
      console.log('GET: Professional not found for user ID:', session.user.id);
      console.log('GET: Error details:', professionalError);
      
      return NextResponse.json(
        { error: 'User is not registered as a professional' },
        { status: 403 }
      );
    }
    
    // Get invitations for this organization
    const { data: invitations, error: invitationsError } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('organization_id', professional.organization_id)
      .order('created_at', { ascending: false });
    
    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ invitations });
    
  } catch (error) {
    console.error('Error retrieving invitations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve invitations' },
      { status: 500 }
    );
  }
} 