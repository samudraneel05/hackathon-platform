import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@/types/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find if the user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: data.name || email.split('@')[0],
          image: data.image,
          role: UserRole.STUDENT,
          lastLogin: new Date(),
        },
        include: { accounts: true }
      });

      // Create Google account connection
      if (data.googleId) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: data.googleId,
          },
        });
      }
    } 
    // If user exists but doesn't have Google account linked
    else if (data.googleId && !user.accounts.some(acc => acc.provider === "google")) {
      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: data.googleId,
        },
      });

      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });
    }

    // Return success with user info
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image
      }
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
