import type { InteractiveGuideContent } from "@/types/activity";

export const verbFormsOverviewContent: InteractiveGuideContent = {
  "type": "interactive-guide",
  "tableOfContents": true,
  "sections": [
    {
      "id": "five-codes",
      "title": "Five verb forms",
      "icon": "📱",
      "explanation": "<p>A verb changes form. Learn these five labels with <strong>work</strong>.</p><table><thead><tr><th scope=\"col\">Code</th><th scope=\"col\">Form</th><th scope=\"col\">Example</th></tr></thead><tbody><tr><td>V1</td><td>Base</td><td>work</td></tr><tr><td>V1-s</td><td>He / she / it</td><td>works</td></tr><tr><td>V-ing</td><td>-ing</td><td>working</td></tr><tr><td>V2</td><td>Past</td><td>worked</td></tr><tr><td>V3</td><td>Past participle</td><td>worked</td></tr></tbody></table><p><strong>Try it:</strong> Read the forms aloud. Cover them. Try again.</p>",
      "exercises": [
        {
          "id": "vfo-intro-1",
          "title": "Know the codes",
          "instructions": "Choose or write the form.",
          "items": [
            {
              "type": "radio",
              "label": "She ___ every day. (work)",
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
      "title": "Present forms",
      "icon": "🔄",
      "explanation": "<p>Use <strong>work / works</strong> for routines. Use <strong>am / is / are + working</strong> for an action happening now.</p><table><thead><tr><th scope=\"col\">Form</th><th scope=\"col\">Example</th></tr></thead><tbody><tr><td>V1</td><td>I <strong>work</strong> every day.</td></tr><tr><td>V1-s</td><td>She <strong>works</strong> every day.</td></tr><tr><td>V-ing</td><td>I <strong>am working</strong> now.</td></tr></tbody></table><p><strong>Try it:</strong> Change one example to make it true for you.</p>",
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
              "label": "My brother ___ at Logan Airport. (work)",
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
      "title": "V2 and V3",
      "icon": "⏪",
      "explanation": "<p><strong>V2</strong> tells about a finished past action. In the pattern <strong>have / has + V3</strong>, the past connects to now.</p><table><thead><tr><th scope=\"col\">Form</th><th scope=\"col\">Example</th></tr></thead><tbody><tr><td>V2</td><td>I <strong>worked</strong> yesterday.</td></tr><tr><td>V3</td><td>I <strong>have worked</strong> here for two years.</td></tr></tbody></table><p>For regular verbs, V2 and V3 both end in <strong>-ed</strong>. Other verbs can change: <strong>be → was / were → been</strong>.</p><p><strong>Try it:</strong> Check your verb. Fix one thing and try again.</p>",
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
              "label": "Last night I ___ until 10 pm. (work)",
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
      "title": "Be and have",
      "icon": "⚡",
      "explanation": "<p>These verbs do not follow the regular <strong>-ed</strong> pattern.</p><table><thead><tr><th scope=\"col\">Code</th><th scope=\"col\">be</th><th scope=\"col\">have</th></tr></thead><tbody><tr><td>V1</td><td>be</td><td>have</td></tr><tr><td>V1-s</td><td>is</td><td>has</td></tr><tr><td>V-ing</td><td>being</td><td>having</td></tr><tr><td>V2</td><td>was / were</td><td>had</td></tr><tr><td>V3</td><td>been</td><td>had</td></tr></tbody></table><p><strong>Be</strong> is the base form. In present statements, use <strong>am / is / are</strong>: I am ready. She is here. They are ready.</p><p>She <strong>has</strong> a job. We <strong>are having</strong> lunch. I <strong>have been</strong> busy.</p><p><strong>Try it:</strong> Choose two forms to practice again tomorrow.</p>",
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
              "label": "Last year she ___ a nurse at the clinic. (be)",
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
