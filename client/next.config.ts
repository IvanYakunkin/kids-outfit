import type { NextConfig } from "next";
import { URL } from "node:url";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  output: "standalone",
};

export default nextConfig;
