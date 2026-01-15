import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

export const runtime = 'edge';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import React from "react";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abibuilder.com"),
  title: {
    default: "ABI Builder - Arena Breakout Infinite Gun Database & Meta Loadouts",
    template: "%s | ABI Builder - Arena Breakout Infinite",
  },
  description: "The ultimate weapon loadout database for Arena Breakout: Infinite. Build, share, and discover the meta gun configurations with detailed stats and community voting.",
  keywords: [
    "Arena Breakout",
    "Arena Breakout Infinite",
    "ABI",
    "Gun Builder",
    "Weapon Loadouts",
    "Gaming",
    "FPS",
    "Tarkov Clone",
    "Meta Builds",
    "Budget Builds"
  ],
  authors: [{ name: "Zleep", url: "https://zleep.dev" }],
  creator: "Zleep",
  publisher: "ABI Builder",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ABI Builder - Ultimate Gun Database",
    description: "Build, share, and discover the best weapon loadouts for Arena Breakout: Infinite.",
    url: "https://abibuilder.com",
    siteName: "ABI Builder",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ABI Builder - Arena Breakout Infinite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABI Builder - Arena Breakout: Infinite Gun Database",
    description: "Build, share, and discover the best weapon loadouts for Arena Breakout: Infinite.",
    creator: "@zleepdev", // Update if you have a handle
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile if user exists
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <GoogleAnalytics gaId="G-1KYKECRNYK" />
        <Navbar user={user} profile={profile} />
        {children}
        <Footer />
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
