import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider } from "@/lib/toast-context";
import { SessionProvider } from "@/components/SessionProvider";
import { WebSiteStructuredData, SoftwareApplicationStructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Career Pivot Coach - AI-Powered Career Guidance",
    template: "%s | Career Pivot Coach"
  },
  description: "Transform your career with AI-powered coaching. Get personalized guidance, strategic planning, and expert insights to navigate your career pivot successfully.",
  keywords: ["career coaching", "career pivot", "AI career advisor", "job transition", "career planning", "professional development"],
  authors: [{ name: "Career Pivot Coach Team" }],
  creator: "Career Pivot Coach",
  publisher: "Career Pivot Coach",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Career Pivot Coach - AI-Powered Career Guidance",
    description: "Transform your career with AI-powered coaching. Get personalized guidance, strategic planning, and expert insights to navigate your career pivot successfully.",
    siteName: "Career Pivot Coach",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Career Pivot Coach - AI Career Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Pivot Coach - AI-Powered Career Guidance",
    description: "Transform your career with AI-powered coaching. Get personalized guidance for your career pivot.",
    images: ["/og-image.jpg"],
    creator: "@careerpivotcoach",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <WebSiteStructuredData />
        <SoftwareApplicationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <ErrorBoundary>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}
