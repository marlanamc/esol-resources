import type { InteractiveGuideContent } from "@/types/activity";
import { beUsedToGetUsedToImages as img } from "@/data/be-used-to-get-used-to-images.generated";

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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

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
        ${sceneCard("sceneNightKitchen", "Restaurant kitchen, East Boston. Tuesday, 11 PM.", "terracotta")}

        <p><strong>Rafael</strong> has worked as a line cook for two years. His shift supervisor <strong>Jennifer</strong> checks in before close.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏼", text: "Long night again. How do you handle closing every Tuesday?", side: "left", tone: "sage" },
          { speaker: "Rafael", avatar: "👨🏽", text: "I'm <strong>used to finishing</strong> at midnight. The first month was hard.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏼", text: "You're fast on the line now.", side: "left", tone: "sage" },
          { speaker: "Rafael", avatar: "👨🏽", text: "Yeah. I'm <strong>used to working</strong> nights. It feels normal.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Be used to + gerund</strong> = something feels familiar or normal <em>now</em>. Not the same as <strong>used to + verb</strong> from last week (that was a past habit that changed).</p>
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
                { value: "a", label: "Rafael worked nights in the past but stopped." },
                { value: "b", label: "Working nights feels familiar to Rafael now." },
                { value: "c", label: "Rafael will start working nights next month." },
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
              label: "Build a sentence about Rafael's routine:",
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
        ${sceneCard("sceneWinterBus", "Bus stop near Maverick Square. A Wednesday in January, 5:30 AM.", "blue")}

        <p><strong>Priya</strong> is a home health aide. She waits with her classmate <strong>Angelo</strong> for her first transfer. It is Priya's first winter in Boston, and the wind is sharp.</p>

        ${dialogue([
          { speaker: "Priya", avatar: "👩🏽", text: "I'm <strong>not used to waiting</strong> outside this long. My hands are freezing.", side: "right", tone: "terracotta" },
          { speaker: "Angelo", avatar: "👨🏻", text: "Same. I moved here in August. This is my first winter.", side: "left", tone: "sage" },
          { speaker: "Priya", avatar: "👩🏽", text: "I'm also <strong>not used to switching</strong> buses in the dark. Back home I walked to work.", side: "right", tone: "terracotta" },
          { speaker: "Angelo", avatar: "👨🏻", text: "Me too. I <strong>used to walk</strong> everywhere. Let’s wait inside until the bus is closer.", side: "left", tone: "blue" },
        ])}

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
          title: "Choose the correct negative",
          instructions: "Pick the correct form.",
          items: [
            {
              type: "radio",
              label: "Priya still finds the cold hard. Which sentence is correct?",
              options: [
                { value: "a", label: "I'm not used to wait outside in January." },
                { value: "b", label: "I'm not used to waiting outside in January." },
                { value: "c", label: "I didn't use to waiting outside in January." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Angelo walked everywhere back home, even to the market. Which sentence is correct?",
              options: [
                { value: "a", label: "I'm used to walk to the market every day." },
                { value: "b", label: "I used to walk to the market every day." },
                { value: "c", label: "I used to walking to the market every day." },
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
              label: "I'm not used to ___ (switch) buses in the dark.",
              expectedAnswers: ["switching"],
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
        ${sceneCard("sceneSchoolPhone", "Bus stop after a double shift. Thursday, 6:45 PM.", "sage")}

        <p><strong>Fabienne</strong> packs boxes at a warehouse in Chelsea. After her second shift, she checks ParentSquare on her phone. Her kids’ school sent a health form, and she is still learning to read the notices in English. She texts her classmate <strong>Nadine</strong>.</p>

        ${dialogue([
          { speaker: "Fabienne", avatar: "👩🏾", text: "I'm <strong>getting used to reading</strong> school emails in English.", side: "right", tone: "terracotta" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "I still have to read some of them twice, especially the ones about school health forms.", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏿", text: "Same here. I’m <strong>getting used to</strong> the vocabulary, but I still ask the teacher when I’m not sure.", side: "left", tone: "sage" },
        ])}

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
          id: "s3-ex2",
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
          id: "s3-ex3",
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
        ${sceneCard("sceneChurch", "Haitian church, East Boston. Sunday, 9 AM.", "amber")}

        <p><strong>Frantz</strong> sits with his friend <strong>Claudette</strong> after service. They are figuring out which service fits around their work schedules.</p>

        ${dialogue([
          { speaker: "Frantz", avatar: "👨🏾", text: "I’m <strong>getting used to</strong> the early service here. Can you come next Sunday?", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I’ll try. I’m <strong>used to working</strong> two jobs, but Saturday nights end late. Getting up is hard.", side: "left", tone: "sage" },
          { speaker: "Frantz", avatar: "👨🏾", text: "I know. I <strong>used to work</strong> only days. Now I work nights too. We could try a later service.", side: "right", tone: "terracotta" },
        ])}

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
            <span><em>I <strong>used to work</strong> only days.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("familiar", "sage")}
            <span><em>She's <strong>used to working</strong> two jobs.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adapting", "blue")}
            <span><em>I'm <strong>getting used to</strong> the Creole hymns.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Pick the right pattern",
          instructions: "Choose the sentence that matches the meaning.",
          items: [
            {
              type: "radio",
              label: "Frantz worked only days before, so his nights were free. Not anymore.",
              options: [
                { value: "a", label: "I used to have my nights free." },
                { value: "b", label: "I'm used to have my nights free." },
                { value: "c", label: "I'm getting used to have my nights free." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Claudette has two jobs. That feels normal to her.",
              options: [
                { value: "a", label: "She used to working two jobs." },
                { value: "b", label: "She is used to working two jobs." },
                { value: "c", label: "She is getting used to work two jobs." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Frantz is new to the early service. He is still learning the hymns.",
              options: [
                { value: "a", label: "He is used to the Creole hymns already." },
                { value: "b", label: "He is getting used to the Creole hymns." },
                { value: "c", label: "He used to the Creole hymns." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"She is used to work two jobs.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to working\" (-ing after be used to)." },
                { value: "c", label: "Error: should be \"used to work\" (past habit)." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Fill in the blank",
          instructions: "Write used, used to, or getting.",
          items: [
            {
              type: "text",
              label: "I ___ to work only days, but now I work nights too. (past habit)",
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
        ${sceneCard("sceneWorkText", "Warehouse break room. Wednesday, 2 PM.", "sage")}

        <p>It has been a hard week for <strong>Fabienne</strong>: double shifts, English school emails, and now she needs Friday off for a parent-teacher meeting. On her break, she finds her supervisor <strong>Mark</strong>.</p>

        ${dialogue([
          { speaker: "Fabienne", avatar: "👩🏾", text: "Hi Mark. Can I take Friday off? I have a parent-teacher meeting at 10.", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "🧑‍💼", text: "Let me check the schedule. How are you holding up?", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "Tired. I’m still <strong>getting used to</strong> the double shifts. Could I make up the hours on Saturday?", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "🧑‍💼", text: "OK, Friday's yours. Can you do Saturday, 6 to 2?", side: "left", tone: "sage" },
          { speaker: "Fabienne", avatar: "👩🏾", text: "Yes. I'm <strong>used to getting</strong> up early. Thank you, Mark!", side: "right", tone: "terracotta" },
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
              label: "The early bus feels normal to Fabienne now.",
              options: [
                { value: "a", label: "I'm used to taking the early bus." },
                { value: "b", label: "I used to taking the early bus." },
                { value: "c", label: "I'm getting used to take the early bus." },
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
              label: "Winter mornings are still new, but getting easier.",
              options: [
                { value: "a", label: "I'm getting used to the winter mornings." },
                { value: "b", label: "I'm used to the winter mornings already." },
                { value: "c", label: "I used to the winter mornings." },
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
              label: "\"I'm used to wake up at 4 for the bus.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to waking up\" (-ing after be used to)." },
                { value: "c", label: "Error: should be \"used to wake\" (past habit)." },
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
      question: "Rafael eats dinner at 1 AM after his shift every night. Which sentence is correct?",
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
      question: "Fill in the blank: \"I'm not used to ___ outside in January.\" (Priya still finds the cold bus stop hard.)",
      correctAnswer: "waiting",
      explanation: "After be used to (or not used to), use a gerund: waiting.",
      topic: "be-used-to",
      skill: "usage",
      skillTag: "negative-not-used-to",
      difficulty: "easy",
    },
    {
      id: "but-q7",
      question: "Find the error: \"She is used to work two jobs.\"",
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
      question: "Frantz describes his friend Claudette's routine. Put the words in order.",
      words: ["She", "is", "used", "to", "working", "two", "jobs"],
      correctAnswer: "She is used to working two jobs",
      hint: "be used to + gerund",
      explanation: "Be used to + gerund (working) means it feels familiar or normal now.",
      topic: "be-used-to",
      skill: "usage",
      skillTag: "be-used-to-word-order",
      difficulty: "medium",
    },
  ],
};
