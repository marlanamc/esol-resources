#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WARMUP_DIR = path.join(__dirname, '..', 'src', 'content', 'speaking', 'daily-warmups');

function convertWarmupActivity(filePath) {
  console.log(`Converting ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Note: Always re-convert to fix any syntax issues

  // Add warmupMode and participationPoints after the description
  const descriptionMatch = content.match(/(description:\s*"[^"]*",)/);
  if (descriptionMatch) {
    const replacement = `${descriptionMatch[1]}\n\n  // NEW: Enable simple warmup mode\n  warmupMode: true,\n  participationPoints: 3,`;
    content = content.replace(descriptionMatch[1], replacement);
  }

  // Find and update prompts
  const promptsSectionMatch = content.match(/(prompts:\s*\[[\s\S]*?\n  \],)/);
  if (promptsSectionMatch) {
    let promptsSection = promptsSectionMatch[1];

    // Split prompts into individual objects and update each one
    const promptObjects = promptsSection.split(/(\{[\s\S]*?\},)/g).filter(obj => obj.trim().startsWith('{') && obj.trim().endsWith('},'));

    const updatedPrompts = promptObjects.map(promptObj => {
      // Skip if already has soloInstructions
      if (promptObj.includes('soloInstructions:')) {
        return promptObj;
      }

      // Extract the text to generate appropriate instructions
      const textMatch = promptObj.match(/text:\s*"([^"]*)"/);
      if (!textMatch) return promptObj;

      const promptText = textMatch[1].toLowerCase();

      let soloInstructions = "Practice saying this prompt aloud and think about your answer";
      let partnerInstructions = "Partner A: Ask the question. Partner B: Answer completely, then switch roles";

      // Customize instructions based on prompt content
      if (promptText.includes('describe') || promptText.includes('talk about') || promptText.includes('explain')) {
        soloInstructions = "Think through what you'd say and practice key vocabulary from this topic";
        partnerInstructions = "Take turns sharing: One person describes/explains, the other asks follow-up questions";
      } else if (promptText.includes('compare') || promptText.includes('what') || promptText.includes('which')) {
        soloInstructions = "List your thoughts and examples before speaking";
        partnerInstructions = "Discuss together: Share opinions and examples, ask why you think that";
      } else if (promptText.includes('role') || promptText.includes('pretend') || promptText.includes('you are')) {
        soloInstructions = "Read the scenario and think about what you would say in this situation";
        partnerInstructions = "Role-play the scenario: Take turns being different characters";
      } else if (promptText.includes('question') || promptText.includes('ask')) {
        soloInstructions = "Write down 3-4 questions you want to ask about this topic";
        partnerInstructions = "Take turns asking and answering questions on this topic";
      }

      // Find where to insert the new properties (after text or context)
      const insertPoint = promptObj.lastIndexOf('",');
      if (insertPoint === -1) return promptObj;

      const before = promptObj.substring(0, insertPoint + 2);
      const after = promptObj.substring(insertPoint + 2);

      return `${before}\n    soloInstructions: "${soloInstructions}",\n    partnerInstructions: "${partnerInstructions}",${after}`;
    });

    const updatedPromptsSection = promptsSection.replace(/(\{[\s\S]*?\},)/g, () => updatedPrompts.shift() || '');
    content = content.replace(promptsSectionMatch[1], updatedPromptsSection);
  }

  // Remove soloMode and speakingMode sections (no longer needed for warmups)
  content = content.replace(/\s+soloMode: \{[\s\S]*?\n  \},\n/, '\n');

  content = content.replace(/\s+speakingMode: \{[\s\S]*?\n  \},\n/, '\n');

  // Remove reflectionPrompt and related fields that are not needed for warmups
  content = content.replace(/\s+reflectionPrompt: "[^"]*",\n/, '');
  content = content.replace(/\s+reflectionMinLength: \d+,\n/, '');
  content = content.replace(/\s+minPromptsRequired: \d+,\n/, '');
  content = content.replace(/\s+released: (true|false),\n/, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Converted successfully`);
}

function main() {
  console.log('Starting warmup activity conversion...');

  const files = fs.readdirSync(WARMUP_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(WARMUP_DIR, file));

  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('soloMode:')) {
        convertWarmupActivity(file);
        converted++;
      } else {
        console.log(`Skipping ${file} - no soloMode found`);
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nConversion complete!`);
  console.log(`Converted: ${converted} files`);
  console.log(`Skipped: ${skipped} files`);
}

if (require.main === module) {
  main();
}