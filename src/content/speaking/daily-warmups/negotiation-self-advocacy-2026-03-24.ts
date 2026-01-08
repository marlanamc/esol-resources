import type { SpeakingActivityContent } from "@/types/activity";

export const negotiationSelfAdvocacy_2026_03_24: SpeakingActivityContent = {
  type: "speaking",
  title: "3/24/26: Negotiation & Self-Advocacy (Infinitives vs Gerunds)",
  description: "Practice negotiation language. Focus: infinitives vs gerunds for workplace situations.",

  keyPhrases: [
    { phrase: "I'd like to... (infinitive)", example: "I'd like to change my schedule." },
    { phrase: "I plan to... (infinitive)", example: "I plan to take classes on Tuesdays." },
    { phrase: "I need to... (infinitive)", example: "I need to improve my computer skills." },
    { phrase: "I enjoy... (gerund)", example: "I enjoy working with customers." },
    { phrase: "I can't... (gerund)", example: "I can't avoid working late if my child is sick." },
    { phrase: "Would you consider...? (gerund)", example: "Would you consider changing your shift?" },
    { phrase: "I decided to... (infinitive)", example: "I decided to ask for a schedule change." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing infinitives and gerunds", required: true },
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
        "I'd like to [verb]...",
        "I plan to [verb]...",
        "I need to [verb]...",
        "I enjoy [verb-ing]...",
        "I can't [verb] if [condition]...",
        "Would you consider [verb-ing]...?",
        "I decided to [verb]...",
        "I want to [verb]...",
        "I'm trying to [verb]..."
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
        "negotiate", "schedule", "shift", "change", "request", "ask", "propose", "offer", "accept", "decline",
        "workplace", "job", "position", "role", "team", "company", "organization", "industry", "field", "opportunity",
        "challenge", "solution", "advocate", "rights", "policy", "procedure", "communication"
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
      text: "Use INFINITIVES to explain what you need and want: I need to... / I want to... / I'd like to... / I plan to...",
      context: "Example: 'I'd like to change my schedule. I need to pick up my child at 3pm. I want to work mornings instead of evenings.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use GERUNDS to explain what you prefer and enjoy: I enjoy... / I prefer... / I like...",
      context: "Example: 'I enjoy working with customers. I prefer having weekends off. I like starting early in the morning.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Negotiation: Use both infinitives AND gerunds. What do you WANT TO do vs. What do you ENJOY DOING?",
      context: "Infinitive (goal): 'I want to work full-time.' Gerund (preference): 'I enjoy working with people.' Mix both in your answer!"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Ask your manager politely: Would you consider...? (gerund) / Would it be possible to...? (infinitive)",
      context: "Gerund: 'Would you consider changing my shift?' Infinitive: 'Would it be possible to work Tuesdays and Thursdays?'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Complex negotiation: Use verbs that take infinitives (decide to, plan to, hope to) AND verbs that take gerunds (avoid, finish, keep, suggest).",
      context: "Example: 'I decided to ask for a schedule change because I need to avoid working Sundays. I hope to keep working here, so I'm suggesting a different shift.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Grammar contrast: Explain what you CAN'T AVOID (gerund) vs. what you NEED TO DO (infinitive).",
      context: "Gerund: 'I can't avoid missing work if my child is sick.' Infinitive: 'I need to find childcare. I want to be reliable.'"
    },
  ],

  reflectionPrompt: "When negotiating, which is easier: using infinitives (want to, need to) or gerunds (enjoy -ing, prefer -ing)? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
