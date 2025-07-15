import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planish",
  description: "Take Back Control of Your Studies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          {children}
        </div>
      </body>
    </html>
  );
}
