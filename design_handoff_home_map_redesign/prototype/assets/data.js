/* Class Companion — realistic content model (from the live curriculum) */
(function () {
  // Activity type → tone + glyph
  const TYPES = {
    guide:        { label: 'Guide',         tone: 'grammar', glyph: '📖' },
    grammar:      { label: 'Grammar',       tone: 'grammar', glyph: '📖' },
    vocab:        { label: 'Vocabulary',    tone: 'vocab',   glyph: '🗂️' },
    game:         { label: 'Game',          tone: 'game',    glyph: '🎮' },
    quiz:         { label: 'Quiz',          tone: 'quiz',    glyph: '✏️' },
    pronunciation:{ label: 'Pronunciation', tone: 'pron',    glyph: '🔊' },
    speaking:     { label: 'Speaking',      tone: 'speak',   glyph: '🎤' },
    writing:      { label: 'Writing',       tone: 'write',   glyph: '✍️' },
  };

  const CATEGORIES = [
    { key: 'grammar', label: 'Grammar',       tone: 'grammar', glyph: '📖' },
    { key: 'vocab',   label: 'Vocabulary',    tone: 'vocab',   glyph: '🗂️' },
    { key: 'quiz',    label: 'Quizzes',       tone: 'quiz',    glyph: '✏️' },
    { key: 'game',    label: 'Games',         tone: 'game',    glyph: '🎮' },
    { key: 'pron',    label: 'Pronunciation', tone: 'pron',    glyph: '🔊' },
    { key: 'speak',   label: 'Speaking',      tone: 'speak',   glyph: '🎤' },
  ];

  // mins helper
  const A = (title, type, mins) => ({ title, type, mins });

  // ---- In-class school year: units (months) → weeks → items ----
  // status of weeks is derived from `releasedThrough` + `currentWeek`
  const UNITS = [
    { n: 1, title: 'Getting to Know You', month: 'September', weeks: [
      { n: 1, title: 'Start the Class', goal: 'Settle in, learn the five verb-form codes, take Verb Quiz 1.', items: [
        A('Welcome / How to Use the App','guide',6), A('Vocab: Digital Habits','vocab',8),
        A('Simple & Continuous Review','guide',10), A('Verb Forms: V1 → V3','guide',9),
        A('Timeline Tenses: Simple & Continuous','game',12), A('Verb Quiz 1: be + have','quiz',10) ] },
      { n: 2, title: 'Parts of Speech', goal: 'The building blocks of English, plus the weekly app habit.', items: [
        A('Vocab: Key Verbs','vocab',8), A('Parts of Speech Guide','guide',10),
        A('Parts of Speech Discovery','game',12), A('Grammar Hospital: Helper Verbs','game',10),
        A('Vowel Names: A / E / I','pronunciation',7), A('Verb Quiz 2','quiz',10) ] },
      { n: 3, title: 'Verb Forms + Past -ed', goal: 'Verb forms in context and the three -ed ending sounds.', items: [
        A('Vocab: Past Actions','vocab',8), A('Regular Past Tense Guide','guide',9),
        A('-ed Pronunciation Lab','pronunciation',10), A('Verb Quiz 3','quiz',10) ] },
      { n: 4, title: 'Telling the Story', goal: 'Past simple for finished actions, past continuous for in-progress.', items: [
        A('Vocab: Telling a Story','vocab',8), A('Past Simple + Continuous Guide','guide',11),
        A('Story Builder Game','game',12), A('Speaking: My Weekend','speaking',9), A('Verb Quiz 4','quiz',10) ] },
    ]},
    { n: 2, title: 'Daily Life in the Community', month: 'October', weeks: [
      { n: 5, title: 'Community Places + Routines', goal: 'Talk about your neighbourhood and daily routines.', items: [
        A('Vocab: Around Town','vocab',8), A('Present Simple Routines','guide',10), A('Place It! Game','game',11), A('Verb Quiz 5','quiz',10) ] },
      { n: 6, title: 'Transportation + Directions', goal: 'Ask for and give directions with confidence.', items: [
        A('Vocab: Getting Around','vocab',8), A('Prepositions of Place','guide',10), A('Directions Game','game',12) ] },
      { n: 7, title: 'Getting There', goal: 'Put directions and community vocabulary together.', items: [
        A('Asking the Right Questions','guide',10), A('Speaking: Give Directions','speaking',9), A('Verb Quiz 7','quiz',10) ] },
      { n: 8, title: 'Phone English + Family', goal: 'Make calls and talk about family connections.', items: [
        A('Vocab: On the Phone','vocab',8), A('Phone Phrases Guide','guide',9), A('Role-play: A Phone Call','speaking',10) ] },
    ]},
    { n: 3, title: 'Community Participation', month: 'November', weeks: [
      { n: 9,  title: 'Helping + Volunteering', goal: 'Offer help and talk about volunteering.', items: [
        A('Vocab: Volunteering','vocab',8), A('Offers & Suggestions','guide',10), A('Suggestion Spinner','game',11) ] },
      { n: 10, title: 'Public Meetings', goal: 'Make suggestions in a group setting.', items: [
        A('Lets Make a Suggestion','guide',10), A('Speaking: At a Meeting','speaking',10), A('Verb Quiz 10','quiz',10) ] },
      { n: 11, title: 'Voting + Officials', goal: 'Contact officials and understand voting basics.', items: [
        A('Vocab: Civics','vocab',8), A('Writing: A Short Email','writing',12) ] },
      { n: 12, title: 'Community Case Study', goal: 'Bring the unit together with a real issue.', items: [
        A('Case Study Reading','guide',12), A('Speaking: Present a Solution','speaking',12) ] },
    ]},
    { n: 4, title: 'Consumer Smarts', month: 'December', weeks: [
      { n: 13, title: 'How Long + For / Since', goal: 'Say how long you have done something.', items: [
        A('Vocab: Money & Plans','vocab',8), A('Present Perfect: For/Since','guide',11), A('How Long Game','game',11) ] },
    ]},
    { n: 5, title: 'Housing', month: 'January', weeks: [
      { n: 14, title: 'Housing Basics', goal: 'Describe a home and understand a rental listing.', items: [
        A('Vocab: Around the Home','vocab',8), A('There is / There are','guide',9),
        A('Listing Detective Game','game',12), A('Speaking: Describe Your Home','speaking',9), A('Verb Quiz 14','quiz',10) ] },
      { n: 15, title: 'Comparing Housing', goal: 'Compare apartments with comparatives & superlatives.', items: [
        A('Vocab: Apartment Hunting','vocab',8), A('More, Less, the Most','guide',11), A('Comparison Battle','game',12) ] },
      { n: 16, title: 'Landlord Calls + Repairs', goal: 'Request repairs and make polite complaints.', items: [
        A('Vocab: Repairs','vocab',8), A('Polite Requests Guide','guide',10), A('Role-play: Call the Landlord','speaking',11) ] },
      { n: 17, title: 'Housing Problems', goal: 'Describe problems and propose solutions.', items: [
        A('Problem / Solution Guide','guide',10), A('Writing: Repair Request','writing',12), A('Verb Quiz 17','quiz',10) ] },
    ]},
    { n: 6, title: 'Workforce Preparation', month: 'February', weeks: [
      { n: 18, title: 'Resume + Workplace Basics', goal: 'Start a simple resume and workplace vocabulary.', items: [
        A('Vocab: At Work','vocab',8), A('Resume Basics Guide','guide',12) ] },
      { n: 19, title: 'Work Stories + Schedules', goal: 'Talk about shifts and past work.', items: [
        A('Workplace Phrasal Verbs','game',11), A('Speaking: My Schedule','speaking',9) ] },
    ]},
    { n: 7, title: 'Career Awareness', month: 'March', weeks: [
      { n: 20, title: 'Applications + Interviews', goal: 'Practise interview questions and answers.', items: [
        A('Vocab: Interviews','vocab',8), A('Interview Q&A Guide','guide',11), A('Role-play: The Interview','speaking',12) ] },
    ]},
    { n: 8, title: 'Healthcare', month: 'April', weeks: [
      { n: 21, title: 'Healthcare Basics', goal: 'Describe symptoms and book appointments.', items: [
        A('Vocab: At the Clinic','vocab',8), A('Medical Instructions Guide','guide',11) ] },
    ]},
    { n: 9, title: 'Holistic Wellness', month: 'May', weeks: [
      { n: 22, title: 'Wellness Routines', goal: 'Talk about healthy habits and follow-ups.', items: [
        A('Vocab: Wellness','vocab',8), A('Healthy Habits Guide','guide',10) ] },
    ]},
    { n: 10, title: 'Future Academic Goals', month: 'June', weeks: [
      { n: 23, title: 'Year in Review + Celebrate', goal: 'Reflect on the year and set next goals.', items: [
        A('Reflection: My Year','writing',12), A('Speaking: My Goals','speaking',10) ] },
    ]},
  ];

  // ---- Independent learner LEVELS (same content, self-paced, themed) ----
  const LEVELS = UNITS.map((u, i) => ({
    n: u.n,
    name: ['Foundations','Everyday Life','Your Community','Smart Choices','Home & Housing',
           'Work-Ready','Careers','Health','Wellbeing','Next Steps'][i],
    sourceTitle: u.title,
    // flatten the unit's weeks into a single self-paced level
    items: u.weeks.flatMap(w => w.items),
  }));

  // ---- Current state ----
  const STATE = {
    inClass: {
      name: 'Marlie',
      weekRange: 'Jan 13 – 17',
      currentUnit: 5,        // Housing
      currentWeek: 14,       // Housing Basics
      releasedThroughWeek: 14, // teacher has released up to & including week 14
      // completion: weeks < 14 fully done; week 14 partially done
      weekDone: { /* weekN: completedCount */ 14: 2 },
      streak: 6, longestStreak: 11, points: 1840, weekActivity: [1,1,0,1,1,1,0],
    },
    independent: {
      name: 'Daniela',
      currentLevel: 5,       // Home & Housing
      streak: 9, longestStreak: 14, points: 3120, xp: 3120, xpThisLevel: 240, xpForLevel: 400,
      weekActivity: [1,1,1,0,1,1,1],
      weeklyGoal: 4, weeklyDone: 3, daysLeft: 3,
      rank: 2,
      levelDone: { 1:'done',2:'done',3:'done',4:'done',5:'progress' },
    },
  };

  // category browse counts (cosmetic)
  const BROWSE = { grammar: 42, vocab: 30, quiz: 23, game: 18, pron: 12, speak: 9 };

  window.CC_DATA = { TYPES, CATEGORIES, UNITS, LEVELS, STATE, BROWSE };
})();
