import type { Metadata } from "next";
import "./globals.css";
import { Anybody } from "next/font/google";

const anybody = Anybody({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  variable: "--font-anybody",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bymovie.studio"),

  title: {
    default: "BY MOVIE — Virtual Production Studio",
    template: "%s — BY MOVIE",
  },

  description:
    "BY MOVIE is a virtual production studio specializing in LED walls, Unreal Engine, and real-time virtual environments.",

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },

  themeColor: "#000000",

  icons: {
    icon: "/fi.png",
    shortcut: "fi.png",
    apple: "/fi.png",
  },

  openGraph: {
    type: "website",
    url: "https://bymovie.studio",
    title: "BY MOVIE — Virtual Production Studio",
    description:
      "Virtual production studio working with LED walls, Unreal Engine and real-time environments.",
    siteName: "BY MOVIE",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "BY MOVIE — Virtual Production Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BY MOVIE — Virtual Production Studio",
    description:
      "Virtual production studio working with LED walls, Unreal Engine and real-time environments.",
    images: ["/images/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${anybody.variable} font-anybody antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
