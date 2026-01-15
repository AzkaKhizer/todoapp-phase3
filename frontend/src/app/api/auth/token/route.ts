/**
 * Custom JWT token endpoint.
 * Generates HS256 JWT for backend API authentication.
 */

import { auth } from "@/lib/auth-server";
import { SignJWT } from "jose";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET!);

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = await new SignJWT({
      sub: session.user.id,
      email: session.user.email,
      name: session.user.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
