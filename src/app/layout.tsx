import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "~/components/navbar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "TinyLink - URL shortener",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
