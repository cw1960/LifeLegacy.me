import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';
import { getSubdomain, isMainDomain } from '@/lib/utils/tenant';

export async function middleware(request: NextRequest) {
  // Skip middleware for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if we're in development mode on localhost (any port)
  const hostname = request.headers.get('host') || '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = hostname.includes('localhost:');
  
  if (isDevelopment && isLocalhost) {
    console.log('Middleware processing:', 'host=' + hostname, 'path=' + request.nextUrl.pathname);
    console.log('Development mode on localhost, bypassing tenant checks');
    return NextResponse.next();
  }

  // Initialize Supabase client
  const { supabase } = createClient(request);

  // Check if a subdomain is present and if we're not on the main domain
  const subdomain = getSubdomain(request);
  const onMainDomain = isMainDomain(request);

  // Handle subdomain routing (tenant-specific domains)
  if (subdomain && !onMainDomain) {
    // Check if the organization exists with this subdomain
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('id, active')
      .eq('subdomain', subdomain)
      .single();

    // If no matching organization, redirect to main domain
    if (error || !organization) {
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
    }

    // If organization is not active, redirect to main domain
    if (!organization.active) {
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // For authenticated users on tenant domains
    if (user) {
      // If accessing the auth pages while logged in, redirect to dashboard
      if (request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Otherwise allow access to tenant pages
      return NextResponse.next();
    } else {
      // For unauthenticated users on tenant domains
      // If not accessing auth pages, redirect to login
      if (!request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      // Otherwise allow access to auth pages
      return NextResponse.next();
    }
  } 
  
  // Handle main domain routing
  if (onMainDomain) {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if this user is associated with an organization as a professional
      const { data: professional } = await supabase
        .from('professionals')
        .select('organization_id, organizations(subdomain)')
        .eq('auth_user_id', user.id)
        .single();

      // If the user is a professional with an organization, redirect to their tenant domain
      if (professional?.organization_id && professional?.organizations?.subdomain) {
        const tenantUrl = new URL(
          request.nextUrl.pathname,
          `${request.nextUrl.protocol}//${professional.organizations.subdomain}.${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`
        );
        return NextResponse.redirect(tenantUrl);
      }

      // If accessing auth pages while logged in on main domain, redirect to dashboard
      if (request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // For unauthenticated users on main domain
      // If trying to access protected routes, redirect to login
      if (
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/settings')
      ) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Exclude static files, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|images|static).*)',
  ],
}; 