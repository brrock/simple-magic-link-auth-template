import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const SESSION_EXPIRATION_DAYS = 30; // Set to 30 days for session expiration
const SESSION_COOKIE_NAME = "app_session_token"; // Must match

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    console.log("Verification attempt without token");
    return NextResponse.redirect(
      new URL("/login?error=Missing token", request.url),
    );
  }

  try {
    // 1. Find and delete the token in one atomic operation (if possible with Prisma)
    // Or find first, then delete if valid. Let's do find then delete for clarity.
    const magicToken = await prisma.magicLinkToken.findUnique({
      where: {
        token: token,
        expiresAt: {
          gt: new Date(), // Check if not expired
        },
      },
    });

    if (!magicToken) {
      console.log(`Invalid or expired token received: ${token.substring(0, 6)}...`);
      // Optionally delete expired tokens here or via a cron job
      await prisma.magicLinkToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return NextResponse.redirect(
        new URL("/login?error=Invalid or expired link", request.url),
      );
    }

    // Token is valid, get email and delete the token
    const userEmail = magicToken.email;
    await prisma.magicLinkToken.delete({
      where: { id: magicToken.id },
    });
    console.log(`Successfully verified token for ${userEmail}, deleting token.`);

    // 2. Find or create the user
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {}, // No updates needed if user exists
      create: { email: userEmail },
    });

    // 3. Create a new session for the user
    const sessionToken = randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(
      Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.session.create({
      data: {
        sessionToken: sessionToken,
        userId: user.id,
        expiresAt: sessionExpiresAt,
      },
    });
    console.log(`Created session for user ${user.id}`);

    // 4. Set the session cookie
    const cookieStore = await cookies();
    (await cookieStore).set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: sessionExpiresAt,
      path: "/",
      sameSite: "lax",
    });

    // 5. Redirect to the authenticated area (e.g., dashboard or home)
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home page

  } catch (error) {
    console.error("Error during token verification:", error);
    return NextResponse.redirect(
      new URL("/login?error=Verification failed", request.url),
    );
  }
}

