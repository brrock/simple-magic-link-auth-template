import { getCurrentUser } from "@/actions/auth"; // Import the helper
import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser(); // Fetch user based on session cookie

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">Manual Magic Link Auth</h1>
      {user ? (
        <div className="text-center">
          <p className="mb-4 text-lg">
            Welcome, {user.email}!
          </p>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            (User ID: {user.id})
          </p>
          <SignOutButton />
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg">You are not signed in.</p>
          <Link
            href="/login"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      )}
    </main>
  );
}
