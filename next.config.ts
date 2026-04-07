import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

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
  ...(process.env.NEXT_DIST_DIR
    ? { distDir: process.env.NEXT_DIST_DIR }
    : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "pixabay.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.pixabay.com", pathname: "/**" },
      { protocol: "https", hostname: "static.photos", pathname: "/**" },
    ],
  },
  outputFileTracingIncludes: {
    "/api/legacy-guide": [
      "./_legacy/activities/**/*",
      "./css-from-legacy/**/*",
    ],
  },
  experimental: {
    optimizePackageImports: [
      'recharts',
      'framer-motion',
      'lucide-react',
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

const configWithAnalyzer = bundleAnalyzer(nextConfig);

export default withSentryConfig(configWithAnalyzer, {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "",
  silent: !process.env.CI,
});
