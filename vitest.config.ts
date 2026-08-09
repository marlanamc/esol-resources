import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.vitest.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      include: [
        "src/lib/gamification/**/*.ts",
        "src/lib/shared/validators.ts",
        "src/lib/api/rate-limit.ts",
        "src/app/api/activity/submit/route.ts",
        // Progress helpers that have direct unit coverage. Larger route/post
        // modules stay out of the gate until they have dedicated tests.
        "src/lib/activity/progress/state.ts",
        "src/lib/activity/progress/response.ts",
        "src/lib/activity/progress/shared.ts",
        "src/app/api/activity/progress/route.ts",
      ],
      exclude: [
        "node_modules",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.vitest.ts",
        // Large orchestration modules still covered indirectly via route tests;
        // keep them out of the global threshold until unit suites exist.
        "src/lib/gamification/gamification.ts",
        "src/lib/gamification/award-chain.ts",
        "src/lib/gamification/calendar-week.ts",
        "src/lib/gamification/index.ts",
      ],
      thresholds: {
        lines: 25,
        functions: 25,
        branches: 20,
        statements: 25,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
