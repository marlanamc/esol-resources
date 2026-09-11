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
          { speaker: "David", avatar: "🧑🏽", text: "Good to see you! How do you get to class?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "I <strong>take</strong> the 121. This week, I <strong>am working</strong> shorter shifts, so I can get here early.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "🧑🏽", text: "Nice! How was your day off yesterday?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Busy! I <strong>was getting</strong> my kids ready when my neighbor <strong>knocked</strong> on the door.", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Time words give clues. Think about the situation.</strong></p>
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.12)">
          <p>These names help us talk about corrections. You don’t need to name the tense before speaking.</p>
          <ul style="padding-left: 1.25rem; line-height: 1.7">
            <li><strong>Present simple:</strong> a routine or stable fact. “I take the bus to class.”</li>
            <li><strong>Present continuous:</strong> happening now or temporarily. “I am working shorter shifts this week.”</li>
            <li><strong>Past simple:</strong> a completed past event. “My neighbor knocked on the door.”</li>
            <li><strong>Past continuous:</strong> in progress at a past moment. “I was getting my kids ready.”</li>
          </ul>
        </div>
      `,
      exercises: [{
        id: "wbtr-know-1",
        title: "What is Rosa telling David?",
        instructions: "Choose the meaning that fits their conversation.",
        items: [
          {
            type: "radio", label: "What is different about Rosa’s work this week?",
            options: [
              { value: "usual", label: "She describes her usual shifts all year." },
              { value: "temporary", label: "Her shifts are shorter for a short time." },
              { value: "finished", label: "She no longer works there." },
            ], expectedAnswer: "temporary",
          },
          {
            type: "radio", label: "What was already happening when the neighbor knocked?",
            options: [
              { value: "kids", label: "Rosa was getting her kids ready." },
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
          { speaker: "Classmate", avatar: "🧑🏽", text: "How <strong>do</strong> you <strong>get</strong> to class?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "The 121. I <strong>work</strong> days, so I <strong>come</strong> straight from Meridian Street.", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "I <strong>take</strong> the Blue Line from Revere. Class <strong>starts</strong> at six, right?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Six on the dot. Tuesdays and Thursdays, <strong>every</strong> week.", side: "right", tone: "terracotta" },
        ])}

        <p>They are describing their usual routine. What is your usual way to get to class?</p>
        <p><strong>Quick form check:</strong> I/you/we/they <strong>work</strong>; he/she/it <strong>works</strong>.</p>
      `,
      exercises: [{
        id: "wbtr-ps-fix",
        title: "Tell someone about the routine",
        instructions: "Choose or type the form that fits. For a blank, type only the missing word.",
        items: [
          {
            type: "radio", label: "Rosa describes her regular job: “I work at a clinic. My sister work there, too.” Fix the second sentence.",
            options: [
              { value: "work", label: "My sister work there, too." },
              { value: "working", label: "My sister working there, too." },
              { value: "works", label: "My sister works there, too." },
            ], expectedAnswer: "works",
          },
          { type: "text", label: "Describe the regular class schedule: The community center ___ ESL classes on Tuesdays. (offer)", expectedAnswers: ["offers"] },
          { type: "text", label: "Describe the children’s usual routine: My kids ___ to school by bus. (go)", expectedAnswers: ["go"] },
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
        ${sceneCard("scenePhone", "Rosa on the 121, finishing a lesson before class", "blue")}

        ${dialogue([
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "Still on your phone? What <strong>are</strong> you <strong>doing</strong>?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "I <strong>am studying</strong>. I <strong>am trying</strong> to finish this section before we get to Maverick.", side: "right", tone: "terracotta" },
          { speaker: "Rosa's sister", avatar: "👩‍👧", text: "Rent in Eastie <strong>is going</strong> up again, huh?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏾", text: "Yeah. We <strong>are looking</strong> for something cheaper <strong>this month</strong>.", side: "right", tone: "terracotta" },
        ])}

        <p>Rosa describes what she is doing on the bus and her apartment search this month.</p>
        <p><strong>Quick form check:</strong> use <strong>am/is/are + verb-ing</strong>: “I am studying.”</p>
      `,
      exercises: [{
        id: "wbtr-pc-contrast",
        title: "Give an update",
        instructions: "Think about what is happening. For a blank, type only the missing words.",
        items: [
          { type: "text", label: "You can see Rosa at the stop now. She ___ for the bus. (wait)", expectedAnswers: ["is waiting"] },
          {
            type: "radio", label: "Carlos normally takes the bus. This week he has a car on loan. Which update emphasizes this temporary change?",
            options: [
              { value: "routine", label: "He uses his friend’s car as his regular transport." },
              { value: "temporary", label: "He is using his friend’s car this week." },
              { value: "past", label: "He used his friend’s car last year." },
            ], expectedAnswer: "temporary",
          },
          { type: "text", label: "The students are in the middle of a speaking activity. They ___ English together. (practice)", expectedAnswers: ["are practicing", "are practising"] },
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
        ${sceneCard("sceneClassroom", "First day of class. Last September.", "amber")}

        ${dialogue([
          { speaker: "Teacher", avatar: "👩‍🏫", text: "Think back to last September. What <strong>were</strong> you <strong>doing</strong> right before you <strong>walked</strong> in?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "I <strong>was sitting</strong> outside the classroom. I <strong>didn't want</strong> to be the first one in.", side: "right", tone: "sage" },
          { speaker: "Teacher", avatar: "👩‍🏫", text: "And then what <strong>happened</strong>?", side: "left", tone: "amber" },
          { speaker: "Student", avatar: "🙋", text: "I <strong>was still sitting</strong> there when Rosa <strong>opened</strong> the door and <strong>said</strong>, \"Come on in.\"", side: "right", tone: "sage" },
        ])}

        <p>The student was already sitting outside. Then Rosa opened the door.</p>
        <p><strong>Quick form check:</strong> past simple uses a past form, such as <strong>opened</strong> or <strong>went</strong>. Past continuous uses <strong>was/were + verb-ing</strong>.</p>
        <p>“Yesterday” can go with either tense: “Yesterday I cooked dinner.” “Yesterday at six, I was cooking dinner.” The speaker’s meaning matters.</p>
      `,
      exercises: [{
        id: "wbtr-past-1",
        title: "Back to that first day",
        instructions: "Complete the story. Type only the missing words.",
        items: [
          { type: "text", label: "Fatima was in the middle of her shift when the students arrived. She ___ at the front desk. (work)", expectedAnswers: ["was working"] },
          { type: "text", label: "Tell the next completed event: One student ___ a question, and Fatima answered it. (ask)", expectedAnswers: ["asked"] },
          { type: "text", label: "The students were already outside when Rosa arrived. They ___ for the classroom to open. (wait)", expectedAnswers: ["were waiting"] },
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
          { speaker: "Classmate", avatar: "🧑🏽", text: "How do you usually get to class?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "I usually …", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "What is different for you this week?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "This week, I am …", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "Tell me about something that happened during the break. What were you doing when it happened?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙋", text: "I was … when …", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Now make it yours.</strong> Look away from the starters. Catch up with a partner, speak aloud to yourself, or write a short message: share your routine, something temporary, and a past story. You can invent details.</p>
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.12)">
          <p><strong>Say it → check one sentence → say it again.</strong></p>
          <p>“I cooking when my sister called.”</p>
          <p>I mean cooking was in progress. <strong>Past continuous needs was/were.</strong></p>
          <p>“I <strong>was cooking</strong> when my sister called.”</p>
        </div>
        <p>Choose just one sentence from your catch-up. Does it express your meaning? Use the tense reference if you need help checking the verb. Then say or write the sentence again. If it already works, keep it!</p>
      `,
    },
  ],
  miniQuiz: [
    {
      id: "wbtr-q1",
      question: "A neighbor asks about the job you go to every week. Which answer describes your usual work?",
      options: [
        { value: "a", label: "I am covering a shift at a clinic just for today." },
        { value: "b", label: "I work at a clinic on Meridian Street." },
        { value: "c", label: "I worked at that clinic last year, but I left." },
      ], correctAnswer: "b",
      explanation: "Present simple describes Rosa’s regular work: ‘I work at a clinic.’",
      topic: "present-simple", skill: "usage", skillTag: "meaning-routine-vs-now", difficulty: "easy",
    },
    {
      id: "wbtr-qfb1", type: "fill-blank" as const,
      question: "Yemi is in the middle of an activity on his phone. He ___ the vocabulary app. (use)",
      correctAnswer: "is using", acceptedAnswers: ["Is using"],
      explanation: "Present continuous describes the activity in progress: ‘He is using the app.’ Use is + verb-ing.",
      topic: "present-continuous", skill: "usage", skillTag: "form-is-verb-ing", difficulty: "easy",
    },
    {
      id: "wbtr-past-event",
      question: "Rosa tells the next completed event in her story: ‘Then my neighbor ___ on the door, and I opened it.’ (knock)",
      options: [
        { value: "a", label: "knocked" },
        { value: "b", label: "knock" },
        { value: "c", label: "knocking" },
      ], correctAnswer: "a",
      explanation: "Past simple moves the story to the next completed event: ‘My neighbor knocked.’",
      topic: "past-simple", skill: "usage", skillTag: "form-past-simple", difficulty: "easy",
    },
    {
      id: "wbtr-past-background",
      question: "‘I was washing the dishes when you called.’ What does Rosa mean?",
      options: [
        { value: "a", label: "She started washing the dishes after the call." },
        { value: "b", label: "She washes the dishes every time you call." },
        { value: "c", label: "Washing the dishes was already in progress at the time of the call." },
      ], correctAnswer: "c",
      explanation: "Past continuous (‘was washing’) shows the action already in progress. Past simple (‘called’) gives the event during it.",
      topic: "past-continuous", skill: "usage", skillTag: "meaning-past-background", difficulty: "easy",
    },
    {
      id: "wbtr-q4",
      question: "Repair this past story: \"I cooking dinner when my sister called.\"",
      options: [
        { value: "a", label: "I am cooking dinner when my sister called." },
        { value: "b", label: "I was cooking dinner when my sister called." },
        { value: "c", label: "I were cooking dinner when my sister called." },
      ], correctAnswer: "b",
      explanation: "Past continuous needs was/were + verb-ing. With I, use was. Say the repaired sentence again: ‘I was cooking dinner when my sister called.’",
      topic: "past-continuous", skill: "error-detection", skillTag: "form-past-cont-interruption", difficulty: "easy",
    },
  ],
};
