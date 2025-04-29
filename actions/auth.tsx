// src/actions/auth.ts
"use server";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { z } from "zod";
import MagicLinkEmail from "@/emails/magic-link";
const EMAIL_TOKEN_EXPIRATION_MINUTES = 25;
const SESSION_COOKIE_NAME = "app_session_token";

const EmailSchema = z.string().email({ message: "Invalid email address" });

// --- Request Magic Link ---
export async function requestMagicLink(formData: FormData) {
  const emailResult = EmailSchema.safeParse(formData.get("email"));

  if (!emailResult.success) {
    // Handle validation error - maybe return an error state to the form
    console.error("Invalid email:", emailResult.error.flatten());
    // For simplicity, redirecting back with an error query param
    return redirect("/login?error=Invalid email format");
  }
  const email = emailResult.data;

  try {
    // 1. Generate secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000,
    );

    // 2. Store token in DB
    await prisma.magicLinkToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });

    // 3. Create verification URL
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

    // 4. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [email],
      subject: "Your Magic Sign-In Link",
      react: <MagicLinkEmail magicLink={verificationUrl} appName="Magic Link Template"  />,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send magic link email.");
    }

    console.log(`Magic link sent to ${email}, ID: ${data?.id}`);

  } catch (error) {
    console.error("Error requesting magic link:", error);
    // Redirect back to login with a generic error
    redirect("/login?error=Failed to send magic link");
  }
}

// --- Logout ---
export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    try {
      // Delete the session from the database
      await prisma.session.deleteMany({
        where: { sessionToken: sessionToken },
      });
    } catch (error) {
      console.error("Error deleting session from DB:", error);
      // Continue to delete cookie even if DB deletion fails
    }
  }

  // Delete the session cookie
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    expires: new Date(0), // Set expiry to past date
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Redirect to login page
  redirect("/login");
}

// --- Get Current User (Helper for Server Components/Pages) ---
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionToken,
        expiresAt: {
          gt: new Date(), // Check if session is not expired
        },
      },
      include: {
        user: true, // Include user data
      },
    });

    if (!session || !session.user) {
      // Invalid or expired session found, clear the cookie
      cookieStore.set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
      return null;
    }

    // Optional: Extend session expiry on activity (sliding window)
    // await prisma.session.update({
    //   where: { id: session.id },
    //   data: { expiresAt: new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000) },
    // });

    return session.user;
  } catch (error) {
    console.error("Error fetching session:", error);
    // Clear potentially problematic cookie
    cookieStore.set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
    return null;
  }
}

