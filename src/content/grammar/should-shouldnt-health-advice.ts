import type { InteractiveGuideContent } from "@/types/activity";
import { shouldShouldntHealthAdviceImages as img } from "@/data/should-shouldnt-health-advice-images.generated";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" = "sage"
): string => {
  const scene = img[sceneId];
  if (!scene) return "";
  const credit = scene.credit.url
    ? `<a href="${scene.credit.url}" rel="noopener" target="_blank">${scene.credit.name}</a>`
    : scene.credit.name;
  return `
    <div class="gc-bg-white" style="margin: 0 0 1.5rem 0; padding: 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 10px rgba(0,0,0,0.06)">
      <img src="${scene.url}" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover" />
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
        <span style="font-size: 0.68rem; opacity: 0.7">Photo: ${credit} / Unsplash</span>
      </div>
    </div>
  `;
};

const dialogue = (
  turns: { speaker: string; avatar: string; text: string }[]
): string => {
  const bubbles = turns.map((t) => `
    <div style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem">
      <span style="font-size: 1.6rem; line-height: 1; flex-shrink: 0">${t.avatar}</span>
      <div>
        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6; margin-bottom: 0.2rem">${t.speaker}</div>
        <div style="background: #f5f0e8; border-radius: 0 0.75rem 0.75rem 0.75rem; padding: 0.6rem 0.9rem; font-size: 0.97rem; line-height: 1.5">${t.text}</div>
      </div>
    </div>
  `).join("");
  return `<div style="margin: 0 0 1.5rem 0">${bubbles}</div>`;
};

const labelPill = (text: string, color: "terracotta" | "sage" | "blue" | "amber"): string =>
  `<span class="gc-text-${color}" style="display: inline-block; padding: 0.15em 0.55em; border-radius: 999px; font-size: 0.8em; font-weight: 700; background: var(--gc-${color}-alpha, rgba(0,0,0,0.07)); white-space: nowrap">${text}</span>`;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const shouldShouldntHealthAdviceContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [

    // -------------------------------------------------------------------------
    // SECTION 1 — Should / Shouldn't
    // -------------------------------------------------------------------------
    {
      id: "should-shouldnt-basics",
      stepNumber: 1,
      title: "Your Back Hurts. Now What?",
      icon: "🏥",
      tenseDiagram: {
        title: "Should: advice about now or the future",
        elements: [
          { id: "td-past", type: "single-dot", zone: "past", position: 30 },
          { id: "td-present", type: "single-dot", zone: "present", position: 50 },
          { id: "td-future", type: "solid-line", zone: "future", position: 60 },
        ],
      },
      explanation: `
        ${sceneCard("sceneClinicWaiting", "Walk-in clinic, 7 a.m. before the morning shift.", "sage")}

        <p>Yolanda works at a warehouse in East Boston. Yesterday she lifted a heavy box wrong. Her lower back is killing her. She called in late and came to the walk-in clinic before her shift.</p>

        ${dialogue([
          { speaker: "Nurse Sandra", avatar: "👩🏻", text: "Good morning. What brings you in today?" },
          { speaker: "Yolanda", avatar: "👩🏽", text: "My back. I hurt it lifting boxes at work yesterday. It's really bad." },
          { speaker: "Nurse Sandra", avatar: "👩🏻", text: "Okay. You <strong>should</strong> rest for at least two days. And you <strong>shouldn't</strong> lift anything over ten pounds." },
          { speaker: "Yolanda", avatar: "👩🏽", text: "Two days? I have a shift today..." },
          { speaker: "Nurse Sandra", avatar: "👩🏻", text: "I know it's hard. But if you don't rest now, it will get a lot worse." },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem"><strong>Should</strong> gives advice. It means "this is a good idea." <strong>Shouldn't</strong> gives negative advice. It means "this is a bad idea."</p>
        </div>

        <div style="display: grid; gap: 0.6rem; margin-bottom: 1.5rem">
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1">You <strong>should</strong> rest for two days.</span>
            ${labelPill("good advice", "sage")}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1">You <strong>shouldn't</strong> lift anything over ten pounds.</span>
            ${labelPill("bad idea", "terracotta")}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1">She <strong>should</strong> see a doctor.</span>
            ${labelPill("good advice", "sage")}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1">He <strong>shouldn't</strong> ignore the pain.</span>
            ${labelPill("bad idea", "terracotta")}
          </div>
        </div>

        <div style="background: rgba(106,141,115,0.08); padding: 1rem 1.25rem; border-radius: 0.6rem; margin-bottom: 1.5rem">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700">Formula</p>
          <p style="margin: 0; font-family: monospace; font-size: 0.97rem">Subject + <strong>should</strong> + base verb &nbsp;&nbsp;(no -s, no -ing, no -ed)</p>
          <p style="margin: 0.4rem 0 0 0; font-family: monospace; font-size: 0.97rem">Subject + <strong>should not / shouldn't</strong> + base verb</p>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Choose the Right Word",
          instructions: "Choose should or shouldn't.",
          items: [
            {
              type: "radio",
              label: "Yolanda's back is hurting. She ___ lift heavy boxes at work today.",
              options: [
                { value: "should", label: "should" },
                { value: "shouldnt", label: "shouldn't" },
              ],
              expectedAnswer: "shouldnt",
            },
            {
              type: "radio",
              label: "Yolanda didn't sleep well because of the pain. She ___ try to rest this afternoon.",
              options: [
                { value: "should", label: "should" },
                { value: "shouldnt", label: "shouldn't" },
              ],
              expectedAnswer: "should",
            },
            {
              type: "radio",
              label: "The nurse told Yolanda her appointment is important. Yolanda ___ miss it.",
              options: [
                { value: "should", label: "should" },
                { value: "shouldnt", label: "shouldn't" },
              ],
              expectedAnswer: "shouldnt",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Build the Sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Arrange the words to give advice:",
              words: ["You", "shouldn't", "work", "today", "with", "back", "pain"],
              correctAnswer: "You shouldn't work today with back pain",
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Your Advice",
          instructions: "Complete the sentence with your own words. Use should or shouldn't.",
          items: [
            {
              type: "text",
              label: "Yolanda's back hurts. She ___ (your advice).",
              expectedAnswers: [
                "should rest",
                "should rest at home",
                "shouldn't work",
                "shouldn't lift",
                "should see a doctor",
                "should take medicine",
                "should take ibuprofen",
                "should use ice",
                "should call her supervisor",
              ],
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // SECTION 2 — Ought To and Had Better
    // -------------------------------------------------------------------------
    {
      id: "ought-to-had-better",
      stepNumber: 2,
      title: "A Little Stronger: Ought To and Had Better",
      icon: "⚠️",
      explanation: `
        <p>The doctor comes in after the nurse. He has more to say.</p>

        ${dialogue([
          { speaker: "Dr. Mitchell", avatar: "👨🏾", text: "Hi Yolanda. The nurse told me about your back. You <strong>ought to</strong> take anti-inflammatory medicine with food for the next five days." },
          { speaker: "Yolanda", avatar: "👩🏽", text: "Okay. Can I still go to work?" },
          { speaker: "Dr. Mitchell", avatar: "👨🏾", text: "You <strong>had better</strong> not go back until Thursday. If you do, you could make this a lot worse. I'm serious." },
          { speaker: "Yolanda", avatar: "👩🏽", text: "I understand. I'll call my supervisor." },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem"><strong>Ought to</strong> is similar to should. It means "this is a good idea." <strong>Had better</strong> is stronger. It means "do this or something bad will happen."</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem">
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="font-size: 1.2rem">💬</span>
            <span>You <strong>should</strong> rest.</span>
            ${labelPill("advice", "sage")}
          </div>
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="font-size: 1.2rem">💬</span>
            <span>You <strong>ought to</strong> rest.</span>
            ${labelPill("advice", "sage")}
          </div>
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: rgba(176,87,64,0.1); border-radius: 0.5rem">
            <span style="font-size: 1.2rem">⚠️</span>
            <span>You <strong>had better</strong> rest.</span>
            ${labelPill("warning", "terracotta")}
          </div>
        </div>

        <div style="background: rgba(106,141,115,0.08); padding: 1rem 1.25rem; border-radius: 0.6rem; margin-bottom: 1.5rem">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700">Formulas</p>
          <p style="margin: 0; font-family: monospace; font-size: 0.95rem">Subject + <strong>ought to</strong> + base verb</p>
          <p style="margin: 0.4rem 0 0 0; font-family: monospace; font-size: 0.95rem">Subject + <strong>had better</strong> + base verb &nbsp; (warning: bad result if you don't)</p>
          <p style="margin: 0.4rem 0 0 0; font-family: monospace; font-size: 0.95rem">Subject + <strong>had better not</strong> + base verb</p>
        </div>

        <p style="font-size: 0.92rem; color: #555">Note: <em>Had better</em> sounds formal or serious. Doctors, supervisors, and parents use it when something is really important. Don't use it for small everyday advice.</p>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "How Strong Is the Advice?",
          instructions: "Is this advice or a warning?",
          items: [
            {
              type: "radio",
              label: '"You <strong>ought to</strong> drink more water during the day."',
              options: [
                { value: "advice", label: "Advice (good idea, not urgent)" },
                { value: "warning", label: "Warning (do this or something bad happens)" },
              ],
              expectedAnswer: "advice",
            },
            {
              type: "radio",
              label: '"You <strong>had better</strong> not miss your follow-up appointment. Your back could get permanent damage."',
              options: [
                { value: "advice", label: "Advice (good idea, not urgent)" },
                { value: "warning", label: "Warning (do this or something bad happens)" },
              ],
              expectedAnswer: "warning",
            },
            {
              type: "radio",
              label: '"She <strong>ought to</strong> take the medicine with food."',
              options: [
                { value: "advice", label: "Advice (good idea, not urgent)" },
                { value: "warning", label: "Warning (do this or something bad happens)" },
              ],
              expectedAnswer: "advice",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Choose the Right Modal",
          instructions: "Which modal fits best?",
          items: [
            {
              type: "radio",
              label: "The doctor is very serious: \"You ___ lift anything heavy for two weeks. If you do, you could need surgery.\"",
              options: [
                { value: "ought-to-not", label: "ought not to" },
                { value: "had-better-not", label: "had better not" },
                { value: "shouldnt", label: "shouldn't" },
              ],
              expectedAnswer: "had-better-not",
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Build a Warning",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Arrange the words:",
              words: ["You", "had", "better", "keep", "your", "follow-up", "appointment"],
              correctAnswer: "You had better keep your follow-up appointment",
            },
          ],
        },
        {
          id: "s2-ex4",
          title: "Ought To vs. Had Better",
          instructions: "Complete the sentence. Use ought to or had better.",
          items: [
            {
              type: "text",
              label: "The doctor is very worried about Yolanda's back. He says: \"You ___ (come back / or this will get worse).\"",
              expectedAnswers: [
                "had better come back",
                "had better not skip the follow-up",
                "had better rest",
                "had better not go to work",
              ],
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // SECTION 3 — Asking for Advice
    // -------------------------------------------------------------------------
    {
      id: "asking-advice",
      stepNumber: 3,
      title: "Asking for Advice",
      icon: "🙋",
      explanation: `
        <p>In the next curtained area, Rami is also at the clinic. He had a bad cough for a week. When he hears Yolanda struggling to understand the nurse's fast instructions, he helps her ask again.</p>

        ${dialogue([
          { speaker: "Yolanda", avatar: "👩🏽", text: "Excuse me. <strong>Should</strong> I take ibuprofen or just rest?" },
          { speaker: "Nurse Sandra", avatar: "👩🏻", text: "You can take ibuprofen every six hours. Not more than that." },
          { speaker: "Rami", avatar: "👨🏽", text: "Hey Yolanda. <strong>What should</strong> you ask about the physical therapy?" },
          { speaker: "Yolanda", avatar: "👩🏽", text: "Good idea. Excuse me, <strong>should</strong> I see a physical therapist too?" },
          { speaker: "Nurse Sandra", avatar: "👩🏻", text: "Yes. You <strong>ought to</strong> call this number. They take MassHealth." },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">To ask for advice, put <strong>Should</strong> at the beginning of the question: <strong>Should I</strong> + base verb? Or ask an open question: <strong>What should I</strong> + base verb?</p>
        </div>

        <div style="display: grid; gap: 0.6rem; margin-bottom: 1.5rem">
          <div style="padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <strong>Should I</strong> take ibuprofen? ${labelPill("yes/no question", "blue")}
          </div>
          <div style="padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <strong>Should I</strong> see a specialist? ${labelPill("yes/no question", "blue")}
          </div>
          <div style="padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <strong>What should I</strong> do about the pain? ${labelPill("open question", "amber")}
          </div>
          <div style="padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <strong>What should I</strong> eat while I'm taking this medicine? ${labelPill("open question", "amber")}
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Is This a Correct Question?",
          instructions: "Is the question formed correctly? Choose Yes or No.",
          items: [
            {
              type: "radio",
              label: '"Should I to call the physical therapist today?"',
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Incorrect (remove \"to\". Should I + base verb)" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: '"What should I do if the pain gets worse?"',
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Incorrect" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: '"Should I takes the medicine with food?"',
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Incorrect (use base verb: take, not takes)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Form the Question",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Arrange the words to form a question:",
              words: ["Should", "I", "call", "the", "physical", "therapist", "today"],
              correctAnswer: "Should I call the physical therapist today",
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "At the Clinic",
          instructions: "Write a question Yolanda could ask the doctor. Use Should I or What should I.",
          items: [
            {
              type: "text",
              label: "Yolanda wants to know if she can go back to work on Thursday. Write her question.",
              expectedAnswers: [
                "Should I go back to work on Thursday",
                "Should I go back to work on Thursday?",
                "Should I work on Thursday",
                "Should I work on Thursday?",
                "What should I do about work on Thursday",
                "When should I go back to work",
              ],
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // SECTION 4 — Pharmacy: Shouldn't vs. Must Not
    // -------------------------------------------------------------------------
    {
      id: "pharmacy-shouldnt-mustnot",
      stepNumber: 4,
      title: "At the Pharmacy Counter",
      icon: "💊",
      explanation: `
        ${sceneCard("scenePharmacyCounter", "Pharmacy counter, 8:30 a.m.", "sage")}

        <p>Yolanda picks up her ibuprofen prescription. The pharmacist, James, explains the warnings.</p>

        ${dialogue([
          { speaker: "James (Pharmacist)", avatar: "👨🏻", text: "Hi. I have a few things to go over. You <strong>shouldn't</strong> skip doses. Take it every six hours, even if you feel better." },
          { speaker: "Yolanda", avatar: "👩🏽", text: "Okay. What about food?" },
          { speaker: "James (Pharmacist)", avatar: "👨🏻", text: "You <strong>must not</strong> take this on an empty stomach. You're also on blood pressure medicine, right? You <strong>must not</strong> take both at the same time. That's dangerous." },
          { speaker: "Yolanda", avatar: "👩🏽", text: "How far apart?" },
          { speaker: "James (Pharmacist)", avatar: "👨🏻", text: "At least two hours between them." },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem"><strong>Shouldn't</strong> = bad idea, but your choice. <strong>Must not</strong> = a hard rule. Don't do it. It's dangerous or forbidden.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem">
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="font-size: 1.2rem">💬</span>
            <span>You <strong>shouldn't</strong> skip doses.</span>
            ${labelPill("bad idea", "amber")}
          </div>
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: rgba(176,87,64,0.1); border-radius: 0.5rem">
            <span style="font-size: 1.2rem">🚫</span>
            <span>You <strong>must not</strong> take this on an empty stomach.</span>
            ${labelPill("hard rule", "terracotta")}
          </div>
          <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: rgba(176,87,64,0.1); border-radius: 0.5rem">
            <span style="font-size: 1.2rem">🚫</span>
            <span>You <strong>must not</strong> mix these two medicines.</span>
            ${labelPill("hard rule", "terracotta")}
          </div>
        </div>

        <div style="background: rgba(106,141,115,0.08); padding: 1rem 1.25rem; border-radius: 0.6rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.4rem 0; font-weight: 700">When to use each:</p>
          <ul style="margin: 0; padding-left: 1.2rem">
            <li style="margin-bottom: 0.3rem"><strong>Shouldn't</strong> = bad idea, but not dangerous</li>
            <li><strong>Must not / Mustn't</strong> = dangerous, forbidden, or a hard medical rule</li>
          </ul>
        </div>

        <p>Yolanda is back home, resting. Rami texts her to check in.</p>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/modals-health-advice-caution-consent\" style=\"font-weight:700;text-decoration:underline\">Modals for Health: Advice, Caution &amp; Consent Full Guide</a>.",
      },
      exercises: [
        {
          id: "s4-ex1",
          title: "Advice or Hard Rule?",
          instructions: "Choose shouldn't (bad idea) or must not (hard rule, dangerous).",
          items: [
            {
              type: "radio",
              label: "You ___ mix ibuprofen and blood pressure medicine. It can cause a medical emergency.",
              options: [
                { value: "shouldnt", label: "shouldn't" },
                { value: "must-not", label: "must not" },
              ],
              expectedAnswer: "must-not",
            },
            {
              type: "radio",
              label: "You ___ skip doses. You'll recover faster if you take all of them.",
              options: [
                { value: "shouldnt", label: "shouldn't" },
                { value: "must-not", label: "must not" },
              ],
              expectedAnswer: "shouldnt",
            },
            {
              type: "radio",
              label: "You ___ drive after taking this medicine. It causes serious drowsiness.",
              options: [
                { value: "shouldnt", label: "shouldn't" },
                { value: "must-not", label: "must not" },
              ],
              expectedAnswer: "must-not",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Error Detection",
          instructions: "One sentence uses the wrong modal. Which one?",
          items: [
            {
              type: "radio",
              label: "Which sentence uses the wrong modal for the situation?",
              options: [
                { value: "a", label: '"You shouldn\'t take this medicine on an empty stomach. It will damage your stomach lining permanently." (dangerous situation)' },
                { value: "b", label: '"You shouldn\'t stay up too late tonight. Rest is important." (general advice)' },
                { value: "c", label: '"You ought to drink more water during the day." (general advice)' },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Pharmacist Warning",
          instructions: "Write a warning the pharmacist could give. Use must not.",
          items: [
            {
              type: "text",
              label: "Write a hard rule about taking medicine. Start with: You must not ...",
              expectedAnswers: [
                "You must not take this on an empty stomach",
                "You must not mix these medicines",
                "You must not take more than the dose",
                "You must not skip doses",
                "You must not drive after taking this",
                "You must not take both medicines at the same time",
                "You must not take more than three times a day",
              ],
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "mq-should-basic",
      question: "The nurse says: \"You ___ rest for two days.\" Which word fits best?",
      options: [
        { value: "a", label: "must" },
        { value: "b", label: "should" },
        { value: "c", label: "will" },
      ],
      correctAnswer: "b",
      explanation: "Should gives advice. It means 'this is a good idea.' Must would mean she has no choice.",
      topic: "should-advice",
      skill: "usage",
      skillTag: "should-basic-usage",
      difficulty: "easy",
    },
    {
      id: "mq-had-better-warning",
      question: "The doctor says: \"You had better not go back to work until Thursday.\" Why does he use 'had better'?",
      options: [
        { value: "a", label: "He's being polite and it's just a suggestion." },
        { value: "b", label: "He's giving a strong warning. If she goes back, something bad will happen." },
        { value: "c", label: "He's talking about what she did in the past." },
      ],
      correctAnswer: "b",
      explanation: "Had better signals a warning. There is a bad consequence if she ignores the advice.",
      topic: "should-advice",
      skill: "usage",
      skillTag: "had-better-warning",
      difficulty: "medium",
    },
    {
      id: "mq-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Yolanda's back hurts. She ___ lift heavy boxes today.\" (bad idea)",
      correctAnswer: "shouldn't",
      acceptedAnswers: ["should not"],
      explanation: "Shouldn't gives negative advice. Lifting heavy boxes is a bad idea for her back.",
      topic: "should-advice",
      skill: "usage",
      skillTag: "shouldnt-basic-usage",
      difficulty: "easy",
    },
    {
      id: "mq-mustnot-vs-shouldnt",
      question: "The pharmacist says: \"You must not mix this with your blood pressure medicine.\" Why 'must not' and not 'shouldn't'?",
      options: [
        { value: "a", label: "It's just a general suggestion, not urgent." },
        { value: "b", label: "It's a hard rule. Mixing them is dangerous." },
        { value: "c", label: "It happened in the past." },
      ],
      correctAnswer: "b",
      explanation: "Must not is used for hard rules and dangerous situations. Shouldn't is used for general bad ideas.",
      topic: "should-advice",
      skill: "usage",
      skillTag: "mustnot-vs-shouldnt",
      difficulty: "medium",
    },
    {
      id: "mq-ws1",
      type: "word-scramble" as const,
      question: "The doctor gives Yolanda a strong warning about her back. Put the words in order.",
      words: ["You", "had", "better", "rest", "today"],
      correctAnswer: "You had better rest today",
      hint: "had better + base verb (no 'to')",
      explanation: "Had better + base verb gives a strong warning. No 'to' after had better.",
      topic: "should-advice",
      skill: "usage",
      skillTag: "had-better-word-order",
      difficulty: "medium",
    },
  ],
};
