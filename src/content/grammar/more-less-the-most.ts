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
        ${sceneCard("sceneGroceryStore", "Market Basket, Chelsea Street. After a double shift, Rosa and Amara stop to compare prices.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "Beans are <strong>cheaper</strong> here than at the dollar store.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "Really? But the cooking oil is <strong>more expensive</strong> here.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "True. The rice is <strong>better</strong> quality here, though.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "And the walk is <strong>shorter</strong>. My feet hurt.", side: "left", tone: "sage" },
        ])}

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
              label: "Market Basket is ___ than the dollar store for rice. (cheap)",
              options: [
                { value: "more cheap", label: "more cheap" },
                { value: "cheaper", label: "cheaper" },
                { value: "cheapest", label: "cheapest" },
              ],
              expectedAnswer: "cheaper",
            },
            {
              type: "radio",
              label: "The cooking oil at the dollar store is ___ than here. (affordable)",
              options: [
                { value: "affordabler", label: "affordabler" },
                { value: "more affordabler", label: "more affordabler" },
                { value: "more affordable", label: "more affordable" },
              ],
              expectedAnswer: "more affordable",
            },
            {
              type: "radio",
              label: "The walk to Market Basket is ___ than the bus ride. (short)",
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
              words: ["The", "beans", "are", "cheaper", "here", "than", "at", "the", "dollar", "store"],
              correctAnswer: "The beans are cheaper here than at the dollar store",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "oil", "is", "more", "expensive", "at", "Market", "Basket"],
              correctAnswer: "The oil is more expensive at Market Basket",
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
              label: "The dollar store is ___ (close) to my apartment than Market Basket.",
              expectedAnswers: ["closer"],
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
      title: "More Rooms, Less Noise",
      icon: "🏠",
      explanation: `
        ${sceneCard("sceneApartmentSearch", "Kitchen table, East Boston. Fernanda and Diego compare apartment listings on their phones.", "sage")}

        ${dialogue([
          { speaker: "Fernanda", avatar: "👩🏽", text: "This one on Bremen Street has <strong>more</strong> rooms but <strong>fewer</strong> closets.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏾", text: "The one on Maverick has <strong>less</strong> noise. It is not on the main street.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "But it costs <strong>more</strong>. $200 <strong>more</strong> a month.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏾", text: "We need <strong>fewer</strong> problems with the landlord too. Remember last time.", side: "right", tone: "terracotta" },
        ])}

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
            <span><em>The Maverick listing has <strong>less</strong> noise.</em></span>
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
              label: "The Bremen Street apartment has ___ closets than the Maverick listing.",
              options: [
                { value: "less", label: "less (uncountable)" },
                { value: "fewer", label: "fewer (countable. you can count closets)" },
              ],
              expectedAnswer: "fewer",
            },
            {
              type: "radio",
              label: "The Maverick apartment has ___ noise from the street.",
              options: [
                { value: "less", label: "less (uncountable. noise is not countable)" },
                { value: "fewer", label: "fewer (countable)" },
              ],
              expectedAnswer: "less",
            },
            {
              type: "radio",
              label: "Diego wants ___ stress with the landlord this year.",
              options: [
                { value: "less", label: "less (uncountable. stress is not countable)" },
                { value: "fewer", label: "fewer (countable)" },
              ],
              expectedAnswer: "less",
            },
            {
              type: "radio",
              label: "The new building has ___ maintenance problems than the old one.",
              options: [
                { value: "less", label: "less (uncountable)" },
                { value: "fewer", label: "fewer (countable. you can count problems)" },
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
              words: ["The", "Maverick", "apartment", "has", "less", "noise", "than", "the", "Bremen", "one"],
              correctAnswer: "The Maverick apartment has less noise than the Bremen one",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["We", "need", "fewer", "problems", "with", "the", "landlord"],
              correctAnswer: "We need fewer problems with the landlord",
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
              label: "The Bremen Street apartment has ___ rooms, but it costs $200 ___ a month.",
              expectedAnswers: ["more, more"],
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
    // SECTION 4. "The Best Deal This Week" (Real-world reading + Guadalupe)
    // =========================================================================
    {
      id: "the-best-deal-this-week",
      stepNumber: 4,
      title: "The Best Deal This Week",
      icon: "🌼",
      explanation: `
        ${sceneCard("sceneFlowerMarket", "Flower stall near St. Mary's, East Boston. December 12, Our Lady of Guadalupe.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "The marigolds here are <strong>more expensive</strong> than last year.", side: "right", tone: "terracotta" },
          { speaker: "Vendor", avatar: "🧑🏾", text: "Yes, but these are <strong>the freshest</strong> on the street. Look at the color.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "The shop on Sumner has <strong>the lowest</strong> price. But it is <strong>farther</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Vendor", avatar: "🧑🏾", text: "Buy here and save the bus fare. It is <strong>the better</strong> deal today.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Fine. I\'ll take two bundles. The smallest two-bedroom apartment is on the list, but the cheapest one is near the 111 bus.", side: "right", tone: "terracotta" },
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
            <span><em>"<strong>The cheapest</strong> 2BR apartment near the 111 bus. <strong>More</strong> space, <strong>less</strong> rent."</em></span>
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
              label: "\"This apartment is the cheapest 2BR near the 111 bus.\"",
              options: [
                { value: "a", label: "This apartment is cheaper than one other apartment." },
                { value: "b", label: "This apartment costs less than all other 2BRs near the 111 bus." },
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
              label: "Rosa found ___ 2-bedroom on the list, but also ___ one near the bus. (small, cheap)",
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
  // MINI QUIZ. 10 questions
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
      question: "Kevin is showing three phone plans. Which sentence is correct?",
      options: [
        { value: "a", label: "Plan C is the most cheapest." },
        { value: "b", label: "Plan C is cheapest." },
        { value: "c", label: "Plan C is the cheapest." },
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
      question: "Fill in the blank: \"Plan B is ___ expensive than Plan A.\" (Long adjective comparative — don't add -er.)",
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
      question: "Carlos compares phone plans at the store. Put the words in order.",
      words: ["Plan", "C", "is", "the", "cheapest"],
      correctAnswer: "Plan C is the cheapest",
      hint: "superlatives need 'the'",
      explanation: "Superlatives always need 'the' before them. 'Plan C is the cheapest' ranks it above all others in the group.",
      topic: "superlative-form",
      skill: "usage",
      skillTag: "double-superlative-error",
      difficulty: "medium",
    },
    {
      id: "mlm-q5",
      question: "Diego says: \"We need fewer problems with the landlord.\" Why is 'fewer' correct here?",
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
