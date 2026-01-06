import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { createClient } from "@/lib/supabase/server";
import { SupportWidget } from "@/components/features/monetization/SupportWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ABI Builder | Arena Breakout: Infinite Build Sharer",
  description: "Create, share, and discover the best weapon builds for Arena Breakout: Infinite.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar user={user} />
            <main className="flex-1">
              {children}
            </main>
            <SupportWidget />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
