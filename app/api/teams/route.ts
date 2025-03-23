import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/teams - Get all teams or filter by hackathon
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const hackathonId = searchParams.get("hackathonId");
    
    const whereClause = hackathonId ? { hackathonId } : {};
    
    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, description, hackathonId, memberIds = [] } = data;

    // Check if the hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        teams: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // Check if the team name is already taken in this hackathon
    const existingTeam = await prisma.team.findFirst({
      where: {
        name,
        hackathonId,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Team name already exists in this hackathon" },
        { status: 400 }
      );
    }

    // Create the team and connect members
    const team = await prisma.team.create({
      data: {
        name,
        description,
        hackathon: { connect: { id: hackathonId } },
        creator: { connect: { id: session.user.id } },
        members: {
          connect: [
            { id: session.user.id },
            ...memberIds.filter((id: string) => id !== session.user.id).map((id: string) => ({ id })),
          ],
        },
      },
      include: {
        members: true,
        hackathon: true,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
