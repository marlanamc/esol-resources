import type { InteractiveGuideContent } from "@/types/activity";
import { whatAreYouGoodAtImages as img } from "@/data/what-are-you-good-at-images.generated";

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

export const whatAreYouGoodAtContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Before the Dinner Rush
    // =========================================================================
    {
      id: "at-the-restaurant",
      stepNumber: 1,
      title: "Before the Dinner Rush",
      icon: "🍽️",
      explanation: `
        ${sceneCard("sceneRestaurant", "East Boston, Thursday, 4 PM. Diego and Sarah prep in the kitchen before the dinner rush.", "terracotta")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">On Monday, a car almost hit a boy at the crosswalk on Saratoga Street, right by the school. Tonight at 7, the neighbors are having a meeting about it at the library. Diego is a line cook. His shift ends at 6:30, if the kitchen isn't too busy.</p>

        ${dialogue([
          { speaker: "Sarah", avatar: "👩🏻", text: "Are you going to the crosswalk meeting tonight? They need people to sign up for jobs.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "I have to. My son crosses there every day. I'm <strong>afraid of</strong> letting him go alone now.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "So what are you going to sign up for? What are you <strong>good at</strong>?", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "I'm <strong>good at</strong> cooking fast. I don't think that fixes traffic.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "Bring food. People stay longer when there's food.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "Ha. OK, but I'm more <strong>interested in</strong> getting a traffic light.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>The pattern:</strong> adjective + preposition + verb<strong>-ing</strong></p>
          <p style="margin: 0.4rem 0 0 0; font-size: 0.95rem">After words like <em>good at</em>, <em>interested in</em>, and <em>afraid of</em>, the next verb ends in <strong>-ing</strong>. This is called a gerund.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adjective + at", "terracotta")}
            <span>I'm <strong>good at</strong> cook<strong>ing</strong> fast.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adjective + in", "terracotta")}
            <span>I'm <strong>interested in</strong> gett<strong>ing</strong> a traffic light.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adjective + of", "terracotta")}
            <span>I'm <strong>afraid of</strong> lett<strong>ing</strong> him go alone.</span>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>Common pairs to learn:</strong>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; line-height: 1.8">
            <li>good <strong>at</strong> + -ing</li>
            <li>bad <strong>at</strong> + -ing</li>
            <li>interested <strong>in</strong> + -ing</li>
            <li>afraid <strong>of</strong> + -ing</li>
            <li>tired <strong>of</strong> + -ing</li>
            <li>worried <strong>about</strong> + -ing</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Exercise 1: Choose the correct preposition",
          instructions: "Pick the word that completes the sentence correctly.",
          items: [
            {
              type: "radio",
              label: "Diego is good ___ cooking fast.",
              options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "of", label: "of" },
              ],
              expectedAnswer: "at",
            },
            {
              type: "radio",
              label: "Sarah is interested ___ helping at the meeting.",
              options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "of", label: "of" },
              ],
              expectedAnswer: "in",
            },
            {
              type: "radio",
              label: "Diego is afraid ___ letting his son cross alone.",
              options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "of", label: "of" },
              ],
              expectedAnswer: "of",
            },
            {
              type: "radio",
              label: "\"I am good at cook.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'good at cooking'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Exercise 2: Complete the sentence",
          instructions: "Type the correct -ing form of the verb.",
          items: [
            {
              type: "text",
              label: "Sarah is good at ___ (clean) tables quickly.",
              expectedAnswers: ["cleaning"],
            },
            {
              type: "text",
              label: "Diego is interested in ___ (learn) who to call at City Hall.",
              expectedAnswers: ["learning"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Outside the Meeting
    // =========================================================================
    {
      id: "after-the-interview",
      stepNumber: 2,
      title: "Outside the Meeting",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneJobTalk", "Thursday, 6:50 PM. Marta and Bruno talk outside the library before the meeting.", "sage")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">Marta cleans rooms at a hotel. Bruno paints houses. They both came straight from work. The sign on the door says: <em>Saratoga Street Crosswalk Meeting, 7:00, Room B.</em> The first idea is a morning crossing watch: neighbors in orange vests who help kids cross from 7:30 to 8:00.</p>

        ${dialogue([
          { speaker: "Marta", avatar: "👩🏾", text: "I'm <strong>tired of</strong> looking for a safe place to cross with my kids. That corner is the only way.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Same. I want to sign up for the crossing watch on Tuesdays. I start work at nine.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "By yourself? Aren't you <strong>nervous about</strong> working that corner alone? Those drivers don't stop.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "A little. But my daughter is <strong>excited about</strong> seeing me in an orange vest.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "Put me down for Thursdays. Then you're not the only one in a vest.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">More adjective + preposition pairs. They all follow the same rule: add <strong>-ing</strong> after the preposition.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("excited about", "sage")}
            <span>His daughter is <strong>excited about</strong> see<strong>ing</strong> him in a vest.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("nervous about", "sage")}
            <span>He is <strong>nervous about</strong> work<strong>ing</strong> the corner alone.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("tired of", "sage")}
            <span>I am <strong>tired of</strong> look<strong>ing</strong> for a safe place to cross.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("proud of", "sage")}
            <span>They are <strong>proud of</strong> start<strong>ing</strong> the crossing watch.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Exercise 1: Choose the correct form",
          instructions: "Pick the answer that completes the sentence correctly.",
          items: [
            {
              type: "radio",
              label: "Marta is tired of ___ for a safe place to cross.",
              options: [
                { value: "looking", label: "looking" },
                { value: "look", label: "look" },
                { value: "looks", label: "looks" },
              ],
              expectedAnswer: "looking",
            },
            {
              type: "radio",
              label: "Bruno is nervous about ___ alone at the corner.",
              options: [
                { value: "working", label: "working" },
                { value: "work", label: "work" },
                { value: "to work", label: "to work" },
              ],
              expectedAnswer: "working",
            },
            {
              type: "radio",
              label: "\"She is excited about start the crossing watch.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'excited about starting'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Exercise 2: Build the sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["He", "is", "proud", "of", "learning", "English", "every", "day"],
              correctAnswer: "He is proud of learning English every day",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "am", "tired", "of", "standing", "all", "day"],
              correctAnswer: "I am tired of standing all day",
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Exercise 3: Complete the sentence",
          instructions: "Type the correct -ing form of the verb.",
          items: [
            {
              type: "text",
              label: "Bruno is nervous about ___ (work) the corner alone.",
              expectedAnswers: ["working"],
            },
            {
              type: "text",
              label: "Marta is tired of ___ (look) for a safe place to cross.",
              expectedAnswers: ["looking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Suggestions for the City
    // =========================================================================
    {
      id: "at-the-job-agency",
      stepNumber: 3,
      title: "Suggestions for the City",
      icon: "🗣️",
      explanation: `
        ${sceneCard("sceneCounselor", "Thursday, 7:30 PM, Room B. Ms. Patel writes down Diego's suggestions for the city.", "blue")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">Ms. Patel runs the neighborhood group. Next Tuesday, she takes a letter to the city's traffic office. Tonight, everyone gets to add a suggestion. Diego comes in late, still in his kitchen shoes, with a tray of empanadas.</p>

        ${dialogue([
          { speaker: "Ms. Patel", avatar: "👩‍💼", text: "Thank you <strong>for coming</strong>, Diego. And for the food. What should we ask the city for?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "👨🏽", text: "A real light, not just new paint. Paint is gone after one winter.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩‍💼", text: "Good. And we can show them how bad it is <strong>by sending</strong> photos of cars that don't stop.", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "👨🏽", text: "I walk my son there every day. I can take those. Can I also ask <strong>about getting</strong> a morning crossing guard?", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩‍💼", text: "Yes. Just don't leave <strong>without signing</strong> the letter. We need every name.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Prepositions also come after verbs and in phrases. Same rule: preposition + <strong>-ing</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("for + -ing", "blue")}
            <span>Thank you <strong>for com</strong><strong>ing</strong>.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("by + -ing", "blue")}
            <span>We can show them <strong>by send</strong><strong>ing</strong> photos.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("without + -ing", "blue")}
            <span>Don't leave <strong>without sign</strong><strong>ing</strong> the letter.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("about + -ing", "blue")}
            <span>I want to ask <strong>about get</strong><strong>ting</strong> a crossing guard.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Exercise 1: Correct form after the preposition",
          instructions: "Choose the correct form to complete each sentence.",
          items: [
            {
              type: "radio",
              label: "Marta got a seat in the front by ___ early.",
              options: [
                { value: "arriving", label: "arriving" },
                { value: "arrive", label: "arrive" },
                { value: "arrived", label: "arrived" },
              ],
              expectedAnswer: "arriving",
            },
            {
              type: "radio",
              label: "Don't sign the letter without ___ it first.",
              options: [
                { value: "reading", label: "reading" },
                { value: "read", label: "read" },
                { value: "to read", label: "to read" },
              ],
              expectedAnswer: "reading",
            },
            {
              type: "radio",
              label: "Thank you for ___ me with the letter.",
              options: [
                { value: "helping", label: "helping" },
                { value: "help", label: "help" },
                { value: "helped", label: "helped" },
              ],
              expectedAnswer: "helping",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Exercise 2: Complete the sentence",
          instructions: "Type the correct -ing form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "Ms. Patel says, \"The city listens to us. We get results by ___ (show) up every time.\"",
              expectedAnswers: ["showing"],
            },
            {
              type: "text",
              label: "Don't leave without ___ (ask) about the crossing watch schedule.",
              expectedAnswers: ["asking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. The Sign-Up Card
    // =========================================================================
    {
      id: "your-job-skills-form",
      stepNumber: 4,
      title: "The Sign-Up Card",
      icon: "✍️",
      explanation: `
        ${sceneCard("sceneApplication", "Thursday, 8:15 PM, the front desk of Room B. Amina fills out a sign-up card on a clipboard.", "amber")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">Before people leave, Kevin hands out sign-up cards. The card asks two questions: <em>What are you good at? What are you interested in doing?</em> Amina is a home health aide. Her shift starts at 6 tomorrow morning.</p>

        ${dialogue([
          { speaker: "Kevin", avatar: "🧑🏻", text: "This card asks what you're <strong>good at</strong>. Just write two or three things.", side: "left", tone: "amber" },
          { speaker: "Amina", avatar: "👩🏿", text: "I'm <strong>good at</strong> translat<strong>ing</strong>. Somali and Arabic. Does that help?", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "A lot. Half the families on that street can't read the letter in English.", side: "left", tone: "amber" },
          { speaker: "Amina", avatar: "👩🏿", text: "I can do it, but I'm <strong>worried about</strong> finish<strong>ing</strong> tonight. I work at six.", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Take it home. Bring it back Monday. The letter goes to the city Tuesday.", side: "left", tone: "amber" },
        ])}

        <p style="border-left: 4px solid currentColor; padding: 0.75rem 1rem; margin: 1rem 0; background: rgba(0,0,0,0.03); border-radius: 0.4rem; font-size: 0.95rem; line-height: 1.6">
          <strong>Two weeks later:</strong> The letter goes to the city with 214 names, in English, Spanish, Somali and Arabic. The city puts a flashing light at the Saratoga Street crosswalk. Diego's son walks to school by himself again. On Tuesdays, Bruno is at the corner in his orange vest.
        </p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>All the patterns together.</strong> The pattern is always the same: preposition + verb<strong>-ing</strong>.</p>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>Quick review:</strong>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; line-height: 1.9">
            <li>I am <strong>good at</strong> translat<strong>ing</strong>.</li>
            <li>Diego is <strong>interested in</strong> gett<strong>ing</strong> a traffic light.</li>
            <li>Marta is <strong>tired of</strong> look<strong>ing</strong> for a safe place to cross.</li>
            <li>Amina is <strong>worried about</strong> finish<strong>ing</strong> tonight.</li>
            <li>Thank you <strong>for com</strong><strong>ing</strong>.</li>
            <li>Don't leave <strong>without sign</strong><strong>ing</strong> the letter.</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Exercise 1: Error correction",
          instructions: "One sentence in each pair is wrong. Choose the correct one.",
          items: [
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "She is good at clean the floors." },
                { value: "b", label: "She is good at cleaning the floors." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "He is interested in to learn the city's rules." },
                { value: "b", label: "He is interested in learning the city's rules." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "Don't go without signing the form." },
                { value: "b", label: "Don't go without sign the form." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Exercise 2: Build a sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "am", "interested", "in", "learning", "office", "work"],
              correctAnswer: "I am interested in learning office work",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "is", "excited", "about", "starting", "the", "new", "job"],
              correctAnswer: "She is excited about starting the new job",
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Exercise 3: Complete the sentence",
          instructions: "Type the correct -ing form.",
          items: [
            {
              type: "text",
              label: "I am good at ___ (cook) fast.",
              expectedAnswers: ["cooking"],
            },
            {
              type: "text",
              label: "She is worried about ___ (make) a mistake.",
              expectedAnswers: ["making"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content:
          "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/gerunds-infinitives\" style=\"font-weight:700;text-decoration:underline\">Gerunds + Infinitives Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ. 10 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "good-at-q1",
      question: "Diego says, 'I am good ___ cooking fast.' Which word fits?",
      options: [
        { value: "a", label: "at" },
        { value: "b", label: "in" },
        { value: "c", label: "of" },
      ],
      correctAnswer: "a",
      explanation: "Good at + -ing is the fixed pattern. 'Good in' and 'good of' are not used this way.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "adjective-preposition-gerund",
      difficulty: "easy",
    },
    {
      id: "good-at-q2",
      question: "Marta says, 'I am tired of look for a safe place to cross.' What is wrong?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'look' should be 'looking'. A verb after a preposition needs -ing." },
        { value: "c", label: "'of' should be 'for'." },
      ],
      correctAnswer: "b",
      explanation: "After a preposition like 'of', the verb must be in -ing form: tired of looking.",
      topic: "gerunds-prepositions",
      skill: "error-detection",
      skillTag: "preposition-gerund-form",
      difficulty: "easy",
    },
    {
      id: "good-at-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Amina is interested ___ translating the letter.\" (Which preposition pairs with 'interested'?)",
      correctAnswer: "in",
      explanation: "The fixed phrase is 'interested in'. Always followed by -ing.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "interested-in-gerund",
      difficulty: "easy",
    },
    {
      id: "good-at-qws1",
      type: "word-scramble" as const,
      question: "Sarah asks Diego what he is good at. Put the words in order.",
      words: ["I", "am", "good", "at", "cooking", "fast"],
      correctAnswer: "I am good at cooking fast",
      hint: "good at + -ing",
      explanation: "Good at + -ing. The verb after 'at' must end in -ing.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "adjective-preposition-gerund",
      difficulty: "medium",
    },
    {
      id: "good-at-q7",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "Don't sign without read the letter." },
        { value: "b", label: "Don't sign without reading the letter." },
        { value: "c", label: "Don't sign without to read the letter." },
      ],
      correctAnswer: "b",
      explanation: "'Without' is a preposition. The verb after it must be -ing: without reading.",
      topic: "gerunds-prepositions",
      skill: "error-detection",
      skillTag: "without-plus-gerund",
      difficulty: "medium",
    },
  ],
};
