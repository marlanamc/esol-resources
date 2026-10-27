import type { InteractiveGuideContent } from "@/types/activity";
import { checklist, readingCard, scheduleChart } from "@/content/grammar/_shared/guide-visuals";
import { enjoyDoingWantToDoImages as img } from "@/data/enjoy-doing-want-to-do-images.generated";

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
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
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

export const enjoyDoingWantToDoContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — "I'm Tired of Bending All Day"
    // =========================================================================
    {
      id: "gerunds-after-verbs",
      title: "\"I'm Tired of Bending All Day\"",
      explanation: `
        <p><strong>Bring back:</strong> Bring back: good at + -ing (W10) and need to + base verb (W18). Keep workplace phrases in short sentences: I enjoy helping out. I want to find out more.</p>

        ${sceneCard("sceneHotelCart", "East Boston. End of the afternoon shift. Tuesday.", "terracotta")}

        ${dialogue([
          { speaker: "Elena", avatar: "👩🏽", text: "I <strong>enjoy talking</strong> to the guests, but I hate how my back feels by 4 PM.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "I know. I've been <strong>avoiding lifting</strong> the heavy carts since I started. My shoulder can't take it.", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏽", text: "I <strong>keep thinking</strong> about leaving, but I haven't said anything yet.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "Are you going to stay through May?", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏽", text: "Probably. I can’t quit yet, but I <strong>want to look</strong> for something else.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Some verbs are always followed by a gerund (<strong>verb + -ing</strong>). You cannot use an infinitive after them.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("enjoy", "terracotta")}
            <span><em>She <strong>enjoys talking</strong> to guests.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("avoid", "terracotta")}
            <span><em>Amara <strong>avoids lifting</strong> the heavy carts.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("keep", "terracotta")}
            <span><em>Elena <strong>keeps thinking</strong> about leaving.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finish", "terracotta")}
            <span><em>She plans to <strong>finish working</strong> through May.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("don't mind", "terracotta")}
            <span><em>She <strong>doesn't mind looking</strong> around for other jobs.</em></span>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Common mistake:</strong><br>
          <span style="color: #ef4444">✗</span> "She enjoys <strong>to talk</strong> to guests."<br>
          <span style="color: #059669">✓</span> "She enjoys <strong>talking</strong> to guests."</p>
        </div>
      `,
      exercises: [
        {
          id: "ger-s1-ex1",
          title: "Choose the correct form",
          instructions: "Pick the answer that sounds right after the verb.",
          items: [
            {
              type: "radio",
              label: "Elena <strong>enjoys</strong> ___ to the guests every day.",
              options: [
                { value: "a", label: "to talk" },
                { value: "b", label: "talking" },
                { value: "c", label: "talk" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Amara <strong>avoids</strong> ___ the heavy laundry carts because of her shoulder.",
              options: [
                { value: "a", label: "to lift" },
                { value: "b", label: "lifting" },
                { value: "c", label: "lift" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Elena <strong>keeps</strong> ___ about changing jobs.",
              options: [
                { value: "a", label: "thinking" },
                { value: "b", label: "to think" },
                { value: "c", label: "think" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "ger-s1-ex2",
          title: "Spot the error",
          instructions: "Which sentence has a mistake?",
          items: [
            {
              type: "radio",
              label: "Which sentence is NOT correct?",
              options: [
                { value: "a", label: "She enjoys working the morning shift." },
                { value: "b", label: "She enjoys to work the morning shift." },
                { value: "c", label: "She doesn't mind working late on Fridays." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "ger-s1-ex3",
          title: "Fill in the blank",
          instructions: "Write the -ing form of the verb.",
          items: [
            {
              type: "text",
              label: "Amara avoids ___ (lift) the heavy carts.",
              expectedAnswers: ["lifting"],
            },
            {
              type: "text",
              label: "Elena keeps ___ (think) about warehouse work.",
              expectedAnswers: ["thinking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — "I Want to Try Something New"
    // =========================================================================
    {
      id: "infinitives-after-verbs",
      title: "\"I Want to Try Something New\"",
      explanation: `
        <p style="margin-bottom: 1rem">Elena rides the 116 bus home with her cousin Bruno. He works at a warehouse and says the pay is better there. That night, Elena writes her plan on a list.</p>

        ${checklist({
          kicker: "Checklist",
          title: "Elena's plan",
          items: [
            { text: "I <strong>decided to stay</strong> at the hotel through May.", done: true },
            { text: "I <strong>asked</strong> Bruno about the warehouse pay.", done: true },
            { text: "I <strong>need to save</strong> money for boots and gear.", done: false },
            { text: "I <strong>plan to apply</strong> for warehouse jobs in June.", done: false },
            { text: "I <strong>would like to talk</strong> to Bruno's contact.", done: false },
          ],
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Some verbs are always followed by an infinitive (<strong>to + base verb</strong>). You cannot use a gerund after them.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("want", "sage")}
            <span><em>She <strong>wants to try</strong> warehouse work.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("need", "sage")}
            <span><em>She <strong>needs to save</strong> money first.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("decide", "sage")}
            <span><em>She <strong>decided to stay</strong> through May.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("plan", "sage")}
            <span><em>She <strong>plans to look</strong> for a new job after May.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("would like", "sage")}
            <span><em>She <strong>would like to talk</strong> to someone at the warehouse.</em></span>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Common mistake:</strong><br>
          <span style="color: #ef4444">✗</span> "She wants <strong>trying</strong> warehouse work."<br>
          <span style="color: #059669">✓</span> "She wants <strong>to try</strong> warehouse work."</p>
        </div>
      `,
      exercises: [
        {
          id: "inf-s2-ex1",
          title: "Choose the correct form",
          instructions: "Pick the infinitive form that fits.",
          items: [
            {
              type: "radio",
              label: "Elena <strong>wants</strong> ___ warehouse work after May.",
              options: [
                { value: "a", label: "trying" },
                { value: "b", label: "to try" },
                { value: "c", label: "try" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Elena <strong>decided</strong> ___ at the hotel through May.",
              options: [
                { value: "a", label: "staying" },
                { value: "b", label: "to stay" },
                { value: "c", label: "stay" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "inf-s2-ex4",
          title: "Look at Elena's plan",
          instructions: "Read the checklist above. Then answer.",
          items: [
            {
              type: "radio",
              label: "Look at Elena's plan. What has she already done?",
              options: [
                { value: "a", label: "She chose how long to keep her hotel job." },
                { value: "b", label: "She applied for warehouse jobs." },
                { value: "c", label: "She saved money for boots." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Look at Elena's plan. How many things does she still need to do? (write a number)",
              expectedAnswers: ["3", "three"],
            },
          ],
        },
        {
          id: "inf-s2-ex2",
          title: "Spot the error",
          instructions: "Which sentence has a mistake?",
          items: [
            {
              type: "radio",
              label: "Which sentence is NOT correct?",
              options: [
                { value: "a", label: "She needs to save money before she quits." },
                { value: "b", label: "She needs saving money before she quits." },
                { value: "c", label: "She plans to look for warehouse work in June." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "inf-s2-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct infinitive form (to + verb).",
          items: [
            {
              type: "text",
              label: "Elena plans ___ (look) for a new job after May.",
              expectedAnswers: ["to look"],
            },
            {
              type: "text",
              label: "She would like ___ (talk) to someone at the warehouse.",
              expectedAnswers: ["to talk"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Gerund or Infinitive? The Two Lists
    // =========================================================================
    {
      id: "two-lists",
      title: "Gerund or Infinitive? The Two Lists",
      explanation: `
        <p style="margin-bottom: 1rem">Thursday morning, Elena stops at the East Boston Career Center before her shift. While she waits for a job-skills form, she reads a short story about a woman who spoke up for her family.</p>

        ${readingCard({
          kicker: "Did you know?",
          title: "Sylvia Mendez",
          accent: "amber",
          photo: {
            url: "/images/guide-people/sylvia-mendez.jpg",
            alt: "Sylvia Mendez smiles as she speaks at a podium, 2014",
            credit: "USDA / Bob Nichols, 2014, CC BY 2.0",
            creditUrl: "https://commons.wikimedia.org/wiki/File:20140924-DM-RBN-0574.jpg",
          },
          paragraphs: [
            "When Sylvia Mendez was eight years old, her parents <strong>tried to enroll</strong> her at a school in California. The school was for white children, so she was sent to the school for Mexican children. Her family went to court. In 1946, a federal judge ruled for them, and a higher court agreed a year later.",
            "The case <strong>helped to end</strong> school segregation in California. Years later, Sylvia <strong>enjoyed talking</strong> to students about it. She traveled around the country, <strong>giving</strong> speeches about the value of a good education. In 2011, she received the Presidential Medal of Freedom.",
          ],
          sources: [
            { name: "The White House (Obama archives): 2010 Presidential Medal of Freedom recipient Sylvia Mendez", url: "https://obamawhitehouse.archives.gov/node/26318" },
            { name: "U.S. Courts: Background, Mendez v. Westminster Re-Enactment", url: "https://www.uscourts.gov/about-federal-courts/educational-resources/educational-activities/mendez-v-westminster-re-enactment/background-mendez-v-westminster-re-enactment" },
          ],
        })}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">The key question: <strong>which verb comes first?</strong> Check the list. Some verbs always take a gerund. Some always take an infinitive.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0">
          <div style="padding: 0.9rem 1rem; border-radius: 0.5rem; background: rgba(176,87,64,0.06); border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem">Gerund (verb + -ing)</div>
            <div style="display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.95rem">
              <span><strong>enjoy</strong> doing</span>
              <span><strong>avoid</strong> doing</span>
              <span><strong>keep</strong> doing</span>
              <span><strong>finish</strong> doing</span>
              <span><strong>mind</strong> doing</span>
              <span><strong>quit</strong> doing</span>
              <span><strong>consider</strong> doing</span>
            </div>
          </div>
          <div style="padding: 0.9rem 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.06); border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem">Infinitive (to + verb)</div>
            <div style="display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.95rem">
              <span><strong>want</strong> to do</span>
              <span><strong>need</strong> to do</span>
              <span><strong>decide</strong> to do</span>
              <span><strong>plan</strong> to do</span>
              <span><strong>hope</strong> to do</span>
              <span><strong>would like</strong> to do</span>
              <span><strong>agree</strong> to do</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(0,0,0,0.03)">
          <p style="margin: 0 0 0.4rem 0; font-weight: 600">From Elena's form:</p>
          <p style="margin: 0.25rem 0"><em>"I <strong>enjoy talking</strong> to guests and <strong>avoid lifting</strong> heavy equipment."</em></p>
          <p style="margin: 0.25rem 0"><em>"I <strong>want to try</strong> warehouse work and <strong>plan to apply</strong> in June."</em></p>
        </div>
      `,
      exercises: [
        {
          id: "tl-s3-ex1",
          title: "Which column?",
          instructions: "Does this verb take a gerund or an infinitive?",
          items: [
            {
              type: "radio",
              label: "She <strong>considers</strong> ___.",
              options: [
                { value: "a", label: "leaving (gerund)" },
                { value: "b", label: "to leave (infinitive)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "She <strong>hopes</strong> ___.",
              options: [
                { value: "a", label: "finding (gerund)" },
                { value: "b", label: "to find (infinitive)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "She <strong>quit</strong> ___.",
              options: [
                { value: "a", label: "smoking (gerund)" },
                { value: "b", label: "to smoke (infinitive)" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "tl-s3-ex4",
          title: "Read about Sylvia Mendez",
          instructions: "Read the story above. Then answer.",
          items: [
            {
              type: "radio",
              label: "Her parents tried to enroll Sylvia at a school. What happened?",
              options: [
                { value: "a", label: "The school was full, so she waited a year." },
                { value: "b", label: "She was sent to a different school for Mexican children." },
                { value: "c", label: "She went to class, but she left early." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "How old was Sylvia when her parents tried to enroll her? (write a number)",
              expectedAnswers: ["8", "eight"],
            },
            {
              type: "radio",
              label: "Sylvia traveled the country, ___ speeches about education.",
              options: [
                { value: "a", label: "to give" },
                { value: "b", label: "giving" },
                { value: "c", label: "give" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "tl-s3-ex2",
          title: "Build the sentence",
          instructions: "Unscramble Elena's words from the career form.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "enjoy", "talking", "to", "guests", "and", "helping", "with", "directions"],
              correctAnswer: "I enjoy talking to guests and helping with directions",
            },
          ],
        },
        {
          id: "tl-s3-ex3",
          title: "Fill in Elena's form",
          instructions: "Write the correct form of the verb.",
          items: [
            {
              type: "text",
              label: "I avoid ___ (lift) heavy equipment because of my back.",
              expectedAnswers: ["lifting"],
            },
            {
              type: "text",
              label: "I plan ___ (apply) for warehouse work in June.",
              expectedAnswers: ["to apply"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Both Are Right: start, like, love, hate
    // =========================================================================
    {
      id: "both-are-right",
      title: "Both Are Right: start, like, love, hate",
      explanation: `
        <p style="margin-bottom: 1rem">In the hotel break room, Kevin, her supervisor, posts next week's schedule. Elena has the early shift. She tells Kevin that she likes working mornings, but she hates rushing to pickup on Tuesdays.</p>

        ${scheduleChart({
          kicker: "Schedule",
          title: "Elena's week",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          rows: [
            { label: "🏨 Work", cells: [{ text: "6-2" }, { text: "6-3", accent: "amber" }, { text: "6-2" }, { text: "6-2" }, { text: "6-2" }] },
            { label: "🎒 Pickup", cells: [{ text: "3 pm", accent: "sage" }, { text: "3:15", accent: "amber" }, { text: "3 pm", accent: "sage" }, { text: "3 pm", accent: "sage" }, { text: "3 pm", accent: "sage" }] },
            { label: "📚 Class", cells: [null, { text: "6 pm", accent: "blue" }, null, null, null] },
          ],
          note: "Tuesday is the tight day: work ends at 3, and pickup is at 3:15.",
        })}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">A few verbs can take either a gerund or an infinitive. The meaning is the same at this level. Both are correct.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("like", "blue")}
            <span><em>She <strong>likes working</strong> mornings. &nbsp;=&nbsp; She <strong>likes to work</strong> mornings.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("hate", "blue")}
            <span><em>She <strong>hates staying</strong> late. &nbsp;=&nbsp; She <strong>hates to stay</strong> late.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("start", "blue")}
            <span><em>She <strong>started looking</strong> for jobs. &nbsp;=&nbsp; She <strong>started to look</strong> for jobs.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("love", "blue")}
            <span><em>Kevin <strong>loves leaving</strong> on time. &nbsp;=&nbsp; Kevin <strong>loves to leave</strong> on time.</em></span>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Remember:</strong> This is not true for most verbs. <em>Enjoy, avoid, keep</em> only take gerunds. <em>Want, need, decide</em> only take infinitives. The "both are fine" group is small.</p>
        </div>
      `,
      exercises: [
        {
          id: "bar-s4-ex1",
          title: "Both correct or only one?",
          instructions: "Decide if both forms work or only one is right.",
          items: [
            {
              type: "radio",
              label: "Kevin ___ on time every day.",
              options: [
                { value: "a", label: "loves / loves to leave (both correct)" },
                { value: "b", label: "only loves leaving (gerund only)" },
                { value: "c", label: "only loves to leave (infinitive only)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Elena ___ the top-floor rooms.",
              options: [
                { value: "a", label: "enjoys to clean (infinitive only)" },
                { value: "b", label: "enjoys cleaning (gerund only, enjoy never takes infinitive)" },
                { value: "c", label: "both are correct" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "bar-s4-ex4",
          title: "Look at Elena's week",
          instructions: "Read the schedule above. Then answer.",
          items: [
            {
              type: "radio",
              label: "Look at Elena's week. Which day is the tight day?",
              options: [
                { value: "a", label: "Monday" },
                { value: "b", label: "Tuesday" },
                { value: "c", label: "Friday" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Elena hates ___ (rush) to pickup on Tuesdays. (write the to + verb form)",
              expectedAnswers: ["to rush"],
            },
          ],
        },
        {
          id: "bar-s4-ex2",
          title: "Build the sentence",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Kevin", "hates", "staying", "past", "5", "on", "weekdays"],
              correctAnswer: "Kevin hates staying past 5 on weekdays",
            },
          ],
        },
        {
          id: "bar-s4-ex3",
          title: "Fill in the blank",
          instructions: "Write the -ing form or the to + verb form. Either is correct for these verbs.",
          items: [
            {
              type: "text",
              label: "Elena likes ___ (work) the morning shift. (write the -ing form)",
              expectedAnswers: ["working"],
            },
            {
              type: "text",
              label: "She plans ___ (look) for new jobs in June. (write the to + verb form)",
              expectedAnswers: ["to look"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Putting It Together: Talking About Your Job Goals
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting It Together: Talking About Your Job Goals",
      explanation: `
        ${sceneCard("sceneClassroom", "East Boston Adult Learning Center. Tuesday evening, after class.", "terracotta")}

        <p style="margin-bottom: 0.75rem">After class, Elena stays behind to talk to Ms. Tran. She wants to practice saying out loud what she's been thinking about for months.</p>

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "Elena, you look distracted tonight. Everything okay?", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏽", text: "Sorry. I <strong>keep thinking</strong> about changing jobs. I <strong>want to try</strong> warehouse work, but I'm not ready to quit yet.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "What do you enjoy about your current job?", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏽", text: "I <strong>enjoy talking</strong> to the guests, and I <strong>like working</strong> early shifts. But I <strong>avoid lifting</strong> as much as I can.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "What are you planning for the spring?", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏽", text: "I <strong>decided to stay</strong> through May. Then I <strong>plan to apply</strong> somewhere new. My cousin said he can help.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 0.75rem 0 0.5rem 0">Ms. Tran says it sounds like a good plan. They practice how Elena can describe her experience in an interview.</p>

        <p style="margin: 0.75rem 0 0.5rem 0; font-size: 0.95rem; font-style: italic">The next day, Amara decided to ask Kevin for lighter carts until her shoulder heals. He agreed to pair her with a coworker for the heavy ones.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1.25rem 0 0.75rem 0">
          <p style="margin: 0 0 0.4rem 0; font-size: 1.05rem"><strong>The short version to remember:</strong></p>
          <p style="margin: 0.2rem 0"><strong>enjoy / avoid / keep / finish / mind</strong> + verb + <strong>-ing</strong></p>
          <p style="margin: 0.2rem 0"><strong>want / need / decide / plan / hope / would like</strong> + <strong>to</strong> + verb</p>
          <p style="margin: 0.2rem 0"><strong>like / love / hate / start</strong> + either form (both work)</p>
        </div>
      `,
      exercises: [
        {
          id: "pit-s5-ex1",
          title: "Elena practices for her interview",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "I <strong>enjoy</strong> ___ to guests and helping new staff learn the rooms.",
              options: [
                { value: "a", label: "talking" },
                { value: "b", label: "to talk" },
                { value: "c", label: "talk" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "I <strong>decided</strong> ___ after May because I need to save a little first.",
              options: [
                { value: "a", label: "leaving" },
                { value: "b", label: "to leave" },
                { value: "c", label: "leave" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "I <strong>plan</strong> ___ for warehouse jobs in June.",
              options: [
                { value: "a", label: "applying" },
                { value: "b", label: "to apply" },
                { value: "c", label: "apply" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "pit-s5-ex2",
          title: "Build the sentence",
          instructions: "Unscramble what Elena says to Ms. Tran.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "plan", "to", "apply", "for", "warehouse", "work", "in", "June"],
              correctAnswer: "I plan to apply for warehouse work in June",
            },
          ],
        },
        {
          id: "pit-s5-ex3",
          title: "Complete Elena's answers",
          instructions: "Write the correct form of the verb.",
          items: [
            {
              type: "text",
              label: "I enjoy ___ (talk) to guests at work.",
              expectedAnswers: ["talking"],
            },
            {
              type: "text",
              label: "I want ___ (try) warehouse work after May.",
              expectedAnswers: ["to try"],
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "edw-q1",
      question: "Elena says: 'I enjoy ___ to the guests.' Which form is correct?",
      options: [
        { value: "a", label: "to talk" },
        { value: "b", label: "talking" },
        { value: "c", label: "talk" },
      ],
      correctAnswer: "b",
      explanation: "Enjoy always takes a gerund (verb + -ing). You cannot say 'enjoy to talk'.",
      topic: "gerunds-after-verbs",
      skill: "usage",
      skillTag: "enjoy-gerund",
      difficulty: "easy",
    },
    {
      id: "edw-q2",
      question: "Elena says: 'I want ___ warehouse work.' Which form is correct?",
      options: [
        { value: "a", label: "trying" },
        { value: "b", label: "to try" },
        { value: "c", label: "try" },
      ],
      correctAnswer: "b",
      explanation: "Want always takes an infinitive (to + verb). You cannot say 'want trying'.",
      topic: "infinitives-after-verbs",
      skill: "usage",
      skillTag: "want-infinitive",
      difficulty: "easy",
    },
    {
      id: "edw-q4",
      question: "Which sentence has a mistake?",
      options: [
        { value: "a", label: "She plans to apply in June." },
        { value: "b", label: "She needs to save money first." },
        { value: "c", label: "She decided leaving after May." },
      ],
      correctAnswer: "c",
      explanation: "Decide takes an infinitive, not a gerund. Correct form: 'She decided to leave after May.'",
      topic: "infinitives-after-verbs",
      skill: "error-detection",
      skillTag: "decide-infinitive-error",
      difficulty: "easy",
    },
    {
      id: "edw-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She avoids ___ (lift) heavy things because of her shoulder.\" (Avoid + gerund.)",
      correctAnswer: "lifting",
      explanation: "Avoid always takes a gerund (verb + -ing). 'Avoids to lift' is a common error.",
      topic: "gerunds-after-verbs",
      skill: "usage",
      skillTag: "avoid-gerund",
      difficulty: "medium",
    },
    {
      id: "edw-qws1",
      type: "word-scramble" as const,
      question: "Marisol talks about her restaurant job and her goals. Put the words in order. (One verb needs a gerund, one needs an infinitive.)",
      words: ["She", "enjoys", "working", "and", "wants", "to", "learn"],
      correctAnswer: "She enjoys working and wants to learn",
      hint: "enjoy + -ing / want + to",
      explanation: "Enjoy takes a gerund (working). Want takes an infinitive (to learn). Both are used correctly here.",
      topic: "gerunds-and-infinitives",
      skill: "usage",
      skillTag: "mixed-gerund-infinitive",
      difficulty: "medium",
    },
  ],
};
