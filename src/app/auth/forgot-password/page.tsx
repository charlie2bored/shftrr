"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useToast } from "@/lib/toast-context";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'forgot-password',
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        success("Reset link sent", "Check your email for password reset instructions");
      } else {
        showError("Request failed", data.error || "Something went wrong");
      }
    } catch (err) {
      showError("Request failed", "Unable to send reset request");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
                shftrr.
              </span>
            </h1>
            <h2 className="mt-6 text-2xl font-bold text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              We've sent a password reset link to {email}
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
            <p className="text-gray-300 mb-6">
              If an account with this email exists, you'll receive a password reset link.
              The link will expire in 15 minutes.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/signin')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Back to Sign In
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                Try different email
              </button>
            </div>
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
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-600 bg-clip-text text-transparent">
              shftrr.
            </span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
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
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
