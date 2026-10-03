import type { InteractiveGuideContent } from "@/types/activity";
import { verbFormsOverviewImages as img } from "@/data/verb-forms-overview-images.generated";

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

export const verbFormsOverviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "five-codes",
      title: "One missing dinner, five verb forms",
      icon: "📱",
      explanation: `
        ${sceneCard("sceneLunch", "Tuesday, before English class. Carlos has a lunch bag and an empty stomach.", "terracotta")}
        <p>Catch up with Carlos and Fernanda. Read for the message first.</p>
        ${dialogue([
          { speaker: "Fernanda", avatar: "👩🏾", text: "You brought dinner! What’s in the bag?", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "A fork. I <strong>work</strong> mornings, so I packed my bag before breakfast. The food’s still in the fridge!", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "Oh no! Can your sister bring it?", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "She <strong>works</strong> evenings. She’s <strong>working</strong> now. I <strong>worked</strong> late yesterday, too. It’s been a long week.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "I’ve <strong>worked</strong> that shift. Let’s get something at the café after class.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Good plan. At least I’m ready if they run out of forks!", side: "right", tone: "terracotta" },
        ])}
        <p>Carlos’s plans change, and so does the form of <strong>work</strong>.</p>
        <div class="gc-callout-sage" style="padding:1rem; border-radius:.5rem; background:rgba(106,141,115,.12)">
          <p><strong>Five labels, one verb.</strong> The labels help you find and check a form.</p>
          <ul style="padding-left:1.25rem; line-height:1.7">
            <li><strong>V1:</strong> work · the base form</li>
            <li><strong>V1-s:</strong> works · with he/she/it in the present</li>
            <li><strong>V-ing:</strong> working · as in “She’s working now.”</li>
            <li><strong>V2:</strong> worked · a past form</li>
            <li><strong>V3:</strong> worked · as in “I’ve worked that shift.”</li>
          </ul>
        </div>
        <p><strong>Try it:</strong> Say the five forms. Look away and try again. Check just the one you forget.</p>
      `,
      exercises: [
        {
          id: "vfo-intro-1",
          title: "Know the codes",
          instructions: "Read for the message. Choose an answer or type the missing word.",
          items: [
            {
              type: "radio",
              label: "Why is Carlos going to the café after class?",
              options: [
                {
                  value: "shift",
                  label: "He is starting his restaurant shift."
                },
                {
                  value: "dinner",
                  label: "He left his food at home."
                },
                {
                  value: "sister",
                  label: "He is taking dinner to his sister."
                }
              ],
              expectedAnswer: "dinner"
            },
            {
              type: "radio",
              label: "Can Sarah bring Carlos his dinner now?",
              options: [
                {
                  value: "no",
                  label: "No. She is working."
                },
                {
                  value: "yes",
                  label: "Yes. She has finished work."
                },
                {
                  value: "home",
                  label: "Yes. She is at home."
                }
              ],
              expectedAnswer: "no"
            },
            {
              type: "text",
              label: "Carlos tells the teacher: “My sister ___ at a restaurant.” (work)",
              expectedAnswers: [
                "works"
              ]
            }
          ]
        }
      ],
      stepNumber: 1
    },
    {
      id: "present-forms",
      stepNumber: 2,
      title: "Save me a seat · V1, V1-s, V-ing",
      icon: "🔄",
      explanation: `
        ${sceneCard("sceneWorkShift", "During the class break, Carlos texts his sister Sarah at the restaurant.", "blue")}
        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Guess where my dinner is? Still in our fridge.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "Again? You <strong>pack</strong> a lunch every day. You just don’t always take it!", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I’m <strong>learning</strong>! Fernanda <strong>finishes</strong> class at eight. We’re going to the café. Can you come?", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "I’m <strong>serving</strong> dinner right now. I finish at eight, too. Save me a seat!", side: "left", tone: "blue" },
        ])}
        <p>Sarah talks about Carlos’s usual routine and what she’s doing now. What do you sometimes forget when you leave home?</p>
        <p><strong>Quick form check:</strong> I/you/we/they <strong>pack</strong>; he/she/it <strong>packs</strong>. For an action in progress, use <strong>am/is/are + V-ing</strong>: “I’m serving dinner.”</p>
        <p><strong>Your reply:</strong> “I usually ___ before class. Right now, I’m ___.” Use your own details, then say it again without looking.</p>
      `,
      exercises: [
        {
          id: "vfo-present-1",
          title: "Spot the form",
          instructions: "Continue the text conversation. For a blank, type only the missing word.",
          items: [
            {
              type: "radio",
              label: "Sarah is busy at this moment. Which text tells Carlos what is happening now?",
              options: [
                {
                  value: "routine",
                  label: "I serve dinner every evening."
                },
                {
                  value: "past",
                  label: "I served dinner last night."
                },
                {
                  value: "now",
                  label: "I’m serving dinner. I’ll text you later."
                }
              ],
              expectedAnswer: "now"
            },
            {
              type: "text",
              label: "Sarah texts: “My brother usually ___ his food at home.” (forget)",
              expectedAnswers: [
                "forgets"
              ]
            },
            {
              type: "text",
              label: "Carlos replies: “Not tomorrow! I am ___ a reminder on my phone.” (set)",
              expectedAnswers: [
                "setting"
              ]
            }
          ]
        }
      ]
    },
    {
      id: "past-forms",
      stepNumber: 3,
      title: "Dinner, finally · V2 and V3",
      icon: "⏪",
      explanation: `
        ${sceneCard("sceneCafe", "After class, at the café. Sarah arrives, and Carlos finally gets dinner.", "amber")}
        ${dialogue([
          { speaker: "Sarah", avatar: "👩🏻", text: "You’ve already got a sandwich? That was fast!", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>finished</strong> it already. I <strong>worked</strong> until nine yesterday and missed dinner then, too.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "I’ve <strong>worked</strong> at the clinic nearby for two years. This café has saved my dinner more than once!", side: "left", tone: "sage" },
          { speaker: "Sarah", avatar: "👩🏻", text: "Next time, text me before you leave home. I’ll send one word: LUNCH.", side: "right", tone: "blue" },
        ])}
        <p>Carlos tells what happened yesterday. Fernanda talks about a job that started in the past and continues now.</p>
        <p><strong>Quick form check:</strong> “I worked yesterday” uses <strong>V2</strong>. “I have worked nearby for two years” uses <strong>have + V3</strong>. <strong>I’ve</strong> means <strong>I have</strong>.</p>
        <p>For regular verbs, V2 and V3 both end in <strong>-ed</strong>. They look the same; the words around them help you understand the meaning.</p>
        <p><strong>Try it:</strong> Tell a partner one thing you did yesterday. Check the verb and tell it again. You can invent details.</p>
      `,
      exercises: [
        {
          id: "vfo-past-1",
          title: "Choose V2 or V3",
          instructions: "Think about what each person means. Type only the missing word.",
          items: [
            {
              type: "radio",
              label: "Fernanda says, “I’ve worked at the clinic for two years.” What does she mean?",
              options: [
                {
                  value: "finished",
                  label: "She stopped working there two years ago."
                },
                {
                  value: "still",
                  label: "She started two years ago and still works there."
                },
                {
                  value: "future",
                  label: "She will start there in two years."
                }
              ],
              expectedAnswer: "still"
            },
            {
              type: "text",
              label: "Carlos texts: “Yesterday I ___ class with only a fork in my bag!” (start)",
              expectedAnswers: [
                "started"
              ]
            },
            {
              type: "text",
              label: "Sarah replies: “You have ___ that lunch bag all week. Check inside it!” (use)",
              expectedAnswers: [
                "used"
              ]
            }
          ]
        }
      ]
    },
    {
      id: "be-and-have",
      stepNumber: 4,
      title: "Your turn in the group chat · Be and have",
      icon: "⚡",
      explanation: `
        ${sceneCard("scenePhone", "Wednesday evening. Five minutes of English in the class group chat.", "sage")}
        ${dialogue([
          { speaker: "Fernanda", avatar: "👩🏾", text: "Everyone home? I <strong>am</strong> ready for five minutes of practice.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>was</strong> hungry in class yesterday. Today I <strong>have</strong> my dinner right here.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "He <strong>has</strong> a sandwich, an apple, AND his fork. I checked!", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I’ve <strong>been</strong> forgetful this week. But I’ve <strong>had</strong> plenty of help!", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Be</strong> and <strong>have</strong> change in special ways. Don’t add <em>-ed</em>.</p>
        <div class="gc-callout-sage" style="padding:1rem; border-radius:.5rem; background:rgba(106,141,115,.12)">
          <p><strong>Be:</strong> V1 be · V1-s is · V-ing being · V2 was/were · V3 been</p>
          <p><strong>Have:</strong> V1 have · V1-s has · V-ing having · V2 had · V3 had</p>
          <p>In present statements, use <strong>I am, he/she/it is, you/we/they are</strong>.</p>
        </div>
        <p><strong>Join the chat:</strong> “Today I am ___. Yesterday I was ___. I have ___.” Say or write your own reply. You can invent details.</p>
        <p><strong>Check one thing:</strong> “My sister have my lunch.” → “My sister <strong>has</strong> my lunch.” With <em>she</em>, use <em>has</em>. Now check one verb in your reply and try again. Return to two forms tomorrow.</p>
      `,
      exercises: [
        {
          id: "vfo-be-have-1",
          title: "be and have on the quiz",
          instructions: "Help the classmates finish their messages. Type only the missing word.",
          items: [
            {
              type: "radio",
              label: "Sarah types, “My brother have his lunch today.” Help her fix the message.",
              options: [
                {
                  value: "has",
                  label: "My brother has his lunch today."
                },
                {
                  value: "having",
                  label: "My brother having his lunch today."
                },
                {
                  value: "have",
                  label: "My brother have his lunch today."
                }
              ],
              expectedAnswer: "has"
            },
            {
              type: "text",
              label: "Carlos replies: “Yesterday we ___ at the café after class.” (be)",
              expectedAnswers: [
                "were"
              ]
            },
            {
              type: "text",
              label: "Fernanda texts: “I’ve ___ a long day. Five minutes of practice is enough tonight.” (have)",
              expectedAnswers: [
                "had"
              ]
            }
          ]
        }
      ]
    }
  ],
  miniQuiz: [
    {
      id: "vfo-q3",
      question: "Sarah explains why Carlos needs a reminder: “My brother ___ his lunch at home most mornings.” (leave)",
      options: [
        {
          value: "a",
          label: "leave"
        },
        {
          value: "b",
          label: "leaves"
        },
        {
          value: "c",
          label: "leaving"
        }
      ],
      correctAnswer: "b",
      explanation: "This is his usual routine. With my brother (he), use leaves.",
      topic: "v1-3rd",
      skill: "usage",
      skillTag: "third-person-s",
      difficulty: "easy"
    },
    {
      id: "vfo-qfb1",
      type: "fill-blank",
      question: "Sarah sends a photo from work: “I am ___ dinner now. See you after class!” (serve)",
      correctAnswer: "serving",
      explanation: "Use am + V-ing for an action in progress: I am serving dinner. Drop the final e in serve before adding -ing.",
      topic: "v1-ing",
      skill: "usage",
      skillTag: "form-verb-ing",
      difficulty: "easy"
    },
    {
      id: "vfo-q7",
      question: "Carlos is home now. Which message needs a correction?",
      options: [
        {
          value: "a",
          label: "I was hungry in class yesterday."
        },
        {
          value: "b",
          label: "I am home with my dinner now."
        },
        {
          value: "c",
          label: "I be ready to practice now."
        }
      ],
      correctAnswer: "c",
      explanation: "Be is the base form. With I in a present statement, use am: I am ready to practice now.",
      topic: "be",
      skill: "error-detection",
      skillTag: "be-v1-not-base",
      difficulty: "medium"
    },
    {
      id: "vfo-qws1",
      type: "word-scramble",
      question: "Fernanda tells Sarah about her job at the clinic. Put her message in order.",
      words: [
        "years",
        "worked",
        "I",
        "two",
        "have",
        "here",
        "for"
      ],
      correctAnswer: "I have worked here for two years",
      hint: "have/has + V3",
      explanation: "After have/has, use V3. This connects past experience to the present.",
      topic: "v3",
      skill: "usage",
      skillTag: "have-plus-v3",
      difficulty: "medium"
    },
    {
      id: "vfo-q8",
      question: "Sarah wants to say Carlos has his food with him now. Which message fits?",
      options: [
        {
          value: "a",
          label: "He has his lunch today."
        },
        {
          value: "b",
          label: "He have his lunch today."
        },
        {
          value: "c",
          label: "He had his lunch yesterday."
        }
      ],
      correctAnswer: "a",
      explanation: "He has tells us about now. He had tells us about the past. With he, use has instead of have.",
      topic: "have",
      skill: "error-detection",
      skillTag: "have-third-person",
      difficulty: "medium"
    }
  ]
};
