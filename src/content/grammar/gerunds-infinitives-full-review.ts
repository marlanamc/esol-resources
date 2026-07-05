import type { InteractiveGuideContent } from "@/types/activity";
import { gerundsInfinitivesFullReviewImages as img } from "@/data/gerunds-infinitives-full-review-images.generated";

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

export const gerundsInfinitivesFullReviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - Tired of Commuting
    // =========================================================================
    {
      id: "tired-of-commuting",
      title: "Tired of Commuting",
      icon: "🚌",
      explanation: `
        ${sceneCard("sceneBusCommute", "111 bus after warehouse close. Tuesday, 11 PM.", "blue")}

        <p><strong>Marisol</strong> just finished her closing shift at the warehouse. She texts her classmate <strong>Thiago</strong> from the bus stop.</p>

        ${dialogue([
          { speaker: "Marisol", avatar: "👩🏽", text: "I'm so <strong>tired of waiting</strong> for this late bus.", side: "right", tone: "terracotta" },
          { speaker: "Thiago", avatar: "👨🏽", text: "Me too. I'm <strong>sick of switching</strong> lines in the dark.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "And I'm not great <strong>at reading</strong> the new schedule app yet.", side: "right", tone: "terracotta" },
          { speaker: "Thiago", avatar: "👨🏽", text: "Same. But I'm <strong>interested in learning</strong> it. I have to.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>After a preposition</strong>, use verb + <strong>-ing</strong> (a gerund): tired <em>of waiting</em>, good <em>at reading</em>, interested <em>in learning</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("preposition", "terracotta")}
            <span><em>tired <strong>of waiting</strong></em> (not tired of wait)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("preposition", "sage")}
            <span><em>interested <strong>in learning</strong></em> (not interested to learn)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Choose the correct form",
          instructions: "After a preposition, pick -ing.",
          items: [
            {
              type: "radio",
              label: "Marisol is tired of the late bus. Which sentence is correct?",
              options: [
                { value: "a", label: "I'm tired of waiting for the 111." },
                { value: "b", label: "I'm tired of wait for the 111." },
                { value: "c", label: "I'm tired to wait for the 111." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Thiago wants to learn the app. Which sentence is correct?",
              options: [
                { value: "a", label: "I'm interested to learn the schedule app." },
                { value: "b", label: "I'm interested in learning the schedule app." },
                { value: "c", label: "I'm interested in learn the schedule app." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the -ing form.",
          items: [
            {
              type: "text",
              label: "I'm sick of ___ (switch) buses in the dark.",
              expectedAnswers: ["switching"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I'm", "tired", "of", "waiting", "for", "the", "late", "bus"],
              correctAnswer: "I'm tired of waiting for the late bus",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - I Need to Call the Landlord
    // =========================================================================
    {
      id: "need-to-call-landlord",
      title: "I Need to Call the Landlord",
      icon: "🏠",
      explanation: `
        ${sceneCard("sceneKitchenLetter", "Marisol's kitchen, East Boston. Wednesday, midnight.", "amber")}

        <p>A lease renewal letter arrived in the mail. The rent is going up. Marisol needs to call her landlord <strong>Mark</strong> before she falls asleep standing up.</p>

        ${dialogue([
          { speaker: "Marisol", avatar: "👩🏽", text: "I <strong>need to call</strong> Mark about the rent increase.", side: "right", tone: "terracotta" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I <strong>hope to find</strong> a cheaper place, but I <strong>plan to stay</strong> until fall if I can.", side: "right", tone: "terracotta" },
          { speaker: "Cousin", avatar: "👩🏾", text: "You'd <strong>like to ask</strong> about a month-to-month lease, right?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Yes. I <strong>want to change</strong> jobs in the fall anyway.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>After need, want, hope, plan, would like:</strong> use <strong>to + base verb</strong>. need <em>to call</em>, plan <em>to change</em>, hope <em>to find</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("infinitive", "sage")}
            <span><em>I <strong>need to call</strong> Mark.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("infinitive", "amber")}
            <span><em>I <strong>plan to change</strong> jobs in the fall.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Infinitive or gerund?",
          instructions: "Pick the correct form after need/want/plan.",
          items: [
            {
              type: "radio",
              label: "Marisol has a question for Mark, the landlord. Which sentence is correct?",
              options: [
                { value: "a", label: "I need to ask Mark about the parking." },
                { value: "b", label: "I need asking Mark about the parking." },
                { value: "c", label: "I need ask Mark about the parking." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Marisol has a goal for the new year. Which sentence is correct?",
              options: [
                { value: "a", label: "I plan taking a computer class in January." },
                { value: "b", label: "I plan to take a computer class in January." },
                { value: "c", label: "I plan take a computer class in January." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the blank",
          instructions: "Write to.",
          items: [
            {
              type: "text",
              label: "I hope ___ find a cheaper place.",
              expectedAnswers: ["to"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I would like asking about a month-to-month lease.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"would like to ask\" (infinitive)." },
                { value: "c", label: "Error: should be \"would like asking\" with no to." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - Keep Working Overtime
    // =========================================================================
    {
      id: "keep-working-overtime",
      title: "Keep Working Overtime",
      icon: "📦",
      explanation: `
        ${sceneCard("sceneWarehouseFloor", "Warehouse floor, Chelsea. Thursday, 4 PM.", "terracotta")}

        <p>Double shift week. Supervisor <strong>Brian</strong> asks who can stay late. Marisol needs the extra money for a deposit.</p>

        ${dialogue([
          { speaker: "Brian", avatar: "🧑🏼", text: "Who can stay an extra hour tonight?", side: "left", tone: "blue" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I can. I <strong>keep working</strong> overtime to save for a deposit.", side: "right", tone: "terracotta" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I <strong>avoid missing</strong> my kid's pickup, but I don't <strong>mind staying</strong> one hour.", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏼", text: "OK. <strong>Finish scanning</strong> those pallets first.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Some verbs take a gerund:</strong> enjoy, avoid, keep, finish, mind + <strong>-ing</strong>. Not an infinitive.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("gerund verb", "blue")}
            <span><em>I <strong>keep working</strong> overtime.</em> (not keep to work)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("gerund verb", "terracotta")}
            <span><em>I <strong>avoid missing</strong> pickup.</em> (not avoid to miss)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Gerund or infinitive?",
          instructions: "After enjoy/keep/avoid/finish/mind, pick -ing.",
          items: [
            {
              type: "radio",
              label: "Marisol checks the schedule app many times a day. Which sentence is correct?",
              options: [
                { value: "a", label: "I keep checking the schedule." },
                { value: "b", label: "I keep to check the schedule." },
                { value: "c", label: "I keep check the schedule." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Marisol leaves work before dark when she can. Which sentence is correct?",
              options: [
                { value: "a", label: "I avoid to take the late bus." },
                { value: "b", label: "I avoid taking the late bus." },
                { value: "c", label: "I avoid take the late bus." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the blank",
          instructions: "Write the -ing form.",
          items: [
            {
              type: "text",
              label: "I don't mind ___ (stay) an extra hour.",
              expectedAnswers: ["staying"],
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "keep", "working", "overtime", "to", "save", "money"],
              correctAnswer: "I keep working overtime to save money",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - Stop Forgetting Your Refills
    // =========================================================================
    {
      id: "stop-forgetting-refills",
      title: "Stop Forgetting Your Refills",
      icon: "💊",
      explanation: `
        ${sceneCard("scenePharmacyPickup", "East Boston Pharmacy, Meridian Street. Friday, 10 PM.", "sage")}

        <p>Marisol stops at the pharmacy after her shift. <strong>Jennifer</strong> has her refill ready. They talked about her new prescription last month too.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏾", text: "Marisol, you <strong>need to stop forgetting</strong> your refills. This is the second time.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I know. I <strong>stopped to read</strong> the label on the bus. Then I forgot the time.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏾", text: "<strong>Remember to pick up</strong> before the weekend. <strong>Try setting</strong> a phone alarm.", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "OK. Last month you told me to <strong>stop taking</strong> the old pills. Different meaning, I know.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>stop + -ing</strong> = quit a habit (<em>stop forgetting</em>, <em>stop taking</em>).<br/>
            <strong>stop + to + verb</strong> = pause in order to do something (<em>stopped to read</em> the label).
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("quit habit", "terracotta")}
            <span><em><strong>Stop forgetting</strong> your refills.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("pause to do", "blue")}
            <span><em>I <strong>stopped to read</strong> the label.</em> (I paused in order to read.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("future task", "sage")}
            <span><em><strong>Remember to pick up</strong> before the weekend.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Which meaning?",
          instructions: "Choose the form that matches the situation.",
          items: [
            {
              type: "radio",
              label: "Jennifer wants Marisol to quit a bad medicine habit.",
              options: [
                { value: "a", label: "Stop skipping your doses." },
                { value: "b", label: "Stop to skip your doses." },
                { value: "c", label: "Stop skip your doses." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Marisol paused on the bus in order to look at the directions.",
              options: [
                { value: "a", label: "I stopped checking the directions." },
                { value: "b", label: "I stopped to check the directions." },
                { value: "c", label: "I stopped check the directions." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jennifer reminds Marisol about the refill deadline.",
              options: [
                { value: "a", label: "Remember refilling before Friday." },
                { value: "b", label: "Remember to refill before Friday." },
                { value: "c", label: "Remember refill before Friday." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"You need to stop to forgetting your refills.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: quit a habit = \"stop forgetting\" (no to)." },
                { value: "c", label: "Error: should be \"stop to forget\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Fill in the blank",
          instructions: "Write to or -ing.",
          items: [
            {
              type: "text",
              label: "Try ___ (set) a phone alarm for your refill.",
              expectedAnswers: ["setting"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - One Packed Week: All Five Patterns
    // =========================================================================
    {
      id: "one-packed-week",
      title: "One Packed Week: All Five Patterns",
      icon: "📚",
      explanation: `
        ${sceneCard("sceneEveningClass", "Evening ESOL class, East Boston. Thursday, 7 PM.", "sage")}

        <p>Marisol tells classmate <strong>Djamila</strong> about her week. Monday is a holiday. She <strong>plans to visit</strong> her cousin's grave and <strong>hopes</strong> the construction site is closed so she can <strong>stop working</strong> that day.</p>

        ${dialogue([
          { speaker: "Djamila", avatar: "👩🏾", text: "Long week?", side: "left", tone: "sage" },
          { speaker: "Marisol", avatar: "👩🏽", text: "Yes. I'm <strong>tired of commuting</strong>. I <strong>need to call</strong> Mark about rent.", side: "right", tone: "terracotta" },
          { speaker: "Marisol", avatar: "👩🏽", text: "I <strong>keep working</strong> overtime. I <strong>need to stop forgetting</strong> my refills.", side: "right", tone: "terracotta" },
          { speaker: "Marisol", avatar: "👩🏽", text: "And I <strong>plan to change</strong> jobs in the fall. Monday I <strong>plan to visit</strong> my cousin's grave.", side: "right", tone: "terracotta" },
          { speaker: "Djamila", avatar: "👩🏾", text: "Monday's a holiday. I hope your site is closed.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Preposition + -ing</strong> &nbsp;|&nbsp;
            <strong>verb + to + base</strong> &nbsp;|&nbsp;
            <strong>verb + -ing</strong> &nbsp;|&nbsp;
            <strong>stop/remember/try</strong> (meaning changes)
          </p>
        </div>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick review. For more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/gerunds-infinitives\" style=\"font-weight:700;text-decoration:underline\">Gerunds + Infinitives Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right pattern",
          instructions: "Match Marisol's week to the correct form.",
          items: [
            {
              type: "radio",
              label: "Standing at the cold bus stop every night.",
              options: [
                { value: "a", label: "I'm sick of standing in the cold." },
                { value: "b", label: "I'm sick to stand in the cold." },
                { value: "c", label: "I'm sick of stand in the cold." },
                { value: "d", label: "I need to standing in the cold." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "A letter from Mark needs a reply.",
              options: [
                { value: "a", label: "I need answering Mark's letter." },
                { value: "b", label: "I need to answer Mark's letter." },
                { value: "c", label: "I need answer Mark's letter." },
                { value: "d", label: "I'm good at answer Mark's letter." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Extra hours to save money.",
              options: [
                { value: "a", label: "I keep to pick up extra shifts." },
                { value: "b", label: "I want to picking up extra shifts." },
                { value: "c", label: "I keep picking up extra shifts." },
                { value: "d", label: "I enjoy to pick up extra shifts." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Pharmacy refills again.",
              options: [
                { value: "a", label: "I need to stop missing my refill date." },
                { value: "b", label: "I need to stop to miss my refill date." },
                { value: "c", label: "I plan missing my refill date." },
                { value: "d", label: "I'm tired of to miss my refill date." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "A new goal for the new year.",
              options: [
                { value: "a", label: "I plan applying for the day shift." },
                { value: "b", label: "I plan to apply for the day shift." },
                { value: "c", label: "I keep to apply for the day shift." },
                { value: "d", label: "I'm interested to apply for the day shift." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "I'm tired of commuting." },
                { value: "b", label: "I need to call Mark." },
                { value: "c", label: "I enjoy to work overtime." },
                { value: "d", label: "I plan to visit my cousin's grave Monday." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Marisol ___ (plan) to change jobs in the fall.",
              expectedAnswers: ["plans"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Build Marisol's plan for this year:",
              words: ["I", "plan", "to", "save", "for", "a", "car", "this", "year"],
              correctAnswer: "I plan to save for a car this year",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "gifr-q1",
      question: "After a preposition like \"of\" or \"in,\" which form is correct?",
      options: [
        { value: "a", label: "verb + -ing (gerund)" },
        { value: "b", label: "to + base verb (infinitive)" },
        { value: "c", label: "base verb only" },
        { value: "d", label: "past tense" },
      ],
      correctAnswer: "a",
      explanation: "After prepositions: tired of waiting, interested in learning.",
      topic: "gerund-after-preposition",
      skill: "usage",
      skillTag: "preposition-plus-ing",
      difficulty: "easy",
    },
    {
      id: "gifr-q4",
      question: "Marisol practices English on her break every day. Which sentence is correct?",
      options: [
        { value: "a", label: "I keep to practice on my break." },
        { value: "b", label: "I keep practicing on my break." },
        { value: "c", label: "I want to practicing on my break." },
        { value: "d", label: "I enjoy to practice on my break." },
      ],
      correctAnswer: "b",
      explanation: "Keep takes a gerund: keep practicing.",
      topic: "gerund-after-verb",
      skill: "usage",
      skillTag: "keep-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "gifr-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I'm tired of ___ for the 111.\" (Marisol hates waiting for the late bus.)",
      correctAnswer: "waiting",
      explanation: "After prepositions like 'of', use a gerund: waiting.",
      topic: "gerund-after-preposition",
      skill: "usage",
      skillTag: "tired-of-commuting",
      difficulty: "easy",
    },
    {
      id: "gifr-q7",
      question: "Find the error: \"I enjoy to work overtime.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: enjoy takes -ing (enjoy working)." },
        { value: "c", label: "Error: should be enjoy to working." },
        { value: "d", label: "Error: should be enjoy work." },
      ],
      correctAnswer: "b",
      explanation: "Enjoy is a gerund verb: enjoy working, not enjoy to work.",
      topic: "gerund-after-verb",
      skill: "error-detection",
      skillTag: "error-enjoy-to-work",
      difficulty: "medium",
    },
    {
      id: "gifr-ws1",
      type: "word-scramble" as const,
      question: "Marisol pauses her podcast because she has a question for the bus driver. Put the words in order.",
      words: ["I", "stopped", "to", "ask", "the", "driver"],
      correctAnswer: "I stopped to ask the driver",
      hint: "stop + to + verb = pause in order to do something",
      explanation: "Stop + to + infinitive means pause your current activity in order to do something else.",
      topic: "meaning-change-pairs",
      skill: "usage",
      skillTag: "stop-plus-infinitive-word-order",
      difficulty: "medium",
    },
  ],
};
