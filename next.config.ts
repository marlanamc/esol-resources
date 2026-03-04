import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Conditionally enable bundle analyzer
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ||
  process.env.VERCEL_DEPLOYMENT_ID ||
  process.env.BUILD_ID ||
  "local-dev";

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports to reduce bundle size
    // Tree-shake unused exports from these commonly used libraries
    optimizePackageImports: [
      'recharts',      // Chart library - large, only import what's needed
      'framer-motion', // Animation library - tree-shake unused components
      'lucide-react',  // Icon library - only bundle icons that are used
    ],
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
