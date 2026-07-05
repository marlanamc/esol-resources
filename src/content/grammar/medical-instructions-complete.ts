import type { InteractiveGuideContent } from "@/types/activity";
import { medicalInstructionsImages as img } from "@/data/medical-instructions-images.generated";

// ---------------------------------------------------------------------------
// Reusable inline HTML helpers
// ---------------------------------------------------------------------------
// Kept as template builders so the section explanations stay readable and
// every scene card / dialogue / diagram renders consistently.
// Only tags allowed by src/utils/sanitize.ts are used here — no <figure> etc.
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" | "green" | "red" | "purple" = "terracotta"
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

type Turn = { speaker: string; avatar: string; text: string; side: "left" | "right"; tone: "terracotta" | "sage" | "blue" | "amber" | "purple" | "green" };

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

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const medicalInstructionsCompleteContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =================================================================
    // 1. INTRO — ER Triage
    // =================================================================
    {
      id: "intro-triage",
      title: "You just walked into the ER",
      icon: "🚑",
      explanation: `
        ${sceneCard("triageWaiting", "Hospital entrance — 8:15 AM", "terracotta")}

        <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem">
          <p style="font-size: 1.1rem; margin: 0"><strong>You:</strong> <em>"My head is pounding and I can't keep food down."</em></p>
          <p style="font-size: 1.1rem; margin: 0.5rem 0 0"><strong>Nurse:</strong> <em>"Please sit down. You should fill out this form. You must not leave until the doctor sees you."</em></p>
          <p style="margin: 0.75rem 0 0; font-weight: 600">Three small sentences. Three different kinds of grammar. That's today's guide.</p>
        </div>

        <h3>Your journey through this guide</h3>
        <ol style="margin: 0.5rem 0 1.25rem 1rem; line-height: 1.75">
          <li>🚪 <strong>ER Triage</strong> — what kind of sentence is each one?</li>
          <li>💊 <strong>Pharmacy & Prescription labels</strong> — imperatives everywhere</li>
          <li>👩‍⚕️ <strong>Doctor's office</strong> — declaratives and polite questions</li>
          <li>🎚️ <strong>Tone ladder</strong> — same meaning, different strength</li>
          <li>🔑 <strong>Modals crash course</strong> — should, must, can, need to</li>
          <li>⚠️ <strong>Pharmacist's warning</strong> — advice vs. danger</li>
          <li>🙋 <strong>Reception desk</strong> — your rights and permission</li>
          <li>🎭 <strong>Role-play stack</strong> — rebuild real conversations</li>
          <li>💼 <strong>Calling out sick at work</strong> — respectful language</li>
          <li>🏁 <strong>Discharge paperwork</strong> — quick review</li>
        </ol>

        <h3>Three tiny sentences, three big ideas</h3>

        <div style="display: grid; gap: 0.875rem; margin: 1.25rem 0">
          <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-terracotta" style="margin: 0 0 0.25rem 0">🗯️ Imperatives — a command</h4>
            <p style="margin: 0">"<strong>Take</strong> this medicine." &nbsp;·&nbsp; "<strong>Don't</strong> drive after."</p>
          </div>
          <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-sage" style="margin: 0 0 0.25rem 0">💬 Declaratives — a statement</h4>
            <p style="margin: 0">"<strong>You need to</strong> take this." &nbsp;·&nbsp; "<strong>I recommend</strong> resting."</p>
          </div>
          <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-blue" style="margin: 0 0 0.25rem 0">🔑 Modals — meaning-changers inside declaratives</h4>
            <p style="margin: 0"><strong>should</strong> (advice) · <strong>must</strong> (required) · <strong>can</strong> (permission) · <strong>need to</strong> (necessity)</p>
          </div>
        </div>
      `,
      tipBox: {
        title: "💡 Why this matters",
        content:
          "At a clinic you'll SEE imperatives on signs and labels, HEAR modals from your doctor, and NEED declaratives to speak respectfully back. Same grammar, very different jobs.",
      },
      exercises: [
        {
          id: "intro-diagnostic-1",
          title: "Quick Check: What Type of Sentence?",
          instructions: "Identify each sentence the nurse just said to you.",
          items: [
            {
              type: "radio",
              label: "\"<span class='eg-verb'>Take</span> this medicine twice a day.\"",
              options: [
                { value: "imperative", label: "Imperative (command)" },
                { value: "declarative", label: "Declarative (statement)" },
              ],
              expectedAnswer: "imperative",
            },
            {
              type: "radio",
              label: "\"<span class='eg-helper'>You should</span> take this medicine twice a day.\"",
              options: [
                { value: "imperative", label: "Imperative (command)" },
                { value: "declarative", label: "Declarative (statement with modal)" },
              ],
              expectedAnswer: "declarative",
            },
            {
              type: "radio",
              label: "\"You <span class='eg-helper'>must not</span> drink alcohol while taking this.\"",
              options: [
                { value: "caution", label: "Caution (required/dangerous)" },
                { value: "advice", label: "Advice (recommended)" },
                { value: "permission", label: "Permission (allowed)" },
              ],
              expectedAnswer: "caution",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 2. Imperatives on signs & labels
    // =================================================================
    {
      id: "imperatives-signs",
      stepNumber: 1,
      title: "Clinic signs & prescription labels",
      icon: "🪧",
      explanation: `
        ${sceneCard("clinicSign", "Walking in the front door", "terracotta")}

        <h3>Imperatives: the language of signs</h3>
        <p>Every sign, sticker, and prescription label you pass in a clinic is an <strong>imperative</strong>: a short command with no subject. The subject "you" is understood.</p>

        <div class="gc-bg-terracotta-alpha" style="padding: 1rem 1.25rem; border-radius: 0.625rem; margin: 1rem 0">
          <h4 style="margin: 0 0 0.375rem 0">Formula</h4>
          <p style="margin: 0; font-size: 1.2rem; font-weight: 700" class="gc-text-terracotta">[Base verb] + (object/details)</p>
          <p style="margin: 0.25rem 0 0; font-style: italic; opacity: 0.8">The subject "you" is invisible.</p>
        </div>

        <h3>Real prescription sticker</h3>

        <div style="max-width: 440px; margin: 1.25rem auto; border: 2px solid #1a202c; border-radius: 0.375rem; overflow: hidden; font-family: 'Courier New', 'Consolas', monospace; background: #fffdf6">
          <div style="background: #dc2626; color: white; padding: 0.4rem 0.85rem; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.1em">⚠️ WARNING &nbsp;·&nbsp; READ CAREFULLY</div>
          <div style="padding: 0.85rem 1rem 0.95rem; font-size: 0.92rem; line-height: 1.7">
            <div>▸ <strong class="gc-text-terracotta">Take</strong> 1 tablet twice daily with food.</div>
            <div>▸ <strong class="gc-text-terracotta">Finish</strong> the entire bottle, even if you feel better.</div>
            <div>▸ <strong class="gc-text-red">Do not</strong> drink alcohol while taking this medication.</div>
            <div>▸ <strong class="gc-text-red">Avoid</strong> driving or operating heavy machinery.</div>
            <div>▸ <strong class="gc-text-terracotta">Call</strong> your doctor if rash or swelling occurs.</div>
          </div>
          <div style="background: rgba(0,0,0,0.05); padding: 0.35rem 0.85rem; font-size: 0.72rem; letter-spacing: 0.05em">RX# 48291 &nbsp;·&nbsp; Dr. Chen &nbsp;·&nbsp; City Clinic Pharmacy</div>
        </div>

        <p>Notice — every line starts with a verb: <em>Take, Finish, Do not, Avoid, Call</em>. No "you". That's the whole trick.</p>

        <h3>Three flavors of imperative</h3>

        <div style="display: grid; gap: 0.875rem; margin: 1rem 0">
          <div class="gc-bg-white" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #c86b51">
            <h4 class="gc-text-terracotta" style="margin: 0 0 0.25rem 0">1. Direct command (strong)</h4>
            <p style="margin: 0">"<strong>Stop</strong> smoking." &nbsp;·&nbsp; "<strong>Take</strong> this twice a day."</p>
          </div>
          <div class="gc-bg-white" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884">
            <h4 class="gc-text-sage" style="margin: 0 0 0.25rem 0">2. Polite request (+ please)</h4>
            <p style="margin: 0">"<strong>Please</strong> fill out this form." &nbsp;·&nbsp; "<strong>Please</strong> wait here."</p>
          </div>
          <div class="gc-bg-white" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #dc2626">
            <h4 class="gc-text-red" style="margin: 0 0 0.25rem 0">3. Negative (Don't / Do not)</h4>
            <p style="margin: 0">"<strong>Don't</strong> eat before the test." &nbsp;·&nbsp; "<strong>Do not</strong> take on empty stomach."</p>
          </div>
        </div>
      `,
      tipBox: {
        title: "💡 Key Point",
        content: "Imperatives have NO subject (no 'you'). They start directly with the verb — that's how you spot them.",
      },
      exercises: [
        {
          id: "imperatives-ex-1",
          title: "Practice: Identifying Imperatives",
          instructions: "Short checks on sentence structure.",
          items: [
            {
              type: "radio",
              label: "Which sentence is an imperative?",
              options: [
                { value: "b", label: "You take this medicine." },
                { value: "a", label: "Take this medicine." },
                { value: "c", label: "You should take this medicine." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What makes a sentence an imperative?",
              options: [
                { value: "b", label: "Has a subject and verb" },
                { value: "c", label: "Uses past tense" },
                { value: "a", label: "Starts with base verb, no subject (you is understood)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is a negative imperative?",
              options: [
                { value: "a", label: "Don't chew the tablet." },
                { value: "b", label: "You don't chew the tablet." },
                { value: "c", label: "You shouldn't chew the tablet." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "imperatives-word-select",
          title: "Spot the imperatives on a real leaflet",
          instructions: "Click every verb that is functioning as an imperative (a command).",
          items: [
            {
              type: "word-select",
              label: "Tap the imperative verbs in this leaflet text:",
              selectWhat: "imperative verbs",
              tokens: [
                { text: "Take", isTarget: true }, { text: "one" }, { text: "tablet" }, { text: "every" }, { text: "morning." },
                { text: "Drink", isTarget: true }, { text: "plenty" }, { text: "of" }, { text: "water." },
                { text: "Do", isTarget: true }, { text: "not", isTarget: true }, { text: "skip" }, { text: "doses." },
                { text: "You" }, { text: "should" }, { text: "rest" }, { text: "at" }, { text: "home." },
                { text: "Call", isTarget: true }, { text: "your" }, { text: "doctor" }, { text: "if" }, { text: "symptoms" }, { text: "return." },
              ],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 3. Declaratives — Doctor's office
    // =================================================================
    {
      id: "declaratives-doctor",
      stepNumber: 2,
      title: "Dr. Chen's office: declaratives",
      icon: "👩‍⚕️",
      explanation: `
        ${sceneCard("doctorPatientConsult", "Exam room 3 — 9:20 AM", "sage")}

        <h3>Declaratives: the language of conversations</h3>
        <p>When your doctor explains what's happening, she uses <strong>declaratives</strong>: full sentences with a subject. They feel softer and more human than imperatives — perfect for talking.</p>

        <div class="gc-bg-sage-alpha" style="padding: 1rem 1.25rem; border-radius: 0.625rem; margin: 1rem 0">
          <h4 style="margin: 0 0 0.375rem 0">Formula</h4>
          <p style="margin: 0; font-size: 1.2rem; font-weight: 700" class="gc-text-sage">Subject + Verb + (object/details)</p>
          <p style="margin: 0.25rem 0 0; font-style: italic; opacity: 0.8">"You…", "I…", "We…", "The medicine…"</p>
        </div>

        <h3>Listen in on a real appointment</h3>

        ${dialogue([
          { speaker: "Dr. Chen", avatar: "👩‍⚕️", side: "left", tone: "terracotta", text: "\"<strong>I think</strong> you have a sinus infection. <strong>You need to</strong> take antibiotics for ten days.\"" },
          { speaker: "Rosa (patient)", avatar: "🧕", side: "right", tone: "sage", text: "\"<strong>I have</strong> two small children at home. <strong>Can I</strong> still pick them up?\"" },
          { speaker: "Dr. Chen", avatar: "👩‍⚕️", side: "left", tone: "terracotta", text: "\"<strong>You can</strong> lift them, but <strong>you should</strong> rest when they nap. <strong>You shouldn't</strong> drive if you feel dizzy.\"" },
          { speaker: "Rosa (patient)", avatar: "🧕", side: "right", tone: "sage", text: "\"<strong>I'll</strong> take the medicine with breakfast. <strong>Do I need</strong> another appointment?\"" },
          { speaker: "Dr. Chen", avatar: "👩‍⚕️", side: "left", tone: "terracotta", text: "\"<strong>You don't need to</strong> come back unless the fever returns. <strong>You're allowed to</strong> call the nurse line any time.\"" },
          { speaker: "Rosa (patient)", avatar: "🧕", side: "right", tone: "sage", text: "\"Thank you. <strong>I'll</strong> call if anything changes.\"" },
        ])}

        <h3>Common declarative patterns in healthcare</h3>

        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0">
          <thead>
            <tr class="gc-bg-sage-alpha">
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Pattern</th>
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Example</th>
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Tone</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>You need to…</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You need to rest.</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Required (firm, friendly)</td></tr>
            <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>You should…</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You should exercise.</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Advice / suggestion</td></tr>
            <tr><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>I recommend…</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">I recommend this.</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Professional advice</td></tr>
            <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>You have to…</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You have to fast.</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Obligation</td></tr>
            <tr><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>I'll / I will…</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">I'll call tomorrow.</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Promise / plan</td></tr>
          </tbody>
        </table>
      `,
      tipBox: {
        title: "💡 Patient tip",
        content: "When speaking to your doctor, start with \"I\" or \"Could I\" whenever possible. That simple choice turns any sentence into a respectful declarative.",
      },
      exercises: [
        {
          id: "declaratives-ex-1",
          title: "Practice: understanding declaratives",
          instructions: "Identify declarative sentences and their patterns.",
          items: [
            {
              type: "radio",
              label: "What is a declarative sentence?",
              options: [
                { value: "b", label: "A sentence that gives a command without a subject" },
                { value: "a", label: "A sentence that makes a statement and has a subject" },
                { value: "c", label: "A sentence that asks a question" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"You should rest for 3 days.\" What pattern is this?",
              options: [
                { value: "b", label: "Imperative command" },
                { value: "c", label: "Question" },
                { value: "a", label: "Declarative with 'should' (advice/suggestion)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence from Dr. Chen is a declarative?",
              options: [
                { value: "a", label: "You have to call if you have questions." },
                { value: "b", label: "Call if you have questions." },
                { value: "c", label: "Do you have questions?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "declaratives-scramble",
          title: "Rebuild Dr. Chen's instruction",
          instructions: "Drag or type the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Doctor to patient — an imperative instruction:",
              words: ["check", "your", "temperature", "every", "evening"],
              correctAnswer: "Check your temperature every evening",
              correctAnswers: ["Check your temperature every evening."],
              hint: "Start with the verb. No subject.",
            },
            {
              type: "word-scramble",
              label: "Patient to doctor — a respectful declarative:",
              words: ["I", "will", "take", "it", "with", "breakfast"],
              correctAnswer: "I will take it with breakfast",
              correctAnswers: ["I will take it with breakfast."],
              hint: "Start with 'I'.",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 4. Tone Ladder
    // =================================================================
    {
      id: "tone-ladder",
      stepNumber: 3,
      title: "Same idea, five tones",
      icon: "🎚️",
      explanation: `
        <h3>The tone ladder</h3>
        <p>English has many ways to say "<em>I want you to take this medicine.</em>" The difference is <strong>tone</strong> — how strong or soft it feels. Climb the ladder from urgent at the top to gentle at the bottom.</p>

        <div style="display: grid; gap: 0.55rem; margin: 1.25rem 0">
          <div style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 0.55rem; background: rgba(220,38,38,0.14); border-left: 5px solid #dc2626">
            <span style="font-size: 1.6rem; text-align: center">🚨</span>
            <span><strong>"Take it now!"</strong> <span style="opacity: 0.75">— bare imperative, urgent</span></span>
            <span class="gc-text-red" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.05em">STRONGEST</span>
          </div>
          <div style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 0.55rem; background: rgba(234,88,12,0.14); border-left: 5px solid #ea580c">
            <span style="font-size: 1.6rem; text-align: center">⚠️</span>
            <span><strong>"You must take this."</strong> <span style="opacity: 0.75">— required / no choice</span></span>
            <span style="color: #ea580c; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.05em">STRONG</span>
          </div>
          <div style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 0.55rem; background: rgba(217,119,6,0.14); border-left: 5px solid #d97706">
            <span style="font-size: 1.6rem; text-align: center">📋</span>
            <span><strong>"You need to take this."</strong> <span style="opacity: 0.75">— firm, conversational</span></span>
            <span style="color: #b45309; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.05em">FIRM</span>
          </div>
          <div style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 0.55rem; background: rgba(5,150,105,0.14); border-left: 5px solid #059669">
            <span style="font-size: 1.6rem; text-align: center">💡</span>
            <span><strong>"You should take this."</strong> <span style="opacity: 0.75">— good idea, your choice</span></span>
            <span class="gc-text-green" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.05em">ADVICE</span>
          </div>
          <div style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 0.55rem; background: rgba(37,99,235,0.14); border-left: 5px solid #2563eb">
            <span style="font-size: 1.6rem; text-align: center">🕊️</span>
            <span><strong>"You could try taking this."</strong> <span style="opacity: 0.75">— gentle suggestion</span></span>
            <span class="gc-text-blue" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.05em">GENTLEST</span>
          </div>
        </div>

        <h3>Same day, four different speakers</h3>

        ${dialogue([
          { speaker: "Sign on door", avatar: "🪧", side: "left", tone: "terracotta", text: "\"<strong>Wash</strong> your hands before entering.\" <em style='opacity: 0.7'>(bare imperative)</em>" },
          { speaker: "Nurse", avatar: "👩‍⚕️", side: "right", tone: "amber", text: "\"<strong>You need to</strong> wash your hands before entering.\" <em style='opacity: 0.7'>(firm declarative)</em>" },
          { speaker: "Dr. Chen", avatar: "🧑‍⚕️", side: "left", tone: "green", text: "\"<strong>You should</strong> always wash your hands before seeing the baby.\" <em style='opacity: 0.7'>(advice)</em>" },
          { speaker: "Pharmacist", avatar: "💊", side: "right", tone: "blue", text: "\"<strong>You could</strong> use this hand sanitizer too, if you prefer.\" <em style='opacity: 0.7'>(suggestion)</em>" },
        ])}
      `,
      tipBox: {
        title: "💡 Choose your rung",
        content: "The verb you pick (must / need to / should / could) tells the listener exactly how much choice they have. Match the rung to the situation.",
      },
      exercises: [
        {
          id: "tone-ladder-match",
          title: "Practice: match each sentence to its rung",
          instructions: "Choose the rung each sentence belongs on.",
          items: [
            {
              type: "radio",
              label: "\"You must finish the full bottle of antibiotics.\"",
              options: [
                { value: "gentle", label: "Gentlest suggestion" },
                { value: "advice", label: "Advice (your choice)" },
                { value: "strong", label: "Strong — required / no choice" },
              ],
              expectedAnswer: "strong",
            },
            {
              type: "radio",
              label: "\"You could try a warm compress before bed.\"",
              options: [
                { value: "strongest", label: "Strongest — urgent command" },
                { value: "firm", label: "Firm — needed" },
                { value: "gentle", label: "Gentlest — soft suggestion" },
              ],
              expectedAnswer: "gentle",
            },
            {
              type: "radio",
              label: "\"You should drink more water during the day.\"",
              options: [
                { value: "advice", label: "Advice — good idea, your choice" },
                { value: "strong", label: "Strong — no choice" },
                { value: "strongest", label: "Strongest — urgent command" },
              ],
              expectedAnswer: "advice",
            },
            {
              type: "radio",
              label: "\"Call 911 now!\"",
              options: [
                { value: "strongest", label: "Strongest — urgent bare imperative" },
                { value: "advice", label: "Advice" },
                { value: "gentle", label: "Gentle suggestion" },
              ],
              expectedAnswer: "strongest",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 5. Modals crash course
    // =================================================================
    {
      id: "modals-crashcourse",
      stepNumber: 4,
      title: "Modals crash course",
      icon: "🔑",
      explanation: `
        ${sceneCard("stethoscopeDesk", "Doctor's desk, end of shift", "purple")}

        <h3>What is a modal?</h3>
        <p>A <strong>modal</strong> is a small helper verb (<em>should, must, can, may, need to</em>) that changes the meaning of the main verb. It sits between the subject and the base verb — and <strong>never changes form</strong>.</p>

        <div class="gc-bg-white" style="margin: 1.25rem 0; padding: 1rem 1.25rem; border-radius: 0.625rem; border: 2px solid #7ba884">
          <h4 style="margin: 0 0 0.5rem 0">Modal formula</h4>
          <p style="font-size: 1.3rem; text-align: center; margin: 0; line-height: 1.5">
            <span class="gc-text-blue" style="font-weight: 700">Subject</span>
            &nbsp;+&nbsp;
            <span class="gc-text-purple" style="font-weight: 700">Modal</span>
            &nbsp;+&nbsp;
            <span class="gc-text-terracotta" style="font-weight: 700">Base Verb</span>
          </p>
          <p style="margin: 0.5rem 0 0; text-align: center; font-style: italic; opacity: 0.85">
            <span class="gc-text-blue">You</span>
            <span class="gc-text-purple"> should </span>
            <span class="gc-text-terracotta">rest</span>. &nbsp;·&nbsp;
            <span class="gc-text-blue">You</span>
            <span class="gc-text-purple"> must </span>
            <span class="gc-text-terracotta">finish</span>. &nbsp;·&nbsp;
            <span class="gc-text-blue">I</span>
            <span class="gc-text-purple"> can </span>
            <span class="gc-text-terracotta">ask</span>.
          </p>
        </div>

        <h3>The modal decision tree</h3>
        <p>Not sure which modal to use? Follow the questions:</p>

        <div style="display: grid; gap: 0.625rem; margin: 1rem 0">
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 2px dashed #888; text-align: center; font-weight: 700; background: rgba(0,0,0,0.03)">Q1 · Is it DANGEROUS or legally required?</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem">
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; text-align: center; background: #dc2626; color: #ffffff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15)"><strong style="color: #ffffff">YES</strong> → must / must not</div>
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 1px dashed #aaa; text-align: center">NO → next question ↓</div>
          </div>
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 2px dashed #888; text-align: center; font-weight: 700; background: rgba(0,0,0,0.03)">Q2 · Is it a GOOD IDEA but optional?</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem">
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; text-align: center; background: #059669; color: #ffffff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15)"><strong style="color: #ffffff">YES</strong> → should / shouldn't</div>
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 1px dashed #aaa; text-align: center">NO → next question ↓</div>
          </div>
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 2px dashed #888; text-align: center; font-weight: 700; background: rgba(0,0,0,0.03)">Q3 · Are you ASKING for permission?</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem">
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; text-align: center; background: #2563eb; color: #ffffff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15)"><strong style="color: #ffffff">YES</strong> → can / may (formal)</div>
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 1px dashed #aaa; text-align: center">NO → next question ↓</div>
          </div>
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; border: 2px dashed #888; text-align: center; font-weight: 700; background: rgba(0,0,0,0.03)">Q4 · Is it NECESSARY in everyday speech?</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem">
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; text-align: center; background: #b45309; color: #ffffff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15)"><strong style="color: #ffffff">YES</strong> → need to</div>
            <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; text-align: center; background: #7c3aed; color: #ffffff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15)">Right / legal permission → <strong style="color: #ffffff">are allowed to</strong></div>
          </div>
        </div>

        <h3>Common mistakes to avoid</h3>

        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0">
          <thead>
            <tr style="background: #b91c1c; color: #ffffff">
              <th style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1); text-align: left; color: #ffffff">❌ Wrong</th>
              <th style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1); text-align: left; color: #ffffff">✅ Correct</th>
              <th style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1); text-align: left; color: #ffffff">Why</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">She shoulds rest.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">She <strong>should</strong> rest.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">Modals never add -s.</td></tr>
            <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You must to finish.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>must finish</strong>.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">No "to" after true modals.</td></tr>
            <tr><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You musted take it.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>had to</strong> take it.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">Modals don't take -ed.</td></tr>
            <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You can driving.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>can drive</strong>.</td><td style="padding: 0.55rem; border: 1px solid rgba(0,0,0,0.1)">Base verb only — no -ing.</td></tr>
          </tbody>
        </table>
      `,
      tipBox: {
        title: "💡 Grammar Rule",
        content: "True modals (should, must, can, may, will) never change form. No -s, no -ed, no -ing, no 'to' after them. 'Need to' is a semi-modal — it DOES take 'to' and changes form (he needs to…).",
      },
      exercises: [
        {
          id: "modals-intro-ex-1",
          title: "Practice: modal + base verb",
          instructions: "Choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "Which is grammatically correct?",
              options: [
                { value: "b", label: "You should takes this medicine with food." },
                { value: "a", label: "You should take this medicine with food." },
                { value: "c", label: "You should to take this medicine with food." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is grammatically correct?",
              options: [
                { value: "a", label: "You must not to take aspirin with this." },
                { value: "c", label: "You must not taking aspirin with this." },
                { value: "b", label: "You must not take aspirin with this." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "modals-decision-tree",
          title: "Run a scenario through the decision tree",
          instructions: "Pick the best modal for each situation.",
          items: [
            {
              type: "radio",
              label: "Label says: \"DO NOT OPERATE HEAVY MACHINERY AFTER USE.\" (Q1 = dangerous)",
              options: [
                { value: "should", label: "You should not operate heavy machinery." },
                { value: "must", label: "You must not operate heavy machinery." },
                { value: "could", label: "You could not operate heavy machinery." },
              ],
              expectedAnswer: "must",
            },
            {
              type: "radio",
              label: "Nurse to patient: drinking more water is a good idea. (Q2 = good idea, optional)",
              options: [
                { value: "must", label: "You must drink more water." },
                { value: "should", label: "You should drink more water." },
                { value: "may", label: "You may drink more water." },
              ],
              expectedAnswer: "should",
            },
            {
              type: "radio",
              label: "Patient at reception, asking politely: (Q3 = asking permission, formal)",
              options: [
                { value: "may", label: "May I have an interpreter for my appointment?" },
                { value: "must", label: "Must I have an interpreter for my appointment?" },
                { value: "should", label: "Should I have an interpreter for my appointment?" },
              ],
              expectedAnswer: "may",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 6. Should vs Must — The pharmacist's warning
    // =================================================================
    {
      id: "should-vs-must",
      stepNumber: 5,
      title: "The pharmacist's warning: should vs. must",
      icon: "💊",
      explanation: `
        ${sceneCard("pharmacyCounter", "At the pharmacy counter", "amber")}

        ${dialogue([
          { speaker: "Pharmacist", avatar: "💊", side: "left", tone: "terracotta", text: "\"Before I hand this over — a few things. <strong>You should</strong> take it with food. <strong>You must</strong> finish the full bottle. And <strong>you must not</strong> drink alcohol while taking it.\"" },
          { speaker: "Patient", avatar: "🧑", side: "right", tone: "sage", text: "\"What about coffee?\"" },
          { speaker: "Pharmacist", avatar: "💊", side: "left", tone: "terracotta", text: "\"Coffee is fine. <strong>You can</strong> have your normal cup.\"" },
        ])}

        <h3>Should = friendly advice</h3>
        <p><strong>Should</strong> means <em>this is a good idea, but you have a choice</em>.</p>
        <div class="gc-bg-green-alpha gc-callout-green" style="margin: 0.75rem 0; padding: 0.9rem 1rem; border-radius: 0.5rem">
          <ul style="margin: 0; padding-left: 1.25rem">
            <li>You <strong>should</strong> drink plenty of water.</li>
            <li>You <strong>should</strong> take this with food.</li>
            <li>You <strong>shouldn't</strong> skip any doses.</li>
          </ul>
        </div>

        <h3>Must / Must not = safety warning</h3>
        <p><strong>Must</strong> means <em>required</em>. <strong>Must not</strong> means <em>dangerous or forbidden</em>.</p>
        <div class="gc-bg-red" style="margin: 0.75rem 0; padding: 0.9rem 1rem; border-radius: 0.5rem">
          <ul style="margin: 0; padding-left: 1.25rem">
            <li>You <strong>must</strong> finish all the antibiotics.</li>
            <li>You <strong>must not</strong> drink alcohol with this medication.</li>
            <li>You <strong>must not</strong> drive after taking this.</li>
          </ul>
        </div>

        <h3>Side by side</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0">
          <thead>
            <tr class="gc-bg-amber-alpha">
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Form</th>
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Meaning</th>
              <th style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr class="gc-bg-green-alpha"><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>should</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Recommended (good idea, but optional)</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>should</strong> take it with food.</td></tr>
            <tr style="background: rgba(220,38,38,0.08)"><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>must</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Required (necessary, no choice)</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>must</strong> finish all doses.</td></tr>
            <tr style="background: rgba(220,38,38,0.15)"><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)"><strong>must not</strong></td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">Forbidden (dangerous)</td><td style="padding: 0.6rem; border: 1px solid rgba(0,0,0,0.1)">You <strong>must not</strong> drink alcohol.</td></tr>
          </tbody>
        </table>
      `,
      tipBox: {
        title: "⚠️ Safety First",
        content: "When a label or doctor says 'must not', treat it seriously — it's a warning about something dangerous, not just advice you can choose to follow.",
      },
      exercises: [
        {
          id: "advice-caution-ex-1",
          title: "Practice: should vs. must",
          instructions: "Type the missing modal or choose one.",
          items: [
            {
              type: "text",
              label: "You ___ drink plenty of water when you're sick. (advice)",
              expectedAnswer: "should",
            },
            {
              type: "text",
              label: "You ___ finish all the antibiotics, even if you feel better. (required/necessary)",
              expectedAnswers: ["must", "need to", "have to"],
            },
            {
              type: "radio",
              label: "Warning: 'You ___ drive after taking this medication.' (strong safety rule)",
              options: [
                { value: "must not", label: "must not" },
                { value: "don't have to", label: "don't have to" },
                { value: "should not", label: "should not" },
              ],
              expectedAnswer: "must not",
            },
            {
              type: "radio",
              label: "The label says it's recommended: 'You ___ take this with food.'",
              options: [
                { value: "must", label: "must (required)" },
                { value: "should", label: "should (advice)" },
                { value: "can", label: "can (permission)" },
              ],
              expectedAnswer: "should",
            },
          ],
        },
        {
          id: "advice-caution-warning-label",
          title: "Read this real warning label — pick every line that means DANGEROUS",
          instructions: "Check every box that signals a safety warning (not just advice).",
          items: [
            {
              type: "checkbox",
              label: "From a prescription label. Which lines are DANGEROUS warnings?",
              options: [
                { value: "a", label: "You must not drink alcohol while taking this." },
                { value: "b", label: "You should take this with food to avoid stomach upset." },
                { value: "c", label: "Do not drive or operate heavy machinery after use." },
                { value: "d", label: "You may take this medication with other vitamins." },
                { value: "e", label: "Call 911 immediately if you experience chest pain." },
                { value: "f", label: "You can refill this prescription up to 3 times." },
              ],
              expectedAnswers: ["a", "c", "e"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 7. Reception Desk — Permission & Necessity
    // =================================================================
    {
      id: "permission-rights",
      stepNumber: 6,
      title: "Reception desk: can, may, need to, allowed to",
      icon: "🙋",
      explanation: `
        ${sceneCard("receptionDesk", "Front desk — check-in window", "blue")}

        <h3>Your rights in a clinic</h3>
        <p>You're not just a patient — you have rights. Four patterns help you use them out loud:</p>

        <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
          <div class="gc-bg-green-alpha gc-callout-green" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-green" style="margin: 0 0 0.25rem 0">CAN I…? — informal permission</h4>
            <p style="margin: 0">"<strong>Can I</strong> ask a quick question?" &nbsp;·&nbsp; "<strong>Can I</strong> bring my husband?"</p>
          </div>
          <div class="gc-callout-purple" style="padding: 0.85rem 1rem; border-radius: 0.5rem; background: rgba(168,85,247,0.12)">
            <h4 class="gc-text-purple" style="margin: 0 0 0.25rem 0">MAY I…? — formal / respectful</h4>
            <p style="margin: 0">"<strong>May I</strong> have a copy of my records?" &nbsp;·&nbsp; "<strong>May I</strong> request a translator?"</p>
          </div>
          <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-blue" style="margin: 0 0 0.25rem 0">I'M ALLOWED TO… — your right</h4>
            <p style="margin: 0">"I<strong>'m allowed to</strong> see my test results." &nbsp;·&nbsp; "I<strong>'m allowed to</strong> request a second opinion."</p>
          </div>
          <div class="gc-bg-amber-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem; border-left: 4px solid #d97706">
            <h4 style="margin: 0 0 0.25rem 0; color: #b45309">NEED TO — everyday necessity</h4>
            <p style="margin: 0">"<strong>I need to</strong> speak with a nurse." &nbsp;·&nbsp; "Do <strong>I need to</strong> fast before the test?"</p>
          </div>
        </div>

        <h3>Rosa's second visit</h3>

        ${dialogue([
          { speaker: "Rosa", avatar: "🧕", side: "left", tone: "sage", text: "\"Good morning. <strong>May I</strong> pick up my test results?\"" },
          { speaker: "Receptionist", avatar: "💁", side: "right", tone: "blue", text: "\"Of course. <strong>You need to</strong> show a photo ID.\"" },
          { speaker: "Rosa", avatar: "🧕", side: "left", tone: "sage", text: "\"Here's my license. <strong>Can I</strong> also request a copy in Spanish?\"" },
          { speaker: "Receptionist", avatar: "💁", side: "right", tone: "blue", text: "\"Yes — <strong>you're allowed to</strong> ask for any document in your preferred language.\"" },
          { speaker: "Rosa", avatar: "🧕", side: "left", tone: "sage", text: "\"Thank you. Do <strong>I need to</strong> sign anything?\"" },
          { speaker: "Receptionist", avatar: "💁", side: "right", tone: "blue", text: "\"Just this release form. Then <strong>you can</strong> leave whenever you're ready.\"" },
        ])}
      `,
      exercises: [
        {
          id: "permission-necessity-ex-1",
          title: "Practice: permission & necessity",
          instructions: "Choose the best modal for each situation.",
          items: [
            {
              type: "radio",
              label: "Casual permission question to your doctor:",
              options: [
                { value: "may", label: "May I ask you a question?" },
                { value: "must", label: "Must I ask you something?" },
                { value: "can", label: "Can I ask you something?" },
              ],
              expectedAnswer: "can",
            },
            {
              type: "radio",
              label: "Asking the receptionist about your legal right to records:",
              options: [
                { value: "allowed", label: "I am allowed to access my medical records." },
                { value: "can", label: "I can see my records." },
                { value: "should", label: "I should see my records." },
              ],
              expectedAnswer: "allowed",
            },
            {
              type: "text",
              label: "You ___ fast for 12 hours before this blood test. (required/necessary)",
              expectedAnswers: ["need to", "have to", "must"],
            },
            {
              type: "text",
              label: "You ___ bring anything special for a routine checkup. (not required)",
              expectedAnswers: ["don't need to", "do not need to"],
            },
          ],
        },
        {
          id: "permission-fill-blanks",
          title: "Finish Rosa's reception-desk sentences",
          instructions: "Type the missing words.",
          items: [
            {
              type: "text",
              label: "Rosa (formal request): \"___ I have my results in Spanish?\"",
              expectedAnswers: ["May", "may"],
            },
            {
              type: "text",
              label: "Receptionist: \"Yes, you ___ ___ ___ ask for any document in your language.\" (legal right)",
              expectedAnswers: ["are allowed to", "'re allowed to"],
            },
            {
              type: "text",
              label: "Receptionist: \"You ___ ___ show a photo ID.\" (everyday necessity, two words)",
              expectedAnswers: ["need to", "have to"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 8. Role-play stack
    // =================================================================
    {
      id: "medical-roleplays",
      stepNumber: 7,
      title: "Role-play stack: 3 real scenes",
      icon: "🎭",
      explanation: `
        ${sceneCard("nurseInstructions", "Bedside, second floor", "red")}

        <h3>Three mini-scenes — whose turn to speak?</h3>

        <div style="display: grid; gap: 1.5rem; margin: 1.25rem 0">

          <div class="gc-bg-white" style="padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 6px rgba(0,0,0,0.04)">
            <h4 class="gc-text-terracotta" style="margin: 0 0 0.5rem 0">Scene A · Patient ↔ Doctor</h4>
            ${dialogue([
              { speaker: "Doctor", avatar: "🧑‍⚕️", side: "left", tone: "terracotta", text: "\"Your blood pressure is high. <strong>You must</strong> start this medication today.\"" },
              { speaker: "Patient", avatar: "👨", side: "right", tone: "sage", text: "\"<strong>I understand</strong>. <strong>Can I</strong> take it at night instead of morning?\"" },
              { speaker: "Doctor", avatar: "🧑‍⚕️", side: "left", tone: "terracotta", text: "\"Yes — <strong>you can</strong> take it whenever works, as long as it's the same time every day.\"" },
            ])}
          </div>

          <div class="gc-bg-white" style="padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 6px rgba(0,0,0,0.04)">
            <h4 class="gc-text-purple" style="margin: 0 0 0.5rem 0">Scene B · Patient ↔ Pharmacist</h4>
            ${dialogue([
              { speaker: "Pharmacist", avatar: "💊", side: "left", tone: "purple", text: "\"Before you leave — <strong>don't mix</strong> this with cold medicine. <strong>Call</strong> us if you feel dizzy.\"" },
              { speaker: "Patient", avatar: "👵", side: "right", tone: "sage", text: "\"<strong>May I</strong> take it with my blood pressure pill?\"" },
              { speaker: "Pharmacist", avatar: "💊", side: "left", tone: "purple", text: "\"<strong>You should</strong> wait one hour between them.\"" },
            ])}
          </div>

          <div class="gc-bg-white" style="padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 6px rgba(0,0,0,0.04)">
            <h4 class="gc-text-blue" style="margin: 0 0 0.5rem 0">Scene C · Nurse ↔ Patient (bedside)</h4>
            ${dialogue([
              { speaker: "Nurse", avatar: "👩‍⚕️", side: "left", tone: "blue", text: "\"<strong>Please</strong> press this button if you need anything. <strong>Don't</strong> get up by yourself tonight.\"" },
              { speaker: "Patient", avatar: "🧓", side: "right", tone: "sage", text: "\"<strong>Can I</strong> still have visitors?\"" },
              { speaker: "Nurse", avatar: "👩‍⚕️", side: "left", tone: "blue", text: "\"Yes, but <strong>you need to</strong> rest between visits.\"" },
            ])}
          </div>

        </div>

        <p><strong>Your turn:</strong> build a new line that fits each scene.</p>
      `,
      exercises: [
        {
          id: "roleplay-scramble",
          title: "Build new lines for each scene",
          instructions: "Drag the words into the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Scene A — the patient asks the doctor for permission:",
              words: ["Can", "I", "split", "the", "pill", "in", "half"],
              correctAnswer: "Can I split the pill in half",
              correctAnswers: ["Can I split the pill in half?"],
              hint: "Start with the permission question.",
            },
            {
              type: "word-scramble",
              label: "Scene B — the patient asks the pharmacist a formal question:",
              words: ["May", "I", "pick", "it", "up", "tomorrow"],
              correctAnswer: "May I pick it up tomorrow",
              correctAnswers: ["May I pick it up tomorrow?"],
              hint: "Formal = 'May I…?'",
            },
            {
              type: "word-scramble",
              label: "Nurse — a negative imperative at bedside:",
              words: ["Don't", "remove", "the", "bandage", "tonight"],
              correctAnswer: "Don't remove the bandage tonight",
              correctAnswers: ["Don't remove the bandage tonight."],
              hint: "Negative imperative — start with \"Don't\".",
            },
          ],
        },
        {
          id: "roleplay-match-register",
          title: "Match the sentence to its scene",
          instructions: "Who would most likely say each line?",
          items: [
            {
              type: "radio",
              label: "\"You must start this medication today.\" — who said it?",
              options: [
                { value: "doctor", label: "A doctor to a patient" },
                { value: "patient-doctor", label: "A patient to a doctor" },
                { value: "patient-pharmacist", label: "A patient to a pharmacist" },
              ],
              expectedAnswer: "doctor",
            },
            {
              type: "radio",
              label: "\"May I take it with my blood pressure pill?\" — who said it?",
              options: [
                { value: "pharmacist", label: "A pharmacist to a patient" },
                { value: "patient", label: "A patient to a pharmacist" },
                { value: "nurse", label: "A nurse to a patient" },
              ],
              expectedAnswer: "patient",
            },
            {
              type: "radio",
              label: "\"Press this button if you need anything.\" — who said it?",
              options: [
                { value: "nurse", label: "A nurse to a patient" },
                { value: "patient", label: "A patient to a nurse" },
                { value: "doctor", label: "A patient to a doctor" },
              ],
              expectedAnswer: "nurse",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 9. Workplace — Calling out sick
    // =================================================================
    {
      id: "workplace-callout",
      stepNumber: 8,
      title: "Back to work: calling out sick",
      icon: "💼",
      explanation: `
        ${sceneCard("workplaceEmailLaptop", "Kitchen table, 7:02 AM", "blue")}

        <h3>Same grammar, different power dynamic</h3>
        <p>Your boss can use imperatives with you ("Send the report by noon"). You usually <strong>shouldn't</strong> do the same back — it sounds like an order. Declaratives and polite questions are your safer tools.</p>

        <h3>Two ways to call in sick</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; border-radius: 0.625rem; background: #dc2626; color: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.15)">
            <h4 style="margin: 0 0 0.4rem 0; color: #ffffff">❌ Too direct</h4>
            <p style="margin: 0; color: #ffffff"><em>"Give me the day off. I'm sick."</em></p>
            <p style="margin: 0.4rem 0 0; color: #ffffff; font-size: 0.85rem; opacity: 0.92">Bare imperative to your manager = sounds like a demand.</p>
          </div>
          <div class="gc-bg-green-alpha gc-callout-green" style="padding: 0.9rem 1rem; border-radius: 0.625rem">
            <h4 class="gc-text-green" style="margin: 0 0 0.4rem 0">✅ Respectful</h4>
            <p style="margin: 0"><em>"Hi Maria — <strong>I'm not feeling well</strong> and <strong>I'd like to</strong> take a sick day. <strong>Could I</strong> join the meeting tomorrow instead?"</em></p>
            <p style="margin: 0.4rem 0 0; font-size: 0.85rem; opacity: 0.85">Declarative + polite question = professional.</p>
          </div>
        </div>

        <h3>Monday morning call</h3>

        ${dialogue([
          { speaker: "Manager", avatar: "👩‍💼", side: "left", tone: "blue", text: "\"Good morning, Luis. What's up?\"" },
          { speaker: "Luis", avatar: "👨", side: "right", tone: "sage", text: "\"Hi Maria. <strong>I'm really sorry</strong> — <strong>I have</strong> a bad fever. <strong>I think I need to</strong> stay home today.\"" },
          { speaker: "Manager", avatar: "👩‍💼", side: "left", tone: "blue", text: "\"Okay. <strong>Please</strong> rest. <strong>You don't need to</strong> join the standup.\"" },
          { speaker: "Luis", avatar: "👨", side: "right", tone: "sage", text: "\"Thank you. <strong>Could I</strong> submit the report tomorrow instead?\"" },
          { speaker: "Manager", avatar: "👩‍💼", side: "left", tone: "blue", text: "\"Sure — <strong>you can</strong>. Feel better.\"" },
        ])}

        <h3>Employee-to-boss toolkit</h3>
        <div class="gc-bg-blue-alpha" style="padding: 0.9rem 1rem; border-radius: 0.625rem; margin: 1rem 0">
          <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.85">
            <li>"<strong>I'd like to</strong> request time off next Friday."</li>
            <li>"<strong>Could I</strong> have a little more time to finish this?"</li>
            <li>"<strong>Would you</strong> mind reviewing my draft when you're free?"</li>
            <li>"<strong>I will</strong> send the updated file by 5 PM."</li>
            <li>"<strong>I'm not sure</strong> I understand — <strong>could you</strong> explain again?"</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Cultural note",
        content: "In American workplaces, 'please' and 'could you' do a lot of work. Using them with your boss is expected — not a sign of weakness.",
      },
      exercises: [
        {
          id: "workplace-ex-1",
          title: "Practice: workplace communication",
          instructions: "Choose the appropriate form for each workplace situation.",
          items: [
            {
              type: "radio",
              label: "What should an employee use when speaking to their boss?",
              options: [
                { value: "b", label: "Imperatives - 'Submit it by Friday'" },
                { value: "a", label: "Declaratives - 'I will submit it by Friday'" },
                { value: "c", label: "Either is fine" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What can a boss use when speaking to an employee?",
              options: [
                { value: "b", label: "Only imperatives" },
                { value: "c", label: "Only declaratives" },
                { value: "a", label: "Both imperatives and declaratives" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is better for an employee emailing their boss?",
              options: [
                { value: "b", label: "I'd like to ask about taking Thursday off." },
                { value: "a", label: "Approve my day off request." },
                { value: "c", label: "Give me Thursday off." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Why shouldn't employees use imperatives with their boss?",
              options: [
                { value: "b", label: "It's grammatically incorrect" },
                { value: "a", label: "It sounds too direct and disrespectful" },
                { value: "c", label: "Bosses don't understand imperatives" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "workplace-rude-filter",
          title: "Check every line that would sound RUDE to your manager",
          instructions: "You're writing an email to your boss. Check every line that would sound too direct or disrespectful.",
          items: [
            {
              type: "checkbox",
              label: "Pick all the lines that WOULD sound rude to your manager:",
              options: [
                { value: "a", label: "Give me Friday off." },
                { value: "b", label: "I'd like to request Friday off." },
                { value: "c", label: "Approve my PTO request now." },
                { value: "d", label: "Could I have Friday off next week?" },
                { value: "e", label: "Send me the updated file." },
                { value: "f", label: "Would you mind sharing the updated file when you have a moment?" },
              ],
              expectedAnswers: ["a", "c", "e"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 10. Summary — Discharge paperwork
    // =================================================================
    {
      id: "summary-discharge",
      title: "Discharge paperwork: your quick reference",
      icon: "🏁",
      explanation: `
        ${sceneCard("hospitalHallway", "Walking out — feeling better", "green")}

        <h3>Imperatives</h3>
        <ul>
          <li><strong>Structure:</strong> base verb (no subject) — <em>Take this. Don't drive. Please wait.</em></li>
          <li><strong>Where you see it:</strong> signs, labels, prescriptions; bosses, doctors, nurses giving instructions.</li>
        </ul>

        <h3>Declaratives</h3>
        <ul>
          <li><strong>Structure:</strong> subject + verb — <em>You should rest. I'll call tomorrow.</em></li>
          <li><strong>Where you use it:</strong> speaking to doctors, bosses, anyone you want to respect.</li>
        </ul>

        <h3>Modals cheat sheet</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem">
          <thead>
            <tr class="gc-bg-terracotta-alpha">
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Type</th>
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Modal</th>
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="gc-bg-green-alpha" style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Advice</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">should / shouldn't</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Recommended</td></tr>
            <tr><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1)">Caution</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">must / must not</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Required / Forbidden</td></tr>
            <tr><td class="gc-bg-blue-alpha" style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Consent</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">can / may</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Permission</td></tr>
            <tr><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(251, 191, 36, 0.1)">Necessity</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">need to</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Required (conversational)</td></tr>
            <tr><td class="gc-bg-purple-alpha" style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Rights</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">are allowed to</td><td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1)">Legal / official permission</td></tr>
          </tbody>
        </table>

        <h3>Politeness cheat sheet</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0">
          <tr><td style="padding: 0.55rem; border: 1px solid #ddd"><strong>Speaking to boss / doctor</strong></td><td style="padding: 0.55rem; border: 1px solid #ddd">Declaratives + polite questions only</td></tr>
          <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.55rem; border: 1px solid #ddd"><strong>Speaking to coworker</strong></td><td style="padding: 0.55rem; border: 1px solid #ddd">Polite imperatives ("Please send me the file.") are OK</td></tr>
          <tr><td style="padding: 0.55rem; border: 1px solid #ddd"><strong>Written instructions</strong></td><td style="padding: 0.55rem; border: 1px solid #ddd">Imperatives are standard</td></tr>
          <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.55rem; border: 1px solid #ddd"><strong>Labels / signs</strong></td><td style="padding: 0.55rem; border: 1px solid #ddd">Imperatives, often with "Please"</td></tr>
        </table>

        ${sceneCard("recoveryHome", "Back home, resting — you've got this.", "sage")}
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Imperatives = direct. Declaratives = polite. When in doubt with authority, use declaratives — and drop in 'could', 'would', or 'please' to soften any request.",
      },
      exercises: [
        {
          id: "summary-ex-1",
          title: "Final review",
          instructions: "Test your understanding of all concepts.",
          items: [
            {
              type: "radio",
              label: "Which is an imperative?",
              options: [
                { value: "b", label: "You should take this medicine twice a day." },
                { value: "c", label: "I will take this medicine twice a day." },
                { value: "a", label: "Take this medicine twice a day." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which modal expresses advice (recommended but not required)?",
              options: [
                { value: "should", label: "should" },
                { value: "must", label: "must" },
                { value: "can", label: "can" },
              ],
              expectedAnswer: "should",
            },
            {
              type: "radio",
              label: "Which modal expresses a safety warning (dangerous/forbidden)?",
              options: [
                { value: "should not", label: "should not" },
                { value: "must not", label: "must not" },
                { value: "don't need to", label: "don't need to" },
              ],
              expectedAnswer: "must not",
            },
            {
              type: "radio",
              label: "What should patients use when speaking to doctors?",
              options: [
                { value: "a", label: "Declaratives (to show respect)" },
                { value: "b", label: "Imperatives (to be direct)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Where would you see imperatives most often?",
              options: [
                { value: "a", label: "Prescription labels and clinic signs" },
                { value: "b", label: "Patient-to-doctor conversations" },
                { value: "c", label: "Emails to your boss" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "summary-word-select",
          title: "One last check — find every imperative verb",
          instructions: "Click each word that is working as an imperative (a command) in this discharge summary.",
          items: [
            {
              type: "word-select",
              label: "Tap the imperatives:",
              selectWhat: "imperative verbs",
              tokens: [
                { text: "Rest", isTarget: true }, { text: "for" }, { text: "three" }, { text: "days." },
                { text: "You" }, { text: "should" }, { text: "drink" }, { text: "plenty" }, { text: "of" }, { text: "water." },
                { text: "Do", isTarget: true }, { text: "not", isTarget: true }, { text: "skip" }, { text: "meals." },
                { text: "I" }, { text: "recommend" }, { text: "a" }, { text: "follow-up" }, { text: "visit." },
                { text: "Call", isTarget: true }, { text: "the" }, { text: "nurse" }, { text: "if" }, { text: "the" }, { text: "fever" }, { text: "returns." },
              ],
            },
          ],
        },
      ],
    },
  ],

  // ===================================================================
  // Mini Quiz (20 questions — 16 preserved skillTags + 4 new)
  // ===================================================================
  miniQuiz: [
    {
      id: "quiz-1",
      question: "Which is an imperative sentence?",
      options: [
        { value: "a", label: "You should rest." },
        { value: "b", label: "Rest for a week." },
        { value: "c", label: "I recommend resting." },
      ],
      correctAnswer: "b",
      explanation:
        "Imperatives start with the base verb and have no subject. 'Rest for a week' is an imperative command — the subject 'you' is understood.",
      skillTag: "sentence-type-identification-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Which sentence is a declarative?",
      options: [
        { value: "a", label: "Don't eat before the test." },
        { value: "b", label: "Please wait here." },
        { value: "c", label: "You need to fast before the test." },
      ],
      correctAnswer: "c",
      explanation:
        "Declaratives have a subject + verb. 'You need to fast before the test' has the subject 'you' and gives information.",
      skillTag: "sentence-type-identification-declarative",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "The nurse wants the patient to use the ear drops two times each day. Which imperative gives that instruction?",
      options: [
        { value: "b", label: "Use the drops twice a day." },
        { value: "a", label: "You use the drops twice a day." },
        { value: "c", label: "Using the drops twice a day." },
      ],
      correctAnswer: "b",
      explanation:
        "To form an imperative, remove the subject and start with the base verb: 'Use the drops twice a day.'",
      skillTag: "transformation-declarative-to-imperative",
      difficulty: "medium",
    },
    {
      id: "quiz-4",
      question: "Convert this safety warning to a declarative: 'Don't drive after taking this medication.'",
      options: [
        { value: "a", label: "You shouldn't drive after taking this medication." },
        { value: "b", label: "You must not drive after taking this medication." },
        { value: "c", label: "You will drive after taking this medication." },
      ],
      correctAnswer: "b",
      explanation:
        "For a safety warning, use a subject plus 'must not': 'You must not drive after taking this medication.'",
      skillTag: "transformation-imperative-to-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-5",
      question: "Which sentence would you see on a prescription label?",
      options: [
        { value: "a", label: "You should take one tablet daily." },
        { value: "b", label: "Take one tablet daily with food." },
        { value: "c", label: "I recommend taking one tablet daily." },
      ],
      correctAnswer: "b",
      explanation:
        "Prescription labels use imperatives for clarity and brevity: 'Take one tablet daily with food.'",
      skillTag: "context-prescription-label-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-6",
      question: "Which sentence expresses health advice (recommended but not required)?",
      options: [
        { value: "a", label: "You must take this medicine twice daily." },
        { value: "c", label: "You can take this medicine with food." },
        { value: "b", label: "You should take this medicine with food." },
      ],
      correctAnswer: "b",
      explanation:
        "'Should' expresses advice or recommendation. 'Must' is required. 'Can' is permission.",
      skillTag: "modals-should-vs-must-vs-can-advice",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Which is the strongest safety warning (dangerous/forbidden)?",
      options: [
        { value: "b", label: "You must not drink alcohol while taking this." },
        { value: "a", label: "You should not drink alcohol." },
        { value: "c", label: "You don't need to drink alcohol." },
      ],
      correctAnswer: "b",
      explanation:
        "'Must not' is used for strong safety warnings: something is dangerous or forbidden.",
      skillTag: "modals-must-not-safety-warning",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "What is the difference between 'You should rest' and 'You must rest'?",
      options: [
        { value: "a", label: "They mean the same thing." },
        { value: "b", label: "First = advice. Second = required." },
        { value: "c", label: "First = required. Second = advice." },
      ],
      correctAnswer: "b",
      explanation:
        "'Should' is advice (good idea but optional). 'Must' is required (necessary, no choice).",
      skillTag: "modals-should-vs-must-contrast",
      difficulty: "easy",
    },
    {
      id: "quiz-9",
      question: "Which is most appropriate for a patient speaking to a doctor?",
      options: [
        { value: "a", label: "Give me a referral." },
        { value: "c", label: "Refer me to a specialist." },
        { value: "b", label: "I need a referral." },
      ],
      correctAnswer: "b",
      explanation:
        "Patients should use declaratives with doctors to sound respectful: 'I need a referral.'",
      skillTag: "politeness-patient-to-doctor-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-10",
      question: "Which is the most formal way to ask for permission?",
      options: [
        { value: "b", label: "May I ask you a question?" },
        { value: "a", label: "Can I ask you a question?" },
        { value: "c", label: "I must ask you a question." },
      ],
      correctAnswer: "b",
      explanation:
        "'May I' is more formal and polite than 'Can I' when asking for permission in medical or workplace settings.",
      skillTag: "permission-can-vs-may-polite",
      difficulty: "medium",
    },
    {
      id: "quiz-11",
      question: "Which sentence clearly talks about an official/legal patient right?",
      options: [
        { value: "a", label: "I can see my records." },
        { value: "b", label: "I am allowed to access my medical records." },
        { value: "c", label: "I should see my records." },
      ],
      correctAnswer: "b",
      explanation:
        "'Are allowed to' clearly expresses a legal right or official permission.",
      skillTag: "rights-are-allowed-to-medical-records",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Complete the sentence with the natural clinic conversation form: 'You ___ fast for 12 hours before this blood test.' (everyday necessity)",
      options: [
        { value: "a", label: "should" },
        { value: "b", label: "need to" },
        { value: "c", label: "can" },
      ],
      correctAnswer: "b",
      explanation:
        "'Need to' shows necessity in conversation, similar to 'must' but more natural with patients.",
      skillTag: "necessity-need-to-vs-should",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question:
        "Complete the sentence: 'You ___ bring anything special for a routine checkup.' (not required)",
      options: [
        { value: "b", label: "must not" },
        { value: "c", label: "should" },
        { value: "a", label: "don't need to" },
      ],
      correctAnswer: "a",
      explanation:
        "'Don't need to' means something is not necessary, which matches 'not required'.",
      skillTag: "necessity-dont-need-to-not-required",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question: "Which is better for an employee emailing their boss?",
      options: [
        { value: "b", label: "I would like to ask for Friday afternoon off, if possible." },
        { value: "a", label: "Approve my vacation request." },
        { value: "c", label: "Give me the afternoon off." },
      ],
      correctAnswer: "b",
      explanation:
        "Employees should use polite declaratives with bosses: 'I would like to ask for...'",
      skillTag: "register-employee-to-boss-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-15",
      question: "Which is a polite imperative between coworkers?",
      options: [
        { value: "a", label: "Send me that file now." },
        { value: "b", label: "Please send me that file when you can." },
        { value: "c", label: "You send me that file." },
      ],
      correctAnswer: "b",
      explanation:
        "With coworkers, polite imperatives are fine. 'Please send me that file when you can' is direct but respectful.",
      skillTag: "register-coworker-polite-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-16",
      question: "Which sentence is most appropriate for a clinic sign?",
      options: [
        { value: "a", label: "You should turn off your phone." },
        { value: "c", label: "I recommend turning off your phone." },
        { value: "b", label: "Please turn off your phone." },
      ],
      correctAnswer: "b",
      explanation:
        "Clinic signs typically use polite imperatives: 'Please turn off your phone.'",
      skillTag: "context-clinic-sign-polite-imperative",
      difficulty: "easy",
    },
    // --- NEW diagnostic items ---
    {
      id: "quiz-17",
      question:
        "Rearranged correctly, which word order is the nurse's imperative instruction?",
      options: [
        { value: "a", label: "Your arm raise slowly." },
        { value: "b", label: "You raise your arm slowly." },
        { value: "c", label: "Raise your arm slowly." },
      ],
      correctAnswer: "c",
      explanation:
        "Imperatives start with the base verb: 'Raise your arm slowly.' No subject needed.",
      skillTag: "dialogue-builder-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-18",
      question:
        "Which line on a prescription label is a DANGEROUS warning, not just advice?",
      options: [
        { value: "a", label: "Take with food to avoid stomach upset." },
        { value: "b", label: "You may take this with other vitamins." },
        { value: "c", label: "Do not drive or operate heavy machinery after use." },
      ],
      correctAnswer: "c",
      explanation:
        "'Do not drive or operate heavy machinery' signals a safety warning — matches 'must not' in meaning.",
      skillTag: "warning-label-checkbox",
      difficulty: "medium",
    },
    {
      id: "quiz-19",
      question:
        "On the tone ladder, which rung is 'You could try taking this at night instead.'?",
      options: [
        { value: "a", label: "Gentlest suggestion" },
        { value: "b", label: "Strongest / urgent command" },
        { value: "c", label: "Required (no choice)" },
      ],
      correctAnswer: "a",
      explanation:
        "'Could' signals the softest rung of the ladder — a gentle suggestion leaving full choice to the listener.",
      skillTag: "tone-ladder-matching",
      difficulty: "medium",
    },
    {
      id: "quiz-20",
      question:
        "In a patient-to-pharmacist role-play, which line uses the correct register?",
      options: [
        { value: "a", label: "Give me the cheaper version." },
        { value: "b", label: "May I get the generic instead?" },
        { value: "c", label: "You must give me the generic." },
      ],
      correctAnswer: "b",
      explanation:
        "Patients should use polite declaratives/questions with pharmacists: 'May I get the generic instead?'",
      skillTag: "role-play-register-choice",
      difficulty: "medium",
    },
  ],

  /*
  TEACHER DIAGNOSTIC NOTES – Medical Instructions Mini Quiz (20 items)

  This mini quiz checks whether students can:
  - Recognize imperatives vs declaratives by structure (subject/no subject).
  - Transform between imperatives and declaratives with matching meaning.
  - Use modals (should/must/can/need to/don't need to) accurately for advice, requirements, safety, and permission.
  - Choose respectful language when speaking to doctors and bosses.
  - Rebuild real dialogues (pharmacy, clinic, bedside) using the right register.
  - Spot dangerous warnings on real medication labels.
  - Place a sentence on the five-rung tone ladder (strongest → gentlest).

  Skill tags:

  Sentence type:
  - sentence-type-identification-imperative
  - sentence-type-identification-declarative

  Transformations:
  - transformation-declarative-to-imperative
  - transformation-imperative-to-declarative

  Modals: advice, safety, necessity, permission:
  - modals-should-vs-must-vs-can-advice
  - modals-must-not-safety-warning
  - modals-should-vs-must-contrast
  - necessity-need-to-vs-should
  - necessity-dont-need-to-not-required
  - permission-can-vs-may-polite

  Rights and register:
  - rights-are-allowed-to-medical-records
  - politeness-patient-to-doctor-declarative
  - register-employee-to-boss-declarative
  - register-coworker-polite-imperative

  Context patterns:
  - context-prescription-label-imperative
  - context-clinic-sign-polite-imperative

  NEW (this revision):
  - dialogue-builder-imperative  → Can the student rebuild a scrambled imperative in correct order?
  - warning-label-checkbox        → Can the student distinguish a DANGEROUS warning from plain advice on a real label?
  - tone-ladder-matching          → Can the student place a sentence on the strongest → gentlest ladder?
  - role-play-register-choice     → Does the student pick the right register when role-playing with a pharmacist/doctor/boss?

  How to read the diagnostics:
  - If sentence-type tags are weak →
    Revisit the basic formulas:
    • Imperative: base verb (no subject) → 'Take this.', 'Don't drive.'
    • Declarative: subject + verb → 'You should take this.', 'You must not drive.'
    Use side-by-side tables from this guide and have students label each sentence IMP or DEC.

  - If transformation tags are weak →
    Practice converting in both directions:
    • You should rest. → Rest.
    • You must not drink alcohol. → Don't drink alcohol.
    • Don't drive after taking this. → You shouldn't drive after taking this.
    Emphasize keeping the same meaning (advice vs requirement vs danger).

  - If modal tags (should/must/can/need to/don't need to) are weak →
    Revisit the decision tree in the "Modals crash course" section and sort
    real sentences into ADVICE / CAUTION / CONSENT / NECESSITY.

  - If permission and rights tags are weak →
    Contrast informal vs formal permission and rights:
    • Can I…? (informal question)
    • May I…? (formal question, respectful)
    • I am allowed to… (right/legal permission)
    Practice short role-plays: patient with doctor, patient with receptionist, employee with HR.

  - If politeness/register tags are weak (incl. role-play-register-choice) →
    Re-teach the power relationships:
    • Doctor/Boss → declaratives and polite questions ('I need…', 'Could I…?').
    • Patient/Employee giving instructions → usually not appropriate.
    • Coworkers → polite imperatives with 'please' are okay.
    Have students rewrite too-direct imperatives as polite declaratives/questions.

  - If context tags are weak (labels/signs/emails, incl. warning-label-checkbox) →
    Sort sentences by context:
    • Prescription labels and clinic signs → mostly imperatives.
    • Patient-to-doctor and employee-to-boss → declaratives/questions.
    • Workplace emails → polite declaratives and indirect questions.
    Ask: Where would you see this sentence? Who is speaking to whom?

  - If dialogue-builder-imperative is weak →
    Students are likely inserting a subject ("You") into imperative commands.
    Practice scrambled-word rebuilding with a strict rule: base verb first, no subject.

  - If tone-ladder-matching is weak →
    Students may not yet feel the continuum "must → need to → should → could".
    Do a board activity: write one sentence, then have students rewrite it across the five rungs.

  Suggested use:
  - Assign after students complete the main sections on imperatives, declaratives, and modals in medical/workplace contexts.
  - At the class level:
    • Sentence-type & transformation tags red → slow down, more structural rewriting.
    • Modal & safety tags red → spend time on ADVICE vs MUST vs MUST NOT with real medication examples.
    • Politeness/register & rights tags red → focus on role-plays (doctor visits, pharmacy, workplace).
    • Dialogue-builder / tone-ladder / warning-label tags red → give more scene-based practice from this guide.
  */
};
