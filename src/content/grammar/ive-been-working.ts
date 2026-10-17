import type { InteractiveGuideContent } from "@/types/activity";
import { iveBeenWorkingImages as img } from "@/data/ive-been-working-images.generated";
import { readingCard, timeline } from "@/content/grammar/_shared/guide-visuals";

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

export const iveBeenWorkingContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Introduce PPC form and meaning
    // =========================================================================
    {
      id: "six-days-a-week",
      title: "Six days a week",
      icon: "🏗️",
      tenseDiagram: {
        title: "Where it lives on the timeline",
        elements: [
          { id: "ppc-duration", type: "solid-to-now", zone: "past", position: 35, verbLabel: "have been working (→ NOW)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusStop", "Meridian Street bus stop, Tuesday morning in March, 6:30 AM.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara cleans patient rooms at the hospital. Her neighbor Rosa lives in the same building on Meridian Street, and they are classmates in the evening ESOL class. This morning they wait at the bus stop before work.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "You look tired, Amara.", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have been working</strong> six days a week since January. The hospital is short of cleaners.", side: "right", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "That’s rough. I <strong>have been studying</strong> every night for our ESOL project, so I’m tired too.", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "How long <strong>have</strong> you <strong>been doing</strong> that?", side: "right", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Three weeks. I’m hoping things slow down soon.", side: "left", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect Continuous</strong> = an action that started in the past and is still happening now. You want to say HOW LONG it has been going on.</p>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> have / has + been + verb-ing<br>
          <em>I <strong>have been working</strong> six days a week.</em><br>
          <em>She <strong>has been studying</strong> every night.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("I / we / they / you", "sage")}
            <span><em><strong>have been</strong> + verb-ing</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("he / she / it", "terracotta")}
            <span><em><strong>has been</strong> + verb-ing</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "six-days-ex1",
          title: "Choose the correct form",
          instructions: "Pick the right answer for each sentence.",
          items: [
            {
              type: "radio",
              label: "Amara works six days a week. Which sentence is correct?",
              options: [
                { value: "a", label: "She have been working six days a week." },
                { value: "b", label: "She has been working six days a week." },
                { value: "c", label: "She has been worked six days a week." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Rosa and her classmates all study every night. Which sentence is correct?",
              options: [
                { value: "a", label: "They has been studying every night." },
                { value: "b", label: "They have been study every night." },
                { value: "c", label: "They have been studying every night." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "six-days-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "been", "studying", "English", "for", "two", "years"],
              correctAnswer: "I have been studying English for two years",
            },
          ],
        },
        {
          id: "six-days-ex3",
          title: "Fill in the blank",
          instructions: "Write the three words that complete the Present Perfect Continuous.",
          items: [
            {
              type: "text",
              label: "Rosa studies every night. She ___ every night for three weeks. (has been studying)",
              expectedAnswers: ["has been studying"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — PPC with for / since
    // =========================================================================
    {
      id: "two-buses-since-february",
      title: "Two buses since the car broke down",
      icon: "🚌",
      tenseDiagram: {
        title: "Started in the past, still true now",
        elements: [
          { id: "ppc-start", type: "single-dot", zone: "past", position: 25, verbLabel: "unit moved (Feb)" },
          { id: "ppc-ongoing", type: "solid-to-now", zone: "past", position: 45, verbLabel: "have been taking (since Feb → NOW)" },
        ],
      },
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">It is Friday evening. Amara and Rosa wait for the bus home. Amara wants a job closer to home, so she writes her work story on a timeline. Look at it. Each label on the line shows <strong>how long</strong>.</p>

        ${timeline({
          kicker: "Amara's timeline",
          title: "Work, buses, and a job search",
          items: [
            { when: "3 yrs ago", text: "Amara starts cleaning patient rooms at the hospital." },
            { span: "<strong>for</strong> almost 3 years", accent: "sage" },
            { when: "January", text: "She starts working six days a week.", accent: "blue" },
            { span: "<strong>since</strong> January", accent: "blue" },
            { when: "February", text: "The hospital moves her unit. Now she takes two buses home.", accent: "amber" },
            { span: "<strong>since</strong> February", accent: "amber" },
            { when: "3 weeks ago", text: "She starts looking for a job closer to home.", accent: "terracotta" },
            { span: "<strong>for</strong> 3 weeks", accent: "terracotta" },
            { when: "Now", text: "Job fair tomorrow at the community school!", accent: "sage" },
          ],
          note: "Everything on this line started in the past and is still true now.",
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>for</strong> with a length of time. Use <strong>since</strong> with a starting point.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>I have been looking for a job <strong>for three weeks</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>He has been working here <strong>for five years</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.07); border-radius: 0.4rem">
            ${labelPill("since", "blue")}
            <span><em>I have been taking two buses <strong>since February</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.07); border-radius: 0.4rem">
            ${labelPill("since", "blue")}
            <span><em>She has been saving money <strong>since she started this job</strong>.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "buses-ex1",
          title: "For or since?",
          instructions: "Choose the right word for each sentence.",
          items: [
            {
              type: "radio",
              label: "Look at Amara's timeline. Which sentence is true?",
              options: [
                { value: "a", label: "She has been looking for a new job since February." },
                { value: "b", label: "She has been looking for a new job for three weeks." },
                { value: "c", label: "She has been cleaning at the hospital for one month." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the timeline. Amara has been working six days a week ___ January.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "since",
            },
          ],
        },
        {
          id: "buses-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Amara", "has", "been", "taking", "two", "buses", "since", "February"],
              correctAnswer: "Amara has been taking two buses since February",
            },
          ],
        },
        {
          id: "buses-ex3",
          title: "Fill in the blank",
          instructions: "Read the timeline again. Write the answer.",
          items: [
            {
              type: "text",
              label: "Look at the timeline. How many weeks has Amara been looking for a closer job? (a number)",
              expectedAnswers: ["3", "three"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Questions and short answers
    // =========================================================================
    {
      id: "how-long-have-you-been",
      title: "How long have you been working here?",
      icon: "💬",
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">At the job fair, Jennifer, the HR manager for a hotel, invites Amara to an interview on Monday. On the bus home, Amara reads about a woman who never stops working. Read it. Then notice the <strong>How long</strong> question at the end.</p>

        ${readingCard({
          kicker: "Famous person",
          title: "Dolores Huerta: Still Working",
          photo: {
            url: "/images/guide-people/dolores-huerta.jpg",
            alt: "Dolores Huerta smiles during a talk at the LBJ Presidential Library, 2019",
            credit: "Jay Godwin, LBJ Library, 2019, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Dolores_Huerta_2019_cropped.jpg",
          },
          paragraphs: [
            "Dolores Huerta was born in 1930 in Dawson, New Mexico. She was a teacher, and she said she could not stand to see kids come to class hungry. In 1960, she started the Agricultural Workers Association. In 1962, she and César Chávez started the National Farm Workers Association. In 2012, President Obama gave her the Presidential Medal of Freedom.",
            "Dolores Huerta is 96 years old now, and she is still busy. She <strong>has been working</strong> for workers' rights <strong>since</strong> the 1950s. She <strong>has been traveling</strong> and speaking to students, and she is the president of the Dolores Huerta Foundation. <strong>How long has she been working</strong> for workers? For more than 60 years!",
          ],
          sources: [
            { name: "Dolores Huerta Foundation", url: "https://doloreshuerta.org/dolores-huerta/" },
            { name: "National Park Service: Dolores Huerta", url: "https://www.nps.gov/people/dolores-huerta.htm" },
          ],
          accent: "amber",
        })}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Question form:</strong> How long + <em>have / has</em> + subject + <em>been</em> + verb-ing?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>have</strong> you <strong>been working</strong> here?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>has</strong> she <strong>been living</strong> in East Boston?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("yes/no", "sage")}
            <span><em><strong>Have</strong> you <strong>been studying</strong> English? Yes, I have. / No, I haven't.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "how-long-ex1",
          title: "Choose the correct question",
          instructions: "Pick the sentence that is correct.",
          items: [
            {
              type: "radio",
              label: "Which question is correct?",
              options: [
                { value: "a", label: "How long you have been living in Boston?" },
                { value: "b", label: "How long have you been living in Boston?" },
                { value: "c", label: "How long have you been live in Boston?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Amara asks Rosa about Dolores Huerta. Which question is correct?",
              options: [
                { value: "a", label: "How long has she been help workers?" },
                { value: "b", label: "How long she has been helping workers?" },
                { value: "c", label: "How long has she been helping workers?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Read about Dolores Huerta. Has she been speaking to students?",
              options: [
                { value: "a", label: "Yes, she has." },
                { value: "b", label: "No, she hasn't." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Read about Dolores Huerta. Which sentence is true?",
              options: [
                { value: "a", label: "Dolores Huerta has been helping workers for about six years." },
                { value: "b", label: "Dolores Huerta has been helping workers for more than sixty years." },
                { value: "c", label: "Dolores Huerta has been helping workers for about sixteen years." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "how-long-ex2",
          title: "Unscramble the question",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "long", "have", "you", "been", "saving", "for", "a", "car"],
              correctAnswer: "How long have you been saving for a car",
            },
          ],
        },
        {
          id: "how-long-ex3",
          title: "Fill in the blank",
          instructions: "Write the missing two words in this question.",
          items: [
            {
              type: "text",
              label: "How long ___ Dolores Huerta ___ working for workers' rights? (has ... been)",
              expectedAnswers: ["has been", "has / been"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — PPC vs. Present Perfect contrast
    // =========================================================================
    {
      id: "still-going-or-done",
      title: "Still going or already done?",
      icon: "⚖️",
      explanation: `
        ${sceneCard("sceneHotel", "Hotel hallway, third floor. Amara’s first morning at the hotel.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Jennifer liked Amara's interview, and Amara got the job. Today is her first morning at the hotel. Marta is a housekeeper who has worked there for four years, and Jennifer asked her to train Amara. They stop in the hallway for a minute.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have cleaned</strong> six rooms already. The third floor is done.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "Good work. I <strong>have been training</strong> new people for three hours. I haven't had a break yet.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "How long <strong>have</strong> you <strong>been working</strong> here?", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "Four years. Jennifer told me you have a lot of experience.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Almost three years at the hospital. I hope it helps here.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "It will. After lunch, you can do the fourth floor by yourself.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect</strong> (have + V3) = the action is finished. You care about the result.<br>
          <strong>Present Perfect Continuous</strong> (have been + verb-ing) = the action is still happening. You care about how long.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>I <strong>have cleaned</strong> six rooms. (done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("still happening", "blue")}
            <span><em>I <strong>have been training</strong> new people for three hours. (not done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>She <strong>has saved</strong> enough for the bus pass. (done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("still happening", "blue")}
            <span><em>She <strong>has been saving</strong> since January. (still going)</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "contrast-ex1",
          title: "Finished or still happening?",
          instructions: "Choose Present Perfect or Present Perfect Continuous based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Amara finished cleaning all six rooms. Which sentence fits?",
              options: [
                { value: "a", label: "She has been cleaning six rooms." },
                { value: "b", label: "She has cleaned six rooms." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Marta started training new people three hours ago and she is still training. Which sentence fits?",
              options: [
                { value: "a", label: "She has trained new people for three hours." },
                { value: "b", label: "She has been training new people for three hours." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"She <strong>has been saved</strong> enough money to move.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Saving is finished, so use 'has saved.'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "contrast-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Marta", "has", "been", "working", "at", "the", "hotel", "for", "four", "years"],
              correctAnswer: "Marta has been working at the hotel for four years",
            },
          ],
        },
        {
          id: "contrast-ex3",
          title: "Fill in the blank",
          instructions: "Write the three words that complete the sentence.",
          items: [
            {
              type: "text",
              label: "It is 11:00. Amara started cleaning rooms at 8:00 and she is still cleaning. She ___ rooms for three hours. (has been cleaning)",
              expectedAnswers: ["has been cleaning"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/present-perfect-continuous\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Continuous Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "ive-been-working-q1",
      question: "Amara works six days a week and is still working that schedule now. Which sentence is correct?",
      options: [
        { value: "a", label: "She has worked six days a week since January." },
        { value: "b", label: "She has been working six days a week since January." },
        { value: "c", label: "She is working six days a week since January." },
      ],
      correctAnswer: "b",
      explanation: "Present Perfect Continuous (has been working) is used for an ongoing action that started in the past and is still happening now.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-ongoing-action",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q3",
      question: "Rosa asks Amara a question about her job. Which question is correct?",
      options: [
        { value: "a", label: "How long you have been working the day shift?" },
        { value: "b", label: "How long have you been working the day shift?" },
        { value: "c", label: "How long have you been work the day shift?" },
      ],
      correctAnswer: "b",
      explanation: "In PPC questions, the word order is: How long + have/has + subject + been + verb-ing.",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "ppc-question-word-order",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She has been ___ money for months.\" (Present Perfect Continuous: verb-ing after 'has been'.)",
      correctAnswer: "saving",
      explanation: "After 'has been,' always use the -ing form of the verb. 'Has been saving' = the action started in the past and is still continuing.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-verb-ing-form",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q6",
      question: "Which sentence has a grammar error?",
      options: [
        { value: "a", label: "She has been working at the hotel for two years." },
        { value: "b", label: "How long have you been waiting for the bus?" },
        { value: "c", label: "He have been saving money since January." },
      ],
      correctAnswer: "c",
      explanation: "With 'he,' use 'has been,' not 'have been.' The correct sentence is: He has been saving money since January.",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "has-vs-have-been",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-qws1",
      type: "word-scramble" as const,
      question: "Rosa asks Amara about her work at the hospital. Put the words in order.",
      words: ["How", "long", "have", "you", "been", "cleaning", "patient", "rooms"],
      correctAnswer: "How long have you been cleaning patient rooms",
      hint: "How long + have/has + subject + been + verb-ing",
      explanation: "PPC questions follow: How long + have/has + subject + been + verb-ing?",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-question-word-order",
      difficulty: "medium",
    },
  ],
};
