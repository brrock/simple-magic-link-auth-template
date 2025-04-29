export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-3xl font-bold">Check your email</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        A sign in link has been sent to your email address.
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        The link will expire in 25 minutes. Click the link to sign in.
      </p>
    </div>
  );
}
