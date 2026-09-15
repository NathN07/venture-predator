import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VENTURE PREDATOR // The Apex Founder & VC Network",
  description: "A ruthless two-sided deal engine where AI interrogates founders and streams verified deal flow to top-tier venture capitalists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#0a0a0c] text-[#e2e8f0] font-mono selection:bg-[#ff003c] selection:text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

