import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/projects - Get all projects or filter by hackathon
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const hackathonId = searchParams.get("hackathonId");
    const teamId = searchParams.get("teamId");
    
    const whereClause: any = {};
    if (hackathonId) whereClause.hackathonId = hackathonId;
    if (teamId) whereClause.teamId = teamId;
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
          },
        },
        team: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        contributors: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
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
    const { title, description, repoUrl, demoUrl, imageUrl, hackathonId, teamId, contributorIds = [] } = data;

    // Check if the hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // If teamId is provided, check if the team exists and belongs to the hackathon
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
        },
      });

      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 404 }
        );
      }

      if (team.hackathonId !== hackathonId) {
        return NextResponse.json(
          { error: "Team does not belong to the specified hackathon" },
          { status: 400 }
        );
      }

      // Check if the user is a member of the team
      const isTeamMember = team.members.some((member: { id: string }) => member.id === session.user.id);
      
      if (!isTeamMember && session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "You must be a member of the team to submit a project" },
          { status: 403 }
        );
      }
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        repoUrl,
        demoUrl,
        imageUrl,
        submissionDate: new Date(),
        hackathon: { connect: { id: hackathonId } },
        creator: { connect: { id: session.user.id } },
        ...(teamId && { team: { connect: { id: teamId } } }),
        contributors: {
          connect: [
            { id: session.user.id },
            ...contributorIds
              .filter((id: string) => id !== session.user.id)
              .map((id: string) => ({ id })),
          ],
        },
      },
      include: {
        hackathon: true,
        team: true,
        contributors: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
