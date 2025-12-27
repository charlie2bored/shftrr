import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Career Pivot Coach",
  description: "Sign in to your Career Pivot Coach account or create a new account to start your AI-powered career transformation journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
