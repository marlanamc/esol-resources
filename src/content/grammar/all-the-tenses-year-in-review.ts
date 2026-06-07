import type { InteractiveGuideContent } from "@/types/activity";
import { allTheTensesYearInReviewImages as img } from "@/data/all-the-tenses-year-in-review-images.generated";

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

export const allTheTensesYearInReviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - One Year, Eleven Tenses
    // =========================================================================
    {
      id: "one-year-eleven-tenses",
      title: "One Year, Eleven Tenses",
      icon: "📅",
      tenseDiagram: {
        title: "Where your tenses live on the timeline",
        elements: [
          { id: "pp-earlier", type: "arc", zone: "past-earlier", position: 15, verbLabel: "Past Perfect" },
          { id: "past-cont", type: "solid-line", zone: "past", position: 30, verbLabel: "Past Cont." },
          { id: "past-simp", type: "single-dot", zone: "past", position: 55, verbLabel: "Past Simple" },
          { id: "pres-simp", type: "multiple-dots", zone: "present", position: 48, verbLabel: "Pres. Simple" },
          { id: "pres-cont", type: "solid-line", zone: "present", position: 52, verbLabel: "Pres. Cont." },
          { id: "pres-perf", type: "arc", zone: "past", position: 46, verbLabel: "Pres. Perfect" },
          { id: "ppc-line", type: "solid-to-now", zone: "past", position: 30, verbLabel: "Pres. Perf. Cont." },
          { id: "fut-simp", type: "single-dot", zone: "future", position: 62, verbLabel: "Future Simple" },
          { id: "fut-cont", type: "solid-line", zone: "future", position: 72, verbLabel: "Future Cont." },
          { id: "fut-perf", type: "arc-dashed", zone: "future", position: 82, verbLabel: "Future Perfect" },
          { id: "fpc-line", type: "solid-to-point", zone: "future", position: 90, verbLabel: "Fut. Perf. Cont." },
        ],
      },
      explanation: `
        ${sceneCard("sceneEveningClass", "East Boston evening ESOL class. Thursday, June 5, 7 PM.", "sage")}

        <p><strong>Ms. Tran</strong> stands at the front of the room. It is the last class of the year. She asks the class to look back at September and ahead to fall.</p>

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "You <strong>started</strong> this class in September. You <strong>have been studying</strong> all year. What <strong>will</strong> you do next?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>work</strong> lunch shifts, do hotel laundry on Saturdays, and <strong>take</strong> this class twice a week.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Right now I <strong>am tired</strong>, but I <strong>will enroll</strong> in Level 4 in September.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "Same. By August I <strong>will have finished</strong> Level 3.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem"><strong>Eleven tenses, one timeline.</strong> You used all of these in real life this year.</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>Simple</strong> = fact or finished. <strong>Continuous</strong> = in progress. <strong>Perfect</strong> = connected to a reference point. <strong>Past perfect</strong> = before another past event. <strong>Future perfect</strong> = done <em>by</em> a future date.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("every Tuesday", "terracotta")}
            <span><em>I <strong>take</strong> the 121 every Tuesday.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("right now", "blue")}
            <span><em>I <strong>am sitting</strong> in class right now.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("by August", "amber")}
            <span><em>By August I <strong>will have finished</strong> Level 3.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Which sentence fits?",
          instructions: "Read the time indicator, then pick the best sentence.",
          items: [
            {
              type: "radio",
              label: "Rosa's schedule: she goes to class <strong>every Tuesday and Thursday</strong>.",
              options: [
                { value: "a", label: "She is taking class every Tuesday and Thursday." },
                { value: "b", label: "She takes class every Tuesday and Thursday." },
                { value: "c", label: "She took class every Tuesday and Thursday." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Right now, Rosa <strong>is in class</strong> and her phone is on silent.",
              options: [
                { value: "a", label: "She sits in class and her phone is on silent." },
                { value: "b", label: "She is sitting in class and her phone is on silent." },
                { value: "c", label: "She has sat in class and her phone is on silent." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "By August, Rosa ___ (finish) Level 3.",
              expectedAnswers: ["will have finished"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - Every Tuesday vs. Right Now
    // =========================================================================
    {
      id: "every-tuesday-vs-right-now",
      title: "Every Tuesday vs. Right Now",
      icon: "🔄",
      tenseDiagram: {
        title: "Present simple and present continuous",
        elements: [
          { id: "ps-dots", type: "multiple-dots", zone: "present", position: 42, verbLabel: "Present Simple" },
          { id: "pc-line", type: "solid-line", zone: "present", position: 58, verbLabel: "Present Continuous" },
        ],
      },
      explanation: `
        ${sceneCard("sceneRestaurantShift", "Taqueria on Meridian Street. Wednesday, 1:30 PM.", "terracotta")}

        <p>Rosa works lunch shifts at a restaurant on Meridian Street. Hotel laundry on Saturdays. ESOL class on Tuesday and Thursday evenings. Supervisor <strong>Jennifer</strong> covers the register when Rosa leaves at 3.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏼", text: "You <strong>leave</strong> at three today, right?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes. My daughter <strong>has</strong> a field trip tomorrow. I <strong>am texting</strong> the sitter now.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏼", text: "OK. I <strong>cover</strong> the register when you <strong>go</strong>. You <strong>always</strong> do that on Wednesdays.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Thanks. I <strong>am running</strong> late today, but I usually <strong>leave</strong> on time.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Simple</strong> = routines and facts. <strong>Present Continuous</strong> = happening right now or this week.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("routine", "terracotta")}
            <span><em>I <strong>work</strong> lunch shifts Monday through Friday.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("right now", "blue")}
            <span><em>I <strong>am texting</strong> the sitter about tomorrow.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Simple or continuous?",
          instructions: "Pick the form that fits the situation.",
          items: [
            {
              type: "radio",
              label: "Rosa ___ lunch shifts at the restaurant Monday through Friday. (work)",
              options: [
                { value: "works", label: "works" },
                { value: "is working", label: "is working" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "works",
            },
            {
              type: "radio",
              label: "Hold on. Rosa ___ the sitter right now. (text)",
              options: [
                { value: "texts", label: "texts" },
                { value: "is texting", label: "is texting" },
                { value: "has texted", label: "has texted" },
              ],
              expectedAnswer: "is texting",
            },
            {
              type: "text",
              label: "Jennifer usually ___ the register when Rosa leaves. (cover)",
              expectedAnswers: ["covers"],
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Rosa", "is", "texting", "the", "sitter", "about", "the", "field", "trip"],
              correctAnswer: "Rosa is texting the sitter about the field trip",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - What Happened, What Was Already Done
    // =========================================================================
    {
      id: "what-happened-already-done",
      title: "What Happened, What Was Already Done",
      icon: "⏪",
      tenseDiagram: {
        title: "Past simple, past continuous, and past perfect",
        elements: [
          { id: "pp-dot", type: "arc", zone: "past-earlier", position: 22, verbLabel: "Past Perfect" },
          { id: "past-cont-line", type: "solid-line", zone: "past", position: 38, verbLabel: "Past Continuous" },
          { id: "past-simp-dot", type: "single-dot", zone: "past", position: 62, verbLabel: "Past Simple" },
        ],
      },
      explanation: `
        ${sceneCard("sceneApartmentKitchen", "Rosa's apartment, Orient Heights. January 14, 11:45 PM.", "blue")}

        <p>Rosa tells her landlord what happened in January. She also remembers February, when she applied for warehouse work.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>was cooking</strong> when water <strong>came</strong> through the ceiling.", side: "right", tone: "terracotta" },
          { speaker: "Landlord", avatar: "🧑🏾", text: "You <strong>called</strong> me at midnight?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes. In February I <strong>applied</strong> for warehouse work. I <strong>had already</strong> saved for the bus pass.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>had worked</strong> in housekeeping for two years by then.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Simple</strong> = finished event. <strong>Past Continuous</strong> = in progress when something else happened. <strong>Past Perfect</strong> = already finished <em>before</em> another past event.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("in progress", "blue")}
            <span><em>I <strong>was cooking</strong> when the pipe burst.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("before that", "sage")}
            <span><em>I <strong>had already saved</strong> for the bus pass before I applied.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Pick the right past form",
          items: [
            {
              type: "radio",
              label: "Water ___ through the ceiling while Rosa was cooking. (come)",
              options: [
                { value: "came", label: "came" },
                { value: "was coming", label: "was coming" },
                { value: "had come", label: "had come" },
              ],
              expectedAnswer: "came",
            },
            {
              type: "radio",
              label: "Rosa ___ dinner when the pipe burst. (cook)",
              options: [
                { value: "cooked", label: "cooked" },
                { value: "was cooking", label: "was cooking" },
                { value: "had cooked", label: "had cooked" },
              ],
              expectedAnswer: "was cooking",
            },
            {
              type: "text",
              label: "She ___ (already save) for the bus pass before she applied.",
              expectedAnswers: ["had already saved", "had saved"],
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Find the error",
          items: [
            {
              type: "radio",
              label: "\"I was cooking when water <strong>was coming</strong> through the ceiling.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "came", label: "Should be 'came' (past simple for the burst)" },
                { value: "had come", label: "Should be 'had come' (past perfect)" },
              ],
              expectedAnswer: "came",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - From September Until Now
    // =========================================================================
    {
      id: "from-september-until-now",
      title: "From September Until Now",
      icon: "🔗",
      tenseDiagram: {
        title: "Present perfect and present perfect continuous",
        elements: [
          { id: "pres-perf-dot", type: "arc", zone: "past", position: 44, verbLabel: "Present Perfect" },
          { id: "ppc-line", type: "solid-to-now", zone: "past", position: 30, verbLabel: "Pres. Perf. Cont." },
        ],
      },
      explanation: `
        ${sceneCard("sceneVideoCall", "Hotel laundry room after a double shift. Wednesday, 9:30 PM.", "sage")}

        <p>Rosa video-calls her sister <strong>Teresa</strong> after folding sheets for six hours.</p>

        ${dialogue([
          { speaker: "Teresa", avatar: "👩🏽", text: "Still at work?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Just finished. I <strong>have lived</strong> here since 2021. I <strong>have worked</strong> at the restaurant for three years.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Since March I <strong>have been taking</strong> two buses. The car broke down.", side: "right", tone: "terracotta" },
          { speaker: "Teresa", avatar: "👩🏽", text: "You <strong>have learned</strong> a lot this year.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect</strong> = past connected to now (experience, change, duration with <em>for/since</em>). <strong>Present Perfect Continuous</strong> = ongoing action from past until now, often with <em>for/since</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("since 2021", "sage")}
            <span><em>I <strong>have lived</strong> in East Boston since 2021.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("since March", "sage")}
            <span><em>I <strong>have been taking</strong> two buses since the car broke down.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Perfect or perfect continuous?",
          items: [
            {
              type: "radio",
              label: "Rosa ___ in East Boston since 2021. (live)",
              options: [
                { value: "has lived", label: "has lived" },
                { value: "has been living", label: "has been living" },
                { value: "lived", label: "lived" },
              ],
              expectedAnswer: "has lived",
            },
            {
              type: "radio",
              label: "Since March she ___ two buses every day. (take)",
              options: [
                { value: "has taken", label: "has taken" },
                { value: "has been taking", label: "has been taking" },
                { value: "takes", label: "takes" },
              ],
              expectedAnswer: "has been taking",
            },
            {
              type: "text",
              label: "She ___ (work) at the restaurant for three years.",
              expectedAnswers: ["has worked", "has been working"],
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "been", "taking", "two", "buses", "since", "March"],
              correctAnswer: "I have been taking two buses since March",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - What's Next: All Four Future Tenses
    // =========================================================================
    {
      id: "whats-next-four-futures",
      title: "What's Next: All Four Future Tenses",
      icon: "➡️",
      tenseDiagram: {
        title: "All four future tenses",
        elements: [
          { id: "fs-dot", type: "single-dot", zone: "future", position: 55, verbLabel: "Future Simple" },
          { id: "fc-line", type: "solid-line", zone: "future", position: 65, verbLabel: "Future Continuous" },
          { id: "fp-dot", type: "arc-dashed", zone: "future", position: 78, verbLabel: "Future Perfect" },
          { id: "fpc-line", type: "solid-to-point", zone: "future", position: 88, verbLabel: "Fut. Perf. Cont." },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusHome", "121 bus toward Maverick Square. Thursday, 9:15 PM.", "amber")}

        <p>After the last class, Rosa texts classmate <strong>David</strong> on the 121. Pride flags hang on lampposts at Maverick Square. <strong>Milagros</strong> from the restaurant <strong>will bring</strong> empanadas to the end-of-year potluck Friday.</p>

        ${dialogue([
          { speaker: "David", avatar: "👨🏻", text: "Level 4 in the fall?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes. I <strong>will enroll</strong> in September. In September I <strong>will be taking</strong> class twice a week while I still work lunch shifts.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏽", text: "By August I <strong>will have finished</strong> Level 3. By tonight I <strong>will have been studying</strong> in evening ESOL for a full year.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "Same. Milagros <strong>will bring</strong> empanadas Friday. Potluck at work.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem"><strong>Future Simple</strong> = plan or prediction. <strong>Future Continuous</strong> = in progress at a future time. <strong>Future Perfect</strong> = done by a future date. <strong>Future Perfect Continuous</strong> = duration by a future date.</p>
        </div>

        <p style="margin: 1rem 0; line-height: 1.6; font-size: 0.98rem">Rosa looks out the window and thinks about her year. She <strong>was tired</strong> when class <strong>started</strong> in September. She <strong>has been studying</strong> all year. She <strong>takes</strong> this bus every Thursday. Tonight she <strong>is sitting</strong> next to a woman who <strong>has lived</strong> here <strong>since</strong> 2019.</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("plan", "amber")}
            <span><em>I <strong>will enroll</strong> in Level 4 in September.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("by August", "amber")}
            <span><em>By August I <strong>will have finished</strong> Level 3.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("by tonight", "amber")}
            <span><em>By tonight I <strong>will have been studying</strong> for a full year.</em></span>
          </div>
        </div>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content:
          "This was the quick review. For more examples and exercises, open the <a href=\"/grammar-reader/future-simple\" style=\"font-weight:700;text-decoration:underline\">Future Simple</a>, <a href=\"/grammar-reader/future-continuous\" style=\"font-weight:700;text-decoration:underline\">Future Continuous</a>, <a href=\"/grammar-reader/future-perfect\" style=\"font-weight:700;text-decoration:underline\">Future Perfect</a>, or <a href=\"/grammar-reader/all-verb-tenses-overview\" style=\"font-weight:700;text-decoration:underline\">All Tenses Overview</a> full guides.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the future form",
          instructions: "Match each time indicator to the correct future tense.",
          items: [
            {
              type: "radio",
              label: "Rosa's plan: she ___ in Level 4 in September. (enroll)",
              options: [
                { value: "will enroll", label: "will enroll" },
                { value: "will be enrolling", label: "will be enrolling" },
                { value: "will have enrolled", label: "will have enrolled" },
              ],
              expectedAnswer: "will enroll",
            },
            {
              type: "radio",
              label: "In September she ___ class twice a week while she still works. (take)",
              options: [
                { value: "will take", label: "will take" },
                { value: "will be taking", label: "will be taking" },
                { value: "will have taken", label: "will have taken" },
              ],
              expectedAnswer: "will be taking",
            },
            {
              type: "text",
              label: "By August she ___ (finish) Level 3.",
              expectedAnswers: ["will have finished"],
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Future perfect continuous",
          items: [
            {
              type: "radio",
              label: "By the last class tonight, Rosa ___ in evening ESOL for a full year. (study)",
              options: [
                { value: "will study", label: "will study" },
                { value: "will be studying", label: "will be studying" },
                { value: "will have been studying", label: "will have been studying" },
              ],
              expectedAnswer: "will have been studying",
            },
            {
              type: "text",
              label: "By tonight I ___ (study) in evening ESOL for a full year.",
              expectedAnswers: ["will have been studying"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Find the error",
          items: [
            {
              type: "radio",
              label: "\"By August I <strong>will finish</strong> Level 3.\" Time word: <strong>By August</strong>.",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "will have finished", label: "Should be 'will have finished'" },
                { value: "will be finishing", label: "Should be 'will be finishing'" },
              ],
              expectedAnswer: "will have finished",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "atyr-q2",
      question: "Rosa is texting the sitter at the register right now. Which sentence fits?",
      options: [
        { value: "a", label: "She texts the sitter at the register." },
        { value: "b", label: "She is texting the sitter at the register." },
        { value: "c", label: "She has texted the sitter at the register." },
      ],
      correctAnswer: "b",
      explanation: "Present continuous for an action in progress right now.",
      topic: "present-continuous",
      skill: "usage",
      skillTag: "right-now-action",
      difficulty: "easy",
    },
    {
      id: "atyr-q4",
      question: "Find the error: \"I have lived here since 2021.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be 'lived' (past simple)." },
        { value: "c", label: "Error: should be 'am living' (present continuous)." },
      ],
      correctAnswer: "a",
      explanation: "Present perfect with 'since' connects a past start to now.",
      topic: "present-perfect",
      skill: "error-detection",
      skillTag: "since-present-perfect",
      difficulty: "easy",
    },
    {
      id: "atyr-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Rosa ___ class every Tuesday and Thursday.\" (It's her regular schedule.)",
      correctAnswer: "takes",
      explanation: "Present simple for routines and fixed schedules.",
      topic: "present-simple",
      skill: "usage",
      skillTag: "routine-schedule",
      difficulty: "easy",
    },
    {
      id: "atyr-q6",
      question: "Before Rosa applied for warehouse work, she saved for the bus pass. Which sentence fits?",
      options: [
        { value: "a", label: "She had already saved for the bus pass." },
        { value: "b", label: "She already saved for the bus pass." },
        { value: "c", label: "She has already saved for the bus pass." },
      ],
      correctAnswer: "a",
      explanation: "Past perfect for something finished before another past event.",
      topic: "past-perfect",
      skill: "usage",
      skillTag: "before-past-event",
      difficulty: "medium",
    },
    {
      id: "atyr-ws1",
      type: "word-scramble" as const,
      question: "Rosa plans to finish Level 3 by August. Put the words in order.",
      words: ["She", "will", "have", "finished", "Level", "3", "by", "August"],
      correctAnswer: "She will have finished Level 3 by August",
      hint: "future perfect with 'by' = done before that future date",
      explanation: "Future perfect: will have + past participle. Used with 'by' to show something completed before a future point.",
      topic: "future-perfect",
      skill: "usage",
      skillTag: "by-future-perfect-word-order",
      difficulty: "medium",
    },
  ],
};
