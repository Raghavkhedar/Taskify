import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes should be protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/protected(.*)',
  '/organization(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  console.log('🔍 Middleware triggered for:', req.nextUrl.pathname);
  
  const { userId, orgId } = await auth();
  console.log('👤 User ID:', userId, 'Org ID:', orgId);
  
  // If it's a protected route, ensure user is authenticated
  if (isProtectedRoute(req)) {
    console.log('🔒 Protected route detected, checking auth...');
    await auth.protect();
    console.log('✅ Auth protection called');
    return;
  }
  
  // If user is authenticated and on the home page, handle organization routing
  if (userId && req.nextUrl.pathname === '/') {
    console.log('🏠 Authenticated user on home page, handling org routing...');
    
    let path = "/select-org"; // Default to organization selection/creation page
    
    if (orgId) {
      // User has an organization, redirect to their org dashboard
      path = `/organization/${orgId}`;
      console.log('✅ User has org, redirecting to org dashboard:', path);
    } else {
      console.log('📝 User has no org, redirecting to select/create org page');
    }
    
    const redirectUrl = new URL(path, req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  console.log('📍 Public route, continuing...');
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};