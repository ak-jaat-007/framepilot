import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FramePilot — Cinematic AI Studio",
  description: "Turn one idea into a cinematic scene with FramePilot.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
