import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add the weights you need
  display: "swap", // Recommended for better performance
});

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Spares App",
  description: "Spares App using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} antialiased`}
    >
      <body className="min-h-full flex font-sans bg-gray-50/50 dark:bg-[#0a0a0a]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Topbar />
            <main className="flex-[1] overflow-y-auto">
              {/* {children} */}
              <TooltipProvider>{children}</TooltipProvider>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
