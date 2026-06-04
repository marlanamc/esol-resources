import type { CafeCatchUpContent } from "./types";

/**
 * Cafe Catch-Up: Big Questions
 *
 * A general-purpose speaking deck for fun, thoughtful conversation.
 * Reserved deck id 'sip' marks the closing "Last Sip" wrap-up card and is
 * excluded from the regular rotation.
 */
export const bigQuestions: CafeCatchUpContent = {
    type: "cafe-catch-up",
    title: "Cafe Catch-Up: Big Questions",
    description:
        "A cafe-style conversation game with fun, open-ended questions about choices, memories, imagination, and everyday opinions. No right answers - just good conversation.",
    theme: "Big Questions",
    participationPoints: 5,
    decks: [
        { id: "spark", label: "Warm sparks" },
        { id: "wonder", label: "What if?" },
        { id: "values", label: "Real talk" },
        { id: "stories", label: "Life stories" },
    ],
    starters: [
        "The person who smiled most recently.",
        "Whoever had the longest trip today.",
        "The person whose phone battery is lowest.",
        "Whoever drank coffee, tea, or water most recently.",
        "The person wearing the brightest color.",
        "Whoever woke up earliest today.",
        "The person who cooked most recently.",
        "Whoever has the shortest first name.",
        "The person who last listened to music.",
        "Whoever has lived in this city the longest.",
        "The person with the next birthday.",
        "Whoever used public transportation most recently.",
        "The person who has watched a movie most recently.",
        "Whoever is sitting closest to the door.",
        "The person who learned a new word this week.",
    ],
    listenerPhrases: {
        primary: [
            "That is interesting.",
            "Why do you think that?",
            "Tell me more.",
            "I see it differently.",
        ],
        more: [
            "Can you give an example?",
            "I never thought about it that way.",
            "What would you do next?",
            "That reminds me of something.",
            "Do you think most people agree?",
        ],
    },
    prompts: [
        // --- Warm Sparks ---
        {
            id: 1,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "If you could instantly become good at one small everyday skill, what would you choose?",
            followUp: "How would your daily life change if you had that skill?",
        },
        {
            id: 2,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "What is a simple thing that can make a normal day feel special?",
            followUp: "Do you think people notice small good moments enough?",
        },
        {
            id: 3,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "Which is better: a quiet weekend with no plans, or a busy weekend with friends and family?",
            followUp: "Does your answer change depending on the season or your mood?",
        },
        {
            id: 4,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "If your personality were a kind of weather, what weather would it be today?",
            followUp: "What kind of weather do you want to feel like next week?",
        },
        {
            id: 5,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "What is one food, song, smell, or place that immediately gives you a memory?",
            followUp: "Is the memory happy, funny, complicated, or something else?",
        },
        {
            id: 6,
            deck: "spark",
            sectionLabel: "Warm Sparks",
            stem: "If someone visited your neighborhood for one afternoon, what would you tell them to notice?",
            followUp: "What might they miss if they only looked quickly?",
        },

        // --- What If? ---
        {
            id: 7,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "If every adult had to take one class every year, what class should everyone take?",
            followUp: "Would people enjoy it, or only need it?",
        },
        {
            id: 8,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "If you could ask one question to your future self, what would you ask?",
            followUp: "Would you want a clear answer, or only a hint?",
        },
        {
            id: 9,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "Imagine phones disappeared for one week. What would get easier? What would get harder?",
            followUp: "Who would you miss contacting first?",
        },
        {
            id: 10,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "If you could trade lives with any person for one ordinary Tuesday, who would you choose?",
            followUp: "What would you want to understand about that person's life?",
        },
        {
            id: 11,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "If you had to create a new holiday, what would people celebrate and how would they celebrate it?",
            followUp: "Would it be serious, funny, peaceful, loud, or something else?",
        },
        {
            id: 12,
            deck: "wonder",
            sectionLabel: "What If?",
            stem: "If every person had a tiny instruction manual, what warning or tip would be in yours?",
            followUp: "Would people be surprised by it?",
        },

        // --- Real Talk ---
        {
            id: 13,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "What makes someone a good listener?",
            followUp: "Can listening be more helpful than giving advice?",
        },
        {
            id: 14,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "Which matters more in a hard situation: being honest, being kind, or being patient?",
            followUp: "Can you think of a time when one mattered most?",
        },
        {
            id: 15,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "What is something people often confuse with success?",
            followUp: "How do you personally know when you are doing well?",
        },
        {
            id: 16,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "Is it better to be very good at one thing, or pretty good at many things?",
            followUp: "Which one describes you more right now?",
        },
        {
            id: 17,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "What is a rule from childhood that you still believe is useful?",
            followUp: "What is a rule from childhood that you question now?",
        },
        {
            id: 18,
            deck: "values",
            sectionLabel: "Real Talk",
            stem: "When is it brave to change your mind?",
            followUp: "What helps people admit they were wrong?",
        },

        // --- Life Stories ---
        {
            id: 19,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "Tell us about a time when a stranger was kind to you.",
            followUp: "Did that moment change how you treated other people?",
        },
        {
            id: 20,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "What is a mistake that taught you something useful?",
            followUp: "Would you warn someone else, or let them learn it for themselves?",
        },
        {
            id: 21,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "What is something you used to think was difficult, but now feels normal?",
            followUp: "What made it become easier?",
        },
        {
            id: 22,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "Describe a place where you felt like you belonged.",
            followUp: "Was it because of the place, the people, or the moment?",
        },
        {
            id: 23,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "What is a compliment you remember?",
            followUp: "Why do you think that one stayed with you?",
        },
        {
            id: 24,
            deck: "stories",
            sectionLabel: "Life Stories",
            stem: "What is one small decision that changed more than you expected?",
            followUp: "Did you know it was important at the time?",
        },

        // --- Last Sip (closer; excluded from rotation) ---
        {
            id: 25,
            deck: "sip",
            sectionLabel: "Last Sip",
            stem: "What is one idea, story, or question from today's conversation that you want to keep thinking about?",
            followUp: "Share it in one or two sentences.",
        },
    ],
};
