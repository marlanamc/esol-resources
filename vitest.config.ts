import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["scripts/tests/**/*.vitest.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      include: [
        "src/lib/gamification/**/*.ts",
        "src/lib/validators.ts",
        "src/lib/rate-limit.ts",
        "src/app/api/activity/submit/route.ts",
        "src/app/api/activity/progress/route.ts",
      ],
      exclude: [
        "node_modules",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.vitest.ts",
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
