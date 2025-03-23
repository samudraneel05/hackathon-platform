import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/teams/[id] - Get a single team by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        hackathon: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            profile: true,
          },
        },
        project: {
          include: {
            feedbacks: {
              include: {
                giver: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// PATCH /api/teams/[id] - Update a team
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the team to check if the user is authorized to update it
    const team = await prisma.team.findUnique({
      where: { id },
      select: { creatorId: true, hackathonId: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if the user is the creator, a teacher, or an admin
    if (team.creatorId !== session.user.id && 
        !["ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized to update this team" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { name, description, memberIds } = data;

    // Start building the update object
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    
    // Update members if provided
    if (memberIds && Array.isArray(memberIds)) {
      // Get the hackathon to check team size limit
      const hackathon = await prisma.hackathon.findUnique({
        where: { id: team.hackathonId },
        select: { maxTeamSize: true },
      });
      
      if (hackathon && memberIds.length > hackathon.maxTeamSize) {
        return NextResponse.json(
          { error: `Team size cannot exceed the maximum limit of ${hackathon.maxTeamSize}` },
          { status: 400 }
        );
      }

      // Ensure creator is always a member
      if (!memberIds.includes(team.creatorId)) {
        memberIds.push(team.creatorId);
      }

      // Set the members
      updateData.members = {
        set: [], // Clear existing connections
        connect: memberIds.map((id: string) => ({ id })),
      };
    }
    
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: updateData,
      include: {
        members: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id] - Delete a team
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the team to check if the user is authorized to delete it
    const team = await prisma.team.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Only the creator or an admin can delete a team
    if (team.creatorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to delete this team" },
        { status: 403 }
      );
    }

    // Delete the team
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
