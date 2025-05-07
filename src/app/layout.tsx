// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import TransitionProvider from "@/components/TransitionProvider";
import { Metadata } from "next";
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "AdiPrabs.com",
//   description: "Created with NextJS, hosted by Vercel",
// };

export const metadata: Metadata = {
  title: "AdiPrabs.com",
  description: "Created with NextJS, hosted by Vercel",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
