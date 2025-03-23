import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/feedback - Get all feedback or filter by project
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const giverId = searchParams.get("giverId");
    const receiverId = searchParams.get("receiverId");
    
    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (giverId) whereClause.giverId = giverId;
    if (receiverId) whereClause.receiverId = receiverId;
    
    // Regular users can only see feedback they've given or received unless they're admin/teacher
    if (!["ADMIN", "TEACHER"].includes(session.user.role)) {
      whereClause.OR = [
        { giverId: session.user.id },
        { receiverId: session.user.id }
      ];
    }
    
    const feedback = await prisma.feedback.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            hackathonId: true,
          },
        },
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
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Create new feedback
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
    const { content, rating, projectId, receiverId } = data;

    // Basic validation
    if (!content || rating === undefined || !projectId || !receiverId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        hackathon: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if the hackathon is still active if the user is not admin/teacher
    if (!["ADMIN", "TEACHER"].includes(session.user.role)) {
      const now = new Date();
      if (now > project.hackathon.endDate) {
        return NextResponse.json(
          { error: "Cannot submit feedback after hackathon has ended" },
          { status: 400 }
        );
      }
    }

    // Prevent users from giving feedback to themselves
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot give feedback to yourself" },
        { status: 400 }
      );
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        content,
        rating,
        project: { connect: { id: projectId } },
        giver: { connect: { id: session.user.id } },
        receiver: { connect: { id: receiverId } },
      },
      include: {
        project: true,
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
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
