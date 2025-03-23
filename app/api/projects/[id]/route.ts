import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/projects/[id] - Get a single project by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        hackathon: true,
        team: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        contributors: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
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
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
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

    // Fetch the project to check if the user is authorized to update it
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: true,
          },
        },
        contributors: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this project
    const isCreator = project.creatorId === session.user.id;
    const isTeamMember = project.team && project.team.members.some((member: { id: string }) => member.id === session.user.id);
    const isContributor = project.contributors.some((contributor: { id: string }) => contributor.id === session.user.id);
    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes(session.user.role);

    if (!isCreator && !isTeamMember && !isContributor && !isAdminOrTeacher) {
      return NextResponse.json(
        { error: "Unauthorized to update this project" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { title, description, repoUrl, demoUrl, imageUrl, contributorIds } = data;

    // Build the update data object
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (repoUrl !== undefined) updateData.repoUrl = repoUrl;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    // Only the project creator or admin can update contributors
    if (contributorIds && (isCreator || session.user.role === "ADMIN")) {
      // Ensure creator is always a contributor
      if (!contributorIds.includes(project.creatorId)) {
        contributorIds.push(project.creatorId);
      }
      
      updateData.contributors = {
        set: [], // Clear existing connections
        connect: contributorIds.map((id: string) => ({ id })),
      };
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        contributors: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        team: true,
        hackathon: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
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

    // Fetch the project to check if the user is authorized to delete it
    const project = await prisma.project.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only the creator or an admin can delete a project
    if (project.creatorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to delete this project" },
        { status: 403 }
      );
    }

    // Delete the project
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
