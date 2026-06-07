import type { InteractiveGuideContent } from "@/types/activity";
import { canShouldMustImages as img } from "@/data/can-should-must-images.generated";

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

export const canShouldMustContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Can / Can't
    // =========================================================================
    {
      id: "can-ability",
      title: "Can. What You Are Able to Do Online",
      icon: "📱",
      explanation: `
        ${sceneCard("sceneLibraryTech", "East Boston Branch Library, Tech Help Table. Saturday morning.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Ryan at the tech table helps Claudette set up her new phone.</p>

        ${dialogue([
          { speaker: "Ryan", avatar: "👨🏽", text: "OK, Claudette, your new phone is set up. You <strong>can</strong> make calls, send texts, and use the internet now.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "What about my bank account? <strong>Can</strong> someone see it if they use my wifi?", side: "left", tone: "sage" },
          { speaker: "Ryan", avatar: "👨🏽", text: "On public wifi, yes, sometimes they <strong>can</strong>. But on your home wifi with a password, they <strong>can't</strong>.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Good. I <strong>can</strong> use the library wifi for looking things up, but not for my bank. Got it.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Can</strong> = ability or possibility. Something is possible, or a person is able to do it. <strong>Can't</strong> = it is not possible, or not able.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("ability", "sage")}
            <span><em>You <strong>can</strong> change your password anytime.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("possibility", "sage")}
            <span><em>Scammers <strong>can</strong> see your information on an open network.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not possible", "blue")}
            <span><em>They <strong>can't</strong> access your account if you use two-step login.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> can + base verb (no -s, no -ing, no "to")<br>
          <em>She <strong>can see</strong> your screen.</em> &nbsp; Not: <s>she can sees</s> &nbsp; Not: <s>she can to see</s></p>
        </div>
      `,
      exercises: [
        {
          id: "can-1",
          title: "Use can correctly",
          instructions: "Choose the correct sentence or fill in the blank.",
          items: [
            {
              type: "radio",
              label: "Claudette wants to check her bank account. Which sentence is correct?",
              options: [
                { value: "a", label: "She can checks her balance on the app." },
                { value: "b", label: "She can check her balance on the app." },
                { value: "c", label: "She can to check her balance on the app." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "On public wifi, a scammer ___ sometimes see what you are doing.",
              options: [
                { value: "a", label: "can" },
                { value: "b", label: "can't" },
                { value: "c", label: "must" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Fill in: You ___ (can / can't) share your password with anyone, not even a friend.",
              expectedAnswers: ["can't", "cannot"],
            },
          ],
        },
        {
          id: "can-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Linh", "can", "help", "you", "set", "up", "two-step", "login"],
              correctAnswer: "Linh can help you set up two-step login",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Should / Shouldn't
    // =========================================================================
    {
      id: "should-advice",
      title: "Should. Advice for Staying Safe",
      icon: "💡",
      explanation: `
        ${sceneCard("sceneLibraryFlyer", "East Boston Branch Library, bulletin board. Digital Safety Week flyer.", "amber")}

        ${dialogue([
          { speaker: "Miguel", avatar: "👨🏽", text: "This flyer says you <strong>should</strong> use a different password for every website.", side: "right", tone: "terracotta" },
          { speaker: "Librarian", avatar: "🧑🏽", text: "Exactly. And you <strong>shouldn't</strong> use your birthday or your name. Those are easy to guess.", side: "left", tone: "amber" },
          { speaker: "Miguel", avatar: "👨🏽", text: "What about public wifi? The flyer says I <strong>should</strong> be careful.", side: "right", tone: "terracotta" },
          { speaker: "Librarian", avatar: "🧑🏽", text: "Yes. You <strong>shouldn't</strong> log into your bank on public wifi. Use your phone's data instead.", side: "left", tone: "amber" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Should</strong> = advice or a recommendation. It is a good idea. <strong>Shouldn't</strong> = advice against something. It is not a good idea.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("good idea", "sage")}
            <span><em>You <strong>should</strong> use a strong password with numbers and symbols.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("good idea", "sage")}
            <span><em>You <strong>should</strong> check your bank account every week.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("bad idea", "amber")}
            <span><em>You <strong>shouldn't</strong> click on links in unknown text messages. especially around <strong>Veterans Day</strong>, when scammers send fake "verify your benefits" texts while banks are closed.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("bad idea", "amber")}
            <span><em>You <strong>shouldn't</strong> save your password on a shared computer.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Should</strong> is softer than <strong>must</strong>. It gives advice, not a rule. A friend, a doctor, or a flyer might say <em>should</em>. A law or a company policy says <em>must</em>.</p>
        </div>
      `,
      exercises: [
        {
          id: "should-1",
          title: "Good idea or bad idea?",
          instructions: "Choose should or shouldn't to complete the digital safety advice.",
          items: [
            {
              type: "radio",
              label: "The digital safety flyer says: \"___ use the same password on every website.\"",
              options: [
                { value: "a", label: "You should" },
                { value: "b", label: "You shouldn't" },
                { value: "c", label: "You must" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Miguel wants to protect his email. Which advice is correct?",
              options: [
                { value: "a", label: "He should using two-step login." },
                { value: "b", label: "He should use two-step login." },
                { value: "c", label: "He should to use two-step login." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: You ___ (should / shouldn't) click on links from numbers you don't know.",
              expectedAnswers: ["shouldn't", "should not"],
            },
          ],
        },
        {
          id: "should-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["You", "should", "check", "your", "bank", "account", "every", "week"],
              correctAnswer: "You should check your bank account every week",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Must / Must Not
    // =========================================================================
    {
      id: "must-obligation",
      title: "Must and Must Not. Rules That Protect You",
      icon: "🔒",
      explanation: `
        ${sceneCard("sceneCommunityWorkshop", "East Boston Community Center, digital safety workshop. Wednesday evening.", "sage")}

        ${dialogue([
          { speaker: "Fatima", avatar: "👩🏿", text: "Everyone, listen carefully. You <strong>must</strong> keep your Social Security number private. Never put it in a text or email.", side: "left", tone: "sage" },
          { speaker: "Student", avatar: "🧑🏽", text: "What if a website asks for it?", side: "right", tone: "blue" },
          { speaker: "Fatima", avatar: "👩🏿", text: "You <strong>must not</strong> give it unless you are 100% sure the site is official. Government sites end in .gov.", side: "left", tone: "sage" },
          { speaker: "Student", avatar: "🧑🏽", text: "And my PIN number?", side: "right", tone: "blue" },
          { speaker: "Fatima", avatar: "👩🏿", text: "You <strong>must</strong> keep that private too. Your bank will <strong>never</strong> ask for it by text or phone.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Must</strong> = strong obligation. It is required, not just a good idea. <strong>Must not</strong> (mustn't) = prohibition. It is not allowed. Do not do this.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>You <strong>must</strong> keep your password private.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>You <strong>must</strong> report it to the bank if you see a charge you don't recognize.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>You <strong>must not</strong> share your PIN with anyone.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>You <strong>must not</strong> give your Social Security number over the phone to a stranger.</em></span>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Don't confuse must not and don't have to.</strong><br>
          <em>You <strong>must not</strong> share your PIN.</em> = It is forbidden. Never do it.<br>
          <em>You <strong>don't have to</strong> use a special browser.</em> = It is not required, but you can if you want.</p>
        </div>
      `,
      exercises: [
        {
          id: "must-1",
          title: "Required or forbidden?",
          instructions: "Choose must or must not, and check your understanding.",
          items: [
            {
              type: "radio",
              label: "Fatima says: \"You ___ give your Social Security number to a stranger on the phone.\"",
              options: [
                { value: "a", label: "must" },
                { value: "b", label: "must not" },
                { value: "c", label: "should" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence uses \"must\" correctly?",
              options: [
                { value: "a", label: "You must to keep your PIN private." },
                { value: "b", label: "You must keeping your PIN private." },
                { value: "c", label: "You must keep your PIN private." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"You don't have to use two-step login.\" What does this mean?",
              options: [
                { value: "a", label: "It is forbidden to use two-step login." },
                { value: "b", label: "It is not required, but it is a good idea." },
                { value: "c", label: "You must use two-step login." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: You ___ report it immediately if someone steals your card. (must / must not)",
              expectedAnswers: ["must"],
            },
          ],
        },
        {
          id: "must-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["You", "must", "not", "share", "your", "password", "with", "anyone"],
              correctAnswer: "You must not share your password with anyone",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Contrast: Can vs. Should vs. Must
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting It Together. Which Modal Fits?",
      icon: "🤔",
      explanation: `
        ${sceneCard("scenePhoneScam", "East Boston neighborhood. Ana shows Bruno a suspicious text message.", "terracotta")}

        ${dialogue([
          { speaker: "Ana", avatar: "👩🏾", text: "Bruno, look at this text. It says I won a prize and I <em>must</em> click this link right now.", side: "right", tone: "terracotta" },
          { speaker: "Bruno", avatar: "👨🏽", text: "That looks like a scam. You <strong>should</strong> not click that link.", side: "left", tone: "blue" },
          { speaker: "Ana", avatar: "👩🏾", text: "It says it's from my bank. <strong>Can</strong> my bank really send messages like this?", side: "right", tone: "terracotta" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Real banks <strong>can</strong> send texts, but they never ask for your password or PIN. You <strong>must not</strong> reply with any personal information.", side: "left", tone: "blue" },
          { speaker: "Ana", avatar: "👩🏾", text: "OK. I <strong>should</strong> call the bank directly to check?", side: "right", tone: "terracotta" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Exactly. Use the number on the back of your card. That's always safe.", side: "left", tone: "blue" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">The three modals side by side:</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(106,141,115,0.12)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Modal</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Meaning</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">can / can't</td>
                <td style="padding: 0.6rem 0.75rem">ability or possibility</td>
                <td style="padding: 0.6rem 0.75rem"><em>Scammers <strong>can</strong> look like your bank.</em></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">should / shouldn't</td>
                <td style="padding: 0.6rem 0.75rem">advice, recommendation</td>
                <td style="padding: 0.6rem 0.75rem"><em>You <strong>should</strong> call your bank directly.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">must / must not</td>
                <td style="padding: 0.6rem 0.75rem">strong rule, prohibition</td>
                <td style="padding: 0.6rem 0.75rem"><em>You <strong>must not</strong> click unknown links.</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>All three modals use the same form:</strong> modal + base verb (no -s, no -ing, no "to").<br>
          <em>She <strong>can see</strong> it. &nbsp; You <strong>should check</strong> it. &nbsp; He <strong>must report</strong> it.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "contrast-1",
          title: "Choose the right modal",
          instructions: "Pick can, should, or must not based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Ana gets a text asking for her PIN. Which sentence gives the best advice?",
              options: [
                { value: "a", label: "You can share your PIN if it looks official." },
                { value: "b", label: "You should share your PIN to be safe." },
                { value: "c", label: "You must not share your PIN. Call your bank." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Which modal fits? \"Scammers ___ pretend to be your bank.\"",
              options: [
                { value: "a", label: "can" },
                { value: "b", label: "should" },
                { value: "c", label: "must not" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence is NOT correct?",
              options: [
                { value: "a", label: "You should to call your bank." },
                { value: "b", label: "You must keep your password private." },
                { value: "c", label: "You can use the library wifi for browsing." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Fill in with the right modal (can, should, or must not): You ___ click on links from numbers you don't recognize.",
              expectedAnswers: ["must not", "shouldn't", "should not"],
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
              words: ["You", "should", "call", "the", "bank", "directly", "if", "you", "are", "not", "sure"],
              correctAnswer: "You should call the bank directly if you are not sure",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/modals-obligation-permission\" style=\"font-weight:700;text-decoration:underline\">Modals: Obligation + Permission Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "can-should-must-q1",
      question: "Claudette is setting up her phone at the library. Which sentence is correct?",
      options: [
        { value: "a", label: "She can uses the library wifi for free." },
        { value: "b", label: "She can use the library wifi for free." },
        { value: "c", label: "She can to use the library wifi for free." },
      ],
      correctAnswer: "b",
      explanation: "Modal verbs (can, should, must) are always followed by the base verb with no changes.",
      topic: "can",
      skill: "usage",
      skillTag: "modal-base-verb-form",
      difficulty: "easy",
    },
    {
      id: "can-should-must-q2",
      question: "Miguel reads a digital safety flyer. Which advice is correct?",
      options: [
        { value: "a", label: "You should use the same password on every site." },
        { value: "b", label: "You shouldn't use the same password on every site." },
        { value: "c", label: "You must use the same password on every site." },
      ],
      correctAnswer: "b",
      explanation: "Using the same password on every site is dangerous. The flyer gives advice against it with 'shouldn't'.",
      topic: "should",
      skill: "usage",
      skillTag: "meaning-advice",
      difficulty: "easy",
    },
    {
      id: "can-should-must-q3",
      question: "Fatima says: \"Your bank will never ask for your PIN by text.\" What does this mean for you?",
      options: [
        { value: "a", label: "You should reply with your PIN if a text looks official." },
        { value: "b", label: "You must not share your PIN by text, even if it looks like your bank." },
        { value: "c", label: "You can share your PIN only if you trust the number." },
      ],
      correctAnswer: "b",
      explanation: "A real bank will never ask for your PIN by text. Must not signals a strong prohibition.",
      topic: "must",
      skill: "usage",
      skillTag: "meaning-prohibition",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q4",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "You must report a lost card immediately." },
        { value: "b", label: "You should checks your account every week." },
        { value: "c", label: "Scammers can look like your bank online." },
      ],
      correctAnswer: "b",
      explanation: "'Should' is followed by the base verb. 'Checks' should be 'check'.",
      topic: "should",
      skill: "error-detection",
      skillTag: "modal-base-verb-form",
      difficulty: "easy",
    },
    {
      id: "can-should-must-q5",
      question: "Ana gets a text saying she won a prize. She's not sure if it's real. Which is the best response?",
      options: [
        { value: "a", label: "She can click the link to find out more." },
        { value: "b", label: "She should ignore the text and tell no one." },
        { value: "c", label: "She should not click the link and she must not reply with personal information." },
      ],
      correctAnswer: "c",
      explanation: "Combining should not (advice) and must not (strong rule) gives the safest response to a suspected scam.",
      topic: "should-must",
      skill: "usage",
      skillTag: "meaning-advice-vs-prohibition",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q6",
      question: "\"You don't have to use a special browser for online banking.\" What does this mean?",
      options: [
        { value: "a", label: "It is forbidden to use a special browser." },
        { value: "b", label: "It is required to use a special browser." },
        { value: "c", label: "It is not required, but you can if you want." },
      ],
      correctAnswer: "c",
      explanation: "'Don't have to' means it is not required. It is different from 'must not,' which means it is forbidden.",
      topic: "must",
      skill: "recognition",
      skillTag: "must-not-vs-dont-have-to",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q7",
      question: "Which sentence uses the correct modal for this situation? A website is asking Bruno for his Social Security number.",
      options: [
        { value: "a", label: "He should give it if the site looks safe." },
        { value: "b", label: "He must not give it unless the site is an official .gov site." },
        { value: "c", label: "He can give it because the site has a lock icon." },
      ],
      correctAnswer: "b",
      explanation: "Your Social Security number is protected information. 'Must not' signals the strongest warning.",
      topic: "must",
      skill: "usage",
      skillTag: "meaning-prohibition",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q8",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "You can change your password anytime." },
        { value: "b", label: "You must not to share your login with others." },
        { value: "c", label: "You should use a strong password." },
      ],
      correctAnswer: "b",
      explanation: "'Must not' is followed by the base verb. 'To share' should be 'share'.",
      topic: "must",
      skill: "error-detection",
      skillTag: "modal-base-verb-form",
      difficulty: "easy",
    },
    {
      id: "can-should-must-q9",
      question: "Linh explains what public wifi can and can't do. Which sentence is true?",
      options: [
        { value: "a", label: "Public wifi can protect your bank information automatically." },
        { value: "b", label: "Someone on the same public wifi can sometimes see your activity." },
        { value: "c", label: "You must use public wifi to check your bank account." },
      ],
      correctAnswer: "b",
      explanation: "'Can' describes what is possible. On public wifi, others can sometimes see your activity.",
      topic: "can",
      skill: "usage",
      skillTag: "meaning-possibility",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q10",
      question: "A text from an unknown number says: \"You must call us NOW or your account will close.\" What is this?",
      options: [
        { value: "a", label: "A real message from your bank. You should call the number in the text." },
        { value: "b", label: "Probably a scam. You must not call that number. You should call the number on your card." },
        { value: "c", label: "A mistake. You can ignore it and click the link to see more." },
      ],
      correctAnswer: "b",
      explanation: "Pressure language like 'NOW' is a sign of a scam. Always call the number on the back of your card, not the number in a suspicious text.",
      topic: "can-should-must",
      skill: "usage",
      skillTag: "meaning-real-world-choice",
      difficulty: "hard",
    },
  ],
};
