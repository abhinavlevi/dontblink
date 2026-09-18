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

const siteUrl = "https://eyebattle.abhinavdubey.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EyeBattle • Free Online Arcade & AI Staring Contest Games",
    template: "%s • EyeBattle Games",
  },
  description:
    "Play free instant browser camera games! Challenge AI bots in real-time webcam stare-downs, test your reflex reactions, and battle friends online.",
  keywords: [
    "staring contest online",
    "don't blink game",
    "free browser arcade games",
    "webcam face tracking game",
    "stare down bot",
    "1v1 online games no download",
    "viral camera games",
    "eye battle game",
  ],
  authors: [{ name: "Abhinav Dubey", url: "https://abhinavdubey.in" }],
  creator: "Abhinav Dubey",
  publisher: "EyeBattle Arcade",
  icons: {
    icon: "/abhinavdubeygame.png",
    shortcut: "/abhinavdubeygame.png",
    apple: "/abhinavdubeygame.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "EyeBattle • Free Online Arcade & AI Staring Contest Games",
    description:
      "Can you out-stare an AI? Play free webcam face tracking games, dodge flashbangs, and flex your win streaks online.",
    url: siteUrl,
    siteName: "EyeBattle Arcade",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "EyeBattle Arena - Lock In Or Get Cooked Stare Contest",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EyeBattle • Free Browser Games & Stare-down Arena",
    description:
      "Play real-time camera stare-down games vs AI bots directly in your browser. No download required.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  category: "Gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EyeBattle Arcade",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    author: {
      "@type": "Person",
      name: "Abhinav Dubey",
      url: "https://abhinavdubey.in",
    },
    operatingSystem: "Web Browser",
    applicationCategory: "GameApplication",
    genre: "Arcade, Action, Multiplayer",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Real-time webcam face-tracking game platform where players challenge AI sentinels and real opponents in online stare-down duels.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#d0d0d5] text-zinc-900 select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}