import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { schemas } from "@/lib/validations";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { sanitizeRequestBody, getSecurityHeaders, getCorsHeaders } from "@/lib/sanitization";

async function signupHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Sanitize input data
    const sanitizedBody = sanitizeRequestBody(body);

    // Validate input data
    const validatedData = schemas.user.register.parse(sanitizedBody);
    console.log("📝 Signup attempt:", { name: validatedData.name, email: validatedData.email });

    // Create user with validation and password hashing
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    });

    console.log("✅ User created successfully");

    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    });

    // Add security headers
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    Object.entries(getCorsHeaders(request.headers.get('origin') ?? undefined)).forEach(([key, value]) => {
      if (typeof value === 'string') {
        response.headers.set(key, value);
      }
    });

    return response;

  } catch (error: any) {
    console.error("Signup error:", error);

    let statusCode = 500;
    let errorMessage = "Internal server error";

    // Handle specific validation errors
    if (error.message.includes("already exists")) {
      statusCode = 409; // Conflict
      errorMessage = "A user with this email already exists";
    } else if (error.message.includes("must be")) {
      statusCode = 400; // Bad Request
      errorMessage = error.message;
    } else if (error.message.includes("Suspicious input detected")) {
      statusCode = 400;
      errorMessage = "Invalid input data";
    }

    const response = NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );

    // Add security headers even for error responses
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}

// Apply rate limiting to the signup handler
export const POST = withRateLimit(signupHandler, rateLimitConfigs.auth);
