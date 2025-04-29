// src/components/SignOutButton.tsx
import { logout } from "@/actions/auth"; // Import the logout server action

export function SignOutButton() {
  return (
    // Use a form to trigger the server action on submit
    <form action={logout}>
      <button
        type="submit"
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Sign Out
      </button>
    </form>
  );
}
