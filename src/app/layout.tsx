import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoForce Finance AI | The AI Finance Manager for Indian Businesses",
  description: "AI-powered team of CFO, Auditor, GST Expert, and Collections Manager — connected to Tally Prime, built for CAs and SMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

