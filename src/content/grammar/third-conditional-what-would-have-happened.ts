import type { InteractiveGuideContent } from "@/types/activity";
import { checklist, readingCard } from "@/content/grammar/_shared/guide-visuals";
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

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

        <p>Yemi works as a packer at a warehouse in Chelsea. Three weeks ago she hurt her knee lifting a pallet. She kept working double shifts instead of resting. Now the pain is much worse, and she finally came to the clinic. Ms. Patel is the nurse practitioner.</p>

        ${dialogue([
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "How long has your knee been hurting?", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "About three weeks. I know I waited too long.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "If I <strong>had come</strong> sooner, maybe I <strong>wouldn’t have missed</strong> so much work.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "Let's take a look. Can you bend it for me?", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Third conditional</strong> = you talk about a past choice and a different past result that did <em>not</em> happen. You cannot change it now, but you can say what would have been different.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("did not happen", "blue")}
            <span><em>If I <strong>had come</strong> sooner, I <strong>wouldn't have missed</strong> so much work.</em> (She did not come sooner. She missed work.)</span>
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
              label: "\"If I had come sooner, I wouldn't have missed so much work.\" What is true?",
              options: [
                { value: "a", label: "Yemi came sooner and didn't miss any work." },
                { value: "b", label: "Yemi did not come sooner, and she missed a lot of work." },
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
        <p>On Saturday afternoon, Yemi sits at her kitchen table and makes a list. The list shows four things she did <em>not</em> do in the last three weeks. Every box is empty.</p>

        ${checklist({
          kicker: "Yemi's list",
          title: "Things I did NOT do",
          items: [
            { text: "Rest my knee", done: false },
            { text: "Ice it every night", done: false },
            { text: "Call the clinic", done: false },
            { text: "Take a day off work", done: false },
          ],
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>If + had + past participle, would have + past participle</strong>. The word <strong>had</strong> is required in the if-clause. Do not skip it.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("if-clause", "terracotta")}
            <span><em>If I <strong>had called</strong> the clinic...</em> (not "If I called")</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("result", "blue")}
            <span><em>...they <strong>would have told</strong> me to rest.</em> (tell → told = past participle)</span>
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
          title: "Look at Yemi's list",
          instructions: "Read the list, then answer.",
          items: [
            {
              type: "text",
              label: "How many boxes on Yemi's list are checked?",
              expectedAnswers: ["0", "zero", "none"],
            },
            {
              type: "radio",
              label: "Look at the list. Yemi did not ice her knee. Which sentence is correct?",
              options: [
                { value: "a", label: "If I iced it every night, it might have gotten better." },
                { value: "b", label: "If I had iced it every night, it might have gotten better." },
                { value: "c", label: "If I had ice it every night, it might have gotten better." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Use the list",
          instructions: "Look at the third box. Write two words.",
          items: [
            {
              type: "text",
              label: "If I ___ the clinic, they would have told me to rest. (call)",
              expectedAnswers: ["had called"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"If I called the clinic last week, I wouldn't have missed three shifts.\" What is wrong?",
              options: [
                { value: "a", label: "No error. The sentence is correct." },
                { value: "b", label: "Error: should be \"If I had called\" (missing had)." },
                { value: "c", label: "Error: should be \"I wouldn't miss\" not \"wouldn't have missed\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex4",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "I", "had", "taken", "a", "day", "off,", "my", "knee", "would", "have", "felt", "better"],
              correctAnswer: "If I had taken a day off, my knee would have felt better",
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
        <p>Because Yemi waited, her knee got worse. Look at the table. The left side is what <strong>really happened</strong>. The right side is what <strong>would have happened</strong> if she had gone to the clinic sooner.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-sage" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Table</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Yemi: real life and a different past</div>
          </div>
          <div style="padding: 0 0.75rem 0.75rem 0.75rem">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
              <thead>
                <tr>
                  <th class="gc-table-divider gc-text-terracotta" scope="col" style="padding: 0.4rem 0.4rem !important; font-size: 0.78rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Really happened</th>
                  <th class="gc-table-divider gc-text-sage" scope="col" style="padding: 0.4rem 0.4rem !important; font-size: 0.78rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Would have happened</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">She missed <strong>3 shifts</strong>.</td>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">She <strong>wouldn't have missed</strong> 3 shifts.</td>
                </tr>
                <tr>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">She lost almost <strong>$400</strong>.</td>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">She <strong>would have kept</strong> that money.</td>
                </tr>
                <tr>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">The clinic bill was <strong>$80</strong>.</td>
                  <td class="gc-table-divider" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; border-bottom: 1px solid rgba(128,128,128,0.25)">The bill <strong>might have been</strong> smaller.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
          title: "Look at the table",
          instructions: "Read the table, then choose.",
          items: [
            {
              type: "radio",
              label: "Look at the table. How many shifts did Yemi really miss?",
              options: [
                { value: "a", label: "0" },
                { value: "b", label: "3" },
                { value: "c", label: "80" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the table. \"If Yemi had gone sooner, she ___ almost $400.\"",
              options: [
                { value: "a", label: "wouldn't lose" },
                { value: "b", label: "wouldn't have lost" },
                { value: "c", label: "didn't lose" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the blank",
          instructions: "Write one word.",
          items: [
            {
              type: "text",
              label: "Yemi lost almost $400. \"If I had gone sooner, I wouldn't ___ lost that money.\"",
              expectedAnswers: ["have"],
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
              words: ["If", "Yemi", "had", "gone", "sooner,", "she", "would", "have", "kept", "her", "money"],
              correctAnswer: "If Yemi had gone sooner, she would have kept her money",
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
        <p>On the bus, Yemi reads about a scientist who left home to study in another country. His story is all in the past, so we can only imagine a different past for it. Yemi's bill is different: she can still call the clinic today.</p>

        ${readingCard({
          kicker: "Earth Day",
          title: "Mario Molina: The Scientist Who Warned About the Ozone Layer",
          photo: {
            url: "/images/guide-people/mario-molina.jpg",
            alt: "Mario Molina, wearing glasses and a gray suit, 2011",
            credit: "Janwikifoto, 2011, CC BY-SA 3.0",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Mario_Molina_1c389_8387.jpg",
          },
          paragraphs: [
            "Mario Molina <strong>was born</strong> in Mexico City. He studied chemical engineering at the National Autonomous University of Mexico (UNAM), then went to the University of California, Berkeley, for graduate school. Later, he joined F. Sherwood Rowland's research group at UC Irvine.",
            "In 1974, Molina and Rowland <strong>wrote</strong> an article that warned about gases called CFCs. They said CFCs could damage the ozone layer. In 1995, Molina, Rowland, and Paul Crutzen <strong>won</strong> the Nobel Prize in Chemistry. In 2013, President Obama <strong>gave</strong> Molina the Presidential Medal of Freedom. Molina died in 2020.",
          ],
          sources: [
            { name: "University of California Academic Senate", url: "https://senate.universityofcalifornia.edu/in-memoriam/files/mario-molina.html" },
            { name: "Science History Institute", url: "https://www.sciencehistory.org/education/scientific-biographies/mario-molina/" },
            { name: "UC San Diego Today", url: "https://today.ucsd.edu/story/mario_j_molina_chemistry_1995" },
          ],
          accent: "sage",
        })}

        <p>Molina's past cannot change, so a different past is only imagination. Here is the grammar:</p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Second conditional:</strong> If + past simple, would + base verb. Imaginary <em>now</em>.<br/>
            <strong>Third conditional:</strong> If + had + V3, would have + V3. Imaginary <em>past</em>.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("second (now)", "amber")}
            <span><em>If Yemi <strong>called</strong> the clinic now, they <strong>would help</strong> her.</em> (Still possible.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("third (past)", "blue")}
            <span><em>If Yemi <strong>had called</strong> three weeks ago, she <strong>wouldn't have missed</strong> three shifts.</em> (Too late.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Read about Mario Molina",
          instructions: "Read the card, then answer.",
          items: [
            {
              type: "radio",
              label: "Which sentence about Mario Molina is true?",
              options: [
                { value: "a", label: "He was born in Germany." },
                { value: "b", label: "He went to Berkeley for graduate school." },
                { value: "c", label: "He won the Nobel Prize in 1974." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "How many years passed between the 1974 article and the Nobel Prize? (number)",
              expectedAnswers: ["21", "twenty-one", "twenty one"],
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Second or third?",
          instructions: "Choose the correct conditional based on the situation.",
          items: [
            {
              type: "radio",
              label: "Yemi can still call the clinic today about the bill. \"If I ___ the clinic, they would help me.\"",
              options: [
                { value: "a", label: "called (second conditional, still possible)" },
                { value: "b", label: "had called (third conditional, past only)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Imagine a different past (our guess, not history). Which sentence is correct?",
              options: [
                { value: "a", label: "If Molina and Rowland hadn't written the article in 1974, people might not have learned about CFCs so soon." },
                { value: "b", label: "If Molina and Rowland didn't write the article in 1974, people might not have learned about CFCs so soon." },
                { value: "c", label: "If Molina and Rowland hadn't written the article in 1974, people might not learn about CFCs so soon." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s4-ex3",
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
              label: "If I had rested three weeks ago, I ___ saved almost $400. (past regret)",
              expectedAnswers: ["would have"],
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
        ${sceneCard("sceneBreakRoom", "Warehouse break room. Wednesday, before the shift.", "terracotta")}

        <p>Yemi and Jennifer talk before their shift. Jennifer remembers a coworker who got hurt last year.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏻", text: "Remember Kevin last year? If he<strong>'d used</strong> the lift, he <strong>wouldn't have hurt</strong> his back.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Same idea with my knee. If I <strong>had rested</strong> when it started, I <strong>wouldn't have missed</strong> three shifts.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "And if you <strong>called</strong> the nurse line now, they<strong>'d tell</strong> you what to do next.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "You're right. I can't change the past. But I can call today.", side: "right", tone: "terracotta" },
        ])}

        <p>That evening, Yemi calls the nurse line. The nurse tells her to rest and ice the knee. On the way home, she stops at the pharmacy for a knee brace. The pharmacist shows her how to put it on and says, "If you <strong>had come</strong> in three weeks ago, I <strong>could have shown</strong> you this then."</p>

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
              label: "Jennifer talks about Kevin's accident last year.",
              options: [
                { value: "a", label: "If he used the lift, he isn't injured." },
                { value: "b", label: "If he had used the lift, he wouldn't have been injured." },
                { value: "c", label: "If he has used the lift, he wouldn't have been injured." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "What really happened?",
          instructions: "Choose the best meaning.",
          items: [
            {
              type: "radio",
              label: "Jennifer says: \"If Kevin had used the lift, he wouldn't have hurt his back.\" What is true?",
              options: [
                { value: "a", label: "Kevin used the lift and did not get hurt." },
                { value: "b", label: "Kevin did not use the lift, and he got hurt." },
                { value: "c", label: "Kevin will use the lift tomorrow." },
              ],
              expectedAnswer: "b",
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
              words: ["If", "he", "had", "used", "the", "lift,", "he", "wouldn't", "have", "been", "injured"],
              correctAnswer: "If he had used the lift, he wouldn't have been injured",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Yemi says: \"If I had called three weeks ago, I wouldn't miss three shifts.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"wouldn't have missed\" (past result needs would have + V3)." },
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
      question: "Yemi did not rest her knee when it started to hurt, and it got worse. Which sentence matches her situation?",
      options: [
        { value: "a", label: "If I rest my knee, it won't get worse." },
        { value: "b", label: "If I had rested my knee, it wouldn't have gotten worse." },
        { value: "c", label: "If I rested my knee, it wouldn't get worse." },
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
        { value: "a", label: "If Yemi rested more, she will have healed faster." },
        { value: "b", label: "If Yemi had rested more, she would have healed faster." },
        { value: "c", label: "If Yemi has rested more, she would heal faster." },
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
      question: "Fill in the blank: \"If I had rested my knee, I ___ $80.\" (a different past result that didn't happen)",
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
      question: "Find the error: \"If Yemi had went to the clinic sooner, she would have paid less.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be \"had gone\" (the past participle of go is gone)." },
        { value: "c", label: "Error: should be \"she would pay\" not \"she would have paid\"." },
      ],
      correctAnswer: "b",
      explanation: "After had, use the past participle: had gone, not had went.",
      topic: "third-conditional",
      skill: "error-detection",
      skillTag: "error-past-participle",
      difficulty: "medium",
    },
    {
      id: "tc-ws1",
      type: "word-scramble" as const,
      question: "Yemi regrets waiting to go to the clinic. Put the words in order.",
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
