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
  // Prisma's generated client traces unused DB engines, WASM, and maps into
  // every serverless function. Drop them so each deploy ships one Postgres
  // query engine instead of ~30MB of extra Prisma artifacts.
  outputFileTracingExcludes: {
    "*": [
      "node_modules/.prisma/client/libquery_engine-darwin*",
      "node_modules/.prisma/client/query_engine_bg.wasm",
      "node_modules/.prisma/client/wasm*",
      "node_modules/.prisma/client/edge.js",
      "node_modules/@prisma/engines/**",
      "node_modules/@prisma/engines-version/**",
      "node_modules/@prisma/client/runtime/query_engine_bg.mysql*",
      "node_modules/@prisma/client/runtime/query_engine_bg.sqlite*",
      "node_modules/@prisma/client/runtime/query_engine_bg.cockroachdb*",
      "node_modules/@prisma/client/runtime/query_engine_bg.sqlserver*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.mysql*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.sqlite*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.cockroachdb*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.sqlserver*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.mongodb*",
      "node_modules/@prisma/client/runtime/edge.js",
      "node_modules/@prisma/client/runtime/edge-esm.js",
      "node_modules/@prisma/client/runtime/index-browser*",
      "node_modules/@prisma/client/runtime/react-native*",
      "node_modules/@prisma/client/runtime/wasm*",
      "node_modules/@prisma/client/runtime/**/*.map",
      // The WASM engines ship as base64-encoded JS, ~11MB per function, and the
      // existing wasm* globs miss them because of the `query_*_bg.` prefix.
      // This project uses the native binary engine (prisma-client-js with no
      // driver adapter), so nothing loads them -- they were pure weight in all
      // ~300 route functions, which is what filled Functions Storage.
      "node_modules/@prisma/client/runtime/*wasm-base64*",
      "node_modules/@prisma/client/runtime/query_engine_bg.postgresql*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.postgresql*",
      "node_modules/@prisma/client/runtime/binary.*",
      "node_modules/@prisma/client/runtime/*.d.ts",
      "node_modules/@prisma/client/runtime/*.d.mts",
      "node_modules/typescript/**",
    ],
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
    ],
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  async rewrites() {
    return [
      {
        source: '/summer-planning-wiki',
        destination: '/summer-planning-wiki/index.html',
      },
    ];
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
