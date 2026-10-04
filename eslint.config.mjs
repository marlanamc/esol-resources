import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Flag console.log/debug left in app code; warn rather than error to allow gradual cleanup
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      // Honor the `_`-prefix convention for intentionally-unused vars/args/catch bindings.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react/no-unescaped-entities": "off",
      // The react-hooks compiler rules are currently too strict for this codebase.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-*/**",
    ".playwright-cli/**",
    "output/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    // Project tooling / assets (not shipped app code):
    "scripts/**",
    "prisma/seed.js",
    "prisma/migrations/**",
    "public/assets/**",
    "_legacy/**",
    "archive/**",
    "docs/**",
    // Claude Design handoff prototypes (HTML/JS references, not app code).
    "design_handoff_*/**",
    // Local Claude worktrees: full repo copies that would be linted twice.
    ".claude/**",
  ]),
]);

export default eslintConfig;
