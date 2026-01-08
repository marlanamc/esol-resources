#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WARMUP_DIR = path.join(__dirname, '..', 'src', 'content', 'speaking', 'daily-warmups');

function fixDuplicateInstructions(filePath) {
  console.log(`Fixing ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove duplicate soloInstructions and partnerInstructions
  // This regex finds consecutive duplicate properties and removes the first occurrence
  content = content.replace(/(\s+soloInstructions:\s*"[^"]*",)\n\s+soloInstructions:\s*"[^"]*",/g, '$1');
  content = content.replace(/(\s+partnerInstructions:\s*"[^"]*",)\n\s+partnerInstructions:\s*"[^"]*",/g, '$1');

  // Fix any remaining issues with the healthcare-basics.ts file that has extra content
  if (filePath.includes('healthcare-basics.ts')) {
    content = content.replace(/  ],  released: false\n};/, '\n};');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Fixed successfully`);
}

function main() {
  console.log('Starting duplicate instructions fix...');

  const files = fs.readdirSync(WARMUP_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(WARMUP_DIR, file));

  let fixed = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('soloInstructions:') && content.match(/soloInstructions:/g).length > content.match(/id:\s*"[^"]*"/g).length) {
        fixDuplicateInstructions(file);
        fixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFix complete!`);
  console.log(`Fixed: ${fixed} files`);
}

if (require.main === module) {
  main();
}