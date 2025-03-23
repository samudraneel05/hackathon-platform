import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id]/profile - Get a user's profile
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST/PUT /api/users/[id]/profile - Create or update a user's profile
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Users can only update their own profile unless they are admin
    if (id !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to update this profile" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { bio, school, grade, skills, interests, githubUrl, linkedinUrl, websiteUrl } = data;

    // Check if the profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId: id },
        data: {
          bio,
          school,
          grade,
          skills,
          interests,
          githubUrl,
          linkedinUrl,
          websiteUrl,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          bio,
          school,
          grade,
          skills,
          interests,
          githubUrl,
          linkedinUrl,
          websiteUrl,
          user: { connect: { id } },
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
