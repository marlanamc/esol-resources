import type { InteractiveGuideContent } from "@/types/activity";
import { checklist, stepsCard } from "@/content/grammar/_shared/guide-visuals";
import { stopTakingOrStopToTakeImages as img } from "@/data/stop-taking-or-stop-to-take-images.generated";

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
<p><strong>Bring back W23:</strong> I enjoy walking. I want to walk. Today we compare patterns that change the meaning.</p>
        ${sceneCard("scenePharmacy", "East Boston Pharmacy on Meridian Street, Thursday 10:15 PM.", "terracotta")}

        <p>Marisol just finished her closing shift at the warehouse. She stops at the pharmacy on the way home. The pharmacist, Jennifer, has her new prescription ready, but there's something important she needs to know.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏾", text: "Marisol, the doctor changed your prescription. You need to <strong>stop taking</strong> the old blood pressure pills tonight.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Stop taking them? Even if I still have some at home?", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏾", text: "Yes. <strong>Stop taking</strong> them completely. Don't mix the two medications.", side: "left", tone: "sage" },
        ])}

        <p>Here, <strong>stop taking</strong> refers to Marisol’s old pills. That means: she <em>was</em> taking the pills before, and now she needs to end that habit.</p>

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

        <p>The next day at work, Kevin checks whether Marisol is ready to return from break. She explains why she paused and clears up a misunderstanding about her new prescription.</p>

        ${dialogue([
          { speaker: "Kevin", avatar: "👨🏻", text: "Are you coming back to the floor? Our break is nearly over.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "In a minute. I <strong>stopped to take</strong> my new pill. The label says to take it with food.", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "👨🏻", text: "Oh, I thought the doctor told you to stop taking your pills.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Just the old ones. I <strong>stopped taking</strong> those yesterday. This is the new prescription.", side: "right", tone: "terracotta" },
        ])}

        <p>Kevin learns why Marisol paused. <strong>Stop + to + verb</strong> means you pause your current activity in order to do a new one. Two different actions.</p>

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
              label: "At noon, Marisol stopped ___ her pill with her sandwich. (She paused her work.)",
              expectedAnswers: ["to take"],
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
        <p>It's Friday evening. Marisol gets a text from the East Boston Pharmacy. It explains why her new bottle says "generic." Look at the three steps.</p>

        ${stepsCard({
          kicker: "Text message",
          title: "East Boston Pharmacy: your refill",
          accent: "sage",
          steps: [
            "Your <strong>generic</strong> refill is ready. <strong>Try taking</strong> it at the same time every day.",
            "Your insurance does not cover the name brand. You can <strong>try to get</strong> it covered. Ask your doctor's office about a prior authorization.",
            "Their phone line is busy on Mondays. <strong>Try to call</strong> before 10 AM.",
          ],
          note: "Questions about your medicine? Ask your pharmacist or doctor.",
        })}

        <p>Notice the two uses: <strong>try taking</strong> (an experiment, easy to do) and <strong>try to get / try to call</strong> (an effort, it may be difficult and may not work).</p>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem; font-size: 1.05rem"><strong>try + -ing</strong> = experiment with something to see if it works. Low effort, worth trying.</p>
          <p style="margin: 0; font-size: 1.05rem"><strong>try + to + verb</strong> = make an effort to do something. It may be difficult. You might not succeed.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + -ing", "blue")}
            <span><em>Try <strong>taking</strong> your pill at the same time every day.</em> (experiment)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + to", "sage")}
            <span><em>She tried <strong>to get</strong> the name brand covered, but the insurance said no.</em> (effort, difficult)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + -ing", "blue")}
            <span><em>Try <strong>walking</strong> to the bus stop.</em> (experiment, you might like it)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("try + to", "sage")}
            <span><em>Try <strong>to get</strong> eight hours of sleep.</em> (a goal, may be hard)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "sti-s3-ex1",
          title: "Read the text message",
          instructions: "Look at the pharmacy text. Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "Which step asks Marisol to experiment with something easy?",
              options: [
                { value: "1", label: "Step 1" },
                { value: "2", label: "Step 2" },
                { value: "3", label: "Step 3" },
              ],
              expectedAnswer: "1",
            },
            {
              type: "radio",
              label: "Step 2 is about the name brand. What kind of action is it?",
              options: [
                { value: "experiment", label: "An experiment: easy, just see what happens" },
                { value: "effort", label: "An effort: it may be hard and may not work" },
              ],
              expectedAnswer: "effort",
            },
            {
              type: "radio",
              label: "Which sentence is a good report of Step 3?",
              options: [
                { value: "a", label: "The pharmacy told her to try calling Mondays." },
                { value: "b", label: "The pharmacy told her to try to call early." },
                { value: "c", label: "The pharmacy told her to stop to call." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s3-ex2",
          title: "Choose the correct form",
          items: [
            {
              type: "radio",
              label: "The pharmacist said, \"___ the generic. It is the same medicine.\" (suggestion to experiment)",
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
              label: "I tried ___ the generic pill for a month, and it worked fine. (I experimented, use -ing form)",
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
        <p>Saturday morning, 8:30 AM. Marisol checks her list. Some things are done. Some things are still ahead.</p>

        ${checklist({
          kicker: "Marisol's Saturday",
          title: "Done and not done yet",
          items: [
            { text: "I remember <strong>taking</strong> my pill at 7:00 with breakfast.", done: true },
            { text: "I remember <strong>setting</strong> the alarm last night.", done: true },
            { text: "Remember <strong>to take</strong> the pill before the early shift tomorrow.", done: false },
            { text: "Remember <strong>to call</strong> the clinic on Monday.", done: false },
          ],
        })}

        <p>Two uses, two meanings. <strong>Remember taking it</strong> means she's looking back at something she already did (✅). <strong>Remember to take it</strong> means she's looking forward at something she must not forget (⬜).</p>

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
          title: "Read the checklist",
          instructions: "Look at Marisol's Saturday list.",
          items: [
            {
              type: "radio",
              label: "Which thing does Marisol still need to do?",
              options: [
                { value: "a", label: "Set the alarm" },
                { value: "b", label: "Call the clinic" },
                { value: "c", label: "Eat breakfast with her pill" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The checked items (✅) use which pattern?",
              options: [
                { value: "gerund", label: "remember + -ing (past memory)" },
                { value: "infinitive", label: "remember + to (future task)" },
              ],
              expectedAnswer: "gerund",
            },
          ],
        },
        {
          id: "sti-s4-ex2",
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
            {
              type: "radio",
              label: "Don't forget, ___ your pill before the shift. (looking forward: task)",
              options: [
                { value: "remember taking", label: "remember taking" },
                { value: "remember to take", label: "remember to take" },
              ],
              expectedAnswer: "remember to take",
            },
          ],
        },
        {
          id: "sti-s4-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct form.",
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
              words: ["I", "remember", "locking", "the", "locker", "before", "I", "left", "for", "work"],
              correctAnswer: "I remember locking the locker before I left for work",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Stop Taking vs Stop to Take
    // =========================================================================
    {
      id: "the-pairs-together",
      title: "Stop Taking vs Stop to Take",
      icon: "⚖️",
      explanation: `
        <p>Jennifer, the pharmacist, gives Marisol one last tip: the two <strong>stop</strong> patterns look almost the same, but the meaning is very different. Compare them side by side.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-terracotta" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Compare</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">stop + -ing or stop + to?</div>
          </div>
          <div style="padding: 0 0.75rem 0.75rem 0.75rem">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
              <thead>
                <tr>
                  <th class="gc-text-terracotta gc-table-divider" scope="col" style="padding: 0.4rem 0.4rem !important; font-size: 0.8rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.12)">stop + -ing</th>
                  <th class="gc-text-sage gc-table-divider" scope="col" style="padding: 0.4rem 0.4rem !important; font-size: 0.8rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.12)">stop + to</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)"><strong>End it.</strong><br />You do it no more.</td>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)"><strong>Pause.</strong><br />Then do something new.</td>
                </tr>
                <tr>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)">She <strong>stopped smoking</strong> last year.</td>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)">She <strong>stopped to buy</strong> water.</td>
                </tr>
                <tr>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)">Marisol <strong>stopped taking</strong> the old pills.</td>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.08)">Marisol <strong>stopped to take</strong> a pill at noon.</td>
                </tr>
                <tr>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top">Kevin <strong>stopped working</strong> at the warehouse.</td>
                  <td style="padding: 0.45rem 0.4rem !important; font-size: 0.9rem; vertical-align: top">Kevin <strong>stopped working to answer</strong> his phone.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="padding: 0 1rem 0.8rem 1rem; font-size: 0.85rem; opacity: 0.85">Left: the habit is over. Right: one short stop, then the first activity may continue.</div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.4rem; font-weight: 700; font-size: 0.95rem">Quick reference:</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>stop + -ing</strong> = end an ongoing action</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>stop + to</strong> = pause to do something else</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>try + -ing</strong> = experiment, see if it works</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>try + to</strong> = make an effort (may be difficult)</p>
          <p style="margin: 0 0 0.25rem; font-size: 0.95rem"><strong>remember + to</strong> = don't forget (future task)</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>remember + -ing</strong> = recall a past action (memory)</p>
        </div>
      `,
      exercises: [
        {
          id: "sti-s5-ex1",
          title: "Use the table",
          instructions: "Look at the comparison table.",
          items: [
            {
              type: "radio",
              label: "In which column does the habit end completely?",
              options: [
                { value: "ing", label: "The stop + -ing column" },
                { value: "to", label: "The stop + to column" },
              ],
              expectedAnswer: "ing",
            },
            {
              type: "radio",
              label: "\"Kevin stopped working to answer his phone.\" What happened?",
              options: [
                { value: "a", label: "Kevin lost his job." },
                { value: "b", label: "Kevin paused work for a moment to use the phone." },
                { value: "c", label: "Kevin will answer the phone tomorrow." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s5-ex2",
          title: "Match the meaning",
          instructions: "Choose the sentence that matches what the label means.",
          items: [
            {
              type: "radio",
              label: "A label says: 'Stop taking this medicine and call your doctor.' This means:",
              options: [
                { value: "a", label: "Pause and take the medicine now." },
                { value: "b", label: "End the habit. If you are not sure, ask your pharmacist or doctor." },
                { value: "c", label: "Experiment with the medicine to see if it works." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "A tip says: 'Try taking your pill with breakfast.' This means:",
              options: [
                { value: "a", label: "It's very hard to take this pill." },
                { value: "b", label: "Experiment: do it at breakfast and see if it is easier." },
                { value: "c", label: "You must take it at breakfast or it won't work." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "sti-s5-ex3",
          title: "Spot the error",
          instructions: "One sentence has a grammar mistake. Find it.",
          items: [
            {
              type: "radio",
              label: "\"Marisol stopped to take the old pills last week.\" (She ended that habit)",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'stopped taking'. She ended the habit, not paused to do it." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"I tried to get the refill on Friday, but the pharmacy was closed.\" (She made an effort)",
              options: [
                { value: "correct", label: "Correct. She made an effort, so 'tried to get' fits." },
                { value: "incorrect", label: "Not correct, must use 'tried getting'" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "sti-s5-ex4",
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
          id: "sti-s5-ex5",
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
      question: "Marisol was working on the warehouse floor. At noon, she stopped ___ her pill. (She paused her work to take the pill.)",
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
      question: "Fill in the blank: \"Jennifer asks: 'Did you take your pill this morning?' Marisol says: 'Yes, I remember ___ it at 7 AM.'\" (She is recalling a past memory.)",
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
      question: "Marisol's doctor told her to change an evening habit. Put the words in order.",
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
