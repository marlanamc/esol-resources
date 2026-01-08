import type { SpeakingActivityContent } from "@/types/activity";

export const workplacePoliciesProcedures_2026_04_02: SpeakingActivityContent = {
  type: "speaking",
  title: "4/2/26: Workplace Policies (Phrasal Verbs)",
  description: "Practice talking about workplace policies using phrasal verbs (fill out, turn in, call in, sign in/out, check in, follow up, go over)",

  keyPhrases: [
    { phrase: "fill out", example: "You need to fill out this form. Did you fill out the timesheet?" },
    { phrase: "turn in / hand in", example: "Turn in your report by Friday. When do I hand in my paperwork?" },
    { phrase: "call in", example: "If you're sick, call in before 9am. I called in sick yesterday." },
    { phrase: "sign in / sign out", example: "Don't forget to sign in when you arrive. Did you sign out when you left?" },
    { phrase: "check in", example: "Check in with your manager every morning. I need to check in at the front desk." },
    { phrase: "go over", example: "Let's go over the safety rules. Can you go over the procedure again?" },
    { phrase: "follow up", example: "Follow up with HR about your schedule. I'll follow up next week." },
    { phrase: "write down / point out", example: "Write down the steps. Can you point out where I sign?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using the Key Phrases", required: true },
      { id: "s3", text: "Add 2 detail words (place/time/people) to your sentences", required: true },
      { id: "s4", text: "Write 2 follow-up questions you can ask a partner", required: true }
    ],
    inputs: [
      { id: "sentence1", label: "Sentence 1", type: "textarea", required: true },
      { id: "sentence2", label: "Sentence 2", type: "textarea", required: true },
      { id: "sentence3", label: "Sentence 3", type: "textarea", required: true },
      { id: "question1", label: "Follow-up Question 1", type: "text", required: true },
      { id: "question2", label: "Follow-up Question 2", type: "text", required: true }
    ],
    help: {
      sentenceFrames: [
        "fill out",
        "turn in / hand in",
        "call in",
        "sign in / sign out",
        "check in",
        "go over",
        "follow up",
        "write down / point out"
      ],
      questionStems: [
        "Why?",
        "When?",
        "Where?",
        "How often?",
        "Who with?",
        "What is it like?"
      ],
      wordBank: [
        "form", "policy", "procedure", "HR", "shift", "sick", "report",
        "manager", "clock in", "safety", "help", "question"
      ]
    }
  },

  speakingMode: {
    title: "Speaking Mode (10 minutes)",
    subtitle: "Start when your teacher says GO.",
    checklist: [
      { id: "p1", text: "Speak for 2 minutes (Partner A)", required: true },
      { id: "p2", text: "Ask 2 follow-up questions (Partner B)", required: true },
      { id: "p3", text: "Switch roles and repeat", required: true },
      { id: "p4", text: "Write ONE best sentence you said (or heard)", required: true }
    ],
    inputs: [
      { id: "bestSentence", label: "Best sentence", type: "textarea", required: true }
    ],
    noPartnerNote: "Make a trio. Roles: Speaker (2 min), Question-asker (asks 2), Listener (writes 1 best sentence). Rotate."
  },

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Use 'fill out' and 'turn in': Talk about forms and paperwork at work.",
      context: "Example: 'When you start, you need to fill out a W-4 form. You have to turn in your timesheet every Friday. Did you fill out your direct deposit form?'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use 'call in' and 'check in': Explain what to do if you're sick or late.",
      context: "Example: 'If you're sick, call in before your shift starts. When you arrive, check in with your manager. I called in sick last week.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'sign in/out': Explain the clock-in/clock-out policy.",
      context: "Example: 'You have to sign in when you arrive. Don't forget to sign out when you leave. I forgot to sign out yesterday.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'go over' and 'write down': Ask someone to explain a policy again.",
      context: "Example: 'Can you go over the break policy again? I want to write down the important details. Let's go over the safety rules together.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Use 'follow up' and 'point out': Talk about asking questions and getting help.",
      context: "Example: 'If you have questions, follow up with HR. Can you point out where I need to sign this form? I'll follow up with my manager tomorrow.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full policy explanation: Use at least 5 phrasal verbs (fill out, turn in, call in, sign in/out, check in, go over, follow up, write down, point out).",
      context: "Example: 'On your first day, fill out all the forms and turn them in to HR. Every day, sign in when you arrive and check in with your manager. If you're sick, call in before 9am. Let's go over the policies, and write down anything important.'"
    },
  ],

  reflectionPrompt: "Which phrasal verb is most useful for understanding workplace policies? Which one do you need to practice more?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
