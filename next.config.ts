import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vfq5uwwui8otjfkn.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
