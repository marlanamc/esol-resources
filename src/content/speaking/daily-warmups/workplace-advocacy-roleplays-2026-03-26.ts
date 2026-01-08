import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceAdvocacyRoleplays_2026_03_26: SpeakingActivityContent = {
  type: "speaking",
  title: "3/26/26: Workplace Advocacy Role-Plays (Infinitives vs Gerunds)",
  description: "Practice workplace advocacy conversations using infinitives (want to, need to, plan to) and gerunds (enjoy -ing, avoid -ing, consider -ing)",

  keyPhrases: [
    { phrase: "I'd like to... (infinitive)", example: "I'd like to discuss my schedule." },
    { phrase: "I need to / I want to... (infinitive)", example: "I need to understand the policy. I want to resolve this issue." },
    { phrase: "Would you consider...? (gerund)", example: "Would you consider changing my shift?" },
    { phrase: "I enjoy... but I need to... (gerund + infinitive)", example: "I enjoy working here, but I need to have consistent hours." },
    { phrase: "I plan to / I agree to... (infinitive)", example: "I plan to document everything. I agree to follow the new policy." },
    { phrase: "I suggest / I recommend... (gerund)", example: "I suggest meeting weekly to discuss this." },
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
        "I'd like to... (infinitive)",
        "I need to / I want to... (infinitive)",
        "Would you consider...? (gerund)",
        "I enjoy... but I need to... (gerund + infinitive)",
        "I plan to / I agree to... (infinitive)",
        "I suggest / I recommend... (gerund)"
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
        "advocate", "schedule", "shift", "policy", "document", "discuss",
        "suggest", "recommend", "agree", "need", "want", "consider"
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
      text: "Role-play: Employee explains a workplace problem using INFINITIVES (I need to..., I want to..., I'd like to...).",
      context: "Example: 'I'd like to talk about my schedule. I need to pick up my child at 3pm every day. I want to find a solution that works for both of us.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Role-play: Manager asks politely 'Would you consider...?' (gerund). Employee responds using infinitives OR gerunds.",
      context: "Manager: 'Would you consider working weekends?' Employee: 'I prefer having weekends off (gerund), but I'm willing to work Saturdays (infinitive).'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Mix infinitives and gerunds: What do you ENJOY doing at work (gerund) vs. What do you NEED TO change (infinitive)?",
      context: "Gerund: 'I enjoy working with customers.' Infinitive: 'But I need to have consistent breaks.' Use both in your answer!"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use verbs that take gerunds: suggest, recommend, avoid, consider. Example: 'I suggest meeting weekly' or 'I recommend reviewing the policy.'",
      context: "Practice: 'I suggest changing the schedule.' / 'Would you consider giving me more notice?' / 'I want to avoid working alone at night.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Full advocacy roleplay: Use BOTH infinitives (plan to, agree to, decide to) AND gerunds (suggest, avoid, keep) in one conversation.",
      context: "Example: 'I'd like to discuss my hours. I enjoy working here (gerund), but I need to have a set schedule (infinitive). Would you consider giving me consistent shifts? (gerund) I plan to stay long-term (infinitive) if we can resolve this.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Document the agreement: Say what you AGREED TO do (infinitive) vs. what you will KEEP DOING or AVOID DOING (gerunds).",
      context: "Infinitives: 'I agreed to work Tuesday and Thursday. I decided to request written schedules.' Gerunds: 'I will keep documenting my hours. I will avoid missing shifts.'"
    },
  ],

  reflectionPrompt: "When advocating for yourself at work, which grammar is more useful: infinitives (I need to, I want to) or gerunds (I enjoy, I prefer)? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
