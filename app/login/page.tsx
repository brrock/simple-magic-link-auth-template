import { requestMagicLink } from "@/actions/auth";
import { redirect } from "next/navigation";

// Add searchParams prop to read query parameters
export default async function LoginPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const error =  searchParams?.error as string | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Sign In / Sign Up</h1>
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700 dark:bg-red-900 dark:text-red-200">
          Error: {decodeURIComponent(error)}
        </p>
      )}
    <form
      action={async (formData) => {
        "use server";
        await requestMagicLink(formData);
        redirect("/auth/check-email");
      }}
      className="w-full max-w-sm rounded bg-white p-8 shadow-md dark:bg-gray-800"
    >
      <div className="mb-4">
        <label
        htmlFor="email"
        className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
        >
        Email Address
        </label>
        <input
        id="email"
        name="email" // Name attribute is crucial for FormData
        type="email"
        required
        placeholder="you@example.com"
        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
        type="submit"
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
        Send Magic Link
        </button>
      </div>
    </form>
      {/* Optional: Link to error page if needed, though query param is simpler here */}
      {/* <Link href="/auth/error">Error Page (Test)</Link> */}
    </div>
  );
}
