import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { UserRole } from "@/types/prisma";

// Define public paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/error",
  "/api/auth(.+)"
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if path is public (no auth required)
    const isPublicPath = publicPaths.some(publicPath => {
      if (publicPath.endsWith("(.+)")) {
        const basePath = publicPath.replace("(.+)", "");
        return path.startsWith(basePath);
      }
      return path === publicPath;
    });

    // Allow access to public paths without redirect
    if (isPublicPath) {
      return NextResponse.next();
    }

    // If not authenticated and trying to access protected route, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userRole = token.role as UserRole;

    // Admin routes protection
    if (path.startsWith("/admin") && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Teacher routes protection
    if (path.startsWith("/teacher") && userRole !== UserRole.TEACHER && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Student routes protection
    if (path.startsWith("/student") && !([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN].includes(userRole))) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // API routes protection (except auth routes)
    if (path.startsWith("/api") && !path.startsWith("/api/auth")) {
      // Different API endpoints can have different role requirements
      if (path.startsWith("/api/admin") && userRole !== UserRole.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      
      if (path.startsWith("/api/teacher") && userRole !== UserRole.TEACHER && userRole !== UserRole.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on matching paths
      authorized: () => true // Let the middleware function handle the authorization
    }
  }
);

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except those starting with _next, static, or api routes
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
