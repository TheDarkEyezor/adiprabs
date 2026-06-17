import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adi Prabs — Computing @ Imperial · SRE @ Apple",
  description:
    "Adi Prabs — Computing student at Imperial College London, SRE at Apple, building production AI systems on the side. Selected work, writing, and a long-form CV.",
  metadataBase: new URL("https://adiprabs.com"),
  openGraph: {
    title: "Adi Prabs",
    description:
      "Computing @ Imperial · SRE @ Apple. Building production AI systems.",
    url: "https://adiprabs.com",
    siteName: "Adi Prabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adi Prabs",
    description:
      "Computing @ Imperial · SRE @ Apple. Building production AI systems.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-ink-bg text-ink-fg antialiased grain">
        {children}
      </body>
    </html>
  );
}
