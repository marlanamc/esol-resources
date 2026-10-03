import type { InteractiveGuideContent } from "@/types/activity";
import { zeroFirstConditionalImages as img } from "@/data/zero-first-conditional-images.generated";

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

export const zeroFirstConditionalContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Zero Conditional: If It's Always True
    // =========================================================================
    {
      id: "zero-conditional",
      title: "Zero Conditional: If It's Always True",
      icon: "📋",
      tenseDiagram: {
        title: "Where the Zero Conditional lives on the timeline",
        elements: [
          { id: "zero-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "If + present" },
          { id: "zero-result", type: "multiple-dots", zone: "present", position: 65, verbLabel: "result (present)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneRestaurantManager", "La Palma Restaurant, East Boston. Monday morning before the lunch rush. The manager, Scott, checks his clipboard.", "terracotta")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Carlos is a prep cook at La Palma. He became a U.S. citizen in June, and this November is his first election. Election Day is Tuesday, November 3.</em></p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Scott, can I come in at 11 on Election Day? It's my first time voting.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Congratulations. <strong>If you need</strong> a day off, <strong>you ask</strong> two weeks ahead. A morning is easier.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Just the morning. The polls open at 7. I'll be here by 11.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Write it on the request sheet. My wife votes at 7 every year. <strong>If you go</strong> early, the line <strong>is</strong> short.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "And if the line is long and I'm late?", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Same as any day. <strong>If you're</strong> running late, <strong>you call</strong> me before your shift starts.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Zero Conditional</strong> = a fact that is always true. A rule, a policy, a natural consequence. Both verbs are present simple.<br>
          <em>If + present simple, present simple.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> you <strong>are</strong> in line by 8 PM, you <strong>get</strong> to vote.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> you <strong>go</strong> early, the line <strong>is</strong> short.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> water <strong>boils</strong>, it <strong>turns</strong> to steam.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> you <strong>move</strong>, you <strong>update</strong> your voter registration.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>The comma rule:</strong> <em>If</em> + condition first, then result. You can also flip it: <em>You get to vote <strong>if</strong> you are in line by 8 PM.</em> (No comma when the result comes first.)</p>
        </div>
      `,
      exercises: [
        {
          id: "zero-1",
          title: "Is it a rule or a fact?",
          instructions: "Choose the correct answer based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Scott says this is always true at the restaurant. Which sentence fits the Zero Conditional?",
              options: [
                { value: "a", label: "If you need a day off, you will ask two weeks ahead." },
                { value: "b", label: "If you need a day off, you ask two weeks ahead." },
                { value: "c", label: "If you need a day off, you asked two weeks ahead." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is the Zero Conditional?",
              options: [
                { value: "a", label: "If Carlos goes at 7, he will be at work by 11." },
                { value: "b", label: "If Carlos went at 7, he would be at work by 11." },
                { value: "c", label: "If you go early, the line is short." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in the blank with the correct form: If your name ___ (be) on the voter list, you get a ballot.",
              expectedAnswers: ["is"],
            },
          ],
        },
        {
          id: "zero-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct Zero Conditional sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "you", "need", "a", "day", "off", "you", "ask", "two", "weeks", "ahead"],
              correctAnswer: "If you need a day off you ask two weeks ahead",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. First Conditional: Real Future Plans
    // =========================================================================
    {
      id: "first-conditional",
      title: "First Conditional: Real Future Plans",
      icon: "📅",
      tenseDiagram: {
        title: "Where the First Conditional lives on the timeline",
        elements: [
          { id: "first-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "If + present" },
          { id: "first-will", type: "single-dot", zone: "future", position: 65, verbLabel: "will + base verb" },
        ],
      },
      explanation: `
        ${sceneCard("scenePaycheck", "Carlos and Ana's kitchen, Thursday night. Ana goes through the bills and the mail.", "amber")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Carlos just got home from La Palma. His wife, Ana, is going through the mail.</em></p>

        ${dialogue([
          { speaker: "Ana", avatar: "👩🏾", text: "The electric bill came. It's $190 this month.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "<strong>If I pick up</strong> an extra shift, <strong>I'll pay</strong> it. Anything else?", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏾", text: "Nothing from the city. Carlos, did you ever register to vote?", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I thought they did that at my citizenship ceremony.", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏾", text: "Maybe not. <strong>If you don't register</strong> by October 24, <strong>you won't vote</strong> this year.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Get my wallet. <strong>If I do</strong> it online right now, <strong>it'll take</strong> five minutes.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>First Conditional</strong> = a real situation that might happen. The result is in the future.<br>
          <em>If + present simple, will + base verb.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> I <strong>pick up</strong> an extra shift, I <strong>will pay</strong> the electric bill.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> you <strong>don't register</strong> by October 24, you <strong>won't vote</strong> this year.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> the website <strong>asks</strong> for my license number, <strong>read</strong> it to me.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> Carlos <strong>goes</strong> at 7, he <strong>will vote</strong> before his shift.</em></span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Important:</strong> In the <em>if</em>-part, never use <em>will</em>.<br>
          Correct: <em>If I <strong>pick up</strong> the shift...</em><br>
          Wrong: <s>If I <strong>will pick up</strong> the shift...</s></p>
        </div>
      `,
      exercises: [
        {
          id: "first-1",
          title: "Real future or always true?",
          instructions: "Choose the correct sentence for each situation.",
          items: [
            {
              type: "radio",
              label: "Carlos is talking about his specific plan for tonight. Which fits the First Conditional?",
              options: [
                { value: "a", label: "If I register tonight, I vote in November." },
                { value: "b", label: "If I register tonight, I will vote in November." },
                { value: "c", label: "If I will register tonight, I will vote in November." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If the website asks for your license, read it to me." },
                { value: "b", label: "If you miss the deadline, you won't vote this year." },
                { value: "c", label: "If he will register tonight, he will vote in November." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Ana tells her sister: If Carlos ___ (not work) on Election Day morning, he'll vote at 7.",
              expectedAnswers: ["doesn't work", "does not work"],
            },
          ],
        },
        {
          id: "first-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct First Conditional sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "I", "pick", "up", "the", "shift", "I", "will", "pay", "the", "electric", "bill"],
              correctAnswer: "If I pick up the shift I will pay the electric bill",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Unless, When, and As Soon As
    // =========================================================================
    {
      id: "unless-when-as-soon-as",
      title: "Unless, When, and As Soon As",
      icon: "📱",
      explanation: `
        ${sceneCard("scenePhoneTexting", "La Palma break room, the next Monday. Jennifer shows Carlos the November schedule on her phone.", "sage")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Carlos is registered now. But Scott never saw the request sheet. Jennifer is a server at La Palma.</em></p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Look. I'm on a double on Election Day, 7 to close. I <strong>won't</strong> vote <strong>unless</strong> someone <strong>switches</strong> with me.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "Or you can vote early. The library has early voting on weekends. You don't need a reason.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I didn't know that. <strong>As soon as</strong> my registration <strong>goes</strong> through, I'll look up the times.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "I'll still ask Miguel about Tuesday. <strong>When</strong> he <strong>gets</strong> here, I'll ask him.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Thanks. But I <strong>won't</strong> switch <strong>unless</strong> Scott <strong>agrees</strong>.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Unless</strong> = if not. Same tense rules as the First Conditional.<br>
          <strong>When</strong> = at that moment in the future (more certain than <em>if</em>).<br>
          <strong>As soon as</strong> = immediately when something happens.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("unless = if not", "sage")}
            <span><em>I <strong>won't</strong> vote <strong>unless</strong> someone <strong>switches</strong> with me.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("unless = if not", "sage")}
            <span><em>I <strong>won't</strong> switch <strong>unless</strong> Scott <strong>agrees</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("when = certain future", "blue")}
            <span><em><strong>When</strong> Miguel <strong>gets</strong> here, I'll ask him.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("as soon as = immediately", "amber")}
            <span><em><strong>As soon as</strong> my registration <strong>goes</strong> through, I'll look up the times.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Same rule:</strong> After <em>unless</em>, <em>when</em>, and <em>as soon as</em>, use present simple, not <em>will</em>.<br>
          Correct: <em>As soon as he <strong>gets</strong> here, I'll ask.</em><br>
          Wrong: <s>As soon as he <strong>will get</strong> here, I'll ask.</s></p>
        </div>
      `,
      exercises: [
        {
          id: "unless-1",
          title: "Unless, when, or as soon as?",
          instructions: "Choose the correct word or phrase for each sentence.",
          items: [
            {
              type: "radio",
              label: "Carlos means: 'If nobody switches with me, I won't be able to vote on Election Day.' Which sentence says this?",
              options: [
                { value: "a", label: "I won't be able to vote when someone switches with me." },
                { value: "b", label: "I won't be able to vote unless someone switches with me." },
                { value: "c", label: "I won't be able to vote as soon as someone switches with me." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "When the schedule posts, I'll text you." },
                { value: "b", label: "As soon as Miguel will get here, I'll ask him." },
                { value: "c", label: "I won't cover unless someone else steps up." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: ___ Miguel gets to work, Jennifer will ask him about Tuesday. (When / Unless / As soon as)",
              expectedAnswers: ["When", "As soon as"],
            },
          ],
        },
        {
          id: "unless-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "won't", "trade", "shifts", "unless", "the", "manager", "agrees"],
              correctAnswer: "I won't trade shifts unless the manager agrees",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Zero vs. First: Which One?
    // =========================================================================
    {
      id: "zero-vs-first",
      title: "Zero vs. First: Which One Fits?",
      icon: "🤔",
      explanation: `
        ${sceneCard("sceneChristmasEve", "La Palma dining room, Thursday night. The dinner rush is on.", "terracotta")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Miguel can't switch. He has his kids on Tuesday. Carlos finds Scott between tables.</em></p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Scott, Miguel can't switch with me. So I'm voting early, Saturday morning at the library.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Sorry about the schedule. Saturday morning's fine. Can you take Saturday night, too? We're short.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Saturday nights pay double, right?", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Yes. <strong>If you work Saturday nights, you earn double.</strong> But nobody wants to close.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Then <strong>if I vote Saturday morning, I'll still make the night shift</strong>. That covers the electric bill and helps with rent.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏼‍💼", text: "Deal. <strong>If I don't see you by 5, I'll call you</strong>.", side: "left", tone: "blue" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">Zero vs. First: side by side</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(176,87,64,0.1)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Type</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Form</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Meaning</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #b05740">Zero</td>
                <td style="padding: 0.6rem 0.75rem">If + present, present</td>
                <td style="padding: 0.6rem 0.75rem">always true, a rule</td>
                <td style="padding: 0.6rem 0.75rem"><em>If you work Saturday nights, you <strong>earn</strong> double.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #e9c46a; text-shadow: 0 0 1px rgba(0,0,0,0.3)">First</td>
                <td style="padding: 0.6rem 0.75rem">If + present, will + base</td>
                <td style="padding: 0.6rem 0.75rem">real future plan</td>
                <td style="padding: 0.6rem 0.75rem"><em>If I vote Saturday morning, I <strong>will</strong> still <strong>make</strong> the night shift.</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>The key question:</strong> Is this always true (Zero) or is this Carlos's specific plan right now (First)?<br>
          <em>"You earn double on Saturday nights"</em> = always true at La Palma. Zero.<br>
          <em>"I'll still make the night shift"</em> = Carlos's plan for this Saturday. First.</p>
        </div>
      `,
      exercises: [
        {
          id: "contrast-1",
          title: "Zero or First?",
          instructions: "Choose the correct type of conditional for each situation.",
          items: [
            {
              type: "radio",
              label: "Scott is explaining a restaurant rule that is always true: double pay on Saturday nights. Which type is this?",
              options: [
                { value: "a", label: "First Conditional. It is a future plan." },
                { value: "b", label: "Zero Conditional. It is an always-true rule." },
                { value: "c", label: "Neither. It uses 'will' so it is different." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Scott says, 'If I don't see you by 5, I'll call you.' Which type is this?",
              options: [
                { value: "a", label: "Zero Conditional. It is always true." },
                { value: "b", label: "First Conditional. It is Scott's real plan for Saturday." },
                { value: "c", label: "First Conditional, but the form is wrong." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is Zero Conditional?",
              options: [
                { value: "a", label: "If I vote Saturday morning, I will make the night shift." },
                { value: "b", label: "If you are in line by 8 PM, you get to vote." },
                { value: "c", label: "If Miguel switches with me, I will vote on Tuesday." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in Scott's rule: If you ___ (work) Saturday nights, you earn double. (Zero Conditional)",
              expectedAnswers: ["work"],
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
              words: ["If", "the", "bus", "is", "late", "tomorrow", "I", "will", "text", "you"],
              correctAnswer: "If the bus is late tomorrow I will text you",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. Putting It Together: Work, Money, Childcare
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting It Together: A Ride to the Polls",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneMixedPractice", "Carlos and Ana's living room, Friday evening. Carlos is at work. Ana's friend Beatriz stops by.", "amber")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Beatriz lives downstairs. She is a citizen, but she doesn't drive. She cleans offices at night, and the polls close at 8.</em></p>

        ${dialogue([
          { speaker: "Beatriz", avatar: "👩🏽", text: "Ana, I want to vote this year. But I don't drive, and Tuesday I work until 9.", side: "left", tone: "sage" },
          { speaker: "Ana", avatar: "👩🏾", text: "Carlos is voting early tomorrow at the library. <strong>If you're</strong> ready at 9, <strong>he'll pick</strong> you up.", side: "right", tone: "terracotta" },
          { speaker: "Beatriz", avatar: "👩🏽", text: "Really? Then I'll be outside at 9. Are you coming too?", side: "left", tone: "sage" },
          { speaker: "Ana", avatar: "👩🏾", text: "I can't vote yet. I'm not a citizen. But <strong>if my sister comes</strong> for the kids, <strong>I can come</strong> with you.", side: "right", tone: "terracotta" },
          { speaker: "Beatriz", avatar: "👩🏽", text: "OK. Call me <strong>as soon as</strong> you <strong>know</strong>.", side: "left", tone: "sage" },
          { speaker: "Ana", avatar: "👩🏾", text: "Don't worry. My sister always <strong>says</strong> yes <strong>if</strong> I <strong>make</strong> her breakfast.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">Which type is each sentence?</p>

        <div style="display: grid; gap: 0.5rem; margin: 0.5rem 0 1.25rem">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("first", "amber")}
            <span><em>"If you're ready at 9, he'll pick you up."</em> A real plan for tomorrow.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("zero", "terracotta")}
            <span><em>"My sister always says yes if I make her breakfast."</em> Always true, every time.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("first", "amber")}
            <span><em>"If my sister comes for the kids, I can come with you."</em> A real possibility for tomorrow.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("as soon as", "sage")}
            <span><em>"Call me as soon as you know."</em> Same tense rule as First Conditional.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mixed-1",
          title: "Zero, First, or Unless?",
          instructions: "Choose the best answer for each situation.",
          items: [
            {
              type: "radio",
              label: "Ana is talking about the real plan for tomorrow. Which sentence fits?",
              options: [
                { value: "a", label: "If you're ready at 9, he picks you up." },
                { value: "b", label: "If you're ready at 9, he'll pick you up." },
                { value: "c", label: "If you will be ready at 9, he'll pick you up." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Ana says, 'My sister always says yes if I make her breakfast.' Which conditional fits this?",
              options: [
                { value: "a", label: "First Conditional. It is a future plan." },
                { value: "b", label: "Zero Conditional. It happens every time, always." },
                { value: "c", label: "It is not a conditional." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If she doesn't come, I won't be able to go." },
                { value: "b", label: "As soon as I know, I'll call you." },
                { value: "c", label: "If Carlos will drive, I'll go." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in the blank: If my sister ___ (come) for the kids, I can go to the library with you.",
              expectedAnswers: ["comes"],
            },
          ],
        },
        {
          id: "mixed-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["As", "soon", "as", "you", "know", "call", "me", "and", "I", "will", "help"],
              correctAnswer: "As soon as you know call me and I will help",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/conditionals-zero-first\" style=\"font-weight:700;text-decoration:underline\">Zero + First Conditionals Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "zero-first-conditional-q2",
      question: "Carlos tells Ana about the extra Saturday night shift and the electric bill. Which if-part is correct?",
      options: [
        { value: "a", label: "If I will take the extra shift..." },
        { value: "b", label: "If I take the extra shift..." },
        { value: "c", label: "If I took the extra shift..." },
      ],
      correctAnswer: "b",
      explanation: "In First Conditional, the if-part uses present simple. Never use 'will' in the if-part.",
      topic: "first-conditional",
      skill: "usage",
      skillTag: "first-conditional-no-will-in-if",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-q4",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "If your name is on the list, you get a ballot." },
        { value: "b", label: "If Carlos will work Saturday, he will pay the bill." },
        { value: "c", label: "If I don't see you by 5, I will call you." },
      ],
      correctAnswer: "b",
      explanation: "'Will' cannot appear in the if-part of a conditional. It should be: 'If Carlos works Saturday...'",
      topic: "first-conditional",
      skill: "error-detection",
      skillTag: "no-will-in-if-clause",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"If you work Saturday nights, you ___ double pay.\" (Zero Conditional: Scott's always-true rule at La Palma.)",
      correctAnswer: "earn",
      explanation: "Zero Conditional uses If + present simple, present simple. The rule is always true at this job.",
      topic: "zero-conditional",
      skill: "usage",
      skillTag: "meaning-always-true",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-qws1",
      type: "word-scramble" as const,
      question: "Carlos tells Ana why he said yes to the Saturday night shift. Put the words in order.",
      words: ["I", "will", "pay", "rent", "if", "I", "work"],
      correctAnswer: "I will pay rent if I work",
      hint: "will + base verb in the result part; present simple in the if-part",
      explanation: "First Conditional: if + present simple, will + base verb. The if-part never uses 'will'.",
      topic: "first-conditional",
      skill: "usage",
      skillTag: "first-conditional-no-will-in-if",
      difficulty: "medium",
    },
    {
      id: "zero-first-conditional-q7",
      question: "Scott says: 'If you work Saturday nights, you earn double.' Carlos says: 'If I vote Saturday morning, I will still make the night shift.' What is the difference?",
      options: [
        { value: "a", label: "Both are Zero Conditional. They are the same." },
        { value: "b", label: "Scott states a rule (Zero). Carlos states his plan (First)." },
        { value: "c", label: "Carlos's sentence is wrong. He should say 'I make' not 'I will make.'" },
      ],
      correctAnswer: "b",
      explanation: "Zero = an always-true rule (double pay on Saturday nights). First = a real, specific future plan (Carlos's Saturday).",
      topic: "zero-vs-first",
      skill: "recognition",
      skillTag: "meaning-rule-vs-plan",
      difficulty: "medium",
    },
  ],
};
