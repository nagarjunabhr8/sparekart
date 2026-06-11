import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      { source: "/b2b", destination: "/", permanent: true },
      { source: "/b2b/:path*", destination: "/:path*", permanent: true },
      { source: "/b2c", destination: "/shop", permanent: true },
      { source: "/b2c/:path*", destination: "/shop/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
