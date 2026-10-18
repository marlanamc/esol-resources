import type { InteractiveGuideContent } from "@/types/activity";
import { beUsedToGetUsedToImages as img } from "@/data/be-used-to-get-used-to-images.generated";
import { checklist, readingCard, timeline } from "@/content/grammar/_shared/guide-visuals";

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
      <img src="${scene.url}" srcset="${scene.url.replace("w=1200", "w=400")} 400w, ${scene.url.replace("w=1200", "w=800")} 800w, ${scene.url} 1200w" sizes="(max-width: 640px) 100vw, 800px" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover" />
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const beUsedToGetUsedToContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - I'm Used to Working Nights
    // =========================================================================
    {
      id: "used-to-working-nights",
      title: "I'm Used to Working Nights",
      icon: "🌙",
      tenseDiagram: {
        title: "Be used to: familiar now",
        elements: [
          { id: "but-present", type: "multiple-dots", zone: "present", position: 55, verbLabel: "am/is/are used to + -ing" },
        ],
      },
      explanation: `
        <p><strong>Bring back:</strong> Bring back W21: I used to work nights = a past habit. I am used to working nights = it feels familiar now. Notice that the to in be used to is followed by a noun or -ing.</p>

        ${sceneCard("sceneNightKitchen", "Restaurant kitchen, East Boston. A Tuesday in November, 11 PM.", "terracotta")}

        <p><strong>Fabienne</strong> moved to East Boston from Haiti last summer. She has two kids, and she works nights as a prep cook at a restaurant. Her supervisor <strong>Mark</strong> checks in before close.</p>

        ${dialogue([
          { speaker: "Mark", avatar: "🧑‍💼", text: "Long night again. How do you handle closing every Tuesday?", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "I'm <strong>used to finishing</strong> at midnight. The first month was hard.", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "🧑‍💼", text: "You're fast on the line now.", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "Yeah. I'm <strong>used to working</strong> nights. It feels normal.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Be used to + gerund</strong> = something feels familiar or normal <em>now</em>. Not the same as <strong>used to + verb</strong> from Week 21 (that was a past habit that changed).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("formula", "sage")}
            <span><strong>am / is / are + used to + verb-ing</strong> (or a noun)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("familiar now", "terracotta")}
            <span><em>I'm <strong>used to working</strong> nights.</em> (It feels normal now.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("with noun", "blue")}
            <span><em>She's <strong>used to the schedule</strong>.</em> (No -ing after a noun.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "What does be used to mean?",
          instructions: "Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "\"I'm used to working nights.\" What is true now?",
              options: [
                { value: "a", label: "Fabienne worked nights in the past but stopped." },
                { value: "b", label: "Working nights feels familiar to Fabienne now." },
                { value: "c", label: "Fabienne will start working nights next month." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the blank",
          instructions: "Write am, is, or are.",
          items: [
            {
              type: "text",
              label: "I ___ used to finishing at midnight.",
              expectedAnswers: ["am"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build a sentence about Fabienne's routine:",
              words: ["I'm", "used", "to", "sleeping", "in", "the", "afternoon"],
              correctAnswer: "I'm used to sleeping in the afternoon",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - I'm Not Used to the Cold Yet
    // =========================================================================
    {
      id: "not-used-to-cold",
      title: "I'm Not Used to the Cold Yet",
      icon: "❄️",
      explanation: `
        <p>It is January, and it is <strong>Fabienne</strong>'s first winter in Boston. After closing, she waits for the bus at 12:30 AM and makes a list on her phone. A checked box means she <strong>is used to</strong> it. An empty box means she is <strong>not used to</strong> it yet.</p>

        ${checklist({
          kicker: "Fabienne's first winter",
          title: "Used to it yet? (January)",
          items: [
            { text: "Working nights (since October)", done: true },
            { text: "Sleeping in the afternoon", done: true },
            { text: "Finishing at midnight", done: true },
            { text: "Waiting outside for the bus", done: false },
            { text: "Switching buses in the dark", done: false },
          ],
        })}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative:</strong> am / is / are + <strong>not</strong> + used to + gerund. Something still feels uncomfortable or unfamiliar <em>now</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("not yet", "blue")}
            <span><em>I'm <strong>not used to waiting</strong> in the cold.</em> (Still hard.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("past habit", "terracotta")}
            <span><em>I <strong>used to walk</strong> to work.</em> (Different grammar. Past only.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Read Fabienne's list",
          instructions: "Look at the checklist. Choose the sentence that is true.",
          items: [
            {
              type: "radio",
              label: "Which sentence is true in January?",
              options: [
                { value: "a", label: "Fabienne is used to waiting outside for the bus." },
                { value: "b", label: "Fabienne is not used to waiting outside for the bus yet." },
                { value: "c", label: "Fabienne is not used to sleeping in the afternoon." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "How many things on the list is Fabienne used to? Write a number.",
              expectedAnswers: ["3", "three"],
            },
            {
              type: "radio",
              label: "In Haiti, Fabienne walked to work every day. She does not do that now. Which sentence is correct?",
              options: [
                { value: "a", label: "I'm used to walk to work." },
                { value: "b", label: "I used to walk to work." },
                { value: "c", label: "I used to walking to work." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the blank",
          instructions: "Write the -ing form.",
          items: [
            {
              type: "text",
              label: "Fabienne is not used to ___ (ride) the bus at night.",
              expectedAnswers: ["riding"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I'm not used to wait outside this long.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"not used to waiting\" (-ing after be used to)." },
                { value: "c", label: "Error: should be \"didn't use to wait\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - I'm Getting Used to School Emails
    // =========================================================================
    {
      id: "getting-used-to-emails",
      title: "I'm Getting Used to School Emails",
      icon: "📱",
      tenseDiagram: {
        title: "Getting used to: still adapting",
        elements: [
          { id: "gut-line", type: "solid-line", zone: "present", position: 50, verbLabel: "getting used to + -ing" },
        ],
      },
      explanation: `
        <p>Here are <strong>Fabienne</strong>'s first six months in East Boston. Some things became normal. Some things are still changing. In February, her kids' school sends a health form on ParentSquare, and she reads it on her phone at the bus stop.</p>

        ${timeline({
          kicker: "Fabienne's first months",
          title: "From August to February",
          items: [
            { when: "Aug", text: "Fabienne moves to East Boston from Haiti.", accent: "terracotta" },
            { span: "2 months", accent: "terracotta" },
            { when: "Oct", text: "She starts her first night shift at the restaurant.", accent: "terracotta" },
            { span: "1 month", accent: "sage" },
            { when: "Nov", text: "She <strong>is used to finishing</strong> at midnight. It feels normal.", accent: "sage" },
            { span: "2 months", accent: "blue" },
            { when: "Jan", text: "First winter. She is <strong>not used to waiting</strong> outside for the bus.", accent: "blue" },
            { span: "1 month", accent: "amber" },
            { when: "Feb", text: "She reads some school emails twice. She is <strong>getting used to reading</strong> them in English.", accent: "amber" },
          ],
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Get used to + gerund</strong> = the process of adapting. It is getting easier, but you are not fully comfortable yet.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("in progress", "amber")}
            <span><em>I'm <strong>getting used to reading</strong> school emails.</em> (Still learning.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("familiar now", "sage")}
            <span><em>I'm <strong>used to checking</strong> my phone after work.</em> (Already normal.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Read the timeline",
          instructions: "Look at Fabienne's timeline. Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "Which sentence is true about February?",
              options: [
                { value: "a", label: "Fabienne is getting used to reading school emails." },
                { value: "b", label: "Fabienne is used to reading school emails and never reads them twice." },
                { value: "c", label: "Fabienne used to read school emails." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "How many months are there between her first night shift and January? Write a number.",
              expectedAnswers: ["3", "three"],
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Getting used to or be used to?",
          instructions: "Choose the best form for the meaning.",
          items: [
            {
              type: "radio",
              label: "Fabienne can write short notes to the teacher now, but she is still learning.",
              options: [
                { value: "a", label: "I'm getting used to writing notes to the teacher." },
                { value: "b", label: "I used to write notes to the teacher." },
                { value: "c", label: "I'm used to write notes to the teacher." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Fabienne packs the kids' lunches every night. That is normal for her now.",
              options: [
                { value: "a", label: "I'm getting used to packing lunches the night before." },
                { value: "b", label: "I'm used to packing lunches the night before." },
                { value: "c", label: "I used to pack lunches the night before." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Fill in the blank",
          instructions: "Write getting.",
          items: [
            {
              type: "text",
              label: "I'm ___ used to reading school emails in English.",
              expectedAnswers: ["getting"],
            },
          ],
        },
        {
          id: "s3-ex4",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Fabienne's sentence about the teacher:",
              words: ["I'm", "getting", "used", "to", "texting", "the", "teacher"],
              correctAnswer: "I'm getting used to texting the teacher",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - Three "Used To" Patterns
    // =========================================================================
    {
      id: "three-patterns",
      title: "Three \"Used To\" Patterns: Don't Mix Them Up",
      icon: "⚠️",
      tenseDiagram: {
        title: "Three different meanings",
        elements: [
          { id: "ut-past", type: "multiple-dots", zone: "past", position: 30, verbLabel: "used to + verb (past habit)" },
          { id: "but-present", type: "multiple-dots", zone: "present", position: 55, verbLabel: "be used to + -ing (familiar now)" },
          { id: "gut-progress", type: "solid-line", zone: "present", position: 70, verbLabel: "getting used to + -ing" },
        ],
      },
      explanation: `
        <p>May is Asian American and Pacific Islander Heritage Month. Many adult learners know a story like Fabienne's: a new country, a new language, a new life. Read about Mazie Hirono. The bold words are a <strong>past situation</strong>.</p>

        ${readingCard({
          kicker: "Asian American and Pacific Islander Heritage Month",
          title: "Mazie Hirono: From a Rice Farm to the Senate",
          paragraphs: [
            "Mazie Hirono <strong>used to live</strong> in Fukushima, Japan. Her early childhood was spent on her grandparents' rice farm. When she was nearly eight years old, she, her mother, and her brother crossed the Pacific by ship and came to Hawaii.",
            "When she began elementary school, she neither spoke nor read English. She studied in Hawaii's public schools, went to the University of Hawaii, and later went to law school at Georgetown. In 2013, she was sworn in as a U.S. senator. She became the first Asian American woman in the Senate.",
          ],
          photo: {
            url: "/images/guide-people/mazie-hirono.jpg",
            alt: "Official Senate portrait of Mazie Hirono, smiling in a red jacket in front of bookshelves",
            credit: "U.S. Senate, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Mazie_Hirono,_official_portrait,_113th_Congress_(cropped).jpg",
          },
          sources: [
            { name: "Senator Hirono's official biography", url: "https://www.hirono.senate.gov/about" },
          ],
          accent: "amber",
        })}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>used to + verb</strong> = past habit, not true now.<br/>
            <strong>be used to + -ing</strong> = familiar now.<br/>
            <strong>get used to + -ing</strong> = still adapting.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past", "terracotta")}
            <span><em>Fabienne <strong>used to sleep</strong> at night.</em> (Not now. She works nights.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("familiar", "sage")}
            <span><em>She's <strong>used to working</strong> nights.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adapting", "blue")}
            <span><em>She's <strong>getting used to reading</strong> school emails.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Read about Mazie Hirono",
          instructions: "Look at the reading. Answer the questions.",
          items: [
            {
              type: "radio",
              label: "Which sentence is correct? Mazie Hirono does not live in Japan now.",
              options: [
                { value: "a", label: "She used to live in Japan." },
                { value: "b", label: "She is used to live in Japan." },
                { value: "c", label: "She used to living in Japan." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "How old was Mazie when her family came to Hawaii? She was nearly ___ years old. Write a number.",
              expectedAnswers: ["8", "eight"],
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Pick the right pattern",
          instructions: "Choose the sentence that matches the meaning.",
          items: [
            {
              type: "radio",
              label: "Before Fabienne moved to the night shift, she slept at night. Not anymore.",
              options: [
                { value: "a", label: "She used to sleep at night." },
                { value: "b", label: "She is used to sleep at night." },
                { value: "c", label: "She is getting used to sleep at night." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Fabienne works nights. That feels normal to her.",
              options: [
                { value: "a", label: "She used to working nights." },
                { value: "b", label: "She is used to working nights." },
                { value: "c", label: "She is getting used to work nights." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Fabienne reads some school emails twice. She is still learning.",
              options: [
                { value: "a", label: "She is used to reading school emails already." },
                { value: "b", label: "She is getting used to reading school emails." },
                { value: "c", label: "She used to reading school emails." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I'm used to wake up at 3 PM.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to waking up\" (-ing after be used to)." },
                { value: "c", label: "Error: should be \"used to wake up\" (past habit)." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex4",
          title: "Fill in the blank",
          instructions: "Write used, used to, or getting.",
          items: [
            {
              type: "text",
              label: "Fabienne ___ to sleep at night, but now she sleeps in the afternoon. (past habit)",
              expectedAnswers: ["used"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - Still Adjusting: One Hard Week
    // =========================================================================
    {
      id: "still-adjusting",
      title: "Still Adjusting: One Hard Week",
      icon: "📅",
      explanation: `
        ${sceneCard("sceneWorkText", "Restaurant break room. A Wednesday in March, 4 PM.", "sage")}

        <p>It has been a hard week for <strong>Fabienne</strong>: double shifts, English school emails, and now she needs Friday off for a parent-teacher meeting. Before her shift starts, she finds her supervisor <strong>Mark</strong> in the break room.</p>

        ${dialogue([
          { speaker: "Fabienne", avatar: "👩🏾", text: "Hi Mark. Can I take Friday off? I have a parent-teacher meeting at 10.", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "🧑‍💼", text: "Let me check the schedule. How are you holding up?", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "Tired. I’m still <strong>getting used to</strong> the double shifts. Could I make up the hours on Saturday?", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "🧑‍💼", text: "OK, Friday's yours. Can you work Saturday, 4 to midnight?", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "Yes. I'm <strong>used to working</strong> late. Thank you, Mark!", side: "right", tone: "terracotta" },
        ])}
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, would rather, and extra practice with all three \"used to\" patterns, open the <a href=\"/grammar-reader/used-to-would-rather\" style=\"font-weight:700;text-decoration:underline\">Used to / Would rather Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right pattern",
          instructions: "Match the meaning in Fabienne's week.",
          items: [
            {
              type: "radio",
              label: "Before she moved, Fabienne always slept before midnight. Not now.",
              options: [
                { value: "a", label: "I used to sleep before midnight." },
                { value: "b", label: "I'm used to sleeping before midnight." },
                { value: "c", label: "I'm getting used to sleeping before midnight." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Closing the restaurant at midnight feels normal to Fabienne now.",
              options: [
                { value: "a", label: "I'm used to closing the restaurant at midnight." },
                { value: "b", label: "I used to closing the restaurant at midnight." },
                { value: "c", label: "I'm getting used to close the restaurant at midnight." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "School emails in English are still hard, but improving.",
              options: [
                { value: "a", label: "I'm not used to reading every school email yet." },
                { value: "b", label: "I used to read every school email." },
                { value: "c", label: "I'm used to read every school email." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Winter nights are still new, but getting easier.",
              options: [
                { value: "a", label: "I'm getting used to the winter nights." },
                { value: "b", label: "I'm used to the winter nights already." },
                { value: "c", label: "I used to the winter nights." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Fill in the blank",
          instructions: "Write getting or used.",
          items: [
            {
              type: "text",
              label: "I'm ___ used to the double shifts. (still adapting)",
              expectedAnswers: ["getting"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Fabienne's sentence about Saturday:",
              words: ["I'm", "used", "to", "working", "on", "Saturdays"],
              correctAnswer: "I'm used to working on Saturdays",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I'm used to sleep in the afternoon.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to sleeping\" (-ing after be used to)." },
                { value: "c", label: "Error: should be \"used to sleep\" (past habit)." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "but-q2",
      question: "Fabienne eats dinner at 1 AM after her shift every night. Which sentence is correct?",
      options: [
        { value: "a", label: "I'm used to eat dinner very late." },
        { value: "b", label: "I'm used to eating dinner very late." },
        { value: "c", label: "I used to eating dinner very late." },
      ],
      correctAnswer: "b",
      explanation: "Be used to needs a gerund: eating, not eat.",
      topic: "be-used-to",
      skill: "usage",
      skillTag: "gerund-after-be-used-to",
      difficulty: "easy",
    },
    {
      id: "but-q4",
      question: "What does \"getting used to\" mean?",
      options: [
        { value: "a", label: "Already fully comfortable" },
        { value: "b", label: "Still adapting, but it is getting easier" },
        { value: "c", label: "A habit from the past that ended" },
      ],
      correctAnswer: "b",
      explanation: "Getting used to shows the process of becoming accustomed.",
      topic: "get-used-to",
      skill: "usage",
      skillTag: "meaning-adapting",
      difficulty: "easy",
    },
    {
      id: "but-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I'm not used to ___ outside in January.\" (Fabienne still finds the cold bus stop hard.)",
      correctAnswer: "waiting",
      explanation: "After be used to (or not used to), use a gerund: waiting.",
      topic: "be-used-to",
      skill: "usage",
      skillTag: "negative-not-used-to",
      difficulty: "easy",
    },
    {
      id: "but-q7",
      question: "Find the error: \"She is used to work nights.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be \"used to working\" (-ing after be used to)." },
        { value: "c", label: "Error: should be \"used to work\" as a past habit." },
      ],
      correctAnswer: "b",
      explanation: "After be used to, use a gerund: working.",
      topic: "be-used-to",
      skill: "error-detection",
      skillTag: "error-base-verb-after-be-used-to",
      difficulty: "medium",
    },
    {
      id: "but-ws1",
      type: "word-scramble" as const,
      question: "Mark describes Fabienne's routine. Put the words in order.",
      words: ["She", "is", "used", "to", "working", "nights"],
      correctAnswer: "She is used to working nights",
      hint: "be used to + gerund",
      explanation: "Be used to + gerund (working) means it feels familiar or normal now.",
      topic: "be-used-to",
      skill: "usage",
      skillTag: "be-used-to-word-order",
      difficulty: "medium",
    },
  ],
};
