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

export const canShouldMustContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Can / Can't
    // =========================================================================
    {
      id: "can-ability",
      title: "Can. What Your New Phone Can Do",
      icon: "📱",
      explanation: `
        ${sceneCard("sceneLibraryTech", "East Boston Branch Library, tech help table. Tuesday, 4:30 PM, after work.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Claudette's old phone broke last week. Her daughter Nadège lives in Haiti, and they talk every Sunday. Ryan at the library's tech help table sets up her new phone.</p>

        ${dialogue([
          { speaker: "Ryan", avatar: "👨🏽", text: "Done. Your new phone is ready. You <strong>can</strong> call, text, and video-chat now.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "<strong>Can</strong> I video-call my daughter in Haiti? My old phone was too slow.", side: "left", tone: "sage" },
          { speaker: "Ryan", avatar: "👨🏽", text: "Yes, you <strong>can</strong>. With WhatsApp and wifi, the call is free.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I <strong>can't</strong> read these little letters. <strong>Can</strong> you make them bigger?", side: "left", tone: "sage" },
          { speaker: "Ryan", avatar: "👨🏽", text: "Sure. And look, I saved Nadège's number. You <strong>can</strong> call her with one touch.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Perfect. Now I <strong>can</strong> see her face every Sunday.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Can</strong> = ability or possibility. Something is possible, or a person is able to do it. <strong>Can't</strong> = it is not possible, or not able.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("ability", "sage")}
            <span><em>Claudette <strong>can</strong> video-call her daughter now.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("possibility", "sage")}
            <span><em>You <strong>can</strong> make the letters bigger in Settings.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not able", "blue")}
            <span><em>She <strong>can't</strong> read the small letters.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> can + base verb (no -s, no -ing, no "to")<br>
          <em>She <strong>can call</strong> her daughter.</em> &nbsp; Not: <s>she can calls</s> &nbsp; Not: <s>she can to call</s></p>
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
              label: "Claudette wants to call her daughter. Which sentence is correct?",
              options: [
                { value: "a", label: "She can calls Nadège on WhatsApp." },
                { value: "b", label: "She can call Nadège on WhatsApp." },
                { value: "c", label: "She can to call Nadège on WhatsApp." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "With wifi, Claudette ___ video-call Haiti for free.",
              options: [
                { value: "a", label: "can" },
                { value: "b", label: "can't" },
                { value: "c", label: "must" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Fill in: Claudette ___ (can / can't) read the small letters, so Ryan makes them bigger.",
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
              words: ["Ryan", "can", "make", "the", "letters", "bigger", "for", "you"],
              correctAnswer: "Ryan can make the letters bigger for you",
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
      title: "Should. Advice From a Neighbor",
      icon: "💡",
      explanation: `
        ${sceneCard("scenePhoneScam", "Wednesday, 10:40 PM. Claudette reads a text from a number she doesn't know.", "amber")}

        <p style="margin: 0 0 0.75rem 0; line-height: 1.6">The next night, a text comes from a new number:</p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><em>"Hi Mom, it's me. I dropped my phone, so this is my new number. I need $200 for a new phone. Can you send it tonight?"</em></p>
        </div>

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Claudette calls her neighbor Bruno.</p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏾", text: "Bruno, sorry it's late. Nadège says she has a new number. She needs $200 tonight.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Wait. You <strong>shouldn't</strong> send anything yet. Scammers send texts like this all the time.", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "But what if it's really her? What <strong>should</strong> I do?", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "You <strong>should</strong> call her old number first. The one Ryan saved for you.", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I tried. No answer. Maybe she's sleeping.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Then you <strong>should</strong> text the new number a question only Nadège knows. Ask the name of your old dog.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Should</strong> = advice or a recommendation. It is a good idea. <strong>Shouldn't</strong> = advice against something. It is not a good idea.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("good idea", "sage")}
            <span><em>You <strong>should</strong> call your daughter's old number first.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("good idea", "sage")}
            <span><em>You <strong>should</strong> ask a question only your family knows.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("bad idea", "amber")}
            <span><em>You <strong>shouldn't</strong> send money to a new number before you check.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("bad idea", "amber")}
            <span><em>You <strong>shouldn't</strong> click on links in texts from numbers you don't know.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Should</strong> is softer than <strong>must</strong>. It gives advice, not a rule. A friend, a neighbor, or a doctor might say <em>should</em>. A law or a bank's rule says <em>must</em>.</p>
        </div>
      `,
      exercises: [
        {
          id: "should-1",
          title: "Good idea or bad idea?",
          instructions: "Choose should or shouldn't to complete Bruno's advice.",
          items: [
            {
              type: "radio",
              label: "Bruno says: \"___ send money before you call Nadège.\"",
              options: [
                { value: "a", label: "You should" },
                { value: "b", label: "You shouldn't" },
                { value: "c", label: "You must" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Claudette wants to check the text. Which advice is correct?",
              options: [
                { value: "a", label: "She should calling Nadège's old number." },
                { value: "b", label: "She should call Nadège's old number." },
                { value: "c", label: "She should to call Nadège's old number." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: If the new number sends a link, Claudette ___ (should / shouldn't) click on it.",
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
              words: ["Claudette", "should", "ask", "about", "the", "old", "dog"],
              correctAnswer: "Claudette should ask about the old dog",
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
        ${sceneCard("sceneLibraryFlyer", "Claudette's bank, Thursday, 8:10 AM, before work. She reads a fraud notice in the lobby.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Claudette asked the new number about the dog. It didn't answer the question. But at 2 AM, one more text came: <em>"Mom, just send me your card number and PIN. I'll do it myself."</em> Before work, Claudette stops at her bank. A notice on the board says: <strong>We will NEVER ask for your PIN by text, email, or phone.</strong></p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏾", text: "Your sign says you never ask for a PIN. Someone texted me for mine last night.", side: "left", tone: "sage" },
          { speaker: "Jessica", avatar: "👩🏼", text: "That wasn't us. You <strong>must not</strong> share your PIN with anyone. Not even family.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I didn't send it. I didn't send any money either.", side: "left", tone: "sage" },
          { speaker: "Jessica", avatar: "👩🏼", text: "Good. If you ever share your card number by mistake, you <strong>must</strong> call us right away.", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Do I have to come here, or can I call?", side: "left", tone: "sage" },
          { speaker: "Jessica", avatar: "👩🏼", text: "You don't have to come in. You can call the number on the back of your card.", side: "right", tone: "blue" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Must</strong> = strong obligation. It is required, not just a good idea. <strong>Must not</strong> (mustn't) = prohibition. It is not allowed. Do not do this.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>You <strong>must</strong> keep your PIN private.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>You <strong>must</strong> call the bank right away if someone has your card number.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>You <strong>must not</strong> share your PIN with anyone, not even family.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>You <strong>must not</strong> give your card number to a stranger by text.</em></span>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Don't confuse must not and don't have to.</strong><br>
          <em>You <strong>must not</strong> share your PIN.</em> = It is forbidden. Never do it.<br>
          <em>You <strong>don't have to</strong> come to the bank.</em> = It is not required. You can come in if you want, or you can call.</p>
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
              label: "Jessica at the bank says: \"You ___ share your PIN with anyone, not even family.\"",
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
                { value: "a", label: "You must to report the text to the bank." },
                { value: "b", label: "You must reporting the text to the bank." },
                { value: "c", label: "You must report the text to the bank." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"You don't have to come to the bank. You can call.\" What does this mean?",
              options: [
                { value: "a", label: "It is forbidden to come to the bank." },
                { value: "b", label: "Coming in is not required. Calling is OK too." },
                { value: "c", label: "You must come to the bank." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: If someone has your card number, you ___ call the bank right away. (must / must not)",
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
              words: ["You", "must", "not", "text", "your", "card", "number", "to", "anyone"],
              correctAnswer: "You must not text your card number to anyone",
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
        ${sceneCard("sceneCommunityWorkshop", "Evening ESOL class, Thursday. Ms. Tran asks Claudette to tell the class her story.", "terracotta")}

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩🏻", text: "Claudette, you got a strange text this week. <strong>Can</strong> you tell the class?", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "A \"new number\" said it was my daughter. It asked for $200, then my PIN.", side: "left", tone: "terracotta" },
          { speaker: "Ms. Tran", avatar: "👩🏻", text: "That's a common scam. What <strong>should</strong> people do?", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "You <strong>shouldn't</strong> send anything. You <strong>should</strong> call the real number. And you <strong>must</strong> never share your PIN.", side: "left", tone: "terracotta" },
          { speaker: "Ms. Tran", avatar: "👩🏻", text: "And did you reach Nadège?", side: "right", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Yes! This morning she video-called me. Her phone was fine the whole time. She never sent that text.", side: "left", tone: "terracotta" },
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
                <td style="padding: 0.6rem 0.75rem"><em>Scammers <strong>can</strong> pretend to be your family.</em></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">should / shouldn't</td>
                <td style="padding: 0.6rem 0.75rem">advice, recommendation</td>
                <td style="padding: 0.6rem 0.75rem"><em>You <strong>should</strong> call the real number.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">must / must not</td>
                <td style="padding: 0.6rem 0.75rem">strong rule, prohibition</td>
                <td style="padding: 0.6rem 0.75rem"><em>You <strong>must not</strong> share your PIN.</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>All three modals use the same form:</strong> modal + base verb (no -s, no -ing, no "to").<br>
          <em>She <strong>can call</strong> her. &nbsp; You <strong>should check</strong> it. &nbsp; He <strong>must report</strong> it.</em></p>
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
              label: "The \"new number\" asks Claudette for her PIN. Which sentence gives the best advice?",
              options: [
                { value: "a", label: "You can share your PIN if it's your daughter." },
                { value: "b", label: "You should share your PIN to help her." },
                { value: "c", label: "You must not share your PIN. Call your bank." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Which modal fits? \"Scammers ___ pretend to be your son or daughter.\"",
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
                { value: "a", label: "You should to call your daughter's real number." },
                { value: "b", label: "You must keep your PIN private." },
                { value: "c", label: "You can video-call Haiti with wifi." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Fill in with the right modal (can, should, or must not): You ___ send money to a new number before you check.",
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
              words: ["You", "should", "call", "your", "daughter", "directly", "if", "you", "are", "not", "sure"],
              correctAnswer: "You should call your daughter directly if you are not sure",
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
      question: "Claudette is setting up her new phone at the library. Which sentence is correct?",
      options: [
        { value: "a", label: "She can video-calls her daughter for free." },
        { value: "b", label: "She can video-call her daughter for free." },
        { value: "c", label: "She can to video-call her daughter for free." },
      ],
      correctAnswer: "b",
      explanation: "Modal verbs (can, should, must) are always followed by the base verb with no changes.",
      topic: "can",
      skill: "usage",
      skillTag: "modal-base-verb-form",
      difficulty: "easy",
    },
    {
      id: "can-should-must-q4",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "You must call the bank if someone has your card number." },
        { value: "b", label: "You should calls your daughter's old number first." },
        { value: "c", label: "Scammers can pretend to be your family." },
      ],
      correctAnswer: "b",
      explanation: "'Should' is followed by the base verb. 'Calls' should be 'call'.",
      topic: "should",
      skill: "error-detection",
      skillTag: "modal-base-verb-form",
      difficulty: "easy",
    },
    {
      id: "csm-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"You ___ not share your PIN, not even with family. This is a strong rule, not just advice.\" (must / should / can)",
      correctAnswer: "must",
      explanation: "'Must not' is the strongest prohibition. 'Should not' is advice; 'cannot' is about ability.",
      topic: "must",
      skill: "usage",
      skillTag: "meaning-prohibition",
      difficulty: "medium",
    },
    {
      id: "csm-qws1",
      type: "word-scramble" as const,
      question: "Jessica at the bank warns Claudette about her card. Put the words in order.",
      words: ["You", "must", "not", "send", "your", "PIN"],
      correctAnswer: "You must not send your PIN",
      hint: "must not + base verb",
      explanation: "Must not + base verb for a strong prohibition. No 'to' after must.",
      topic: "must",
      skill: "usage",
      skillTag: "modal-base-verb-form",
      difficulty: "medium",
    },
    {
      id: "can-should-must-q6",
      question: "\"You don't have to come to the bank. You can call the number on your card.\" What does this mean?",
      options: [
        { value: "a", label: "Coming to the bank is forbidden." },
        { value: "b", label: "Coming to the bank is required." },
        { value: "c", label: "Coming to the bank is optional." },
      ],
      correctAnswer: "c",
      explanation: "'Don't have to' means it is not required. It is different from 'must not,' which means it is forbidden.",
      topic: "must",
      skill: "recognition",
      skillTag: "must-not-vs-dont-have-to",
      difficulty: "medium",
    },
  ],
};
