import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans"})

export const metadata: Metadata = {
  title: "MJIIT ResearchHub",
  description: "Research platform for the researchers of the Malaysia-Japan International Institute of Technology (MJIIT). ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}
      >
        {children}
      </body>
    </html>
  );
}
