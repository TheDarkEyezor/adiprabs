import type { Metadata } from "next";
import localFont from "next/font/local";
import TransitionProvider from "@/components/TransitionProvider"; // Import the provider
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AdiPrabs.com",
  description: "Created with NextJS, hosted by Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#33658A', margin: 0, padding: 0 }}
      >
        {/* Wrap children with the TransitionProvider */}
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
