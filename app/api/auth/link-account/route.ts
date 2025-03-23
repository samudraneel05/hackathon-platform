import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define interface for account object
interface AccountType {
  provider: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { provider, providerAccountId } = data;

    if (!provider || !providerAccountId) {
      return NextResponse.json(
        { error: "Provider and providerAccountId are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if this provider is already linked
    const existingAccount = user.accounts.find(
      (account: AccountType) => account.provider === provider
    );

    if (existingAccount) {
      return NextResponse.json(
        { message: "Account already linked" },
        { status: 200 }
      );
    }

    // Create a new account link
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider,
        providerAccountId,
        // Add other fields as needed
      },
    });

    return NextResponse.json({ message: "Account linked successfully" });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 }
    );
  }
}
