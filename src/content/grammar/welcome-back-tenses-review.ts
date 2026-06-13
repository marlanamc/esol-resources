import type { InteractiveGuideContent } from "@/types/activity";
import { welcomeBackImages as img } from "@/data/welcome-back-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" = "terracotta"
): string => {
  const scene = img[sceneId];
  if (!scene) return "";
  return `
    <div class="gc-bg-white" style="margin: 0 0 1.5rem 0; padding: 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 10px rgba(0,0,0,0.06)">
      <img src="${scene.url}" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover" />
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
        <span style="font-size: 0.68rem; opacity: 0.7">Photo: <a href="${scene.credit.url}" rel="noopener" target="_blank">${scene.credit.name}</a> / Unsplash</span>
      </div>
    </div>
  `;
};

type Turn = {
  speaker: string;
  avatar: string;
  text: string;
  side: "left" | "right";
  tone: "terracotta" | "sage" | "blue" | "amber";
};

const dialogue = (turns: Turn[]): string => {
  const bubbles = turns
    .map((t) => {
      const bgClass = `gc-bg-${t.tone}-alpha`;
      const radius =
        t.side === "left"
          ? "0.875rem 0.875rem 0.875rem 0.25rem"
          : "0.875rem 0.875rem 0.25rem 0.875rem";
      const rowStyle =
        t.side === "left"
          ? "display: flex; gap: 0.625rem; align-items: flex-start"
          : "display: flex; gap: 0.625rem; align-items: flex-start; flex-direction: row-reverse";
      return `
        <div style="${rowStyle}">
          <div style="font-size: 1.65rem; line-height: 1; flex-shrink: 0; padding-top: 0.25rem">${t.avatar}</div>
          <div class="${bgClass}" style="padding: 0.65rem 0.9rem; border-radius: ${radius}; max-width: 82%">
            <div class="gc-text-${t.tone}" style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 0.15rem">${t.speaker}</div>
            <div style="line-height: 1.5">${t.text}</div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="display: flex; flex-direction: column; gap: 0.625rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06)">
      ${bubbles}
    </div>
  `;
};

const labelPill = (text: string, color: "terracotta" | "sage" | "blue" | "amber"): string =>
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const welcomeBackTensesReviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // INTRO. You already know this
    // =========================================================================
    {
      id: "you-already-know-this",
      title: "Four tenses, one bus ride",
      icon: "🚌",
      explanation: `
        ${sceneCard("sceneBusStop", "Tuesday evening, 5:45 PM. Rosa heads to the 121 bus after work.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">You use these tenses every week at work, on the bus, and in class. Rosa had Monday off. Her classmate David had back-to-school night that evening. This guide is a quick refresh, not new grammar.</p>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Four sentences from Rosa's evening. Read the <strong>time indicator</strong> first, then the verb.</p>

        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0">
          <div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #b05740; background: rgba(176,87,64,0.06)">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.35rem">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #b05740">Present Simple</span>
              ${labelPill("every morning", "terracotta")}
            </div>
            <p style="margin: 0">Rosa <strong>takes</strong> the bus to work every morning.</p>
          </div>
          <div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #268a82; background: rgba(38,138,130,0.06)">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.35rem">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #268a82">Present Continuous</span>
              ${labelPill("right now", "blue")}
            </div>
            <p style="margin: 0">Right now, she <strong>is waiting</strong> at the stop on Cambridge Street.</p>
          </div>
          <div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #b56e1a; background: rgba(181,110,26,0.06)">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.35rem">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #b56e1a">Past Simple</span>
              ${labelPill("yesterday", "amber")}
            </div>
            <p style="margin: 0">Yesterday, her neighbor <strong>knocked</strong> on her door at 7 AM.</p>
          </div>
          <div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #6a8d73; background: rgba(106,141,115,0.06)">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.35rem">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6a8d73">Past Continuous</span>
              ${labelPill("at that moment", "sage")}
            </div>
            <p style="margin: 0">At that moment, she <strong>was getting</strong> her kids ready for school.</p>
          </div>
        </div>

        <div class="gc-callout-sage" style="background: rgba(106,141,115,0.12); padding: 1rem 1.25rem; border-radius: 0.5rem">
          <p style="margin: 0"><strong>Simple</strong> = finished or repeats on a schedule. <strong>Continuous</strong> = in progress at a specific moment. The time word usually tells you which one.</p>
        </div>
      `,
      exercises: [
        {
          id: "wbtr-know-1",
          title: "Match the tense",
          instructions: "Read the time indicator in each sentence, then choose the tense.",
          items: [
            {
              type: "radio",
              label: "\"Rosa <strong>takes</strong> the bus every morning.\"",
              options: [
                { value: "present-simple", label: "Present Simple" },
                { value: "present-continuous", label: "Present Continuous" },
                { value: "past-simple", label: "Past Simple" },
                { value: "past-continuous", label: "Past Continuous" },
              ],
              expectedAnswer: "present-simple",
            },
            {
              type: "radio",
              label: "\"She <strong>is waiting</strong> at the stop right now.\"",
              options: [
                { value: "present-simple", label: "Present Simple" },
                { value: "present-continuous", label: "Present Continuous" },
                { value: "past-simple", label: "Past Simple" },
                { value: "past-continuous", label: "Past Continuous" },
              ],
              expectedAnswer: "present-continuous",
            },
            {
              type: "radio",
              label: "\"Her neighbor <strong>knocked</strong> on the door yesterday.\"",
              options: [
                { value: "present-simple", label: "Present Simple" },
                { value: "present-continuous", label: "Present Continuous" },
                { value: "past-simple", label: "Past Simple" },
                { value: "past-continuous", label: "Past Continuous" },
              ],
              expectedAnswer: "past-simple",
            },
            {
              type: "radio",
              label: "\"She <strong>was getting</strong> her kids ready at that moment.\"",
              options: [
                { value: "present-simple", label: "Present Simple" },
                { value: "present-continuous", label: "Present Continuous" },
                { value: "past-simple", label: "Past Simple" },
                { value: "past-continuous", label: "Past Continuous" },
              ],
              expectedAnswer: "past-continuous",
            },
            {
              type: "text",
              label: "Rosa ___ the bus to work every morning. (take)",
              expectedAnswers: ["takes"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // STEP 1. Present Simple
    // =========================================================================
    {
      id: "present-simple-review",
      stepNumber: 1,
      title: "Present Simple: every day, every week",
      icon: "🔄",
      tenseDiagram: {
        title: "Where it lives on the timeline",
        elements: [
          { id: "ps-dot", type: "multiple-dots", zone: "present", position: 50 },
        ],
      },
      explanation: `
        ${sceneCard("sceneNeighborhood", "East Boston. Tuesday evening after work.", "sage")}

        ${dialogue([
          { speaker: "Classmate", avatar: "🧑🏽", text: "How <strong>do</strong> you <strong>get</strong> to class?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "The 121. I <strong>work</strong> days, so I <strong>come</strong> straight from Meridian Street.", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "I <strong>take</strong> the Blue Line from Revere. Class <strong>starts</strong> at six, right?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Six on the dot. Tuesdays and Thursdays, <strong>every</strong> week.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem"><strong>Present Simple</strong> = routines, schedules, and facts that stay true over time.</p>
          <p style="margin: 0; font-size: 0.95rem">When you see <strong>every day</strong>, <strong>usually</strong>, or <strong>on Tuesdays</strong>, the sentence is probably present simple.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("every day", "terracotta")}
            <span><em>I <strong>wake up</strong> at 6 every day.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("usually", "terracotta")}
            <span><em>The 121 <strong>comes</strong> every 20 minutes. It is <strong>usually</strong> on time.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("on Tuesdays", "terracotta")}
            <span><em>ESL class <strong>meets</strong> on Tuesdays and Thursdays.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("fact", "terracotta")}
            <span><em>My kids <strong>go</strong> to school on the 121.</em></span>
          </div>
        </div>
      `,
      timeExpressions: [
        {
          word: "every day / every morning",
          usage: "Present Simple. The action repeats on a schedule.",
          examples: [
            "I take the 121 every morning.",
            "She works days, not nights.",
          ],
        },
        {
          word: "usually / always / never",
          usage: "Present Simple. How often something happens in general.",
          examples: [
            "The bus usually comes on time.",
            "I never miss class on Tuesdays.",
          ],
        },
        {
          word: "on Mondays / twice a week",
          usage: "Present Simple. Fixed days or frequency.",
          examples: [
            "The community center offers free ESL on Tuesday nights.",
          ],
        },
      ],
      tipBox: {
        title: "Read the time word first",
        content:
          "If the sentence says every day, usually, always, or on [day], start with Present Simple. Save -ing forms for right now or this week.",
      },
      exercises: [
        {
          id: "wbtr-ps-1",
          title: "Fix the sentence",
          instructions: "One word is wrong. Choose the correct present simple form.",
          items: [
            {
              type: "radio",
              label: "Rosa <strong>work</strong> at a clinic on Meridian Street.",
              options: [
                { value: "work", label: "work. correct as is" },
                { value: "works", label: "works. needs the -s" },
                { value: "is working", label: "is working. present continuous" },
              ],
              expectedAnswer: "works",
            },
            {
              type: "radio",
              label: "The 121 bus <strong>stops</strong> at five different places in East Boston.",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "stop", label: "Should be 'stop'" },
                { value: "is stopping", label: "Should be 'is stopping'" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "text",
              label: "The community center ___ free ESL classes on Tuesday nights. (offer)",
              expectedAnswers: ["offers"],
            },
          ],
        },
        {
          id: "wbtr-ps-2",
          title: "Choose the correct form",
          instructions: "Pick the right present simple form.",
          items: [
            {
              type: "radio",
              label: "The community center ___ free ESL classes on Tuesday nights. (offer)",
              options: [
                { value: "offer", label: "offer" },
                { value: "offers", label: "offers" },
                { value: "is offering", label: "is offering" },
              ],
              expectedAnswer: "offers",
            },
            {
              type: "radio",
              label: "My kids ___ to school every morning by bus. (go)",
              options: [
                { value: "go", label: "go" },
                { value: "goes", label: "goes" },
                { value: "went", label: "went" },
              ],
              expectedAnswer: "go",
            },
            {
              type: "radio",
              label: "\"I usually ___ the 121 after work.\" Time indicator: <strong>usually</strong>. (take)",
              options: [
                { value: "take", label: "take. present simple" },
                { value: "am taking", label: "am taking. present continuous" },
                { value: "took", label: "took. past simple" },
              ],
              expectedAnswer: "take",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // STEP 2. Present Continuous
    // =========================================================================
    {
      id: "present-continuous-review",
      stepNumber: 2,
      title: "Present Continuous: right now, this week",
      icon: "▶️",
      tenseDiagram: {
        title: "Where it lives on the timeline",
        elements: [
          { id: "pc-line", type: "solid-line", zone: "present", position: 50 },
        ],
      },
      explanation: `
        ${sceneCard("scenePhone", "Rosa on the 121, finishing a lesson before class", "blue")}

        ${dialogue([
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "Still on your phone? What <strong>are</strong> you <strong>doing</strong>?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "I <strong>am studying</strong>. I <strong>am trying</strong> to finish this section before we get to Maverick.", side: "right", tone: "terracotta" },
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "Rent in Eastie <strong>is going</strong> up again, huh?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Yeah. We <strong>are looking</strong> for something cheaper <strong>this month</strong>.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem"><strong>Present Continuous</strong> = in progress <strong>right now</strong>, or true for a <strong>short time</strong> (today, this week, these days).</p>
          <p style="margin: 0; font-weight: 600">Formula: <em>am / is / are + V1-ing</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("right now", "blue")}
            <span><em>She <strong>is waiting</strong> for the 121 right now.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("this week", "blue")}
            <span><em>Carlos <strong>is borrowing</strong> his friend's car this week. The bus is on strike.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("these days", "blue")}
            <span><em>Rent <strong>is getting</strong> more expensive these days.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin: 1rem 0">
          <p style="margin: 0 0 0.75rem 0; font-weight: 600">Same commute, two tenses:</p>
          <p style="margin: 0 0 0.35rem 0"><span class="gc-text-terracotta" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase">Every morning</span> &nbsp; I <strong>take</strong> the 121. <span style="font-size: 0.88rem; color: var(--color-text-muted)">(habit)</span></p>
          <p style="margin: 0"><span class="gc-text-blue" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase">Right now</span> &nbsp; I <strong>am waiting</strong> for the 121. <span style="font-size: 0.88rem; color: var(--color-text-muted)">(happening now)</span></p>
        </div>
      `,
      comparison: {
        title: "Present Simple or Continuous? Check the time indicator.",
        leftLabel: "Present Continuous",
        rightLabel: "Present Simple",
        rows: [
          {
            label: "Time words",
            left: "right now, at the moment, today, this week, these days",
            right: "every day, every morning, usually, always, on Tuesdays, never",
          },
          {
            label: "Meaning",
            left: "In progress now, or temporary for a while",
            right: "Routine, schedule, or stable fact",
          },
          {
            label: "Commute",
            left: "I <strong>am waiting</strong> for the 121 right now.",
            right: "I <strong>take</strong> the 121 every morning.",
          },
          {
            label: "Work",
            left: "I <strong>am working</strong> nights this month.",
            right: "I <strong>work</strong> at the clinic on Meridian Street.",
          },
          {
            label: "Common mistake",
            left: "✗ I <strong>am taking</strong> the bus every morning.",
            right: "✓ I <strong>take</strong> the bus every morning.",
          },
        ],
      },
      timeExpressions: [
        {
          word: "right now / at the moment",
          usage: "Present Continuous. The action is happening as you speak.",
          examples: [
            "I am studying on the bus right now.",
            "She is talking to the teacher at the moment.",
          ],
        },
        {
          word: "today / this week",
          usage: "Present Continuous. True for a short period, not your normal routine.",
          examples: [
            "The bus is running late today.",
            "I am borrowing Carlos's car this week.",
          ],
        },
        {
          word: "these days / for now",
          usage: "Present Continuous. A situation that is changing or temporary.",
          examples: [
            "We are looking for a new apartment these days.",
            "She is living with her cousin for now.",
          ],
        },
      ],
      tipBox: {
        title: "One question",
        content:
          "Does the time word mean again and again (every day, usually)? → Present Simple. Does it mean now or for a short time (right now, this week)? → Present Continuous.",
      },
      exercises: [
        {
          id: "wbtr-pc-scramble",
          title: "Put it in order",
          instructions: "Unscramble the words to make a correct present continuous sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["My", "sister", "is", "looking", "for", "a", "new", "job", "this", "month"],
              correctAnswer: "My sister is looking for a new job this month",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "students", "are", "practicing", "English", "on", "the", "app"],
              correctAnswer: "The students are practicing English on the app",
            },
            {
              type: "text",
              label: "Right now, Rosa ___ for the 121 on Cambridge Street. (wait)",
              expectedAnswers: ["is waiting"],
            },
          ],
        },
        {
          id: "wbtr-pc-contrast",
          title: "Read the time indicator",
          instructions: "The time word tells you simple or continuous. Carlos and Rosa take the same bus route.",
          items: [
            {
              type: "radio",
              label: "\"Carlos ___ the 121 to class.\" Time indicator: <strong>every Tuesday and Thursday</strong>. (take)",
              options: [
                { value: "takes", label: "takes. present simple" },
                { value: "is taking", label: "is taking. present continuous" },
              ],
              expectedAnswer: "takes",
            },
            {
              type: "radio",
              label: "\"Carlos ___ the 121 right now.\" Time indicator: <strong>right now</strong>. (ride)",
              options: [
                { value: "rides", label: "rides. present simple" },
                { value: "is riding", label: "is riding. present continuous" },
              ],
              expectedAnswer: "is riding",
            },
            {
              type: "radio",
              label: "\"The bus is on strike today. Carlos ___ his friend's car.\" Time indicator: <strong>today</strong>. (use)",
              options: [
                { value: "uses", label: "uses. present simple" },
                { value: "is using", label: "is using. present continuous" },
              ],
              expectedAnswer: "is using",
            },
            {
              type: "radio",
              label: "Which sentence is wrong?",
              options: [
                { value: "a", label: "\"I take the Orange Line every day.\"" },
                { value: "b", label: "\"Right now I am waiting for the 121.\"" },
                { value: "c", label: "\"I am taking the bus every morning to work.\"" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // STEP 3. Past tenses
    // =========================================================================
    {
      id: "past-tenses-review",
      stepNumber: 3,
      title: "Past Simple vs. Past Continuous",
      icon: "⏪",
      tenseDiagram: {
        title: "Where they live on the timeline",
        elements: [
          { id: "past-simple-dot", type: "single-dot", zone: "past", position: 58 },
          { id: "past-cont-line", type: "solid-line", zone: "past", position: 35 },
        ],
      },
      explanation: `
        ${sceneCard("sceneClassroom", "First day of class. Last September.", "amber")}

        ${dialogue([
          { speaker: "Teacher", avatar: "👩‍🏫", text: "Think back to last September. What <strong>were</strong> you <strong>doing</strong> right before you <strong>walked</strong> in?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "I <strong>was sitting</strong> outside the classroom. I <strong>didn't want</strong> to be the first one in.", side: "right", tone: "sage" },
          { speaker: "Teacher", avatar: "👩‍🏫", text: "And then what <strong>happened</strong>?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "I <strong>was still sitting</strong> there when Rosa <strong>opened</strong> the door and <strong>said</strong>, \"Come on in.\" She had taken this class before.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">The same simple/continuous contrast exists in the past. <strong>Past Simple</strong> = finished action. <strong>Past Continuous</strong> = action in progress when something else happened.</p>
        </div>

        <div style="padding: 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.35rem 0; font-weight: 600">The classic pair:</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 1.05rem"><em>I <strong>was cooking</strong> dinner when my phone <strong>rang</strong>.</em></p>
          <p style="margin: 0; font-size: 0.88rem; color: var(--color-text-muted)">was cooking = in progress &nbsp;·&nbsp; rang = sudden interruption</p>
        </div>

        <div class="table-wrap" style="overflow-x: auto; margin: 1rem 0">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem">
            <thead>
              <tr style="background: rgba(176,87,64,0.12)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Tense</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Formula</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Signal words</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>Past Simple</strong></td>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">V2</td>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">yesterday, last week, in 2019, ago</td>
              </tr>
              <tr>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>Past Continuous</strong></td>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">was/were + V1-ing</td>
                <td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">when, while, at that moment, at 3 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      exercises: [
        {
          id: "wbtr-past-1",
          title: "Back to that first day",
          instructions: "Choose the correct past tense for each blank.",
          items: [
            {
              type: "radio",
              label: "Fatima ___ at the front desk when the new students arrived. (work)",
              options: [
                { value: "worked", label: "worked" },
                { value: "was working", label: "was working" },
              ],
              expectedAnswer: "was working",
            },
            {
              type: "radio",
              label: "One student ___ a question about the schedule. (ask)",
              options: [
                { value: "asked", label: "asked" },
                { value: "was asking", label: "was asking" },
              ],
              expectedAnswer: "asked",
            },
            {
              type: "radio",
              label: "Last September, I ___ this class for the first time. (take)",
              options: [
                { value: "took", label: "took" },
                { value: "was taking", label: "was taking" },
              ],
              expectedAnswer: "took",
            },
            {
              type: "text",
              label: "Fatima ___ at the front desk when the new students arrived. (work)",
              expectedAnswers: ["was working"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // STEP 4. V3 preview
    // =========================================================================
    {
      id: "v3-preview",
      stepNumber: 4,
      title: "A third form is coming this year",
      icon: "👀",
      tenseDiagram: {
        title: "Four tenses you know. plus one more coming this year",
        elements: [
          { id: "past-cont-prev", type: "solid-line",    zone: "past",    position: 28 },
          { id: "past-simp-prev", type: "single-dot",    zone: "past",    position: 68 },
          { id: "pres-simp-prev", type: "multiple-dots", zone: "present", position: 50 },
          { id: "pres-cont-prev", type: "solid-line",    zone: "present", position: 50 },
        ],
      },
      explanation: `
        <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem">
          <p style="font-size: 1.1rem; margin: 0 0 0.5rem 0; line-height: 1.6">
            You already use V1 (base), V2 (past simple), and V1-ing (continuous).<br/>
            Later this year you will use a fourth form: <strong>V3, the past participle.</strong>
          </p>
          <p style="margin: 0; font-size: 0.95rem; opacity: 0.9">You do not need to produce it yet. Start noticing it after <strong>have / has / had</strong>.</p>
        </div>

        <p style="margin-bottom: 0.75rem; font-weight: 600">Look at these sentences from real life. The <strong>bold word</strong> is V3:</p>

        <div style="display: flex; flex-direction: column; gap: 0.55rem; margin: 0 0 1.25rem 0">
          <div style="padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; border-left: 3px solid #6a8d73">
            <em>She has <strong>worked</strong> at that clinic for five years.</em>
          </div>
          <div style="padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; border-left: 3px solid #6a8d73">
            <em>Have you ever <strong>used</strong> an app to study English?</em>
          </div>
          <div style="padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; border-left: 3px solid #6a8d73">
            <em>We have <strong>lived</strong> in this city since 2018.</em>
          </div>
          <div style="padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; border-left: 3px solid #6a8d73">
            <em>My brother has <strong>been</strong> a teacher for three years.</em>
          </div>
          <div style="padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; border-left: 3px solid #6a8d73">
            <em>She had already <strong>left</strong> when I arrived.</em>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(176,87,64,0.07); margin-bottom: 1rem">
          <p style="margin: 0 0 0.3rem 0; font-weight: 600; font-size: 0.95rem">The pattern:</p>
          <p style="margin: 0; font-size: 1.05rem"><em>have / has / had</em> &nbsp;+&nbsp; <strong>[V3]</strong></p>
          <p style="margin: 0.5rem 0 0; font-size: 0.88rem; color: var(--color-text-muted)">You will learn exactly what this means later in the course. For now, let your eyes recognize the pattern.</p>
        </div>
      `,
      exercises: [
        {
          id: "wbtr-v3-1",
          title: "Spot the V3",
          instructions: "Which word is V3? It always comes right after have / has / had.",
          items: [
            {
              type: "radio",
              label: "\"The landlord has ___ the heat.\" Which form fits after 'has'?",
              options: [
                { value: "fix", label: "fix" },
                { value: "fixing", label: "fixing" },
                { value: "fixed", label: "fixed" },
              ],
              expectedAnswer: "fixed",
            },
            {
              type: "radio",
              label: "\"I have ___ English for two years.\" Which form fits after 'have'?",
              options: [
                { value: "study", label: "study" },
                { value: "studying", label: "studying" },
                { value: "studied", label: "studied" },
              ],
              expectedAnswer: "studied",
            },
            {
              type: "radio",
              label: "\"Have you ever ___ a bus to East Boston?\" Which form fits after 'Have'?",
              options: [
                { value: "take", label: "take" },
                { value: "taking", label: "taking" },
                { value: "taken", label: "taken" },
              ],
              expectedAnswer: "taken",
            },
            {
              type: "text",
              label: "She has ___ at that clinic for five years. (work)",
              expectedAnswers: ["worked"],
            },
          ],
        },
        {
          id: "wbtr-v3-2",
          title: "Correct or not?",
          instructions: "Each sentence uses 'have/has + verb.' Is V3 used correctly?",
          items: [
            {
              type: "radio",
              label: "\"She has <strong>working</strong> here for a long time.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'worked' (V3), not 'working' (V1-ing)" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"They have <strong>lived</strong> in this building since 2020.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
      ],
      tipBox: {
        title: "Pattern to notice",
        content:
          "After have, has, or had, the verb is usually V3: worked, lived, taken, been. You will study this tense in depth later. For now, recognize the shape.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "wbtr-q1",
      question: "Your neighbor asks about your job, the one you go to every week. Which answer fits best?",
      options: [
        { value: "a", label: "I am working at a clinic on Meridian Street right now." },
        { value: "b", label: "I work at a clinic on Meridian Street." },
        { value: "c", label: "I worked at a clinic on Meridian Street last year." },
      ],
      correctAnswer: "b",
      explanation: "Present simple for jobs you do every week. \"Right now\" needs present continuous; \"last year\" needs past simple.",
      topic: "present-simple",
      skill: "usage",
      skillTag: "meaning-routine-vs-now",
      difficulty: "easy",
    },
    {
      id: "wbtr-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Right now, Yemi ___ the vocabulary app on his phone.\" (is/are/am + use)",
      correctAnswer: "is using",
      acceptedAnswers: ["Is using"],
      explanation: "Present continuous = am/is/are + verb-ing for actions happening right now.",
      topic: "present-continuous",
      skill: "usage",
      skillTag: "form-is-verb-ing",
      difficulty: "easy",
    },
    {
      id: "wbtr-q4",
      question: "You are telling a story: \"I was cooking dinner _____ my phone rang.\" Which word connects the two actions?",
      options: [
        { value: "a", label: "because" },
        { value: "b", label: "when" },
        { value: "c", label: "before" },
      ],
      correctAnswer: "b",
      explanation: "\"When\" connects a past continuous action (in progress) with a past simple interruption.",
      topic: "past-continuous",
      skill: "usage",
      skillTag: "meaning-interruption-when",
      difficulty: "medium",
    },
    {
      id: "wbtr-qws1",
      type: "word-scramble" as const,
      question: "Last night Rosa missed a call from her sister. She explains why. Put the words in order to build her sentence.",
      words: ["I", "was", "washing", "the", "dishes", "when", "you", "called"],
      correctAnswer: "I was washing the dishes when you called",
      hint: "Past continuous + when + past simple",
      explanation: "Past continuous (was washing) is the background action. Past simple (called) is the interruption.",
      topic: "past-continuous",
      skill: "usage",
      skillTag: "form-past-cont-interruption",
      difficulty: "medium",
    },
    {
      id: "wbtr-q8",
      question: "Someone at class says: \"I have worked at that restaurant for five years.\" What does this tell you?",
      options: [
        { value: "a", label: "She left the restaurant five years ago." },
        { value: "b", label: "She is still at the restaurant. The five years connects to now." },
        { value: "c", label: "She is starting a new job in five years." },
      ],
      correctAnswer: "b",
      explanation: "\"Have + V3\" connects a past action to the present moment. She is still there.",
      topic: "v3-preview",
      skill: "usage",
      skillTag: "meaning-present-perfect-preview",
      difficulty: "hard",
    },
  ],
};
