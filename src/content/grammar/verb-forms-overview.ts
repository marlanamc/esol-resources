import type { InteractiveGuideContent } from "@/types/activity";

export const verbFormsOverviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "intro",
      title: "Five Codes for Every Verb Quiz",
      icon: "📱",
      explanation: `
        <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.25rem">
          <p style="font-size: 1.05rem; margin: 0; line-height: 1.6">
            Every week you will take a <strong>verb quiz</strong> in this app. Each quiz asks about <strong>five forms</strong> of two verbs.
            Learn the codes now — then the quizzes feel familiar, not scary.
          </p>
        </div>

        <p style="margin-bottom: 1rem">Think of it like leveling up in a language app: one small step at a time.</p>

        <div class="table-wrap" style="overflow-x: auto; margin: 1rem 0">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem">
            <thead>
              <tr style="background: rgba(176, 87, 64, 0.12)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Code</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Name</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border: 1px solid var(--color-border-subtle)">Example (<em>work</em>)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>V1</strong></td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">base form</td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">work</td></tr>
              <tr><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>V1-3rd</strong></td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">third person (he/she/it)</td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">works</td></tr>
              <tr><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>V1-ing</strong></td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">-ing form</td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">working</td></tr>
              <tr><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>V2</strong></td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">past simple</td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">worked</td></tr>
              <tr><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)"><strong>V3</strong></td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">past participle</td><td style="padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-subtle)">worked</td></tr>
            </tbody>
          </table>
        </div>

        <div class="gc-callout-sage" style="background: rgba(106, 141, 115, 0.12); padding: 1rem 1.25rem; border-radius: 0.5rem">
          <p style="margin: 0"><strong>Regular verbs</strong> like <em>work</em> add <em>-ed</em> for V2 and V3. <strong>Irregular verbs</strong> like <em>be</em> and <em>have</em> change more — that is what the weekly quizzes practice.</p>
        </div>
      `,
      exercises: [
        {
          id: "verb-forms-intro-1",
          title: "Quick check",
          instructions: "How many forms does each weekly verb quiz ask about?",
          items: [
            {
              type: "radio",
              label: "How many forms per verb on the quiz?",
              options: [
                { value: "3", label: "3 forms" },
                { value: "5", label: "5 forms" },
                { value: "7", label: "7 forms" },
              ],
              expectedAnswer: "5",
            },
          ],
        },
      ],
    },
    {
      id: "v1-base",
      stepNumber: 1,
      title: "V1 — Base Form",
      icon: "1️⃣",
      explanation: `
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V1</strong> = the dictionary form. No endings added yet.</p>
        </div>
        <p><em>I <strong>work</strong> at a café.</em> &nbsp;·&nbsp; <em>They <strong>have</strong> two children.</em> &nbsp;·&nbsp; <em>We <strong>be</strong>… wait — <em>be</em> is special: V1 is <strong>am / are / is</strong> in sentences.</p>
        <p style="margin-top: 1rem">On the quiz, V1 is often <strong>already filled in</strong> for you. You type the other four forms.</p>
      `,
      exercises: [
        {
          id: "verb-forms-v1-1",
          title: "Spot V1",
          instructions: "Which word is the V1 (base) form?",
          items: [
            {
              type: "radio",
              label: "She <strong>works</strong> every Saturday.",
              options: [
                { value: "works", label: "works" },
                { value: "work", label: "work" },
                { value: "working", label: "working" },
              ],
              expectedAnswer: "work",
            },
          ],
        },
      ],
    },
    {
      id: "v1-third",
      stepNumber: 2,
      title: "V1-3rd — Third Person",
      icon: "2️⃣",
      explanation: `
        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V1-3rd</strong> = he / she / it form. Usually add <strong>-s</strong> or <strong>-es</strong>.</p>
        </div>
        <p><em>work</em> → <strong>works</strong> &nbsp;·&nbsp; <em>have</em> → <strong>has</strong> &nbsp;·&nbsp; <em>be</em> → <strong>is</strong></p>
        <p style="margin-top: 1rem"><em>She <strong>works</strong> at the library.</em> &nbsp;·&nbsp; <em>He <strong>has</strong> a new job.</em></p>
      `,
      exercises: [
        {
          id: "verb-forms-v1-3rd-1",
          title: "Choose V1-3rd",
          instructions: "Pick the correct third-person form.",
          items: [
            {
              type: "radio",
              label: "My brother ___ at Logan Airport. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "works", label: "works" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "works",
            },
            {
              type: "radio",
              label: "She ___ two jobs. (have)",
              options: [
                { value: "have", label: "have" },
                { value: "has", label: "has" },
                { value: "had", label: "had" },
              ],
              expectedAnswer: "has",
            },
          ],
        },
      ],
    },
    {
      id: "v1-ing",
      stepNumber: 3,
      title: "V1-ing — The -ing Form",
      icon: "3️⃣",
      explanation: `
        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V1-ing</strong> = base verb + <strong>-ing</strong>. Used for actions in progress and many grammar patterns later.</p>
        </div>
        <p><em>work</em> → <strong>working</strong> &nbsp;·&nbsp; <em>have</em> → <strong>having</strong> &nbsp;·&nbsp; <em>be</em> → <strong>being</strong></p>
        <p style="margin-top: 1rem"><em>I am <strong>working</strong> right now.</em> &nbsp;·&nbsp; <em>They are <strong>having</strong> lunch.</em></p>
      `,
      exercises: [
        {
          id: "verb-forms-v1-ing-1",
          title: "Build V1-ing",
          instructions: "Choose the correct -ing form.",
          items: [
            {
              type: "radio",
              label: "Right now, I am ___ on my homework. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "working", label: "working" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "working",
            },
          ],
        },
      ],
    },
    {
      id: "v2-past",
      stepNumber: 4,
      title: "V2 — Past Simple",
      icon: "4️⃣",
      explanation: `
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V2</strong> = finished past action. Regular verbs: add <strong>-ed</strong>. Irregular verbs: memorize the form.</p>
        </div>
        <p><em>work</em> → <strong>worked</strong> &nbsp;·&nbsp; <em>have</em> → <strong>had</strong> &nbsp;·&nbsp; <em>be</em> → <strong>was / were</strong></p>
        <p style="margin-top: 1rem"><em>Yesterday I <strong>worked</strong> until 6.</em> &nbsp;·&nbsp; <em>We <strong>were</strong> at school.</em></p>
      `,
      exercises: [
        {
          id: "verb-forms-v2-1",
          title: "Choose V2",
          instructions: "Pick the past simple form.",
          items: [
            {
              type: "radio",
              label: "Last night I ___ until 10 pm. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "working", label: "working" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "worked",
            },
            {
              type: "radio",
              label: "She ___ a good salary last year. (have)",
              options: [
                { value: "has", label: "has" },
                { value: "had", label: "had" },
                { value: "having", label: "having" },
              ],
              expectedAnswer: "had",
            },
          ],
        },
      ],
    },
    {
      id: "v3-participle",
      stepNumber: 5,
      title: "V3 — Past Participle",
      icon: "5️⃣",
      explanation: `
        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V3</strong> = the form after <em>have / has / had</em>. This is why it matters later for present perfect.</p>
        </div>
        <p><em>work</em> → <strong>worked</strong> &nbsp;·&nbsp; <em>have</em> → <strong>had</strong> &nbsp;·&nbsp; <em>be</em> → <strong>been</strong></p>
        <p style="margin-top: 1rem"><em>I <strong>have worked</strong> here for three years.</em> &nbsp;·&nbsp; <em>She <strong>has been</strong> a nurse since 2019.</em></p>
        <p style="margin-top: 1rem; font-style: italic; color: var(--color-text-muted)">On weekly quizzes you just learn the V3 form. Present perfect grammar comes later in the course.</p>
      `,
      exercises: [
        {
          id: "verb-forms-v3-1",
          title: "Choose V3",
          instructions: "Pick the past participle.",
          items: [
            {
              type: "radio",
              label: "I have ___ here since January. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "worked", label: "worked" },
                { value: "working", label: "working" },
              ],
              expectedAnswer: "worked",
            },
            {
              type: "radio",
              label: "They have ___ friends in East Boston for years. (be)",
              options: [
                { value: "was", label: "was" },
                { value: "were", label: "were" },
                { value: "been", label: "been" },
              ],
              expectedAnswer: "been",
            },
          ],
        },
      ],
    },
    {
      id: "quiz-preview",
      stepNumber: 6,
      title: "Ready for Verb Quiz 1",
      icon: "✅",
      explanation: `
        <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem">
          <p style="margin: 0 0 0.75rem 0; font-size: 1.05rem">Your first quiz focuses on <strong>be</strong> and <strong>have</strong>. Here is the chart you will practice:</p>
        </div>

        <div class="table-wrap" style="overflow-x: auto">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem">
            <thead>
              <tr style="background: rgba(106, 141, 115, 0.15)">
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">Verb</th>
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">V1</th>
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">V1-3rd</th>
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">V1-ing</th>
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">V2</th>
                <th style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">V3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)"><strong>be</strong></td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">am/are</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">is</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">being</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">was/were</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">been</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)"><strong>have</strong></td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">have</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">has</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">having</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">had</td>
                <td style="padding: 0.5rem 0.65rem; border: 1px solid var(--color-border-subtle)">had</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="margin-top: 1.25rem">You do not need to memorize everything today. This guide gives you the map — the quiz helps you practice two verbs at a time.</p>
      `,
      exercises: [
        {
          id: "verb-forms-preview-1",
          title: "Match the code",
          instructions: "Connect each code to the right description.",
          items: [
            {
              type: "radio",
              label: "Which code is <strong>third person (he/she/it)</strong>?",
              options: [
                { value: "v1", label: "V1" },
                { value: "v1-3rd", label: "V1-3rd" },
                { value: "v2", label: "V2" },
              ],
              expectedAnswer: "v1-3rd",
            },
            {
              type: "radio",
              label: "Which code goes after <em>have / has</em>?",
              options: [
                { value: "v1-ing", label: "V1-ing" },
                { value: "v2", label: "V2" },
                { value: "v3", label: "V3" },
              ],
              expectedAnswer: "v3",
            },
          ],
        },
      ],
      tipBox: {
        title: "🎯 You are ready",
        content:
          "Open Verb Quiz 1 from the course map when your teacher releases it. You already know what V1, V1-3rd, V1-ing, V2, and V3 mean.",
      },
    },
  ],
};
