import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/feedback/[id] - Get a single feedback by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const feedback = await prisma.feedback.findUnique({
      where: { id },
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
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Regular users can only see feedback they've given or received
    if (!["ADMIN", "TEACHER"].includes(session.user.role) && 
        feedback.giverId !== session.user.id && 
        feedback.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view this feedback" },
        { status: 403 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// PATCH /api/feedback/[id] - Update feedback
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

    // Fetch the feedback to check if the user is authorized to update it
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            hackathon: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Only the feedback giver or an admin/teacher can update feedback
    if (feedback.giverId !== session.user.id && !["ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized to update this feedback" },
        { status: 403 }
      );
    }

    // Check if the hackathon is still active (unless admin/teacher)
    if (!["ADMIN", "TEACHER"].includes(session.user.role)) {
      const now = new Date();
      if (now > feedback.project.hackathon.endDate) {
        return NextResponse.json(
          { error: "Cannot update feedback after hackathon has ended" },
          { status: 400 }
        );
      }
    }

    const data = await req.json();
    const { content, rating } = data;

    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = rating;
    
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            title: true,
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
    });

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback/[id] - Delete feedback
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

    // Fetch the feedback to check if the user is authorized to delete it
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            hackathon: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Only the feedback giver or an admin can delete feedback
    if (feedback.giverId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to delete this feedback" },
        { status: 403 }
      );
    }

    // Check if the hackathon is still active (unless admin)
    if (session.user.role !== "ADMIN") {
      const now = new Date();
      if (now > feedback.project.hackathon.endDate) {
        return NextResponse.json(
          { error: "Cannot delete feedback after hackathon has ended" },
          { status: 400 }
        );
      }
    }

    // Delete the feedback
    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
