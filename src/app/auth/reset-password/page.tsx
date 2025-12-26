"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [token, setToken] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      // Validate token (we'll do this on the server side when submitting)
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords don't match", "Please make sure both passwords are identical");
      return;
    }

    if (password.length < 6) {
      showError("Password too short", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset-password',
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success("Password updated", "Your password has been successfully reset");
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        showError("Reset failed", data.error || "Something went wrong");
      }
    } catch (err) {
      showError("Reset failed", "Unable to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
                shftrr.
              </span>
            </h1>
            <h2 className="mt-6 text-2xl font-bold text-white">
              Invalid reset link
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Request new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
              shftrr.
            </span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Set new password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your new password below
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Updating password...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
