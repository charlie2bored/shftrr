import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    console.log("📝 Signup attempt:", { name, email });

    // Create user with validation and password hashing
    const user = await createUser({
      name,
      email,
      password,
    });

    console.log("✅ User created successfully");

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle specific validation errors
    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error.message.includes("must be")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
