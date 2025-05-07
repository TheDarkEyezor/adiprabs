import { Metadata } from "next";
import "./globals.css";
import TransitionLogo from "./components/TransitionLogo";

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
        <TransitionLogo isActive={false} />
        {children}
      </body>
    </html>
  )
}
