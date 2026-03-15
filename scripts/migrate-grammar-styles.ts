#!/usr/bin/env tsx
/**
 * Grammar Content Dark Mode Migration Script
 *
 * This script converts inline styles in grammar content files to semantic CSS classes
 * that work properly with the dark mode system.
 *
 * Usage:
 *   npx tsx scripts/migrate-grammar-styles.ts [--dry-run] [--file=<filename>]
 *
 * Options:
 *   --dry-run     Show what would be changed without modifying files
 *   --file=X      Only process a specific file (e.g., --file=present-simple.ts)
 */

import * as fs from "fs";
import * as path from "path";

const GRAMMAR_DIR = path.join(
  process.cwd(),
  "src",
  "content",
  "grammar"
);

// ═══════════════════════════════════════════════════════════════════════════
// STYLE → CLASS MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

interface StyleMapping {
  pattern: RegExp;
  replacement: string;
  description: string;
}

const STYLE_MAPPINGS: StyleMapping[] = [
  // ── Background: White ──
  {
    pattern: /style="([^"]*?)background:\s*white([^"]*?)"/gi,
    replacement: 'class="gc-bg-white" style="$1$2"',
    description: "background: white → gc-bg-white",
  },
  {
    pattern: /style="([^"]*?)background:\s*#fff(?:fff)?([^"]*?)"/gi,
    replacement: 'class="gc-bg-white" style="$1$2"',
    description: "background: #fff/#ffffff → gc-bg-white",
  },

  // ── Background: Slate/Neutral ──
  {
    pattern: /style="([^"]*?)background:\s*#f8fafc([^"]*?)"/gi,
    replacement: 'class="gc-bg-slate" style="$1$2"',
    description: "background: #f8fafc → gc-bg-slate",
  },
  {
    pattern: /style="([^"]*?)background:\s*#f1f5f9([^"]*?)"/gi,
    replacement: 'class="gc-bg-slate" style="$1$2"',
    description: "background: #f1f5f9 → gc-bg-slate",
  },

  // ── Background: Yellow Warning ──
  {
    pattern: /style="([^"]*?)background:\s*#fef9c3([^"]*?)"/gi,
    replacement: 'class="gc-bg-yellow" style="$1$2"',
    description: "background: #fef9c3 → gc-bg-yellow",
  },

  // ── Background: Amber ──
  {
    pattern: /style="([^"]*?)background:\s*#fef3c7([^"]*?)"/gi,
    replacement: 'class="gc-bg-amber" style="$1$2"',
    description: "background: #fef3c7 → gc-bg-amber",
  },
  {
    pattern: /style="([^"]*?)background:\s*#fff9e6([^"]*?)"/gi,
    replacement: 'class="gc-bg-amber" style="$1$2"',
    description: "background: #fff9e6 → gc-bg-amber",
  },
  {
    pattern: /style="([^"]*?)background:\s*#fffbeb([^"]*?)"/gi,
    replacement: 'class="gc-bg-amber" style="$1$2"',
    description: "background: #fffbeb → gc-bg-amber",
  },

  // ── Background: Orange ──
  {
    pattern: /style="([^"]*?)background:\s*#fff7ed([^"]*?)"/gi,
    replacement: 'class="gc-bg-orange" style="$1$2"',
    description: "background: #fff7ed → gc-bg-orange",
  },

  // ── Background: Red ──
  {
    pattern: /style="([^"]*?)background:\s*#fef2f2([^"]*?)"/gi,
    replacement: 'class="gc-bg-red" style="$1$2"',
    description: "background: #fef2f2 → gc-bg-red",
  },
  {
    pattern: /style="([^"]*?)background:\s*#fffafa([^"]*?)"/gi,
    replacement: 'class="gc-bg-red" style="$1$2"',
    description: "background: #fffafa → gc-bg-red",
  },

  // ── Background: Green ──
  {
    pattern: /style="([^"]*?)background:\s*#f0fdf4([^"]*?)"/gi,
    replacement: 'class="gc-bg-green" style="$1$2"',
    description: "background: #f0fdf4 → gc-bg-green",
  },
  {
    pattern: /style="([^"]*?)background:\s*#ecfdf5([^"]*?)"/gi,
    replacement: 'class="gc-bg-green" style="$1$2"',
    description: "background: #ecfdf5 → gc-bg-green",
  },

  // ── Background: Blue ──
  {
    pattern: /style="([^"]*?)background:\s*#eff6ff([^"]*?)"/gi,
    replacement: 'class="gc-bg-blue" style="$1$2"',
    description: "background: #eff6ff → gc-bg-blue",
  },
  {
    pattern: /style="([^"]*?)background:\s*#dbeafe([^"]*?)"/gi,
    replacement: 'class="gc-bg-blue" style="$1$2"',
    description: "background: #dbeafe → gc-bg-blue",
  },

  // ── Background: Cyan ──
  {
    pattern: /style="([^"]*?)background:\s*#ecfeff([^"]*?)"/gi,
    replacement: 'class="gc-bg-cyan" style="$1$2"',
    description: "background: #ecfeff → gc-bg-cyan",
  },
  {
    pattern: /style="([^"]*?)background:\s*#e0f7fa([^"]*?)"/gi,
    replacement: 'class="gc-bg-cyan" style="$1$2"',
    description: "background: #e0f7fa → gc-bg-cyan",
  },

  // ── Background: Purple/Violet ──
  {
    pattern: /style="([^"]*?)background:\s*#ede9fe([^"]*?)"/gi,
    replacement: 'class="gc-bg-violet" style="$1$2"',
    description: "background: #ede9fe → gc-bg-violet",
  },
  {
    pattern: /style="([^"]*?)background:\s*#f5f3ff([^"]*?)"/gi,
    replacement: 'class="gc-bg-violet" style="$1$2"',
    description: "background: #f5f3ff → gc-bg-violet",
  },

  // ── Background: Alpha Tints (Terracotta) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*200,\s*107,\s*81,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-terracotta-alpha" style="$1$2"',
    description: "rgba(200, 107, 81, 0.1) → gc-bg-terracotta-alpha",
  },

  // ── Background: Alpha Tints (Sage) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*110,\s*145,\s*118,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-sage-alpha" style="$1$2"',
    description: "rgba(110, 145, 118, 0.1) → gc-bg-sage-alpha",
  },

  // ── Background: Alpha Tints (Cyan) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*6,\s*182,\s*212,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-cyan-alpha" style="$1$2"',
    description: "rgba(6, 182, 212, 0.1) → gc-bg-cyan-alpha",
  },

  // ── Background: Alpha Tints (Purple) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*139,\s*92,\s*246,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-purple-alpha" style="$1$2"',
    description: "rgba(139, 92, 246, 0.1) → gc-bg-purple-alpha",
  },

  // ── Background: Alpha Tints (Orange) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*249,\s*115,\s*22,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-orange-alpha" style="$1$2"',
    description: "rgba(249, 115, 22, 0.1) → gc-bg-orange-alpha",
  },

  // ── Background: Alpha Tints (Amber) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*245,\s*158,\s*11,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-amber-alpha" style="$1$2"',
    description: "rgba(245, 158, 11, 0.1) → gc-bg-amber-alpha",
  },

  // ── Background: Alpha Tints (Green) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*34,\s*197,\s*94,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-green-alpha" style="$1$2"',
    description: "rgba(34, 197, 94, 0.1) → gc-bg-green-alpha",
  },

  // ── Background: Alpha Tints (Blue) ──
  {
    pattern:
      /style="([^"]*?)background:\s*rgba\(\s*59,\s*130,\s*246,\s*0\.1\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-bg-blue-alpha" style="$1$2"',
    description: "rgba(59, 130, 246, 0.1) → gc-bg-blue-alpha",
  },

  // ── Gradients: Terracotta + Sage (Brand) ──
  {
    pattern:
      /style="([^"]*?)background:\s*linear-gradient\(\s*135deg,\s*rgba\(\s*200,\s*107,\s*81,\s*0\.1\s*\)\s*0%,\s*rgba\(\s*110,\s*145,\s*118,\s*0\.1\s*\)\s*100%\s*\)([^"]*?)"/gi,
    replacement: 'class="gc-grad-terracotta" style="$1$2"',
    description: "brand gradient → gc-grad-terracotta",
  },

  // ── Callout Borders: Left Amber ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#f59e0b([^"]*?)"/gi,
    replacement: 'class="gc-callout-amber" style="$1$2"',
    description: "border-left amber → gc-callout-amber",
  },

  // ── Callout Borders: Left Cyan ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#06b6d4([^"]*?)"/gi,
    replacement: 'class="gc-callout-cyan" style="$1$2"',
    description: "border-left cyan → gc-callout-cyan",
  },

  // ── Callout Borders: Left Green ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#22c55e([^"]*?)"/gi,
    replacement: 'class="gc-callout-green" style="$1$2"',
    description: "border-left green → gc-callout-green",
  },

  // ── Callout Borders: Left Red ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#ef4444([^"]*?)"/gi,
    replacement: 'class="gc-callout-red" style="$1$2"',
    description: "border-left red → gc-callout-red",
  },
  {
    pattern:
      /style="([^"]*?)border-left:\s*5px\s+solid\s+#ef4444([^"]*?)"/gi,
    replacement: 'class="gc-callout-red" style="$1$2"',
    description: "border-left red (5px) → gc-callout-red",
  },

  // ── Callout Borders: Left Purple ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#a855f7([^"]*?)"/gi,
    replacement: 'class="gc-callout-purple" style="$1$2"',
    description: "border-left purple → gc-callout-purple",
  },
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#8b5cf6([^"]*?)"/gi,
    replacement: 'class="gc-callout-purple" style="$1$2"',
    description: "border-left violet → gc-callout-purple",
  },

  // ── Callout Borders: Left Blue ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#3b82f6([^"]*?)"/gi,
    replacement: 'class="gc-callout-blue" style="$1$2"',
    description: "border-left blue → gc-callout-blue",
  },

  // ── Callout Borders: Left Sage ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#7ba884([^"]*?)"/gi,
    replacement: 'class="gc-callout-sage" style="$1$2"',
    description: "border-left sage → gc-callout-sage",
  },

  // ── Callout Borders: Left Terracotta ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#d97757([^"]*?)"/gi,
    replacement: 'class="gc-callout-terracotta" style="$1$2"',
    description: "border-left terracotta → gc-callout-terracotta",
  },

  // ── Callout Borders: Left Orange ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#f97316([^"]*?)"/gi,
    replacement: 'class="gc-callout-orange" style="$1$2"',
    description: "border-left orange → gc-callout-orange",
  },

  // ── Callout Borders: Left Emerald ──
  {
    pattern:
      /style="([^"]*?)border-left:\s*4px\s+solid\s+#10b981([^"]*?)"/gi,
    replacement: 'class="gc-callout-emerald" style="$1$2"',
    description: "border-left emerald → gc-callout-emerald",
  },

  // ── Callout Borders: Top Amber ──
  {
    pattern:
      /style="([^"]*?)border-top:\s*4px\s+solid\s+#f59e0b([^"]*?)"/gi,
    replacement: 'class="gc-callout-top gc-callout-amber" style="$1$2"',
    description: "border-top amber → gc-callout-top gc-callout-amber",
  },

  // ── Text Colors ──
  {
    pattern: /style="([^"]*?)color:\s*#f59e0b([^"]*?)"/gi,
    replacement: 'class="gc-text-amber" style="$1$2"',
    description: "color: #f59e0b → gc-text-amber",
  },
  {
    pattern: /style="([^"]*?)color:\s*#d97757([^"]*?)"/gi,
    replacement: 'class="gc-text-terracotta" style="$1$2"',
    description: "color: #d97757 → gc-text-terracotta",
  },
  {
    pattern: /style="([^"]*?)color:\s*#7ba884([^"]*?)"/gi,
    replacement: 'class="gc-text-sage" style="$1$2"',
    description: "color: #7ba884 → gc-text-sage",
  },
  {
    pattern: /style="([^"]*?)color:\s*#06b6d4([^"]*?)"/gi,
    replacement: 'class="gc-text-cyan" style="$1$2"',
    description: "color: #06b6d4 → gc-text-cyan",
  },
  {
    pattern: /style="([^"]*?)color:\s*#8b5cf6([^"]*?)"/gi,
    replacement: 'class="gc-text-purple" style="$1$2"',
    description: "color: #8b5cf6 → gc-text-purple",
  },
  {
    pattern: /style="([^"]*?)color:\s*#ef4444([^"]*?)"/gi,
    replacement: 'class="gc-text-red" style="$1$2"',
    description: "color: #ef4444 → gc-text-red",
  },
  {
    pattern: /style="([^"]*?)color:\s*#dc2626([^"]*?)"/gi,
    replacement: 'class="gc-text-red" style="$1$2"',
    description: "color: #dc2626 → gc-text-red",
  },
  {
    pattern: /style="([^"]*?)color:\s*#22c55e([^"]*?)"/gi,
    replacement: 'class="gc-text-green" style="$1$2"',
    description: "color: #22c55e → gc-text-green",
  },
  {
    pattern: /style="([^"]*?)color:\s*#3b82f6([^"]*?)"/gi,
    replacement: 'class="gc-text-blue" style="$1$2"',
    description: "color: #3b82f6 → gc-text-blue",
  },
  {
    pattern: /style="([^"]*?)color:\s*#6b7280([^"]*?)"/gi,
    replacement: 'class="gc-text-muted" style="$1$2"',
    description: "color: #6b7280 → gc-text-muted",
  },
  {
    pattern: /style="([^"]*?)color:\s*#64748b([^"]*?)"/gi,
    replacement: 'class="gc-text-muted" style="$1$2"',
    description: "color: #64748b → gc-text-muted",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function cleanupEmptyStyles(content: string): string {
  return content
    // Clean up leading semicolons in style attributes (style="; padding..." → style="padding...")
    .replace(/style=";\s*/g, 'style="')
    // Clean up trailing semicolons before closing quote
    .replace(/;\s*"/g, '"')
    // Clean up multiple semicolons
    .replace(/;+/g, ";")
    // Remove empty or whitespace-only style attributes
    .replace(/\s*style="\s*"/g, "")
    .replace(/\s*style='\s*'/g, "")
    // Merge duplicate class attributes (class="a" class="b" → class="a b")
    .replace(/class="([^"]+)"\s+class="([^"]+)"/g, 'class="$1 $2"');
}

function countInlineStyles(content: string): number {
  const matches = content.match(/style="[^"]+"/g);
  return matches ? matches.length : 0;
}

function processFile(
  filePath: string,
  dryRun: boolean
): { before: number; after: number; mappingsApplied: string[] } {
  const content = fs.readFileSync(filePath, "utf-8");
  let processed = content;
  const mappingsApplied: string[] = [];

  const beforeCount = countInlineStyles(content);

  for (const mapping of STYLE_MAPPINGS) {
    if (mapping.pattern.test(processed)) {
      mappingsApplied.push(mapping.description);
      processed = processed.replace(mapping.pattern, mapping.replacement);
      // Reset regex lastIndex
      mapping.pattern.lastIndex = 0;
    }
  }

  processed = cleanupEmptyStyles(processed);

  const afterCount = countInlineStyles(processed);

  if (!dryRun && processed !== content) {
    fs.writeFileSync(filePath, processed, "utf-8");
  }

  return {
    before: beforeCount,
    after: afterCount,
    mappingsApplied,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.find((a) => a.startsWith("--file="));
  const targetFile = fileArg ? fileArg.split("=")[1] : null;

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║     Grammar Content Dark Mode Migration Script              ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n");
  }

  // Get list of files to process
  let files: string[];
  if (targetFile) {
    const fullPath = path.join(GRAMMAR_DIR, targetFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      process.exit(1);
    }
    files = [fullPath];
  } else {
    files = fs
      .readdirSync(GRAMMAR_DIR)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => path.join(GRAMMAR_DIR, f));
  }

  console.log(`📁 Processing ${files.length} file(s)...\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  const allMappings = new Set<string>();

  for (const file of files) {
    const fileName = path.basename(file);
    const result = processFile(file, dryRun);

    totalBefore += result.before;
    totalAfter += result.after;
    result.mappingsApplied.forEach((m) => allMappings.add(m));

    const reduced = result.before - result.after;
    const icon = reduced > 0 ? "✅" : reduced === 0 ? "⏭️" : "⚠️";

    console.log(
      `${icon} ${fileName}: ${result.before} → ${result.after} inline styles (${reduced > 0 ? "-" : ""}${Math.abs(reduced)})`
    );

    if (result.mappingsApplied.length > 0 && dryRun) {
      result.mappingsApplied.forEach((m) => console.log(`   └─ ${m}`));
    }
  }

  console.log("\n────────────────────────────────────────────────────────────────");
  console.log(
    `📊 Total: ${totalBefore} → ${totalAfter} inline styles (${totalBefore - totalAfter} reduced)`
  );
  console.log(`📋 Unique mappings applied: ${allMappings.size}`);

  if (dryRun) {
    console.log("\n💡 To apply changes, run without --dry-run flag");
  } else {
    console.log("\n✨ Migration complete! Run 'npm run typecheck' to verify.");
  }
}

main();
