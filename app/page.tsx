import { LoginForm } from '@/components/LoginForm';

export default function LoginPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Sign In
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
