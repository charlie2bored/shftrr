import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { schemas } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { nextActionDate: 'asc' },
        { updatedAt: 'desc' }
      ],
    });

    return NextResponse.json({
      applications,
      total: applications.length,
    });

  } catch (error) {
    console.error("Get job applications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Basic validation - you can enhance this with Zod schemas
    const { company, role, ...otherFields } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required" },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        company: company.trim(),
        role: role.trim(),
        jobUrl: otherFields.jobUrl?.trim() || null,
        jobBoard: otherFields.jobBoard?.trim() || null,
        status: otherFields.status || 'wishlist',
        appliedDate: otherFields.appliedDate ? new Date(otherFields.appliedDate) : null,
        nextActionDate: otherFields.nextActionDate ? new Date(otherFields.nextActionDate) : null,
        nextAction: otherFields.nextAction?.trim() || null,
        notes: otherFields.notes?.trim() || null,
      },
    });

    return NextResponse.json({
      application,
      message: "Job application created successfully",
    });

  } catch (error) {
    console.error("Create job application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
