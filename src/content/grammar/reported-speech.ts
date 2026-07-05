import type { InteractiveGuideContent } from "@/types/activity";
import { reportedSpeechImages as img } from "@/data/reported-speech-images.generated";

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

type Turn = {
    speaker: string;
    avatar: string;
    text: string;
    side: "left" | "right";
    tone: "terracotta" | "sage" | "blue" | "amber" | "purple" | "green";
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

export const reportedSpeechContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Reported Speech: Your clinic day in English",
            icon: "💬",
            explanation: `
                ${sceneCard("sceneMychartPing", "7:30 PM — Mina reads a portal message", "blue")}

                <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem">
                  <p style="font-size: 1.1rem; margin: 0">You will repeat what <strong>Dr. Chen</strong>, <strong>Nurse Jordan</strong>, <strong>Reception Alex</strong>, and <strong>Pharmacist Sam</strong> said — to your partner, your boss, or your family — <em>without</em> copying every word.</p>
                  <p style="margin: 0.65rem 0 0; font-weight: 600">That skill is <strong>reported speech</strong> (also called indirect speech).</p>
                </div>

                <h3>Your journey (same characters, nine stops)</h3>
                <ol style="margin: 0.5rem 0 1.25rem 1rem; line-height: 1.75">
                  <li><strong>Portal ping</strong> — why reporting matters</li>
                  <li><strong>Exam room</strong> — direct vs reported</li>
                  <li><strong>Front desk</strong> — say vs tell</li>
                  <li><strong>After vitals</strong> — tense backshift</li>
                  <li><strong>Pharmacy counter</strong> — told/asked + to + verb</li>
                  <li><strong>MyChart, phone, discharge</strong> — real channels</li>
                  <li><strong>Hallway reminders</strong> — common mistakes</li>
                  <li><strong>Call home</strong> — capstone practice</li>
                  <li><strong>Discharge card</strong> — quick reference</li>
                </ol>

                ${dialogue([
                    {
                        speaker: "Mina (you)",
                        avatar: "🙂",
                        text: "The doctor said, <strong>\"You need to rest.\"</strong>",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Partner",
                        avatar: "💬",
                        text: "So what did she say — <em>exactly</em>?",
                        side: "right",
                        tone: "blue",
                    },
                ])}

                <div class="gc-callout-green gc-bg-green-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem; margin: 1rem 0">
                  <p style="margin: 0">Reported version (same meaning, no quotes): <strong>The doctor said I needed to rest.</strong></p>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-intro-1",
                    title: "Practice: Understanding Reported Speech",
                    instructions: "Identify what reported speech is used for.",
                    items: [
                        {
                            type: "radio",
                            label: "What is reported speech?",
                            options: [
                                { value: "b", label: "Speaking directly to someone" },
                                { value: "a", label: "Telling someone what another person said or asked" },
                                { value: "c", label: "Asking questions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses reported speech?",
                            options: [
                                { value: "b", label: "The doctor said, 'You need to rest.'" },
                                { value: "c", label: "Rest!" },
                                { value: "a", label: "The doctor said I need to rest." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why is reported speech important in healthcare English?",
                            options: [
                                { value: "b", label: "It is only for research papers" },
                                { value: "c", label: "It is rarely used in clinics" },
                                {
                                    value: "a",
                                    label: "You use it for portal messages, phone updates, and telling family what the team said",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "checkbox",
                            label: "Select ALL sentences that use reported speech.",
                            options: [
                                { value: "a", label: "Nurse Jordan said my blood pressure was a little high." },
                                { value: "b", label: "Dr. Chen said, \"We will repeat the test.\"" },
                                { value: "c", label: "They told me to fast after midnight." },
                                { value: "d", label: "Please fast after midnight." },
                            ],
                            expectedAnswers: ["a", "c"],
                        },
                    ],
                },
            ],
        },

        {
            id: "direct-vs-reported",
            stepNumber: 1,
            title: "Exam room: direct vs reported",
            icon: "🔀",
            explanation: `
                ${sceneCard("sceneExamRoom", "Morning visit — Dr. Chen", "terracotta")}

                <p>Inside the exam room you hear <strong>direct speech</strong> (exact words, often with quotes). When you walk out, you use <strong>reported speech</strong> to retell it.</p>

                ${dialogue([
                    {
                        speaker: "Dr. Chen",
                        avatar: "👩‍⚕️",
                        text: "<strong>\"You are doing better. We will watch your sugar this month.\"</strong>",
                        side: "left",
                        tone: "terracotta",
                    },
                    {
                        speaker: "Mina (thinking)",
                        avatar: "🙂",
                        text: "Later, to my sister: <strong>Dr. Chen said I was doing better and they would watch my sugar that month.</strong>",
                        side: "right",
                        tone: "sage",
                    },
                ])}

                <div class="gc-bg-sage-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-sage">Direct speech</h4>
                    <p><strong>Exact words</strong> (quotation marks)</p>
                    <ul>
                        <li>Dr. Chen said, <strong>\"You need to rest.\"</strong></li>
                        <li>Nurse Jordan said, <strong>\"Take this medicine twice a day.\"</strong></li>
                    </ul>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">Reported speech</h4>
                    <p><strong>Retelling</strong> — no quotes, tenses often shift back</p>
                    <ul>
                        <li>Dr. Chen said <strong>I needed to rest</strong>.</li>
                        <li>Nurse Jordan told me <strong>to take this medicine twice a day</strong>.</li>
                    </ul>
                </div>

                <h3>What usually changes</h3>
                <ol>
                    <li><strong>No quotation marks</strong></li>
                    <li><strong>Tenses shift back</strong> (present → past, will → would)</li>
                    <li><strong>Pronouns change</strong> (I → she, you → I)</li>
                    <li><strong>Time words change</strong> (today → that day, tomorrow → the next day)</li>
                </ol>
            `,
            tipBox: {
                title: "💡 Key point",
                content:
                    "Direct speech = exact quote. Reported speech = retelling what was said (tenses often shift back in time).",
            },
            exercises: [
                {
                    id: "direct-vs-reported-1",
                    title: "Practice: Direct vs reported speech",
                    instructions: "Identify each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Dr. Chen <span class='eg-verb'>said</span>, <span class='eg-helper'>\"You need to drink more water.\"</span>",
                            options: [
                                { value: "reported", label: "Reported speech — retelling without quotation marks" },
                                { value: "direct", label: "Direct speech — exact words with quotation marks" },
                            ],
                            expectedAnswer: "direct",
                        },
                        {
                            type: "radio",
                            label: "Dr. Chen <span class='eg-verb'>said</span> I <span class='eg-verb'>needed</span> to drink more water.",
                            options: [
                                { value: "reported", label: "Reported speech — retelling, tense changed" },
                                { value: "direct", label: "Direct speech — exact words" },
                            ],
                            expectedAnswer: "reported",
                        },
                        {
                            type: "radio",
                            label: "What changes when you move from direct to reported speech?",
                            options: [
                                { value: "b", label: "Nothing changes" },
                                { value: "c", label: "Only punctuation changes" },
                                {
                                    value: "a",
                                    label: "No quotation marks, tenses shift back, pronouns change, time words change",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "word-scramble",
                            label: "Rebuild this reported line (Dr. Chen yesterday):",
                            words: ["She", "said", "I", "was", "doing", "better."],
                            correctAnswer: "She said I was doing better.",
                            hint: "Start with She said…",
                        },
                    ],
                },
            ],
        },

        {
            id: "say-vs-tell",
            stepNumber: 2,
            title: "Front desk: say vs tell",
            icon: "🗣️",
            explanation: `
                ${sceneCard("sceneReception", "Check-in — Alex at the desk", "blue")}

                <p>Alex gives you two facts: one is a simple statement, one is clearly <em>for you</em>. English uses <strong>said</strong> and <strong>told</strong> a little differently.</p>

                <div class="gc-bg-sage-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-sage">SAY — no indirect object</h4>
                    <p style="font-weight: bold">Subject + said + (that) + statement</p>
                    <ul>
                        <li>Alex <strong>said</strong> (that) the copay was thirty dollars.</li>
                        <li>They <strong>said</strong> (that) the lab was running late.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic">Do not use <strong>said to me that</strong> in this pattern.</p>
                    <p>Prefer <strong>said that…</strong> or switch to <strong>told me that…</strong></p>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">TELL — person required</h4>
                    <p style="font-weight: bold">Subject + told + (me/you/him/her/us/them) + (that) + statement</p>
                    <ul>
                        <li>Alex <strong>told me</strong> (that) my insurance card was expired.</li>
                        <li>She <strong>told us</strong> (that) we could sit down.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic">You must name the listener: ❌ <em>She told that…</em></p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
                  <div class="gc-bg-red" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
                    <div style="font-weight: 800; margin-bottom: 0.35rem">❌ Too shaky</div>
                    <div style="font-size: 0.95rem">Alex <strong>said to me that</strong> Room 4 was ready.</div>
                  </div>
                  <div class="gc-bg-green-alpha" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
                    <div style="font-weight: 800; margin-bottom: 0.35rem">✅ Natural</div>
                    <div style="font-size: 0.95rem">Alex <strong>said that</strong> Room 4 was ready. / Alex <strong>told me that</strong> Room 4 was ready.</div>
                  </div>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-say-vs-tell-1",
                    title: "Practice: Say vs tell",
                    instructions: "Choose the best form.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence sounds natural at the desk?",
                            options: [
                                { value: "b", label: "Alex said to me that Dr. Chen was running ten minutes late." },
                                { value: "a", label: "Alex said that Dr. Chen was running ten minutes late." },
                                { value: "c", label: "Alex said me that Dr. Chen was running ten minutes late." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "Jordan told that my vitals looked stable." },
                                { value: "c", label: "Jordan told to me that my vitals looked stable." },
                                { value: "a", label: "Jordan told me that my vitals looked stable." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the main difference between say and tell?",
                            options: [
                                {
                                    value: "a",
                                    label: "Say does not need an indirect object; tell needs one (me, you, him, her, us, them).",
                                },
                                { value: "b", label: "Say is only for questions; tell is only for statements" },
                                { value: "c", label: "They mean the same thing in every situation" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses say?",
                            options: [
                                { value: "b", label: "They said me that the pharmacy closed at six." },
                                { value: "a", label: "They said that the pharmacy closed at six." },
                                { value: "c", label: "They said to us that the pharmacy closed at six." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "select",
                            label: "At the desk Alex _____ that my chart was updated.",
                            options: ["told", "said", "said to me", "told to me"],
                            expectedAnswer: "said",
                        },
                        {
                            type: "select",
                            label: "Nurse Jordan _____ me to remove my jacket for the blood pressure cuff.",
                            options: ["said", "told", "told to", "said to"],
                            expectedAnswer: "told",
                        },
                    ],
                },
            ],
        },

        {
            id: "tense-backshifting",
            stepNumber: 3,
            title: "After vitals: tense backshift",
            icon: "⏮️",
            explanation: `
                ${sceneCard("sceneNurseInstructions", "Bay 2 — Nurse Jordan", "sage")}

                <p>When you report a conversation from <strong>earlier</strong>, English often moves verbs \"one step back\" in time.</p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2)">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Direct (then)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Reported (later)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>am</strong> dizzy.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">She said she <strong>was</strong> dizzy.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>have</strong> a headache.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">He said he <strong>had</strong> a headache.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>will</strong> call you tomorrow.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">She said she <strong>would</strong> call me the next day.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>can</strong> meet you now.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">He said he <strong>could</strong> meet me then.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"You <strong>must</strong> fast.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">The nurse said I <strong>had to</strong> fast.</td>
                        </tr>
                    </tbody>
                </table>

                <div class="gc-bg-white" style="padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0">
                    <h4>Time words</h4>
                    <ul>
                        <li><strong>today</strong> → that day</li>
                        <li><strong>tomorrow</strong> → the next day</li>
                        <li><strong>yesterday</strong> → the day before</li>
                        <li><strong>now</strong> → then</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "⚠️ Exception",
                content:
                    "If something is still true now, you may keep the present: Dr. Chen said I live in East Boston. Contrast: She said I lived in East Boston (unclear or no longer).",
            },
            exercises: [
                {
                    id: "reported-speech-tense-backshifting-1",
                    title: "Practice: Tense backshift",
                    instructions: "Choose the best reported form.",
                    items: [
                        {
                            type: "radio",
                            label: "Jordan: \"I am on the infusion schedule today.\" (You report later.)",
                            options: [
                                { value: "b", label: "Jordan said she is on the infusion schedule today." },
                                { value: "c", label: "Jordan said she will be on the infusion schedule today." },
                                { value: "a", label: "Jordan said she was on the infusion schedule that day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "\"I will message you tomorrow.\" → She said _____.",
                            options: [
                                { value: "a", label: "she will message me tomorrow" },
                                { value: "b", label: "she would message me the next day" },
                                { value: "c", label: "I would message you tomorrow" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "\"I can meet you now.\" → They said _____.",
                            options: [
                                { value: "b", label: "they can meet me now" },
                                { value: "a", label: "they could meet me then" },
                                { value: "c", label: "they would meet me then" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What happens to tenses in reported speech (typical story)?",
                            options: [
                                {
                                    value: "a",
                                    label: "They often shift back one step (present → past, will → would).",
                                },
                                { value: "b", label: "They always stay the same as direct speech" },
                                { value: "c", label: "They always become past perfect" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: 'Direct: Dr. Chen said, "You are dehydrated." → Reported (start with: Dr. Chen said...):',
                            expectedAnswers: [
                                "Dr. Chen said I was dehydrated.",
                                "Dr. Chen said that I was dehydrated.",
                            ],
                        },
                        {
                            type: "text",
                            label: 'Complete: "I will call you tonight." → She said she _____ .',
                            placeholder: "would call me that night",
                            expectedAnswers: [
                                "would call me that night",
                                "would call me tonight",
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: "reported-commands",
            stepNumber: 4,
            title: "Pharmacy: commands and requests",
            icon: "📋",
            explanation: `
                ${sceneCard("scenePharmacy", "Pickup window — Pharmacist Sam", "amber")}

                <p>Instructions and polite requests use a different shape: <strong>told / asked + person + to + base verb</strong>.</p>

                <div style="max-width: 440px; margin: 1.25rem auto; border: 2px solid #1a202c; border-radius: 0.375rem; overflow: hidden; font-family: 'Courier New', 'Consolas', monospace; background: #fffdf6">
                  <div style="background: #2563eb; color: #ffffff; padding: 0.4rem 0.85rem; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.08em">AFTER-VISIT STICKER</div>
                  <div style="padding: 0.85rem 1rem 0.95rem; font-size: 0.92rem; line-height: 1.7">
                    <div>▸ <strong>Take</strong> one tablet with food.</div>
                    <div>▸ <strong>Finish</strong> the course even if you feel better.</div>
                    <div>▸ <strong>Do not</strong> drink grapefruit juice.</div>
                  </div>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">Commands</h4>
                    <p class="gc-text-terracotta" style="font-size: 1.15rem; font-weight: bold">told + me + to + base verb</p>
                    <ul>
                        <li>Direct: \"Take this with food.\" → Sam <strong>told me to take</strong> it with food.</li>
                        <li>Direct: \"Don't drive tonight.\" → Sam <strong>told me not to drive</strong> tonight.</li>
                    </ul>
                </div>

                <div class="gc-bg-blue-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-blue">Polite requests</h4>
                    <p class="gc-text-blue" style="font-size: 1.15rem; font-weight: bold">asked + me + to + base verb</p>
                    <ul>
                        <li>Direct: \"Please read this warning.\" → Sam <strong>asked me to read</strong> the warning.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-commands-requests-1",
                    title: "Practice: Commands and requests",
                    instructions: "Choose the best reported form.",
                    items: [
                        {
                            type: "radio",
                            label: "Alex: \"Please bring your insurance card.\"",
                            options: [
                                { value: "b", label: "Alex asked me bring my insurance card." },
                                { value: "c", label: "Alex said me to bring my insurance card." },
                                { value: "a", label: "Alex asked me to bring my insurance card." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Billing office: \"Call us back after 3 PM.\"",
                            options: [
                                { value: "b", label: "They asked me call them back after 3 PM." },
                                { value: "a", label: "They asked me to call them back after 3 PM." },
                                { value: "c", label: "They said me to call them back after 3 PM." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Security: \"Don't park in the ambulance lane.\"",
                            options: [
                                { value: "b", label: "Security told us don't park in the ambulance lane." },
                                { value: "c", label: "Security said us not to park in the ambulance lane." },
                                { value: "a", label: "Security told us not to park in the ambulance lane." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the usual formula for reporting a command?",
                            options: [
                                { value: "b", label: "told/asked + to + base verb (no person)" },
                                { value: "c", label: "said + person + to + base verb" },
                                { value: "a", label: "told/asked + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "word-scramble",
                            label: "Rebuild Sam's reported instruction:",
                            words: ["Sam", "told", "me", "to", "take", "it", "with", "food."],
                            correctAnswer: "Sam told me to take it with food.",
                            hint: "Name + told + me + to + verb…",
                        },
                        {
                            type: "checkbox",
                            label: "Select ALL incorrect reported commands.",
                            options: [
                                { value: "a", label: "The nurse told me that drink more water." },
                                { value: "b", label: "The nurse told me to drink more water." },
                                { value: "c", label: "The nurse asked me to drink more water." },
                                { value: "d", label: "The nurse told me drink more water." },
                            ],
                            expectedAnswers: ["a", "d"],
                        },
                    ],
                },
            ],
        },

        {
            id: "medical-contexts",
            stepNumber: 5,
            title: "MyChart, phone calls, discharge",
            icon: "🏥",
            explanation: `
                ${sceneCard("sceneLabDraw", "Afternoon — lab message on your phone", "blue")}

                <h3>1) Portal message (MyChart style)</h3>
                <div style="max-width: 480px; margin: 1rem auto; border: 1px solid rgba(0,0,0,0.15); border-radius: 0.5rem; overflow: hidden; font-family: 'Courier New', monospace; font-size: 0.88rem">
                  <div style="background: rgba(37,99,235,0.12); padding: 0.45rem 0.75rem; font-weight: 700" class="gc-text-blue">PORTAL MESSAGE — City Community Clinic</div>
                  <div style="padding: 0.75rem 1rem; line-height: 1.6">
                    <div><strong>Subject:</strong> Lab updated</div>
                    <div style="margin-top: 0.5rem; font-style: italic">\"Your A1c is slightly higher. Please schedule a nutrition visit next week.\"</div>
                  </div>
                </div>
                <p><strong>You tell your partner:</strong> They said my A1c <strong>was</strong> slightly higher and told me <strong>to schedule</strong> a nutrition visit the following week.</p>

                ${sceneCard("sceneFamilyPhone", "Evening — you repeat the plan", "sage")}

                <h3>2) Phone call from the clinic</h3>
                <div class="gc-bg-terracotta-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem; margin: 1rem 0">
                  <p style="margin: 0; font-style: italic">\"Your MRI is on Friday at 2. Please arrive fifteen minutes early.\"</p>
                  <p style="margin: 0.6rem 0 0"><strong>Reported:</strong> She said my MRI <strong>was</strong> on Friday at 2 and told me <strong>to arrive</strong> fifteen minutes early.</p>
                </div>

                <h3>3) Discharge instructions</h3>
                <div class="gc-bg-sage-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
                  <p style="margin: 0; font-style: italic">\"You need to rest for three days. Don't lift anything heavy. Come back if the pain returns.\"</p>
                  <p style="margin: 0.6rem 0 0"><strong>Reported:</strong> Dr. Chen said I <strong>needed to rest</strong> for three days, <strong>told me not to lift</strong> anything heavy, and <strong>told me to come back</strong> if the pain returned.</p>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-medical-contexts-1",
                    title: "Practice: Channel mix",
                    instructions: "Choose the best reported version.",
                    items: [
                        {
                            type: "radio",
                            label: "Portal: \"Your culture is growing normal bacteria. Please pick up antibiotics tomorrow.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "They said my culture is growing normal bacteria and told me pick up antibiotics tomorrow.",
                                },
                                {
                                    value: "a",
                                    label: "They said my culture was growing normal bacteria and told me to pick up antibiotics the next day.",
                                },
                                {
                                    value: "c",
                                    label: "They said to me that my culture was growing and told me to pick up antibiotics.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Phone: \"Your follow-up is on Tuesday at 9. Bring your medication list.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "She said my follow-up is on Tuesday at 9 and told me bring my medication list.",
                                },
                                {
                                    value: "c",
                                    label: "She told that my follow-up was on Tuesday and told me to bring my medication list.",
                                },
                                {
                                    value: "a",
                                    label: "She said my follow-up was on Tuesday at 9 and told me to bring my medication list.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Doctor: \"You must fast today. Come back tomorrow morning.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "The doctor said I had to fast that day and told me to come back the next morning.",
                                },
                                {
                                    value: "b",
                                    label: "The doctor said I must fast today and told me come back tomorrow morning.",
                                },
                                {
                                    value: "c",
                                    label: "The doctor said to me that I had to fast and told me to come back.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Pharmacist: \"Take this at night. You can't drive after it.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "The pharmacist told me take the medication at night and said I can't drive after it.",
                                },
                                {
                                    value: "a",
                                    label: "The pharmacist told me to take the medication at night and said I couldn't drive after it.",
                                },
                                {
                                    value: "c",
                                    label: "The pharmacist said to me to take the medication and said I can't drive.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Short answer: Portal wrote, \"We will post your results tonight.\" → Start with: They said …",
                            expectedAnswers: [
                                "They said they would post my results that night.",
                                "They said they would post my results tonight.",
                                "they said they would post my results that night",
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Hallway: mistakes to avoid",
            icon: "⚠️",
            explanation: `
                ${sceneCard("sceneHospitalHall", "Between appointments", "amber")}

                <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> She said <strong>to me</strong> that…</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> She <strong>said that</strong>… / She <strong>told me that</strong>…</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> He <strong>told that</strong>…</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> He <strong>told me that</strong>…</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> She said she <strong>is</strong> dizzy (yesterday's visit).</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> She said she <strong>was</strong> dizzy.</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> They <strong>said me to</strong> wait.</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> They <strong>told me to</strong> wait. / They <strong>asked me to</strong> wait.</div>
                  </div>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-common-mistakes-1",
                    title: "Practice: Spot the issue",
                    instructions: "Use the labels in the lesson.",
                    items: [
                        {
                            type: "radio",
                            label: "Mistake #1 in the grid: what is wrong with \"said to me that\" in this pattern?",
                            options: [
                                { value: "b", label: "Using told incorrectly" },
                                { value: "c", label: "Using too few words" },
                                {
                                    value: "a",
                                    label: "Using to after said — prefer said that or told me that",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #2: \"Jordan told that the EKG looked fine.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "Tell needs a listener — Jordan told me that…",
                                },
                                { value: "b", label: "Tell should become say" },
                                { value: "c", label: "The sentence is already perfect" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #3: reporting yesterday's visit with present tense",
                            options: [
                                {
                                    value: "a",
                                    label: "Backshift the tense when the reporting frame is past",
                                },
                                { value: "b", label: "Always use future tense" },
                                { value: "c", label: "Remove all pronouns" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #4: \"She told me that take the antibiotic.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "Commands use told + person + to + verb (not that take)",
                                },
                                { value: "b", label: "Switch said to told" },
                                { value: "c", label: "Add more adjectives" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "checkbox",
                            label: "Select ALL sentences that need a fix.",
                            options: [
                                { value: "a", label: "Alex said to me that Room 2 was open." },
                                { value: "b", label: "Alex said that Room 2 was open." },
                                { value: "c", label: "Sam told that I should wait ten minutes." },
                                { value: "d", label: "Sam told me to wait ten minutes." },
                            ],
                            expectedAnswers: ["a", "c"],
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Call home: capstone practice",
            icon: "✏️",
            explanation: `
                ${sceneCard("sceneFamilyPhone", "You explain the whole day in one phone call", "purple")}

                <p>Use the same tools: <strong>said / told / asked</strong>, backshift, <strong>to + verb</strong>, and <strong>not to + verb</strong>.</p>

                <div class="gc-callout-blue gc-bg-blue-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
                  <p style="margin: 0">Tip: start simple — who spoke, what kind of message (statement vs instruction), then fix pronouns and time words.</p>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-capstone-1",
                    title: "Capstone: mixed reporting",
                    instructions: "Follow each prompt.",
                    items: [
                        {
                            type: "word-select",
                            label: "Tap every reporting verb (said / told / asked) in Mina's summary:",
                            selectWhat: "reporting verbs",
                            tokens: [
                                { text: "I" },
                                { text: "told", isTarget: true },
                                { text: "my" },
                                { text: "mom" },
                                { text: "that" },
                                { text: "Dr." },
                                { text: "Chen" },
                                { text: "said", isTarget: true },
                                { text: "I" },
                                { text: "needed" },
                                { text: "more" },
                                { text: "sleep," },
                                { text: "and" },
                                { text: "Jordan" },
                                { text: "asked", isTarget: true },
                                { text: "me" },
                                { text: "to" },
                                { text: "book" },
                                { text: "a" },
                                { text: "follow-up." },
                            ],
                        },
                        {
                            type: "radio",
                            label: 'Direct: Dr. Chen said, "We are short-staffed today."',
                            options: [
                                { value: "b", label: "Dr. Chen said we were short-staffed that day." },
                                { value: "a", label: "Dr. Chen said we are short-staffed today." },
                                { value: "c", label: "Dr. Chen told that we were short-staffed that day." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Direct: Alex said, \"Please bring your member ID.\"",
                            options: [
                                { value: "b", label: "Alex said me to bring my member ID." },
                                { value: "a", label: "Alex asked me to bring my member ID." },
                                { value: "c", label: "Alex told bring my member ID." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "\"I will send your referral tomorrow.\" → She said _____.",
                            options: [
                                { value: "a", label: "she will send my referral tomorrow" },
                                { value: "c", label: "she told me that I would send her referral tomorrow" },
                                { value: "b", label: "she would send my referral the next day" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Fix: \"Sam said to me that the generic was ready.\"",
                            options: [
                                { value: "b", label: "Sam said to me that the generic was ready." },
                                { value: "c", label: "Sam told that the generic was ready." },
                                { value: "a", label: "Sam said that the generic was ready." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "IT (hospital Wi-Fi): \"Don't share your password.\"",
                            options: [
                                { value: "b", label: "IT said us not share our password." },
                                { value: "a", label: "IT told us not to share our password." },
                                { value: "c", label: "IT told us that don't share our password." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Jordan: \"Your badge is ready at the desk.\"",
                            options: [
                                { value: "a", label: "Jordan said my badge is ready at the desk." },
                                { value: "c", label: "Jordan told my badge was ready at the desk." },
                                { value: "b", label: "Jordan said my badge was ready at the desk." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentences are acceptable?",
                            options: [
                                { value: "a", label: "Only: He said that he was late." },
                                { value: "d", label: "He said that he was late AND He told me that he was late." },
                                { value: "b", label: "Only: He told me that he was late." },
                                { value: "c", label: "He said me that he was late." },
                            ],
                            expectedAnswer: "d",
                        },
                        {
                            type: "radio",
                            label: "Registration: \"Please sign this consent.\"",
                            options: [
                                { value: "b", label: "The registrar said me to sign this consent." },
                                { value: "a", label: "The registrar asked me to sign this consent." },
                                { value: "c", label: "The registrar asked me that I sign this consent." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "word-scramble",
                            label: "Rebuild Mina's line to her partner:",
                            words: ["She", "told", "me", "not", "to", "skip", "doses."],
                            correctAnswer: "She told me not to skip doses.",
                            hint: "told + me + not to …",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Discharge card: quick reference",
            icon: "📋",
            explanation: `
                ${sceneCard("sceneDischargePapers", "Before you leave — snapshot", "terracotta")}

                <h3>Say vs tell</h3>
                <ul>
                    <li><strong>Say:</strong> said (that) + statement</li>
                    <li><strong>Tell:</strong> told + person + (that) + statement</li>
                </ul>

                <h3>Statements</h3>
                <p>Subject + said/told + (that) + backshifted clause</p>
                <ul>
                    <li>\"I am tired.\" → She said she <strong>was</strong> tired.</li>
                    <li>\"I will call you.\" → He said he <strong>would</strong> call me.</li>
                </ul>

                <h3>Commands / requests</h3>
                <p><strong>told/asked + person + to + verb</strong> · negative: <strong>not to + verb</strong></p>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2)">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Direct</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Often becomes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">am/is/are</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">was/were</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">will</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">would</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">can</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">could</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">must</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">had to</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Say = no listener required. Tell = listener required. Commands use told/asked + person + to + verb.",
            },
            exercises: [
                {
                    id: "reported-speech-quick-reference-1",
                    title: "Practice: Quick check",
                    instructions: "Choose the best answer.",
                    items: [
                        {
                            type: "radio",
                            label: "Best structure for say?",
                            options: [
                                { value: "b", label: "said + me + that + statement" },
                                { value: "c", label: "said to me + that + statement" },
                                { value: "a", label: "said that + statement" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Best structure for tell?",
                            options: [
                                {
                                    value: "a",
                                    label: "told + me/you/him/her + (that) + statement",
                                },
                                { value: "b", label: "told that + statement" },
                                { value: "c", label: "told to me + that + statement" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Formula for reporting a request?",
                            options: [
                                { value: "b", label: "told/asked + person + that + base verb" },
                                { value: "a", label: "told/asked + person + to + base verb" },
                                { value: "c", label: "said + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "\"I am on the infusion schedule today.\" → Jordan said _____.",
                            options: [
                                { value: "b", label: "she is on the infusion schedule today" },
                                { value: "c", label: "Jordan told that she was on the infusion schedule" },
                                { value: "a", label: "she was on the infusion schedule that day" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Alex: \"Please bring your insurance card.\"",
                            options: [
                                { value: "b", label: "Alex asked me bring my insurance card." },
                                { value: "c", label: "Alex said me to bring my insurance card." },
                                { value: "a", label: "Alex asked me to bring my insurance card." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses tell?",
            options: [
                { value: "a", label: "Nurse Jordan told that the IV bag was almost empty." },
                { value: "b", label: "Nurse Jordan told me that the IV bag was almost empty." },
                { value: "c", label: "Nurse Jordan told to me that the IV bag was almost empty." },
            ],
            correctAnswer: "b",
            explanation: "Tell needs a person/object (me, you, us).",
            skillTag: "say-vs-tell-tell-with-object",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which sentence correctly uses say?",
            options: [
                { value: "a", label: "Alex said me that the lab was closed for cleaning." },
                { value: "c", label: "Alex said to me that the lab was closed for cleaning." },
                { value: "b", label: "Alex said that the lab was closed for cleaning." },
            ],
            correctAnswer: "b",
            explanation:
                "Say does not take an indirect object in this pattern. Use said that… or switch to told me that….",
            skillTag: "say-vs-tell-say-with-that",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: 'Convert: "I am on the infusion schedule today." → Jordan said _____.',
            options: [
                { value: "b", label: "she was on the infusion schedule that day" },
                { value: "a", label: "she is on the infusion schedule today" },
                { value: "c", label: "I was on the infusion schedule that day" },
            ],
            correctAnswer: "b",
            explanation: "Present am/is often becomes was/were when we report from the past.",
            skillTag: "backshift-present-be-to-past",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: 'Convert: "I will email you tomorrow." → She said _____.',
            options: [
                { value: "a", label: "she will email me tomorrow" },
                { value: "b", label: "she would email me the next day" },
                { value: "c", label: "I would email you tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "Will usually becomes would, and tomorrow becomes the next day in reported speech.",
            skillTag: "backshift-will-to-would-time-tomorrow-next-day",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: 'Convert: "Please sign this form." → The registrar asked me _____.',
            options: [
                { value: "b", label: "that sign this form" },
                { value: "c", label: "sign this form" },
                { value: "a", label: "to sign this form" },
            ],
            correctAnswer: "a",
            explanation: "Commands and requests use asked/told + person + to + base verb.",
            skillTag: "reported-command-asked-person-to-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: 'Convert: "Don\'t skip doses." → Pharmacist Sam told me _____.',
            options: [
                { value: "b", label: "not to skip doses" },
                { value: "a", label: "to not skip doses" },
                { value: "c", label: "don't skip doses" },
            ],
            correctAnswer: "b",
            explanation: "Negative commands use told/asked + person + not to + base verb.",
            skillTag: "reported-command-negative-not-to-verb",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: 'Convert: "I can help you with the forms." → She said _____.',
            options: [
                { value: "a", label: "she can help me with the forms" },
                { value: "b", label: "she could help me with the forms" },
                { value: "c", label: "she will help me with the forms" },
            ],
            correctAnswer: "b",
            explanation: "Can usually becomes could in reported speech when we backshift.",
            skillTag: "backshift-can-to-could",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: 'Convert: "You must bring your insurance card." → Alex said _____.',
            options: [
                { value: "a", label: "I must bring my insurance card" },
                { value: "c", label: "I have to bring my insurance card" },
                { value: "b", label: "I had to bring my insurance card" },
            ],
            correctAnswer: "b",
            explanation: "Must often changes to had to in reported speech.",
            skillTag: "backshift-must-to-had-to",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: 'Pronoun shift: Dr. Chen said, "You are dehydrated." → Dr. Chen said _____.',
            options: [
                { value: "b", label: "I was dehydrated" },
                { value: "a", label: "you were dehydrated" },
                { value: "c", label: "she was dehydrated" },
            ],
            correctAnswer: "b",
            explanation: "When you report what a clinician said to you, you often shifts to I with a backshifted verb.",
            skillTag: "pronoun-change-you-to-I",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: 'Time word: "I can meet you today." → He said he could meet me _____.',
            options: [
                { value: "a", label: "today" },
                { value: "b", label: "that day" },
                { value: "c", label: "the next day" },
            ],
            correctAnswer: "b",
            explanation: "Today usually changes to that day in reported speech.",
            skillTag: "time-word-today-to-that-day",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Which sentence uses say incorrectly in this pattern?",
            options: [
                { value: "a", label: "Jordan said that the dressing was clean." },
                { value: "c", label: "Jordan told me that the dressing was clean." },
                { value: "b", label: "Jordan said to me that the dressing was clean." },
            ],
            correctAnswer: "b",
            explanation: "Avoid said to me that in this structure. Use said that or told me that.",
            skillTag: "avoid-said-to-me-that",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: 'Convert: "We are at capacity now." → They said _____.',
            options: [
                { value: "b", label: "they were at capacity now" },
                { value: "c", label: "we are at capacity then" },
                { value: "a", label: "we were at capacity then" },
            ],
            correctAnswer: "a",
            explanation: "We can stay we when you are part of the same group; now becomes then; are becomes were.",
            skillTag: "backshift-present-to-past-with-now-then",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "If the information is still true now, which is best?",
            options: [
                { value: "a", label: "Dr. Chen said follow-up visits started at 8 AM. (Still true.)" },
                { value: "b", label: "Dr. Chen said follow-up visits start at 8 AM. (Still true.)" },
                { value: "c", label: "Dr. Chen said follow-up visits will start at 8 AM. (Still true.)" },
            ],
            correctAnswer: "b",
            explanation: "If something is still true now, we can keep the present simple in reported speech.",
            skillTag: "no-backshift-still-true-exception",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                'Portal message: "Your paperwork is incomplete. Please bring it tomorrow." Which is best?',
            options: [
                {
                    value: "b",
                    label: "They said my paperwork is incomplete and told me bring it tomorrow.",
                },
                {
                    value: "c",
                    label: "They told that my paperwork was incomplete and said me to bring it the next day.",
                },
                {
                    value: "a",
                    label: "They said my paperwork was incomplete and told me to bring it the next day.",
                },
            ],
            correctAnswer: "a",
            explanation: "Is becomes was, tomorrow becomes the next day, and told needs a person plus to + verb.",
            skillTag: "reported-speech-message-backshift-and-command",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: 'Convert: "I don\'t mind waiting in the lobby." → He said _____.',
            options: [
                { value: "b", label: "he didn't mind waiting in the lobby" },
                { value: "a", label: "he doesn't mind waiting in the lobby" },
                { value: "c", label: "he wouldn't mind to wait in the lobby" },
            ],
            correctAnswer: "b",
            explanation: "Present simple don't mind becomes didn't mind, and mind is followed by a gerund: waiting.",
            skillTag: "backshift-present-simple-negative-to-past",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question:
                "Portal: \"Your culture is normal. Pick up your antibiotic tomorrow.\" Which report is best?",
            options: [
                {
                    value: "b",
                    label: "They said my culture is normal and told me pick up my antibiotic tomorrow.",
                },
                {
                    value: "c",
                    label: "They told that my culture was normal and said me to pick up my antibiotic.",
                },
                {
                    value: "a",
                    label: "They said my culture was normal and told me to pick up my antibiotic the next day.",
                },
            ],
            correctAnswer: "a",
            explanation: "Backshift the statement, change tomorrow to the next day, and use told + me + to + verb.",
            skillTag: "healthcare-portal-culture-antibiotic-backshift-command",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "Which line sounds most natural after a clinic visit?",
            options: [
                { value: "b", label: "Alex said to me that my copay was thirty dollars." },
                { value: "c", label: "Alex told that my copay was thirty dollars." },
                { value: "a", label: "Alex said that my copay was thirty dollars." },
            ],
            correctAnswer: "a",
            explanation: "Said that is natural; said to me that is clunky here; told needs a listener.",
            skillTag: "healthcare-front-desk-said-that-vs-said-to-me",
            difficulty: "easy",
        },
        {
            id: "quiz-18",
            question: "Yesterday Dr. Chen said, \"Come back next week if the rash returns.\" Best report?",
            options: [
                {
                    value: "b",
                    label: "Dr. Chen told me that come back next week if the rash returns.",
                },
                {
                    value: "c",
                    label: "Dr. Chen said me to come back the following week if the rash returned.",
                },
                {
                    value: "a",
                    label: "Dr. Chen told me to come back the following week if the rash returned.",
                },
            ],
            correctAnswer: "a",
            explanation: "Use told + me + to + verb for the command, backshift returns → returned, next week → the following week.",
            skillTag: "healthcare-discharge-conditional-follow-up-told-to",
            difficulty: "hard",
        },
        {
            id: "quiz-19",
            question: "Pharmacist Sam: \"Don't drink grapefruit juice with this pill.\" → Sam told me _____.",
            options: [
                { value: "a", label: "to not drink grapefruit juice with this pill" },
                { value: "b", label: "not to drink grapefruit juice with this pill" },
                { value: "c", label: "don't drink grapefruit juice with this pill" },
            ],
            correctAnswer: "b",
            explanation: "Negative commands use told + person + not to + base verb.",
            skillTag: "healthcare-pharmacist-grapefruit-not-to-drink",
            difficulty: "medium",
        },
        {
            id: "quiz-20",
            question: 'Jordan: "I will page Dr. Chen if your fever returns tonight." → Jordan said _____.',
            options: [
                {
                    value: "b",
                    label: "she will page Dr. Chen if my fever returns tonight",
                },
                {
                    value: "c",
                    label: "I would page Dr. Chen if your fever returned tonight",
                },
                {
                    value: "a",
                    label: "she would page Dr. Chen if my fever returned that night",
                },
            ],
            correctAnswer: "a",
            explanation: "Will → would, your fever (about you) → my fever when you report for yourself, tonight → that night.",
            skillTag: "healthcare-nurse-conditional-page-would-backshift",
            difficulty: "hard",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – Reported Speech Mini Quiz

    This mini quiz checks whether students can:
    - Choose the correct structure with say and tell in reported speech.
    - Backshift tenses correctly when reporting from the past.
    - Report commands and requests with told/asked + person + to + verb and NOT to + verb.
    - Change pronouns and time words correctly.
    - Avoid common error patterns like said to me that and will or can staying in the present.
    - Apply these rules to clinic portals, reception desks, pharmacy counseling, and discharge teaching.

    Skill tags (legacy — keep verbatim for dashboards):

    Say vs tell
    - say-vs-tell-tell-with-object
    - say-vs-tell-say-with-that
    - avoid-said-to-me-that

    Backshifting tenses
    - backshift-present-be-to-past
    - backshift-will-to-would-time-tomorrow-next-day
    - backshift-can-to-could
    - backshift-must-to-had-to
    - backshift-present-to-past-with-now-then
    - backshift-present-simple-negative-to-past
    - no-backshift-still-true-exception

    Commands and requests
    - reported-command-asked-person-to-verb
    - reported-command-negative-not-to-verb
    - reported-speech-message-backshift-and-command

    Pronouns and time words
    - pronoun-change-you-to-I
    - time-word-today-to-that-day

    New healthcare-scenario tags (added with quiz-16+)
    - healthcare-portal-culture-antibiotic-backshift-command
    - healthcare-front-desk-said-that-vs-said-to-me
    - healthcare-discharge-conditional-follow-up-told-to
    - healthcare-pharmacist-grapefruit-not-to-drink
    - healthcare-nurse-conditional-page-would-backshift

    How to read the diagnostics:
    - If say vs tell tags are weak → contrast said that vs told me that; drill without said to me that.
    - If backshifting tags are weak → rebuild the mini tense chart and drill portal/time pairs (today → that day).
    - If command tags are weak → underline person + to + verb; practice pharmacy and registration lines.
    - If new healthcare tags are weak → role-play a single visit: portal ping → desk → exam → pharmacy, reporting each stop.

    Suggested use:
    - Run after learners complete direct vs reported, say vs tell, tense backshift, commands, and channel mix sections.
    */
};
