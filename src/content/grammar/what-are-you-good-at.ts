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

export const whatAreYouGoodAtContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. At the Restaurant
    // =========================================================================
    {
      id: "at-the-restaurant",
      stepNumber: 1,
      title: "At the Restaurant",
      icon: "🍽️",
      explanation: `
        ${sceneCard("sceneRestaurant", "East Boston, Thursday evening. Diego and Sarah talk during a break.", "terracotta")}

        ${dialogue([
          { speaker: "Sarah", avatar: "👩🏻", text: "Diego, are you <strong>good at</strong> making tamales, or just the regular prep?", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "I'm <strong>good at</strong> cooking everything fast. And I'm <strong>interested in</strong> learning the grill.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "Nice. Are you <strong>afraid of</strong> working the weekend rush?", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "No, I'm not <strong>afraid of</strong> working hard. I'm used to it.", side: "right", tone: "terracotta" },
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
            <span>She's <strong>interested in</strong> learn<strong>ing</strong> the grill.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("adjective + of", "terracotta")}
            <span>He's not <strong>afraid of</strong> work<strong>ing</strong> weekends.</span>
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
              label: "She is interested ___ learning the grill.",
              options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "of", label: "of" },
              ],
              expectedAnswer: "in",
            },
            {
              type: "radio",
              label: "He is not afraid ___ working weekends.",
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
              label: "She is good at ___ (clean) quickly.",
              expectedAnswers: ["cleaning"],
            },
            {
              type: "text",
              label: "He is interested in ___ (learn) English.",
              expectedAnswers: ["learning"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. After the Interview
    // =========================================================================
    {
      id: "after-the-interview",
      stepNumber: 2,
      title: "After the Interview",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneJobTalk", "East Boston, Friday afternoon. Marta and Bruno meet outside a temp agency.", "sage")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">A flyer on the door says November is <strong>Native American Heritage Month</strong>. a Native-led food drive needs volunteers Saturday.</p>

        ${dialogue([
          { speaker: "Marta", avatar: "👩🏾", text: "How did it go? Are you <strong>excited about</strong> getting the housecleaning job?", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "A little. But I'm <strong>nervous about</strong> working alone in someone's house.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "I know. I was the same. Now I'm just <strong>tired of</strong> looking for work.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Me too. But I'm <strong>proud of</strong> trying every day.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">More adjective + preposition pairs. They all follow the same rule: add <strong>-ing</strong> after the preposition.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("excited about", "sage")}
            <span>She is <strong>excited about</strong> start<strong>ing</strong> the job.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("nervous about", "sage")}
            <span>He is <strong>nervous about</strong> work<strong>ing</strong> alone.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("tired of", "sage")}
            <span>I am <strong>tired of</strong> look<strong>ing</strong> for work.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("proud of", "sage")}
            <span>They are <strong>proud of</strong> try<strong>ing</strong> every day.</span>
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
              label: "Marta is tired of ___ for work.",
              options: [
                { value: "looking", label: "looking" },
                { value: "look", label: "look" },
                { value: "looks", label: "looks" },
              ],
              expectedAnswer: "looking",
            },
            {
              type: "radio",
              label: "Bruno is nervous about ___ alone.",
              options: [
                { value: "working", label: "working" },
                { value: "work", label: "work" },
                { value: "to work", label: "to work" },
              ],
              expectedAnswer: "working",
            },
            {
              type: "radio",
              label: "\"She is excited about start the new job.\" Is this correct?",
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
              words: ["I", "am", "tired", "of", "looking", "for", "work"],
              correctAnswer: "I am tired of looking for work",
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
              label: "Bruno is nervous about ___ (work) alone.",
              expectedAnswers: ["working"],
            },
            {
              type: "text",
              label: "Marta is tired of ___ (look) for work.",
              expectedAnswers: ["looking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. At the Job Agency
    // =========================================================================
    {
      id: "at-the-job-agency",
      stepNumber: 3,
      title: "At the Job Agency",
      icon: "🗣️",
      explanation: `
        ${sceneCard("sceneCounselor", "East Boston WorkSource, Monday morning. Ms. Patel helps Hector prepare for interviews.", "blue")}

        ${dialogue([
          { speaker: "Ms. Patel", avatar: "👩‍💼", text: "Thank you <strong>for coming</strong> in today, Hector. Let's talk about how to explain your skills.", side: "left", tone: "blue" },
          { speaker: "Hector", avatar: "👨🏽", text: "OK. I got my last job <strong>by showing</strong> up early every day. My boss liked that.", side: "right", tone: "terracotta" },
          { speaker: "Ms. Patel", avatar: "👩‍💼", text: "Good. And don't leave today <strong>without asking</strong> me for the job list. I have new openings.", side: "left", tone: "blue" },
          { speaker: "Hector", avatar: "👨🏽", text: "I won't. I also want to ask <strong>about getting</strong> a construction certificate.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Prepositions also come after verbs and in phrases. Same rule: preposition + <strong>-ing</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("for + -ing", "blue")}
            <span>Thank you <strong>for help</strong><strong>ing</strong> me.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("by + -ing", "blue")}
            <span>I got the job <strong>by show</strong><strong>ing</strong> up on time.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("without + -ing", "blue")}
            <span>Don't leave <strong>without ask</strong><strong>ing</strong> for the job list.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("about + -ing", "blue")}
            <span>I want to ask <strong>about get</strong><strong>ting</strong> a certificate.</span>
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
              label: "She got the job by ___ early every day.",
              options: [
                { value: "arriving", label: "arriving" },
                { value: "arrive", label: "arrive" },
                { value: "arrived", label: "arrived" },
              ],
              expectedAnswer: "arriving",
            },
            {
              type: "radio",
              label: "Don't sign the paper without ___ it first.",
              options: [
                { value: "reading", label: "reading" },
                { value: "read", label: "read" },
                { value: "to read", label: "to read" },
              ],
              expectedAnswer: "reading",
            },
            {
              type: "radio",
              label: "Thank you for ___ me today.",
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
              label: "I got the job by ___ (show) up on time.",
              expectedAnswers: ["showing"],
            },
            {
              type: "text",
              label: "Don't leave without ___ (ask) about the schedule.",
              expectedAnswers: ["asking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Your Job Skills Form
    // =========================================================================
    {
      id: "your-job-skills-form",
      stepNumber: 4,
      title: "Your Job Skills Form",
      icon: "✍️",
      explanation: `
        ${sceneCard("sceneApplication", "East Boston WorkSource, Monday morning. Amina fills out a skills form with Kevin at the front desk.", "amber")}

        ${dialogue([
          { speaker: "Kevin", avatar: "🧑🏻", text: "This part asks what you're <strong>good at</strong>. Just write two or three things.", side: "left", tone: "amber" },
          { speaker: "Amina", avatar: "👩🏿", text: "I'm <strong>good at</strong> clean<strong>ing</strong> fast. And I'm <strong>interested in</strong> learn<strong>ing</strong> office work.", side: "right", tone: "terracotta" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Good. Are you <strong>worried about</strong> anything on the application?", side: "left", tone: "amber" },
          { speaker: "Amina", avatar: "👩🏿", text: "A little. But I'm <strong>excited about</strong> start<strong>ing</strong> something new.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>All the patterns together.</strong> The pattern is always the same: preposition + verb<strong>-ing</strong>.</p>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>Quick review:</strong>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; line-height: 1.9">
            <li>I am <strong>good at</strong> clean<strong>ing</strong>.</li>
            <li>She is <strong>interested in</strong> learn<strong>ing</strong> English.</li>
            <li>He is <strong>tired of</strong> work<strong>ing</strong> nights.</li>
            <li>They are <strong>excited about</strong> start<strong>ing</strong>.</li>
            <li>Thank you <strong>for help</strong><strong>ing</strong>.</li>
            <li>Don't leave <strong>without ask</strong><strong>ing</strong>.</li>
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
                { value: "a", label: "He is interested in to learn construction." },
                { value: "b", label: "He is interested in learning construction." },
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
      question: "Marta says, 'I am tired of look for work.' What is wrong?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'look' should be 'looking'. verb after a preposition needs -ing." },
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
      id: "good-at-q3",
      question: "Hector got the job by ___ on time every day. Which word fits?",
      options: [
        { value: "a", label: "show" },
        { value: "b", label: "showed" },
        { value: "c", label: "showing" },
      ],
      correctAnswer: "c",
      explanation: "'By' is a preposition. After 'by', the verb needs -ing: by showing.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "by-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "good-at-q4",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "She is interested in learn English." },
        { value: "b", label: "She is interested in learning English." },
        { value: "c", label: "She is interested in to learn English." },
      ],
      correctAnswer: "b",
      explanation: "After 'interested in', the verb must end in -ing. 'To learn' is used after different verbs.",
      topic: "gerunds-prepositions",
      skill: "error-detection",
      skillTag: "interested-in-gerund",
      difficulty: "easy",
    },
    {
      id: "good-at-q5",
      question: "Kevin says, 'Thank you for ___.' What goes in the blank?",
      options: [
        { value: "a", label: "come" },
        { value: "b", label: "coming" },
        { value: "c", label: "to come" },
      ],
      correctAnswer: "b",
      explanation: "'For' is a preposition. The verb after it must be -ing: for coming.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "for-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "good-at-q6",
      question: "Bruno is nervous ___ working alone. Which preposition fits?",
      options: [
        { value: "a", label: "at" },
        { value: "b", label: "about" },
        { value: "c", label: "of" },
      ],
      correctAnswer: "b",
      explanation: "The fixed phrase is 'nervous about'. 'Nervous at' and 'nervous of' are not standard.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "adjective-preposition-pair",
      difficulty: "medium",
    },
    {
      id: "good-at-q7",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "Don't sign without read the contract." },
        { value: "b", label: "Don't sign without reading the contract." },
        { value: "c", label: "Don't sign without to read the contract." },
      ],
      correctAnswer: "b",
      explanation: "'Without' is a preposition. The verb after it must be -ing: without reading.",
      topic: "gerunds-prepositions",
      skill: "error-detection",
      skillTag: "without-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "good-at-q8",
      question: "Amina says she is ___ starting a new job. Which phrase fits?",
      options: [
        { value: "a", label: "excited about" },
        { value: "b", label: "excited of" },
        { value: "c", label: "excited in" },
      ],
      correctAnswer: "a",
      explanation: "The fixed phrase is 'excited about'. It is always followed by -ing.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "adjective-preposition-pair",
      difficulty: "medium",
    },
    {
      id: "good-at-q9",
      question: "Sarah asks, 'Are you afraid of working the weekend rush?' Which answer is correct?",
      options: [
        { value: "a", label: "No, I'm not afraid of working hard." },
        { value: "b", label: "No, I'm not afraid of work hard." },
        { value: "c", label: "No, I'm not afraid to working hard." },
      ],
      correctAnswer: "a",
      explanation: "Afraid of + -ing. The verb after 'of' must be in -ing form.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "afraid-of-gerund",
      difficulty: "medium",
    },
    {
      id: "good-at-q10",
      question: "At a job interview, you want to say you enjoy working with other people. Which sentence is best?",
      options: [
        { value: "a", label: "I am good at work with a team." },
        { value: "b", label: "I am good at working with a team." },
        { value: "c", label: "I am good in working with a team." },
      ],
      correctAnswer: "b",
      explanation: "Good at + -ing. 'Good at working' is the correct form. 'Good in' is not used for skills.",
      topic: "gerunds-prepositions",
      skill: "usage",
      skillTag: "real-world-job-language",
      difficulty: "hard",
    },
  ],
};
