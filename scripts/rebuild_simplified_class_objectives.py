#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path


@dataclass(frozen=True)
class WarmupEntry:
    day: str  # Tue/Thu
    class_date: date
    schedule_label: str
    schedule_slug: str


@dataclass(frozen=True)
class WeekConfig:
    week_number: int  # 16–37
    guide_slug: str
    guide_title: str
    tuesday_grammar: str
    thursday_grammar: str
    why: str
    thursday_special: str | None = None


ROOT = Path(__file__).resolve().parents[1]
CLASS_OBJECTIVES_DIR = ROOT / "class_uploads" / "Class-Objectives"
WARMUP_SCHEDULE_MD = (
    ROOT
    / "class_uploads"
    / "Warm-Up Speaking Schedule (Jan–Jun, 2 classes per week).md"
)
WORKSHEETS_DIR = ROOT / "worksheets"
VERB_QUIZZES_JSON = ROOT / "ESOL_LMS" / "quizzes.json"


@dataclass(frozen=True)
class VerbQuizInfo:
    quiz_number: int
    due_date: date
    verbs_v1: list[str]


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_warmup_schedule(path: Path) -> list[WarmupEntry]:
    text = _read_text(path)
    entries: list[WarmupEntry] = []

    for line in text.splitlines():
        line = line.rstrip()
        if not line.startswith("- "):
            continue

        parts = line.split("**")
        if len(parts) < 3:
            continue

        day = parts[0].strip("- ").strip()
        content = parts[1]  # "1/6/26: Classroom & School Language"
        rest = parts[2]

        if ":" not in content:
            continue

        date_raw, label = content.split(":", 1)
        date_raw = date_raw.strip()
        label = label.strip()

        try:
            class_date = datetime.strptime(date_raw, "%m/%d/%y").date()
        except ValueError:
            continue

        match = re.search(r"`([^`]+)`", rest)
        if not match:
            continue

        schedule_slug = Path(match.group(1)).stem
        entries.append(
            WarmupEntry(
                day=day,
                class_date=class_date,
                schedule_label=label,
                schedule_slug=schedule_slug,
            )
        )

    entries.sort(key=lambda entry: entry.class_date)
    if len(entries) != 44:
        raise ValueError(f"Expected 44 warmup entries, found {len(entries)}")
    return entries


def load_worksheet_titles(worksheets_dir: Path) -> dict[Path, str]:
    titles: dict[Path, str] = {}
    for path in worksheets_dir.rglob("*-warmup.html"):
        text = _read_text(path)
        match = re.search(r"<h1>([^<]+)</h1>", text)
        if not match:
            continue
        titles[path] = match.group(1).strip()
    if not titles:
        raise ValueError(f"No worksheet titles found under {worksheets_dir}")
    return titles


def load_verb_quizzes(quizzes_json: Path) -> dict[int, VerbQuizInfo]:
    if not quizzes_json.exists():
        return {}

    raw = json.loads(_read_text(quizzes_json))
    if not isinstance(raw, dict):
        raise ValueError(f"Unexpected verb quiz format in {quizzes_json}")

    quizzes: dict[int, VerbQuizInfo] = {}
    quiz_number = 1

    for key, value in raw.items():
        match = re.search(r"(\d+)", str(key))
        if not match:
            continue
        week_number = int(match.group(1))

        if not isinstance(value, dict):
            continue

        due_raw = value.get("due_date")
        if not isinstance(due_raw, str):
            continue

        verbs_obj = value.get("verbs")
        if not isinstance(verbs_obj, dict):
            continue

        due_date = date.fromisoformat(due_raw)
        verbs_v1: list[str] = []
        for verb_data in verbs_obj.values():
            if isinstance(verb_data, dict) and isinstance(verb_data.get("v1"), str):
                verbs_v1.append(verb_data["v1"])

        if not verbs_v1:
            continue

        quizzes[week_number] = VerbQuizInfo(
            quiz_number=quiz_number,
            due_date=due_date,
            verbs_v1=verbs_v1,
        )
        quiz_number += 1

    return quizzes


def build_warmup_title_lookup(
    worksheet_titles: dict[Path, str],
) -> tuple[dict[str, str], dict[str, str]]:
    date_to_title: dict[str, str] = {}
    name_key_to_title: dict[str, str] = {}

    for path, title in worksheet_titles.items():
        match = re.search(r"2026-\d{2}-\d{2}", path.name)
        if match:
            date_to_title[match.group(0)] = title

        normalized = re.sub(r"[^a-z0-9]", "", path.stem.lower())
        name_key_to_title[normalized] = title

    return date_to_title, name_key_to_title


def find_warmup_title(
    *,
    class_date: date,
    schedule_slug: str,
    date_to_title: dict[str, str],
    name_key_to_title: dict[str, str],
) -> str:
    date_key = class_date.strftime("%Y-%m-%d")
    if date_key in date_to_title:
        return date_to_title[date_key]

    normalized_slug = re.sub(r"[^a-z0-9]", "", schedule_slug.lower())
    for name_key, title in name_key_to_title.items():
        if normalized_slug in name_key:
            return title

    raise ValueError(f"No worksheet match for {date_key} ({schedule_slug})")


def format_date_range(start: date, end: date) -> str:
    if start.year != end.year:
        return (
            f"{start.strftime('%B')} {start.day}, {start.year}–"
            f"{end.strftime('%B')} {end.day}, {end.year}"
        )

    if start.month == end.month:
        return f"{start.strftime('%B')} {start.day}–{end.day}, {end.year}"

    return f"{start.strftime('%B')} {start.day}–{end.strftime('%B')} {end.day}, {end.year}"


def format_day_header(class_date: date) -> str:
    return f"{class_date.strftime('%A')}, {class_date.strftime('%B')} {class_date.day}"


def format_due_date(due_date: date) -> str:
    return f"{due_date.strftime('%A')}, {due_date.strftime('%B')} {due_date.day}"


def render_verb_practice_table(verbs_v1: list[str]) -> str:
    if not verbs_v1:
        return ""

    header_cells = ["V1", "V1-3rd", "V1-ing", "V2", "V3"]
    header_html = "".join(
        f"<th scope=\"col\">{html.escape(label, quote=False)}</th>"
        for label in header_cells
    )

    row_html = ""
    for verb_v1 in verbs_v1:
        row_html += (
            "                            <tr>\n"
            f"                                <td class=\"verb-v1\">{html.escape(verb_v1, quote=False)}</td>\n"
            "                                <td>&nbsp;</td>\n"
            "                                <td>&nbsp;</td>\n"
            "                                <td>&nbsp;</td>\n"
            "                                <td>&nbsp;</td>\n"
            "                            </tr>\n"
        )

    return (
        "                    <div class=\"verb-practice\">\n"
        "                        <h3>Verb forms practice (fill in the blank columns)</h3>\n"
        "                        <table class=\"verb-table\">\n"
        "                            <thead>\n"
        f"                                <tr>{header_html}</tr>\n"
        "                            </thead>\n"
        "                            <tbody>\n"
        f"{row_html}"
        "                            </tbody>\n"
        "                        </table>\n"
        "                    </div>\n"
    )


def render_quizzes_section(
    *,
    config: WeekConfig,
    thursday: WarmupEntry,
    verb_quiz: VerbQuizInfo | None,
) -> str:
    def quiz_item(*, item_id: str, title: str, meta: str) -> str:
        safe_id = html.escape(item_id, quote=True)
        return (
            "                    <div class=\"quiz-item\">\n"
            f"                        <input type=\"checkbox\" id=\"{safe_id}\">\n"
            "                        <div class=\"quiz-text\">\n"
            f"                            <label for=\"{safe_id}\"><strong>{html.escape(title, quote=False)}</strong></label>\n"
            f"                            <div class=\"quiz-meta\">{html.escape(meta, quote=False)}</div>\n"
            "                        </div>\n"
            "                    </div>\n"
        )

    items_html = ""
    table_html = ""

    if verb_quiz:
        items_html += quiz_item(
            item_id=f"verb-quiz-{config.week_number}",
            title=f"Verb Quiz {verb_quiz.quiz_number}",
            meta=f"Due {format_due_date(verb_quiz.due_date)} • Online, {len(verb_quiz.verbs_v1)} verbs, ~5 minutes",
        )
        table_html = render_verb_practice_table(verb_quiz.verbs_v1)

    if config.thursday_special and config.thursday_special.startswith("Unit "):
        items_html += quiz_item(
            item_id=f"unit-quiz-{config.week_number}",
            title=config.thursday_special,
            meta=f"In class {format_due_date(thursday.class_date)} • ~30 minutes",
        )

    if not items_html:
        items_html = (
            "                    <p class=\"quiz-none\"><em>No quizzes this week.</em></p>\n"
        )

    return (
        "\n"
        "            <section class=\"quizzes-section\">\n"
        "                <div class=\"quizzes-card\">\n"
        "                    <div class=\"quizzes-heading\">\n"
        "                        <div class=\"quizzes-eyebrow\">IMPORTANT</div>\n"
        "                        <h2>Quizzes &amp; Tests</h2>\n"
        "                    </div>\n"
        f"{items_html}"
        f"{table_html}"
        "                </div>\n"
        "            </section>\n"
    )


def week_filename(week_number: int, start_date: date) -> str:
    month = start_date.strftime("%b").lower()
    return f"week{week_number}-{month}{start_date.day}-2026-SIMPLIFIED.html"


def outcomes_for_guide(guide_slug: str) -> list[str]:
    mapping: dict[str, list[str]] = {
        "parts-of-speech": [
            "Identify common parts of speech in sentences",
            "Explain the difference between content words and structure words",
            "Build clear sentences using different parts of speech",
        ],
        "superlatives-quantifiers": [
            "Use superlatives to compare (best, worst, most, least)",
            "Use quantifiers correctly (many, much, a lot of, few, little)",
            "Ask and answer comparison questions in speaking",
        ],
        "information-questions": [
            "Ask WH- questions with correct word order",
            "Ask and answer “how much / how many” questions",
            "Use follow-up questions to get more details",
        ],
        "past-continuous": [
            "Use past continuous (was/were + -ing) to describe what was happening",
            "Use when/while to connect past continuous and past simple",
            "Tell a short story about an interruption or problem",
        ],
        "past-perfect": [
            "Use past perfect (had + V3) to show what happened first",
            "Combine past perfect and past simple to explain sequence",
            "Describe a timeline clearly in speaking and writing",
        ],
        "modals-obligation-permission": [
            "Use must / have to for rules and obligations",
            "Use can / could / may for permission and polite requests",
            "Use should for advice in common situations",
        ],
        "gerunds-prepositions": [
            "Use -ing verbs after prepositions (interested in, good at, worried about)",
            "Talk about skills and routines using common work phrases",
            "Make sentences with “by + -ing” to explain how you do something",
        ],
        "present-perfect-continuous": [
            "Use present perfect continuous (have/has been + -ing) for ongoing actions",
            "Ask and answer “How long have you been…?” questions",
            "Describe work/learning experience over time",
        ],
        "infinitives-vs-gerunds": [
            "Use to + verb after some verbs (decide to, plan to, want to)",
            "Use verb + -ing after some verbs (enjoy, avoid, keep, consider)",
            "Choose the correct pattern when speaking and writing",
        ],
        "workplace-phrasal-verbs": [
            "Understand common workplace phrasal verbs (clock in, fill out, call out)",
            "Use phrasal verbs to describe work routines and policies",
            "Follow workplace instructions more easily",
        ],
        "used-to-would-rather": [
            "Use used to for past habits",
            "Use be/get used to for adjusting to new routines",
            "Use would rather to express preferences politely",
        ],
        "imperatives-declaratives": [
            "Give advice and instructions politely",
            "Understand the difference between commands and suggestions",
            "Describe symptoms and ask for help clearly",
        ],
        "passive-voice": [
            "Recognize passive voice in instructions (is/are + V3)",
            "Use passive phrases like “You are asked to…” and “It is required…”",
            "Understand common clinic and pharmacy directions",
        ],
        "reported-speech": [
            "Report what someone said using said/told/asked",
            "Change pronouns and time words when you report speech",
            "Share messages from phone calls and appointments clearly",
        ],
        "future-conditional": [
            "Use If + present, will… to talk about cause and effect",
            "Make plans and give advice using conditionals",
            "Explain consequences in speaking",
        ],
        "conditionals-zero-first": [
            "Use Type 0 conditionals (If + present, present) for facts and rules",
            "Use Type 1 conditionals (If + present, will…) for future plans",
            "Choose the correct conditional type when speaking and writing",
        ],
        "verbs-plus-gerunds": [
            "Use common verbs followed by -ing (avoid, keep, consider, stop, finish)",
            "Write sentences about habits and goals using these verbs",
            "Talk about wellness plans with clear grammar",
        ],
        "all-verb-tenses-overview": [
            "Choose the best tense for a timeline (past, present perfect, past perfect)",
            "Use time words (already, yet, just, before, after) correctly",
            "Edit sentences to fix tense mistakes",
        ],
        "perfect-tenses-review": [
            "Use present perfect and past perfect to connect events",
            "Talk about life experience and progress",
            "Correct common perfect tense mistakes",
        ],
        "future-perfect": [
            "Use Future Perfect (will have + V3) to talk about what will be completed by a future time",
            "Set goals and make predictions using 'By [date], I will have...'",
            "Talk about future achievements and milestones",
        ],
        "past-perfect-continuous": [
            "Use Past Perfect Continuous (had been + -ing) to describe ongoing actions before a past event",
            "Explain background duration before something happened",
            "Tell career and learning stories with clear timelines",
        ],
        "future-perfect-continuous": [
            "Use Future Perfect Continuous (will have been + -ing) to talk about duration continuing up to a future point",
            "Describe future milestones and long-term goals",
            "Compare all three perfect continuous tenses",
        ],
    }

    if guide_slug not in mapping:
        return [
            "Practice this week’s grammar in speaking and writing",
            "Use the grammar to share real-life information clearly",
            "Correct common grammar mistakes",
        ]

    return mapping[guide_slug]


def why_for_guide(guide_slug: str) -> str:
    """Get the 'why we're learning this' explanation for a grammar guide."""
    mapping: dict[str, str] = {
        "parts-of-speech": "Parts of speech are the building blocks of English. When you know them, you can build clearer sentences in speaking and writing.",
        "superlatives-quantifiers": "Superlatives and quantifiers help you compare and describe needs (best, worst, most, least, many, much). These are useful for housing, shopping, and everyday choices.",
        "information-questions": "Good questions help you get important information. This week you'll practice question word order and follow-up questions for real-life situations.",
        "past-continuous": "Past continuous helps you explain what was happening when something happened. This is useful for telling stories and describing problems clearly.",
        "past-perfect": "Past perfect helps you explain what happened first in the past. This is useful for timelines, reports, and clear problem descriptions.",
        "modals-obligation-permission": "Modals help you sound polite and professional (must, have to, can, could, may). These are important for work rules and requests.",
        "gerunds-prepositions": "Gerunds are common in work and school English (good at…, interested in…). This helps you describe skills and routines clearly.",
        "present-perfect-continuous": "Present perfect continuous helps you talk about experience over time (I've been working…, I've been studying…). This is useful for job and learning conversations.",
        "infinitives-vs-gerunds": "Some verbs use to + verb and others use -ing. Practicing both helps your English sound natural and clear at work and in daily life.",
        "workplace-phrasal-verbs": "Phrasal verbs are very common at work. Learning them helps you understand instructions and communicate more confidently.",
        "used-to-would-rather": "Used to helps you talk about past habits and changes. Would rather helps you express preferences politely. These are useful for work and daily life.",
        "imperatives-declaratives": "You'll practice polite ways to give advice and instructions. This helps you communicate clearly in health, school, and work situations.",
        "passive-voice": "Passive voice is common in instructions (You are asked to…, It is required…). Understanding it helps you follow clinic and pharmacy directions.",
        "reported-speech": "Reported speech helps you explain what someone said or told you to do. This is useful for phone calls, appointments, and messages.",
        "future-conditional": "If… will… helps you talk about cause and effect and make plans. This is useful for problem-solving and healthy habits.",
        "conditionals-zero-first": "Conditionals help you talk about cause and effect, rules, and future plans. Type 0 is for facts (If you pay late, you get a fee). Type 1 is for future possibilities (If I save money, I will move).",
        "verbs-plus-gerunds": "Verbs like avoid, keep, consider, and stop help you talk about habits and goals. These are useful for wellness plans and clear writing.",
        "all-verb-tenses-overview": "Reviewing key tenses helps you tell stories and explain timelines clearly. This week you'll use tense review for directions and reflection.",
        "perfect-tenses-review": "Perfect tenses help you connect past actions to the present. They are useful for reflecting on progress and setting goals.",
        "perfect-continuous-tenses-review": "Perfect continuous tenses help you describe ongoing situations and progress over time. This is useful for explaining work experience and learning journeys.",
        "future-perfect": "Future Perfect helps you talk about what will be completed by a future time. This is useful for setting goals, making predictions, and talking about future achievements.",
        "past-perfect-continuous": "Past Perfect Continuous helps you describe ongoing actions before a past event. This is useful for explaining background duration and telling career or learning stories with clear timelines.",
        "future-perfect-continuous": "Future Perfect Continuous helps you talk about duration continuing up to a future point. This is useful for describing future milestones and long-term goals.",
    }
    
    return mapping.get(guide_slug, "This grammar helps you communicate more clearly in real-life situations.")


def naturalize_warmup_title(title: str) -> str:
    """
    Convert a warmup worksheet title to a natural, student-friendly description.
    Removes formal titles and makes it more conversational.
    """
    # Remove common prefixes and suffixes
    title = title.strip()
    
    # Remove "Speaking Warmup" suffix if present
    title = re.sub(r"\s*\(Speaking Warmup\)\s*$", "", title, flags=re.IGNORECASE)
    title = re.sub(r"\s*\(Warmup\)\s*$", "", title, flags=re.IGNORECASE)
    
    # Common patterns to convert
    patterns = [
        # Housing patterns
        (r"^Housing:\s*Room Descriptions", "describing rooms in your home"),
        (r"^Housing:\s*Calling Your Landlord", "calling your landlord"),
        (r"^Housing:\s*Tenant.*Landlord", "talking to your landlord"),
        (r"^Housing:\s*Problems.*Solutions", "describing housing problems and solutions"),
        (r"^Housing:\s*Past.*Present.*Habits", "talking about past and present housing"),
        (r"^Housing.*Basics", "talking about your home"),
        
        # Banking patterns
        (r"^Banking.*Basics", "talking about banking"),
        (r"^Money.*Housing.*Plans", "talking about money and housing plans"),
        (r"^Future.*Goals", "talking about future goals"),
        
        # Workplace patterns
        (r"^Workplace.*Basics", "talking about work"),
        (r"^Career.*Basics", "talking about careers"),
        (r"^Resume.*Cover Letter", "talking about resumes and cover letters"),
        (r"^Interview.*Questions", "practicing interview questions"),
        (r"^Job Application", "talking about job applications"),
        (r"^Career.*Stories", "sharing career stories"),
        (r"^Workplace Rights", "talking about workplace rights"),
        (r"^Career Goals", "talking about career goals"),
        (r"^Negotiation", "practicing negotiation"),
        (r"^Advocacy.*Role.*Plays", "practicing advocacy role-plays"),
        (r"^Small Talk", "practicing workplace small talk"),
        (r"^Workplace Policies", "talking about workplace policies"),
        (r"^Work.*Problem.*Solution", "solving work problems"),
        (r"^Exit Interview", "practicing exit interviews"),
        
        # Health patterns
        (r"^Healthcare.*Basics", "talking about healthcare"),
        (r"^Symptoms.*Duration", "describing symptoms and how long they last"),
        (r"^Clinic Visit.*Steps", "talking about clinic visit steps"),
        (r"^Pharmacy.*Instructions", "understanding pharmacy instructions"),
        (r"^MyChart.*Calling.*Office", "using MyChart and calling the office"),
        (r"^Wellness.*Basics", "talking about wellness"),
        (r"^Nutrition.*Food Labels", "reading food labels and talking about nutrition"),
        (r"^Home Remedies", "talking about home remedies"),
        (r"^Stress.*Solutions", "talking about stress solutions"),
        (r"^Healthy Habit.*Tracker", "tracking healthy habits"),
        (r"^Wellness Presentation", "practicing wellness presentations"),
        (r"^Wellness Reflection", "reflecting on wellness"),
        
        # Grammar patterns
        (r"^Reported Speech", "reporting what someone said"),
        (r"^Passive Voice", "using passive voice"),
        (r"^Perfect.*Tenses.*Practice", "practicing perfect tenses"),
        (r"^Gerunds.*Infinitives", "using gerunds and infinitives"),
        (r"^Used To.*Structures", "using 'used to' structures"),
        (r"^Perfect.*Continuous", "using perfect continuous tenses"),
        
        # Other patterns
        (r"^Classroom.*Basics", "using classroom language"),
        (r"^Food.*Basics", "talking about food"),
        (r"^Transportation.*Basics", "talking about transportation"),
        (r"^New Year.*Goals", "talking about new year goals"),
        (r"^Community Resources", "talking about community resources"),
        (r"^Final Presentation", "practicing final presentations"),
        (r"^Year.*Review", "reflecting on the year"),
        (r"^Summer.*Next Steps", "talking about summer and next steps"),
    ]
    
    # Try to match patterns
    for pattern, replacement in patterns:
        if re.search(pattern, title, re.IGNORECASE):
            return replacement
    
    # If no pattern matches, try to extract the main topic
    # Remove common prefixes like "Housing:", "Workplace:", etc.
    title = re.sub(r"^(Housing|Workplace|Career|Health|Healthcare|Wellness|Banking|Grammar|Other):\s*", "", title, flags=re.IGNORECASE)
    
    # Remove date prefixes if present
    title = re.sub(r"^\d{1,2}/\d{1,2}/\d{2,4}:\s*", "", title)
    
    # Convert to lowercase and make it more natural
    title = title.lower().strip()
    
    # If it still has formal structure, try to simplify
    if ":" in title:
        # Take the part after the colon
        parts = title.split(":", 1)
        if len(parts) > 1:
            title = parts[1].strip()
    
    # Add "practicing" or "talking about" prefix if it doesn't already have a verb
    if not any(word in title for word in ["practicing", "talking", "describing", "using", "understanding", "reading", "sharing", "reflecting"]):
        # Check if it's an action (ends with -ing or is a noun phrase)
        if title.endswith("ing") or " " not in title:
            return f"practicing {title}"
        else:
            return f"talking about {title}"
    
    return title


def render_week_html(
    *,
    config: WeekConfig,
    tuesday: WarmupEntry,
    thursday: WarmupEntry,
    tuesday_warmup_title: str,
    thursday_warmup_title: str,
    verb_quiz: VerbQuizInfo | None,
) -> str:
    date_range = format_date_range(tuesday.class_date, thursday.class_date)
    title = f"Week {config.week_number} Plan - {date_range}"

    # Warmup outcomes: keep short and student-friendly.
    tuesday_natural = naturalize_warmup_title(tuesday_warmup_title)
    thursday_natural = naturalize_warmup_title(thursday_warmup_title)
    
    # Add "Practice" prefix, but avoid duplication if description already starts with "practicing"
    if tuesday_natural.startswith("practicing "):
        warmup_tuesday = f"Practice {tuesday_natural[11:]}"  # Remove "practicing " prefix
    else:
        warmup_tuesday = f"Practice {tuesday_natural}"
    
    if thursday_natural.startswith("practicing "):
        warmup_thursday = f"Practice {thursday_natural[11:]}"  # Remove "practicing " prefix
    else:
        warmup_thursday = f"Practice {thursday_natural}"
    
    warmup_outcomes = [
        warmup_tuesday,
        warmup_thursday,
    ]
    grammar_outcomes = outcomes_for_guide(config.guide_slug)
    outcomes = warmup_outcomes + grammar_outcomes

    def checkbox_item(item_id: str, label_text: str) -> str:
        return (
            '                <div class="goal-item">\n'
            f'                    <input type="checkbox" id="{item_id}">\n'
            f'                    <label for="{item_id}">{html.escape(label_text, quote=False)}</label>\n'
            "                </div>\n"
        )

    thursday_special_html = ""
    if config.thursday_special:
        thursday_special_html = (
            f'<p class="meta-line"><strong>Special:</strong> {html.escape(config.thursday_special, quote=False)}</p>'
        )

    quizzes_html = render_quizzes_section(
        config=config,
        thursday=thursday,
        verb_quiz=verb_quiz,
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title, quote=False)}</title>
    <style>
        :root {{
            --ink: #111;
            --muted: #444;
            --paper: #fff;
            --shade: #f3f3f3;
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            margin: 0;
            padding: 18px;
            font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
            color: var(--ink);
            background: var(--paper);
            line-height: 1.35;
        }}

        .container {{
            max-width: 900px;
            margin: 0 auto;
            border: 2px solid var(--ink);
            background: var(--paper);
        }}

        .header {{
            padding: 14px 18px;
            border-bottom: 2px solid var(--ink);
            text-align: center;
        }}

        .header h1 {{
            margin: 0;
            font-size: 1.6rem;
            letter-spacing: -0.01em;
        }}

        .week-info {{
            margin-top: 4px;
            font-size: 0.9rem;
            color: var(--muted);
        }}

        .content {{
            padding: 16px 18px 18px;
        }}

        .why-box {{
            border: 1px solid var(--ink);
            padding: 10px 12px;
            margin-bottom: 14px;
        }}

        .why-box p {{
            margin: 0;
            font-size: 0.95rem;
        }}

        .section-title {{
            margin: 0 0 10px 0;
            font-size: 1.15rem;
            border-bottom: 2px solid var(--ink);
            padding-bottom: 6px;
        }}

        .day-columns {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }}

        .day-column {{
            border: 1px solid var(--ink);
        }}

        .day-header {{
            background: var(--shade);
            padding: 8px 10px;
            font-weight: 700;
            border-bottom: 1px solid var(--ink);
        }}

        .day-content {{
            padding: 10px 10px 12px;
            font-size: 0.95rem;
        }}

        .meta-line {{
            margin: 0 0 8px 0;
        }}

        .homework {{
            margin-top: 10px;
            border-top: 1px solid var(--ink);
            padding-top: 8px;
        }}

        .homework strong {{
            display: inline-block;
            margin-bottom: 2px;
        }}

        .homework ul {{
            margin: 6px 0 0 18px;
            padding: 0;
        }}

        .homework li {{
            margin: 0 0 6px 0;
        }}

        .goals-section {{
            margin-top: 16px;
            padding-top: 12px;
            border-top: 2px solid var(--ink);
        }}

        .goals-section h2 {{
            margin: 0 0 10px 0;
            font-size: 1.15rem;
        }}

        .goal-item {{
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
        }}

        .goal-item input[type="checkbox"] {{
            margin-top: 3px;
            width: 14px;
            height: 14px;
        }}

        .goal-item label {{
            flex: 1;
            cursor: pointer;
        }}

        .quizzes-section {{
            margin-top: 16px;
            padding-top: 12px;
            border-top: 2px solid var(--ink);
        }}

        .quizzes-card {{
            border: 2px solid var(--ink);
            padding: 12px;
        }}

        .quizzes-heading {{
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 10px;
        }}

        .quizzes-eyebrow {{
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            border: 1px solid var(--ink);
            padding: 2px 8px;
        }}

        .quizzes-card h2 {{
            margin: 0;
            font-size: 1.35rem;
        }}

        .quiz-item {{
            display: flex;
            gap: 10px;
            align-items: flex-start;
            padding: 10px;
            background: var(--shade);
            border-left: 4px solid var(--ink);
            margin-bottom: 10px;
        }}

        .quiz-item input[type="checkbox"] {{
            margin-top: 4px;
            width: 16px;
            height: 16px;
        }}

        .quiz-meta {{
            margin-top: 3px;
            color: var(--muted);
            font-style: italic;
        }}

        .quiz-none {{
            margin: 0;
            color: var(--muted);
        }}

        .verb-practice {{
            border: 1px solid var(--ink);
            padding: 10px;
            background: var(--paper);
        }}

        .verb-practice h3 {{
            margin: 0 0 10px 0;
            font-size: 1.05rem;
        }}

        .verb-table {{
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }}

        .verb-table th,
        .verb-table td {{
            border: 2px solid var(--ink);
            padding: 10px 8px;
            text-align: center;
        }}

        .verb-table th {{
            background: var(--shade);
            font-weight: 800;
        }}

        .verb-table td.verb-v1 {{
            text-align: left;
            font-weight: 700;
        }}

        @media print {{
            body {{
                padding: 0;
            }}

            .container {{
                border: none;
            }}

            .day-column {{
                break-inside: avoid;
                page-break-inside: avoid;
            }}

            .quizzes-section {{
                break-before: page;
                page-break-before: always;
            }}

            .quizzes-card {{
                break-inside: avoid;
                page-break-inside: avoid;
            }}
        }}

        @media (max-width: 760px) {{
            .day-columns {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Week {config.week_number} Plan</h1>
            <div class="week-info">{html.escape(date_range, quote=False)} • {html.escape(config.guide_title, quote=False)}</div>
        </div>

        <div class="content">
            <div class="why-box">
                <p><strong>Why we're learning this:</strong> {html.escape(config.why, quote=False)}</p>
            </div>

            <h2 class="section-title">This Week's Focus</h2>

            <div class="day-columns">
                <div class="day-column">
                    <div class="day-header">{html.escape(format_day_header(tuesday.class_date), quote=False)}</div>
                    <div class="day-content">
                        <p class="meta-line"><strong>Warmup:</strong> {html.escape(tuesday_warmup_title, quote=False)}</p>
                        <p class="meta-line"><strong>Grammar:</strong> {html.escape(config.tuesday_grammar, quote=False)}</p>
                        <div class="homework">
                            <strong>Homework:</strong>
                            <ul>
                                <li>Review \"{html.escape(config.guide_title, quote=False)}\" guide on Class Companion</li>
                                <li>Finish the writing from the warmup and be ready to turn it in next class</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="day-column">
                    <div class="day-header">{html.escape(format_day_header(thursday.class_date), quote=False)}</div>
                    <div class="day-content">
                        <p class="meta-line"><strong>Warmup:</strong> {html.escape(thursday_warmup_title, quote=False)}</p>
                        {thursday_special_html}
                        <p class="meta-line"><strong>Grammar:</strong> {html.escape(config.thursday_grammar, quote=False)}</p>
                        <div class="homework">
                            <strong>Homework:</strong>
                            <ul>
                                <li>Complete \"{html.escape(config.guide_title, quote=False)}\" guide and mini-quiz on Class Companion</li>
                                <li>Finish the writing from the warmup and be ready to turn it in next class</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="goals-section">
                <h2>What You'll Be Able to Do This Week</h2>
{checkbox_item("goal-1", outcomes[0])}{checkbox_item("goal-2", outcomes[1])}{checkbox_item("goal-3", outcomes[2])}{checkbox_item("goal-4", outcomes[3])}{checkbox_item("goal-5", outcomes[4])}
            </div>

            {quizzes_html}
        </div>
    </div>
</body>
</html>
"""


def build_week_configs() -> list[WeekConfig]:
    # Schedule Week 1–22 map directly to objective Week 16–37.
    # Keep the text short and student-friendly.
    guides: list[WeekConfig] = [
        WeekConfig(
            week_number=16,
            guide_slug="parts-of-speech",
            guide_title="Parts of Speech",
            tuesday_grammar="Parts of Speech (content words)",
            thursday_grammar="Parts of Speech (structure words)",
            why="Parts of speech are the building blocks of English. When you know them, you can build clearer sentences in speaking and writing.",
            thursday_special="Unit 4 Quiz (in class)",
        ),
        WeekConfig(
            week_number=17,
            guide_slug="superlatives-quantifiers",
            guide_title="Superlatives & Quantifiers",
            tuesday_grammar="Superlatives & quantifiers for comparing",
            thursday_grammar="Superlatives & quantifiers (review + speaking practice)",
            why="Superlatives and quantifiers help you compare and describe needs (best, worst, most, least, many, much). These are useful for housing, shopping, and everyday choices.",
        ),
        WeekConfig(
            week_number=18,
            guide_slug="information-questions",
            guide_title="Information Questions",
            tuesday_grammar="Information questions (WH- questions + word order)",
            thursday_grammar="Information questions (review + role-play practice)",
            why="Good questions help you get important information. This week you’ll practice question word order and follow-up questions for real-life situations.",
        ),
        WeekConfig(
            week_number=19,
            guide_slug="conditionals-zero-first",
            guide_title="Zero & First Conditionals",
            tuesday_grammar="Type 0 conditionals (If + present, present) for facts and rules",
            thursday_grammar="Type 1 conditionals (If + present, will…) for future plans",
            why="Conditionals help you talk about cause and effect, rules, and future plans. Type 0 is for facts (If you pay late, you get a fee). Type 1 is for future possibilities (If I save money, I will move).",
        ),
        WeekConfig(
            week_number=20,
            guide_slug="conditionals-zero-first",
            guide_title="Zero & First Conditionals",
            tuesday_grammar="Type 0 vs Type 1 conditionals (when to use which)",
            thursday_grammar="Conditionals review + fluency practice",
            why="Practicing both types helps you explain housing problems (Type 0) and solutions (Type 1) clearly. This is useful for talking about money, housing, and making plans.",
        ),
        WeekConfig(
            week_number=21,
            guide_slug="past-perfect",
            guide_title="Past Perfect & Future Perfect",
            tuesday_grammar="Past perfect (had + V3) for timelines",
            thursday_grammar="Future Perfect (will have + V3) for future goals",
            why="Past perfect helps you explain what happened first in the past. Future perfect helps you talk about what will be completed by a future time. Both are useful for timelines and goals.",
            thursday_special="Unit 5 Quiz (in class)",
        ),
        WeekConfig(
            week_number=22,
            guide_slug="modals-obligation-permission",
            guide_title="Modals: Obligation & Permission",
            tuesday_grammar="Modals for rules, permission, and polite requests",
            thursday_grammar="Modals (review + speaking practice)",
            why="Modals help you sound polite and professional (must, have to, can, could, may). These are important for work rules and requests.",
        ),
        WeekConfig(
            week_number=23,
            guide_slug="gerunds-prepositions",
            guide_title="Gerunds After Prepositions",
            tuesday_grammar="Gerunds after prepositions (interested in, good at…)",
            thursday_grammar="Gerunds vs infinitives (quick review + speaking)",
            why="Gerunds are common in work and school English (good at…, interested in…). This helps you describe skills and routines clearly.",
        ),
        WeekConfig(
            week_number=24,
            guide_slug="present-perfect-continuous",
            guide_title="Present Perfect Continuous & Past Perfect Continuous",
            tuesday_grammar="Present perfect continuous (I've been…)",
            thursday_grammar="Past Perfect Continuous (had been + -ing) for background duration",
            why="Present perfect continuous helps you talk about experience over time. Past perfect continuous helps you describe ongoing actions before a past event. Both are useful for job and learning conversations.",
            thursday_special="Unit 6 Quiz (in class)",
        ),
        WeekConfig(
            week_number=25,
            guide_slug="present-perfect-continuous",
            guide_title="Present Perfect Continuous & Future Perfect Continuous",
            tuesday_grammar="Present perfect continuous (workplace contexts)",
            thursday_grammar="Future Perfect Continuous (will have been + -ing) for future milestones",
            why="Present perfect continuous helps you describe ongoing situations and progress. Future perfect continuous helps you talk about duration continuing up to a future point. These are useful for explaining work experience and future goals.",
        ),
        WeekConfig(
            week_number=26,
            guide_slug="infinitives-vs-gerunds",
            guide_title="Infinitives vs Gerunds",
            tuesday_grammar="Infinitives vs gerunds (to + verb vs verb + -ing)",
            thursday_grammar="Infinitives vs gerunds (review + speaking practice)",
            why="Some verbs use to + verb and others use -ing. Practicing both helps your English sound natural and clear at work and in daily life.",
        ),
        WeekConfig(
            week_number=27,
            guide_slug="workplace-phrasal-verbs",
            guide_title="Workplace Phrasal Verbs",
            tuesday_grammar="Workplace phrasal verbs (clock in/out, fill out…)",
            thursday_grammar="Phrasal verbs in workplace policies (practice)",
            why="Phrasal verbs are very common at work. Learning them helps you understand instructions and communicate more confidently.",
        ),
        WeekConfig(
            week_number=28,
            guide_slug="used-to-would-rather",
            guide_title="Used To & Would Rather",
            tuesday_grammar="Used to + would rather (habits + preferences)",
            thursday_grammar="Used to / be used to / get used to (review)",
            why="Used to helps you talk about past habits and changes. Would rather helps you express preferences politely. These are useful for work and daily life.",
        ),
        WeekConfig(
            week_number=29,
            guide_slug="imperatives-declaratives",
            guide_title="Imperatives vs Declaratives",
            tuesday_grammar="Advice language (should) + clear instructions",
            thursday_grammar="Advice and instruction review (tone + clarity)",
            why="You’ll practice polite ways to give advice and instructions. This helps you communicate clearly in health, school, and work situations.",
            thursday_special="Unit 7 Quiz (in class)",
        ),
        WeekConfig(
            week_number=30,
            guide_slug="passive-voice",
            guide_title="Passive Voice",
            tuesday_grammar="Passive voice in step-by-step instructions",
            thursday_grammar="Passive voice for rules and recommendations",
            why="Passive voice is common in instructions (You are asked to…, It is required…). Understanding it helps you follow clinic and pharmacy directions.",
        ),
        WeekConfig(
            week_number=31,
            guide_slug="reported-speech",
            guide_title="Reported Speech",
            tuesday_grammar="Reported speech + reported commands (said/told/asked)",
            thursday_grammar="Reported speech review + practice",
            why="Reported speech helps you explain what someone said or told you to do. This is useful for phone calls, appointments, and messages.",
        ),
        WeekConfig(
            week_number=32,
            guide_slug="used-to-would-rather",
            guide_title="Used To / Be Used To / Get Used To",
            tuesday_grammar="Used to / be used to / get used to (habit change)",
            thursday_grammar="Used to structures review + quiz practice",
            why="These phrases help you talk about habit changes and adjusting to new routines. They’re useful for wellness goals and daily life.",
            thursday_special="Unit 8 Quiz (in class)",
        ),
        WeekConfig(
            week_number=33,
            guide_slug="future-conditional",
            guide_title="Future Conditional",
            tuesday_grammar="Future conditional (If + present, will…)",
            thursday_grammar="Future conditional review in speaking",
            why="If… will… helps you talk about cause and effect and make plans. This is useful for problem-solving and healthy habits.",
        ),
        WeekConfig(
            week_number=34,
            guide_slug="verbs-plus-gerunds",
            guide_title="Verbs + Gerunds",
            tuesday_grammar="Verbs + gerunds (avoid, keep, consider, stop…)",
            thursday_grammar="Verbs + gerunds review + presentation practice",
            why="Verbs like avoid, keep, consider, and stop help you talk about habits and goals. These are useful for wellness plans and clear writing.",
        ),
        WeekConfig(
            week_number=35,
            guide_slug="all-verb-tenses-overview",
            guide_title="Verb Tenses Review",
            tuesday_grammar="Tense review (past vs present perfect vs past perfect)",
            thursday_grammar="Mixed tense review + error correction",
            why="Reviewing key tenses helps you tell stories and explain timelines clearly. This week you’ll use tense review for directions and reflection.",
        ),
        WeekConfig(
            week_number=36,
            guide_slug="perfect-tenses-review",
            guide_title="Perfect Tenses Review",
            tuesday_grammar="Perfect tenses review (present perfect + past perfect)",
            thursday_grammar="Perfect tenses review + speaking practice",
            why="Perfect tenses help you connect past actions to the present. They are useful for reflecting on progress and setting goals.",
            thursday_special="Unit 9 Quiz (in class)",
        ),
        WeekConfig(
            week_number=37,
            guide_slug="perfect-tenses-review",
            guide_title="Perfect Tenses Review",
            tuesday_grammar="Perfect tenses review (practice + editing)",
            thursday_grammar="Course wrap-up: mixed review + reflection",
            why="You’ll use review grammar to summarize your learning and share advice. This helps you speak clearly in presentations and interviews.",
        ),
    ]

    if len(guides) != 22:
        raise ValueError(f"Expected 22 week configs, found {len(guides)}")
    return guides


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Rebuild week16–week37 simplified class objective HTML files."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite files even if they are non-empty.",
    )
    args = parser.parse_args()

    entries = parse_warmup_schedule(WARMUP_SCHEDULE_MD)
    worksheet_titles = load_worksheet_titles(WORKSHEETS_DIR)
    date_to_title, name_key_to_title = build_warmup_title_lookup(worksheet_titles)
    verb_quizzes = load_verb_quizzes(VERB_QUIZZES_JSON)

    week_pairs: list[tuple[WarmupEntry, WarmupEntry]] = []
    for i in range(0, len(entries), 2):
        tuesday = entries[i]
        thursday = entries[i + 1]
        if tuesday.day != "Tue" or thursday.day != "Thu":
            raise ValueError(
                f"Unexpected day order at index {i}: {tuesday.day}, {thursday.day}"
            )
        week_pairs.append((tuesday, thursday))

    week_configs = build_week_configs()
    if len(week_pairs) != len(week_configs):
        raise ValueError(
            f"Expected {len(week_configs)} week pairs, found {len(week_pairs)}"
        )

    # Override grammar guides based on warmup worksheets
    def detect_grammar_from_warmup(warmup_title: str, schedule_slug: str = "") -> tuple[str, str] | None:
        """Detect grammar guide from warmup worksheet title or schedule slug. Returns (guide_slug, guide_title) or None."""
        warmup_lower = warmup_title.lower()
        slug_lower = schedule_slug.lower()
        combined = f"{warmup_lower} {slug_lower}"
        
        # Map warmup patterns to grammar guides (check both title and schedule slug)
        # Note: Only detect if the title actually contains the grammar topic
        grammar_map = {
            "reported-speech": ("reported-speech", "Reported Speech"),
            "reported speech": ("reported-speech", "Reported Speech"),
            "passive-voice": ("passive-voice", "Passive Voice"),
            "passive voice": ("passive-voice", "Passive Voice"),
            # Only detect perfect tenses if title actually says "perfect tenses" (not "past continuous vs past simple")
            "perfect tenses review": ("perfect-tenses-review", "Perfect Tenses Review"),
            "perfect tenses": ("perfect-tenses-review", "Perfect Tenses Review"),
            # Don't match "perfect-tenses-practice" since that worksheet is actually about "Past Continuous vs Past Simple"
            "gerunds-infinitives": ("infinitives-vs-gerunds", "Infinitives vs Gerunds"),
            "gerunds and infinitives": ("infinitives-vs-gerunds", "Infinitives vs Gerunds"),
            "gerunds & infinitives": ("infinitives-vs-gerunds", "Infinitives vs Gerunds"),
            "perfect-continuous": ("perfect-continuous-tenses-review", "Perfect Continuous Tenses Review"),
            "perfect continuous": ("perfect-continuous-tenses-review", "Perfect Continuous Tenses Review"),
            "perfect continuous tenses": ("perfect-continuous-tenses-review", "Perfect Continuous Tenses Review"),
            "used-to-structures": ("used-to-would-rather", "Used To / Be Used To / Get Used To"),
            "used to": ("used-to-would-rather", "Used To / Be Used To / Get Used To"),
        }
        
        # Check combined text (title + schedule slug) for patterns
        for pattern, (slug, title) in grammar_map.items():
            if pattern in combined:
                return (slug, title)
        return None

    # Update week configs based on warmup worksheets
    from dataclasses import replace
    for i, ((tuesday, thursday), config) in enumerate(zip(week_pairs, week_configs)):
        tuesday_title = find_warmup_title(
            class_date=tuesday.class_date,
            schedule_slug=tuesday.schedule_slug,
            date_to_title=date_to_title,
            name_key_to_title=name_key_to_title,
        )
        thursday_title = find_warmup_title(
            class_date=thursday.class_date,
            schedule_slug=thursday.schedule_slug,
            date_to_title=date_to_title,
            name_key_to_title=name_key_to_title,
        )
        
        # Check if warmups indicate additional grammar topics
        thursday_grammar_detected = detect_grammar_from_warmup(thursday_title, thursday.schedule_slug)
        tuesday_grammar_detected = detect_grammar_from_warmup(tuesday_title, tuesday.schedule_slug)
        
        # Update grammar descriptions to include detected topics (append, don't replace)
        updated_tuesday_grammar = config.tuesday_grammar
        updated_thursday_grammar = config.thursday_grammar
        updated_why = config.why
        
        if tuesday_grammar_detected:
            slug, title = tuesday_grammar_detected
            # Append the detected grammar if it's different from the week's main topic
            if slug != config.guide_slug:
                updated_tuesday_grammar = f"{config.tuesday_grammar} + {title}"
        
        if thursday_grammar_detected:
            slug, title = thursday_grammar_detected
            # Append the detected grammar if it's different from the week's main topic
            if slug != config.guide_slug:
                updated_thursday_grammar = f"{config.thursday_grammar} + {title}"
                # Update "why" to mention both topics if Thursday has a different grammar
                if slug != config.guide_slug:
                    main_why = config.why
                    additional_why = why_for_guide(slug)
                    # Capitalize the first letter of the additional explanation
                    additional_why_lower = additional_why[0].lower() + additional_why[1:] if len(additional_why) > 1 else additional_why.lower()
                    updated_why = f"{main_why} Also, {additional_why_lower}"
        
        # Only update if we detected additional grammar topics
        if tuesday_grammar_detected or thursday_grammar_detected:
            week_configs[i] = replace(
                config,
                tuesday_grammar=updated_tuesday_grammar,
                thursday_grammar=updated_thursday_grammar,
                why=updated_why,
            )

    CLASS_OBJECTIVES_DIR.mkdir(parents=True, exist_ok=True)

    written: list[Path] = []
    for (tuesday, thursday), config in zip(week_pairs, week_configs, strict=True):
        tuesday_title = find_warmup_title(
            class_date=tuesday.class_date,
            schedule_slug=tuesday.schedule_slug,
            date_to_title=date_to_title,
            name_key_to_title=name_key_to_title,
        )
        thursday_title = find_warmup_title(
            class_date=thursday.class_date,
            schedule_slug=thursday.schedule_slug,
            date_to_title=date_to_title,
            name_key_to_title=name_key_to_title,
        )

        file_path = CLASS_OBJECTIVES_DIR / week_filename(
            config.week_number, tuesday.class_date
        )

        if file_path.exists() and file_path.stat().st_size > 0 and not args.force:
            raise SystemExit(
                f"Refusing to overwrite non-empty file without --force: {file_path}"
            )

        verb_quiz = verb_quizzes.get(config.week_number)
        file_path.write_text(
            render_week_html(
                config=config,
                tuesday=tuesday,
                thursday=thursday,
                tuesday_warmup_title=tuesday_title,
                thursday_warmup_title=thursday_title,
                verb_quiz=verb_quiz,
            ),
            encoding="utf-8",
        )
        written.append(file_path)

    print(f"✅ Rebuilt {len(written)} simplified class objective files in {CLASS_OBJECTIVES_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
