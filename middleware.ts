import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutePatterns = [
  /^\/sign-in/,
  /^\/sign-up/,
  /^\/\w+-\w+-\w+-\w+-\w+\/billboards/, // Pattern for dynamic ID routes
  /^\/api\/\w+-\w+-\w+-\w+-\w+\/billboards(\/\w+)?$/ // Match dynamic ID routes with optional billboardId
];

const isPublicRoute = (url: URL) => {
  return publicRoutePatterns.some(pattern => pattern.test(url.pathname));
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl;

  console.log('Request URL:', url.pathname);
  console.log('Is public route:', isPublicRoute(url));

  if (!isPublicRoute(url)) {
    try {
       auth();
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
