import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "AgentGuard",
    template: "%s | AgentGuard",
  },
  description: "AgentGuard checks AI agent permissions, spending limits, and human approval before simulated refunds execute.",
  metadataBase: new URL("https://agentguard-eight.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "AgentGuard",
    title: "AgentGuard — Human control over agent actions",
    description: "Try a refund safety walkthrough and inspect the recorded deployment evidence.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
