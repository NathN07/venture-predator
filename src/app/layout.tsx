import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venture Predator — AI VC Simulator",
  description: "Pitch a ruthless AI venture capitalist. Survive three questions. Walk out with a term sheet or a rejection worth screenshotting.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
