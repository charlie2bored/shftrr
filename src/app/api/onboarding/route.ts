import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { schemas } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate onboarding data
    const validatedData = schemas.onboarding.parse(body);

    // Save onboarding data
    const onboarding = await prisma.userOnboarding.upsert({
      where: { userId: session.user.id },
      update: {
        ...validatedData,
        completed: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        ...validatedData,
        completed: true,
      },
    });

    return NextResponse.json({
      message: "Onboarding completed successfully",
      onboarding,
    });

  } catch (error: any) {
    console.error("Onboarding error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid onboarding data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Onboarding GET request received');
    const session = await getServerSession(authOptions);
    console.log('👤 Session user ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.log('❌ No session or user ID');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const onboarding = await prisma.userOnboarding.findUnique({
      where: { userId: session.user.id },
    });

    console.log('📊 Onboarding record found:', !!onboarding);
    console.log('✅ Completed status:', !!onboarding?.completed);

    return NextResponse.json({
      onboarding,
      completed: !!onboarding?.completed,
    });

  } catch (error) {
    console.error("Get onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
