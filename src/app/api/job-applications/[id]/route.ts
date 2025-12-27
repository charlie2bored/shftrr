import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company, role, ...otherFields } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required" },
        { status: 400 }
      );
    }

    // Verify the application belongs to the user
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data: {
        company: company.trim(),
        role: role.trim(),
        jobUrl: otherFields.jobUrl?.trim() || null,
        jobBoard: otherFields.jobBoard?.trim() || null,
        status: otherFields.status || existingApplication.status,
        appliedDate: otherFields.appliedDate ? new Date(otherFields.appliedDate) : existingApplication.appliedDate,
        nextActionDate: otherFields.nextActionDate ? new Date(otherFields.nextActionDate) : existingApplication.nextActionDate,
        nextAction: otherFields.nextAction?.trim() || null,
        notes: otherFields.notes?.trim() || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      application,
      message: "Job application updated successfully",
    });

  } catch (error) {
    console.error("Update job application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the application belongs to the user
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Job application deleted successfully",
    });

  } catch (error) {
    console.error("Delete job application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
