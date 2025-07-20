import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'mjiit.utm.my',
      "fqtizehthryjvqxqvpkl.supabase.co",
    ],
  },
};

export default nextConfig;