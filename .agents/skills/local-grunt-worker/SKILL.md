---
name: local-grunt-worker
description: Routes routine "grunt work" tasks (summarization, boilerplate, refactoring, translations) to a local Ollama model (gemma4) running on the user's machine to save API tokens and offload simple tasks.
---

# Local Grunt Worker Skill

You can offload simple, repetitive, or token-heavy "grunt work" to the user's local `gemma4` model via Ollama. This saves API usage and allows you to parallelize work or quickly delegate tasks that don't require complex reasoning.

## When to use

Use this for tasks like:
- Generating boilerplate code
- Adding JSDoc or inline comments to a file
- Summarizing long files or piped output
- Renaming variables in a file
- Generating ESOL vocabulary lists or worksheet outlines
- Translating text to simpler CEFR reading levels

## How to use

Run the `scripts/grunt_worker.py` script using the `run_command` tool.

### Examples

**1. Generate Boilerplate:**
```bash
./scripts/grunt_worker.py --task boilerplate --lang TypeScript --type component --name DashboardWidget
```

**2. Summarize a File:**
```bash
./scripts/grunt_worker.py --task summarize --file path/to/large/file.ts
```

**3. Add Comments to Code:**
```bash
./scripts/grunt_worker.py --task comments --file src/components/MyComponent.tsx
```

**4. Generate ESOL Vocabulary:**
```bash
./scripts/grunt_worker.py --task vocab --topic "At the airport" --count 15
```

**5. Freeform Prompt (Piped):**
```bash
cat src/utils/helpers.ts | ./scripts/grunt_worker.py "Find potential bugs in this code"
```

## Note

The output from this script will stream to the terminal. You can capture it into a file by redirecting output:
```bash
./scripts/grunt_worker.py --task vocab --topic "Grocery shopping" > worksheets/vocab_grocery.txt
```
