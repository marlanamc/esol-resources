import type { SpeakingActivityContent } from "@/types/activity";

export const usedToStructuresDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "4/9/26: Used To / Be Used To / Get Used To",
  description: "Practice used to structures. Focus: past habits vs current comfort vs ongoing adjustment.",

  keyPhrases: [
    { phrase: "I used to...", example: "I used to live in Mexico, but now I live here." },
    { phrase: "I'm (not) used to...", example: "I'm not used to waking up early for work." },
    { phrase: "I'm getting used to...", example: "I'm getting used to the cold weather here." },
    { phrase: "I can't get used to...", example: "I can't get used to the traffic patterns." },
    { phrase: "It used to be...", example: "It used to be difficult to find affordable housing." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 4 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing used to structures", required: true },
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
        "I used to [verb]...",
        "I didn't use to [verb]...",
        "I'm (not) used to [verb-ing]...",
        "I'm getting used to [verb-ing]...",
        "I can't get used to [verb-ing]...",
        "It used to be [adjective] to [verb]...",
        "Now I'm used to [verb-ing]..."
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
        "used to", "be used to", "get used to", "accustomed", "adjust", "change",
        "habit", "routine", "lifestyle", "different", "same", "easy", "hard",
        "difficult", "comfortable", "uncomfortable", "transition", "adapt"
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
      level: "advanced",
      text: "USED TO (past habit): What did you use to do in your home country that you don't do anymore? What didn't you use to do?",
      context: "Example: 'I used to walk to work every day, but now I take the bus' or 'I didn't use to speak English, but now I do.'"
    },
    {
      id: "prompt-2",
      level: "advanced",
      text: "BE USED TO (accustomed): What are you used to doing now in the U.S.? What are you NOT used to yet?",
      context: "Example: 'I'm used to the food here now' or 'I'm not used to the traffic yet' (followed by noun or -ing)"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "GET USED TO (becoming accustomed): What are you getting used to? What was hard to get used to when you first arrived?",
      context: "Example: 'I'm getting used to speaking English every day' or 'It was hard to get used to driving on the right side.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "GET TO (have opportunity): What do you get to do this weekend? What do you get to do at your job that you enjoy?",
      context: "Example: 'I get to spend time with my kids' or 'I get to help customers' (get to = have the privilege/opportunity)"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Compare USED TO and BE USED TO: What did you use to eat for breakfast? Are you used to American breakfast now?",
      context: "Notice: 'I used to eat rice for breakfast' (past habit) vs 'I'm used to eating cereal now' (accustomed to current habit)"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complete these sentences: 'Before I came here, I used to...' 'Now I'm used to...' 'I'm still getting used to...'",
      context: "Show the progression: past habit → current comfort → ongoing adjustment. Example: 'I used to speak Spanish all day. Now I'm used to speaking English at work. I'm still getting used to English idioms.'"
    },
  ],

  reflectionPrompt: "Which structure is most confusing: used to, be used to, or get used to? Explain the difference in your own words.",
  reflectionMinLength: 50,
  minPromptsRequired: 4,
  released: false
};
