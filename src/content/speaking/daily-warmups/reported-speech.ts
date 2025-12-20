import type { SpeakingActivityContent } from "@/types/activity";

export const reportedSpeechDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/29/26: Reported Speech Practice",
  description: "Practice reporting what others said, asked, or told you to do",

  keyPhrases: [
    { phrase: "She said that...", example: "She said that she was tired." },
    { phrase: "He told me to...", example: "He told me to come back tomorrow." },
    { phrase: "They asked if...", example: "They asked if I could work overtime." },
    { phrase: "My teacher explained that...", example: "My teacher explained that we would have a test next week." },
    { phrase: "The doctor advised me to...", example: "The doctor advised me to get more rest." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "What did your teacher say in the last class? Report 3 things your teacher said or explained.",
      context: "Change direct speech to reported: 'You need to study' becomes 'She said that we needed to study.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Tell me about the last conversation you had with a friend or family member. What did they say? What did you say?",
      context: "Practice: 'My friend said she was worried about her job. I told her that everything would be okay.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "Report instructions you've been given at work or home. What did someone tell you to do? What did they ask you to do?",
      context: "Reported commands/requests: 'My boss told me to finish the report by Friday' or 'She asked me to help her move.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "What questions did people ask you when you first arrived in the U.S.? Report what they asked.",
      context: "Reported questions: 'They asked where I was from' or 'People asked if I spoke English' (notice: no question mark!)."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "What advice have you been given about learning English or finding work? Who gave you this advice? What did they say?",
      context: "Example: 'My teacher advised me to practice speaking every day' or 'A friend suggested that I join a conversation group.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Think of a rumor or news you heard. Report what you heard using reported speech.",
      context: "Practice: 'I heard that the store is closing next month' or 'Someone told me that they're hiring at the hospital.'"
    },
  ],

  reflectionPrompt: "What's the hardest part of reported speech? Changing tenses? Changing pronouns? Give an example.",
  reflectionMinLength: 40,
  minPromptsRequired: 3,
  released: false
};
