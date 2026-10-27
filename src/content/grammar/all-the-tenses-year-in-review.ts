import type { InteractiveGuideContent } from "@/types/activity";
import { allTheTensesYearInReviewImages as img } from "@/data/all-the-tenses-year-in-review-images.generated";
import { readingCard, scheduleChart, timeline } from "@/content/grammar/_shared/guide-visuals";

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
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
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

export const allTheTensesYearInReviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - One Year, One Timeline
    // =========================================================================
    {
      id: "one-year-eleven-tenses",
      title: "One Year, One Timeline",
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
          { id: "fut-simp", type: "single-dot", zone: "future", position: 70, verbLabel: "will / going to" },
        ],
      },
      explanation: `
        ${sceneCard("sceneEveningClass", "East Boston evening ESOL class. Thursday, June 5, 7 PM.", "sage")}

        <p><strong>Ms. Tran</strong> stands at the front of the room. It is the last class of the year. She asks the class about their plans for the fall.</p>

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "It's our last night together. What <strong>will</strong> you do in the fall?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>will enroll</strong> in Level 4 in September. I just need to make sure it fits around my work schedule.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "Same here. I <strong>work</strong> construction all day. Two evenings a week is all I can do.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And we're both <strong>going to take</strong> the free online summer course in July.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem"><strong>Your year, one timeline.</strong> Every tense on this timeline is one you practiced this year.</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>Simple</strong> = fact or finished. <strong>Continuous</strong> = in progress. <strong>Perfect</strong> = connected to a reference point. <strong>Past perfect</strong> = before another past event. <strong>Will / going to</strong> = the future.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("every Tuesday", "terracotta")}
            <span><em>I <strong>take</strong> the 116 every Tuesday.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("right now", "blue")}
            <span><em>I <strong>am sitting</strong> in class right now.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("in July", "amber")}
            <span><em>I <strong>am going to take</strong> the summer course in July.</em></span>
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
              label: "Rosa has a plan. In July, she ___ (take) the online summer course. Use going to.",
              expectedAnswers: ["is going to take", "'s going to take"],
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
        <p>Rosa is a housekeeper at a hotel on Meridian Street. Her supervisor, <strong>Jennifer</strong>, helps her when she needs to leave early. This is Rosa's regular week.</p>

        ${scheduleChart({
          kicker: "Schedule",
          title: "Rosa's regular week",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          rows: [
            { label: "🏨 Hotel work", cells: [{ text: "7-3" }, { text: "7-3" }, { text: "7-3" }, { text: "7-3" }, { text: "7-3" }] },
            { label: "📚 ESOL class", cells: [null, { text: "6 pm", accent: "sage" }, null, { text: "6 pm", accent: "sage" }, null] },
            { label: "🛎️ Jennifer covers the late checkouts", cells: [null, null, { text: "Jen", accent: "blue" }, null, null] },
          ],
        })}

        <p>Now it is Wednesday afternoon, and Rosa is on her break. Right now she <strong>is texting</strong> the babysitter about picking up her daughter.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Simple</strong> = routines and facts. <strong>Present Continuous</strong> = happening right now or this week.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("routine", "terracotta")}
            <span><em>I <strong>work</strong> at the hotel Monday through Friday.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("right now", "blue")}
            <span><em>I <strong>am texting</strong> the babysitter about the pickup.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Simple or continuous?",
          instructions: "Look at Rosa's regular week. Then pick the form that fits.",
          items: [
            {
              type: "radio",
              label: "Look at Rosa's week. Which sentence is true?",
              options: [
                { value: "a", label: "Rosa takes class on Wednesday." },
                { value: "b", label: "Rosa takes class on Tuesday and Thursday." },
                { value: "c", label: "Rosa takes class on Monday and Friday." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Hold on. Rosa ___ the babysitter right now. (text)",
              options: [
                { value: "texts", label: "texts" },
                { value: "is texting", label: "is texting" },
                { value: "has texted", label: "has texted" },
              ],
              expectedAnswer: "is texting",
            },
            {
              type: "text",
              label: "Look at the schedule. Jennifer usually ___ (cover) the late checkouts on Wednesdays.",
              expectedAnswers: ["covers"],
            },
            {
              type: "text",
              label: "Look at the schedule. How many days a week does Rosa work at the hotel? (Write a number.)",
              expectedAnswers: ["5", "five"],
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
              words: ["Rosa", "starts", "work", "at", "7", "on", "weekdays"],
              correctAnswer: "Rosa starts work at 7 on weekdays",
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
        title: "Past events, completed results, and duration",
        elements: [
          { id: "pp-dot", type: "arc", zone: "past-earlier", position: 22, verbLabel: "Past Perfect" },
          { id: "past-cont-line", type: "solid-line", zone: "past", position: 38, verbLabel: "Past Continuous" },
          { id: "past-simp-dot", type: "single-dot", zone: "past", position: 62, verbLabel: "Past Simple" },
        ],
      },
      explanation: `
        <p>For the last class, Ms. Tran gives everyone a reading about a singer. Rosa reads it on the 116 bus. Look for three kinds of past: what happened, what was in progress, and what had already finished.</p>

        ${readingCard({
          kicker: "A real life",
          title: "Gloria Estefan",
          paragraphs: [
            "Gloria Estefan <strong>was</strong> a toddler when her family <strong>fled</strong> Cuba. Her band, Miami Sound Machine, <strong>was traveling</strong> on a snowy highway in Pennsylvania in March 1990 when their bus <strong>had</strong> an accident with a tractor-trailer. Gloria <strong>broke</strong> a bone in her back, and surgeons <strong>operated</strong> on her spine for four hours.",
            "She <strong>did not give up</strong>. Before she <strong>returned</strong> to performing in January 1991, she <strong>had done</strong> extensive physical therapy. By 2015, she <strong>had sold</strong> more than 100 million records, and she and her husband <strong>received</strong> the Presidential Medal of Freedom.",
          ],
          photo: {
            url: "/images/guide-people/gloria-estefan.jpg",
            alt: "Gloria Estefan smiles at the 2017 Kennedy Center Honors dinner, wearing a rainbow-colored honoree ribbon",
            credit: "U.S. State Department, 2017, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Gloria_Estefan_2017.jpg",
          },
          sources: [
            { name: "Biography.com", url: "https://www.biography.com/musicians/gloria-estefan" },
            { name: "The White House (2015 Medal of Freedom)", url: "https://obamawhitehouse.archives.gov/the-press-office/2015/11/16/president-obama-names-recipients-presidential-medal-freedom" },
          ],
          accent: "sage",
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Simple</strong> = finished event. <strong>Past Continuous</strong> = in progress when something else happened. <strong>Past Perfect</strong> = already finished <em>before</em> another past event.</p><p><strong>Past perfect continuous:</strong> I had been working for two hours when the bus came. This focuses on duration up to a past event, as in W26.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("in progress", "blue")}
            <span><em>The band <strong>was traveling</strong> when the bus had an accident.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("before that", "sage")}
            <span><em>She <strong>had done</strong> physical therapy before she returned.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Pick the right past form",
          instructions: "Read about Gloria Estefan again if you need to.",
          items: [
            {
              type: "radio",
              label: "The band ___ on a snowy highway when the bus had an accident. (travel)",
              options: [
                { value: "was traveling", label: "was traveling" },
                { value: "traveled", label: "traveled" },
                { value: "had traveled", label: "had traveled" },
              ],
              expectedAnswer: "was traveling",
            },
            {
              type: "radio",
              label: "Look at the reading. Which happened first?",
              options: [
                { value: "therapy", label: "Gloria did physical therapy." },
                { value: "return", label: "Gloria returned to performing." },
              ],
              expectedAnswer: "therapy",
            },
            {
              type: "text",
              label: "Look at the reading. By 2015, Gloria had sold more than ___ million records. (Write a number.)",
              expectedAnswers: ["100"],
            },
            {
              type: "text",
              label: "Rosa ___ (already read) the article before the bus reached her stop.",
              expectedAnswers: ["had already read"],
            },
          ],
        },
        {
          id: "year-review-past-duration",
          title: "Bring back Week 26",
          answerExpectation: "missing-words",
          items: [{ type: "text", label: "I ___ (work) for two hours when my break started. Use the past perfect continuous.", expectedAnswers: ["had been working"] }],
        },
        {
          id: "s3-ex2",
          title: "Find the error",
          items: [
            {
              type: "radio",
              label: "\"Her family <strong>has fled</strong> Cuba when she was a toddler.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "fled", label: "Should be 'fled' (past simple for a finished event)" },
                { value: "was fleeing", label: "Should be 'was fleeing' (past continuous)" },
              ],
              expectedAnswer: "fled",
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
        <p>After class, Rosa writes about her life for a class project. She puts the dates on a timeline. Today is June, and she looks at her timeline.</p>

        ${timeline({
          kicker: "Timeline",
          title: "Rosa's life in East Boston",
          items: [
            { when: "2021", text: "Rosa moved to East Boston.", accent: "sage" },
            { when: "3 years ago", text: "She started working in housekeeping.", accent: "sage" },
            { when: "March", text: "She began taking extra shifts.", accent: "amber" },
            { span: "since March", accent: "amber" },
            { when: "Now (June)", text: "She is tired, but she is still working.", accent: "blue" },
          ],
        })}

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
            <span><em>I <strong>have been taking</strong> extra shifts since March.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Perfect or perfect continuous?",
          instructions: "Look at Rosa's timeline.",
          items: [
            {
              type: "radio",
              label: "Look at the timeline. Which sentence is true?",
              options: [
                { value: "a", label: "Rosa has lived in East Boston since 2022." },
                { value: "b", label: "Rosa has worked in housekeeping for six years." },
                { value: "c", label: "Rosa has been taking extra shifts since March." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Rosa ___ in East Boston since 2021. (live)",
              options: [
                { value: "has lived", label: "has lived" },
                { value: "is living", label: "is living" },
                { value: "lived", label: "lived" },
              ],
              expectedAnswer: "has lived",
            },
            {
              type: "radio",
              label: "Rosa started in housekeeping three years ago, so she has worked there ___ three years.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "for",
            },
            {
              type: "text",
              label: "Since March, Rosa ___ (take) extra shifts every week.",
              expectedAnswers: ["has been taking"],
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
              words: ["Rosa", "has", "worked", "in", "housekeeping", "for", "three", "years"],
              correctAnswer: "Rosa has worked in housekeeping for three years",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - What's Next: Will, Going To, and a Sneak Peek
    // =========================================================================
    {
      id: "whats-next-four-futures",
      title: "Future Plans, Results, and Duration",
      icon: "➡️",
      tenseDiagram: {
        title: "Talking about the future",
        elements: [
          { id: "fs-dot", type: "single-dot", zone: "future", position: 55, verbLabel: "will (decision, prediction)" },
          { id: "gt-dot", type: "single-dot", zone: "future", position: 78, verbLabel: "going to (plan)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusHome", "116 bus toward Maverick Square. Thursday, 6:15 PM.", "amber")}

        <p>On the way to the last class, Rosa and classmate <strong>David</strong> talk on the 116 bus about their plans for the summer and the fall.</p>

        ${dialogue([
          { speaker: "David", avatar: "👨🏻", text: "Level 4 in the fall?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "That’s the plan. I <strong>am going to take</strong> evening classes. I already filled out the form.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "I think Level 4 <strong>will be</strong> harder. More reading.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Maybe. Oh, I know! I<strong>'ll ask</strong> Ms. Tran for the reading list tonight.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>going to</strong> = a plan you already made. <strong>will</strong> = a prediction ("I think...") or a decision you make right now.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("plan", "amber")}
            <span><em>I <strong>am going to take</strong> evening classes in the fall.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("prediction", "amber")}
            <span><em>I think Level 4 <strong>will be</strong> harder.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(245,158,11,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("decide now", "amber")}
            <span><em>Oh, I know! I<strong>'ll ask</strong> Ms. Tran tonight.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1.25rem 0 1rem 0">
          <p><strong>Review from W32 and W35.</strong> These are forms you have already practiced.</p>
          <p><strong>Completed result:</strong> By August, I <strong>will have finished</strong> the summer course.</p>
          <p><strong>Duration:</strong> By June, we <strong>will have been studying</strong> together for about nine months.</p>
          <p><strong>Optional preview only: future continuous.</strong> At 7 PM in September, I <strong>will be sitting</strong> in class. This describes an activity in progress at a future time. It is not part of the required quiz.</p>
        </div>
      `,
      exercises: [
        {
          id: "year-review-future-milestones",
          title: "Bring back Weeks 32 and 35",
          answerExpectation: "missing-words",
          items: [
            { type: "text", label: "By Friday, I ___ (finish) my plan. Use the future perfect.", expectedAnswers: ["will have finished"] },
            { type: "text", label: "By June, I ___ (study) here for about nine months. Use the future perfect continuous.", expectedAnswers: ["will have been studying"] },
          ],
        },
        {
          id: "s5-ex1",
          title: "Will or going to?",
          instructions: "Read the clue in each sentence, then choose.",
          items: [
            {
              type: "radio",
              label: "Rosa filled out the Level 4 form last week. In September she ___ evening classes. (take)",
              options: [
                { value: "is going to take", label: "is going to take" },
                { value: "takes", label: "takes" },
                { value: "has taken", label: "has taken" },
              ],
              expectedAnswer: "is going to take",
            },
            {
              type: "radio",
              label: "David is guessing. \"I think Level 4 ___ harder.\" (be)",
              options: [
                { value: "is being", label: "is being" },
                { value: "will be", label: "will be" },
                { value: "was", label: "was" },
              ],
              expectedAnswer: "will be",
            },
            {
              type: "text",
              label: "Rosa decides right now: \"Oh, I know! I ___ (ask) Ms. Tran tonight.\" Use a short form.",
              expectedAnswers: ["'ll ask", "will ask"],
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Review: completed by a future date",
          instructions: "Review the difference between a completed result and a duration.",
          items: [
            {
              type: "radio",
              label: "\"By August, I will have finished the summer course.\" When does Rosa finish the course?",
              options: [
                { value: "a", label: "No later than the start of August" },
                { value: "b", label: "In September" },
                { value: "c", label: "She never finishes it" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"By June, I will have been studying for about nine months.\" What does this emphasize?",
              options: [
                { value: "a", label: "A completed homework task" },
                { value: "b", label: "The duration of studying up to June" },
                { value: "c", label: "A new activity starting in July" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Find the error",
          items: [
            {
              type: "radio",
              label: "\"I <strong>going to</strong> enroll in Level 4 in September.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "am going to", label: "Should be 'I am going to enroll'" },
                { value: "will going to", label: "Should be 'I will going to enroll'" },
              ],
              expectedAnswer: "am going to",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "atyr-q2",
      question: "Rosa is texting the babysitter at work right now. Which sentence fits?",
      options: [
        { value: "a", label: "She texts the babysitter at work." },
        { value: "b", label: "She is texting the babysitter at work." },
        { value: "c", label: "She has texted the babysitter at work." },
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
      question: "Rosa finished her homework, and then the bus came. Which sentence fits?",
      options: [
        { value: "a", label: "She had already finished her homework when the bus came." },
        { value: "b", label: "She already finishes her homework when the bus came." },
        { value: "c", label: "She has already finished her homework when the bus came." },
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
      question: "Rosa already filled out the Level 4 form. Put the words in order.",
      words: ["She", "is", "going", "to", "take", "evening", "classes", "in", "September"],
      correctAnswer: "She is going to take evening classes in September",
      hint: "be + going to + base verb = a plan you already made",
      explanation: "Going to is for a plan that is already decided. Rosa filled out the form, so the plan is made.",
      topic: "future-going-to",
      skill: "usage",
      skillTag: "going-to-plan-word-order",
      difficulty: "medium",
    },
    {"id": "year-review-past-duration", "type": "fill-blank", "question": "I ___ (work) for two hours when my break started. Use the past perfect continuous.", "correctAnswer": "had been working", "explanation": "The complete verb phrase is had been working."},
    {"id": "year-review-future-result", "type": "fill-blank", "question": "By Friday, I ___ (finish) my plan. Use the future perfect.", "correctAnswer": "will have finished", "explanation": "The complete verb phrase is will have finished."},
    {"id": "year-review-future-duration", "type": "fill-blank", "question": "By June, I ___ (study) here for about nine months. Use the future perfect continuous.", "correctAnswer": "will have been studying", "explanation": "The complete verb phrase is will have been studying."},
  ],
};
