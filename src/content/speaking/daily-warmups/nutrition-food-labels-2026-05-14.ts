import type { SpeakingActivityContent } from "@/types/activity";

export const nutritionFoodLabels_2026_05_14: SpeakingActivityContent = {
  type: "speaking",
  title: "5/14/26: Nutrition & Food Labels (Used To Structures)",
  description: "Practice talking about eating habit changes using 'used to' (past habits), 'be used to' (be accustomed to), and 'get used to' (become accustomed to)",

  keyPhrases: [
    { phrase: "I used to... (past habit)", example: "I used to eat junk food every day. I used to skip breakfast." },
    { phrase: "I'm (not) used to... (accustomed)", example: "I'm not used to reading food labels. I'm used to eating vegetables now." },
    { phrase: "I'm getting used to... (becoming accustomed)", example: "I'm getting used to cooking at home. I'm getting used to eating less sugar." },
    { phrase: "I can't get used to... (can't adjust)", example: "I can't get used to drinking plain water. I can't get used to unsweetened coffee yet." },
    { phrase: "It used to be... (past state)", example: "It used to be hard to avoid sweets. It used to be expensive to eat healthy." },
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
        "I used to... (past habit)",
        "I'm (not) used to... (accustomed)",
        "I'm getting used to... (becoming accustomed)",
        "I can't get used to... (can't adjust)",
        "It used to be... (past state)"
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
        "eat", "habit", "labels", "sugar", "vegetables",
        "breakfast", "snack", "health", "adjust", "drink", "portion"
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
      level: "beginner",
      text: "Talk about your past eating habits using 'used to': What did you use to eat? What didn't you use to eat?",
      context: "I used to eat fast food three times a week. I used to drink soda with every meal. I didn't use to eat vegetables. I used to skip breakfast."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Talk about nutrition changes: What used to be hard that is easier now? What food habits have changed?",
      context: "Example: 'It used to be hard to cook at home, but now it's easier. I used to buy frozen meals. Now I cook fresh food.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'I'm (not) used to...': What eating habits are you comfortable with? What is still difficult?",
      context: "I'm used to reading food labels now. I'm not used to eating breakfast yet. I'm used to drinking water instead of soda. I'm not used to measuring portions."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'I'm getting used to...': What new eating habits are you adjusting to?",
      context: "I'm getting used to checking nutrition labels. I'm getting used to eating smaller portions. It's hard, but I'm getting used to avoiding sugar."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Compare 'used to' (past) and 'be used to' (accustomed): What did you use to eat vs. What are you used to eating now?",
      context: "PAST: 'I used to eat chips every day.' ACCUSTOMED NOW: 'Now I'm used to eating fruit for snacks.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full nutrition story using all 3 structures: 'used to' (past), 'be used to' (accustomed), and 'get used to' (adjusting).",
      context: "Example: 'I used to never read food labels. I would just buy whatever looked good. Now I'm used to checking calories and sugar. I'm getting used to choosing healthier options. I'm also getting used to cooking more meals at home instead of eating out.'"
    },
  ],

  reflectionPrompt: "Which eating habit change is hardest to adjust to? Are you getting used to it, or can't you get used to it yet?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
