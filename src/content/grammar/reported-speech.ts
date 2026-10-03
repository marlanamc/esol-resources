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
            title: "Reported Speech: What did the doctor say?",
            icon: "💬",
            explanation: `
                ${sceneCard("sceneMychartPing", "7:30 PM Tuesday. Mina's visit summary arrives on her phone. She has two calls to make.", "blue")}

                <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem">
                  <p style="font-size: 1.1rem; margin: 0">Mina cleans rooms at a hotel near the airport. This morning she had her diabetes check-up at the East Boston clinic. It did not go the way she planned: her sugar was higher, the lab was full, and now she has a blood test <strong>tomorrow at 7:30 AM</strong>. Her shift starts at 8.</p>
                  <p style="margin: 0.65rem 0 0">Tonight she has to call her boss, <strong>Denise</strong>, and her sister, <strong>Gloria</strong>. She can't read them the whole visit summary. She has to tell them what Dr. Chen, Nurse Jordan, Alex at the front desk, and Pharmacist Sam said.</p>
                  <p style="margin: 0.65rem 0 0; font-weight: 600">That skill is <strong>reported speech</strong> (also called indirect speech).</p>
                </div>

                <h3>What Mina has to report</h3>
                <ol style="margin: 0.5rem 0 1.25rem 1rem; line-height: 1.75">
                  <li><strong>Exam room:</strong> Dr. Chen's news (direct vs reported)</li>
                  <li><strong>Front desk:</strong> Alex and the insurance card (say vs tell)</li>
                  <li><strong>Nurse Jordan:</strong> the fasting rules (tense backshift)</li>
                  <li><strong>Pharmacy:</strong> Sam and the new pill (told/asked + to + verb)</li>
                  <li><strong>Portal, phone, summary:</strong> the messages that came later</li>
                  <li><strong>Hallway:</strong> mistakes to avoid</li>
                  <li><strong>7:30 PM:</strong> the two phone calls</li>
                  <li><strong>Visit summary:</strong> quick reference</li>
                </ol>

                ${dialogue([
                    {
                        speaker: "Gloria",
                        avatar: "👩🏽",
                        text: "Finally! I called you three times. What did the doctor say?",
                        side: "right",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Wait, I'm reading it. It says, \"Your A1c is higher than in March.\"",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Gloria",
                        avatar: "👩🏽",
                        text: "I don't know what that means. Tell me in normal words.",
                        side: "right",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Okay. <strong>Dr. Chen said my sugar was higher.</strong>",
                        side: "left",
                        tone: "sage",
                    },
                ])}

                <div class="gc-callout-green gc-bg-green-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem; margin: 1rem 0">
                  <p style="margin: 0">Exact words (direct speech): "Your A1c is higher than in March."<br />Mina's report (reported speech): <strong>Dr. Chen said my sugar was higher.</strong></p>
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
                                { value: "b", label: "Dr. Chen said, 'You need to walk more.'" },
                                { value: "c", label: "Walk more!" },
                                { value: "a", label: "Dr. Chen said I need to walk more." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why does Mina need reported speech tonight?",
                            options: [
                                { value: "b", label: "She has to read the visit summary word for word" },
                                { value: "c", label: "She has to write a research paper about diabetes" },
                                {
                                    value: "a",
                                    label: "She has to tell her boss and her sister what the clinic team said",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "checkbox",
                            label: "Select ALL sentences that use reported speech.",
                            options: [
                                { value: "a", label: "Nurse Jordan said my blood pressure was fine." },
                                { value: "b", label: "Dr. Chen said, \"We will repeat the blood test.\"" },
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
                ${sceneCard("sceneExamRoom", "9:10 AM. Dr. Chen checks Mina's numbers on her laptop.", "terracotta")}

                <p>In the exam room, Mina hears <strong>direct speech</strong> (the exact words). Tonight, on the phone, she uses <strong>reported speech</strong> to retell it.</p>

                ${dialogue([
                    {
                        speaker: "Dr. Chen",
                        avatar: "👩🏻‍⚕️",
                        text: "You're doing better with your blood pressure. But your A1c is higher than in March.",
                        side: "left",
                        tone: "terracotta",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Higher? I don't eat sweets. Well, only the cookies in the hotel break room.",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Dr. Chen",
                        avatar: "👩🏻‍⚕️",
                        text: "You're also a little dehydrated. You need to drink more water and walk more.",
                        side: "left",
                        tone: "terracotta",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "I walk all day! I clean sixteen rooms a shift.",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Dr. Chen",
                        avatar: "👩🏻‍⚕️",
                        text: "A walk after dinner is different. We'll do a fasting blood test and look at your medicine.",
                        side: "left",
                        tone: "terracotta",
                    },
                ])}

                <p>Tonight, Mina tells Gloria: <strong>Dr. Chen said I was doing better with my blood pressure, but my A1c was higher.</strong></p>

                <div class="gc-bg-sage-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-sage">Direct speech</h4>
                    <p><strong>Exact words</strong> (quotation marks)</p>
                    <ul>
                        <li>Dr. Chen said, "You need to walk more."</li>
                        <li>Pharmacist Sam said, "Take this pill at night."</li>
                    </ul>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">Reported speech</h4>
                    <p><strong>Retelling:</strong> no quotes, and tenses often shift back</p>
                    <ul>
                        <li>Dr. Chen said <strong>I needed to walk</strong> more.</li>
                        <li>Sam told me <strong>to take the pill at night</strong>.</li>
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
                                { value: "reported", label: "Reported speech: retelling without quotation marks" },
                                { value: "direct", label: "Direct speech: exact words with quotation marks" },
                            ],
                            expectedAnswer: "direct",
                        },
                        {
                            type: "radio",
                            label: "Dr. Chen <span class='eg-verb'>said</span> I <span class='eg-verb'>needed</span> to drink more water.",
                            options: [
                                { value: "reported", label: "Reported speech: retelling, tense changed" },
                                { value: "direct", label: "Direct speech: exact words" },
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
                            label: "Rebuild what Mina tells Gloria about Dr. Chen and her blood pressure:",
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
                ${sceneCard("sceneReception", "8:40 AM. Check-in at the front desk. Alex helps the patient ahead of Mina first.", "blue")}

                ${dialogue([
                    {
                        speaker: "Alex",
                        avatar: "👨🏼",
                        text: "Good morning, Mina. Your copay is thirty dollars today.",
                        side: "left",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Okay. Here's my card.",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Alex",
                        avatar: "👨🏼",
                        text: "Hmm. This card is expired in our system. Please bring your new one next time.",
                        side: "left",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "The new one is on my fridge at home. Of course.",
                        side: "right",
                        tone: "sage",
                    },
                ])}

                <p>Alex gave Mina two facts. To report them, English uses <strong>said</strong> and <strong>told</strong> a little differently.</p>

                <div class="gc-bg-sage-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-sage">SAY: the listener is optional</h4>
                    <p style="font-weight: bold">Subject + said + (that) + statement</p>
                    <ul>
                        <li>Alex <strong>said</strong> (that) the copay was thirty dollars.</li>
                        <li>Alex <strong>said to me</strong> (that) the copay was thirty dollars.</li>
                    </ul>
                    <p style="margin-top: 1rem">Both are correct. If you name the listener after <strong>said</strong>, you need <strong>to</strong>: said <strong>to me</strong>.</p>
                    <p style="font-style: italic">Never: ❌ <em>Alex said me that…</em></p>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">TELL: the listener is required</h4>
                    <p style="font-weight: bold">Subject + told + (me/you/him/her/us/them) + (that) + statement</p>
                    <ul>
                        <li>Alex <strong>told me</strong> (that) my insurance card was expired.</li>
                        <li>He <strong>told us</strong> (that) the lab was running late.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic">You must name the listener: ❌ <em>He told that…</em></p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
                  <div class="gc-bg-red" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
                    <div style="font-weight: 800; margin-bottom: 0.35rem">❌ Wrong</div>
                    <div style="font-size: 0.95rem">Alex <strong>said me that</strong> my card was expired.<br />Alex <strong>told that</strong> my card was expired.</div>
                  </div>
                  <div class="gc-bg-green-alpha" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
                    <div style="font-weight: 800; margin-bottom: 0.35rem">✅ Correct</div>
                    <div style="font-size: 0.95rem">Alex <strong>said that</strong> my card was expired.<br />Alex <strong>said to me that</strong> my card was expired.<br />Alex <strong>told me that</strong> my card was expired.</div>
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
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "Alex told that Dr. Chen was running ten minutes late." },
                                { value: "a", label: "Alex said that Dr. Chen was running ten minutes late." },
                                { value: "c", label: "Alex said me that Dr. Chen was running ten minutes late." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "Jordan told that my blood pressure looked fine." },
                                { value: "c", label: "Jordan told to me that my blood pressure looked fine." },
                                { value: "a", label: "Jordan told me that my blood pressure looked fine." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the main difference between say and tell?",
                            options: [
                                {
                                    value: "a",
                                    label: "Say does not need a listener (if you add one, use to: said to me); tell needs one (me, you, him, her, us, them).",
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
                                { value: "b", label: "Alex said me that the pharmacy closed at six." },
                                { value: "a", label: "Alex said that the pharmacy closed at six." },
                                { value: "c", label: "Alex said us that the pharmacy closed at six." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "select",
                            label: "At the desk Alex _____ that my phone number was updated.",
                            options: ["told", "said", "said me", "told to me"],
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
                ${sceneCard("sceneNurseInstructions", "9:40 AM. In Bay 2, Nurse Jordan explains the fasting rules on a card.", "sage")}

                ${dialogue([
                    {
                        speaker: "Jordan",
                        avatar: "👩🏿‍⚕️",
                        text: "Bad news. The lab is at capacity now, so you can't do the blood test today.",
                        side: "left",
                        tone: "purple",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "But I took the whole morning off for this.",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Jordan",
                        avatar: "👩🏿‍⚕️",
                        text: "I know. I can get you in tomorrow at 7:30 AM. You must fast tonight. Water is okay.",
                        side: "left",
                        tone: "purple",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "My shift starts at 8. My boss is going to love this.",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Jordan",
                        avatar: "👩🏿‍⚕️",
                        text: "The test only takes about an hour. I'll call you tonight to confirm the time.",
                        side: "left",
                        tone: "purple",
                    },
                ])}

                <p>Tonight, Jordan's words are already in the past. When Mina reports them, English often moves the verbs \"one step back\" in time: <strong>Jordan said I had to fast that night.</strong></p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2)">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Direct (then)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd">Reported (later)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"The lab <strong>is</strong> full.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">Jordan said the lab <strong>was</strong> full.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"You <strong>have</strong> a blood test tomorrow.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">She said I <strong>had</strong> a blood test the next day.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>will</strong> call you tonight.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">She said she <strong>would</strong> call me that night.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02)">
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"I <strong>can</strong> get you in tomorrow.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">She said she <strong>could</strong> get me in the next day.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">\"You <strong>must</strong> fast.\"</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd">Jordan said I <strong>had to</strong> fast.</td>
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
                    "If something is still true now, you may keep the present: Jordan said the lab opens at 7:30. (It opens at 7:30 every day.)",
            },
            exercises: [
                {
                    id: "reported-speech-tense-backshifting-1",
                    title: "Practice: Tense backshift",
                    instructions: "Choose the best reported form.",
                    items: [
                        {
                            type: "radio",
                            label: "Jordan: \"I am in Bay 2 today.\" (Mina reports it that night.)",
                            options: [
                                { value: "b", label: "Jordan said she is in Bay 2 today." },
                                { value: "c", label: "Jordan said she will be in Bay 2 today." },
                                { value: "a", label: "Jordan said she was in Bay 2 that day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Jordan: \"I will message you tomorrow.\" → She said _____.",
                            options: [
                                { value: "a", label: "she will message me tomorrow" },
                                { value: "b", label: "she would message me the next day" },
                                { value: "c", label: "I would message you tomorrow" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "The pharmacy team: \"We can meet you now at the counter.\" → They said _____.",
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
                            label: 'Jordan: "I will call you tonight." → She said she _____ .',
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
                ${sceneCard("scenePharmacy", "10:15 AM. Old bottles line the shelves at the pharmacy next to the clinic while Mina waits for Sam.", "amber")}

                ${dialogue([
                    {
                        speaker: "Sam",
                        avatar: "👨🏾‍⚕️",
                        text: "Dr. Chen added a new cholesterol pill. Take it at night. And don't drink grapefruit juice with it.",
                        side: "left",
                        tone: "amber",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Grapefruit? Is that a joke?",
                        side: "right",
                        tone: "sage",
                    },
                    {
                        speaker: "Sam",
                        avatar: "👨🏾‍⚕️",
                        text: "No joke. Grapefruit can make this pill too strong. Please read this warning before you go.",
                        side: "left",
                        tone: "amber",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Okay. No grapefruit. That's easy. I never buy it.",
                        side: "right",
                        tone: "sage",
                    },
                ])}

                <p>Sam's instructions and requests use a different shape when Mina reports them: <strong>told / asked + person + to + base verb</strong>.</p>

                <div style="max-width: 440px; margin: 1.25rem auto; border: 2px solid #1a202c; border-radius: 0.375rem; overflow: hidden; font-family: 'Courier New', 'Consolas', monospace; background: #fffdf6">
                  <div style="background: #2563eb; color: #ffffff; padding: 0.4rem 0.85rem; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.08em">AFTER-VISIT STICKER</div>
                  <div style="padding: 0.85rem 1rem 0.95rem; font-size: 0.92rem; line-height: 1.7">
                    <div>▸ <strong>Take</strong> one tablet at night with food.</div>
                    <div>▸ <strong>Take</strong> it every day, even if you feel fine.</div>
                    <div>▸ <strong>Do not</strong> drink grapefruit juice.</div>
                  </div>
                </div>

                <div class="gc-bg-terracotta-alpha" style="margin: 1.5rem 0; padding: 1.5rem; border-radius: 0.5rem">
                    <h4 class="gc-text-terracotta">Commands</h4>
                    <p class="gc-text-terracotta" style="font-size: 1.15rem; font-weight: bold">told + me + to + base verb</p>
                    <ul>
                        <li>Direct: \"Take this with food.\" → Sam <strong>told me to take</strong> it with food.</li>
                        <li>Direct: \"Don't drink grapefruit juice.\" → Sam <strong>told me not to drink</strong> grapefruit juice.</li>
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
                            label: "Alex, about the expired card: \"Call us back after 3 PM.\"",
                            options: [
                                { value: "b", label: "They asked me call them back after 3 PM." },
                                { value: "a", label: "They asked me to call them back after 3 PM." },
                                { value: "c", label: "They said me to call them back after 3 PM." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Jordan: \"Don't eat anything after midnight.\"",
                            options: [
                                { value: "b", label: "Jordan told me don't eat anything after midnight." },
                                { value: "c", label: "Jordan said me not to eat anything after midnight." },
                                { value: "a", label: "Jordan told me not to eat anything after midnight." },
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
                                { value: "a", label: "Dr. Chen told me that drink more water." },
                                { value: "b", label: "Dr. Chen told me to drink more water." },
                                { value: "c", label: "Dr. Chen asked me to drink more water." },
                                { value: "d", label: "Dr. Chen told me drink more water." },
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
            title: "Portal, phone call, visit summary",
            icon: "🏥",
            explanation: `
                ${sceneCard("sceneLabDraw", "Before Mina leaves, a clinician shows her tomorrow's lab order on a tablet.", "blue")}

                <p>Not everything came face to face. Some of what Mina has to report came later, by portal, by phone, and in the visit summary.</p>

                <h3>1) Portal message (MyChart style)</h3>
                <div style="max-width: 480px; margin: 1rem auto; border: 1px solid rgba(0,0,0,0.15); border-radius: 0.5rem; overflow: hidden; font-family: 'Courier New', monospace; font-size: 0.88rem">
                  <div style="background: rgba(37,99,235,0.12); padding: 0.45rem 0.75rem; font-weight: 700" class="gc-text-blue">PORTAL MESSAGE: East Boston Clinic</div>
                  <div style="padding: 0.75rem 1rem; line-height: 1.6">
                    <div><strong>Subject:</strong> Your visit today</div>
                    <div style="margin-top: 0.5rem; font-style: italic">\"Your A1c is slightly higher. Please bring your glucose meter to your nutrition visit next week.\"</div>
                  </div>
                </div>
                <p><strong>Mina tells Gloria:</strong> They said my A1c <strong>was</strong> slightly higher and told me <strong>to bring</strong> my glucose meter to my nutrition visit the following week.</p>

                ${sceneCard("sceneFamilyPhone", "7:45 PM. Mina on the couch, going over the plan with Gloria on video.", "sage")}

                <h3>2) Phone call from Nurse Jordan (7:15 PM)</h3>
                <div class="gc-bg-terracotta-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem; margin: 1rem 0">
                  <p style="margin: 0; font-style: italic">\"Your blood test is tomorrow at 7:30. Please arrive fifteen minutes early.\"</p>
                  <p style="margin: 0.6rem 0 0"><strong>Reported:</strong> She said my blood test <strong>was</strong> the next day at 7:30 and told me <strong>to arrive</strong> fifteen minutes early.</p>
                </div>

                <h3>3) Visit summary</h3>
                <div class="gc-bg-sage-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
                  <p style="margin: 0; font-style: italic">\"You need to walk for twenty minutes after dinner. Don't skip doses. Call us if you feel very thirsty or dizzy.\"</p>
                  <p style="margin: 0.6rem 0 0"><strong>Reported:</strong> Dr. Chen said I <strong>needed to walk</strong> for twenty minutes after dinner, <strong>told me not to skip</strong> doses, and <strong>told me to call</strong> if I felt very thirsty or dizzy.</p>
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
                            label: "Portal: \"Your blood pressure is normal. Please pick up your test strips tomorrow.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "They said my blood pressure is normal and told me pick up my test strips tomorrow.",
                                },
                                {
                                    value: "a",
                                    label: "They said my blood pressure was normal and told me to pick up my test strips the next day.",
                                },
                                {
                                    value: "c",
                                    label: "They said me that my blood pressure was normal and told me to pick up my test strips the next day.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Alex, at checkout: \"Your nutrition visit is on Tuesday at 9. Bring your medication list.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "He said my nutrition visit is on Tuesday at 9 and told me bring my medication list.",
                                },
                                {
                                    value: "c",
                                    label: "He told that my nutrition visit was on Tuesday and told me to bring my medication list.",
                                },
                                {
                                    value: "a",
                                    label: "He said my nutrition visit was on Tuesday at 9 and told me to bring my medication list.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Jordan: \"You must fast tonight. Come back tomorrow morning.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "Jordan said I had to fast that night and told me to come back the next morning.",
                                },
                                {
                                    value: "b",
                                    label: "Jordan said I must fast tonight and told me come back tomorrow morning.",
                                },
                                {
                                    value: "c",
                                    label: "Jordan said me that I had to fast that night and told me to come back the next morning.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Sam: \"Take this at night. You can't drink grapefruit juice with it.\"",
                            options: [
                                {
                                    value: "b",
                                    label: "Sam told me take the pill at night and said I can't drink grapefruit juice with it.",
                                },
                                {
                                    value: "a",
                                    label: "Sam told me to take the pill at night and said I couldn't drink grapefruit juice with it.",
                                },
                                {
                                    value: "c",
                                    label: "Sam said me to take the pill at night and said I couldn't drink grapefruit juice with it.",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Short answer: The portal said, \"We will post your results tonight.\" → Start with: They said …",
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
                ${sceneCard("sceneHospitalHall", "The hallway outside the full lab. Mina reads her notes before she leaves.", "amber")}

                <p>Before her calls tonight, Mina checks four mistakes that change how a report sounds.</p>

                <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> She <strong>said me</strong> that…</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> She <strong>said that</strong>… / She <strong>said to me that</strong>… / She <strong>told me that</strong>…</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> He <strong>told that</strong>…</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> He <strong>told me that</strong>…</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
                    <div class="gc-bg-red" style="padding: 0.75rem; border-radius: 0.5rem"><strong>❌</strong> Jordan said the lab <strong>is</strong> full (this morning).</div>
                    <div class="gc-bg-green-alpha" style="padding: 0.75rem; border-radius: 0.5rem"><strong>✅</strong> Jordan said the lab <strong>was</strong> full.</div>
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
                            label: "Mistake #1 in the grid: what is wrong with \"She said me that…\"?",
                            options: [
                                { value: "b", label: "Using told incorrectly" },
                                { value: "c", label: "Using too few words" },
                                {
                                    value: "a",
                                    label: "Said needs to before the listener: said to me that, or just said that",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #2: \"Jordan told that my feet looked fine.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "Tell needs a listener: Jordan told me that…",
                                },
                                { value: "b", label: "Tell should become say" },
                                { value: "c", label: "The sentence is already perfect" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #3: reporting this morning's visit with present tense",
                            options: [
                                {
                                    value: "a",
                                    label: "Backshift the tense when the reporting frame is past",
                                },
                                { value: "b", label: "Always use future tense" },
                                { value: "c", label: "Put the doctor's words in quotation marks" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Mistake #4: \"Sam told me that take the pill at night.\"",
                            options: [
                                {
                                    value: "a",
                                    label: "Commands use told + person + to + verb (not that take)",
                                },
                                { value: "b", label: "Switch said to told" },
                                { value: "c", label: "Change told to asked" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "checkbox",
                            label: "Select ALL sentences that need a fix.",
                            options: [
                                { value: "a", label: "Alex said me that Room 2 was open." },
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
            title: "7:30 PM: the two phone calls",
            icon: "✏️",
            explanation: `
                ${sceneCard("sceneFamilyPhone", "Two calls from the couch: first Denise, then Gloria.", "purple")}

                <h3>Call 1: Denise, the housekeeping supervisor</h3>
                <p>Denise doesn't need Mina's A1c. She needs to know about tomorrow's shift.</p>

                ${dialogue([
                    {
                        speaker: "Denise",
                        avatar: "👩🏼",
                        text: "Hi, Mina. How did it go? Are you okay for tomorrow?",
                        side: "right",
                        tone: "amber",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "I'm okay, but the lab was full. <strong>They told me to come back tomorrow at 7:30.</strong>",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Denise",
                        avatar: "👩🏼",
                        text: "So you'll miss the start of your shift. How long is the test?",
                        side: "right",
                        tone: "amber",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "<strong>The nurse said it took about an hour.</strong> I can be there by 9:30.",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Denise",
                        avatar: "👩🏼",
                        text: "Fine. I'll give your first floor to Carlos. Did the doctor say anything about work?",
                        side: "right",
                        tone: "amber",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "<strong>She told me to walk more.</strong> So no elevator for me tomorrow.",
                        side: "left",
                        tone: "sage",
                    },
                ])}

                <h3>Call 2: Gloria, who wants every detail</h3>

                ${dialogue([
                    {
                        speaker: "Gloria",
                        avatar: "👩🏽",
                        text: "Okay, I can take the kids to school tomorrow. What else did they say?",
                        side: "right",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Sam gave me a new pill for cholesterol. <strong>He told me to take it at night.</strong>",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Gloria",
                        avatar: "👩🏽",
                        text: "Good. And I have a surprise. I read that grapefruit is good for your sugar, so I bought you twelve.",
                        side: "right",
                        tone: "blue",
                    },
                    {
                        speaker: "Mina",
                        avatar: "👩🏽‍🦱",
                        text: "Gloria. <strong>Sam told me not to drink grapefruit juice</strong> with the new pill.",
                        side: "left",
                        tone: "sage",
                    },
                    {
                        speaker: "Gloria",
                        avatar: "👩🏽",
                        text: "Twelve grapefruits, Mina! Fine. The kids can take them to school.",
                        side: "right",
                        tone: "blue",
                    },
                ])}

                <p>Mina got it right for both of them: Denise knows when she's coming in, and Gloria knows what not to put in the juicer.</p>

                <div class="gc-callout-blue gc-bg-blue-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
                  <p style="margin: 0">Your turn. Use the same tools: <strong>said / told / asked</strong>, backshift, <strong>to + verb</strong>, and <strong>not to + verb</strong>. Start simple: who spoke, and was it a statement or an instruction? Then fix pronouns and time words.</p>
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
                                { text: "sister" },
                                { text: "that" },
                                { text: "Dr." },
                                { text: "Chen" },
                                { text: "said", isTarget: true },
                                { text: "I" },
                                { text: "needed" },
                                { text: "more" },
                                { text: "exercise," },
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
                            label: 'Direct: Dr. Chen said, "We are short-staffed in the lab today."',
                            options: [
                                { value: "b", label: "Dr. Chen said they were short-staffed in the lab that day." },
                                { value: "a", label: "Dr. Chen said we are short-staffed in the lab today." },
                                { value: "c", label: "Dr. Chen told that they were short-staffed in the lab that day." },
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
                            label: "Dr. Chen: \"I will send your referral tomorrow.\" → She said _____.",
                            options: [
                                { value: "a", label: "she will send my referral tomorrow" },
                                { value: "c", label: "she told me that I would send her referral tomorrow" },
                                { value: "b", label: "she would send my referral the next day" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Fix: \"Sam said me that the generic was ready.\"",
                            options: [
                                { value: "b", label: "Sam said me that the generic was ready." },
                                { value: "c", label: "Sam told that the generic was ready." },
                                { value: "a", label: "Sam said that the generic was ready." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Sam: \"Don't take this pill on an empty stomach.\"",
                            options: [
                                { value: "b", label: "Sam said me not take the pill on an empty stomach." },
                                { value: "a", label: "Sam told me not to take the pill on an empty stomach." },
                                { value: "c", label: "Sam told me that don't take the pill on an empty stomach." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Jordan: \"Your visit summary is ready at the desk.\"",
                            options: [
                                { value: "a", label: "Jordan said my visit summary is ready at the desk." },
                                { value: "c", label: "Jordan told my visit summary was ready at the desk." },
                                { value: "b", label: "Jordan said my visit summary was ready at the desk." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Mina tells Denise what Jordan said. Which sentences are acceptable?",
                            options: [
                                { value: "a", label: "Only: Jordan said that the lab was full." },
                                { value: "d", label: "Jordan said that the lab was full AND Jordan told me that the lab was full." },
                                { value: "b", label: "Only: Jordan told me that the lab was full." },
                                { value: "c", label: "Jordan said me that the lab was full." },
                            ],
                            expectedAnswer: "d",
                        },
                        {
                            type: "radio",
                            label: "Alex: \"Please sign this form.\"",
                            options: [
                                { value: "b", label: "Alex said me to sign this form." },
                                { value: "a", label: "Alex asked me to sign this form." },
                                { value: "c", label: "Alex asked me that I sign this form." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "word-scramble",
                            label: "Rebuild Mina's line to Gloria about Dr. Chen:",
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
            title: "Visit summary: quick reference",
            icon: "📋",
            explanation: `
                ${sceneCard("sceneDischargePapers", "Checkout: the visit summary on a tablet. Here is Mina's version of the rules.", "terracotta")}

                <h3>Say vs tell</h3>
                <ul>
                    <li><strong>Say:</strong> said (that) + statement, or said <strong>to</strong> + person + (that) + statement</li>
                    <li><strong>Tell:</strong> told + person + (that) + statement</li>
                    <li><strong>Never:</strong> said me… / told that…</li>
                </ul>

                <h3>Statements</h3>
                <p>Subject + said/told + (that) + backshifted clause</p>
                <ul>
                    <li>\"Your A1c is higher.\" → Dr. Chen said my A1c <strong>was</strong> higher.</li>
                    <li>\"I will call you tonight.\" → Jordan said she <strong>would</strong> call me that night.</li>
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
                content: "Say = listener optional (said that / said to me that). Tell = listener required (told me that). Commands use told/asked + person + to + verb.",
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
                                { value: "c", label: "said + me + to + base verb" },
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
                            label: "\"I am in Bay 2 today.\" → Jordan said _____.",
                            options: [
                                { value: "b", label: "she is in Bay 2 today" },
                                { value: "c", label: "Jordan told that she was in Bay 2" },
                                { value: "a", label: "she was in Bay 2 that day" },
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
                { value: "a", label: "Nurse Jordan told that the lab was full." },
                { value: "b", label: "Nurse Jordan told me that the lab was full." },
                { value: "c", label: "Nurse Jordan told to me that the lab was full." },
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
                { value: "a", label: "Alex said me that the lab was short-staffed." },
                { value: "c", label: "Alex told that the lab was short-staffed." },
                { value: "b", label: "Alex said that the lab was short-staffed." },
            ],
            correctAnswer: "b",
            explanation:
                "Said that… is correct (said to me that… is correct too). Never said me that…, and told needs a listener: told me that….",
            skillTag: "say-vs-tell-say-with-that",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: 'Convert: "I am in Bay 2 today." → Jordan said _____.',
            options: [
                { value: "b", label: "she was in Bay 2 that day" },
                { value: "a", label: "she is in Bay 2 today" },
                { value: "c", label: "I was in Bay 2 that day" },
            ],
            correctAnswer: "b",
            explanation: "Present am/is often becomes was/were when we report from the past.",
            skillTag: "backshift-present-be-to-past",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: 'Dr. Chen: "I will email you tomorrow." → She said _____.',
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
            question: 'Convert: "Please sign this form." → Alex asked me _____.',
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
                { value: "a", label: "to don't skip doses" },
                { value: "c", label: "don't skip doses" },
            ],
            correctAnswer: "b",
            explanation: "Negative commands use told/asked + person + not to + base verb.",
            skillTag: "reported-command-negative-not-to-verb",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: 'Jordan: "I can help you with the forms." → She said _____.',
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
            question: 'Time word: Sam said, "I can meet you at the counter today." → He said he could meet me at the counter _____.',
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
                { value: "a", label: "Jordan said that my feet looked fine." },
                { value: "c", label: "Jordan told me that my feet looked fine." },
                { value: "b", label: "Jordan said me that my feet looked fine." },
            ],
            correctAnswer: "b",
            explanation: "Say needs to before the listener: said to me that, or just said that. Never said me that.",
            skillTag: "avoid-said-to-me-that",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: 'The lab: "We are at capacity now." → They said _____.',
            options: [
                { value: "b", label: "they are at capacity then" },
                { value: "c", label: "we are at capacity now" },
                { value: "a", label: "they were at capacity then" },
            ],
            correctAnswer: "a",
            explanation: "The clinic staff said we, so you report they. Are becomes were; now becomes then.",
            skillTag: "backshift-present-to-past-with-now-then",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "If the information is still true now, which is best?",
            options: [
                { value: "a", label: "Jordan said the lab opened at 7:30 AM. (Still true.)" },
                { value: "b", label: "Jordan said the lab opens at 7:30 AM. (Still true.)" },
                { value: "c", label: "Jordan said the lab will open at 7:30 AM. (Still true.)" },
            ],
            correctAnswer: "b",
            explanation: "If something is still true now, we can keep the present simple in reported speech.",
            skillTag: "no-backshift-still-true-exception",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                'Portal message: "Your insurance information is incomplete. Please bring your new card tomorrow." Which is best?',
            options: [
                {
                    value: "b",
                    label: "They said my insurance information is incomplete and told me bring my new card tomorrow.",
                },
                {
                    value: "c",
                    label: "They told that my insurance information was incomplete and said me to bring my new card the next day.",
                },
                {
                    value: "a",
                    label: "They said my insurance information was incomplete and told me to bring my new card the next day.",
                },
            ],
            correctAnswer: "a",
            explanation: "Is becomes was, tomorrow becomes the next day, and told needs a person plus to + verb.",
            skillTag: "reported-speech-message-backshift-and-command",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: 'The man next to Mina in the waiting room: "I don\'t mind waiting in the lobby." → He said _____.',
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
                "Portal: \"Your urine test is normal. Pick up your test strips tomorrow.\" Which report is best?",
            options: [
                {
                    value: "b",
                    label: "They said my urine test is normal and told me pick up my test strips tomorrow.",
                },
                {
                    value: "c",
                    label: "They told that my urine test was normal and said me to pick up my test strips.",
                },
                {
                    value: "a",
                    label: "They said my urine test was normal and told me to pick up my test strips the next day.",
                },
            ],
            correctAnswer: "a",
            explanation: "Backshift the statement, change tomorrow to the next day, and use told + me + to + verb.",
            skillTag: "healthcare-portal-culture-antibiotic-backshift-command",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "Mina tells Gloria about the copay. Which line is correct?",
            options: [
                { value: "b", label: "Alex said me that my copay was thirty dollars." },
                { value: "c", label: "Alex told that my copay was thirty dollars." },
                { value: "a", label: "Alex said that my copay was thirty dollars." },
            ],
            correctAnswer: "a",
            explanation: "Said that is correct (so is said to me that). Said me is wrong, and told needs a listener.",
            skillTag: "healthcare-front-desk-said-that-vs-said-to-me",
            difficulty: "easy",
        },
        {
            id: "quiz-18",
            question: "This morning Dr. Chen said, \"Come back next week if your feet feel numb.\" Best report?",
            options: [
                {
                    value: "b",
                    label: "Dr. Chen told me that come back next week if my feet feel numb.",
                },
                {
                    value: "c",
                    label: "Dr. Chen said me to come back the following week if my feet felt numb.",
                },
                {
                    value: "a",
                    label: "Dr. Chen told me to come back the following week if my feet felt numb.",
                },
            ],
            correctAnswer: "a",
            explanation: "Use told + me + to + verb for the command, backshift feel → felt, next week → the following week.",
            skillTag: "healthcare-discharge-conditional-follow-up-told-to",
            difficulty: "hard",
        },
        {
            id: "quiz-19",
            question: "Pharmacist Sam: \"Don't drink grapefruit juice with this pill.\" → Sam told me _____.",
            options: [
                { value: "a", label: "to don't drink grapefruit juice with this pill" },
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
            question: 'Jordan: "I will page Dr. Chen if your sugar reading is high tonight." → Jordan said _____.',
            options: [
                {
                    value: "b",
                    label: "she will page Dr. Chen if my sugar reading is high tonight",
                },
                {
                    value: "c",
                    label: "I would page Dr. Chen if your sugar reading was high tonight",
                },
                {
                    value: "a",
                    label: "she would page Dr. Chen if my sugar reading was high that night",
                },
            ],
            correctAnswer: "a",
            explanation: "Will → would, is → was, your sugar → my sugar when you report for yourself, tonight → that night.",
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
    - Avoid common error patterns like said me that, told that, and will or can staying in the present.
    - Note: said to me that is grammatical and is taught as correct (teacher decision, Oct 2026).
    - Apply these rules to clinic portals, reception desks, pharmacy counseling, and discharge teaching.

    Skill tags (legacy — keep verbatim for dashboards):

    Say vs tell
    - say-vs-tell-tell-with-object
    - say-vs-tell-say-with-that
    - avoid-said-to-me-that (legacy name; quiz-11 now tests "said me that" as the error)

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
    - healthcare-front-desk-said-that-vs-said-to-me (legacy name; quiz-17 now uses "said me that" as the error)
    - healthcare-discharge-conditional-follow-up-told-to
    - healthcare-pharmacist-grapefruit-not-to-drink
    - healthcare-nurse-conditional-page-would-backshift

    How to read the diagnostics:
    - If say vs tell tags are weak → contrast said that / said to me that vs told me that; flag said me and told that.
    - If backshifting tags are weak → rebuild the mini tense chart and drill portal/time pairs (today → that day).
    - If command tags are weak → underline person + to + verb; practice pharmacy and registration lines.
    - If new healthcare tags are weak → role-play Mina's two calls: report the visit to a boss (work facts only) and to a family member (everything).

    Suggested use:
    - Run after learners complete direct vs reported, say vs tell, tense backshift, commands, and channel mix sections.
    */
};
