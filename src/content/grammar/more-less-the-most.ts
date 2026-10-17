import type { InteractiveGuideContent } from "@/types/activity";
import { moreLessTheMostImages as img } from "@/data/more-less-the-most-images.generated";

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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; flex-shrink: 0; white-space: nowrap; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const moreLessTheMostContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. "Which One Is Cheaper?" (Comparatives)
    // =========================================================================
    {
      id: "which-one-is-cheaper",
      stepNumber: 1,
      title: "Which One Is Cheaper?",
      icon: "🛒",
      explanation: `
        <p style="margin: 0 0 0.75rem 0">After work, Rosa and her friend Amara compare two stores. Rosa saved her receipts. Look at the example prices.</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(128,128,128,0.12)">
                <th class="gc-table-divider" scope="col" style="padding: 0.6rem 0.5rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Rosa's receipts</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.6rem 0.5rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Market Basket</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.6rem 0.5rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Dollar store</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td class="gc-text-terracotta" style="padding: 0.6rem 0.5rem; font-weight: 700; vertical-align: top">Beans</td>
                <td style="padding: 0.6rem 0.5rem">$1.20</td>
                <td style="padding: 0.6rem 0.5rem">$1.80</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td class="gc-text-terracotta" style="padding: 0.6rem 0.5rem; font-weight: 700; vertical-align: top">Oil</td>
                <td style="padding: 0.6rem 0.5rem">$5.00</td>
                <td style="padding: 0.6rem 0.5rem">$3.50</td>
              </tr>
              <tr>
                <td class="gc-text-terracotta" style="padding: 0.6rem 0.5rem; font-weight: 700; vertical-align: top">Walk</td>
                <td style="padding: 0.6rem 0.5rem">8 min</td>
                <td style="padding: 0.6rem 0.5rem">15 min</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="margin: -0.5rem 0 1.25rem 0; font-size: 0.88rem; opacity: 0.8"><strong>Beans</strong> are <strong>cheaper</strong> at Market Basket. The <strong>oil</strong> is <strong>more expensive</strong> there. The <strong>walk</strong> is <strong>shorter</strong>.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Comparatives</strong> compare two things. Use them with <em>than</em>: Market Basket is <strong>cheaper than</strong> the dollar store.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Short adjectives</div>
            <div style="font-size: 0.9rem; line-height: 1.7">cheap <strong>+er</strong> = cheaper<br>short <strong>+er</strong> = shorter<br>big <strong>+ger</strong> = bigger<br>close <strong>+r</strong> = closer</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Long adjectives</div>
            <div style="font-size: 0.9rem; line-height: 1.7"><strong>more</strong> expensive<br><strong>more</strong> convenient<br><strong>more</strong> affordable<br><strong>more</strong> reliable</div>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700; font-size: 0.93rem">Irregular comparatives</p>
          <p style="margin: 0; font-size: 0.93rem">good <strong>better</strong> &nbsp;|&nbsp; bad <strong>worse</strong> &nbsp;|&nbsp; far <strong>farther / further</strong></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("short", "terracotta")}
            <span><em>The walk is <strong>shorter</strong> than I thought.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("long", "sage")}
            <span><em>The oil is <strong>more expensive</strong> here than at the dollar store.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("irregular", "amber")}
            <span><em>The rice is <strong>better</strong> quality here.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mlm-s1-ex1",
          title: "Comparative or not?",
          instructions: "Choose the correct comparative form.",
          items: [
            {
              type: "radio",
              label: "Look at Rosa's receipts. Market Basket is ___ than the dollar store for beans. (cheap)",
              options: [
                { value: "more cheap", label: "more cheap" },
                { value: "cheaper", label: "cheaper" },
                { value: "cheapest", label: "cheapest" },
              ],
              expectedAnswer: "cheaper",
            },
            {
              type: "radio",
              label: "Look at Rosa's receipts. The oil at the dollar store is ___ than the oil at Market Basket. (affordable)",
              options: [
                { value: "affordabler", label: "affordabler" },
                { value: "more affordabler", label: "more affordabler" },
                { value: "more affordable", label: "more affordable" },
              ],
              expectedAnswer: "more affordable",
            },
            {
              type: "radio",
              label: "Look at Rosa's receipts. The walk to Market Basket is ___ than the walk to the dollar store. (short)",
              options: [
                { value: "more short", label: "more short" },
                { value: "shorter", label: "shorter" },
                { value: "shortest", label: "shortest" },
              ],
              expectedAnswer: "shorter",
            },
            {
              type: "radio",
              label: "The quality of this bread is ___ than the other brand. (good)",
              options: [
                { value: "gooder", label: "gooder" },
                { value: "more good", label: "more good" },
                { value: "better", label: "better" },
              ],
              expectedAnswer: "better",
            },
          ],
        },
        {
          id: "mlm-s1-ex2",
          title: "Build the comparison",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "oil", "is", "cheaper", "at", "the", "dollar", "store"],
              correctAnswer: "The oil is cheaper at the dollar store",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "walk", "to", "Market", "Basket", "is", "shorter"],
              correctAnswer: "The walk to Market Basket is shorter",
            },
          ],
        },
        {
          id: "mlm-s1-ex3",
          title: "Write the comparative",
          instructions: "Fill in the blank with the comparative form of the adjective.",
          items: [
            {
              type: "text",
              label: "Look at Rosa's receipts. How many minutes longer is the walk to the dollar store? Write a number.",
              expectedAnswers: ["7"],
            },
            {
              type: "text",
              label: "The dollar store is ___ (far) from my apartment than Market Basket.",
              expectedAnswers: ["farther", "further"],
            },
            {
              type: "text",
              label: "The bus is ___ (slow) than walking from the stop.",
              expectedAnswers: ["slower"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. "The Cheapest Plan I Could Find" (Superlatives)
    // =========================================================================
    {
      id: "the-cheapest-plan",
      stepNumber: 2,
      title: "The Cheapest Plan I Could Find",
      icon: "📱",
      explanation: `
        ${sceneCard("scenePhoneStore", "Phone store on Meridian Street. Rosa compares three prepaid plans.", "amber")}

        ${dialogue([
          { speaker: "Kevin", avatar: "🧑🏻", text: "I have three plans here. Which one do you want?", side: "left", tone: "amber" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Which one is <strong>the cheapest</strong>?", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Plan C. It is <strong>the least expensive</strong> at $35 a month.", side: "left", tone: "amber" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And which one has <strong>the most</strong> data?", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Plan B. But Plan C is <strong>the best</strong> value for the price.", side: "left", tone: "amber" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Then Plan C. I don’t need <strong>the most</strong> data. I need <strong>the cheapest</strong> bill.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Superlatives</strong> compare three or more things and name the one at the top (or bottom). Always use <strong>the</strong> before a superlative.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(233,196,106,0.07); border-radius: 0.5rem; border-top: 3px solid #e9c46a">
            <div class="gc-text-amber" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Short adjectives</div>
            <div style="font-size: 0.9rem; line-height: 1.7">cheap <strong>the cheapest</strong><br>short <strong>the shortest</strong><br>big <strong>the biggest</strong><br>close <strong>the closest</strong></div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Long adjectives</div>
            <div style="font-size: 0.9rem; line-height: 1.7"><strong>the most</strong> expensive<br><strong>the most</strong> convenient<br><strong>the least</strong> expensive<br><strong>the most</strong> reliable</div>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700; font-size: 0.93rem">Irregular superlatives</p>
          <p style="margin: 0; font-size: 0.93rem">good <strong>the best</strong> &nbsp;|&nbsp; bad <strong>the worst</strong> &nbsp;|&nbsp; far <strong>the farthest / furthest</strong></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("short", "amber")}
            <span><em>Plan C is <strong>the cheapest</strong> option.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("long", "sage")}
            <span><em>Plan A is <strong>the most expensive</strong> of the three.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("irregular", "terracotta")}
            <span><em>Plan C is <strong>the best</strong> value for the price.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mlm-s2-ex1",
          title: "Comparative or superlative?",
          instructions: "Choose the correct form for each sentence.",
          items: [
            {
              type: "radio",
              label: "Of the three plans, Plan C is ___. (cheap)",
              options: [
                { value: "cheaper", label: "cheaper (comparative)" },
                { value: "the cheapest", label: "the cheapest (superlative)" },
                { value: "most cheap", label: "most cheap" },
              ],
              expectedAnswer: "the cheapest",
            },
            {
              type: "radio",
              label: "Plan B is ___ than Plan C for data. (expensive)",
              options: [
                { value: "the most expensive", label: "the most expensive (superlative)" },
                { value: "more expensive", label: "more expensive (comparative)" },
                { value: "expensiver", label: "expensiver" },
              ],
              expectedAnswer: "more expensive",
            },
            {
              type: "radio",
              label: "Which plan is ___? (good)",
              options: [
                { value: "gooder", label: "gooder" },
                { value: "better", label: "better" },
                { value: "the best", label: "the best" },
              ],
              expectedAnswer: "the best",
            },
          ],
        },
        {
          id: "mlm-s2-ex2",
          title: "Error correction",
          instructions: "Find the mistake and choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "\"Plan C is most cheapest of all.\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "Plan C is the most cheapest of all." },
                { value: "c", label: "Plan C is the cheapest of all. (short adjective: just add -est, no 'most')" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"This plan is the more convenient for my schedule.\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "This plan is the most convenient for my schedule. (superlative needs 'most', not 'more')" },
                { value: "c", label: "This plan is convenientest for my schedule." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "mlm-s2-ex3",
          title: "Write the superlative",
          instructions: "Fill in the blank with the superlative form.",
          items: [
            {
              type: "text",
              label: "Plan A is ___ (expensive) of the three options.",
              expectedAnswers: ["the most expensive"],
            },
            {
              type: "text",
              label: "Rosa chose Plan C because it is ___ (good) deal for the price.",
              expectedAnswers: ["the best"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. "More Rooms, Less Noise" (More / Less / Fewer)
    // =========================================================================
    {
      id: "more-rooms-less-noise",
      stepNumber: 3,
      title: "More Rooms, Less Rent",
      icon: "🏠",
      explanation: `
        <p style="margin: 0 0 0.75rem 0">Rosa's friends Fernanda and Diego need a new apartment. They look at three listings. The bars show the rent.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-sage" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Listings</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Rent, bedrooms, and trip to work</div>
          </div>
          <div style="display: grid; gap: 0.35rem; padding: 0.25rem 1rem 0.9rem 1rem">
            <div style="display: grid; grid-template-columns: 1fr 4.5rem; gap: 0.2rem 0.6rem; align-items: center">
              <strong class="gc-text-terracotta">Bremen St</strong>
              <span style="font-size: 0.85rem; text-align: right; font-weight: 700">$1,800</span>
              <div style="height: 0.8rem; border-radius: 999px; background: rgba(128,128,128,0.18); overflow: hidden"><div class="gc-text-terracotta" style="height: 100%; width: 100%; background: currentColor; border-radius: 999px; opacity: 0.85"></div></div>
              <span style="font-size: 0.8rem; text-align: right; opacity: 0.8">a month</span>
              <span style="grid-column: 1 / -1; font-size: 0.9rem; margin-bottom: 0.4rem"><em>3 bedrooms | 40 minutes to work</em></span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 4.5rem; gap: 0.2rem 0.6rem; align-items: center">
              <strong class="gc-text-sage">Maverick St</strong>
              <span style="font-size: 0.85rem; text-align: right; font-weight: 700">$1,600</span>
              <div style="height: 0.8rem; border-radius: 999px; background: rgba(128,128,128,0.18); overflow: hidden"><div class="gc-text-sage" style="height: 100%; width: 89%; background: currentColor; border-radius: 999px; opacity: 0.85"></div></div>
              <span style="font-size: 0.8rem; text-align: right; opacity: 0.8">a month</span>
              <span style="grid-column: 1 / -1; font-size: 0.9rem; margin-bottom: 0.4rem"><em>2 bedrooms | 30 minutes to work</em></span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 4.5rem; gap: 0.2rem 0.6rem; align-items: center">
              <strong class="gc-text-amber">Chelsea St</strong>
              <span style="font-size: 0.85rem; text-align: right; font-weight: 700">$1,300</span>
              <div style="height: 0.8rem; border-radius: 999px; background: rgba(128,128,128,0.18); overflow: hidden"><div class="gc-text-amber" style="height: 100%; width: 72%; background: currentColor; border-radius: 999px; opacity: 0.85"></div></div>
              <span style="font-size: 0.8rem; text-align: right; opacity: 0.8">a month</span>
              <span style="grid-column: 1 / -1; font-size: 0.9rem; margin-bottom: 0.4rem"><em>1 bedroom | 20 minutes to work</em></span>
            </div>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>more</strong> for both countable and uncountable things. Use <strong>less</strong> for uncountable things. Use <strong>fewer</strong> for countable things you can count one by one.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Less (you cannot count it)</div>
            <div style="font-size: 0.9rem; line-height: 1.7">less <strong>noise</strong><br>less <strong>rent</strong><br>less <strong>space</strong><br>less <strong>traffic</strong></div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Fewer (you can count them)</div>
            <div style="font-size: 0.9rem; line-height: 1.7">fewer <strong>closets</strong><br>fewer <strong>rooms</strong><br>fewer <strong>problems</strong><br>fewer <strong>neighbors</strong></div>
          </div>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("more", "terracotta")}
            <span><em>This apartment has <strong>more</strong> rooms than our old one.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("less", "sage")}
            <span><em>Chelsea Street costs <strong>less</strong> money than Bremen Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("fewer", "amber")}
            <span><em>We want <strong>fewer</strong> problems with the landlord.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mlm-s3-ex1",
          title: "Less or fewer?",
          instructions: "Choose the correct word for each blank.",
          items: [
            {
              type: "radio",
              label: "Look at the listings. The Chelsea Street apartment has ___ bedrooms than the Maverick Street apartment.",
              options: [
                { value: "less", label: "less" },
                { value: "fewer", label: "fewer" },
              ],
              expectedAnswer: "fewer",
            },
            {
              type: "radio",
              label: "Look at the listings. The Chelsea Street apartment costs ___ money than the Bremen Street apartment.",
              options: [
                { value: "less", label: "less" },
                { value: "fewer", label: "fewer" },
              ],
              expectedAnswer: "less",
            },
            {
              type: "radio",
              label: "Look at the listings. The trip from Maverick Street takes ___ time than the trip from Bremen Street.",
              options: [
                { value: "less", label: "less" },
                { value: "fewer", label: "fewer" },
              ],
              expectedAnswer: "less",
            },
            {
              type: "radio",
              label: "Diego wants ___ problems with the landlord than last time.",
              options: [
                { value: "less", label: "less" },
                { value: "fewer", label: "fewer" },
              ],
              expectedAnswer: "fewer",
            },
          ],
        },
        {
          id: "mlm-s3-ex2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Chelsea", "Street", "costs", "less", "than", "Bremen", "Street"],
              correctAnswer: "Chelsea Street costs less than Bremen Street",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["We", "need", "fewer", "boxes", "in", "the", "hallway"],
              correctAnswer: "We need fewer boxes in the hallway",
            },
          ],
        },
        {
          id: "mlm-s3-ex3",
          title: "Fill in the blank",
          instructions: "Write 'more', 'less', or 'fewer'.",
          items: [
            {
              type: "text",
              label: "Look at the rent bars. Bremen Street costs $___ more a month than Maverick Street. Write a number.",
              expectedAnswers: ["200", "$200"],
            },
            {
              type: "text",
              label: "Write more, less, or fewer. Maverick Street takes ___ minutes to get to work than Bremen Street.",
              expectedAnswers: ["fewer"],
            },
            {
              type: "text",
              label: "We want ___ repairs this winter. (things you can count)",
              expectedAnswers: ["fewer"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. "The Best Deal This Week" (Real-world reading)
    // =========================================================================
    {
      id: "the-best-deal-this-week",
      stepNumber: 4,
      title: "The Best Deal This Week",
      icon: "🌼",
      explanation: `
        ${sceneCard("sceneFlowerMarket", "Flower stall near St. Mary's, East Boston. Saturday morning.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "I need marigolds for my window box. They’re <strong>more expensive</strong> than last year.", side: "right", tone: "terracotta" },
          { speaker: "Vendor", avatar: "🧑🏾", text: "Yes, but these are <strong>the freshest</strong> on the street. Look at the color.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "The shop on Sumner has <strong>the lowest</strong> price. But it is <strong>farther</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Vendor", avatar: "🧑🏾", text: "Buy here and save the bus fare. It is <strong>the better</strong> deal today.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "All right. I’ll take two bundles, please.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Comparison language appears everywhere: store signs, apartment ads, phone plans, and conversations. The same rules apply: <strong>-er / more</strong> for two things, <strong>-est / the most</strong> for three or more.</p>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(176,87,64,0.06); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.4rem 0; font-weight: 700; font-size: 0.93rem">Comparison language in real life</p>
          <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.9; font-size: 0.93rem">
            <li><strong>better than</strong> / <strong>worse than</strong> (comparing two things)</li>
            <li><strong>the best</strong> / <strong>the worst</strong> (of all options)</li>
            <li><strong>the most</strong> + adjective / <strong>the least</strong> + adjective</li>
            <li><strong>more</strong> + noun / <strong>less</strong> + uncountable / <strong>fewer</strong> + countable</li>
          </ul>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("ad language", "terracotta")}
            <span><em>"<strong>The freshest</strong> flowers on the block."</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("listing", "sage")}
            <span><em>"<strong>The cheapest</strong> 2BR apartment near the 116 bus. <strong>More</strong> space, <strong>less</strong> rent."</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("conversation", "amber")}
            <span><em>"It costs <strong>more</strong> here but the quality is <strong>better</strong>."</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mlm-s4-ex1",
          title: "Reading real comparisons",
          instructions: "Choose the correct meaning for each sentence.",
          items: [
            {
              type: "radio",
              label: "\"The flowers here are the freshest on the street.\"",
              options: [
                { value: "a", label: "The flowers are fresher than one other shop." },
                { value: "b", label: "The flowers are fresher than all other shops on the street." },
                { value: "c", label: "The flowers were fresh yesterday." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"This apartment is the cheapest 2BR near the 116 bus.\"",
              options: [
                { value: "a", label: "This apartment is cheaper than one other apartment." },
                { value: "b", label: "This apartment costs less than all other 2BRs near the 116 bus." },
                { value: "c", label: "This apartment was cheap last year." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "mlm-s4-ex2",
          title: "Comparative or superlative?",
          instructions: "Choose the correct form for each blank.",
          items: [
            {
              type: "radio",
              label: "Of all the flower stalls on the street, this one has ___ prices. (low)",
              options: [
                { value: "lower", label: "lower (comparative. 2 things)" },
                { value: "the lowest", label: "the lowest (superlative. all stalls)" },
              ],
              expectedAnswer: "the lowest",
            },
            {
              type: "radio",
              label: "The Sumner shop is ___ than this stall. (far)",
              options: [
                { value: "the farthest", label: "the farthest (superlative)" },
                { value: "farther", label: "farther (comparative. 2 locations)" },
              ],
              expectedAnswer: "farther",
            },
            {
              type: "radio",
              label: "Look at the listings on page 3. Chelsea Street is ___ apartment and also ___ one. (small, cheap)",
              options: [
                { value: "a", label: "the smallest / the cheapest" },
                { value: "b", label: "smaller / cheaper" },
                { value: "c", label: "the most small / cheapest" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "mlm-s4-ex3",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "marigolds", "are", "more", "expensive", "than", "last", "year"],
              correctAnswer: "The marigolds are more expensive than last year",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["It", "is", "the", "cheapest", "two-bedroom", "apartment", "near", "the", "bus", "line"],
              correctAnswer: "It is the cheapest two-bedroom apartment near the bus line",
            },
          ],
        },
        {
          id: "mlm-s4-ex4",
          title: "Write the correct form",
          instructions: "Fill in the blank with the comparative or superlative form of the adjective.",
          items: [
            {
              type: "text",
              label: "Of all three stores, that one has ___ (fresh) produce.",
              expectedAnswers: ["the freshest"],
            },
            {
              type: "text",
              label: "This apartment is ___ (small) than the one on Bremen Street, but it is also ___ (cheap).",
              expectedAnswers: ["smaller, cheaper"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation of comparatives, superlatives, and quantifiers, open the <a href=\"/grammar-reader/superlatives-quantifiers\" style=\"font-weight:700;text-decoration:underline\">Comparatives + Superlatives + Quantifiers Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ. 5 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "mlm-q1",
      question: "Rosa says: \"Market Basket is cheaper than the dollar store for beans.\" What is she doing?",
      options: [
        { value: "a", label: "Comparing two stores." },
        { value: "b", label: "Saying Market Basket is the cheapest store in the city." },
        { value: "c", label: "Saying prices at both stores are the same." },
      ],
      correctAnswer: "a",
      explanation: "Comparatives (cheaper than) compare two things. Superlatives (the cheapest) rank one above all others.",
      topic: "comparative-vs-superlative",
      skill: "recognition",
      skillTag: "comparative-two-things",
      difficulty: "easy",
    },
    {
      id: "mlm-q2",
      question: "Rosa compares three ways to get to work. Which sentence is correct?",
      options: [
        { value: "a", label: "The Blue Line is the most fastest." },
        { value: "b", label: "The Blue Line is fastest." },
        { value: "c", label: "The Blue Line is the fastest." },
      ],
      correctAnswer: "c",
      explanation: "Superlatives need 'the' before them. Never add 'most' to an -est form.",
      topic: "superlative-form",
      skill: "error-detection",
      skillTag: "double-superlative-error",
      difficulty: "easy",
    },
    {
      id: "mlm-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Plan B is ___ expensive than Plan C.\" (Long adjective comparative: don't add -er.)",
      correctAnswer: "more",
      explanation: "Long adjectives use 'more' for comparatives. Never add -er to a long adjective like 'expensive'.",
      topic: "comparative-form-long-adjective",
      skill: "usage",
      skillTag: "more-with-long-adjective",
      difficulty: "easy",
    },
    {
      id: "mlm-qws1",
      type: "word-scramble" as const,
      question: "Rosa compares the markets near her apartment. Put the words in order.",
      words: ["This", "market", "is", "the", "closest", "to", "my", "apartment"],
      correctAnswer: "This market is the closest to my apartment",
      hint: "superlatives need 'the'",
      explanation: "Superlatives always need 'the' before them. 'The closest' ranks it above all others in the group.",
      topic: "superlative-form",
      skill: "usage",
      skillTag: "double-superlative-error",
      difficulty: "medium",
    },
    {
      id: "mlm-q5",
      question: "Diego says: \"I want fewer problems with the landlord.\" Why is 'fewer' correct here?",
      options: [
        { value: "a", label: "Because problems are uncountable." },
        { value: "b", label: "Because problems are countable. You can count one problem, two problems." },
        { value: "c", label: "Because 'less' only works with adjectives." },
      ],
      correctAnswer: "b",
      explanation: "'Fewer' goes with countable nouns. 'Less' goes with uncountable nouns like noise, rent, or stress.",
      topic: "fewer-vs-less",
      skill: "usage",
      skillTag: "fewer-countable-noun",
      difficulty: "medium",
    },
  ],
};
