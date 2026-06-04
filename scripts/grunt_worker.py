#!/usr/bin/env python3
"""
grunt_worker.py — Route grunt work tasks to a local Ollama model (gemma4).

Usage:
  python3 scripts/grunt_worker.py "your task description here"
  echo "long input..." | python3 scripts/grunt_worker.py "summarize this"
  python3 scripts/grunt_worker.py --task summarize --file path/to/file.ts
  python3 scripts/grunt_worker.py --task boilerplate --type component --name MyWidget
  python3 scripts/grunt_worker.py --task rename --dir src/components
  python3 scripts/grunt_worker.py --task comments --file path/to/file.ts

Grunt work categories handled locally (no cloud API call):
  - summarize     : Summarize a file or piped content
  - boilerplate   : Generate repetitive code patterns
  - comments      : Add JSDoc/inline comments to a file
  - rename        : Suggest better names for variables/functions in a file
  - translate     : Translate ESOL content to a simpler reading level
  - vocab         : Generate vocabulary lists, definitions, or sentence examples
  - worksheet     : Draft worksheet structure for a given topic
"""

import argparse
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "gemma4:latest"

TASK_PROMPTS = {
    "summarize": (
        "You are a concise technical summarizer. "
        "Read the following content and provide a clear, bullet-point summary. "
        "Be brief and focus on what matters most.\n\n"
        "Content:\n{content}"
    ),
    "boilerplate": (
        "You are an expert {lang} developer. Generate clean, production-ready boilerplate "
        "for a {type} called '{name}'. Follow modern best practices. "
        "Output only the code, no explanation."
    ),
    "comments": (
        "You are a code documentation expert. Add clear JSDoc comments and inline comments "
        "to the following code. Preserve all existing logic exactly — only add comments.\n\n"
        "Code:\n{content}"
    ),
    "rename": (
        "You are a code quality reviewer. Review the following code and suggest better, "
        "more descriptive names for variables, functions, and components. "
        "Output a simple list: 'old_name -> new_name' with a one-line reason.\n\n"
        "Code:\n{content}"
    ),
    "translate": (
        "You are an ESOL curriculum specialist. Rewrite the following text at a {level} "
        "reading level (A1/A2/B1/B2). Keep meaning intact, simplify vocabulary and grammar.\n\n"
        "Text:\n{content}"
    ),
    "vocab": (
        "You are an ESOL teacher. For the topic '{topic}', generate {count} vocabulary words. "
        "For each word provide: the word, its part of speech, a simple definition, "
        "and one example sentence. Format as a numbered list."
    ),
    "worksheet": (
        "You are an ESOL curriculum designer. Create a structured worksheet outline for "
        "the topic '{topic}' at CEFR level {level}. Include: learning objectives, "
        "warm-up activity, main exercises (3-4), and a wrap-up. Be specific and practical."
    ),
    "freeform": "{content}",
}


def call_ollama(prompt: str, model: str = DEFAULT_MODEL, stream: bool = True) -> str:
    """Call Ollama's generate API with streaming output."""
    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": stream,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{OLLAMA_BASE_URL}/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    full_response = []
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            for line in resp:
                if not line.strip():
                    continue
                try:
                    chunk = json.loads(line.decode("utf-8"))
                    token = chunk.get("response", "")
                    if token:
                        print(token, end="", flush=True)
                        full_response.append(token)
                    if chunk.get("done"):
                        break
                except json.JSONDecodeError:
                    continue
        print()  # newline after streaming
        return "".join(full_response)
    except urllib.error.URLError as e:
        print(f"\n[grunt_worker] ERROR: Cannot reach Ollama at {OLLAMA_BASE_URL}", file=sys.stderr)
        print(f"[grunt_worker] Is Ollama running? Try: ollama serve", file=sys.stderr)
        print(f"[grunt_worker] Detail: {e}", file=sys.stderr)
        sys.exit(1)


def build_prompt(args: argparse.Namespace, piped_content: str) -> str:
    task = args.task or "freeform"
    template = TASK_PROMPTS.get(task, TASK_PROMPTS["freeform"])

    # Read file content if provided
    file_content = ""
    if args.file:
        path = Path(args.file)
        if not path.exists():
            print(f"[grunt_worker] ERROR: File not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        file_content = path.read_text(encoding="utf-8")

    content = file_content or piped_content or args.prompt or ""

    return template.format(
        content=content,
        lang=args.lang or "TypeScript",
        type=args.type or "component",
        name=args.name or "MyComponent",
        level=args.level or "B1",
        topic=args.topic or "daily life",
        count=args.count or 10,
    )


def check_ollama_running() -> bool:
    try:
        req = urllib.request.Request(f"{OLLAMA_BASE_URL}/api/tags")
        with urllib.request.urlopen(req, timeout=3):
            return True
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Route grunt work to local Gemma4 via Ollama",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("prompt", nargs="?", default="", help="Freeform prompt or task description")
    parser.add_argument("--task", choices=list(TASK_PROMPTS.keys()), default=None,
                        help="Type of grunt work task")
    parser.add_argument("--file", "-f", help="Input file path")
    parser.add_argument("--model", "-m", default=DEFAULT_MODEL, help=f"Ollama model (default: {DEFAULT_MODEL})")
    parser.add_argument("--lang", default="TypeScript", help="Programming language (for boilerplate)")
    parser.add_argument("--type", default="component", help="Code artifact type (for boilerplate)")
    parser.add_argument("--name", default="MyComponent", help="Name of the artifact (for boilerplate/vocab)")
    parser.add_argument("--level", default="B1", help="CEFR level (for translate/worksheet)")
    parser.add_argument("--topic", help="Topic (for vocab/worksheet)")
    parser.add_argument("--count", type=int, default=10, help="Count (for vocab lists)")
    parser.add_argument("--list-models", action="store_true", help="List available Ollama models")

    args = parser.parse_args()

    # List models mode
    if args.list_models:
        if not check_ollama_running():
            print("Ollama is not running. Start it with: ollama serve")
            sys.exit(1)
        req = urllib.request.Request(f"{OLLAMA_BASE_URL}/api/tags")
        with urllib.request.urlopen(req) as resp:
            data = json.load(resp)
        print("Available models:")
        for m in data.get("models", []):
            print(f"  {m['name']}")
        return

    # Read piped input if any
    piped = ""
    if not sys.stdin.isatty():
        piped = sys.stdin.read()

    if not args.prompt and not args.file and not piped and not args.task:
        parser.print_help()
        sys.exit(0)

    # If only a freeform prompt was given with no --task
    if args.prompt and not args.task:
        args.task = "freeform"

    if not check_ollama_running():
        print("[grunt_worker] Ollama is not running. Starting check...", file=sys.stderr)
        print("[grunt_worker] Run: ollama serve", file=sys.stderr)
        sys.exit(1)

    prompt = build_prompt(args, piped)

    print(f"\n[grunt_worker] Model: {args.model} | Task: {args.task or 'freeform'}")
    print("─" * 60)
    call_ollama(prompt, model=args.model)


if __name__ == "__main__":
    main()
