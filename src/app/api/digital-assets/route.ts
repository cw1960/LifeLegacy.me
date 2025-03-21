import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { storageBuckets } from '@/lib/supabase/storage';

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
    
    // Get form data with file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assetName = formData.get('asset_name') as string;
    const assetType = formData.get('asset_type') as string;
    const description = formData.get('description') as string;
    const accessLevel = formData.get('access_level') as string;
    
    if (!file || !assetName || !assetType || !accessLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Upload file to Supabase Storage
    const clientId = clientData.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${clientId}_${Date.now()}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(storageBuckets.DIGITAL_ASSETS)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
    
    // Create asset record in database
    const { data: asset, error: assetError } = await supabase
      .from('digital_assets')
      .insert({
        client_id: clientId,
        asset_name: assetName,
        asset_type: assetType,
        file_path: `${storageBuckets.DIGITAL_ASSETS}/${filePath}`,
        description: description || null,
        size: file.size.toString(),
        access_level: accessLevel,
        storage_path: uploadData.path
      })
      .select()
      .single();
      
    if (assetError) {
      console.error('Asset creation error:', assetError);
      // Attempt to delete the uploaded file if the database insert fails
      await supabase.storage.from(storageBuckets.DIGITAL_ASSETS).remove([filePath]);
      return NextResponse.json({ error: 'Failed to create asset record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Asset created successfully', 
      asset 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error handling asset upload:', error);
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
    
    // Get assets from database
    const { data: assets, error } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching assets:', error);
      return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
    }
    
    // Get signed URLs for each asset
    const assetsWithUrls = await Promise.all(
      assets.map(async (asset) => {
        const { data: urlData } = await supabase
          .storage
          .from(storageBuckets.DIGITAL_ASSETS)
          .createSignedUrl(asset.storage_path, 60 * 60); // 1 hour expiry
          
        return {
          ...asset,
          signed_url: urlData?.signedUrl || null
        };
      })
    );
    
    return NextResponse.json({ assets: assetsWithUrls });
    
  } catch (error) {
    console.error('Error fetching assets:', error);
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
    const assetId = searchParams.get('id');
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }
    
    // First, get the asset to check ownership and get the file path
    const { data: asset, error: fetchError } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('id', assetId)
      .eq('client_id', clientId)
      .single();
      
    if (fetchError || !asset) {
      return NextResponse.json({ error: 'Asset not found or access denied' }, { status: 404 });
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase
      .storage
      .from(storageBuckets.DIGITAL_ASSETS)
      .remove([asset.storage_path]);
      
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
    
    // Delete the asset record from the database
    const { error: deleteError } = await supabase
      .from('digital_assets')
      .delete()
      .eq('id', assetId)
      .eq('client_id', clientId);
      
    if (deleteError) {
      console.error('Error deleting asset record:', deleteError);
      return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Asset deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting asset:', error);
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
    const { id, asset_name, description, access_level } = data;
    
    if (!id || (!asset_name && !description && !access_level)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if asset exists and belongs to client
    const { data: existingAsset, error: fetchError } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('id', id)
      .eq('client_id', clientId)
      .single();
      
    if (fetchError || !existingAsset) {
      return NextResponse.json({ error: 'Asset not found or access denied' }, { status: 404 });
    }
    
    // Update the asset record
    const updates: any = {};
    if (asset_name) updates.asset_name = asset_name;
    if (description !== undefined) updates.description = description;
    if (access_level) updates.access_level = access_level;
    
    const { data: updatedAsset, error: updateError } = await supabase
      .from('digital_assets')
      .update(updates)
      .eq('id', id)
      .eq('client_id', clientId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating asset:', updateError);
      return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Asset updated successfully',
      asset: updatedAsset
    });
    
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 