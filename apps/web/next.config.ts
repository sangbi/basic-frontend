import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@repo/theme",
    "@repo/api",
    "@repo/auth",
    "@repo/types"
  ]
};

export default nextConfig;
