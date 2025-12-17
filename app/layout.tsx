export const metadata: Metadata = {
  metadataBase: new URL("https://bymovie.studio"),

  title: {
    default: "BY MOVIE — Virtual Production Studio",
    template: "%s — BY MOVIE",
  },

  description:
    "BY MOVIE is a virtual production studio specializing in LED walls, Unreal Engine, and real-time virtual environments for commercials, films, and branded content.",

  icons: {
    icon: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/fi.png",
    shortcut: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/fi.png",
    apple: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/fi.png",
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
        url: "/images/og.jpg", // положи файл в public/images/og.jpg
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
