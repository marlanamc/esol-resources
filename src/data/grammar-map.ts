export interface GrammarTopic {
    id: string;
    title: string;
    week?: number;
    category: 'foundation' | 'tenses' | 'gerunds-infinitives' | 'modals' | 'advanced' | 'writing';
    subcategory?: 'simple' | 'continuous' | 'perfect' | 'perfect-continuous'; // For verb tenses
    prerequisites?: string[]; // IDs of topics that should be completed first
    relatedTopics?: string[]; // IDs of topics that are conceptually related
    activityId?: string; // ID in the database if it exists as an activity
}

export const grammarTopics: GrammarTopic[] = [
    // Foundation (Week 1)
    {
        id: 'parts-of-speech',
        title: 'Parts of Speech',
        week: 1,
        category: 'foundation',
        activityId: 'parts-of-speech',
    },

    // Simple Tenses (Weeks 2-4)
    {
        id: 'present-simple',
        title: 'Present Simple',
        week: 2,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['parts-of-speech'],
        activityId: 'present-simple',
    },
    {
        id: 'past-simple',
        title: 'Past Simple',
        week: 3,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['present-simple'],
        activityId: 'past-simple',
    },
    {
        id: 'future-simple',
        title: 'Future Simple',
        week: 4,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['present-simple', 'past-simple'],
        activityId: 'future-simple',
    },
    {
        id: 'simple-tenses-review',
        title: 'Simple Tenses Review',
        week: 4,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['present-simple', 'past-simple', 'future-simple'],
        relatedTopics: ['present-simple', 'past-simple', 'future-simple'],
        activityId: 'simple-tenses-review',
    },

    // Continuous Tenses (Weeks 5-7)
    {
        id: 'present-continuous',
        title: 'Present Continuous',
        week: 5,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['present-simple'],
        activityId: 'present-continuous',
    },
    {
        id: 'past-continuous',
        title: 'Past Continuous',
        week: 6,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['past-simple', 'present-continuous'],
        activityId: 'past-continuous',
    },
    {
        id: 'future-continuous',
        title: 'Future Continuous',
        week: 7,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['future-simple', 'present-continuous'],
        activityId: 'future-continuous',
    },
    {
        id: 'continuous-tenses-review',
        title: 'Continuous Tenses Review',
        week: 7,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['present-continuous', 'past-continuous', 'future-continuous'],
        relatedTopics: ['present-continuous', 'past-continuous', 'future-continuous'],
        activityId: 'continuous-tenses-review',
    },

    // Gerunds & Infinitives (Week 8)
    {
        id: 'infinitives-vs-gerunds',
        title: 'Infinitives vs Gerunds (6 Patterns)',
        week: 8,
        category: 'gerunds-infinitives',
        prerequisites: ['parts-of-speech'],
        activityId: 'infinitives-vs-gerunds',
    },
    {
        id: 'verbs-plus-gerunds',
        title: 'Verbs + Gerunds (Pattern 2)',
        week: 19,
        category: 'gerunds-infinitives',
        prerequisites: ['infinitives-vs-gerunds'],
        relatedTopics: ['infinitives-vs-gerunds'],
        activityId: 'verbs-plus-gerunds',
    },
    {
        id: 'gerunds-prepositions',
        title: 'Preposition + Gerunds (Pattern 3)',
        week: 9,
        category: 'gerunds-infinitives',
        prerequisites: ['infinitives-vs-gerunds'],
        relatedTopics: ['infinitives-vs-gerunds'],
        activityId: 'gerunds-prepositions',
    },

    // Modals & Questions (Weeks 9-11)
    {
        id: 'modals-obligation-permission',
        title: 'Modals: Obligation & Permission',
        week: 11,
        category: 'modals',
        prerequisites: ['parts-of-speech'],
        activityId: 'modals-obligation-permission',
    },
    {
        id: 'information-questions',
        title: 'Information Questions (Wh- Questions)',
        week: 10,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityId: 'information-questions',
    },

    // Perfect Tenses (Weeks 12-14)
    {
        id: 'present-perfect',
        title: 'Present Perfect',
        week: 12,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-simple', 'past-simple'],
        activityId: 'present-perfect',
    },
    {
        id: 'past-perfect',
        title: 'Past Perfect',
        week: 13,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-perfect', 'past-simple'],
        activityId: 'past-perfect',
    },
    {
        id: 'future-perfect',
        title: 'Future Perfect',
        week: 14,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-perfect', 'future-simple'],
        activityId: 'future-perfect',
    },
    {
        id: 'perfect-tenses-review',
        title: 'Perfect Tenses Review',
        week: 14,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-perfect', 'past-perfect', 'future-perfect'],
        relatedTopics: ['present-perfect', 'past-perfect', 'future-perfect'],
        activityId: 'perfect-tenses-review',
    },

    // Perfect Continuous Tenses (Weeks 15-17)
    {
        id: 'present-perfect-continuous',
        title: 'Present Perfect Continuous',
        week: 15,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['present-perfect', 'present-continuous'],
        activityId: 'present-perfect-continuous',
    },
    {
        id: 'past-perfect-continuous',
        title: 'Past Perfect Continuous',
        week: 16,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['past-perfect', 'past-continuous'],
        activityId: 'past-perfect-continuous',
    },
    {
        id: 'future-perfect-continuous',
        title: 'Future Perfect Continuous',
        week: 17,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['future-perfect', 'future-continuous'],
        activityId: 'future-perfect-continuous',
    },
    {
        id: 'perfect-continuous-tenses-review',
        title: 'Perfect Continuous Review',
        week: 17,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['present-perfect-continuous', 'past-perfect-continuous', 'future-perfect-continuous'],
        relatedTopics: ['present-perfect-continuous', 'past-perfect-continuous', 'future-perfect-continuous'],
        activityId: 'perfect-continuous-tenses-review',
    },

    // Advanced Grammar (Weeks 18-21)
    {
        id: 'future-conditional',
        title: 'Future Conditional (First Conditional)',
        week: 18,
        category: 'advanced',
        prerequisites: ['future-simple'],
        activityId: 'future-conditional',
    },
    {
        id: 'conditionals-zero-first',
        title: 'Zero & First Conditionals',
        week: 18,
        category: 'advanced',
        prerequisites: ['future-simple'],
        relatedTopics: ['future-conditional'],
        activityId: 'conditionals-zero-first',
    },
    {
        id: 'conditionals-second',
        title: 'Second Conditional (Hypothetical)',
        week: 19,
        category: 'advanced',
        prerequisites: ['conditionals-zero-first'],
        relatedTopics: ['future-conditional', 'conditionals-zero-first'],
        activityId: 'conditionals-second',
    },
    {
        id: 'passive-voice',
        title: 'Passive Voice',
        week: 20,
        category: 'advanced',
        prerequisites: ['simple-tenses-review'],
        activityId: 'passive-voice',
    },
    {
        id: 'conditionals-review',
        title: 'Conditionals Review (All Types)',
        week: 21,
        category: 'advanced',
        prerequisites: ['conditionals-zero-first', 'conditionals-second'],
        relatedTopics: ['future-conditional', 'conditionals-zero-first', 'conditionals-second'],
        activityId: 'conditionals-review',
    },
    {
        id: 'reported-speech',
        title: 'Reported Speech',
        week: 21,
        category: 'advanced',
        prerequisites: ['simple-tenses-review'],
        activityId: 'reported-speech',
    },
    {
        id: 'used-to-would-rather',
        title: 'Used To & Would Rather',
        week: 10,
        category: 'advanced',
        prerequisites: ['past-simple'],
        activityId: 'used-to-would-rather',
    },

    // Workplace & Professional (Weeks 11-13)
    {
        id: 'workplace-phrasal-verbs',
        title: 'Workplace Phrasal Verbs',
        week: 13,
        category: 'advanced',
        prerequisites: ['parts-of-speech'],
        activityId: 'workplace-phrasal-verbs',
    },
    {
        id: 'superlatives-quantifiers',
        title: 'Superlatives & Quantifiers',
        week: 9,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityId: 'superlatives-quantifiers',
    },

    // Writing (Week 2-3)
    {
        id: 'punctuation-capitalization',
        title: 'Punctuation & Capitalization',
        week: 2,
        category: 'writing',
        prerequisites: ['parts-of-speech'],
        activityId: 'punctuation-capitalization',
    },
    {
        id: 'paragraph-format',
        title: 'Paragraph Format',
        week: 3,
        category: 'writing',
        prerequisites: ['punctuation-capitalization'],
        activityId: 'paragraph-format',
    },
    {
        id: 'imperatives-declaratives',
        title: 'Imperatives & Declaratives',
        week: 2,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityId: 'imperatives-declaratives',
    },

    // Comprehensive Review (Week 22-24)
    {
        id: 'all-verb-tenses-overview',
        title: 'All Verb Tenses Overview',
        week: 22,
        category: 'tenses',
        subcategory: 'perfect-continuous', // Placed with perfect-continuous as the final review
        prerequisites: ['simple-tenses-review', 'continuous-tenses-review', 'perfect-tenses-review', 'perfect-continuous-tenses-review'],
        relatedTopics: ['simple-tenses-review', 'continuous-tenses-review', 'perfect-tenses-review', 'perfect-continuous-tenses-review'],
        activityId: 'all-verb-tenses-overview',
    },
];

// Category colors for the network graph
export const categoryColors = {
    foundation: '#3b82f6', // Blue
    tenses: '#22c55e', // Green
    'gerunds-infinitives': '#f59e0b', // Amber
    modals: '#8b5cf6', // Purple
    advanced: '#ec4899', // Pink
    writing: '#14b8a6', // Teal
};

// Category labels
export const categoryLabels = {
    foundation: 'Foundation',
    tenses: 'Verb Tenses',
    'gerunds-infinitives': 'Gerunds & Infinitives',
    modals: 'Modals',
    advanced: 'Advanced',
    writing: 'Writing',
};

// Helper function to get topic by ID
export function getTopicById(id: string): GrammarTopic | undefined {
    return grammarTopics.find(topic => topic.id === id);
}

// Helper function to get prerequisites for a topic
export function getPrerequisites(topicId: string): GrammarTopic[] {
    const topic = getTopicById(topicId);
    if (!topic || !topic.prerequisites) return [];
    return topic.prerequisites.map(id => getTopicById(id)).filter(Boolean) as GrammarTopic[];
}

// Helper function to get topics that depend on this topic
export function getDependents(topicId: string): GrammarTopic[] {
    return grammarTopics.filter(topic =>
        topic.prerequisites?.includes(topicId)
    );
}

// Helper function to get related topics
export function getRelatedTopics(topicId: string): GrammarTopic[] {
    const topic = getTopicById(topicId);
    if (!topic || !topic.relatedTopics) return [];
    return topic.relatedTopics.map(id => getTopicById(id)).filter(Boolean) as GrammarTopic[];
}
