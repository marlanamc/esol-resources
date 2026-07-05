import type { InteractiveGuideContent } from "@/types/activity";
import { stopTakingOrStopToTakeImages as img } from "@/data/stop-taking-or-stop-to-take-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (copied from passive-voice-what-was-done.ts)
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

export const stopTakingOrStopToTakeContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Stop Taking the Old Medicine
    // =========================================================================
    {
      id: "stop-taking",
      title: "Stop Taking the Old Medicine",
      icon: "💊",
      explanation: `
        ${sceneCard("scenePharmacy", "East Boston Pharmacy on Meridian Street, Thursday 10:15 PM.", "terracotta")}

        <p>Marisol just finished her closing shift at the warehouse. She stops at the pharmacy on the way home. The pharmacist, Jennifer, has her new prescription ready, but there's something important she needs to know.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏾", text: "Marisol, the doctor changed your prescription. You need to <strong>stop taking</strong> the old blood pressure pills tonight.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Stop taking them? Even if I still have some at home?", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏾", text: "Yes. <strong>Stop taking</strong> them completely. Don't mix the two medications.", side: "left", tone: "sage" },
        ])}

        <p>Marisol texts her daughter on the bus home.</p>

        ${dialogue([
          { speaker: "Marisol", avatar: "👩🏽", text: "Mija, I got new pills. Tell your father to <strong>stop taking</strong> the white ones in the cabinet. The doctor changed mine.", side: "right", tone: "terracotta" },
          { speaker: "Daughter", avatar: "👧🏽", text: "OK Mamá. I'll tell him when he gets home.", side: "left", tone: "amber" },
        ])}

        <p>In both messages, Marisol uses <strong>stop taking</strong>. That means: she <em>was</em> taking the pills before, and now she needs to end that habit.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>stop + -ing</strong> = end an ongoing action. You were doing it. Now you stop.</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.9rem"><em>She stopped taking the old pills.</em> &nbsp;→ She was taking them. Now she stopped.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("stop + -ing", "terracotta")}
            <span><em>Stop <strong>taking</strong> the white pills.</em> (You were taking them. End it.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("stop + -ing", "terracotta")}
            <span><em>She stopped <strong>smoking</strong> last year.</em> (She smoked. She quit.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("stop + -ing", "terracotta")}
            <span><em>He stopped <strong>working</strong> at midnight.</em> (He was working. Then he stopped.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s1-ex1",
          title: "What does it mean?",
          instructions: "Choose the meaning of each sentence.",
          items: [
            {
              type: "radio",
              label: "\"She stopped taking the old pills.\"",
              options: [
                { value: "a", label: "She was taking the pills before, and now she has ended that." },
                { value: "b", label: "She paused her other activity to take the pills." },
                { value: "c", label: "She is going to take the pills later." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"He stopped working at the warehouse.\"",
              options: [
                { value: "a", label: "He went to the warehouse in order to work." },
                { value: "b", label: "He was working there, and now he is not." },
                { value: "c", label: "He will start working at the warehouse." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the correct -ing form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "The pharmacist said: \"Stop ___ (take) the white pills immediately.\"",
              expectedAnswers: ["taking"],
            },
          ],
        },
        {
          id: "sti-s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "stopped", "taking", "the", "old", "medication", "last", "Thursday"],
              correctAnswer: "She stopped taking the old medication last Thursday",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Stop to Take It With Food
    // =========================================================================
    {
      id: "stop-to-take",
      title: "Stop to Take It With Food",
      icon: "🍽️",
      explanation: `
        ${sceneCard("sceneLabel", "Break room at the warehouse, Friday lunchtime.", "sage")}

        <p>The next day at work, Marisol's coworker Kevin sees her new medication on the table. He picks up the bottle and reads the label out loud.</p>

        ${dialogue([
          { speaker: "Kevin", avatar: "👨🏻", text: "It says: 'Stop what you are doing to take this medicine with food.' What does that mean exactly?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "It means: when it's time for my pill, I have to <strong>stop</strong> what I'm doing <strong>to take</strong> it, and I need to eat first. I can't take it on an empty stomach.", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "👨🏻", text: "Ahh. So it doesn't mean stop taking it forever?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "No, no. That's a different meaning. <strong>Stop taking</strong> means end something. <strong>Stop to take</strong> means pause and do something else.", side: "right", tone: "terracotta" },
        ])}

        <p>Kevin learned something important. <strong>Stop + to + verb</strong> means you pause your current activity in order to do a new one. Two different actions.</p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>stop + to + verb</strong> = pause what you're doing in order to do something else. Two actions.</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.9rem"><em>She stopped <strong>to take</strong> her pill.</em> &nbsp;→ She was doing something. She paused. She took the pill.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("stop + to", "sage")}
            <span><em>She stopped working <strong>to take</strong> her pill.</em> (She paused work, then took the pill.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("stop + to", "sage")}
            <span><em>He stopped at the pharmacy <strong>to pick up</strong> the prescription.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("contrast", "amber")}
            <span><em>Stop <strong>taking</strong> it</em> = end the habit. &nbsp; <em>Stop <strong>to take</strong> it</em> = pause and do it now.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s2-ex1",
          title: "Which meaning?",
          instructions: "Choose the correct meaning.",
          items: [
            {
              type: "radio",
              label: "\"Marisol stopped to take her pill at noon.\"",
              options: [
                { value: "a", label: "Marisol ended the habit of taking the pill." },
                { value: "b", label: "Marisol paused what she was doing in order to take the pill." },
                { value: "c", label: "Marisol forgot to take the pill." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Kevin stopped eating to answer his phone.\"",
              options: [
                { value: "a", label: "Kevin quit eating forever." },
                { value: "b", label: "Kevin paused his meal to answer the phone." },
                { value: "c", label: "Kevin ate and answered the phone at the same time." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s2-ex2",
          title: "Stop taking or stop to take?",
          instructions: "Choose the correct form for each sentence.",
          items: [
            {
              type: "radio",
              label: "The doctor told her to ___ the old medication. (end the habit)",
              options: [
                { value: "stop taking", label: "stop taking" },
                { value: "stop to take", label: "stop to take" },
              ],
              expectedAnswer: "stop taking",
            },
            {
              type: "radio",
              label: "She ___ her lunch ___ her pill. (she paused eating, then took the pill)",
              options: [
                { value: "stopped eating / to take", label: "stopped eating / to take" },
                { value: "stopped eating / taking", label: "stopped eating / taking" },
              ],
              expectedAnswer: "stopped eating / to take",
            },
          ],
        },
        {
          id: "sti-s2-ex3",
          title: "Fill in the blank",
          instructions: "Write 'taking' or 'to take'.",
          items: [
            {
              type: "text",
              label: "She stopped ___ her lunch to answer the pharmacist's call. (she paused eating, use 'eating'... or write 'to take' if she paused [something] to take the pill)",
              expectedAnswers: ["to take", "taking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Try Taking the Generic / Try to Get Covered
    // =========================================================================
    {
      id: "try-doing-try-to",
      title: "Try Taking the Generic / Try to Get Covered",
      icon: "🔄",
      explanation: `
        ${sceneCard("sceneTryGeneric", "Pharmacy aisle, Friday evening. Marisol compares two medicine boxes.", "blue")}

        <p>Marisol's insurance doesn't cover the name-brand medication. Jennifer the pharmacist suggests an option, and Marisol also decides to call the insurance company herself.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏾", text: "The name brand isn't covered. But <strong>try taking</strong> the generic. It's the same medicine, just cheaper. Most people do fine with it.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "OK. I'll <strong>try taking</strong> it for a month and see.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏾", text: "You can also <strong>try to get</strong> the name brand covered. Call the insurance line and ask for a prior authorization.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I'll <strong>try to call</strong> them tomorrow, but those calls are hard. You're on hold for an hour.", side: "right", tone: "terracotta" },
        ])}

        <p>Notice the two different uses: <strong>try taking</strong> (try the generic, it's an experiment, easy to do) and <strong>try to call</strong> (try to reach the insurance, it's difficult, may not succeed).</p>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem; font-size: 1.05rem"><strong>try + -ing</strong> = experiment with something to see if it works. Low effort, worth trying.</p>
          <p style="margin: 0; font-size: 1.05rem"><strong>try + to + verb</strong> = make an effort to do something. It may be difficult. You might not succeed.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + -ing", "blue")}
            <span><em>Try <strong>taking</strong> it with food and see if the nausea goes away.</em> (experiment)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + to", "sage")}
            <span><em>She tried <strong>to get</strong> the name brand covered, but the insurance said no.</em> (effort, difficult)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("earth day", "sage")}
            <span><em>Try <strong>walking</strong> to the bus stop.</em> (experiment, you might like it)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("earth day", "sage")}
            <span><em>Try <strong>to reduce</strong> your carbon footprint.</em> (a goal, may be hard)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s3-ex1",
          title: "Experiment or effort?",
          instructions: "Read each sentence. Is it an experiment (try + -ing) or an effort that may fail (try + to)?",
          items: [
            {
              type: "radio",
              label: "\"Try taking a smaller dose if the side effects are bad.\"",
              options: [
                { value: "experiment", label: "Experiment, try this and see if it helps" },
                { value: "effort", label: "Effort, something difficult to accomplish" },
              ],
              expectedAnswer: "experiment",
            },
            {
              type: "radio",
              label: "\"She tried to get the insurance to cover it, but they refused.\"",
              options: [
                { value: "experiment", label: "Experiment, easy to try" },
                { value: "effort", label: "Effort, she made an attempt but it was hard / didn't work" },
              ],
              expectedAnswer: "effort",
            },
          ],
        },
        {
          id: "sti-s3-ex2",
          title: "Choose the correct form",
          items: [
            {
              type: "radio",
              label: "The pharmacist said, \"___ the generic. It works just as well.\" (suggestion to experiment)",
              options: [
                { value: "Try taking", label: "Try taking" },
                { value: "Try to take", label: "Try to take" },
              ],
              expectedAnswer: "Try taking",
            },
            {
              type: "radio",
              label: "She ___ fix the insurance mistake, but the call dropped three times. (difficult effort)",
              options: [
                { value: "tried fixing", label: "tried fixing" },
                { value: "tried to fix", label: "tried to fix" },
              ],
              expectedAnswer: "tried to fix",
            },
          ],
        },
        {
          id: "sti-s3-ex3",
          title: "Fill in the blank",
          instructions: "Write 'taking' or 'to take'.",
          items: [
            {
              type: "text",
              label: "I tried ___ the generic pill, and it worked fine. (I experimented, use -ing form)",
              expectedAnswers: ["taking"],
            },
          ],
        },
        {
          id: "sti-s3-ex4",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "tried", "to", "get", "the", "prescription", "covered", "by", "insurance"],
              correctAnswer: "She tried to get the prescription covered by insurance",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Remember to Take It / I Remember Taking It
    // =========================================================================
    {
      id: "remember-doing-remember-to",
      title: "Remember to Take It / I Remember Taking It",
      icon: "🔔",
      explanation: `
        ${sceneCard("sceneAlarm", "Saturday morning, 7:00 AM. Marisol's phone alarm goes off.", "amber")}

        <p>Marisol set a phone alarm so she doesn't forget her morning pill. Her husband Carlos walks into the kitchen and asks if she already took it.</p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Did you take your pill this morning?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Yes. I <strong>remember taking</strong> it at seven. I had it with my coffee.", side: "right", tone: "terracotta" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Good. And tomorrow, <strong>remember to take</strong> it before you leave. You have the early shift.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I know. The alarm is set. Don't worry. I always <strong>remember to take</strong> it now.", side: "right", tone: "terracotta" },
        ])}

        <p>Two uses, two meanings. <strong>Remember taking it</strong> means she's looking back at something she already did. <strong>Remember to take it</strong> means she's looking forward at something she must not forget.</p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem; font-size: 1.05rem"><strong>remember + to + verb</strong> = don't forget to do it (future / task). Looking forward.</p>
          <p style="margin: 0; font-size: 1.05rem"><strong>remember + -ing</strong> = you recall doing it (past / memory). Looking back.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("future task", "amber")}
            <span><em>Remember <strong>to take</strong> your pill before breakfast.</em> (Don't forget, task ahead.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("past memory", "terracotta")}
            <span><em>I remember <strong>taking</strong> it at seven.</em> (I recall it, it already happened.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("future task", "amber")}
            <span><em>Remember <strong>to call</strong> the clinic on Monday.</em> (Task, don't forget.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("past memory", "terracotta")}
            <span><em>Do you remember <strong>filling out</strong> the form last week?</em> (Memory, did you do it?)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s4-ex1",
          title: "Future task or past memory?",
          instructions: "Decide what each sentence means.",
          items: [
            {
              type: "radio",
              label: "\"Remember to pick up your prescription on Thursday.\"",
              options: [
                { value: "future", label: "Future task, don't forget to do this" },
                { value: "past", label: "Past memory, recalling something that happened" },
              ],
              expectedAnswer: "future",
            },
            {
              type: "radio",
              label: "\"I remember taking the last pill on Sunday morning.\"",
              options: [
                { value: "future", label: "Future task, a reminder for later" },
                { value: "past", label: "Past memory, recalling something already done" },
              ],
              expectedAnswer: "past",
            },
          ],
        },
        {
          id: "sti-s4-ex2",
          title: "Choose the correct form",
          items: [
            {
              type: "radio",
              label: "Don't forget, ___ your pill before the shift. (looking forward: task)",
              options: [
                { value: "remember taking", label: "remember taking" },
                { value: "remember to take", label: "remember to take" },
              ],
              expectedAnswer: "remember to take",
            },
            {
              type: "radio",
              label: "I ___ the form at the clinic. I signed it myself. (looking back: memory)",
              options: [
                { value: "remember filling out", label: "remember filling out" },
                { value: "remember to fill out", label: "remember to fill out" },
              ],
              expectedAnswer: "remember filling out",
            },
          ],
        },
        {
          id: "sti-s4-ex3",
          title: "Fill in the blank",
          instructions: "Write 'to take' or 'taking'.",
          items: [
            {
              type: "text",
              label: "The doctor's note says: Remember ___ the pill every morning with food. (future task)",
              expectedAnswers: ["to take"],
            },
          ],
        },
        {
          id: "sti-s4-ex4",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "remember", "taking", "the", "pill", "before", "I", "left", "for", "work"],
              correctAnswer: "I remember taking the pill before I left for work",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — The Pairs Together
    // =========================================================================
    {
      id: "the-pairs-together",
      title: "The Pairs Together",
      icon: "⚖️",
      explanation: `
        ${sceneCard("sceneNeighbors", "Marisol's kitchen, Sunday afternoon. Her neighbor Fatuma comes over.", "sage")}

        <p>Marisol's neighbor Fatuma just got her own prescription from the clinic. She's confused by the instructions on the label. Marisol helps her read it.</p>

        ${dialogue([
          { speaker: "Fatuma", avatar: "👩🏿", text: "It says: 'Stop taking ibuprofen while on this medication.' What does that mean?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "<strong>Stop taking</strong> means end it. No more ibuprofen at all while you're on this.", side: "right", tone: "terracotta" },
          { speaker: "Fatuma", avatar: "👩🏿", text: "And this part: 'Stop to take with a full glass of water.' Does that mean stop the medicine?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "No, no. <strong>Stop to take</strong> means pause. Stop what you're doing and drink a full glass when you take it.", side: "right", tone: "terracotta" },
          { speaker: "Marisol", avatar: "👩🏽", text: "That's a suggestion. <strong>Try taking</strong> it at the same time. And <strong>remember to take</strong> it with food every day.", side: "right", tone: "terracotta" },
          { speaker: "Fatuma", avatar: "👩🏿", text: "Got it. Stop the ibuprofen, pause to drink water, try the same time, and don't forget food.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.4rem; font-weight: 700; font-size: 0.95rem">Quick reference:</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>stop + -ing</strong> = end an ongoing action</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>stop + to</strong> = pause to do something else</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>try + -ing</strong> = experiment, see if it works</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>try + to</strong> = make an effort (may be difficult)</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>remember + to</strong> = don't forget (future task)</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>remember + -ing</strong> = recall a past action (memory)</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("stop + -ing", "terracotta")}
            <span><em>Stop <strong>taking</strong> ibuprofen.</em> (end it)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("stop + to", "sage")}
            <span><em>Stop <strong>to take</strong> it with water.</em> (pause, then do it)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("try + -ing", "blue")}
            <span><em>Try <strong>taking</strong> it at the same time each day.</em> (experiment)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("try + to", "blue")}
            <span><em>Try <strong>to get</strong> the refill before Friday.</em> (effort, may be hard)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("remember + to", "amber")}
            <span><em>Remember <strong>to take</strong> it with food.</em> (daily reminder)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("remember + -ing", "terracotta")}
            <span><em>I remember <strong>taking</strong> it this morning.</em> (I recall, past)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s5-ex1",
          title: "Match the meaning",
          instructions: "Choose the sentence that matches what Fatuma's label means.",
          items: [
            {
              type: "radio",
              label: "The label says: 'Stop taking aspirin.' This means:",
              options: [
                { value: "a", label: "Pause and take the aspirin." },
                { value: "b", label: "End the aspirin habit completely." },
                { value: "c", label: "Try aspirin to see if it works." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The label says: 'Try taking one tablet at bedtime.' This means:",
              options: [
                { value: "a", label: "It's very hard to take this tablet." },
                { value: "b", label: "Experiment, take it at night and see if that works better." },
                { value: "c", label: "You must take it at bedtime or it won't work." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s5-ex2",
          title: "Spot the error",
          instructions: "One sentence has a grammar mistake. Find it.",
          items: [
            {
              type: "radio",
              label: "\"She stopped to smoke last year.\" (She quit the smoking habit)",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'stopped smoking'. She ended the habit, not paused to do it." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Remember to call the clinic on Monday.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"I tried getting the refill on Friday, but the pharmacy was closed.\" (She made an effort)",
              options: [
                { value: "correct", label: "Correct, 'tried getting' can work here" },
                { value: "incorrect", label: "Not correct, must use 'tried to get'" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "sti-s5-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct form: -ing or to + verb.",
          items: [
            {
              type: "text",
              label: "I remember ___ (fill out) the form at the clinic last week. I can picture the pen. (past memory, use -ing)",
              expectedAnswers: ["filling out"],
            },
          ],
        },
        {
          id: "sti-s5-ex4",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Remember", "to", "pick", "up", "the", "refill", "before", "your", "shift", "ends"],
              correctAnswer: "Remember to pick up the refill before your shift ends",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "sti-q1",
      question: "The pharmacist says: 'You need to stop ___ the old blood pressure pills.' Which word fits?",
      options: [
        { value: "a", label: "to take" },
        { value: "b", label: "taking" },
        { value: "c", label: "take" },
      ],
      correctAnswer: "b",
      explanation: "'Stop taking' means end an ongoing habit. She was taking the pills before, and now she needs to stop.",
      topic: "gerunds-infinitives-meaning-change",
      skill: "usage",
      skillTag: "stop-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "sti-q2",
      question: "Marisol was working at her desk. At noon, she stopped ___ her pill. (She paused her work to take the pill.)",
      options: [
        { value: "a", label: "to take" },
        { value: "b", label: "taking" },
        { value: "c", label: "took" },
      ],
      correctAnswer: "a",
      explanation: "'Stop to take' means pause your current activity in order to do something else. Two different actions.",
      topic: "gerunds-infinitives-meaning-change",
      skill: "usage",
      skillTag: "stop-plus-infinitive",
      difficulty: "easy",
    },
    {
      id: "sti-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Carlos asks: 'Did you take your pill?' Marisol says: 'Yes, I remember ___ it at 7 AM.'\" (She is recalling a past memory.)",
      correctAnswer: "taking",
      explanation: "'Remember taking' = recalling a past event. Something that already happened.",
      topic: "gerunds-infinitives-meaning-change",
      skill: "usage",
      skillTag: "remember-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "sti-q7",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "She stopped smoking last year." },
        { value: "b", label: "She stopped to smoke last year. (meaning: she quit the habit)" },
        { value: "c", label: "She stopped to read the label before taking the pill." },
      ],
      correctAnswer: "b",
      explanation: "To describe quitting a habit, use 'stop + -ing': stopped smoking. 'Stopped to smoke' means she paused to smoke. That's the opposite meaning.",
      topic: "gerunds-infinitives-meaning-change",
      skill: "error-detection",
      skillTag: "stop-meaning-confusion",
      difficulty: "medium",
    },
    {
      id: "sti-ws1",
      type: "word-scramble" as const,
      question: "Kelly's doctor told her to change an evening habit. Put the words in order.",
      words: ["She", "stopped", "drinking", "coffee", "at", "night"],
      correctAnswer: "She stopped drinking coffee at night",
      hint: "stop + gerund = end the habit",
      explanation: "'Stopped drinking' means she ended the habit of drinking coffee at night.",
      topic: "gerunds-infinitives-meaning-change",
      skill: "usage",
      skillTag: "stop-plus-gerund-word-order",
      difficulty: "medium",
    },
  ],
};
