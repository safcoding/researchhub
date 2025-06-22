import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "MJIIT Research Hub",
  description: "For all your research needs at MJIIT",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {  return (
      <html lang="en" className={`${geist.variable}`}>
        <body className={`antialiased ${geist.variable}`}>
          {children}
        </body>
      </html>
  );
}

