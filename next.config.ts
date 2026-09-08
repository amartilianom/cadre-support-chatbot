import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Turbopack doesn't infer a parent dir
  // from a stray lockfile higher up the tree (avoids a build-time warning / wrong root).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
