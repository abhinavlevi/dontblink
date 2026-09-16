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
  title: "EyeBattle • Don't Blink Challenge",
  description:
    "Test your optical endurance against AI sentinels or challenge friends in a 1v1 face-tracking stare down.",
  openGraph: {
    title: "EyeBattle • Don't Blink Challenge",
    description:
      "Real-time optical warfare game using AI facial landmark detection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#d0d0d5] text-zinc-900 select-none">
        {children}
      </body>
    </html>
  );
}