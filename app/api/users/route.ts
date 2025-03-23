import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/users - Get all users or filter by role
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin and teachers can fetch all users
    if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    
    const whereClause: any = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        profile: true,
        createdAt: true,
        _count: {
          select: {
            teams: true,
            projects: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
