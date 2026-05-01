'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email or username is required';
    } else if (email.includes('@') && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setErrors({ submit: data.error || 'Invalid email or password' });
        return;
      }

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget;
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email or Username
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {errors.submit && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {errors.submit}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        aria-label="Sign in to your account"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="flex flex-col gap-3 pt-2 text-center text-sm">
        <a
          href="/forgot-password"
          className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
        >
          Forgot Password?
        </a>
        <div>
          <span className="text-gray-600">Don't have an account? </span>
          <a
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          >
            Sign Up
          </a>
        </div>
      </div>
    </form>
  );
}
