import type { Metadata } from "next";
import "./globals.css";
import { Anybody } from "next/font/google";

const anybody = Anybody({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  variable: "--font-anybody",
});

export const metadata: Metadata = {
  title: "BY MOVIE",
  description: "Virtual production studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${anybody.variable} font-anybody`}>
        {children}
      </body>
    </html>
  );
}
