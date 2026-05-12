import type { CafeCatchUpContent } from "./types";

/**
 * Café Catch-Up: Boston Healthcare
 *
 * A speaking-discussion card deck for adult ESOL learners around
 * navigating healthcare in Boston / the U.S. Use at home for self-study
 * or paired with another learner. No right answers — the goal is
 * conversation practice.
 *
 * Reserved deck id 'sip' marks the closing "Last Sip" wrap-up card and is
 * excluded from the regular rotation; it surfaces only via the dedicated
 * "Last sip — wrap up" button in the renderer.
 */
export const bostonHealthcare: CafeCatchUpContent = {
    type: "cafe-catch-up",
    title: "Café Catch-Up: Boston Healthcare",
    description:
        "A card-deck of real-life discussion questions about going to the doctor, navigating insurance, and staying well in Boston. Pour a question, share what you think, and end with a Last Sip.",
    theme: "Boston Healthcare",
    participationPoints: 5,
    decks: [
        { id: "tea", label: "The Tea" },
        { id: "advice", label: "Friend advice" },
        { id: "wellness", label: "Wellness chat" },
    ],
    starters: [
        "The person with the longest commute today.",
        "Whoever drank coffee or tea this morning.",
        "The person sitting on the left of the table.",
        "Whoever is wearing the most colors right now.",
        "The person whose name is shortest at the table.",
        "Whoever has lived in Boston the longest.",
        "The person who arrived to class first today.",
        "Whoever speaks the most languages.",
        "The person who ate breakfast today.",
        "Whoever traveled out of Boston most recently.",
        "The person whose birthday is closest to today.",
        "Whoever cooked the last home meal.",
        "The person who watched something funny this week.",
        "Whoever has been to the doctor most recently.",
        "The person who has the most siblings.",
    ],
    listenerPhrases: {
        primary: [
            "Wait, really?",
            "Tell me more.",
            "That happened to me too.",
            "What did you do?",
        ],
        more: [
            "I would be confused too.",
            "If I were you, I would…",
            "That sounds stressful.",
            "How did that make you feel?",
            "Can you say that again?",
        ],
    },
    prompts: [
        // --- The Tea ---
        {
            id: 1,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever gone to an ER, urgent care, or a doctor's office in Boston or the U.S.? What was that experience like?",
            followUp: "Was anything surprising or confusing about the visit?",
        },
        {
            id: 2,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "How is healthcare in the U.S. different from healthcare in your home country? Think about cost, wait time, how you talk to the doctor.",
            followUp: "What do you think the U.S. does better? What does your home country do better?",
        },
        {
            id: 3,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever had trouble understanding a doctor, nurse, or pharmacist because of language? What did you do?",
            followUp: "Did you know you can ask for a free interpreter at any hospital in Massachusetts?",
        },
        {
            id: 4,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever received an After-Visit Summary from a doctor? Did you read it? Was any part confusing?",
            followUp: "What is the most important part of an After-Visit Summary to read first?",
        },
        {
            id: 14,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever picked up a prescription at a pharmacy in Boston? Did you understand what the pharmacist said about your medicine? What questions do you wish you had asked?",
            followUp: "Pharmacists can answer most medicine questions for free, with no appointment — did you know?",
        },
        {
            id: 15,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Tell us about the longest time you have ever waited to see a doctor or specialist — either in the waiting room, or waiting weeks for an appointment. What was that like?",
            followUp: "How did the wait make you feel? Did it change how you felt about going back?",
        },
        {
            id: 16,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever been to a dentist in the U.S.? How was the visit? Did anything about the cost or the experience surprise you?",
            followUp: "Dental care is often not covered by health insurance in the U.S. Were you ever surprised by a dental bill?",
        },
        {
            id: 17,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Do you remember the first time you tried to use health insurance in the U.S.? What was confusing? Who helped you figure it out?",
            followUp: "Is there a word from your insurance card — copay, deductible, premium, network — that you still don't fully understand?",
        },
        {
            id: 18,
            deck: "tea",
            sectionLabel: "The Tea: What Happened?",
            stem: "Have you ever called a doctor's office in English to make, change, or cancel an appointment? How did the call go? What did you say first?",
            followUp: "What is one phrase that always helps you when you are on the phone in English?",
        },

        // --- Friend Advice ---
        {
            id: 5,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "What is the hardest part of going to the doctor in Boston? Pick one and explain: finding a doctor, cost, insurance, language, time, or something else.",
            followUp: "Has this stopped you or someone you know from going to the doctor?",
        },
        {
            id: 6,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "Many people go to the ER when they could go to urgent care. Why do you think this happens? Is it always the wrong choice?",
            followUp: "What is one reason someone might choose the ER even for a small problem?",
        },
        {
            id: 7,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "Imagine you get a bill from the hospital and it is much higher than you expected. What would you do? Who could you call?",
            followUp: "Did you know most hospitals have financial assistance programs you can apply for?",
        },
        {
            id: 8,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "A friend just moved to Boston and does not have a doctor yet. She has a bad cough that has lasted two weeks. What advice would you give her — step by step?",
            followUp: "Where in Boston could she find a doctor who speaks her language?",
        },
        {
            id: 19,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "Your friend has no health insurance, but is feeling really sick and doesn't know where to go. What advice would you give? Where are some places in Boston they could try?",
            followUp: "Community health centers in Boston see patients with no insurance and lower the cost based on income — did you know?",
        },
        {
            id: 20,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "A friend's doctor told them they need surgery, but your friend is not sure it's the right choice. They are scared to ask another doctor. What would you say to encourage them?",
            followUp: "How could they politely ask their doctor for a second opinion?",
        },
        {
            id: 21,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "Your mother or father visits you in Boston and gets sick. They don't speak English and don't have U.S. insurance. What would you do first?",
            followUp: "What is the most important thing to bring with you to the hospital or clinic in this situation?",
        },
        {
            id: 22,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "A friend hasn't been to a doctor in many years because they are scared. What would you say to help them feel less afraid? What helps you when you feel nervous about a visit?",
            followUp: "What is one small first step they could take this month?",
        },
        {
            id: 23,
            deck: "advice",
            sectionLabel: "Friend Advice",
            stem: "Your friend takes blood pressure medicine every day, but the bottle is empty and their doctor is on vacation for two weeks. What advice would you give?",
            followUp: "Many pharmacies can give an emergency refill of a few days when the doctor is away — would you have known to ask?",
        },

        // --- Wellness Chat ---
        {
            id: 9,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Health words like regimen, hydration, moderation, nourish, balance, and wellness all describe how we care for ourselves. Which one feels most important to you right now in your own life? Why?",
            followUp: "Is there something you want to change about your health this summer?",
        },
        {
            id: 10,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "In your culture, what do people do when they are sick before going to a doctor? Home remedies, rest, herbal tea, something else?",
            followUp: "Do you still use any of these? Do you think they work?",
        },
        {
            id: 11,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Mental health is also part of wellness. Is it common to talk about mental health in your home country? Is it easier or harder to talk about it here in the U.S.?",
            followUp: "What is one thing that helps you when you are feeling stressed or overwhelmed?",
        },
        {
            id: 12,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Think about one health habit you want to start or improve this summer. What is it? What is one small step you can take this week?",
            followUp: "Share your goal with a friend. Can you help each other stay accountable?",
        },
        {
            id: 24,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "How much sleep do you usually get? Do you sleep well here in Boston? What helps your sleep, and what makes it harder?",
            followUp: "What is one small change that could give you 30 more minutes of sleep this week?",
        },
        {
            id: 25,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Eating healthy in the U.S. can be hard, especially on a budget. Share one food from your culture that is both healthy and affordable. Where do you buy it in Boston?",
            followUp: "What is one place in Boston that has good prices on fresh fruits and vegetables?",
        },
        {
            id: 26,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "How do you stay active in Boston? Is it harder in winter? What is one way you've found to move your body that you actually enjoy?",
            followUp: "Walking, transit, or driving — which do you do most? How does that affect your health?",
        },
        {
            id: 27,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Where do you go first when you have a health question — TikTok, family, a doctor, Google, somewhere else? Do you trust the information you find there?",
            followUp: "Is there a source you've stopped trusting? What changed your mind?",
        },
        {
            id: 28,
            deck: "wellness",
            sectionLabel: "Real Life Wellness Chat",
            stem: "Everyone feels stressed sometimes. What is one thing — big or small — that helps you feel calmer when life gets to be too much?",
            followUp: "Have you ever talked to a doctor about stress? Why or why not?",
        },

        // --- Last Sip (closer; excluded from rotation) ---
        {
            id: 13,
            deck: "sip",
            sectionLabel: "Last Sip",
            stem: "What is one story, idea, health word, or piece of advice from today's conversation that you want to remember? Share it in one or two sentences.",
        },
    ],
};
