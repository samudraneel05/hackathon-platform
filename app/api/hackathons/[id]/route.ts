import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/hackathons/[id] - Get a single hackathon by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        teams: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            project: true,
          },
        },
        projects: {
          include: {
            contributors: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            team: true,
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

    return NextResponse.json(hackathon);
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathon" },
      { status: 500 }
    );
  }
}

// PATCH /api/hackathons/[id] - Update a hackathon
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

    // Fetch the hackathon to check if the user is authorized to update it
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // Check if the user is the creator or an admin
    if (hackathon.creatorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to update this hackathon" },
        { status: 403 }
      );
    }

    const data = await req.json();
    
    const updatedHackathon = await prisma.hackathon.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedHackathon);
  } catch (error) {
    console.error("Error updating hackathon:", error);
    return NextResponse.json(
      { error: "Failed to update hackathon" },
      { status: 500 }
    );
  }
}

// DELETE /api/hackathons/[id] - Delete a hackathon
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

    // Fetch the hackathon to check if the user is authorized to delete it
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // Only the creator or an admin can delete a hackathon
    if (hackathon.creatorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to delete this hackathon" },
        { status: 403 }
      );
    }

    // Delete the hackathon
    await prisma.hackathon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hackathon:", error);
    return NextResponse.json(
      { error: "Failed to delete hackathon" },
      { status: 500 }
    );
  }
}
