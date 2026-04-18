import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Loop",
  description:
    "Start a social chain reaction, pass the link forward, and unlock the full map when the loop closes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
