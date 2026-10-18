import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Venture Predator — pitch screening that pushes back",
    template: "%s · Venture Predator",
  },
  description:
    "Founders face a four-round AI interrogation on unit economics, moat, retention and conviction. Startups that score 80 or higher appear on a live investor radar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
