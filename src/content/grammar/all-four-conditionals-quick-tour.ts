import type { InteractiveGuideContent } from "@/types/activity";
import { allFourConditionalsQuickTourImages as img } from "@/data/all-four-conditionals-quick-tour-images.generated";

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

export const allFourConditionalsQuickTourContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - If I Lift Wrong, My Back Hurts
    // =========================================================================
    {
      id: "zero-lift-wrong",
      title: "If I Lift Wrong, My Back Hurts",
      icon: "📋",
      tenseDiagram: {
        title: "Zero conditional: always true",
        elements: [
          { id: "zero-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "if + present" },
          { id: "zero-result", type: "multiple-dots", zone: "present", position: 65, verbLabel: "result (present)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneWarehouseLift", "Warehouse loading dock, Chelsea. Monday, 7 AM.", "terracotta")}

        <p><strong>Yemi</strong> works as a packer at a warehouse in Chelsea. After her knee got worse last month, supervisor <strong>Brian</strong> reviews lifting rules before she returns to pallets.</p>

        ${dialogue([
          { speaker: "Brian", avatar: "🧑🏼", text: "Before you lift again, remember the rules. <strong>If you lift</strong> with your back, <strong>you hurt</strong> yourself.", side: "left", tone: "blue" },
          { speaker: "Yemi", avatar: "👩🏿", text: "I know. I learned that the hard way.", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏼", text: "<strong>If you bend</strong> at the waist, <strong>you risk</strong> injury. Use your legs.", side: "left", tone: "blue" },
          { speaker: "Yemi", avatar: "👩🏿", text: "OK. <strong>If I lift</strong> wrong, my back <strong>hurts</strong>. That's always true.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Zero conditional</strong> = a fact or rule that is always true. Both verbs are present simple.<br/><em>If + present, present.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> I <strong>lift</strong> wrong, my back <strong>hurts</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("rule", "sage")}
            <span><em><strong>If</strong> you <strong>bend</strong> at the waist, you <strong>risk</strong> injury.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Zero or first?",
          instructions: "Choose the sentence that fits the meaning.",
          items: [
            {
              type: "radio",
              label: "Brian explains another safety rule that is always true. Which sentence fits?",
              options: [
                { value: "a", label: "If you skip your break, you will get tired." },
                { value: "b", label: "If you skip your break, you get tired." },
                { value: "c", label: "If you skipped your break, you would get tired." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is the zero conditional?",
              options: [
                { value: "a", label: "If the freezer door stays open, the food will spoil tonight." },
                { value: "b", label: "If the freezer door stayed open, the food would spoil." },
                { value: "c", label: "If the freezer door stays open, the food spoils." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the present simple verb.",
          items: [
            {
              type: "text",
              label: "If you bend at the waist, you ___ (risk) injury.",
              expectedAnswers: ["risk"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build a zero conditional about Yemi's knee:",
              words: ["If", "you", "lift", "wrong,", "your", "back", "hurts"],
              correctAnswer: "If you lift wrong, your back hurts",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - If the Clinic Opens at 8, I'll Go
    // =========================================================================
    {
      id: "first-clinic-plan",
      title: "If the Clinic Opens at 8, I'll Go",
      icon: "📅",
      tenseDiagram: {
        title: "First conditional: real future plan",
        elements: [
          { id: "first-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "if + present" },
          { id: "first-will", type: "single-dot", zone: "future", position: 65, verbLabel: "will + verb" },
        ],
      },
      explanation: `
        ${sceneCard("sceneEarlyMorning", "Yemi's kitchen, Chelsea. Saturday, 6:30 AM.", "amber")}

        <p>Yemi finally plans to see a doctor about her knee. She checks the clinic hours on her phone before her shift.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If the clinic opens</strong> at 8, <strong>I'll go</strong> before work.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If the line is</strong> short, <strong>I'll be</strong> back by noon.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "Walk-ins start at 8. Text me when you arrive.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If they can't see</strong> me, <strong>I'll try</strong> the walk-in downtown.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>First conditional</strong> = a real situation that might happen. The result is in the future.<br/><em>If + present, will + base verb.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real plan", "amber")}
            <span><em><strong>If</strong> the clinic <strong>opens</strong> at 8, I <strong>'ll go</strong> before work.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("not zero", "terracotta")}
            <span><em>Zero = always true. First = might happen: <strong>I'll go</strong>, not <strong>I go</strong>.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "First or zero?",
          instructions: "Pick the correct form.",
          items: [
            {
              type: "radio",
              label: "After the clinic, Yemi has a real plan for the bus ride home. Which sentence fits?",
              options: [
                { value: "a", label: "If the bus comes on time, I'll get home by noon." },
                { value: "b", label: "If the bus comes on time, I get home by noon." },
                { value: "c", label: "If the bus came on time, I would get home by noon." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Find the error: \"If the clinic will open at 8, I'll go.\"",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: no will in the if-clause. Should be \"If the clinic opens...\"" },
                { value: "c", label: "Error: should be \"If the clinic opened...\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the blank",
          instructions: "Write'll or will.",
          items: [
            {
              type: "text",
              label: "If the line is short, I ___ be back by noon.",
              expectedAnswers: ["'ll", "will"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Yemi's plan for her early shift:",
              words: ["If", "the", "clinic", "opens", "early,", "I'll", "go", "before", "my", "shift"],
              correctAnswer: "If the clinic opens early, I'll go before my shift",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - If I Had Day Shifts, I Would Sleep More
    // =========================================================================
    {
      id: "second-day-shifts",
      title: "If I Had Day Shifts, I Would Sleep More",
      icon: "🌙",
      tenseDiagram: {
        title: "Second conditional: imaginary now",
        elements: [
          { id: "sc-if", type: "single-dot", zone: "past", position: 35, verbLabel: "if + past simple (imaginary)" },
          { id: "sc-would", type: "single-dot", zone: "future", position: 65, verbLabel: "would + verb (imaginary)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBreakRoomNight", "Warehouse break room. Sunday night, 11:30 PM.", "blue")}

        <p>After close, Yemi and coworker <strong>Rachel</strong> compare schedules. Yemi works nights and misses her kids' bedtime. Rachel leaves early Fridays for Shabbat.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If I had</strong> day shifts, I <strong>would sleep</strong> more.", side: "right", tone: "terracotta" },
          { speaker: "Rachel", avatar: "👩🏻", text: "I leave early Fridays for Shabbat. <strong>If my schedule were</strong> different, I <strong>wouldn't miss</strong> bedtime either.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Night shifts pay more, but I'm always tired.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Second conditional</strong> = an imaginary situation now. The verb after <em>if</em> looks like past tense, but it is not about the real past.<br/><em>If + past simple, would + base verb.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("imaginary", "blue")}
            <span><em><strong>If</strong> I <strong>had</strong> day shifts, I <strong>would sleep</strong> more.</em> (She has night shifts.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("not first", "amber")}
            <span><em>First = real plan (<strong>I'll go</strong>). Second = wish (<strong>I would sleep</strong>).</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Second or first?",
          instructions: "Choose the best form.",
          items: [
            {
              type: "radio",
              label: "Rachel wishes she lived closer to the warehouse. She does not. Which sentence fits?",
              options: [
                { value: "a", label: "If I live closer, I'll save an hour every day." },
                { value: "b", label: "If I had lived closer, I would have saved an hour." },
                { value: "c", label: "If I lived closer, I would save an hour every day." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Find the error: \"If I would have day shifts, I would sleep more.\"",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: no would in the if-clause. Should be \"If I had day shifts...\"" },
                { value: "c", label: "Error: should be \"If I have day shifts...\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the blank",
          instructions: "Write would or were.",
          items: [
            {
              type: "text",
              label: "If my schedule ___ different, I wouldn't miss bedtime.",
              expectedAnswers: ["were"],
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Yemi's wish about her weekends:",
              words: ["If", "I", "had", "weekends", "off,", "I", "would", "see", "my", "kids", "more"],
              correctAnswer: "If I had weekends off, I would see my kids more",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - If I Had Gone Sooner, I Would Have Paid Less
    // =========================================================================
    {
      id: "third-gone-sooner",
      title: "If I Had Gone Sooner, I Would Have Paid Less",
      icon: "🏥",
      tenseDiagram: {
        title: "Third conditional: different past that did not happen",
        elements: [
          { id: "tc-if", type: "arc", zone: "past-earlier", position: 30, verbLabel: "if + had + V3" },
          { id: "tc-result", type: "single-dot", zone: "past-later", position: 65, verbLabel: "would have + V3" },
        ],
      },
      explanation: `
        ${sceneCard("sceneClinicBilling", "Clinic billing desk, East Boston. Saturday, 10 AM.", "sage")}

        <p>After her visit, Yemi sees the copay and thinks about the shifts she missed waiting too long. She talked about this with <strong>Ms. Patel</strong> last week too.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If I had called</strong> last week, I <strong>wouldn't have missed</strong> three shifts.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩🏽", text: "You're here now. That's what matters.", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If I had gone</strong> sooner, I <strong>would have paid</strong> less in lost wages.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Third conditional</strong> = a past choice and a different past result that did <em>not</em> happen. You cannot change it now.<br/><em>If + past perfect, would have + V3.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("did not happen", "blue")}
            <span><em><strong>If</strong> I <strong>had gone</strong> sooner, I <strong>would have paid</strong> less.</em> (She went late.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("not second", "amber")}
            <span><em>Second = <strong>had</strong> + base verb (now). Third = <strong>had gone</strong> / <strong>had called</strong> (past).</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Third or second?",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "Last month Yemi lifted a heavy box alone and hurt her knee. Which sentence fits her regret?",
              options: [
                { value: "a", label: "If I asked for help, I wouldn't hurt my knee." },
                { value: "b", label: "If I ask for help, I don't hurt my knee." },
                { value: "c", label: "If I had asked for help, I wouldn't have hurt my knee." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Find the error: \"If I would have gone sooner, I would have paid less.\"",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: no would in the if-clause. Should be \"If I had gone sooner...\"" },
                { value: "c", label: "Error: should be \"If I had day shifts...\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Fill in the blank",
          instructions: "Write had.",
          items: [
            {
              type: "text",
              label: "If I ___ gone sooner, I would have paid less.",
              expectedAnswers: ["had"],
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Yemi's regret about her knee:",
              words: ["If", "I", "had", "rested", "my", "knee,", "I", "would", "have", "healed", "faster"],
              correctAnswer: "If I had rested my knee, I would have healed faster",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - One Bad Week: All Four Together
    // =========================================================================
    {
      id: "one-bad-week",
      title: "One Bad Week: All Four Together",
      icon: "📚",
      explanation: `
        ${sceneCard("sceneEveningClass", "Evening ESOL class, East Boston. Thursday, 7 PM.", "sage")}

        <p>Yemi tells classmate <strong>Djamila</strong> about her bad week — a back injury, a clinic trip, and a billing mistake.</p>

        ${dialogue([
          { speaker: "Djamila", avatar: "👩🏾", text: "Rough week?", side: "left", tone: "sage" },
          { speaker: "Yemi", avatar: "👩🏿", text: "<strong>If I lift</strong> wrong, my back <strong>hurts</strong>. Brian reminded me Monday.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Saturday: <strong>If the clinic opens</strong> at 8, <strong>I'll go</strong>. I did.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Sunday night: <strong>If I had</strong> day shifts, I <strong>would sleep</strong> more.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "At billing: <strong>If I had gone</strong> sooner, I <strong>would have paid</strong> less.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Zero</strong> = always true &nbsp;|&nbsp;
            <strong>First</strong> = real future &nbsp;|&nbsp;
            <strong>Second</strong> = imaginary now &nbsp;|&nbsp;
            <strong>Third</strong> = imaginary past
          </p>
        </div>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick tour. For full explanations and more practice, open the <a href=\"/grammar-reader/conditionals-zero-first\" style=\"font-weight:700;text-decoration:underline\">Zero + First Conditionals Full Guide</a> and the <a href=\"/grammar-reader/conditionals-second-third\" style=\"font-weight:700;text-decoration:underline\">Second and Third Conditionals Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right conditional",
          instructions: "Read each new situation and match the meaning.",
          items: [
            {
              type: "radio",
              label: "Djamila works in a kitchen. A safety rule that is always true.",
              options: [
                { value: "a", label: "If you touched the grill, you would burn your hand." },
                { value: "b", label: "If you touch the grill, you will burn your hand." },
                { value: "c", label: "If you touch the grill, you burn your hand." },
                { value: "d", label: "If you had touched the grill, you would have burned your hand." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Djamila's real plan for payday on Friday.",
              options: [
                { value: "a", label: "If I get paid Friday, I'll buy my monthly bus pass." },
                { value: "b", label: "If I got paid Friday, I would buy my monthly bus pass." },
                { value: "c", label: "If I get paid Friday, I buy my monthly bus pass." },
                { value: "d", label: "If I had been paid Friday, I would have bought my monthly bus pass." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Djamila's apartment is an hour from work. Her wish (not real now).",
              options: [
                { value: "a", label: "If I live near work, I'll walk every day." },
                { value: "b", label: "If I live near work, I walk every day." },
                { value: "c", label: "If I had lived near work, I would have walked every day." },
                { value: "d", label: "If I lived near work, I would walk every day." },
              ],
              expectedAnswer: "d",
            },
            {
              type: "radio",
              label: "Last winter Djamila skipped the flu shot and got sick. Her regret.",
              options: [
                { value: "a", label: "If I get the flu shot, I don't get sick." },
                { value: "b", label: "If I had gotten the flu shot, I wouldn't have been sick for a week." },
                { value: "c", label: "If I got the flu shot, I wouldn't be sick." },
                { value: "d", label: "If I will get the flu shot, I won't be sick." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If I lift wrong, my back hurts." },
                { value: "b", label: "If the clinic opens at 8, I'll go." },
                { value: "c", label: "If I would have day shifts, I would sleep more." },
                { value: "d", label: "If I had gone sooner, I would have paid less." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Past regret: If I ___ (go) sooner, I would have paid less.",
              expectedAnswers: ["had gone"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Yemi's regret about the billing mistake (third conditional):",
              words: ["If", "I", "had", "checked", "the", "bill,", "I", "would", "have", "caught", "the", "mistake"],
              correctAnswer: "If I had checked the bill, I would have caught the mistake",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "afc-q3",
      question: "Yemi has a real plan for after her appointment tomorrow. Which sentence fits?",
      options: [
        { value: "a", label: "If the doctor gives me a note, I'll bring it to work tomorrow." },
        { value: "b", label: "If the doctor gives me a note, I bring it to work tomorrow." },
        { value: "c", label: "If the doctor gave me a note, I would bring it to work." },
        { value: "d", label: "If the doctor had given me a note, I would have brought it to work." },
      ],
      correctAnswer: "a",
      explanation: "Real future plan = first conditional: if + present, will.",
      topic: "first-conditional",
      skill: "usage",
      skillTag: "clinic-plan-context",
      difficulty: "easy",
    },
    {
      id: "afc-q5",
      question: "Rachel says: 'If I earned more, I would move to a bigger apartment.' What do we know about Rachel?",
      options: [
        { value: "a", label: "She earns enough and is moving soon." },
        { value: "b", label: "She moved to a bigger apartment last year." },
        { value: "c", label: "She does not earn enough now. The move is imaginary." },
        { value: "d", label: "She will earn more next month for sure." },
      ],
      correctAnswer: "c",
      explanation: "Second conditional describes an imaginary situation now. The past-looking verb (earned) does not mean real past.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "second-conditional-meaning",
      difficulty: "hard",
    },
    {
      id: "afc-fb1",
      type: "fill-blank" as const,
      question: "Brian posts a rule in the break room. It is always true. Complete it: \"If the warehouse door stays open, the loading dock ___ (get) cold.\"",
      correctAnswer: "gets",
      explanation: "Zero conditional: if + present simple, present simple. Used for facts and rules.",
      topic: "zero-conditional",
      skill: "usage",
      skillTag: "meaning-always-true",
      difficulty: "easy",
    },
    {
      id: "afc-q6",
      question: "Find the error: \"If I would have asked for lighter boxes, I would not have hurt my back.\"",
      options: [
        { value: "a", label: "No error. The sentence is correct." },
        { value: "b", label: "The if-part should be \"If I had asked for lighter boxes\"." },
        { value: "c", label: "The if-part should be \"If I ask for lighter boxes\"." },
        { value: "d", label: "The result should be \"I will not hurt my back\"." },
      ],
      correctAnswer: "b",
      explanation: "Third conditional never uses would in the if-part: if + had + V3, would have + V3.",
      topic: "third-conditional",
      skill: "error-detection",
      skillTag: "third-conditional-no-would-in-if",
      difficulty: "hard",
    },
    {
      id: "afc-ws1",
      type: "word-scramble" as const,
      question: "Yemi does not have a car. She imagines a different life. Put the words in order to build her sentence.",
      words: ["If", "I", "had", "a", "car", "I", "would", "drive", "to", "work"],
      correctAnswer: "If I had a car I would drive to work",
      hint: "second conditional: if + past simple, would + base verb",
      explanation: "Second conditional uses if + past simple for imaginary situations now.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "second-conditional-word-order",
      difficulty: "medium",
    },
  ],
};
