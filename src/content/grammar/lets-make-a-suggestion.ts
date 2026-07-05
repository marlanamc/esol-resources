import type { InteractiveGuideContent } from "@/types/activity";
import { letsMakeASuggestionImages as img } from "@/data/lets-make-a-suggestion-images.generated";

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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const letsMakeASuggestionContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Let's / We Could: Suggesting Together
    // =========================================================================
    {
      id: "lets-we-could",
      title: "Let's and We Could. Suggesting Together",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneHallway", "Apartment building hallway, East Boston. Tuesday evening. No heat for two days.", "sage")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Gloria, Jean, and Marta are texting in a group chat. The building has no heat.</em></p>

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏾", text: "<strong>Let's</strong> call the landlord right now. It's freezing in here.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏿", text: "I tried yesterday. He didn't answer. <strong>We could</strong> leave a message and also text him.", side: "left", tone: "sage" },
          { speaker: "Marta", avatar: "👩🏽", text: "<strong>Let's</strong> write down the date. We need a record if this goes to housing court.", side: "right", tone: "amber" },
          { speaker: "Jean", avatar: "🧑🏿", text: "Good idea. <strong>We could</strong> also ask the other tenants if they have the same problem.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Let's</strong> = a suggestion for the group to do together. You are included. It is direct and friendly.<br>
          <strong>We could</strong> = a softer suggestion. You are giving an option, not a command.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("direct", "sage")}
            <span><em><strong>Let's</strong> call the landlord tonight.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("direct", "sage")}
            <span><em><strong>Let's</strong> write down the date so we have a record.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("softer option", "blue")}
            <span><em><strong>We could</strong> leave a message and also send a text.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("softer option", "blue")}
            <span><em><strong>We could</strong> ask the other tenants if they have the same problem.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> Let's + base verb. &nbsp; We could + base verb.<br>
          <em>Let's <strong>call</strong> him.</em> &nbsp; <em>We could <strong>text</strong> him.</em> &nbsp; Never: <s>Let's to call</s> &nbsp; <s>We could calling</s></p>
        </div>
      `,
      exercises: [
        {
          id: "lets-1",
          title: "Let's or We Could?",
          instructions: "Choose the correct word or phrase based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Gloria wants everyone in the group to act now. Which sentence fits best?",
              options: [
                { value: "a", label: "We could take photos of the leak tonight." },
                { value: "b", label: "Let's take photos of the leak tonight." },
                { value: "c", label: "Let's to take photos of the leak tonight." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jean is giving a gentle option, not a command. Which sentence fits?",
              options: [
                { value: "a", label: "Let's talk to the neighbors upstairs." },
                { value: "b", label: "We could talks to the neighbors upstairs." },
                { value: "c", label: "We could talk to the neighbors upstairs." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in: ___ write down the date. We need a record. (Let's / We could)",
              expectedAnswers: ["Let's", "Lets"],
            },
          ],
        },
        {
          id: "lets-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["We", "could", "ask", "the", "other", "tenants", "about", "the", "heat"],
              correctAnswer: "We could ask the other tenants about the heat",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. You Should / You Could: Suggesting to One Person
    // =========================================================================
    {
      id: "you-should-could",
      title: "You Should and You Could. Suggesting to One Person",
      icon: "👂",
      explanation: `
        ${sceneCard("sceneHallwayKevin", "Outside the apartment building. Marta talks to Kevin, the superintendent's assistant.", "amber")}

        ${dialogue([
          { speaker: "Marta", avatar: "👩🏽", text: "Kevin, the heat has been off for two days. What do we do?", side: "right", tone: "amber" },
          { speaker: "Kevin", avatar: "👨🏽", text: "You <strong>should</strong> send a written complaint to the landlord. Text is not enough.", side: "left", tone: "blue" },
          { speaker: "Marta", avatar: "👩🏽", text: "And if he doesn't answer?", side: "right", tone: "amber" },
          { speaker: "Kevin", avatar: "👨🏽", text: "You <strong>could</strong> call Inspectional Services. It's the city. They can force him to fix it.", side: "left", tone: "blue" },
          { speaker: "Marta", avatar: "👩🏽", text: "He <strong>must</strong> fix it by law, right?", side: "right", tone: "amber" },
          { speaker: "Kevin", avatar: "👨🏽", text: "Yes. He <strong>must</strong> keep the heat at 68 degrees during the day. That's the law.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>You should</strong> = stronger advice. The speaker thinks this is the right thing to do.<br>
          <strong>You could</strong> = softer. You are giving an option. It is the person's choice.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("stronger advice", "amber")}
            <span><em>You <strong>should</strong> send a written complaint.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("stronger advice", "amber")}
            <span><em>You <strong>should</strong> keep a record of every call.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("softer option", "blue")}
            <span><em>You <strong>could</strong> call Inspectional Services.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("softer option", "blue")}
            <span><em>You <strong>could</strong> wait one more day and then call the city.</em></span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Should vs. Must:</strong> Kevin says the landlord <em>must</em> keep the heat on. That's the law. He says Marta <em>should</em> send a complaint. That's advice. <em>Must</em> is stronger than <em>should</em>.</p>
        </div>
      `,
      exercises: [
        {
          id: "should-could-1",
          title: "Stronger advice or softer option?",
          instructions: "Choose should or could based on the meaning in context.",
          items: [
            {
              type: "radio",
              label: "Kevin thinks saving every letter is the right and necessary step. Which fits?",
              options: [
                { value: "a", label: "You could keep copies of every letter." },
                { value: "b", label: "You should keep copies of every letter." },
                { value: "c", label: "You should to keep copies of every letter." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Kevin is giving Marta one extra option she can choose. Which fits?",
              options: [
                { value: "a", label: "You should visit the housing office downtown." },
                { value: "b", label: "You could visits the housing office downtown." },
                { value: "c", label: "You could visit the housing office downtown." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in with should or could: The landlord ___ fix the heat. It is the law.",
              expectedAnswers: ["must", "should"],
            },
          ],
        },
        {
          id: "should-could-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["You", "should", "keep", "a", "record", "of", "every", "call", "you", "make"],
              correctAnswer: "You should keep a record of every call you make",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Suggesting at Work: Could We / Should We
    // =========================================================================
    {
      id: "suggesting-at-work",
      title: "Could We and Should We. Suggestions as Questions",
      icon: "🍽️",
      explanation: `
        ${sceneCard("sceneRestaurantBreak", "Restaurant break room, East Boston. Friday night. The Saturday morning shift has no coverage.", "terracotta")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Amara's childcare fell through. She can't work Saturday morning. Diego and Brian need to figure out the shift.</em></p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "I'm so sorry. My babysitter canceled. I can't come in Saturday morning.", side: "right", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏽", text: "<strong>Could we</strong> split the shift? I can do the first two hours if someone else covers the rest.", side: "left", tone: "sage" },
          { speaker: "Brian", avatar: "🧑🏽", text: "<strong>Should we</strong> call Luis? He asked about extra hours last week.", side: "right", tone: "blue" },
          { speaker: "Diego", avatar: "👨🏽", text: "Yes. Or <strong>why don't we</strong> post it in the group chat? Someone might want the hours.", side: "left", tone: "sage" },
          { speaker: "Brian", avatar: "🧑🏽", text: "Good thinking. <strong>Why don't we</strong> do both. I'll call Luis and you post the chat.", side: "right", tone: "blue" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Could we...?</strong> = a suggestion in question form. Softer and more polite.<br>
          <strong>Should we...?</strong> = asking if the group agrees something is the right move.<br>
          <strong>Why don't we...?</strong> = an informal suggestion. Common in conversation.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("polite option", "terracotta")}
            <span><em><strong>Could we</strong> split the shift between two people?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("checking agreement", "terracotta")}
            <span><em><strong>Should we</strong> call someone who wants extra hours?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("informal", "amber")}
            <span><em><strong>Why don't we</strong> post it in the group chat?</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> Could we + base verb? &nbsp; Should we + base verb? &nbsp; Why don't we + base verb?<br>
          <em>Could we <strong>split</strong> the shift?</em> &nbsp; <em>Should we <strong>call</strong> Luis?</em> &nbsp; <em>Why don't we <strong>post</strong> it?</em></p>
        </div>
      `,
      exercises: [
        {
          id: "work-1",
          title: "Pick the right suggestion",
          instructions: "Choose the sentence that fits the situation.",
          items: [
            {
              type: "radio",
              label: "Diego wants to propose a polite option about the weekend schedule. Which fits?",
              options: [
                { value: "a", label: "Could we trade shifts this weekend?" },
                { value: "b", label: "Could we trading shifts this weekend?" },
                { value: "c", label: "Let's to trade shifts this weekend." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Brian wants to check if texting the group is a good idea. Which fits?",
              options: [
                { value: "a", label: "Why don't we texted the group first?" },
                { value: "b", label: "Should we text the group first?" },
                { value: "c", label: "Should we to text the group first?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: ___ don't we post it in the group chat? Someone might want the hours.",
              expectedAnswers: ["Why"],
            },
          ],
        },
        {
          id: "work-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "don't", "we", "post", "the", "shift", "in", "the", "group", "chat"],
              correctAnswer: "Why don't we post the shift in the group chat",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Putting It Together: Which One Fits?
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting It Together. Which Suggestion Fits?",
      icon: "🤔",
      explanation: `
        ${sceneCard("sceneContrast", "Two coworkers review options together before making a decision.", "blue")}

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏾", text: "OK so the heat is still off. <strong>Let's</strong> decide what to do tonight.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏿", text: "<strong>We could</strong> call the city, or we could wait one more day.", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏾", text: "No more waiting. You <strong>should</strong> call tonight and I'll send the written complaint.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏿", text: "<strong>Could we</strong> also get a letter from all three tenants? More names looks better.", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏾", text: "Yes. <strong>Why don't we</strong> knock on Marta's door right now?", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">All four suggestion forms side by side:</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(106,141,115,0.12)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Form</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Meaning</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #b05740">Let's</td>
                <td style="padding: 0.6rem 0.75rem">group proposal, direct</td>
                <td style="padding: 0.6rem 0.75rem"><em><strong>Let's</strong> call the landlord together.</em></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">We / You could</td>
                <td style="padding: 0.6rem 0.75rem">soft option, not a command</td>
                <td style="padding: 0.6rem 0.75rem"><em><strong>We could</strong> text him too.</em></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">You should</td>
                <td style="padding: 0.6rem 0.75rem">stronger advice</td>
                <td style="padding: 0.6rem 0.75rem"><em><strong>You should</strong> send a written complaint.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #e9c46a; text-shadow: 0 0 1px rgba(0,0,0,0.3)">Why don't we</td>
                <td style="padding: 0.6rem 0.75rem">informal group suggestion</td>
                <td style="padding: 0.6rem 0.75rem"><em><strong>Why don't we</strong> knock on Marta's door?</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>All suggestion forms use base verb with no changes.</strong><br>
          <em>Let's <strong>call</strong>. &nbsp; We could <strong>text</strong>. &nbsp; You should <strong>send</strong>. &nbsp; Why don't we <strong>knock</strong>.</em><br>
          Never: <s>Let's to call</s> &nbsp; <s>We could calling</s> &nbsp; <s>You should sends</s></p>
        </div>
      `,
      exercises: [
        {
          id: "contrast-1",
          title: "Which suggestion fits?",
          instructions: "Choose the best form for each situation.",
          items: [
            {
              type: "radio",
              label: "Marta wants the whole group to decide together right now. Which fits best?",
              options: [
                { value: "a", label: "You could make a plan together." },
                { value: "b", label: "Let's make a plan together." },
                { value: "c", label: "Why don't you make a plan?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "We could wait one more day." },
                { value: "b", label: "Why don't we calls the city?" },
                { value: "c", label: "Let's knock on Marta's door." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Diego gives a polite option to his manager Brian. Which fits?",
              options: [
                { value: "a", label: "Let's share the Saturday hours." },
                { value: "b", label: "You must share the Saturday hours." },
                { value: "c", label: "Could we share the Saturday hours?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in: ___ don't we ask the other tenants to sign the letter? (Why / We / Let's)",
              expectedAnswers: ["Why"],
            },
          ],
        },
        {
          id: "contrast-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Let's", "send", "a", "written", "complaint", "to", "the", "landlord", "tonight"],
              correctAnswer: "Let's send a written complaint to the landlord tonight",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation of modals, open the <a href=\"/grammar-reader/modals-obligation-permission\" style=\"font-weight:700;text-decoration:underline\">Modals: Obligation + Permission Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "lets-make-a-suggestion-q1",
      question: "Gloria wants the whole group to act together. Which sentence fits?",
      options: [
        { value: "a", label: "Let's meet in the lobby at six." },
        { value: "b", label: "Let's to meet in the lobby at six." },
        { value: "c", label: "Let's meeting in the lobby at six." },
      ],
      correctAnswer: "a",
      explanation: "'Let's' is always followed by the base verb with no changes.",
      topic: "lets",
      skill: "usage",
      skillTag: "suggestion-form-lets",
      difficulty: "easy",
    },
    {
      id: "lets-make-a-suggestion-q3",
      question: "Kevin tells Marta that saving the repair receipts is the right and necessary step. Which fits?",
      options: [
        { value: "a", label: "You could save the repair receipts." },
        { value: "b", label: "You should save the repair receipts." },
        { value: "c", label: "Let's save the repair receipts." },
      ],
      correctAnswer: "b",
      explanation: "'You should' gives stronger advice. 'You could' is a softer option, and 'Let's' suggests doing it together.",
      topic: "you-should",
      skill: "usage",
      skillTag: "meaning-advice-strength",
      difficulty: "easy",
    },
    {
      id: "lets-make-a-suggestion-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"We ___ split the shift between two people.\" (Which word gives a soft suggestion, not a command?)",
      correctAnswer: "could",
      explanation: "'We could' offers a soft option without pressure. 'Must' or 'will' would feel like a command.",
      topic: "we-could",
      skill: "usage",
      skillTag: "meaning-soft-vs-direct",
      difficulty: "easy",
    },
    {
      id: "lets-make-a-suggestion-qws1",
      type: "word-scramble" as const,
      question: "Rosa and her neighbor agree on a plan for the building issue. Put the words in order.",
      words: ["Let's", "send", "the", "complaint", "tonight"],
      correctAnswer: "Let's send the complaint tonight",
      hint: "Let's + base verb",
      explanation: "'Let's' is always followed by the base verb. Never add 'to' or change the verb form.",
      topic: "lets",
      skill: "usage",
      skillTag: "suggestion-form-lets",
      difficulty: "medium",
    },
    {
      id: "lets-make-a-suggestion-q7",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "Why don't we post the shift in the group chat?" },
        { value: "b", label: "Could we split the hours?" },
        { value: "c", label: "Why don't we calls the landlord?" },
      ],
      correctAnswer: "c",
      explanation: "'Why don't we' is followed by the base verb. 'Calls' should be 'call'.",
      topic: "why-dont-we",
      skill: "error-detection",
      skillTag: "suggestion-base-verb-form",
      difficulty: "medium",
    },
  ],
};
