import { NextRequest } from 'next/server';

/**
 * Get the subdomain from the request hostname
 * @param request The NextRequest object
 * @returns The subdomain or null if on main domain
 */
export function getSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '';
  // In development, we may use localhost:3000 which doesn't have a subdomain
  const isDev = process.env.NODE_ENV === 'development';
  
  // For development environment handling
  if (isDev) {
    // Check if we're using a custom .localhost domain setup for local development
    // Example: tenant.localhost:3000
    if (hostname.includes('.localhost:')) {
      const parts = hostname.split('.');
      return parts.length >= 2 ? parts[0] : null;
    }
    
    // Special case for testing with a local URL parameter
    const url = new URL(request.url);
    const testSubdomain = url.searchParams.get('subdomain');
    if (testSubdomain) {
      return testSubdomain;
    }
    
    // If none of the above, probably just localhost:3000
    return null;
  }
  
  // Production environment handling
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || '';
  
  // Check if this is a vercel preview deployment with a unique URL
  if (hostname.includes('vercel.app')) {
    // For preview deployments, accept a subdomain parameter for testing
    const url = new URL(request.url);
    const testSubdomain = url.searchParams.get('subdomain');
    if (testSubdomain) {
      return testSubdomain;
    }
    return null;
  }
  
  // Normal production subdomain extraction
  // Example: tenant.lifelegacy.me
  if (hostname.endsWith(`.${appDomain}`)) {
    const parts = hostname.split('.');
    return parts.length >= 2 ? parts[0] : null;
  }
  
  return null;
}

/**
 * Check if the request is from the main app domain
 * @param request The NextRequest object
 * @returns True if on the main domain
 */
export function isMainDomain(request: NextRequest): boolean {
  const hostname = request.headers.get('host') || '';
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || '';
  
  // In development, check if we're on localhost without subdomains
  if (process.env.NODE_ENV === 'development') {
    // If using localhost:3000 (without subdomain)
    if (hostname === 'localhost:3000' || hostname === 'localhost:3001') {
      // Check if there's an intentional subdomain parameter
      const url = new URL(request.url);
      return !url.searchParams.has('subdomain');
    }
    // If using a .localhost domain format
    if (hostname.includes('.localhost:')) {
      return hostname === `app.localhost:3000` || hostname === `app.localhost:3001`;
    }
    return false;
  }
  
  // For Vercel preview deployments
  if (hostname.includes('vercel.app')) {
    const url = new URL(request.url);
    return !url.searchParams.has('subdomain');
  }
  
  // In production, the main domain is typically the naked domain (without www.)
  // or the www. subdomain is configured to redirect to the naked domain.
  return hostname === appDomain || hostname === `www.${appDomain}`;
}

/**
 * Build a URL for a specific tenant
 * @param subdomain The tenant subdomain
 * @param path The path (with leading slash)
 * @returns The full tenant URL
 */
export function buildTenantUrl(subdomain: string, path: string = '/'): string {
  const isDev = process.env.NODE_ENV === 'development';
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';
  
  if (isDev) {
    // In dev, either return a subdomain.localhost URL or a URL parameter
    // Check if we're configured to use .localhost domains
    if (appDomain.includes('localhost')) {
      return `http://${subdomain}.localhost:3000${path}`;
    } else {
      // Otherwise use a query parameter for testing
      return `http://localhost:3000${path}?subdomain=${subdomain}`;
    }
  }
  
  // For preview deployments
  if (appDomain.includes('vercel.app')) {
    return `https://${appDomain}${path}?subdomain=${subdomain}`;
  }
  
  // In production with custom domain
  return `https://${subdomain}.${appDomain}${path}`;
} 