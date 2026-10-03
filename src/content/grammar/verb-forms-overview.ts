import type { InteractiveGuideContent } from "@/types/activity";
import { verbFormsOverviewImages as images } from "@/data/verb-forms-overview-images.generated";

// Short scenes and classmate messages carry the grammar through the week.
const scene = (id: keyof typeof images, caption: string) => {
  const photo = images[id];
  return `<figure class="vfo-scene gc-bg-white" style="margin:0 0 1rem; border-radius:12px; overflow:hidden; border:1px solid rgba(128,128,128,.25)">
    <img src="${photo.url}" alt="${photo.alt}" loading="lazy" style="display:block; width:100%; height:180px; object-fit:cover" />
    <figcaption style="padding:.45rem .7rem; font-size:.8rem; line-height:1.4"><strong>${caption}</strong><span style="display:block; font-size:.7rem">Photo: <a href="${photo.credit.url}" target="_blank" rel="noopener noreferrer">${photo.credit.name}</a> / Unsplash</span></figcaption>
  </figure>`;
};

const messages = (label: string, turns: [string, string, string][]) => `
  <div class="vfo-messages" role="group" aria-label="${label}" style="margin:.75rem 0; display:flex; flex-direction:column; gap:.5rem">
    <div class="gc-text-blue" style="font-size:.75rem; font-weight:700; letter-spacing:.04em">${label}</div>
    ${turns.map(([name, avatar, text], i) => `<div class="vfo-message gc-bg-${i % 2 ? "sage" : "blue"}-alpha" style="align-self:${i % 2 ? "flex-end" : "flex-start"}; max-width:94%; border:1px solid rgba(128,128,128,.25); border-radius:${i % 2 ? "12px 12px 3px 12px" : "12px 12px 12px 3px"}; padding:.55rem .75rem; line-height:1.5">
      <span style="font-size:.8rem; font-weight:700">${avatar} ${name}</span><div>${text}</div>
    </div>`).join("")}
  </div>`;

export const verbFormsOverviewContent: InteractiveGuideContent = {
  "type": "interactive-guide",
  "tableOfContents": true,
  "sections": [
    {
      "id": "five-codes",
      "title": "Meet the verb family",
      "icon": "📱",
      "explanation": `
${scene("sceneClassNight", "After class • Carlos, Fernanda, and Sarah")}
${messages("CLASS GROUP CHAT", [
  ["Carlos", "👨🏽", "Work, works, working... One verb has a big family!"],
  ["Fernanda", "👩🏾", "Five forms. Let's try them before dinner!"],
])}
<p><strong>One verb, five forms.</strong> Meet the family:</p><table><thead><tr><th scope="col">Code</th><th scope="col">Form</th><th scope="col">Example</th></tr></thead><tbody><tr><td>V1</td><td>Base</td><td>work</td></tr><tr><td>V1-s</td><td>He / she / it</td><td>works</td></tr><tr><td>V-ing</td><td>-ing</td><td>working</td></tr><tr><td>V2</td><td>Past</td><td>worked</td></tr><tr><td>V3</td><td>Past participle</td><td>worked</td></tr></tbody></table><p class="vfo-try"><strong>Your turn:</strong> Read the forms aloud. Cover them. Try again.</p>
      `,
      "exercises": [
        {
          "id": "vfo-intro-1",
          "title": "Know the codes",
          "instructions": "Choose or write the form.",
          "items": [
            {
              "type": "radio",
              "label": "Carlos says: “My sister ___ every day.” (work)",
              "options": [
                {
                  "value": "work",
                  "label": "work"
                },
                {
                  "value": "works",
                  "label": "works"
                },
                {
                  "value": "working",
                  "label": "working"
                }
              ],
              "expectedAnswer": "works"
            },
            {
              "type": "radio",
              "label": "Which code is the dictionary form with no ending added?",
              "options": [
                {
                  "value": "v1",
                  "label": "V1"
                },
                {
                  "value": "v1-3rd",
                  "label": "V1-s"
                },
                {
                  "value": "v2",
                  "label": "V2"
                }
              ],
              "expectedAnswer": "v1"
            },
            {
              "type": "text",
              "label": "For the verb work, the V1 (base) form is ___.",
              "expectedAnswers": [
                "work"
              ]
            }
          ]
        }
      ],
      "stepNumber": 1
    },
    {
      "id": "present-forms",
      "stepNumber": 2,
      "title": "Save me a cookie!",
      "icon": "🔄",
      "explanation": `
${scene("sceneWorkShift", "Tuesday • Planning a café meet-up")}
${messages("CARLOS & FERNANDA", [
  ["Carlos", "👨🏽", "I <strong>work</strong> mornings. My sister <strong>works</strong> evenings. Café at six?"],
  ["Fernanda", "👩🏾", "I <strong>am working</strong> now. Six is good. Save me a cookie!"],
])}
<p><strong>V1 / V1-s:</strong> work / works → a routine.<br /><strong>V-ing:</strong> am / is / are + working → happening now.</p><p class="vfo-try"><strong>Your turn:</strong> Send your own reply: “I work ___.” or “I am ___ now.”</p>
      `,
      "exercises": [
        {
          "id": "vfo-present-1",
          "title": "Spot the form",
          "instructions": "Choose the correct form for each sentence.",
          "items": [
            {
              "type": "radio",
              "label": "Which sentence describes a routine?",
              "options": [
                {
                  "value": "work",
                  "label": "I am working now."
                },
                {
                  "value": "works",
                  "label": "She works on Mondays."
                },
                {
                  "value": "worked",
                  "label": "She worked yesterday."
                }
              ],
              "expectedAnswer": "works"
            },
            {
              "type": "radio",
              "label": "Right now, I am ___ on my homework. (work)",
              "options": [
                {
                  "value": "work",
                  "label": "work"
                },
                {
                  "value": "working",
                  "label": "working"
                },
                {
                  "value": "worked",
                  "label": "worked"
                }
              ],
              "expectedAnswer": "working"
            },
            {
              "type": "text",
              "label": "Carlos says: “My brother ___ at Logan Airport.” (work)",
              "expectedAnswers": [
                "works"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "past-forms",
      "stepNumber": 3,
      "title": "Yesterday at work, today at the café",
      "icon": "⏪",
      "explanation": `
${scene("sceneEveningHome", "Tuesday • At the café after work")}
${messages("AT THE TABLE", [
  ["Sarah", "👩🏻", "I <strong>worked</strong> late yesterday. Today, I have time for a cookie!"],
  ["Fernanda", "👩🏾", "I <strong>have worked</strong> nearby for two years. How did I miss this café?"],
])}
<p><strong>V2: worked</strong> → a finished past action.<br /><strong>Have / has + V3: have worked</strong> → the past connects to now.</p>
<p>Regular verbs: V2 and V3 end in <strong>-ed</strong>. Some verbs change: <strong>be → was / were → been</strong>.</p><p class="vfo-try"><strong>Your turn:</strong> Say one sentence about yesterday. Check your verb and try again.</p>
      `,
      "exercises": [
        {
          "id": "vfo-past-1",
          "title": "Choose V2 or V3",
          "instructions": "Read the sentence. Which form fits?",
          "items": [
            {
              "type": "radio",
              "label": "I have ___ here since January. (work)",
              "options": [
                {
                  "value": "work",
                  "label": "work"
                },
                {
                  "value": "worked",
                  "label": "worked"
                },
                {
                  "value": "working",
                  "label": "working"
                }
              ],
              "expectedAnswer": "worked"
            },
            {
              "type": "radio",
              "label": "She ___ a good salary last year. (have)",
              "options": [
                {
                  "value": "has",
                  "label": "has"
                },
                {
                  "value": "had",
                  "label": "had"
                },
                {
                  "value": "having",
                  "label": "having"
                }
              ],
              "expectedAnswer": "had"
            },
            {
              "type": "text",
              "label": "Sarah texts: “Last night I ___ until 10 pm.” (work)",
              "expectedAnswers": [
                "worked"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "be-and-have",
      "stepNumber": 4,
      "title": "Five minutes before dinner",
      "icon": "⚡",
      "explanation": `
${scene("sceneAppQuiz", "Wednesday • A little practice at home")}
${messages("CLASS GROUP CHAT", [
  ["Carlos", "👨🏽", "I <strong>am</strong> home. I <strong>have</strong> five minutes. Let's practice!"],
  ["Sarah", "👩🏻", "I <strong>have been</strong> busy! My son <strong>has</strong> dinner ready. He says it's my turn tomorrow!"],
])}
<table><thead><tr><th scope="col">Code</th><th scope="col">be</th><th scope="col">have</th></tr></thead><tbody><tr><td>V1</td><td>be</td><td>have</td></tr><tr><td>V1-s</td><td>is</td><td>has</td></tr><tr><td>V-ing</td><td>being</td><td>having</td></tr><tr><td>V2</td><td>was / were</td><td>had</td></tr><tr><td>V3</td><td>been</td><td>had</td></tr></tbody></table><p><strong>Be</strong> is the base form. In present statements: <strong>I am, she is, they are.</strong></p><p class="vfo-try"><strong>Your turn:</strong> Choose two forms. Cover them, try, and check. Practice again tomorrow.</p>
      `,
      "exercises": [
        {
          "id": "vfo-be-have-1",
          "title": "be and have on the quiz",
          "instructions": "Choose the correct form.",
          "items": [
            {
              "type": "radio",
              "label": "They have ___ friends in East Boston for years. (be)",
              "options": [
                {
                  "value": "was",
                  "label": "was"
                },
                {
                  "value": "were",
                  "label": "were"
                },
                {
                  "value": "been",
                  "label": "been"
                }
              ],
              "expectedAnswer": "been"
            },
            {
              "type": "radio",
              "label": "He ___ two jobs right now. (have)",
              "options": [
                {
                  "value": "have",
                  "label": "have"
                },
                {
                  "value": "has",
                  "label": "has"
                },
                {
                  "value": "had",
                  "label": "had"
                }
              ],
              "expectedAnswer": "has"
            },
            {
              "type": "text",
              "label": "Sarah says: “Last year I ___ a nurse at the clinic.” (be)",
              "expectedAnswers": [
                "was"
              ]
            }
          ]
        }
      ]
    }
  ],
  "miniQuiz": [
    {
      "id": "vfo-q3",
      "question": "He ___ the bus every morning.",
      "options": [
        {
          "value": "a",
          "label": "take"
        },
        {
          "value": "b",
          "label": "takes"
        },
        {
          "value": "c",
          "label": "taking"
        }
      ],
      "correctAnswer": "b",
      "explanation": "V1-s is the he/she/it form. With he, add -s: takes.",
      "topic": "v1-3rd",
      "skill": "usage",
      "skillTag": "third-person-s",
      "difficulty": "easy"
    },
    {
      "id": "vfo-qfb1",
      "type": "fill-blank",
      "question": "She is ___ right now. (work + -ing)",
      "correctAnswer": "working",
      "explanation": "V-ing adds -ing to the base form: work → working. Use with am/is/are for actions in progress.",
      "topic": "v1-ing",
      "skill": "usage",
      "skillTag": "form-verb-ing",
      "difficulty": "easy"
    },
    {
      "id": "vfo-q7",
      "question": "Which sentence has the wrong form of be?",
      "options": [
        {
          "value": "a",
          "label": "They were at class last night."
        },
        {
          "value": "b",
          "label": "She was tired after work."
        },
        {
          "value": "c",
          "label": "I be a student here."
        }
      ],
      "correctAnswer": "c",
      "explanation": "Be is the base form. In present statements, use am/is/are: I am a student here.",
      "topic": "be",
      "skill": "error-detection",
      "skillTag": "be-v1-not-base",
      "difficulty": "medium"
    },
    {
      "id": "vfo-qws1",
      "type": "word-scramble",
      "question": "Sarah describes her job. Put the words in order.",
      "words": [
        "years",
        "worked",
        "She",
        "three",
        "has",
        "here",
        "for"
      ],
      "correctAnswer": "She has worked here for three years",
      "hint": "have/has + V3",
      "explanation": "After have/has, use V3. This connects past experience to the present.",
      "topic": "v3",
      "skill": "usage",
      "skillTag": "have-plus-v3",
      "difficulty": "medium"
    },
    {
      "id": "vfo-q8",
      "question": "Which sentence uses the V1-s form of have correctly?",
      "options": [
        {
          "value": "a",
          "label": "She has a new schedule."
        },
        {
          "value": "b",
          "label": "She have a new schedule."
        },
        {
          "value": "c",
          "label": "She had a new schedule."
        }
      ],
      "correctAnswer": "a",
      "explanation": "With she, the V1-s form of have is has, not have (V1) or had (V2).",
      "topic": "have",
      "skill": "error-detection",
      "skillTag": "have-third-person",
      "difficulty": "medium"
    }
  ]
};
