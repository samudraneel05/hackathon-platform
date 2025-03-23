import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/types/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      // If there's no session, redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Get the user role and determine the appropriate redirect
    const role = session.user.role as string;
    let redirectUrl = "/";
    
    switch (role.toUpperCase()) {
      case UserRole.ADMIN:
        redirectUrl = "/admin/dashboard";
        break;
      case UserRole.TEACHER:
        redirectUrl = "/teacher/dashboard";
        break;
      case UserRole.STUDENT:
        redirectUrl = "/student/dashboard";
        break;
    }
    
    // Redirect to the appropriate dashboard
    return NextResponse.redirect(new URL(redirectUrl, req.url));
    
  } catch (error) {
    console.error("Session redirect error:", error);
    // If there's an error, redirect to homepage
    return NextResponse.redirect(new URL("/", req.url));
  }
}
