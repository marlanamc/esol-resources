import type { InteractiveGuideContent } from "@/types/activity";
import { phrasalVerbsAtWorkImages as img } from "@/data/phrasal-verbs-at-work-images.generated";

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

export const phrasalVerbsAtWorkContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — What Did She Say?
    // =========================================================================
    {
      id: "what-did-she-say",
      title: "What Did She Say?",
      explanation: `
        ${sceneCard("sceneHotelLaundry", "Hotel laundry room, East Boston. Rosa's first day.", "terracotta")}

        ${dialogue([
          { speaker: "Jennifer (supervisor)", avatar: "👩‍💼", text: "OK Rosa, <strong>clock in</strong> first, then come find me. I need you to <strong>fill out</strong> this new-hire form before your shift starts.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Clock in? Fill out? Sorry, where do I do that?", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (supervisor)", avatar: "👩‍💼", text: "The machine by the door for clocking in. And if you're ever sick, you need to <strong>call in</strong> before 7 AM. Don't just not show up.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Got it. Call in before 7. I won't forget.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Phrasal verb</strong> = a verb plus a small word (in, out, up, for...). The meaning is new. You can't guess it from the separate words.</p>
        </div>

        <p style="margin: 0.75rem 0">Rosa knows the words <em>clock</em>, <em>fill</em>, and <em>call</em>. But <em>clock in</em>, <em>fill out</em>, and <em>call in</em> mean something completely different at work.</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("clock in", "terracotta")}
            <span>start your shift by scanning your badge or punching the machine</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("fill out", "terracotta")}
            <span>complete a form by writing the information in all the blank spaces</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("call in", "terracotta")}
            <span>phone your job to say you won't be coming to work today</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "what-did-she-say-ex1",
          title: "Match the meaning",
          instructions: "Choose the correct meaning for each phrasal verb.",
          items: [
            {
              type: "radio",
              label: "Your supervisor says: \"Make sure you <strong>clock in</strong> before your shift.\" What should you do?",
              options: [
                { value: "a", label: "Buy a clock for the break room" },
                { value: "b", label: "Use the machine to record when your shift starts" },
                { value: "c", label: "Call your supervisor when you arrive" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The HR form says: \"<strong>Fill out</strong> your name and address below.\" What should you do?",
              options: [
                { value: "a", label: "Fill a cup with water" },
                { value: "b", label: "Find someone to write the form for you" },
                { value: "c", label: "Write your name and address in the blank spaces" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "what-did-she-say-ex2",
          title: "Fill in the blank",
          instructions: "Write the correct phrasal verb.",
          items: [
            {
              type: "text",
              label: "Rosa is sick. She needs to ___ ___ before 7 AM. (two words: call + ?)",
              expectedAnswers: ["call in"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Calling In and Covering a Shift
    // =========================================================================
    {
      id: "calling-in-covering",
      title: "Calling In and Covering a Shift",
      explanation: `
        ${sceneCard("sceneTextThread", "Diego's phone. Tuesday morning, 5:45 AM.", "sage")}

        ${dialogue([
          { speaker: "Diego", avatar: "👨🏾", text: "Ana, I can't come in today. My kid's fever is 103. I have to <strong>call in sick</strong>. Can you <strong>cover for</strong> me?", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏿", text: "Yeah, I can do it. I'll <strong>show up</strong> early and let Kevin know. You just call the manager before 6.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏾", text: "Thank you. I'll <strong>pick up</strong> one of your shifts next week, I promise.", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏿", text: "Don't worry. Go take care of your kid.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">These four phrasal verbs come up every week at almost every job.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("call in sick", "sage")}
            <span>phone your job to say you're too sick to work today</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("cover for", "sage")}
            <span>do someone else's shift because they can't come in</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("show up", "sage")}
            <span>arrive at work (often used when punctuality matters)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("pick up a shift", "sage")}
            <span>agree to work an extra shift, usually for someone else</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "calling-in-covering-ex1",
          title: "Choose the right phrasal verb",
          instructions: "Pick the verb that fits the situation.",
          items: [
            {
              type: "radio",
              label: "Carlos's back hurts. He calls his manager and says he can't work today. He ___.",
              options: [
                { value: "a", label: "calls in sick" },
                { value: "b", label: "shows up sick" },
                { value: "c", label: "picks up sick" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Lucia agreed to work her coworker's Saturday shift. She ___ a shift.",
              options: [
                { value: "a", label: "called in" },
                { value: "b", label: "covered in" },
                { value: "c", label: "picked up" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "calling-in-covering-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "Ana said she would ___ for Diego while he stayed home with his sick child.",
              expectedAnswers: ["cover"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Paperwork Before Payday
    // =========================================================================
    {
      id: "paperwork-before-payday",
      title: "Paperwork Before Payday",
      explanation: `
        ${sceneCard("sceneRestaurantPaperwork", "Restaurant back office. Thursday, 2:30 PM. Payday tomorrow.", "amber")}

        ${dialogue([
          { speaker: "Mark (manager)", avatar: "🧑‍💼", text: "Fatima, you need to <strong>hand in</strong> your timesheet today. Payroll closes at 3.", side: "left", tone: "amber" },
          { speaker: "Fatima", avatar: "👩🏾", text: "I have it, but there's an error on Tuesday. Do I need to <strong>fill out</strong> a new one?", side: "right", tone: "terracotta" },
          { speaker: "Mark (manager)", avatar: "🧑‍💼", text: "Yeah, grab a correction form, <strong>fill it out</strong>, and <strong>turn it in</strong> to me. I'll <strong>sign off on</strong> it before 3.", side: "left", tone: "amber" },
          { speaker: "Fatima", avatar: "👩🏾", text: "OK. I'll be right back.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Hand in</strong> and <strong>turn in</strong> mean the same thing: give a completed document to the person who asked for it. <strong>Sign off on</strong> = officially approve something by signing.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("hand in / turn in", "amber")}
            <span>give a completed form or document to your manager or HR</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("sign off on", "amber")}
            <span>approve something officially by writing your signature</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "paperwork-ex1",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["You", "need", "to", "hand", "in", "your", "timesheet", "before", "3", "PM"],
              correctAnswer: "You need to hand in your timesheet before 3 PM",
            },
          ],
        },
        {
          id: "paperwork-ex2",
          title: "Correct or not?",
          instructions: "Is the sentence correct?",
          items: [
            {
              type: "radio",
              label: "\"The manager needs to <strong>sign off on</strong> the schedule before Friday.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"She handed in her timesheet to the manager yesterday.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. 'Handed in' is wrong here." },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "paperwork-ex3",
          title: "Fill in the blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "The manager will ___ off on your time-off request once you fill out the form.",
              expectedAnswers: ["sign"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Separable or Not? The Hidden Rule
    // =========================================================================
    {
      id: "separable-or-not",
      title: "Separable or Not? The Hidden Rule",
      explanation: `
        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Separable phrasal verbs</strong> let you put the object in the middle OR at the end. But when you use a pronoun (it, them, me), it must go in the middle.</p>
        </div>

        <p style="margin: 0.75rem 0">Compare these three sentences. They all mean the same thing:</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("correct", "sage")}
            <span><em>Please <strong>fill out</strong> the form.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("correct", "sage")}
            <span><em>Please <strong>fill</strong> the form <strong>out</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("correct", "sage")}
            <span><em>Please <strong>fill it out</strong>.</em> (pronoun goes in the middle)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(239,68,68,0.07); border-radius: 0.4rem">
            ${labelPill("wrong", "terracotta")}
            <span><em style="text-decoration: line-through">Please <strong>fill out it</strong>.</em> (pronoun can't go at the end)</span>
          </div>
        </div>

        <p style="margin: 0.75rem 0; font-size: 0.95rem; color: #555">The same rule applies to <em>hand in it</em> (wrong) vs. <em>hand it in</em> (correct), and <em>turn in it</em> (wrong) vs. <em>turn it in</em> (correct).</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(239,68,68,0.07); border-radius: 0.4rem">
            ${labelPill("wrong", "terracotta")}
            <span><em style="text-decoration: line-through">Hand in it before 3 PM.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("correct", "sage")}
            <span><em><strong>Hand it in</strong> before 3 PM.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "separable-ex1",
          title: "Correct or not?",
          instructions: "Is the sentence grammatically correct?",
          items: [
            {
              type: "radio",
              label: "\"She filled out it at the front desk.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: She filled it out." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Please turn in your form before you leave.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"I need to hand in it to my manager.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: I need to hand it in." },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "separable-ex2",
          title: "Fill in the blank",
          instructions: "Use a pronoun. Write the two missing words.",
          items: [
            {
              type: "text",
              label: "Fatima has the timesheet. She needs to ___ ___ in before 3 PM. (fill + pronoun)",
              expectedAnswers: ["fill it"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — End of Shift Talk
    // =========================================================================
    {
      id: "end-of-shift",
      title: "End of Shift",
      explanation: `
        ${sceneCard("sceneWarehouseClockout", "Warehouse loading dock, East Boston. Thursday, 4:55 PM.", "terracotta")}

        ${dialogue([
          { speaker: "Hector", avatar: "👨🏽", text: "Hey Omar, I need to ask you something. Can you <strong>cover for</strong> me Thursday? I have a clinic appointment I can't move.", side: "right", tone: "terracotta" },
          { speaker: "Omar", avatar: "🧑🏾", text: "Thursday I can do it. What time do you <strong>clock in</strong>?", side: "left", tone: "sage" },
          { speaker: "Hector", avatar: "👨🏽", text: "7 AM. I'll <strong>fill out</strong> the shift-swap form tonight and <strong>hand it in</strong> to Kevin tomorrow morning.", side: "right", tone: "terracotta" },
          { speaker: "Omar", avatar: "🧑🏾", text: "Good. Make sure he <strong>signs off on</strong> it before the end of his shift or it won't go through.", side: "left", tone: "sage" },
          { speaker: "Hector", avatar: "👨🏽", text: "I know. I'll <strong>show up</strong> early on Friday to cover one of yours.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 0.75rem 0">Look at how many phrasal verbs Hector and Omar used in one short conversation. This is normal at work. Knowing these verbs means you can handle a real shift-swap without any confusion.</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>clock in/out</strong> - start or end your recorded shift</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>fill out</strong> - complete a form</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>hand in / turn in</strong> - give a completed form to your manager</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>sign off on</strong> - officially approve by signing</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>call in sick</strong> - phone your job before your shift to say you're sick</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>cover for</strong> - work someone else's shift</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>show up</strong> - arrive at work</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("review", "terracotta")}
            <span><strong>pick up a shift</strong> - agree to work an extra shift</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "end-of-shift-ex1",
          title: "Choose the right word",
          instructions: "Pick the phrasal verb that fits.",
          items: [
            {
              type: "radio",
              label: "Hector can't work Thursday. He needs someone to ___ for him.",
              options: [
                { value: "a", label: "cover" },
                { value: "b", label: "clock" },
                { value: "c", label: "sign" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "After the swap, the manager needs to ___ off on the form.",
              options: [
                { value: "a", label: "hand" },
                { value: "b", label: "sign" },
                { value: "c", label: "fill" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "end-of-shift-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["He", "filled", "out", "the", "shift-swap", "form", "and", "handed", "it", "in"],
              correctAnswer: "He filled out the shift-swap form and handed it in",
            },
          ],
        },
        {
          id: "end-of-shift-ex3",
          title: "Fill in the blank",
          items: [
            {
              type: "text",
              label: "Hector will ___ in at 7 AM on Friday to cover Omar's shift.",
              expectedAnswers: ["clock"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and a full list of workplace phrasal verbs, open the <a href=\"/grammar-reader/workplace-phrasal-verbs\" style=\"font-weight:700;text-decoration:underline\">Workplace Phrasal Verbs Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "phrasal-verbs-at-work-q1",
      question: "Rosa's manager says, \"Make sure you clock in before 8 AM.\" What should Rosa do?",
      options: [
        { value: "a", label: "Buy a clock for the break room" },
        { value: "b", label: "Use the machine to record when her shift starts" },
        { value: "c", label: "Call her manager at 8 AM" },
      ],
      correctAnswer: "b",
      explanation: "Clock in means to record the start of your shift using the time machine or app.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-clock-in",
      difficulty: "easy",
    },
    {
      id: "phrasal-verbs-at-work-q2",
      question: "Diego can't go to work because his child is sick. What does he do?",
      options: [
        { value: "a", label: "He shows up late" },
        { value: "b", label: "He calls in sick" },
        { value: "c", label: "He picks up a shift" },
      ],
      correctAnswer: "b",
      explanation: "Call in sick means to phone your job before your shift to say you can't come in.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-call-in-sick",
      difficulty: "easy",
    },
    {
      id: "phrasal-verbs-at-work-q3",
      question: "Ana works Diego's shift because he is sick. What does she do?",
      options: [
        { value: "a", label: "She covers for him" },
        { value: "b", label: "She calls in for him" },
        { value: "c", label: "She signs off on him" },
      ],
      correctAnswer: "a",
      explanation: "Cover for someone means to do their shift because they can't come in.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-cover-for",
      difficulty: "easy",
    },
    {
      id: "phrasal-verbs-at-work-q4",
      question: "The manager tells Fatima: \"Fill out this form and turn it in before payroll closes.\" What does Fatima need to do?",
      options: [
        { value: "a", label: "Complete the form and give it to the manager" },
        { value: "b", label: "Read the form and return it tomorrow" },
        { value: "c", label: "Sign the form and leave it on the desk" },
      ],
      correctAnswer: "a",
      explanation: "Fill out means complete the form; turn in means give it to the person who needs it.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-fill-out-turn-in",
      difficulty: "medium",
    },
    {
      id: "phrasal-verbs-at-work-q5",
      question: "Which sentence is NOT correct?",
      options: [
        { value: "a", label: "She filled out the form at the front desk." },
        { value: "b", label: "She filled the form out at the front desk." },
        { value: "c", label: "She filled out it at the front desk." },
      ],
      correctAnswer: "c",
      explanation: "When you use a pronoun (it), it must go in the middle: fill it out. You cannot say fill out it.",
      topic: "phrasal-verbs-at-work",
      skill: "error-detection",
      skillTag: "separable-pronoun-position",
      difficulty: "medium",
    },
    {
      id: "phrasal-verbs-at-work-q6",
      question: "Which sentence is NOT correct?",
      options: [
        { value: "a", label: "Please hand in your timesheet before 3 PM." },
        { value: "b", label: "Please hand your timesheet in before 3 PM." },
        { value: "c", label: "Please hand in it before 3 PM." },
      ],
      correctAnswer: "c",
      explanation: "Pronouns must go between the verb and particle: hand it in. 'Hand in it' is not correct.",
      topic: "phrasal-verbs-at-work",
      skill: "error-detection",
      skillTag: "separable-pronoun-position",
      difficulty: "medium",
    },
    {
      id: "phrasal-verbs-at-work-q7",
      question: "Hector asks Omar to work his Thursday shift. Omar says yes. What does Omar do?",
      options: [
        { value: "a", label: "Omar picks up Hector's shift" },
        { value: "b", label: "Omar hands in Hector's shift" },
        { value: "c", label: "Omar clocks out Hector's shift" },
      ],
      correctAnswer: "a",
      explanation: "Pick up a shift means agree to work an extra shift, usually for someone else.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-pick-up-shift",
      difficulty: "hard",
    },
    {
      id: "phrasal-verbs-at-work-q8",
      question: "The manager needs to approve the shift-swap form. Which sentence is correct?",
      options: [
        { value: "a", label: "The manager needs to sign off on the form." },
        { value: "b", label: "The manager needs to clock in the form." },
        { value: "c", label: "The manager needs to show up the form." },
      ],
      correctAnswer: "a",
      explanation: "Sign off on means to officially approve something by putting your signature on it.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-sign-off-on",
      difficulty: "medium",
    },
    {
      id: "phrasal-verbs-at-work-q9",
      question: "Lucia agreed to work Saturday for her coworker. On Saturday morning, she arrives on time. Which two phrasal verbs describe what Lucia did?",
      options: [
        { value: "a", label: "She picked up a shift and showed up." },
        { value: "b", label: "She called in sick and clocked out." },
        { value: "c", label: "She filled out a shift and handed it in." },
      ],
      correctAnswer: "a",
      explanation: "Pick up a shift means agree to work an extra shift; show up means arrive at work on time.",
      topic: "phrasal-verbs-at-work",
      skill: "usage",
      skillTag: "meaning-pick-up-show-up",
      difficulty: "medium",
    },
    {
      id: "phrasal-verbs-at-work-q10",
      question: "Fatima's manager said: \"Fill it out and turn in it before you leave.\" What is wrong with the manager's sentence?",
      options: [
        { value: "a", label: "Fill it out is wrong. It should be fill out it." },
        { value: "b", label: "Turn in it is wrong. It should be turn it in." },
        { value: "c", label: "Nothing is wrong. Both parts are correct." },
      ],
      correctAnswer: "b",
      explanation: "Turn in it is not correct. When using a pronoun, it must go in the middle: turn it in.",
      topic: "phrasal-verbs-at-work",
      skill: "error-detection",
      skillTag: "separable-pronoun-position",
      difficulty: "hard",
    },
  ],
};
