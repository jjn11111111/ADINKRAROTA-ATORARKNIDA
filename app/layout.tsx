import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adinkrarota | Spin Cycle",
  description:
    "Adinkrarota unites tarot, Adinkra symbols, and cycle-based reflection for public study and member workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
