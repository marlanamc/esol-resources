import type { InteractiveGuideContent } from "@/types/activity";
import { howMuchHowManyImages as img } from "@/data/how-much-how-many-images.generated";
import { checklist } from "@/content/grammar/_shared/guide-visuals";

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

export const howMuchHowManyContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Countable vs. Uncountable
    // =========================================================================
    {
      id: "countable-vs-uncountable",
      stepNumber: 1,
      title: "Eggs and Milk: Countable vs. Uncountable",
      icon: "🥚",
      explanation: `
        ${sceneCard("sceneGroceryTexting", "Market Basket, Revere Beach Parkway, Thursday after work.", "terracotta")}

        <p style="margin: 0 0 1rem 0">Claudette works at a hotel in East Boston. On Thursday, she stops at the store on her way home. Her sister Sarah and Sarah's big family are coming for dinner on Saturday. Claudette texts her roommate Fabienne to check what they have at home.</p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏿", text: "Fabienne, do we have <strong>eggs</strong>? How many are left?", side: "right", tone: "terracotta" },
          { speaker: "Fabienne", avatar: "👩🏽", text: "Three eggs. But we don't have <strong>milk</strong>. We need milk.", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏿", text: "OK. <strong>How much</strong> rice do we have?", side: "right", tone: "terracotta" },
          { speaker: "Fabienne", avatar: "👩🏽", text: "Not much. Maybe half a bag.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Countable nouns</strong> are things you can count: 1 egg, 2 eggs, 3 eggs. <strong>Uncountable nouns</strong> have no plural form and no number: milk, rice, oil, money, water, bread.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.6rem">Countable</div>
            <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.95rem">
              <span>an egg / <strong>three eggs</strong></span>
              <span>a can / <strong>two cans</strong></span>
              <span>an apple / <strong>six apples</strong></span>
              <span>a bag / <strong>four bags</strong></span>
            </div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.6rem">Uncountable</div>
            <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.95rem">
              <span>milk <em>(not milks)</em></span>
              <span>rice <em>(not rices)</em></span>
              <span>oil <em>(not oils)</em></span>
              <span>money <em>(not moneys)</em></span>
            </div>
          </div>
        </div>

        <div style="background: rgba(233,196,106,0.12); border-radius: 0.5rem; padding: 0.85rem 1rem; margin-top: 0.5rem; border-left: 3px solid #e9c46a">
          <p style="margin: 0; font-size: 0.93rem"><strong>Tip:</strong> Uncountable nouns are always singular. Say <em>The rice is cheap</em>, not <em>The rice are cheap</em>.</p>
        </div>
      `,
      exercises: [
        {
          id: "hmhm-s1-ex1",
          title: "Countable or uncountable?",
          instructions: "Choose the correct answer.",
          items: [
            {
              type: "radio",
              label: "Which word is uncountable?",
              options: [
                { value: "apples", label: "apples" },
                { value: "cans", label: "cans" },
                { value: "bread", label: "bread" },
                { value: "bags", label: "bags" },
              ],
              expectedAnswer: "bread",
            },
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "I need three milks." },
                { value: "b", label: "I need milk." },
                { value: "c", label: "I need a milk." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Claudette says \"We need eggs.\" Fabienne says \"We need milk.\" Which noun is countable?",
              options: [
                { value: "milk", label: "milk" },
                { value: "eggs", label: "eggs" },
                { value: "both", label: "both" },
              ],
              expectedAnswer: "eggs",
            },
          ],
        },
        {
          id: "hmhm-s1-ex2",
          title: "Write your answer",
          instructions: "Type one word.",
          items: [
            {
              type: "text",
              label: "Is oil countable or uncountable?",
              expectedAnswers: ["uncountable"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. How Many / How Much
    // =========================================================================
    {
      id: "how-many-how-much",
      stepNumber: 2,
      title: "How Many or How Much?",
      icon: "🛒",
      explanation: `
<p style="margin: 0 0 1rem 0">Thursday evening, Claudette is still at the store. She has a <strong>$40</strong> budget and twelve people are coming on Saturday, so she writes a list. Sarah, her sister, will bring the cooking oil.</p>

        ${checklist({
          kicker: "Shopping list",
          title: "Saturday dinner for 12 ($40)",
          items: [
            { text: "Milk: 2 bottles", done: true },
            { text: "Eggs: 24", done: true },
            { text: "Rice: 1 big bag", done: false },
            { text: "Onions: 3", done: false },
          ],
        })}
        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>How many</strong> with countable nouns. Use <strong>How much</strong> with uncountable nouns.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("countable", "terracotta")}
            <span><em>How <strong>many</strong> eggs do we need?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("countable", "terracotta")}
            <span><em>How <strong>many</strong> people are coming?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("uncountable", "sage")}
            <span><em>How <strong>much</strong> rice do we have?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("uncountable", "sage")}
            <span><em>How <strong>much</strong> money do you have?</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hmhm-s2-ex1",
          title: "How many or how much?",
          instructions: "Choose the correct question word.",
          items: [
            {
              type: "radio",
              label: "Look at the shopping list. Claudette still needs the onions. Which question is correct?",
              options: [
                { value: "many", label: "How many onions does she need?" },
                { value: "much", label: "How much onions does she need?" },
              ],
              expectedAnswer: "many",
            },
            {
              type: "radio",
              label: "Complete the question: \"___ bags of rice do we need?\"",
              options: [
                { value: "how much", label: "How much" },
                { value: "how many", label: "How many" },
              ],
              expectedAnswer: "how many",
            },
            {
              type: "radio",
              label: "Complete the question: \"___ cooking oil is in the bottle?\"",
              options: [
                { value: "how much", label: "How much" },
                { value: "how many", label: "How many" },
              ],
              expectedAnswer: "how much",
            },
          ],
        },
        {
          id: "hmhm-s2-ex2",
          title: "Build the question",
          instructions: "Unscramble the words to make a correct question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "many", "people", "are", "coming", "to", "the", "party"],
              correctAnswer: "How many people are coming to the party",
            },
          ],
        },
        {
          id: "hmhm-s2-ex3",
          title: "Write your answer",
          instructions: "Write 'how much' or 'how many.'",
          items: [
            {
              type: "text",
              label: "Look at the shopping list. How many eggs did Claudette buy? Type the number.",
              expectedAnswers: ["24", "twenty-four", "twenty four"],
            },
            {
              type: "text",
              label: "___ milk is in the fridge?",
              expectedAnswers: ["how much", "How much"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. A Lot Of, A Few, A Little
    // =========================================================================
    {
      id: "a-lot-of-a-few-a-little",
      stepNumber: 3,
      title: "A Lot Of, A Few, A Little",
      icon: "🍚",
      explanation: `
<p style="margin: 0 0 1rem 0">On Friday after work, Claudette finishes the shopping. Back in the kitchen, she checks what is at home before she cooks.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-amber" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Kitchen check</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">What Claudette has at home</div>
          </div>
          <div style="overflow-x: auto; padding: 0 0.5rem 0.75rem 0.5rem"><table style="width: 100%; border-collapse: collapse; font-size: 0.93rem"><thead><tr style="background: rgba(128,128,128,0.12)"><th class="gc-table-divider" scope="col" style="padding: 0.5rem 0.4rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Food</th><th class="gc-table-divider" scope="col" style="padding: 0.5rem 0.4rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">At home</th></tr></thead><tbody><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">🥚 Eggs</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">24 eggs</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">🧅 Onions</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">3 onions</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">🍚 Rice</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">a big bag, full</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">🧂 Salt</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">almost empty</td></tr></tbody></table></div>
        </div>
        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>A lot of</strong> works with both countable and uncountable nouns. <strong>A few</strong> is for countable nouns only. <strong>A little</strong> is for uncountable nouns only.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.10); border-radius: 0.4rem">
            ${labelPill("a lot of", "amber")}
            <span><em>I have <strong>a lot of</strong> rice.</em> / <em>I have <strong>a lot of</strong> cans.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("a few (countable)", "terracotta")}
            <span><em>I have <strong>a few</strong> onions.</em> / <em>I have <strong>a few</strong> apples.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("a little (uncountable)", "sage")}
            <span><em>I have <strong>a little</strong> oil.</em> / <em>I have <strong>a little</strong> money.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(200,50,50,0.07); border-radius: 0.4rem">
            <span class="gc-bg-terracotta-alpha gc-text-terracotta" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">not correct</span>
            <span><em>I have a few oil.</em> &nbsp; <em>I have a little onions.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hmhm-s3-ex1",
          title: "A few or a little?",
          instructions: "Choose the correct quantifier.",
          items: [
            {
              type: "radio",
              label: "Look at the kitchen check. Which sentence is true?",
              options: [
                { value: "a", label: "Claudette has a few onions." },
                { value: "b", label: "Claudette has a little onions." },
                { value: "c", label: "Claudette has a few salt." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Claudette has some money left. Which is correct?",
              options: [
                { value: "a", label: "She has a few money." },
                { value: "b", label: "She has a little money." },
                { value: "c", label: "She has a little moneys." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Fabienne bought some apples. Which is correct?",
              options: [
                { value: "a", label: "She bought a little apples." },
                { value: "b", label: "She bought a few apples." },
                { value: "c", label: "She bought a few apple." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hmhm-s3-ex2",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "a", "lot", "of", "rice", "in", "the", "cabinet"],
              correctAnswer: "I have a lot of rice in the cabinet",
            },
          ],
        },
        {
          id: "hmhm-s3-ex3",
          title: "Write your answer",
          instructions: "Write 'a few' or 'a little.'",
          items: [
            {
              type: "text",
              label: "Look at the kitchen check. There is salt, but it is almost empty. Claudette has ___ salt.",
              expectedAnswers: ["a little"],
            },
            {
              type: "text",
              label: "I only have ___ oil left.",
              expectedAnswers: ["a little"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Reading the Label (much/many in negatives)
    // =========================================================================
    {
      id: "reading-the-label",
      stepNumber: 4,
      title: "Reading the Label",
      icon: "📦",
      explanation: `
<p style="margin: 0 0 1rem 0">Friday evening, Fabienne meets Claudette in the cereal aisle. Sarah's children will stay for breakfast on Sunday, so Claudette compares two boxes of cereal (the labels are made up for this lesson).</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-amber" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Nutrition label</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Two cereals, one serving each</div>
          </div>
          <div style="overflow-x: auto; padding: 0 0.5rem 0.75rem 0.5rem"><table style="width: 100%; border-collapse: collapse; font-size: 0.93rem"><thead><tr style="background: rgba(128,128,128,0.12)"><th class="gc-table-divider" scope="col" style="padding: 0.5rem 0.4rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)"></th><th class="gc-table-divider" scope="col" style="padding: 0.5rem 0.4rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Store brand</th><th class="gc-table-divider" scope="col" style="padding: 0.5rem 0.4rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Name brand</th></tr></thead><tbody><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">Sugar</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">14 g</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">6 g</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">Protein</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">2 g</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">5 g</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">Ingredients</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">12</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">5</td></tr><tr style="border-bottom: 1px solid rgba(128,128,128,0.2)"><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">Price</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">$3</td><td style="padding: 0.5rem 0.4rem !important; vertical-align: top">$5</td></tr></tbody></table></div>
        </div>
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">In negative sentences and questions, use <strong>much</strong> with uncountable nouns and <strong>many</strong> with countable nouns.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("uncountable", "sage")}
            <span><em>There isn't <strong>much</strong> protein in the store brand.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("uncountable", "sage")}
            <span><em>Is there <strong>much</strong> sugar in the store brand?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("countable", "terracotta")}
            <span><em>There aren't <strong>many</strong> ingredients in the name brand.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("countable", "terracotta")}
            <span><em>There aren't <strong>many</strong> boxes of cereal on the shelf.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hmhm-s4-ex1",
          title: "Much or many?",
          instructions: "Choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "Look at the labels. Which sentence is true about the store brand?",
              options: [
                { value: "a", label: "It doesn't have much protein." },
                { value: "b", label: "It doesn't have many ingredients." },
                { value: "c", label: "It doesn't have much sugar." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The box has very little salt. Which sentence is correct?",
              options: [
                { value: "a", label: "There isn't many salt." },
                { value: "b", label: "There isn't much salt." },
                { value: "c", label: "There are not much salt." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "At home, Claudette checks the bag of onions. Only two are left. Which is correct?",
              options: [
                { value: "a", label: "There aren't many onions." },
                { value: "b", label: "There isn't many onions." },
                { value: "c", label: "There aren't much onions." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hmhm-s4-ex2",
          title: "Build the question",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "much", "protein", "is", "in", "the", "name", "brand"],
              correctAnswer: "How much protein is in the name brand",
            },
          ],
        },
        {
          id: "hmhm-s4-ex3",
          title: "Write your answer",
          instructions: "Write 'much' or 'many.'",
          items: [
            {
              type: "text",
              label: "Look at the labels. How many grams of protein does the name brand have? Type the number.",
              expectedAnswers: ["5", "five"],
            },
            {
              type: "text",
              label: "There aren't ___ cans of beans left.",
              expectedAnswers: ["many"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. Enough and Too Much / Too Many
    // =========================================================================
    {
      id: "enough-too-much-too-many",
      stepNumber: 5,
      title: "Enough and Too Much / Too Many",
      icon: "🍲",
      explanation: `
        ${sceneCard("sceneKitchenPrep", "Claudette's kitchen, Saturday afternoon. Sarah arrives early.", "sage")}

        <p style="margin: 0 0 1rem 0">On Saturday afternoon, Sarah comes early to help cook. Her husband and the kids will arrive later. Claudette looks at everything she bought.</p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏿", text: "I bought <strong>too many</strong> cans of beans. They were on sale, but we can't eat all this.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏾", text: "Let’s use some of them for dinner tonight.", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏿", text: "Good idea. But I don’t have <strong>enough</strong> plates for everyone.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏾", text: "I have plates in my car. Just don’t cook <strong>too much</strong> food. We brought some food too.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Enough</strong> = the right amount. <strong>Too many</strong> = more than you need (countable). <strong>Too much</strong> = more than you need (uncountable).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("enough", "sage")}
            <span><em>We have <strong>enough</strong> rice for ten people.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("enough", "sage")}
            <span><em>I don't have <strong>enough</strong> plates.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("too many (countable)", "terracotta")}
            <span><em>I bought <strong>too many</strong> bags. / <strong>too many</strong> cans.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.10); border-radius: 0.4rem">
            ${labelPill("too much (uncountable)", "amber")}
            <span><em>There's <strong>too much</strong> food. / <strong>too much</strong> salt.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hmhm-s5-ex1",
          title: "Too many, too much, or enough?",
          instructions: "Choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "Claudette has ten cans of beans but only needs three. Which is correct?",
              options: [
                { value: "a", label: "She has too much cans." },
                { value: "b", label: "She has too many cans." },
                { value: "c", label: "She has enough cans." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The soup is very salty. Which is correct?",
              options: [
                { value: "a", label: "There are too many salt." },
                { value: "b", label: "There is too much salt." },
                { value: "c", label: "There is too many salt." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I have six plates for six people.\" Which word fits best?",
              options: [
                { value: "enough", label: "I have enough plates." },
                { value: "too many", label: "I have too many plates." },
                { value: "too much", label: "I have too much plates." },
              ],
              expectedAnswer: "enough",
            },
          ],
        },
        {
          id: "hmhm-s5-ex2",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["We", "don't", "have", "enough", "money", "for", "all", "this", "food"],
              correctAnswer: "We don't have enough money for all this food",
            },
          ],
        },
        {
          id: "hmhm-s5-ex3",
          title: "Write your answer",
          instructions: "Write 'enough', 'too many', or 'too much.'",
          items: [
            {
              type: "text",
              label: "Claudette bought ten cans of beans but only needed three. She has ___ cans.",
              expectedAnswers: ["too many"],
            },
            {
              type: "text",
              label: "I have six plates for six guests. I have ___ plates.",
              expectedAnswers: ["enough"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/superlatives-quantifiers\" style=\"font-weight:700;text-decoration:underline\">Quantifiers: Much, Many, A Few, A Little Full Guide</a>.",
      },
    },
  ],

  // =========================================================================
  // MINI QUIZ. 10 questions
  // =========================================================================
  miniQuiz: [
    {
      id: "how-much-how-many-q1",
      question: "Claudette is at the store. She wants to know the number of eggs at home. What does she ask?",
      options: [
        { value: "a", label: "How much eggs do we have?" },
        { value: "b", label: "How many eggs do we have?" },
        { value: "c", label: "How many egg do we have?" },
      ],
      correctAnswer: "b",
      explanation: "Eggs are countable, so use 'how many' and the plural form 'eggs.'",
      topic: "how-many",
      skill: "usage",
      skillTag: "how-many-countable",
      difficulty: "easy",
    },
    {
      id: "how-much-how-many-q2",
      question: "Claudette is at the store. She texts Fabienne to ask about the cooking oil at home. What does she write?",
      options: [
        { value: "a", label: "How many oil do we have?" },
        { value: "b", label: "How much oil do we have?" },
        { value: "c", label: "How many oils do we have?" },
      ],
      correctAnswer: "b",
      explanation: "Oil is uncountable, so use 'how much.' It has no plural form here.",
      topic: "how-much",
      skill: "usage",
      skillTag: "how-much-uncountable",
      difficulty: "easy",
    },
    {
      id: "how-much-how-many-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She bought ___ rice for dinner.\" (Rice is uncountable: use a little or a few?)",
      correctAnswer: "a little",
      explanation: "Rice is uncountable. Use 'a little' with uncountable nouns. 'A few' is only for countable nouns.",
      topic: "a-little-a-few",
      skill: "usage",
      skillTag: "a-little-uncountable",
      difficulty: "easy",
    },
    {
      id: "how-much-how-many-qws1",
      type: "word-scramble" as const,
      question: "Claudette calls Fabienne from the grocery store. Put her question in order.",
      words: ["How", "much", "milk", "do", "we", "need"],
      correctAnswer: "How much milk do we need",
      hint: "How much + uncountable noun",
      explanation: "Milk is uncountable, so use 'how much.'",
      topic: "how-much",
      skill: "usage",
      skillTag: "how-much-uncountable",
      difficulty: "medium",
    },
    {
      id: "how-much-how-many-q8",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "There is too much oil in the pan." },
        { value: "b", label: "I have a lot of eggs at home." },
        { value: "c", label: "She bought a few rice for dinner." },
      ],
      correctAnswer: "c",
      explanation: "Rice is uncountable. You cannot say 'a few rice.' Use 'a little rice' instead.",
      topic: "a-little-a-few",
      skill: "error-detection",
      skillTag: "error-a-few-with-uncountable",
      difficulty: "medium",
    },
  ],
};
