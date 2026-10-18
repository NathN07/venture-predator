import type { NextConfig } from "next";

// This app is almost entirely per-user, signed-in content, so it runs as a
// regular dynamic Next.js app (no Cache Components).
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
