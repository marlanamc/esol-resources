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
      title: "The wrong lunch bag · five verb forms",
      icon: "👜",
      explanation: `
        ${sceneCard("sceneLunch", "Tuesday, class break. Carlos opens his lunch bag and finds a surprise.", "terracotta")}
        <p>Catch up with Carlos and Fernanda. Read for the message first.</p>
        ${dialogue([
          { speaker: "Fernanda", avatar: "👩🏾", text: "Break time. What did you bring for dinner tonight?", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "A sandwich. Wait, this isn’t my bag. There’s no food, just a little box.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "Is that a ring box? Whose bag is that?", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I think it’s Mark’s bag. He <strong>works</strong> with me at the restaurant. We use the same staff fridge.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "Call him. Maybe he is looking for it.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I don’t have his number. But my sister Sarah is <strong>working</strong> there right now. I’ll text her.", side: "right", tone: "terracotta" },
        ])}
        <p>Carlos preps food at La Palma in the mornings. Mark is a line cook there, and Sarah is a server. Notice <strong>works</strong> and <strong>working</strong>, then compare all five forms below.</p>
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
              label: "Why is Carlos surprised at the break?",
              options: [
                {
                  value: "shift",
                  label: "He is late for his restaurant shift."
                },
                {
                  value: "dinner",
                  label: "His bag has a ring box, not his dinner."
                },
                {
                  value: "sister",
                  label: "His sister forgot her lunch at home."
                }
              ],
              expectedAnswer: "dinner"
            },
            {
              type: "radio",
              label: "Where is Sarah right now?",
              options: [
                {
                  value: "no",
                  label: "At the restaurant. She is working."
                },
                {
                  value: "yes",
                  label: "At home. She has finished work."
                },
                {
                  value: "home",
                  label: "At class with Carlos."
                }
              ],
              expectedAnswer: "no"
            },
            {
              type: "text",
              label: "Carlos tells Fernanda: “Mark ___ with me at the restaurant.” (work)",
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
      title: "Mark is looking everywhere · V1, V1-s, V-ing",
      icon: "🔄",
      explanation: `
        ${sceneCard("sceneWorkShift", "Still on break, Carlos texts his sister Sarah at the restaurant.", "blue")}
        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Emergency! I took the wrong lunch bag from the fridge. There’s a ring inside. Is it Mark’s?", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "Yes. Mark <strong>brings</strong> that blue bag every day. And tonight he wants to ask Lisa to marry him.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Oh no. Class <strong>finishes</strong> at eight. Where is he now?", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏻", text: "He’s <strong>looking</strong> everywhere in the kitchen. I’m <strong>serving</strong> tables, so I can’t leave. Meet Mark at the café at eight.", side: "left", tone: "blue" },
        ])}
        <p>Sarah talks about Mark’s usual routine and what is happening right now. Have you ever taken the wrong bag, coat, or phone?</p>
        <p><strong>Quick form check:</strong> I/you/we/they <strong>bring</strong>; he/she/it <strong>brings</strong>. For an action in progress, use <strong>am/is/are + V-ing</strong>: “He’s looking everywhere.”</p>
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
                  label: "I serve tables every evening."
                },
                {
                  value: "past",
                  label: "I served tables last night."
                },
                {
                  value: "now",
                  label: "I’m serving tables. I’ll text you later."
                }
              ],
              expectedAnswer: "now"
            },
            {
              type: "text",
              label: "Sarah texts: “Mark never ___ his lunch bag. He’s checking every shelf!” (forget)",
              expectedAnswers: [
                "forgets"
              ]
            },
            {
              type: "text",
              label: "Carlos replies: “Tell him not to worry. I am ___ an alarm for eight o’clock.” (set)",
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
      title: "Just in time · V2 and V3",
      icon: "⏪",
      explanation: `
        ${sceneCard("sceneCafe", "8:05 at the café. Mark runs in, out of breath.", "amber")}
        ${dialogue([
          { speaker: "Mark", avatar: "👨🏿", text: "Carlos! I’ve <strong>looked</strong> everywhere for that bag!", side: "left", tone: "amber" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Sorry. I <strong>grabbed</strong> the wrong one this morning. I <strong>opened</strong> it at break. Here’s your ring.", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "👨🏿", text: "Thank you. Now I have to tell you something. I ate your sandwich at lunch.", side: "left", tone: "amber" },
          { speaker: "Carlos", avatar: "👨🏽", text: "So I’ve <strong>missed</strong> dinner, but I saved your big night. Go, Mark! You have twenty minutes.", side: "right", tone: "terracotta" },
        ])}
        <p>Carlos tells what happened this morning. Mark and Carlos also connect the past to right now. The examples below show how V2 and V3 work with the same verb.</p>
        <p><strong>Quick form check:</strong> “I grabbed the bag this morning” uses <strong>V2</strong>. “I’ve looked everywhere” uses <strong>have + V3</strong>. <strong>I’ve</strong> means <strong>I have</strong>.</p>
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
              label: "Carlos tells Mark, “I’ve worked at La Palma for four years. This is my first mix-up!” What does he mean?",
              options: [
                {
                  value: "finished",
                  label: "He stopped working there four years ago."
                },
                {
                  value: "still",
                  label: "He started four years ago and still works there."
                },
                {
                  value: "future",
                  label: "He will start there in four years."
                }
              ],
              expectedAnswer: "still"
            },
            {
              type: "text",
              label: "Carlos tells Mark: “I ___ class with your ring in my bag!” (start)",
              expectedAnswers: [
                "started"
              ]
            },
            {
              type: "text",
              label: "Mark laughs: “I have ___ that blue bag for three years. I need a new one!” (use)",
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
      title: "She said yes! · Be and have",
      icon: "⚡",
      explanation: `
        ${sceneCard("scenePhone", "Later that night, Carlos sits down to do his online homework. Then a group chat from Sarah pops up.", "sage")}
        ${dialogue([
          { speaker: "Sarah", avatar: "👩🏻", text: "Big news. Mark <strong>is</strong> engaged. Lisa said yes at 8:30!", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>am</strong> so happy for them. I’m also very hungry.", side: "right", tone: "terracotta" },
          { speaker: "Mark", avatar: "👨🏿", text: "Lisa <strong>has</strong> the ring, and I <strong>have</strong> a sandwich for you. Thank you, Carlos!", side: "left", tone: "amber" },
          { speaker: "Sarah", avatar: "👩🏻", text: "You <strong>were</strong> a hero tonight, Carlos. Take the right bag tomorrow.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I’ve <strong>been</strong> hungry since six. I’ve <strong>had</strong> enough surprises for one week!", side: "right", tone: "terracotta" },
        ])}
        <p><strong>Be</strong> and <strong>have</strong> change in special ways. Don’t add <em>-ed</em>.</p>
        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(106,141,115,0.12)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">Form</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">be</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(106,141,115,0.3)">have</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">V1</td>
                <td style="padding: 0.6rem 0.75rem">be</td>
                <td style="padding: 0.6rem 0.75rem">have</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">V1-s</td>
                <td style="padding: 0.6rem 0.75rem">is</td>
                <td style="padding: 0.6rem 0.75rem">has</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">V-ing</td>
                <td style="padding: 0.6rem 0.75rem">being</td>
                <td style="padding: 0.6rem 0.75rem">having</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">V2</td>
                <td style="padding: 0.6rem 0.75rem">was / were</td>
                <td style="padding: 0.6rem 0.75rem">had</td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">V3</td>
                <td style="padding: 0.6rem 0.75rem">been</td>
                <td style="padding: 0.6rem 0.75rem">had</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="gc-callout-sage" style="padding:1rem; border-radius:.5rem; background:rgba(106,141,115,.12)">
          <p style="margin:0">In present statements, use <strong>I am, he/she/it is, you/we/they are</strong>.</p>
        </div>
        <p><strong>Join the chat:</strong> “Today I am ___. Yesterday I was ___. I have ___.” Say or write your own reply. You can invent details.</p>
        <p><strong>Check one thing:</strong> “Lisa have the ring.” → “Lisa <strong>has</strong> the ring.” With <em>she</em>, use <em>has</em>. Now check one verb in your reply and try again. Return to two forms tomorrow.</p>
      `,
      exercises: [
        {
          id: "vfo-be-have-1",
          title: "be and have on the quiz",
          instructions: "Help everyone finish their messages. Type only the missing word.",
          items: [
            {
              type: "radio",
              label: "Sarah types, “Lisa have the ring now.” Help her fix the message.",
              options: [
                {
                  value: "has",
                  label: "Lisa has the ring now."
                },
                {
                  value: "having",
                  label: "Lisa having the ring now."
                },
                {
                  value: "have",
                  label: "Lisa have the ring now."
                }
              ],
              expectedAnswer: "has"
            },
            {
              type: "text",
              label: "Mark replies: “Lisa and I ___ both so nervous at dinner!” (be)",
              expectedAnswers: [
                "were"
              ]
            },
            {
              type: "text",
              label: "Carlos texts: “I’ve ___ a crazy day. Five minutes of practice is enough tonight.” (have)",
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
      question: "Sarah explains the mix-up: “Mark ___ his lunch in the staff fridge every morning.” (leave)",
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
      explanation: "This is his usual routine. With Mark (he), use leaves.",
      topic: "v1-3rd",
      skill: "usage",
      skillTag: "third-person-s",
      difficulty: "easy"
    },
    {
      id: "vfo-qfb1",
      type: "fill-blank",
      question: "Sarah texts Carlos from work: “I am ___ tables now. Mark will meet you at the café!” (serve)",
      correctAnswer: "serving",
      explanation: "Use am + V-ing for an action in progress: I am serving tables. Drop the final e in serve before adding -ing.",
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
          label: "I was nervous in class today."
        },
        {
          value: "b",
          label: "I am home with a good story now."
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
      question: "The next day at La Palma, Carlos tells Sarah about his job. Put his message in order.",
      words: [
        "years",
        "worked",
        "I",
        "four",
        "have",
        "here",
        "for"
      ],
      correctAnswer: "I have worked here for four years",
      hint: "have/has + V3",
      explanation: "After have/has, use V3. This connects past experience to the present.",
      topic: "v3",
      skill: "usage",
      skillTag: "have-plus-v3",
      difficulty: "medium"
    },
    {
      id: "vfo-q8",
      question: "Sarah wants to say Lisa is wearing the ring now. Which message fits?",
      options: [
        {
          value: "a",
          label: "She has the ring now."
        },
        {
          value: "b",
          label: "She have the ring now."
        },
        {
          value: "c",
          label: "She had the ring yesterday."
        }
      ],
      correctAnswer: "a",
      explanation: "She has tells us about now. She had tells us about the past. With she, use has instead of have.",
      topic: "have",
      skill: "error-detection",
      skillTag: "have-third-person",
      difficulty: "medium"
    }
  ]
};
