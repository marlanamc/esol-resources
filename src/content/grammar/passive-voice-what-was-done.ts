import type { InteractiveGuideContent } from "@/types/activity";
import { passiveVoiceWhatWasDoneImages as img } from "@/data/passive-voice-what-was-done-images.generated";

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

export const passiveVoiceWhatWasDoneContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — She Was Hired After the Referral
    // =========================================================================
    {
      id: "she-was-hired",
      title: "She Was Hired After the Referral",
      icon: "🏭",
      explanation: `
        ${sceneCard("sceneReferral", "Outside the warehouse on Marginal Street, Thursday afternoon.", "terracotta")}

        <p>Gloria got a new job. Her cousin Marcos works at the same warehouse and put in a good word for her. She calls her friend Linh to share the news.</p>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "I <strong>was hired</strong>! Marcos talked to his supervisor and I <strong>was called</strong> the same day.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "That's great! What did they say?", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "I <strong>was told</strong> to come in Monday with my ID. The paperwork <strong>is already done</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "So you start next week? That was fast.", side: "left", tone: "sage" },
        ])}

        <p>Notice what Gloria says: <em>I was hired. I was called. I was told.</em> She doesn't say <em>who</em> hired her or <em>who</em> called her. In these situations, the action matters more than the person who did it.</p>

        <p>This is called the <strong>passive voice</strong>. It puts the <em>receiver</em> of the action first, not the person doing it.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Passive voice</strong> = the subject receives the action. We use it when we don't know who did something, or when it doesn't matter.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("active", "blue")}
            <span><em>The supervisor <strong>called</strong> Gloria.</em> (We know who did it.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("passive", "terracotta")}
            <span><em>Gloria <strong>was called</strong>.</em> (The caller isn't important here.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("passive", "terracotta")}
            <span><em>She <strong>was hired</strong> after the referral.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hired-ex1",
          title: "Active or passive?",
          instructions: "Read each sentence. Is it active (we know who does the action) or passive (the receiver comes first)?",
          items: [
            {
              type: "radio",
              label: "\"The manager <strong>called</strong> Marcos.\"",
              options: [
                { value: "active", label: "Active: the manager is doing the action" },
                { value: "passive", label: "Passive: the receiver comes first" },
              ],
              expectedAnswer: "active",
            },
            {
              type: "radio",
              label: "\"Gloria <strong>was hired</strong> last week.\"",
              options: [
                { value: "active", label: "Active: Gloria is doing the action" },
                { value: "passive", label: "Passive: Gloria received the action" },
              ],
              expectedAnswer: "passive",
            },
            {
              type: "radio",
              label: "\"The paperwork <strong>was sent</strong> by email.\"",
              options: [
                { value: "active", label: "Active" },
                { value: "passive", label: "Passive: the paperwork received the action" },
              ],
              expectedAnswer: "passive",
            },
          ],
        },
        {
          id: "hired-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "Gloria ___ hired on Thursday. (one word)",
              expectedAnswers: ["was"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Is Required / Is Provided: Reading the Job Ad
    // =========================================================================
    {
      id: "job-ad-passive",
      title: "Is Required / Is Provided: Reading the Job Ad",
      icon: "📋",
      explanation: `
        ${sceneCard("sceneJobAd", "Job posting at the East Boston Career Center, Tuesday morning.", "sage")}

        <p>Before her interview, Gloria found the job posting online. Job ads almost always use passive voice. Look at the language:</p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem; font-weight: 700">Hotel Housekeeper, Full-Time</p>
          <p style="margin: 0 0 0.25rem">Experience in cleaning or hospitality <strong>is required</strong>.</p>
          <p style="margin: 0 0 0.25rem">Safety training <strong>is provided</strong>.</p>
          <p style="margin: 0 0 0.25rem">A uniform <strong>is included</strong>.</p>
          <p style="margin: 0 0 0.25rem">References <strong>are expected</strong>.</p>
          <p style="margin: 0">Transportation near the Blue Line <strong>is recommended</strong>.</p>
        </div>

        <p>All of these are <strong>present passive</strong>. The company doesn't say "We require experience" or "We provide training" because the company isn't the point. The job conditions are the point.</p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present passive:</strong> is/are + V3 (past participle)</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.95rem">Singular: Experience <strong>is required</strong>. &nbsp; Plural: References <strong>are expected</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("present passive", "sage")}
            <span><em>Safety training <strong>is provided</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("present passive", "sage")}
            <span><em>References <strong>are expected</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("present passive", "sage")}
            <span><em>A uniform <strong>is included</strong>.</em></span>
          </div>
        </div>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "It says safety training <strong>is provided</strong>. So I don't have to pay for it?", side: "right", tone: "terracotta" },
          { speaker: "Marcos", avatar: "👨🏾", text: "Right. And a uniform <strong>is included</strong> too. You don't buy that either.", side: "left", tone: "sage" },
        ])}
      `,
      exercises: [
        {
          id: "jobad-ex1",
          title: "Choose the correct form",
          instructions: "Pick the present passive form that fits the job ad.",
          items: [
            {
              type: "radio",
              label: "Steel-toe boots ___ for this position.",
              options: [
                { value: "is required", label: "is required" },
                { value: "are required", label: "are required" },
                { value: "require", label: "require" },
              ],
              expectedAnswer: "are required",
            },
            {
              type: "radio",
              label: "A background check ___ before your first day.",
              options: [
                { value: "is completed", label: "is completed" },
                { value: "are completed", label: "are completed" },
                { value: "completing", label: "completing" },
              ],
              expectedAnswer: "is completed",
            },
            {
              type: "radio",
              label: "\"We require experience.\" This sentence in passive voice is:",
              options: [
                { value: "Experience is required.", label: "Experience is required." },
                { value: "Experience is requiring.", label: "Experience is requiring." },
                { value: "Experience was required.", label: "Experience was required." },
              ],
              expectedAnswer: "Experience is required.",
            },
          ],
        },
        {
          id: "jobad-ex2",
          title: "Unscramble the job ad sentence",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Lunch", "breaks", "are", "not", "paid", "at", "this", "location"],
              correctAnswer: "Lunch breaks are not paid at this location",
            },
          ],
        },
        {
          id: "jobad-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct present passive form.",
          items: [
            {
              type: "text",
              label: "Good attendance ___ expected at all times. (is / are)",
              expectedAnswers: ["is"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Was Told / Was Given: First Day at Work
    // =========================================================================
    {
      id: "first-day-passive",
      title: "Was Told / Was Given: First Day at Work",
      icon: "🗝️",
      explanation: `
        ${sceneCard("sceneFirstDay", "Hotel front desk, Monday morning. Gloria's first day.", "blue")}

        <p>Monday is Gloria's first day. A lot happens. That night she calls her cousin to explain everything that happened to her.</p>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "I <strong>was given</strong> a locker and a uniform. Then I <strong>was told</strong> my schedule for the week.", side: "right", tone: "terracotta" },
          { speaker: "Marcos", avatar: "👨🏾", text: "Did they show you the break room?", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "Yes. I <strong>was shown</strong> everything by Jennifer, the floor supervisor. And I <strong>was asked</strong> to sign a form about the uniform.", side: "right", tone: "terracotta" },
          { speaker: "Marcos", avatar: "👨🏾", text: "Jennifer is good. You'll be fine.", side: "left", tone: "sage" },
        ])}

        <p>These are all <strong>past passive</strong>. Something happened to Gloria. She received the action. The person who did it (Jennifer, HR) isn't always important.</p>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past passive:</strong> was/were + V3 (past participle)</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.95rem">Singular: She <strong>was given</strong> a locker. &nbsp; Plural: They <strong>were told</strong> the rules.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("past passive", "blue")}
            <span><em>She <strong>was given</strong> a locker.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("past passive", "blue")}
            <span><em>She <strong>was told</strong> her schedule.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("past passive", "blue")}
            <span><em>They <strong>were moved</strong> to a different floor.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em>She <strong>was not paid</strong> for the training hour.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "firstday-ex1",
          title: "Choose the correct past passive form",
          items: [
            {
              type: "radio",
              label: "Gloria ___ to sign three forms on her first day.",
              options: [
                { value: "was asked", label: "was asked" },
                { value: "were asked", label: "were asked" },
                { value: "asked", label: "asked" },
              ],
              expectedAnswer: "was asked",
            },
            {
              type: "radio",
              label: "All the new cleaners ___ the same locker room.",
              options: [
                { value: "was shown", label: "was shown" },
                { value: "were shown", label: "were shown" },
                { value: "shown", label: "shown" },
              ],
              expectedAnswer: "were shown",
            },
            {
              type: "radio",
              label: "\"She <strong>was not pay</strong> for the extra hour.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'was not paid' (V3)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "firstday-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "was", "given", "a", "key", "to", "the", "supply", "room"],
              correctAnswer: "She was given a key to the supply room",
            },
          ],
        },
        {
          id: "firstday-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct past passive form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "Gloria ___ (tell) to wear her uniform every day.",
              expectedAnswers: ["was told"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — The Schedule Was Changed
    // =========================================================================
    {
      id: "schedule-changed",
      title: "The Schedule Was Changed",
      icon: "📅",
      explanation: `
        ${sceneCard("sceneScheduleChange", "Break room at the hotel, Thursday afternoon.", "amber")}

        <p>It's Holy Week. Gloria's family goes to church on Good Friday. But on Thursday she sees something on the break room wall: the schedule was changed. She texts her coworker Jennifer.</p>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "Did you see this? My Saturday shift <strong>was changed</strong> to Friday. I <strong>wasn't told</strong> anything.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏿", text: "I know. We <strong>were moved</strong> without any notice. It's not right.", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "The supervisor said time off <strong>is required</strong> to be requested two weeks early. But nobody told me that in the beginning.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏿", text: "Talk to HR. You have the right to ask. That rule <strong>is posted</strong> in the handbook.", side: "left", tone: "sage" },
        ])}

        <p>Passive voice comes up a lot in workplace problems. When something happens without explanation, workers often describe it passively: <em>My schedule was changed. I wasn't told. We were moved.</em></p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("complaint", "amber")}
            <span><em>My shift <strong>was changed</strong> without notice.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("complaint", "amber")}
            <span><em>I <strong>wasn't told</strong> about the new rule.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("policy", "sage")}
            <span><em>Time off <strong>is required</strong> to be requested early.</em></span>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative past passive:</strong> was not / wasn't + V3</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.95rem">I <strong>wasn't told</strong>. &nbsp; We <strong>weren't given</strong> any notice. &nbsp; She <strong>was not paid</strong> for Friday.</p>
        </div>
      `,
      exercises: [
        {
          id: "schedule-ex1",
          title: "What does it mean?",
          instructions: "Choose the sentence that means the same thing.",
          items: [
            {
              type: "radio",
              label: "\"I wasn't told about the change.\"",
              options: [
                { value: "a", label: "I did not tell someone about the change." },
                { value: "b", label: "Nobody told me about the change." },
                { value: "c", label: "I changed the schedule myself." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"We were moved to a different floor.\"",
              options: [
                { value: "a", label: "We moved ourselves to a different floor." },
                { value: "b", label: "Someone moved us to a different floor." },
                { value: "c", label: "We are going to move to a different floor." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "schedule-ex2",
          title: "Correct the error",
          instructions: "One word is wrong. Choose the correct version.",
          items: [
            {
              type: "radio",
              label: "\"My check <strong>were not paid</strong> on time.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'was not paid' (singular subject: my check)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "schedule-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct negative past passive.",
          items: [
            {
              type: "text",
              label: "Gloria ___ ___ about the schedule change. (negative: was not told)",
              expectedAnswers: ["was not told", "wasn't told"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Active or Passive? Choosing the Right One
    // =========================================================================
    {
      id: "active-or-passive",
      title: "Active or Passive? Choosing the Right One",
      icon: "⚖️",
      explanation: `
        ${sceneCard("sceneActivePassive", "Break room. Gloria reviews a copy of the employee handbook.", "sage")}

        <p>Both active and passive voice are correct. The choice depends on what you want to focus on.</p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.5rem; font-size: 1.05rem">Use <strong>active</strong> when the doer is important or clear.</p>
          <p style="margin: 0; font-size: 1.05rem">Use <strong>passive</strong> when the doer is unknown, obvious, or not the point.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("active", "blue")}
            <span><em>Jennifer <strong>checked</strong> our hours.</em> (Jennifer is important here.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("passive", "terracotta")}
            <span><em>Our hours <strong>were checked</strong>.</em> (We don't know or say who.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("active", "blue")}
            <span><em>The manager <strong>posts</strong> the schedule on Thursdays.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("passive", "terracotta")}
            <span><em>The schedule <strong>is posted</strong> on Thursdays.</em> (Job ad style.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("passive", "terracotta")}
            <span><em>I <strong>wasn't paid</strong> for the extra hour.</em> (Doer obvious: employer.)</span>
          </div>
        </div>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "The handbook says 'Overtime <strong>is calculated</strong> after 40 hours.' But I worked 43 and my check <strong>was short</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏿", text: "That happens. You have to say it clearly: 'I <strong>was not paid</strong> for three hours of overtime.'", side: "left", tone: "sage" },
        ])}
      `,
      exercises: [
        {
          id: "choice-ex1",
          title: "Active or passive? Choose the better sentence.",
          instructions: "Pick the sentence that sounds more natural for each situation.",
          items: [
            {
              type: "radio",
              label: "You don't know who changed the policy. Which sentence is better?",
              options: [
                { value: "a", label: "Someone changed the break policy." },
                { value: "b", label: "The break policy was changed." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You want to talk about what your supervisor did. Which is better?",
              options: [
                { value: "a", label: "Jennifer approved my time-off request." },
                { value: "b", label: "My time-off request was approved by Jennifer." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "choice-ex2",
          title: "Spot the error",
          instructions: "One sentence has a grammar mistake. Find it.",
          items: [
            {
              type: "radio",
              label: "\"My overtime <strong>were not paid</strong> last Friday.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'was not paid' (overtime is singular)" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Safety training is provided to all new workers.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "choice-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Overtime", "is", "calculated", "after", "forty", "hours"],
              correctAnswer: "Overtime is calculated after forty hours",
            },
          ],
        },
        {
          id: "choice-ex4",
          title: "Fill in the blank",
          instructions: "Write the correct passive form (present or past).",
          items: [
            {
              type: "text",
              label: "I ___ not paid for three hours of overtime last week. (was / were)",
              expectedAnswers: ["was"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/passive-voice\" style=\"font-weight:700;text-decoration:underline\">Passive Voice Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ — 10 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "pvwwd-q1",
      question: "Gloria got a new job. She says: 'I ___ hired last Monday.' Which word fits?",
      options: [
        { value: "a", label: "am" },
        { value: "b", label: "was" },
        { value: "c", label: "were" },
      ],
      correctAnswer: "b",
      explanation: "Past passive with a singular subject uses 'was': I was hired.",
      topic: "passive-voice",
      skill: "usage",
      skillTag: "past-passive-singular",
      difficulty: "easy",
    },
    {
      id: "pvwwd-q3",
      question: "Which sentence is passive voice?",
      options: [
        { value: "a", label: "The manager posted the schedule." },
        { value: "b", label: "The schedule was posted by the manager." },
        { value: "c", label: "The manager is posting the schedule." },
      ],
      correctAnswer: "b",
      explanation: "Passive voice puts the receiver (the schedule) first and uses was + V3.",
      topic: "passive-voice",
      skill: "recognition",
      skillTag: "identify-passive-structure",
      difficulty: "easy",
    },
    {
      id: "pvwwd-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"My overtime ___ not paid.\" (Overtime is singular — was or were?)",
      correctAnswer: "was",
      explanation: "'Overtime' is singular, so the correct passive form is 'was not paid,' not 'were not paid.'",
      topic: "passive-voice",
      skill: "usage",
      skillTag: "was-were-agreement",
      difficulty: "easy",
    },
    {
      id: "pvwwd-q5",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "My check was short last Friday." },
        { value: "b", label: "Safety training is provided to all workers." },
        { value: "c", label: "My overtime were not paid." },
      ],
      correctAnswer: "c",
      explanation: "'Overtime' is singular, so the correct form is 'was not paid,' not 'were not paid.'",
      topic: "passive-voice",
      skill: "error-detection",
      skillTag: "was-were-agreement",
      difficulty: "medium",
    },
    {
      id: "pvwwd-qws1",
      type: "word-scramble" as const,
      question: "Gloria reads the schedule that was posted at work. Put the words in order.",
      words: ["The", "schedule", "was", "posted", "by", "the", "manager"],
      correctAnswer: "The schedule was posted by the manager",
      hint: "receiver + was/were + past participle + by + doer",
      explanation: "Passive voice: the receiver (the schedule) comes first, then was + V3 (posted), then by + the doer.",
      topic: "passive-voice",
      skill: "usage",
      skillTag: "identify-passive-structure",
      difficulty: "medium",
    },
  ],
};
