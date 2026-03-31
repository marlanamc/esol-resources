import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceSmallTalkSafeTopics_2026_03_31: SpeakingActivityContent = {
  type: "speaking",
  title: "3/31/26: Workplace Small Talk (Phrasal Verbs)",
  description: "Practice workplace small talk using common phrasal verbs (show up, catch up, drop by, run into, look forward to, hang out)",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "catch up", example: "It's nice to catch up with you! We should catch up more often." },
    { phrase: "show up", example: "What time did you show up today? I showed up early." },
    { phrase: "drop by", example: "Can you drop by my desk later? I have a quick question." },
    { phrase: "run into", example: "I ran into Maria at the coffee shop yesterday." },
    { phrase: "look forward to", example: "I'm looking forward to the long weekend!" },
    { phrase: "hang out", example: "Do you want to hang out after work and get coffee?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Use 'catch up' and 'show up' in small talk: Talk about arriving at work and catching up with a coworker.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'Hi! What time did you show up today? I showed up at 8. It's nice to catch up with you—we're both always so busy!'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use 'drop by' and 'hang out': Ask about visiting briefly and socializing after work.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Example: 'Can you drop by after lunch? A few of us might hang out after work if you're free.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'run into' and 'look forward to': Talk about unexpected meetings and upcoming plans.",
      context: "Example: 'I ran into Sarah at Market Basket yesterday! Are you looking forward to the weekend? I'm looking forward to sleeping in!'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'drop by' and 'look forward to': Talk about making plans and seeing someone later.",
      context: "Example: 'Drop by my desk before you leave. I'm looking forward to the team lunch tomorrow.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Full small talk conversation: Use at least 4 different phrasal verbs (show up, catch up, drop by, run into, look forward to, hang out).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'Hey! What time did you show up? I got here early. I ran into the new manager this morning. Drop by later if you have time, and let's catch up. I'm looking forward to hanging out after work.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Phrasal verbs in context: Use 'figure out' (solve/understand), 'come up' (be mentioned), 'fill in for' (replace someone).",
      context: "Example: 'Did you figure out the new schedule? My name didn't come up on the list. Can you fill in for me on Thursday?'"
    },
  ],// 

  reflectionPrompt: "Which phrasal verb is most useful for workplace small talk? Which one is hardest to remember?",// 
  reflectionMinLength: 35,//  released: false
};
