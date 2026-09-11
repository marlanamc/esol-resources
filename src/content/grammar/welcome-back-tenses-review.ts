import type { InteractiveGuideContent } from "@/types/activity";
import { welcomeBackImages as img } from "@/data/welcome-back-images.generated";

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

export const welcomeBackTensesReviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "you-already-know-this",
      title: "Four tenses, one bus ride",
      icon: "🚌",
      explanation: `
        ${sceneCard("sceneBusStop", "Tuesday evening, 5:45 PM. Rosa heads to the 121 bus after work.", "terracotta")}
        <p>Welcome back! Catch up with Rosa and David. Read for the message first.</p>
        ${dialogue([
          { speaker: "David", avatar: "🧑🏽", text: "Hey, Rosa! Ready to be back?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Almost! Last night I <strong>was doing</strong> the dishes when my daughter <strong>said</strong>, ‘Mom, school starts tomorrow!’", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "🧑🏽", text: "Oh no. Where was her backpack?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Good question! We <strong>leave</strong> everything by the door on school nights. But last night? We couldn’t even find her shoes.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "🧑🏽", text: "That sounds like my house. How’s today going?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Better. My sister <strong>is helping</strong> with the kids this week. Now I just need to find MY notebook!", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Time words give clues. Think about the situation.</strong></p>
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.12)">
          <p>These names help us talk about corrections. You don’t need to name the tense before speaking.</p>
          <ul style="padding-left: 1.25rem; line-height: 1.7">
            <li><strong>Present simple:</strong> a routine or stable fact. “We leave everything by the door on school nights.”</li>
            <li><strong>Present continuous:</strong> happening now or temporarily. “My sister is helping with the kids this week.”</li>
            <li><strong>Past simple:</strong> a completed past event. “My daughter reminded me about school.”</li>
            <li><strong>Past continuous:</strong> in progress at a past moment. “I was doing the dishes.”</li>
          </ul>
        </div>
      `,
      exercises: [{
        id: "wbtr-know-1",
        title: "What is Rosa telling David?",
        instructions: "Choose the meaning that fits their conversation.",
        items: [
          {
            type: "radio", label: "Why is today easier for Rosa?",
            options: [
              { value: "usual", label: "The children don’t have school." },
              { value: "temporary", label: "Her sister is helping with the kids this week." },
              { value: "finished", label: "She found her notebook." },
            ], expectedAnswer: "temporary",
          },
          {
            type: "radio", label: "What was Rosa doing when her daughter mentioned school?",
            options: [
              { value: "kids", label: "Rosa was doing the dishes." },
              { value: "bus", label: "Rosa was riding the bus." },
              { value: "work", label: "Rosa was working at the clinic." },
            ], expectedAnswer: "kids",
          },
        ],
      }],
    },
    {
      id: "present-simple-review",
      stepNumber: 1,
      title: "Your usual routine · Present Simple",
      icon: "🔄",
      tenseDiagram: {
        title: "A routine that repeats",
        elements: [{ id: "ps-dot", type: "multiple-dots", zone: "present", position: 50 }],
      },
      explanation: `
        ${sceneCard("sceneNeighborhood", "East Boston. Tuesday evening after work.", "sage")}

        ${dialogue([
          { speaker: "Classmate", avatar: "🧑🏽", text: "You always have snacks in that bag!", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Of course. My daughter <strong>gets</strong> hungry the minute we leave the house.", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "Mine too. He <strong>says</strong>, ‘I’m not hungry.’ Then he <strong>eats</strong> my sandwich.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Exactly! I <strong>pack</strong> two now. One for her and one for me.", side: "right", tone: "terracotta" },
        ])}

        <p>Rosa and her classmate know this routine well. What do you always carry in your bag?</p>
        <p><strong>Quick form check:</strong> I/you/we/they <strong>work</strong>; he/she/it <strong>works</strong>.</p>
      `,
      exercises: [{
        id: "wbtr-ps-fix",
        title: "Tell someone about the routine",
        instructions: "Choose or type the form that fits. For a blank, type only the missing word.",
        items: [
          {
            type: "radio", label: "Rosa says, “I pack a snack every day. My daughter eat it on the bus.” Fix the second sentence.",
            options: [
              { value: "eat", label: "My daughter eat it on the bus." },
              { value: "eating", label: "My daughter eating it on the bus." },
              { value: "eats", label: "My daughter eats it on the bus." },
            ], expectedAnswer: "eats",
          },
          { type: "text", label: "“My son always ___ for a snack as soon as we get on the bus.” (ask)", expectedAnswers: ["asks"] },
          { type: "text", label: "“We ___ two sandwiches every morning. One is never enough!” (pack)", expectedAnswers: ["pack"] },
        ],
      }],
    },
    {
      id: "present-continuous-review",
      stepNumber: 2,
      title: "What’s happening now? · Present Continuous",
      icon: "▶️",
      tenseDiagram: {
        title: "An action in progress now",
        elements: [{ id: "pc-line", type: "solid-line", zone: "present", position: 50 }],
      },
      explanation: `
        ${sceneCard("scenePhone", "Before class, Rosa gets a message from her sister.", "blue")}

        ${dialogue([
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "Quick question. Where’s the rice?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Top shelf, next to the pasta. What <strong>are</strong> you <strong>making</strong>?", side: "right", tone: "terracotta" },
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "I<strong>’m making</strong> dinner. Your daughter <strong>is helping</strong> me. Well, she<strong>’s eating</strong> the carrots.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "She’s checking that they’re good! Save me some dinner. I’m hungry already.", side: "right", tone: "terracotta" },
        ])}

        <p>Rosa’s sister is making dinner while Rosa waits for class. What’s happening at your home right now?</p>
        <p><strong>Quick form check:</strong> use <strong>am/is/are + verb-ing</strong>: “I’m making dinner.”</p>
      `,
      exercises: [{
        id: "wbtr-pc-contrast",
        title: "Give an update",
        instructions: "Think about what is happening. For a blank, type only the missing words.",
        items: [
          { type: "text", label: "Rosa’s sister sends a photo from the kitchen: “Your daughter ___ all the carrots!” (eat)", expectedAnswers: ["is eating"] },
          {
            type: "radio", label: "Rosa’s sister usually works evenings. This week she’s off. Which message tells Rosa about her help just for this week?",
            options: [
              { value: "routine", label: "I make dinner for your kids every week." },
              { value: "temporary", label: "I’m making dinner for your kids this week." },
              { value: "past", label: "I made dinner for your kids last week." },
            ], expectedAnswer: "temporary",
          },
          { type: "text", label: "Her sister texts: “We’re in the kitchen. We ___ dinner now. Come hungry!” (make)", expectedAnswers: ["are making"] },
        ],
      }],
    },
    {
      id: "past-tenses-review",
      stepNumber: 3,
      title: "Tell a past story · Past Simple and Continuous",
      icon: "⏪",
      tenseDiagram: {
        title: "An event during an action in progress",
        elements: [
          { id: "past-simple-dot", type: "single-dot", zone: "past", position: 58 },
          { id: "past-cont-line", type: "solid-line", zone: "past", position: 35 },
        ],
      },
      explanation: `
        ${sceneCard("sceneClassroom", "Back in class, everyone has a first-day story.", "amber")}

        ${dialogue([
          { speaker: "Teacher", avatar: "👩‍🏫", text: "How was the first morning back? Everyone on time?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "Almost. We <strong>were waiting</strong> for the bus when my son <strong>looked</strong> down at his feet. Two different shoes.", side: "right", tone: "sage" },
          { speaker: "Teacher", avatar: "👩‍🏫", text: "Oh no! What did you do?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "We <strong>ran</strong> home. I <strong>found</strong> his other shoe under the sofa. Right next to my keys!", side: "right", tone: "sage" },
        ])}

        <p>They were already waiting for the bus when the boy noticed his shoes. Then they ran home.</p>
        <p><strong>Quick form check:</strong> past simple uses a past form, such as <strong>looked</strong> or <strong>found</strong>. Past continuous uses <strong>was/were + verb-ing</strong>.</p>
        <p>“Yesterday” can go with either tense: “Yesterday I cooked dinner.” “Yesterday at six, I was cooking dinner.” The speaker’s meaning matters.</p>
      `,
      exercises: [{
        id: "wbtr-past-1",
        title: "Two different shoes",
        instructions: "Complete the story. Type only the missing words.",
        items: [
          { type: "text", label: "The bus wasn’t there yet. “We ___ at the stop when my son noticed his shoes.” (wait)", expectedAnswers: ["were waiting"] },
          { type: "text", label: "“We ran home. I ___ the other shoe under the sofa and gave it to him.” (find)", expectedAnswers: ["found"] },
          { type: "text", label: "“My son was still getting ready when the bus arrived. He ___ on his shoe.” (put)", expectedAnswers: ["was putting"] },
        ],
      }],
    },
    {
      id: "your-catch-up",
      stepNumber: 4,
      title: "Your turn: catch up, check, try again",
      icon: "💬",
      explanation: `
        <p><strong>First, try it with support.</strong> Say the replies aloud or write them in your notebook. Use your own details. These answers are not graded.</p>
        ${dialogue([
          { speaker: "Classmate", avatar: "🧑🏽", text: "What’s one thing you always do before you leave home?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "I usually …", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "Anything different at home or work this week?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "This week, I am …", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "Any surprises this week? Something you forgot, a funny moment, or a change of plans?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "I was … when …", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Now make it yours.</strong> Look away from the starters. Catch up with a partner, speak aloud to yourself, or write a short message: share your routine, something temporary, and a past story. You can invent details.</p>
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.12)">
          <p><strong>Say it → check one sentence → say it again.</strong></p>
          <p>“I doing the dishes when my daughter reminded me about school.”</p>
          <p>I mean the dishes were not finished yet. <strong>Past continuous needs was/were.</strong></p>
          <p>“I <strong>was doing</strong> the dishes when my daughter reminded me about school.”</p>
        </div>
        <p>Choose just one sentence from your catch-up. Does it express your meaning? Use the tense reference if you need help checking the verb. Then say or write the sentence again. If it already works, keep it!</p>
      `,
    },
  ],
  miniQuiz: [
    {
      id: "wbtr-q1",
      question: "“Why do you always bring two sandwiches?” Which answer explains Rosa’s routine?",
      options: [
        { value: "a", label: "I’m packing a sandwich for my sister today." },
        { value: "b", label: "My daughter eats one of them on the bus." },
        { value: "c", label: "I forgot my lunch yesterday." },
      ], correctAnswer: "b",
      explanation: "Present simple describes what usually happens: ‘My daughter eats one of them.’",
      topic: "present-simple", skill: "usage", skillTag: "meaning-routine-vs-now", difficulty: "easy",
    },
    {
      id: "wbtr-qfb1", type: "fill-blank" as const,
      question: "Rosa’s sister sends a photo of dinner on the stove: “I ___ rice. Do you want some?” (cook)",
      correctAnswer: "am cooking", acceptedAnswers: ["Am cooking", "'m cooking", "’m cooking"],
      explanation: "Present continuous describes what is happening now: ‘I’m cooking rice.’ I’m means I am.",
      topic: "present-continuous", skill: "usage", skillTag: "form-am-verb-ing", difficulty: "easy",
    },
    {
      id: "wbtr-past-event",
      question: "“We couldn’t find her shoes. Then my daughter ___ under the sofa and found them.” (look)",
      options: [
        { value: "a", label: "looked" },
        { value: "b", label: "look" },
        { value: "c", label: "looking" },
      ], correctAnswer: "a",
      explanation: "Past simple tells what happened next: ‘My daughter looked under the sofa.’",
      topic: "past-simple", skill: "usage", skillTag: "form-past-simple", difficulty: "easy",
    },
    {
      id: "wbtr-past-background",
      question: "‘I was doing the dishes when my daughter reminded me about school.’ What was happening?",
      options: [
        { value: "a", label: "Rosa started the dishes after the reminder." },
        { value: "b", label: "Rosa had already finished the dishes." },
        { value: "c", label: "Rosa was still doing the dishes when her daughter spoke." },
      ], correctAnswer: "c",
      explanation: "Past continuous (‘was doing’) shows what Rosa was in the middle of. Past simple (‘reminded’) tells what happened during it.",
      topic: "past-continuous", skill: "usage", skillTag: "meaning-past-background", difficulty: "easy",
    },
    {
      id: "wbtr-q4",
      question: "Repair this past story: \"I looking for my keys when the bus arrived.\"",
      options: [
        { value: "a", label: "I am looking for my keys when the bus arrived." },
        { value: "b", label: "I was looking for my keys when the bus arrived." },
        { value: "c", label: "I were looking for my keys when the bus arrived." },
      ], correctAnswer: "b",
      explanation: "Past continuous needs was/were + verb-ing. With I, use was. Say the repaired sentence again: ‘I was looking for my keys when the bus arrived.’",
      topic: "past-continuous", skill: "error-detection", skillTag: "form-past-cont-interruption", difficulty: "easy",
    },
  ],
};
