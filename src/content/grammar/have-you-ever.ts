import type { InteractiveGuideContent } from "@/types/activity";
import { haveYouEverImages as img } from "@/data/have-you-ever-images.generated";

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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const haveYouEverContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Catching Up on the Phone
    // =========================================================================
    {
      id: "catching-up-on-the-phone",
      stepNumber: 1,
      title: "Catching Up on the Phone",
      icon: "📞",
      tenseDiagram: {
        title: "Have you ever?. anytime in your life up to now",
        elements: [
          {
            id: "pp-arc",
            type: "arc",
            zone: "past",
            position: 50,
            verbLabel: "Have you ever...?",
          },
        ],
      },
      explanation: `
        ${sceneCard("scenePhone", "East Boston, Tuesday evening. Claudette calls her cousin Jean in Montreal.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Emily from work called earlier, but tonight Claudette wants to catch up with family.</p>

        ${dialogue([
          { speaker: "Jean", avatar: "👨🏽", text: "<strong>Have</strong> you <strong>ever tried</strong> Haitian food in Boston?", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Yes, I <strong>have</strong>! There is a restaurant on Maverick Square. It is so good.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "👨🏽", text: "<strong>Have</strong> you <strong>ever taken</strong> the Blue Line to the airport?", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "No, I <strong>haven't</strong>. I always take the bus.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "👨🏽", text: "<strong>Have</strong> you <strong>ever cooked</strong> a big meal for your family?", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "No! What is that? A big dinner in November. my kids learn about it at school.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Have you ever...?</strong> = Did this happen at any time in your life? We do not say when. We just want to know: yes or no, has this experience happened to you?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("any time", "sage")}
            <span><em><strong>Have</strong> you <strong>ever eaten</strong> a tamale?</em> (in your whole life)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("any time", "sage")}
            <span><em><strong>Have</strong> you <strong>ever been</strong> to a city council meeting?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("any time", "sage")}
            <span><em><strong>Have</strong> you <strong>ever volunteered</strong> in your community?</em></span>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(106,141,115,0.08); border-left: 3px solid #6a8d73; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.93rem"><strong>The form:</strong> <strong>Have</strong> + subject + <strong>ever</strong> + V3 (past participle)<br>
          Example: Have you ever <em>eaten</em> / <em>been</em> / <em>taken</em> / <em>tried</em></p>
        </div>
      `,
      exercises: [
        {
          id: "hye-s1-ex1",
          title: "What does it mean?",
          instructions: "Choose the best meaning for each question.",
          items: [
            {
              type: "radio",
              label: "\"Have you ever taken an English class before?\"",
              options: [
                { value: "a", label: "Did you take a class last week?" },
                { value: "b", label: "Are you in a class right now?" },
                { value: "c", label: "At any time in your life, did you take a class?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"Have you ever visited the East Boston library?\"",
              options: [
                { value: "a", label: "Do you go to the library every week?" },
                { value: "b", label: "Did this happen at any point in your life?" },
                { value: "c", label: "Are you at the library right now?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hye-s1-ex2",
          title: "Build the question",
          instructions: "Unscramble the words to make a correct \"Have you ever\" question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Have", "you", "ever", "visited", "city", "hall"],
              correctAnswer: "Have you ever visited city hall",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Have", "you", "ever", "called", "311", "about", "a", "problem"],
              correctAnswer: "Have you ever called 311 about a problem",
            },
          ],
        },
        {
          id: "hye-s1-ex3",
          title: "Write the missing word",
          instructions: "Fill in the blank with the correct form.",
          items: [
            {
              type: "text",
              label: "Have you ever ___ (be) to a community meeting in East Boston?",
              expectedAnswers: ["been"],
            },
            {
              type: "text",
              label: "Have you ever ___ (ride) the Blue Line to the airport?",
              expectedAnswers: ["ridden"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Did you go? vs. Have you been?
    // =========================================================================
    {
      id: "did-you-go-vs-have-you-been",
      stepNumber: 2,
      title: "Did you go? vs. Have you been?",
      icon: "⚖️",
      tenseDiagram: {
        title: "Two questions, two meanings",
        elements: [
          {
            id: "past-simple-dot",
            type: "single-dot",
            zone: "past",
            position: 70,
            verbLabel: "Did you go? (specific time)",
          },
          {
            id: "pp-arc",
            type: "arc",
            zone: "past",
            position: 35,
            verbLabel: "Have you been? (any time)",
          },
        ],
      },
      explanation: `
        ${sceneCard("sceneClassroom", "After class, Eastie Community Learning Center. Two students talk before leaving.", "terracotta")}

        ${dialogue([
          { speaker: "Diego", avatar: "🧑🏽", text: "<strong>Did</strong> you <strong>go</strong> to the festival on Saturday?", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏾", text: "No, I worked that day. <strong>Have</strong> you <strong>ever been</strong> to a Somali restaurant?", side: "right", tone: "sage" },
          { speaker: "Diego", avatar: "🧑🏽", text: "No, I <strong>haven't</strong>. Is there one near here?", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏾", text: "Yes! My cousin <strong>went</strong> there last Friday and loved it.", side: "right", tone: "sage" },
        ])}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Past Simple</div>
            <div style="font-size: 1rem; margin-bottom: 0.4rem"><strong>Did you go</strong> to the festival?</div>
            <div style="font-size: 0.88rem; opacity: 0.85">Specific time. We know when: last Saturday, yesterday, in 2022.</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Present Perfect</div>
            <div style="font-size: 1rem; margin-bottom: 0.4rem"><strong>Have you ever been</strong> to a festival?</div>
            <div style="font-size: 0.88rem; opacity: 0.85">Any time in your life. No specific time needed.</div>
          </div>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("specific time", "terracotta")}
            <span><em>Did you call 311 <strong>last week</strong>?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("any time", "sage")}
            <span><em>Have you ever called 311?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("specific time", "terracotta")}
            <span><em>Did you go to the food pantry <strong>in March</strong>?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("any time", "sage")}
            <span><em>Have you ever been to the food pantry?</em></span>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(176,87,64,0.06); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.93rem"><strong>Key rule:</strong> If the question includes a specific time (last Saturday, yesterday, in 2020), use <strong>Past Simple</strong>. If there is no time, or you say "ever," use <strong>Have you...?</strong></p>
        </div>
      `,
      exercises: [
        {
          id: "hye-s2-ex1",
          title: "Which question fits?",
          instructions: "Choose the correct question for each situation.",
          items: [
            {
              type: "radio",
              label: "You want to know if your classmate went to a cultural event at any point in her life.",
              options: [
                { value: "a", label: "Did you go to a cultural event last year?" },
                { value: "b", label: "Have you ever been to a cultural event?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You know there was a free legal clinic last Thursday. You want to know if your neighbor went.",
              options: [
                { value: "a", label: "Did you go to the legal clinic last Thursday?" },
                { value: "b", label: "Have you ever been to a legal clinic?" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "You want to know if your coworker has experience donating blood at any point in his life.",
              options: [
                { value: "a", label: "Did you donate blood last summer?" },
                { value: "b", label: "Have you ever donated blood?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hye-s2-ex2",
          title: "Correct or not correct?",
          instructions: "Is the underlined question correct for the situation described?",
          items: [
            {
              type: "radio",
              label: "Situation: You want to know about any experience in your friend's life. Question: \"<strong>Did you ever try Guatemalan food?</strong>\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'Have you ever tried Guatemalan food?'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "Situation: You are asking about last week specifically. Question: \"<strong>Did you go to the community meeting last Tuesday?</strong>\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should use Have you ever." },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "hye-s2-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct verb form.",
          items: [
            {
              type: "text",
              label: "Have you ever ___ (see) a free concert in Boston?",
              expectedAnswers: ["seen"],
            },
            {
              type: "text",
              label: "___ you go to the school orientation last September? (Did / Have)",
              expectedAnswers: ["Did"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Yes I Have / No I Haven't
    // =========================================================================
    {
      id: "yes-i-have-no-i-havent",
      stepNumber: 3,
      title: "Yes, I have. No, I haven't.",
      icon: "✋",
      explanation: `
        ${sceneCard("sceneCommunityCenter", "East Boston Community Center, Saturday morning. Volunteers arrive for orientation.", "amber")}

        ${dialogue([
          { speaker: "Fatima", avatar: "👩🏾", text: "<strong>Have</strong> you ever <strong>volunteered</strong> with youth programs before?", side: "left", tone: "amber" },
          { speaker: "Omar", avatar: "🧑🏽", text: "Yes, I <strong>have</strong>. I <strong>worked</strong> with kids at a summer camp in 2021.", side: "right", tone: "sage" },
          { speaker: "Fatima", avatar: "👩🏾", text: "<strong>Have</strong> you ever <strong>done</strong> any food distribution work?", side: "left", tone: "amber" },
          { speaker: "Omar", avatar: "🧑🏽", text: "No, I <strong>haven't</strong>. But I am excited to learn.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Short answers:</strong> Always use <em>have</em> or <em>haven't</em> in your reply. Do not just say "yes" or "no."</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("yes", "amber")}
            <span><strong>Yes, I have.</strong> (Then add details with past simple: "I worked there in 2019.")</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("no", "amber")}
            <span><strong>No, I haven't.</strong> (You can add: "But I would like to try.")</span>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.93rem">After "Yes, I have" use Past Simple for the details:</p>
          <p style="margin: 0; font-size: 0.93rem">"Have you ever <strong>used</strong> the food pantry?" <br>"Yes, I <strong>have</strong>. I <strong>went</strong> there last winter."</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("example", "amber")}
            <span><em>"Have you ever <strong>taken</strong> a citizenship class?" / "Yes, I <strong>have</strong>. I <strong>took</strong> one at Bunker Hill two years ago."</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("example", "amber")}
            <span><em>"Have you ever <strong>called</strong> 311?" / "No, I <strong>haven't</strong>. What is it for?"</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hye-s3-ex1",
          title: "Choose the correct short answer",
          instructions: "Pick the best reply to each question.",
          items: [
            {
              type: "radio",
              label: "\"Have you ever volunteered at a school?\" (She has, in 2022.)",
              options: [
                { value: "a", label: "Yes, I volunteered." },
                { value: "b", label: "Yes, I have. I helped at an elementary school in 2022." },
                { value: "c", label: "Yes, I was volunteering." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Have you ever used the MBTA app?\" (He hasn't.)",
              options: [
                { value: "a", label: "No, I didn't." },
                { value: "b", label: "No, I don't." },
                { value: "c", label: "No, I haven't." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "hye-s3-ex2",
          title: "Build the answer",
          instructions: "Unscramble the words to make a correct short answer with a detail.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble: (answering yes, with a detail about last year)",
              words: ["Yes,", "I", "have.", "I", "went", "to", "a", "health", "fair", "last", "year."],
              correctAnswer: "Yes, I have. I went to a health fair last year.",
            },
          ],
        },
        {
          id: "hye-s3-ex3",
          title: "Write the reply",
          instructions: "Fill in the blank to complete the short answer.",
          items: [
            {
              type: "text",
              label: "\"Have you ever been to a community garden?\" \"Yes, I ___.\"",
              expectedAnswers: ["have"],
            },
            {
              type: "text",
              label: "\"Have you ever called your city councilor?\" \"No, I ___.\"",
              expectedAnswers: ["haven't"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Real Practice: Your Community, Your Experiences
    // =========================================================================
    {
      id: "real-practice-your-community",
      stepNumber: 4,
      title: "Real Practice: Your Community",
      icon: "🏘️",
      explanation: `
        ${sceneCard("sceneVolunteering", "East Boston Community Center, volunteer orientation sign-in table.", "sage")}

        ${dialogue([
          { speaker: "Coordinator", avatar: "👩🏾", text: "<strong>Have</strong> you ever <strong>attended</strong> a neighborhood meeting?", side: "left", tone: "sage" },
          { speaker: "Minh", avatar: "🧑🏽", text: "Yes, I <strong>have</strong>. I <strong>went</strong> to one about the new bus route last spring.", side: "right", tone: "terracotta" },
          { speaker: "Coordinator", avatar: "👩🏾", text: "<strong>Have</strong> you ever <strong>done</strong> translation work for your community?", side: "left", tone: "sage" },
          { speaker: "Minh", avatar: "🧑🏽", text: "No, I <strong>haven't</strong>. But I speak Vietnamese and English, so I would love to help.", side: "right", tone: "terracotta" },
        ])}

        <div style="padding: 0.85rem 1rem; background: rgba(106,141,115,0.08); border-left: 3px solid #6a8d73; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700">Common East Boston community questions:</p>
          <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.8; font-size: 0.95rem">
            <li>Have you ever <strong>taken</strong> the Blue Line?</li>
            <li>Have you ever <strong>been</strong> to a free health clinic?</li>
            <li>Have you ever <strong>used</strong> the food pantry on Maverick Street?</li>
            <li>Have you ever <strong>signed</strong> a petition?</li>
            <li>Have you ever <strong>attended</strong> an ESL class before this one?</li>
            <li>Have you ever <strong>called</strong> 311 to report a problem?</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "hye-s4-ex1",
          title: "Error correction",
          instructions: "One sentence is wrong. Choose the corrected version.",
          items: [
            {
              type: "radio",
              label: "\"Have you ever went to a community meeting?\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "Have you ever gone to a community meeting? (V3 = gone, not went)" },
                { value: "c", label: "Did you ever gone to a community meeting?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Did she ever volunteer at the library?\"",
              options: [
                { value: "a", label: "Correct as is. Past Simple is fine for a general experience question too." },
                { value: "b", label: "Not correct. Should be: Has she ever volunteered at the library?" },
                { value: "c", label: "Not correct. Should be: Did she ever volunteering at the library?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hye-s4-ex2",
          title: "Past Simple or Present Perfect?",
          instructions: "Choose the correct tense for each sentence.",
          items: [
            {
              type: "radio",
              label: "Minh ___ a citizenship class two years ago.",
              options: [
                { value: "took", label: "took (past simple. specific time: two years ago)" },
                { value: "has taken", label: "has taken (present perfect)" },
              ],
              expectedAnswer: "took",
            },
            {
              type: "radio",
              label: "___ you ever ___ the East Boston Greenway? (Use the correct form.)",
              options: [
                { value: "a", label: "Did you ever walk. Past Simple" },
                { value: "b", label: "Have you ever walked. Present Perfect" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hye-s4-ex3",
          title: "Build a question",
          instructions: "Unscramble to make a correct question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Have", "you", "ever", "signed", "a", "petition", "in", "East", "Boston"],
              correctAnswer: "Have you ever signed a petition in East Boston",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Has", "she", "ever", "been", "to", "a", "free", "health", "clinic"],
              correctAnswer: "Has she ever been to a free health clinic",
            },
          ],
        },
        {
          id: "hye-s4-ex4",
          title: "Fill in the blank",
          instructions: "Write the correct V3 form of the verb.",
          items: [
            {
              type: "text",
              label: "Have you ever ___ (speak) at a community meeting?",
              expectedAnswers: ["spoken"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation of all present perfect uses, open the <a href=\"/grammar-reader/present-perfect\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ. 10 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "hye-q1",
      question: "Your neighbor wants to know if you have any experience with the night class, at any time in your life. Which question should she ask?",
      options: [
        { value: "a", label: "Did you go to the night class last week?" },
        { value: "b", label: "Have you ever taken the night class?" },
        { value: "c", label: "Do you take the night class?" },
      ],
      correctAnswer: "b",
      explanation: "Have you ever is for life experience with no specific time.",
      topic: "present-perfect-experience",
      skill: "usage",
      skillTag: "ever-vs-past-simple",
      difficulty: "easy",
    },
    {
      id: "hye-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Have you ever ___ to a city council meeting?\" (V3 of 'be')",
      correctAnswer: "been",
      explanation: "After 'have you ever', always use V3. The V3 of 'be' is 'been'.",
      topic: "present-perfect-form",
      skill: "usage",
      skillTag: "v3-form-after-have",
      difficulty: "easy",
    },
    {
      id: "hye-q7",
      question: "\"Have you ever called 311?\" Omar says no. What is the best reply?",
      options: [
        { value: "a", label: "No, I didn't." },
        { value: "b", label: "No, I haven't." },
        { value: "c", label: "No, I don't." },
      ],
      correctAnswer: "b",
      explanation: "Short answer for Have you ever uses haven't (not didn't or don't).",
      topic: "present-perfect-short-answers",
      skill: "usage",
      skillTag: "short-answer-havent",
      difficulty: "easy",
    },
    {
      id: "hye-qws1",
      type: "word-scramble" as const,
      question: "Build the question by tapping the words in order.",
      words: ["Have", "you", "ever", "applied", "for", "a", "library", "card"],
      correctAnswer: "Have you ever applied for a library card",
      hint: "Have + you + ever + V3",
      explanation: "Have you ever + V3 asks about life experience with no specific time.",
      topic: "present-perfect-experience",
      skill: "usage",
      skillTag: "ever-question-form",
      difficulty: "medium",
    },
    {
      id: "hye-q8",
      question: "Minh says: \"I have went to a citizenship class two years ago.\" What is wrong?",
      options: [
        { value: "a", label: "Should be: I went to a citizenship class two years ago. (specific time needs Past Simple)" },
        { value: "b", label: "Should be: I have gone to a citizenship class two years ago." },
        { value: "c", label: "Nothing is wrong." },
      ],
      correctAnswer: "a",
      explanation: "Two years ago is a specific time, so Past Simple is required. Never use present perfect with a finished time expression.",
      topic: "past-simple-vs-present-perfect",
      skill: "error-detection",
      skillTag: "finished-time-forces-past-simple",
      difficulty: "hard",
    },
  ],
};
