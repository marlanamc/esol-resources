import type { InteractiveGuideContent } from "@/types/activity";
import { yourWeekInEnglishImages as img } from "@/data/your-week-in-english-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (copied from welcome-back-tenses-review.ts)
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

export const yourWeekInEnglishContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // -----------------------------------------------------------------------
    // SECTION 1. Adverbs of Frequency
    // -----------------------------------------------------------------------
    {
      id: "adverbs-of-frequency",
      stepNumber: 1,
      title: "How often do you...?",
      icon: "📅",
      explanation: `
        ${sceneCard("sceneAfterClass", "Outside the community center, Tuesday evening. Rosa came to class 30 minutes late.", "terracotta")}

        ${dialogue([
          { speaker: "Fatima", avatar: "🧕🏾", text: "Rosa! You're <strong>never</strong> late. What happened tonight?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "The 116. I <strong>always</strong> take it at 5:15, but tonight I waited 40 minutes.", side: "right", tone: "terracotta" },
          { speaker: "Fatima", avatar: "🧕🏾", text: "It's detoured this week. The stop moved two blocks up, next to the pharmacy.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "How do you know that?", side: "right", tone: "terracotta" },
          { speaker: "Fatima", avatar: "🧕🏾", text: "The MBTA app. I <strong>usually</strong> check it before I leave at 5:30. Don't you?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>never</strong> use apps for the bus. I just walk to the stop and wait.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Adverbs of frequency</strong> tell us how often something happens. They go <strong>before</strong> the main verb, but <strong>after</strong> the verb <em>be</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("100%", "terracotta")}
            <span><em>I <strong>always</strong> take the bus on Tuesdays.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("~80%", "terracotta")}
            <span><em>She <strong>usually</strong> checks the app before she leaves.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("~60%", "amber")}
            <span><em>They <strong>often</strong> take the same bus to class.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("~40%", "amber")}
            <span><em>He <strong>sometimes</strong> misses the bus.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("~10%", "sage")}
            <span><em>We <strong>rarely</strong> take a taxi.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("0%", "sage")}
            <span><em>I <strong>never</strong> click links in strange texts.</em></span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.9rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0 0 0.4rem 0; font-weight: 700; font-size: 0.9rem">Position rule</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem">Before a main verb: I <strong>always</strong> <em>take</em> the bus.</p>
          <p style="margin: 0; font-size: 0.95rem">After the verb <em>be</em>: She <strong>is</strong> <em>sometimes</em> late.</p>
        </div>
      `,
      tenseDiagram: {
        title: "Present Simple lives in the present zone",
        elements: [
          { id: "pres-simp-freq", type: "multiple-dots", zone: "present", position: 50, verbLabel: "Present Simple" },
        ],
      },
      exercises: [
        {
          id: "freq-1",
          title: "Adverb position",
          items: [
            {
              type: "radio",
              label: "The 116 bus <strong>is always</strong> crowded at 5:30. Where does 'always' go in this sentence?",
              options: [
                { value: "correct", label: "Correct. After 'is' because 'be' comes first." },
                { value: "before", label: "Wrong. It should go before 'is'." },
                { value: "end", label: "Wrong. It should go at the end." },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "Fatima ___ checks the app and leaves home at 5:30. Which adverb means she does it about 80% of the time?",
              options: [
                { value: "always", label: "always" },
                { value: "usually", label: "usually" },
                { value: "rarely", label: "rarely" },
              ],
              expectedAnswer: "usually",
            },
            {
              type: "radio",
              label: "\"She sometimes is late.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Yes, it is correct." },
                { value: "incorrect", label: "No. With 'be', the adverb comes after: 'She is sometimes late.'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "freq-2",
          title: "Build the sentence",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Fatima", "never", "misses", "her", "English", "class"],
              correctAnswer: "Fatima never misses her English class",
            },
            {
              type: "text",
              label: "Fatima's husband drives a delivery truck. He ___ takes the bus. (Fill in the blank with an adverb meaning almost never.)",
              expectedAnswers: ["rarely"],
            },
          ],
        },
      ],
    },

    // -----------------------------------------------------------------------
    // SECTION 2. Present Simple for Routines
    // -----------------------------------------------------------------------
    {
      id: "present-simple-routines",
      stepNumber: 2,
      title: "I work, I take the bus, I don't drive",
      icon: "📝",
      explanation: `
        ${sceneCard("sceneForm", "Wednesday afternoon. Rosa fills out a sign-up form at the community center's tech help desk.", "sage")}

        ${dialogue([
          { speaker: "Megan", avatar: "👩🏼", text: "OK, Rosa. The form asks about your week. What does it look like?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>work</strong> Monday to Friday, 7 to 3, at an airport hotel. I <strong>come</strong> to class Tuesday and Thursday evenings.", side: "right", tone: "terracotta" },
          { speaker: "Megan", avatar: "👩🏼", text: "And how do you get to work?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>take</strong> the 116. I <strong>don't</strong> have a car. This week the bus is detoured, and I was late this morning.", side: "right", tone: "terracotta" },
          { speaker: "Megan", avatar: "👩🏼", text: "Then let's put the MBTA app on your phone. It <strong>shows</strong> you where the bus is right now.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Simple</strong> describes routines, habits, and facts that are true week after week.</p>
        </div>

        <div style="margin: 1rem 0">
          <p style="font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem">Positive</p>
          <div style="display: grid; gap: 0.4rem">
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              I / You / We / They + base verb: <em>I <strong>work</strong> every day.</em>
            </div>
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              He / She / It + verb + <strong>-s / -es</strong>: <em>She <strong>works</strong> every day.</em>
            </div>
          </div>

          <p style="font-weight: 700; margin: 0.75rem 0 0.5rem 0; font-size: 0.95rem">Negative</p>
          <div style="display: grid; gap: 0.4rem">
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              I / You / We / They: <em>I <strong>don't</strong> work on Sundays.</em>
            </div>
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              He / She / It: <em>She <strong>doesn't</strong> work on Sundays.</em>
            </div>
          </div>

          <p style="font-weight: 700; margin: 0.75rem 0 0.5rem 0; font-size: 0.95rem">Question</p>
          <div style="display: grid; gap: 0.4rem">
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              <em><strong>Do</strong> you work on Saturdays?</em>
            </div>
            <div style="padding: 0.4rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; font-size: 0.95rem">
              <em><strong>Does</strong> she work on Saturdays?</em>
            </div>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.9rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.9rem">Watch out</p>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem">With <em>doesn't</em>, the main verb goes back to the base form. She doesn't <strong>work</strong> (not <em>works</em>).</p>
        </div>
      `,
      tenseDiagram: {
        title: "Routines repeat in the present zone",
        elements: [
          { id: "pres-simp-routine", type: "multiple-dots", zone: "present", position: 50, verbLabel: "Present Simple" },
        ],
      },
      exercises: [
        {
          id: "ps-1",
          title: "Choose the correct form",
          items: [
            {
              type: "radio",
              label: "Rosa ___ to class on Tuesday and Thursday evenings. (come)",
              options: [
                { value: "come", label: "come" },
                { value: "comes", label: "comes" },
                { value: "is coming", label: "is coming" },
              ],
              expectedAnswer: "comes",
            },
            {
              type: "radio",
              label: "\"She don't have time for homework.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Yes, it is correct." },
                { value: "incorrect", label: "No. She is third person singular, so it should be 'She doesn't have.'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "___ Rosa take the bus to work?",
              options: [
                { value: "Do", label: "Do" },
                { value: "Does", label: "Does" },
                { value: "Is", label: "Is" },
              ],
              expectedAnswer: "Does",
            },
          ],
        },
        {
          id: "ps-2",
          title: "Build the sentence",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Rosa", "doesn't", "work", "on", "Sundays"],
              correctAnswer: "Rosa doesn't work on Sundays",
            },
            {
              type: "text",
              label: "She ___ (not / go) to class on Mondays. Use 'doesn't' + base verb.",
              expectedAnswers: ["doesn't go", "does not go"],
            },
          ],
        },
      ],
    },

    // -----------------------------------------------------------------------
    // SECTION 3. Time Expressions for Routines
    // -----------------------------------------------------------------------
    {
      id: "time-expressions",
      stepNumber: 3,
      title: "Every day, twice a week...",
      icon: "🗓️",
      explanation: `
        ${sceneCard("sceneWeeklySchedule", "Thursday morning on the bus. Rosa has the app now, and she's early. Then her phone buzzes.", "blue")}

        ${dialogue([
          { speaker: "Linh", avatar: "👩🏻", text: "Rosa! I'm on this bus <strong>every day</strong> with my English podcast. I never see you here.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "The app sent me to this stop. Hold on. I just got a text about an unpaid toll.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "A toll? Rosa, you don't have a car.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I know! But it says, \"Pay $6.95 today or pay a $50 late fee.\" There's a link.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "Don't touch it. I get those <strong>twice a week</strong>. Delete it and block the number.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Time expressions say <strong>when</strong> or <strong>how often</strong> something happens. They usually go at the <strong>beginning</strong> or <strong>end</strong> of a sentence.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("how often", "blue")}
            <span><em>I take the bus <strong>every day</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("how often", "blue")}
            <span><em>She gets fake toll texts <strong>twice a week</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("which day", "amber")}
            <span><em>He works <strong>on Saturdays</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("which day", "amber")}
            <span><em>We have class <strong>on Tuesdays and Thursdays</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("time of day", "terracotta")}
            <span><em><strong>In the morning</strong>, I check the bus app.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(74,144,226,0.06); border-radius: 0.4rem">
            ${labelPill("how often", "blue")}
            <span><em>She reloads her CharlieCard <strong>once a month</strong>.</em></span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.9rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.9rem">Notice</p>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem">Adverbs of frequency go <em>inside</em> the sentence (before the verb). Time expressions like <em>every day</em> or <em>on Mondays</em> go at the start or end.</p>
        </div>
      `,
      exercises: [
        {
          id: "te-1",
          title: "Choose the right phrase",
          items: [
            {
              type: "radio",
              label: "Linh listens to podcasts ___. Which phrase fits best?",
              options: [
                { value: "every day", label: "every day" },
                { value: "always every day", label: "always every day" },
                { value: "in every day", label: "in every day" },
              ],
              expectedAnswer: "every day",
            },
            {
              type: "radio",
              label: "Rosa reloads her CharlieCard ___. Which phrase means one time per month?",
              options: [
                { value: "twice a week", label: "twice a week" },
                { value: "once a month", label: "once a month" },
                { value: "on Tuesdays", label: "on Tuesdays" },
              ],
              expectedAnswer: "once a month",
            },
            {
              type: "radio",
              label: "\"In the morning I check the bus app.\" Is the time expression in the right place?",
              options: [
                { value: "yes", label: "Yes. Time expressions can go at the start of the sentence." },
                { value: "no", label: "No. Time expressions can only go at the end." },
              ],
              expectedAnswer: "yes",
            },
          ],
        },
        {
          id: "te-2",
          title: "Build the sentence",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Linh", "listens", "to", "podcasts", "every", "day", "on", "the", "bus"],
              correctAnswer: "Linh listens to podcasts every day on the bus",
            },
            {
              type: "text",
              label: "Rosa doesn't work ___ Saturdays. (Use one preposition.)",
              expectedAnswers: ["on"],
            },
          ],
        },
      ],
    },

    // -----------------------------------------------------------------------
    // SECTION 4. Present Perfect callback: "I've already..."
    // -----------------------------------------------------------------------
    {
      id: "already-this-week",
      stepNumber: 4,
      title: "This week I've already...",
      icon: "✅",
      explanation: `
        ${sceneCard("sceneFriday", "The hotel break room, Friday afternoon. Rosa and her coworker Jean finish their shift.", "amber")}

        ${dialogue([
          { speaker: "Jean", avatar: "👨🏿", text: "Rosa, you were here at 7 today. What happened?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I have the bus app now. Good thing, because this week I <strong>have already been</strong> late twice.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "👨🏿", text: "Only twice? I <strong>have already worked</strong> three ten-hour shifts. I don't even know what day it is.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "It's Friday, Jean. Go home and sleep.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">You saw <strong>already</strong> in the Week 5 guide. Here it shows up again. When something is finished <em>this week</em> or <em>today</em>, English uses <strong>have/has + already + V3</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("already done", "sage")}
            <span><em>I <strong>have already worked</strong> three shifts this week.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("already done", "sage")}
            <span><em>She <strong>has already finished</strong> her homework.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("already done", "sage")}
            <span><em>He <strong>has already gone</strong> to the new bus stop twice this week.</em></span>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.9rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.9rem">Remember from Week 5</p>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem">I / You / We / They use <strong>have</strong>. He / She / It uses <strong>has</strong>. The main verb is always V3 (worked, gone, done, finished).</p>
        </div>
      `,
      tenseDiagram: {
        title: "Already: finished before now, still relevant",
        elements: [
          { id: "pp-arc", type: "arc", zone: "past", position: 55, verbLabel: "already finished (before NOW)" },
        ],
      },
      exercises: [
        {
          id: "already-1",
          title: "Have or has?",
          items: [
            {
              type: "radio",
              label: "Jean ___ already worked three shifts this week.",
              options: [
                { value: "have", label: "have" },
                { value: "has", label: "has" },
                { value: "is", label: "is" },
              ],
              expectedAnswer: "has",
            },
            {
              type: "radio",
              label: "\"I have already went to class today.\" What is wrong?",
              options: [
                { value: "correct", label: "Nothing is wrong." },
                { value: "incorrect", label: "Not correct. V3 of 'go' is 'gone', not 'went'. Should be: 'I have already gone.'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "text",
              label: "Jean ___ already worked three shifts this week.",
              expectedAnswers: ["has"],
            },
          ],
        },
        {
          id: "already-2",
          title: "Build the sentence",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "has", "already", "finished", "her", "homework", "this", "week"],
              correctAnswer: "She has already finished her homework this week",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was a quick look at the present perfect with <em>already</em>. For the full guide with more examples, more exercises, and the complete explanation, open the <a href=\"/grammar-reader/present-perfect\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Guide</a>.",
      },
    },

    // -----------------------------------------------------------------------
    // SECTION 5. Putting it all together
    // -----------------------------------------------------------------------
    {
      id: "my-weekly-routine",
      stepNumber: 5,
      title: "My Weekly Routine",
      icon: "🌟",
      explanation: `
        ${sceneCard("sceneNeighbors", "Outside Rosa's building on Meridian Street, Saturday evening. Her neighbor Valentina stops her.", "terracotta")}

        ${dialogue([
          { speaker: "Valentina", avatar: "👩🏾", text: "Rosa, wait. I got a text. It says I owe $6.95 for a toll. Should I pay it?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Do you have a car?", side: "right", tone: "terracotta" },
          { speaker: "Valentina", avatar: "👩🏾", text: "No. I <strong>always</strong> take the bus. And I missed class Thursday. The 116 <strong>never</strong> came.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "It's detoured. The stop is next to the pharmacy this week. I <strong>usually</strong> check the app now.", side: "right", tone: "terracotta" },
          { speaker: "Valentina", avatar: "👩🏾", text: "You? The app? On Tuesday you didn't even have it.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "A lot can change in a week. And that text is fake. I <strong>have already deleted</strong> mine.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Put it all together: <strong>adverbs of frequency</strong> + <strong>present simple</strong> + <strong>time expressions</strong> + <strong>already</strong> = a full picture of your week.</p>
        </div>

        <div style="margin: 1rem 0; padding: 1rem 1.25rem; background: rgba(176,87,64,0.05); border-radius: 0.5rem; border: 1px solid rgba(176,87,64,0.15)">
          <p style="font-weight: 700; margin: 0 0 0.6rem 0; font-size: 0.95rem">Rosa's week, in her own words:</p>
          <p style="margin: 0; line-height: 1.75; font-size: 0.95rem">
            I work five days a week at a hotel by the airport. I <strong>always</strong> take the 116 <strong>in the morning</strong>.
            I come to English class <strong>twice a week</strong>, <strong>on Tuesdays and Thursdays</strong>.
            This week the bus was detoured, and I <strong>have already been</strong> late twice.
            Now I <strong>usually</strong> check the app before I leave. I <strong>never</strong> click links in texts about tolls. I don't even have a car.
          </p>
        </div>
      `,
      exercises: [
        {
          id: "wrap-1",
          title: "Putting it together",
          items: [
            {
              type: "radio",
              label: "Which sentence uses all the right grammar?",
              options: [
                { value: "a", label: "She always is cook dinner every day." },
                { value: "b", label: "She always cooks dinner every day." },
                { value: "c", label: "She cooks always dinner every day." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Valentina missed class Thursday. She has already ___ to class once this week, on Tuesday. (go)",
              options: [
                { value: "gone", label: "gone (V3)" },
                { value: "went", label: "went (past simple)" },
                { value: "go", label: "go (base form)" },
              ],
              expectedAnswer: "gone",
            },
            {
              type: "radio",
              label: "\"This week she has already finished her homework.\" Which part of this sentence uses present perfect?",
              options: [
                { value: "a", label: "This week" },
                { value: "b", label: "has already finished" },
                { value: "c", label: "her homework" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "This week Valentina ___ already gone to class once.",
              expectedAnswers: ["has"],
            },
          ],
        },
        {
          id: "wrap-2",
          title: "Build the sentences",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "usually", "clean", "the", "house", "on", "Saturdays"],
              correctAnswer: "I usually clean the house on Saturdays",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["He", "has", "already", "worked", "three", "shifts", "this", "week"],
              correctAnswer: "He has already worked three shifts this week",
            },
          ],
        },
      ],
      tipBox: {
        title: "Great work this week",
        content: "You now know how to talk about your weekly routine in English using adverbs of frequency, present simple, time expressions, and already. Next: giving directions and using imperatives.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "your-week-q1",
      question: "Jean asks Rosa about her coffee habit at work. Which answer is correct?",
      options: [
        { value: "a", label: "I drink always coffee at work." },
        { value: "b", label: "I always drink coffee at work." },
        { value: "c", label: "Always I drink coffee at work." },
      ],
      correctAnswer: "b",
      explanation: "Adverbs of frequency go before the main verb: I always drink.",
      topic: "adverbs-of-frequency",
      skill: "usage",
      skillTag: "adverb-position",
      difficulty: "easy",
    },
    {
      id: "your-week-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Rosa ___ to class on Tuesdays and Thursdays.\" (come: he/she/it form)",
      correctAnswer: "comes",
      explanation: "With he/she/it in present simple, add -s: come → comes.",
      topic: "present-simple",
      skill: "usage",
      skillTag: "third-person-s",
      difficulty: "easy",
    },
    {
      id: "your-week-q3",
      question: "\"She don't work on Sundays.\" What is wrong with this sentence?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "Should be 'doesn't' because 'she' is third person singular." },
        { value: "c", label: "Should be 'didn't' because it happened in the past." },
      ],
      correctAnswer: "b",
      explanation: "With he/she/it in present simple negatives, use doesn't, not don't.",
      topic: "present-simple",
      skill: "error-detection",
      skillTag: "doesnt-dont",
      difficulty: "easy",
    },
    {
      id: "your-week-qws1",
      type: "word-scramble" as const,
      question: "Fatima describes her trip to class. Put the words in order.",
      words: ["She", "usually", "leaves", "home", "at", "5:30"],
      correctAnswer: "She usually leaves home at 5:30",
      hint: "Adverbs of frequency go before the main verb",
      explanation: "Usually goes before the main verb: She usually leaves.",
      topic: "adverbs-of-frequency",
      skill: "usage",
      skillTag: "adverb-position",
      difficulty: "medium",
    },
    {
      id: "your-week-q9",
      question: "Rosa says about the 116 this week: \"It is always late.\" Where does 'always' go in this sentence?",
      options: [
        { value: "a", label: "It should go before 'is': It always is late." },
        { value: "b", label: "It should go at the end: It is late always." },
        { value: "c", label: "It is in the right place. With 'be', the adverb comes after." },
      ],
      correctAnswer: "c",
      explanation: "After the verb 'be', adverbs of frequency follow it: It is always late.",
      topic: "adverbs-of-frequency",
      skill: "usage",
      skillTag: "adverb-position-be",
      difficulty: "medium",
    },
  ],
};
