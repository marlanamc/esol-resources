import type { InteractiveGuideContent } from "@/types/activity";
import { thirdConditionalWhatWouldHaveHappenedImages as img } from "@/data/third-conditional-what-would-have-happened-images.generated";

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

export const thirdConditionalWhatWouldHaveHappenedContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - I Should Have Called Sooner
    // =========================================================================
    {
      id: "called-sooner",
      title: "I Should Have Called Sooner",
      icon: "🏥",
      tenseDiagram: {
        title: "Third conditional: a different past that did not happen",
        elements: [
          { id: "tc-if", type: "arc", zone: "past-earlier", position: 30, verbLabel: "if + had + V3 (missed action)" },
          { id: "tc-result", type: "single-dot", zone: "past-later", position: 65, verbLabel: "would have + V3 (different result)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneClinicWaiting", "Walk-in clinic, East Boston. Saturday, 7:30 AM.", "sage")}

        <p>Yemi works as a packer at a warehouse in Chelsea. Three weeks ago she hurt her knee lifting a pallet. She kept working double shifts instead of resting. Now the pain is much worse, and she finally came to the clinic.</p>

        ${dialogue([
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "How long has your knee been hurting?", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "About three weeks. I know I waited too long.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "If I <strong>had come</strong> sooner, it <strong>wouldn't hurt</strong> this much.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "Let's take a look. You're here now. That's what matters.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Third conditional</strong> = you talk about a past choice and a different past result that did <em>not</em> happen. You cannot change it now, but you can say what would have been different.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("did not happen", "blue")}
            <span><em>If I <strong>had come</strong> sooner, it <strong>wouldn't hurt</strong> this much.</em> (She did not come sooner. It does hurt.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past regret", "terracotta")}
            <span><em>If I <strong>had rested</strong> my knee, I <strong>would have kept</strong> working normal shifts.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "What does this sentence mean?",
          instructions: "Choose the best meaning.",
          items: [
            {
              type: "radio",
              label: "\"If I had come sooner, it wouldn't hurt this much.\" What is true?",
              options: [
                { value: "a", label: "Yemi came sooner and her knee is fine." },
                { value: "b", label: "Yemi did not come sooner, and her knee hurts a lot now." },
                { value: "c", label: "Yemi will come to the clinic tomorrow." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "If I ___ rested my knee, it would have healed faster.",
              expectedAnswers: ["had"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "I", "had", "taken", "the", "medicine,", "I", "would", "feel", "better", "now"],
              correctAnswer: "If I had taken the medicine, I would feel better now",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - Building the Sentence
    // =========================================================================
    {
      id: "building-sentence",
      title: "Building the Sentence",
      icon: "✏️",
      tenseDiagram: {
        title: "The third conditional formula",
        elements: [
          { id: "tc-had", type: "arc", zone: "past-earlier", position: 28, verbLabel: "if + had + V3" },
          { id: "tc-would-have", type: "single-dot", zone: "past-later", position: 68, verbLabel: "would have + V3" },
        ],
      },
      explanation: `
        ${sceneCard("sceneWritingNotes", "Yemi's kitchen table. Saturday afternoon.", "terracotta")}

        <p>After the clinic visit, Yemi writes notes for herself. She texts her coworker Jennifer what she wishes she had done last month.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👩🏿", text: "If I <strong>had called</strong> the clinic three weeks ago, they <strong>would have told</strong> me to rest.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "Yeah. If you <strong>had iced</strong> it every night, it <strong>would have gotten</strong> better.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "I know. I <strong>would have saved</strong> money too.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>If + had + past participle, would have + past participle</strong>. The word <strong>had</strong> is required in the if-clause. Do not skip it.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("if-clause", "terracotta")}
            <span><em>If I <strong>had called</strong> the clinic...</em> (call → called is wrong here; use <strong>had called</strong>)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("result", "blue")}
            <span><em>...they <strong>would have told</strong> me to rest.</em> (tell → told = past participle after would have)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("formula", "sage")}
            <span><strong>If + had + V3, would have + V3</strong></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Choose the correct form",
          instructions: "Pick the correct third conditional sentence.",
          items: [
            {
              type: "radio",
              label: "Yemi did not call the clinic three weeks ago. Which sentence is correct?",
              options: [
                { value: "a", label: "If I called the clinic, they would have told me to rest." },
                { value: "b", label: "If I had called the clinic, they would have told me to rest." },
                { value: "c", label: "If I had called the clinic, they would tell me to rest." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Yemi did not ice her knee. Which sentence is correct?",
              options: [
                { value: "a", label: "If I had iced it, it would have gotten better." },
                { value: "b", label: "If I iced it, it would have gotten better." },
                { value: "c", label: "If I had ice it, it would have gotten better." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the blank",
          instructions: "Write would have.",
          items: [
            {
              type: "text",
              label: "If I had rested my knee, I ___ have kept working normal shifts.",
              expectedAnswers: ["would"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"If I called the clinic last week, I would have saved three shifts.\" What is wrong?",
              options: [
                { value: "a", label: "No error. The sentence is correct." },
                { value: "b", label: "Error: should be \"If I had called\" (missing had)." },
                { value: "c", label: "Error: should be \"I would save\" not \"would have saved\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - Three Shifts and a Bigger Bill
    // =========================================================================
    {
      id: "shifts-and-bill",
      title: "Three Shifts and a Bigger Bill",
      icon: "💸",
      explanation: `
        ${sceneCard("sceneBreakRoom", "Warehouse break room. Monday morning.", "blue")}

        <p>Because Yemi waited, her knee got worse. She missed three shifts last week. The clinic visit cost more than she expected.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏻", text: "How much did you lose from missing those shifts?", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Almost $400. If I <strong>had gone</strong> to the clinic sooner, I <strong>wouldn't have missed</strong> three shifts.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "And the bill?", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Eighty dollars. If I <strong>had rested</strong> when it started, I <strong>wouldn't have paid</strong> this much.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "You <strong>could have called</strong> the nurse line. It might have been free.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Negative results: <strong>wouldn't have + past participle</strong>. You can also use <strong>could have</strong> or <strong>might have</strong> for a less certain result.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>If I <strong>had gone</strong> sooner, I <strong>wouldn't have missed</strong> three shifts.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("could have", "blue")}
            <span><em>You <strong>could have called</strong> the nurse line.</em> (possible, but you did not)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Complete the negative sentence",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "Yemi missed three shifts. \"If I had gone to the clinic sooner, I ___ three shifts.\"",
              options: [
                { value: "a", label: "wouldn't miss" },
                { value: "b", label: "wouldn't have missed" },
                { value: "c", label: "won't have missed" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The copay was $80. \"If I had rested early, I ___ this much.\"",
              options: [
                { value: "a", label: "wouldn't have paid" },
                { value: "b", label: "wouldn't pay" },
                { value: "c", label: "didn't pay" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the blank",
          instructions: "Write wouldn't have.",
          items: [
            {
              type: "text",
              label: "If I had called the nurse line, I ___ have paid $80 at the clinic.",
              expectedAnswers: ["wouldn't"],
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "I", "had", "rested", "my", "knee,", "I", "wouldn't", "have", "missed", "three", "shifts"],
              correctAnswer: "If I had rested my knee, I wouldn't have missed three shifts",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - Second vs. Third
    // =========================================================================
    {
      id: "second-vs-third",
      title: "Imaginary Now vs. Imaginary Past",
      icon: "🔄",
      tenseDiagram: {
        title: "Second conditional (imaginary now) vs. third conditional (past regret)",
        elements: [
          { id: "second-cond", type: "single-dot", zone: "past", position: 35, verbLabel: "Second: would (imaginary now)" },
          { id: "third-had", type: "arc", zone: "past-earlier", position: 28, verbLabel: "Third: if + had + V3" },
          { id: "third-result", type: "single-dot", zone: "past-later", position: 68, verbLabel: "Third: would have + V3" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBreakRoomTalk", "Warehouse break room. Tuesday lunch.", "amber")}

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏻", text: "If I <strong>called</strong> the clinic right now, they <strong>would help</strong> me figure out the bill.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "That's second conditional. Imaginary, but possible.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "But if I <strong>had called</strong> <em>last month</em>, I <strong>would have saved</strong> three shifts. That's third. The past is done.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "Right. <strong>Would</strong> = now or future. <strong>Would have</strong> = a different past.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Second conditional:</strong> If + past simple, would + base verb. Imaginary <em>now</em>.<br/>
            <strong>Third conditional:</strong> If + had + V3, would have + V3. Imaginary <em>past</em>.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("second (now)", "amber")}
            <span><em>If I <strong>called</strong> the clinic now, they <strong>would help</strong> me.</em> (Still possible.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("third (past)", "blue")}
            <span><em>If I <strong>had called</strong> last month, I <strong>would have saved</strong> three shifts.</em> (Too late.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Second or third?",
          instructions: "Choose the correct conditional based on the situation.",
          items: [
            {
              type: "radio",
              label: "Jennifer can still call the clinic today about the bill. \"If I ___ the clinic, they would help me.\"",
              options: [
                { value: "a", label: "called (second conditional, still possible)" },
                { value: "b", label: "had called (third conditional, past only)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Yemi missed three shifts last month. That cannot change. \"If I ___ sooner, I would have saved three shifts.\"",
              options: [
                { value: "a", label: "went (second conditional)" },
                { value: "b", label: "had gone (third conditional)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"If I called last month, I would have saved three shifts.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'had called' for a past regret" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Fill in the blank",
          instructions: "Write would or would have.",
          items: [
            {
              type: "text",
              label: "If I called the clinic now, they ___ help me. (imaginary now)",
              expectedAnswers: ["would"],
            },
            {
              type: "text",
              label: "If I had rested last month, I ___ have saved $400. (past regret)",
              expectedAnswers: ["would"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - One Whole Story
    // =========================================================================
    {
      id: "whole-story",
      title: "What Would Have Happened? One Whole Story",
      icon: "🦺",
      explanation: `
        ${sceneCard("sceneConstructionLocker", "Construction site locker room. Wednesday, April 28.", "terracotta")}

        <p>Yemi's cousin Hector works construction in East Boston. A workplace safety poster is on the locker room wall.</p>

        ${dialogue([
          { speaker: "Hector", avatar: "👨🏽", text: "The poster says: if the site <strong>had followed</strong> the safety rules, that worker <strong>wouldn't have been</strong> injured.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Same idea with my knee. If I <strong>had rested</strong> when it started, I <strong>wouldn't have missed</strong> three shifts.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "And if you <strong>called</strong> the nurse line now, they <strong>would tell</strong> you what to do next. That's still possible.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "You're right. I can't change last month. But I can call today.", side: "right", tone: "terracotta" },
        ])}

        <p>Third conditional for past regrets. Second conditional when you can still act.</p>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, all four conditionals side by side, and extra practice, open the <a href=\"/grammar-reader/conditionals-second-third\" style=\"font-weight:700;text-decoration:underline\">Second and Third Conditionals Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right pattern",
          instructions: "Statement, negative, or second vs. third?",
          items: [
            {
              type: "radio",
              label: "Yemi did not rest her knee three weeks ago.",
              options: [
                { value: "a", label: "If I had rested my knee, it would have healed faster." },
                { value: "b", label: "If I rested my knee, it would heal faster." },
                { value: "c", label: "If I rest my knee, it will heal faster." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Workplace safety poster about a past accident.",
              options: [
                { value: "a", label: "If the site followed the rules, he isn't injured." },
                { value: "b", label: "If the site had followed the rules, he wouldn't have been injured." },
                { value: "c", label: "If the site had followed the rules, he wouldn't be injured." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Fill in the blank",
          instructions: "Write had or would.",
          items: [
            {
              type: "text",
              label: "If I ___ called the clinic last month, I would have saved three shifts.",
              expectedAnswers: ["had"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "the", "site", "had", "followed", "the", "rules,", "he", "wouldn't", "have", "been", "injured"],
              correctAnswer: "If the site had followed the rules, he wouldn't have been injured",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Yemi says: \"If I had called last month, I would save three shifts.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"would have saved\" (past result needs would have + V3)." },
                { value: "c", label: "Error: should be \"If I called\" without had." },
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
      id: "tc-q1",
      question: "Yemi did not stretch before her shift. Now her back hurts. Which sentence matches her situation?",
      options: [
        { value: "a", label: "If I stretch before work, my back won't hurt." },
        { value: "b", label: "If I had stretched before work, my back wouldn't hurt this much." },
        { value: "c", label: "If I stretched before work, my back wouldn't hurt." },
      ],
      correctAnswer: "b",
      explanation: "Third conditional uses if + had + V3 for a past action that did not happen.",
      topic: "third-conditional",
      skill: "usage",
      skillTag: "meaning-past-regret",
      difficulty: "easy",
    },
    {
      id: "tc-q2",
      question: "Which sentence is a correct third conditional?",
      options: [
        { value: "a", label: "If Marco saved more, he will have bought the car." },
        { value: "b", label: "If Marco had saved more, he would have bought the car." },
        { value: "c", label: "If Marco has saved more, he would buy the car." },
      ],
      correctAnswer: "b",
      explanation: "Third conditional: if + had + V3, would have + V3.",
      topic: "third-conditional",
      skill: "usage",
      skillTag: "formula-third-conditional",
      difficulty: "easy",
    },
    {
      id: "tc-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"If I had rested my knee, I ___ $80.\" (a different past result — it didn't happen)",
      correctAnswer: "wouldn't have paid",
      acceptedAnswers: ["would not have paid"],
      explanation: "A past result that did not happen uses wouldn't have + past participle.",
      topic: "third-conditional",
      skill: "usage",
      skillTag: "negative-past-result",
      difficulty: "medium",
    },
    {
      id: "tc-q6",
      question: "Find the error: \"If I called the clinic last week, I would have saved three shifts.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be \"If I had called\" (missing had)." },
        { value: "c", label: "Error: should be \"I would save\" not \"would have saved\"." },
      ],
      correctAnswer: "b",
      explanation: "Last week is in the past. The if-clause needs had + past participle.",
      topic: "third-conditional",
      skill: "error-detection",
      skillTag: "error-missing-had",
      difficulty: "medium",
    },
    {
      id: "tc-ws1",
      type: "word-scramble" as const,
      question: "Rosa regrets waiting to call the landlord about the rent. Put the words in order.",
      words: ["If", "I", "had", "gone", "sooner", "I", "would", "have", "paid", "less"],
      correctAnswer: "If I had gone sooner I would have paid less",
      hint: "if + had + past participle, would have + past participle",
      explanation: "Third conditional: if + had gone (past), would have paid (past result that didn't happen).",
      topic: "third-conditional",
      skill: "usage",
      skillTag: "third-conditional-word-order",
      difficulty: "medium",
    },
  ],
};
