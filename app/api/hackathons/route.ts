import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/hackathons - Get all hackathons
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get("isActive");
    
    const whereClause = isActive ? { isActive: isActive === "true" } : {};
    
    const hackathons = await prisma.hackathon.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            participants: true,
            teams: true,
            projects: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(hackathons);
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
      { status: 500 }
    );
  }
}

// POST /api/hackathons - Create a new hackathon
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const data = await req.json();
    
    const hackathon = await prisma.hackathon.create({
      data: {
        ...data,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(hackathon, { status: 201 });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    return NextResponse.json(
      { error: "Failed to create hackathon" },
      { status: 500 }
    );
  }
}
