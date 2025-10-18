import { Metadata } from "next";
import "./globals.css";
import TransitionLogo from "./components/TransitionLogo";
import ScrollProgress from "./components/effects/ScrollProgress";
import FloatingActionButton from "./components/effects/FloatingActionButton";
import ThemeToggle from "./components/effects/ThemeToggle";
import PageLoader from "./components/effects/PageLoader";
import LightModeJudgment from "./components/effects/LightModeJudgment";

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
        <PageLoader />
        <ScrollProgress />
        <ThemeToggle />
        <LightModeJudgment />
        <TransitionLogo isActive={false} />
        <FloatingActionButton />
        {children}
      </body>
    </html>
  )
}
