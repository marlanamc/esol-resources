/**
 * Weekly vocabulary words for Cycle 1 (Sep–Jan) and Cycle 2 (Feb–Jun).
 * Target cadence: 6 words per week year-round (curated for real-world frequency).
 * Six core words/phrases per set; bonusWords are optional recognition vocabulary.
 * October 2026 revision favors useful spoken phrases alongside essential form/label terms.
 *
 * Each word may carry:
 *   - `topics: string[]` — topical Vocab Library grouping (see below)
 *   - `pos: string` — optional inline part of speech (e.g. "verb", "noun", "phrasal verb")
 *
 * POS is also curated incrementally in `weekly-vocab-pos.js` (unit-by-unit) and
 * merged at seed time with `legacy-pos-map.js`. After POS edits, run:
 *   npm run db:seed:weekly-vocab
 *
 * Topic vocabulary (v1):
 *   - career-job-search    Resumes, applications, interviews
 *   - career-on-the-job    Shifts, supervisors, workplace rules and communication
 *   - health               Symptoms, care, body, holistic wellness
 *   - housing              Lease, landlord, repairs, tenant rights
 *   - money                Spending, bills, banking, scams
 *   - civic-life           Volunteering, voting, meetings, community problem-solving
 *   - digital-skills       Logging in, navigating apps, online safety, forms
 *   - communication        Phone, email, polite phrases, asking/answering
 *   - transportation       Directions, buses/trains, movement
 *   - soft-skills          Reliability, flexibility, mindfulness, professional traits
 *
 * Generic verbs that don't fit a domain (e.g. "complete", "review") are intentionally
 * left untagged — they live in the weekly path and Daily Vocab Review only.
 *
 * Used by seed-weekly-vocab.js to create word list, flashcards, matching, and fill-in-the-blank activities.
 */

const weeklyVocabData = {
  // ── CYCLE 1: Units 1–5 (Sep–Jan) ─ 6 verbs per level ─────────────────────

  /** Unit 1 – Getting to Know You (September) */
  "sep-w1": {
    topic: "Start the Class",
    words: [
      { term: "introduce", def: "to present yourself or another person for the first time",           ex: "Please introduce yourself to the class.", fillBlank: { text: "On the first day, please _____ yourself to the class.", options: ["introduce", "greet", "share", "prefer"] } },
      {"term": "greet", "def": "to say hello to someone", "ex": "Greet your classmates when you arrive.", "fillBlank": {"text": "When you arrive, _____ your classmates by saying hello.", "options": ["share", "greet", "prefer", "describe"]}},
      {"term": "share", "def": "to tell someone your ideas, feelings, or information", "ex": "Share one interesting fact about yourself.", "fillBlank": {"text": "Tell us something about yourself: _____ one interesting fact with the class.", "options": ["catch up", "prefer", "share", "greet"]}},
      { term: "describe", def: "to say what something or someone is like",                           ex: "Describe your neighborhood to the class.", fillBlank: { text: "_____ your neighborhood. Is it quiet or busy?", options: ["introduce", "describe", "share", "catch up"] } },
      {"term": "prefer", "def": "to like one thing more than another", "ex": "I prefer working with a partner to working alone.", "fillBlank": {"text": "I like working with a partner more than working alone. I _____ working with a partner.", "options": ["describe", "share", "greet", "prefer"]}},
      { term: "catch up", def: "to talk and share news with someone",                                 ex: "Let's catch up — what did you do this summer?", fillBlank: { text: "We have not talked since last year. Let's _____ before class starts.", options: ["greet", "catch up", "describe", "share"] } },
    ],
  },

  "sep-w2": {
    topic: "Word Practice: Say It & Spell It",
    words: [
      { term: "pronounce",  def: "to say a word out loud correctly",                                  ex: "Practice how to pronounce each new word.", fillBlank: { text: "Repeat after me and _____ each new word out loud.", options: ["spell", "pronounce", "repeat", "practice"] } },
      { term: "spell",      def: "to write or say the letters of a word in order",                   ex: "Can you spell your last name for me, please?", fillBlank: { text: "G-A-R-C-I-A — please _____ your last name letter by letter.", options: ["pronounce", "spell", "practice", "identify"] } },
      { term: "identify",   def: "to recognize and name something",                                   ex: "Can you identify the noun in this sentence?", fillBlank: { text: "Can you _____ the noun in this sentence: \"The book is on the table\"?", options: ["categorize", "identify", "spell", "repeat"] } },
      { term: "categorize", def: "to put things into groups",                                         ex: "Categorize these words as nouns, verbs, or adjectives.", fillBlank: { text: "_____ these words into nouns, verbs, and adjectives.", options: ["identify", "categorize", "pronounce", "practice"] } },
      { term: "practice",   def: "to do something many times to improve",                             ex: "Practice speaking English every day to get better.", fillBlank: { text: "You will improve faster if you _____ speaking English every day.", options: ["pronounce", "practice", "identify", "repeat"] } },
      { term: "repeat",   def: "to do or say something again",                                       ex: "Please repeat the word after me.", fillBlank: { text: "Please _____ the word after me: \"appointment.\"", options: ["spell", "repeat", "identify", "categorize"] } },
    ],
  },

  "oct-learning": {
    topic: "Learning English: Study Skills",
    words: [
      { term: "focus", pos: "verb", def: "to give your attention to one thing", ex: "Focus on one sentence at a time.", fillBlank: { text: "Put other work away and _____ on this one sentence.", options: ["notice", "focus", "correct", "compare"] }, quizDistractors: ["correct", "remember"] },
      { term: "notice", pos: "verb", def: "to see or become aware of something", ex: "Look closely and notice the -s at the end of works.", fillBlank: { text: "Look closely at works. Do you _____ the -s at the end?", options: ["apply", "compare", "notice", "focus"] } },
      { term: "compare", pos: "verb", def: "to look for similarities and differences", ex: "Compare I work and she works. What is different?", fillBlank: { text: "Look for similarities and differences: _____ these two sentences.", options: ["focus", "remember", "correct", "compare"] } },
      { term: "correct", pos: "verb", def: "to fix a mistake", ex: "Use your reference sheet to correct the verb in your sentence.", fillBlank: { text: "Your sentence has a mistake. Use the example to _____ it.", options: ["correct", "apply", "focus", "compare"] } },
      { term: "remember", pos: "verb", def: "to bring something back to mind", ex: "Cover the verb forms and try to remember them.", fillBlank: { text: "Hide your notes and try to _____ the verb forms from memory.", options: ["apply", "remember", "compare", "focus"] } },
      { term: "apply", pos: "verb", def: "to use what you learned", ex: "Apply the rule by writing a new sentence about yourself.", fillBlank: { text: "You learned a rule. Now _____ it by using it in a new sentence.", options: ["notice", "focus", "apply", "remember"] } },
    ],
  },

  "sep-w3": {
    topic: "Start the Class: Digital Habits",
    words: [
      { term: "log in",    def: "to enter your username and password to access a website or app",       ex: "Please log in to the app every day to practice English.", topics: ["digital-skills"], fillBlank: { text: "Type your username and password to _____ to your account.", options: ["access", "log in", "review", "complete"] } },
      { term: "navigate",  def: "to move around a website or app",                                      ex: "Use the menu at the top to navigate the website.", topics: ["digital-skills"], fillBlank: { text: "Use the menu at the top to _____ between pages on the website.", options: ["submit", "log in", "navigate", "complete"] } },
      { term: "submit",   def: "to send your work or information officially",                          ex: "Submit your answers before the timer runs out.", topics: ["digital-skills"], fillBlank: { text: "Your homework is finished. Click \"Send\" to _____ it to your teacher.", options: ["review", "submit", "access", "complete"] } },
      { term: "access",   def: "to open or enter a file, website, or building",                       ex: "You can access your lessons from any device.", topics: ["digital-skills"], quizDistractors: ["submit", "review"], fillBlank: { text: "With your library card number, you can _____ free e-books from home.", options: ["log in", "access", "navigate", "submit"] } },
      { term: "complete", def: "to finish all parts of a task",                                       ex: "Try to complete at least one activity each day.", fillBlank: { text: "You did not finish the quiz. Go back and _____ it. Answer every question.", options: ["log in", "complete", "navigate", "access"] } },
      { term: "review",   def: "to look at something again to check or learn it better",              ex: "Review the words before class on Thursday.", fillBlank: { text: "Before class on Thursday, look at the new words again. _____ them one more time.", options: ["log in", "review", "submit", "navigate"] } },
    ],
  },

  "sep-w4": {
    topic: "Life Experience: Personal Journey Verbs",
    words: [
      { term: "relocate",  def: "to move to a new place to live or work (another city, state, or country)", ex: "My company asked me to relocate from Boston to Chicago.", fillBlank: { text: "I got a new job in Chicago, so my family will _____ from Boston next month.", options: ["immigrate", "relocate", "belong", "achieve"] } },
      { term: "motivate",  def: "to give someone a reason to do something",                          ex: "My children motivate me to learn English every day.", fillBlank: { text: "My children _____ me to study English every evening.", options: ["achieve", "motivate", "overcome", "belong"] } },
      { term: "achieve",   def: "to reach a goal through hard work",                                 ex: "With practice, you can achieve your language goals.", fillBlank: { text: "With hard work, you can _____ your goal of passing the test.", options: ["overcome", "achieve", "motivate", "immigrate"] } },
      { term: "overcome",  def: "to successfully deal with a challenge",                             ex: "She worked hard to overcome the language barrier.", fillBlank: { text: "She worked hard to _____ her fear of speaking in public.", options: ["achieve", "overcome", "motivate", "relocate"] } },
      { term: "immigrate", def: "to come to a new country to live there permanently",                ex: "He immigrated to the U.S. five years ago.", fillBlank: { text: "He plans to _____ to the United States to live here permanently.", options: ["motivate", "immigrate", "belong", "overcome"] } },
      {"term": "belong", "def": "to feel accepted as part of a group or place", "ex": "My classmates welcome me and help me feel that I belong.", "fillBlank": {"text": "My classmates accept me as part of the group, so I feel that I _____.", "options": ["belong", "achieve", "relocate", "overcome"]}},
    ],
  },

  /** Unit 2 – Daily Life in the Community (October) */
  "oct-w1": {
    topic: "Community + Daily Routines: Schedule Verbs",
    words: [
      { term: "schedule", def: "to plan a time for something to happen",                             ex: "I need to schedule a doctor's appointment for next week.", topics: ["health"], fillBlank: { text: "Call the clinic to _____ an appointment. Ask them, \"Do you have a time next Tuesday?\"", options: ["exercise", "schedule", "balance", "commute"] } },
      { term: "commute",  def: "to travel regularly between home and work or school",                ex: "She commutes by bus every morning.", topics: ["transportation", "career-on-the-job"], fillBlank: { text: "Every morning, I _____ by bus from my home to my job.", options: ["attend", "commute", "schedule", "balance"] } },
      { term: "prepare",  def: "to get ready for something",                                         ex: "Prepare your bag the night before class.", fillBlank: { text: "_____ your bag and homework the night before class.", options: ["schedule", "prepare", "attend", "exercise"] } },
      { term: "attend",   def: "to go to an event, class, or meeting",                               ex: "All students are expected to attend class on time.", fillBlank: { text: "All students must come to class. Please _____ class every Tuesday and Thursday.", options: ["exercise", "attend", "balance", "commute"] } },
      { term: "balance",  def: "to manage two or more things at the same time fairly",               ex: "It is hard to balance work, school, and family.", topics: ["soft-skills"], fillBlank: { text: "It is hard to _____ work, school, and family at the same time.", options: ["prepare", "balance", "exercise", "commute"] } },
      { term: "exercise", def: "to do physical activity to stay healthy",                            ex: "Try to exercise for at least 30 minutes a day.", topics: ["health"], fillBlank: { text: "Doctors say you should _____ for at least 30 minutes a day.", options: ["balance", "exercise", "prepare", "attend"] } },
    ],
  },
  "oct-w2": {
  "topic": "Transportation and Directions",
  "words": [
    {
      "term": "commute",
      "pos": "verb",
      "def": "to travel regularly between home and work or school",
      "ex": "I commute by train three days a week.",
      "fillBlank": {
        "text": "I _____ by train three days a week. (Meaning: to travel regularly between home and work or school.)",
        "options": [
          "commute",
          "delay",
          "transfer",
          "detour"
        ]
      }
    },
    {
      "term": "delay",
      "pos": "noun",
      "def": "a wait because something happens later than expected",
      "ex": "There is a twenty-minute delay on the bus route.",
      "fillBlank": {
        "text": "There is a twenty-minute _____ on the bus route. (Meaning: a wait because something happens later than expected.)",
        "options": [
          "commute",
          "transfer",
          "detour",
          "delay"
        ]
      }
    },
    {
      "term": "transfer",
      "def": "to change from one bus, train, or route to another",
      "ex": "Transfer to the Red Line at Downtown Station.",
      "topics": [
        "transportation"
      ],
      "fillBlank": {
        "text": "_____ to the Red Line at Downtown Station. (Meaning: to change from one bus, train, or route to another.)",
        "options": [
          "delay",
          "detour",
          "transfer",
          "commute"
        ]
      }
    },
    {
      "term": "detour",
      "pos": "noun",
      "def": "a different route used when the usual route is blocked",
      "ex": "The bus takes a detour because of road work.",
      "fillBlank": {
        "text": "The bus takes a _____ because of road work. (Meaning: a different route used when the usual route is blocked.)",
        "options": [
          "transfer",
          "detour",
          "commute",
          "delay"
        ]
      }
    },
    {
      "term": "miss a connection",
      "pos": "verb phrase",
      "def": "to arrive too late to catch the next bus, train, or flight",
      "ex": "If the bus is late, I might miss a connection.",
      "fillBlank": {
        "text": "If the bus is late, I might _____. (Meaning: to arrive too late to catch the next bus, train, or flight.)",
        "options": [
          "miss a connection",
          "commute",
          "delay",
          "transfer"
        ]
      }
    },
    {
      "term": "get off at",
      "pos": "verb phrase",
      "def": "to leave a bus or train at a particular stop",
      "ex": "Get off at Central Square and walk one block.",
      "fillBlank": {
        "text": "_____ Central Square and walk one block. (Meaning: to leave a bus or train at a particular stop.)",
        "options": [
          "commute",
          "delay",
          "transfer",
          "get off at"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "depart",
      "def": "to leave a place",
      "ex": "The bus departs from Main Street at 7:00 AM.",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "locate",
      "def": "to find the position of something",
      "ex": "Can you locate the nearest pharmacy on the map?",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "leave",
      "def": "to go away from a place",
      "ex": "What time does the bus leave?",
      "pos": "verb",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "arrive",
      "def": "to reach a place",
      "ex": "What time does the train arrive at the station?",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "find",
      "def": "to discover where something is",
      "ex": "Can you help me find the bus stop?",
      "pos": "verb",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "follow",
      "def": "to go in the same direction; to use directions step by step",
      "ex": "Follow the signs to the emergency exit.",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "cross",
      "def": "to go from one side to the other",
      "ex": "Cross the street at the crosswalk when the light is green.",
      "topics": [
        "transportation"
      ]
    }
  ]
},
  "oct-w3": {
    topic: "Digital Safety + Forms: Protect Yourself Verbs",
    words: [
      { term: "register",  def: "to sign up officially for a service or program",                    ex: "You need to register online before your first appointment.", topics: ["digital-skills"], fillBlank: { text: "You must _____ online before your first clinic visit.", options: ["sign", "register", "verify", "update"] } },
      { term: "protect",   def: "to keep something safe from harm",                                  ex: "Use a strong password to protect your account.", topics: ["digital-skills"], fillBlank: { text: "Use a strong password to _____ your online account.", options: ["verify", "protect", "avoid", "update"] } },
      { term: "verify",    def: "to check that something is correct or true",                        ex: "The website will send a code to verify your identity.", topics: ["digital-skills"], fillBlank: { text: "The website sent a code to _____ your email address.", options: ["register", "verify", "protect", "sign"] } },
      { term: "avoid",     def: "to stay away from something dangerous or unwanted",                 ex: "Avoid clicking on unknown links in your email.", topics: ["digital-skills"], fillBlank: { text: "_____ clicking on links from strangers in your email.", options: ["protect", "avoid", "verify", "update"] } },
      { term: "sign",      def: "to write your name on a document to show agreement",                ex: "Read the form carefully before you sign it.", topics: ["digital-skills"], fillBlank: { text: "Read the form carefully before you _____ it.", options: ["register", "sign", "update", "verify"] } },
      { term: "update",    def: "to add new information or change to the newest version",            ex: "Update your password every few months for security.", topics: ["digital-skills"], fillBlank: { text: "_____ your password every few months for security.", options: ["verify", "update", "protect", "avoid"] } },
    ],
  },
  "oct-w4": {
  "topic": "Phone Communication",
  "words": [
    {
      "term": "contact",
      "def": "to reach someone by phone, email, or message",
      "ex": "Contact the school if your child will be absent.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "_____ the school if your child will be absent. (Meaning: to reach someone by phone, email, or message.)",
        "options": [
          "contact",
          "respond",
          "confirm",
          "turn down"
        ]
      }
    },
    {
      "term": "respond",
      "def": "to answer or react to a message or question",
      "ex": "Please respond to the email within 24 hours.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "Please _____ to the email within 24 hours. (Meaning: to answer or react to a message or question.)",
        "options": [
          "contact",
          "confirm",
          "turn down",
          "respond"
        ]
      }
    },
    {
      "term": "confirm",
      "def": "to say that something is definitely true or agreed upon",
      "ex": "Call to confirm your appointment the day before.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "Call to _____ your appointment the day before. (Meaning: to say that something is definitely true or agreed upon.)",
        "options": [
          "respond",
          "turn down",
          "confirm",
          "contact"
        ]
      }
    },
    {
      "term": "turn down",
      "def": "to say no to an offer or request",
      "ex": "I had to turn down the extra shift.",
      "pos": "phrasal verb",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I had to _____ the extra shift. (Meaning: to say no to an offer or request.)",
        "options": [
          "confirm",
          "turn down",
          "contact",
          "respond"
        ]
      }
    },
    {
      "term": "reschedule",
      "def": "to change a planned event to a different time",
      "ex": "I need to reschedule my appointment.",
      "pos": "verb",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I need to _____ my appointment. (Meaning: to change a planned event to a different time.)",
        "options": [
          "reschedule",
          "contact",
          "respond",
          "confirm"
        ]
      }
    },
    {
      "term": "put someone through",
      "pos": "verb phrase",
      "def": "to connect a caller to another person on the phone",
      "ex": "Can the receptionist put someone through to the billing office?",
      "fillBlank": {
        "text": "A receptionist can _____ to another department on the phone. (Meaning: to connect a caller to another person on the phone.)",
        "options": [
          "contact",
          "respond",
          "confirm",
          "put someone through"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "decline",
      "def": "to politely say no to an offer or invitation",
      "ex": "She had to decline the meeting because she was sick.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "postpone",
      "def": "to move something to a later time",
      "ex": "We need to postpone the meeting until next week.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "connect",
      "def": "to join or link with someone or something",
      "ex": "I couldn't connect to the Wi-Fi at the library.",
      "topics": [
        "communication",
        "digital-skills"
      ]
    }
  ]
},
  "oct-w5": {
  "topic": "Voting and Community Voice",
  "words": [
    {
      "term": "register to vote",
      "pos": "verb phrase",
      "def": "to add your name to the official list of voters",
      "ex": "Where can eligible residents register to vote?",
      "fillBlank": {
        "text": "Where can eligible residents _____? I want my name on the voter list before the next election.",
        "options": [
          "register to vote",
          "elect",
          "advocate",
          "petition"
        ]
      }
    },
    {
      "term": "elect",
      "def": "to choose a person for a position by voting",
      "ex": "Citizens elect leaders to represent them in government.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Citizens _____ leaders to represent them in government. On election day, each voter marks a ballot for their favorite candidate.",
        "options": [
          "register to vote",
          "advocate",
          "petition",
          "elect"
        ]
      }
    },
    {
      "term": "advocate",
      "def": "to publicly support a cause or group of people",
      "ex": "She advocates for better schools in her neighborhood.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "At the meeting, residents can _____ for better bus service. They can explain why their neighborhood needs more buses.",
        "options": [
          "elect",
          "petition",
          "advocate",
          "register to vote"
        ]
      }
    },
    {
      "term": "petition",
      "pos": "noun",
      "def": "a written request for change, often signed by many people",
      "ex": "We started a petition to improve the bus service.",
      "fillBlank": {
        "text": "We started a _____ to improve the bus service. I passed around a clipboard so everyone could sign.",
        "options": [
          "advocate",
          "petition",
          "register to vote",
          "elect"
        ]
      }
    },
    {
      "term": "represent",
      "def": "to speak or act on behalf of others",
      "ex": "Your city council member represents your neighborhood.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "City council members _____ the people in their districts. They bring their neighbors’ concerns to city meetings.",
        "options": [
          "represent",
          "register to vote",
          "elect",
          "advocate"
        ]
      }
    },
    {
      "term": "campaign",
      "def": "to work to get support for a cause or candidate",
      "ex": "Many volunteers campaign for better housing in our city.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Many volunteers _____ for better housing in our city. They knock on doors and hand out flyers to get more neighbors involved.",
        "options": [
          "register to vote",
          "elect",
          "petition",
          "campaign"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "vote",
      "def": "to officially choose a person or option in an election",
      "ex": "Register and vote in your local elections.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Citizens _____ in local elections to choose their leaders.",
        "options": [
          "elect",
          "vote",
          "campaign",
          "petition"
        ]
      }
    }
  ]
},

  /** Unit 3 – Community Participation (November) */
  "nov-w1": {
  "topic": "Volunteering",
  "words": [
    {
      "term": "volunteer",
      "def": "to offer to do something without being paid",
      "ex": "She volunteers at the food bank every Saturday.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "I _____ at the food bank without being paid. (Meaning: to offer to do something without being paid.)",
        "options": [
          "volunteer",
          "help out",
          "support",
          "contribute"
        ]
      }
    },
    {
      "term": "help out",
      "def": "to help with a task or problem",
      "ex": "Can you help out at the food bank on Saturday?",
      "pos": "phrasal verb",
      "topics": [
        "civic-life",
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Can you _____ at the front desk while I answer this call? (Meaning: to help with a task or problem.)",
        "options": [
          "volunteer",
          "sign up for",
          "help out"
        ]
      }
    },
    {
      "term": "support",
      "def": "to help or encourage someone or a cause",
      "ex": "Our community supports local families in need.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Our neighbors _____ families who need encouragement and help. (Meaning: to help or encourage someone or a cause.)",
        "options": [
          "sign up for",
          "support",
          "volunteer"
        ]
      }
    },
    {
      "term": "contribute",
      "def": "to give time, money, or effort to help something",
      "ex": "Everyone can contribute in a small way to make things better.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Each person can _____ time or effort to the community project. (Meaning: to give time, money, or effort to help something.)",
        "options": [
          "contribute",
          "volunteer",
          "sign up for"
        ]
      }
    },
    {
      "term": "donate",
      "def": "to give something (money, food, clothing) to help others",
      "ex": "We donate clothing to the shelter twice a year.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "We will _____ these coats to the shelter as a gift. (Meaning: to give something (money, food, clothing) to help others.)",
        "options": [
          "volunteer",
          "sign up for",
          "donate"
        ]
      }
    },
    {
      "term": "sign up for",
      "pos": "verb phrase",
      "def": "to put your name on a list to take part in something",
      "ex": "I want to sign up for the Saturday volunteer shift.",
      "fillBlank": {
        "text": "I want to _____ the Saturday volunteer shift. (Meaning: to put your name on a list to take part in something.)",
        "options": [
          "volunteer",
          "help out",
          "support",
          "sign up for"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "assist",
      "def": "to help someone with a task",
      "ex": "Can you assist me with this form?",
      "topics": [
        "civic-life",
        "soft-skills"
      ]
    },
    {
      "term": "join",
      "def": "to become a member of a group or start participating",
      "ex": "Would you like to join our community garden project?",
      "topics": [
        "civic-life"
      ]
    }
  ]
},
  "nov-w2": {
  "topic": "Meetings and Suggestions",
  "words": [
    {
      "term": "participate",
      "def": "to take part in an activity or event",
      "ex": "Everyone is welcome to participate in the town meeting.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "Everyone is welcome to _____ in the town meeting. (Meaning: to take part in an activity or event.)",
        "options": [
          "participate",
          "suggest",
          "propose",
          "recommend"
        ]
      }
    },
    {
      "term": "suggest",
      "def": "to offer an idea for others to consider",
      "ex": "I'd like to suggest adding more bus routes to our area.",
      "topics": [
        "civic-life",
        "communication"
      ],
      "fillBlank": {
        "text": "Could you _____ an idea for making the meeting more useful? (Meaning: to offer an idea for others to consider.)",
        "options": [
          "participate",
          "reach an agreement",
          "raise a concern",
          "suggest"
        ]
      }
    },
    {
      "term": "propose",
      "def": "to formally put forward an idea or plan",
      "ex": "The committee will propose a new community garden.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "At the hearing, the committee will _____ a formal plan for a new park. (Meaning: to formally put forward an idea or plan.)",
        "options": [
          "reach an agreement",
          "raise a concern",
          "propose",
          "participate"
        ]
      }
    },
    {
      "term": "recommend",
      "def": "to advise that something is a good choice",
      "ex": "The teacher recommended that we study for at least one hour.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "Can you _____ a reliable repair company based on your experience? (Meaning: to advise that something is a good choice.)",
        "options": [
          "raise a concern",
          "recommend",
          "participate",
          "reach an agreement"
        ]
      }
    },
    {
      "term": "reach an agreement",
      "pos": "verb phrase",
      "def": "to make a decision that everyone involved accepts",
      "ex": "We hope to reach an agreement about the meeting time.",
      "fillBlank": {
        "text": "After discussing different meeting times, we hope to _____ everyone accepts. (Meaning: to make a decision that everyone involved accepts.)",
        "options": [
          "reach an agreement",
          "participate",
          "suggest",
          "propose"
        ]
      }
    },
    {
      "term": "raise a concern",
      "pos": "verb phrase",
      "def": "to tell others about something you think may be a problem",
      "ex": "I would like to raise a concern about the bus schedule.",
      "fillBlank": {
        "text": "I want to _____ about the broken lights before someone gets hurt. (Meaning: to tell others about something you think may be a problem.)",
        "options": [
          "participate",
          "suggest",
          "propose",
          "raise a concern"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "agree",
      "def": "to have the same opinion or say yes to something",
      "ex": "Most people at the meeting agreed with the new plan.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "Most neighbors _____ with the plan to fix the streetlights.",
        "options": [
          "recommend",
          "agree",
          "suggest",
          "listen"
        ]
      }
    },
    {
      "term": "listen",
      "def": "to pay attention to what someone is saying",
      "ex": "Good leaders listen to the concerns of their community.",
      "topics": [
        "communication",
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Good leaders _____ to people's concerns before making decisions.",
        "options": [
          "agree",
          "listen",
          "participate",
          "recommend"
        ]
      }
    }
  ]
},
  "nov-w3": {
    topic: "Voting + Contacting Officials: Civic Verbs",
    words: [
      { term: "vote",      def: "to officially choose a person or option in an election",           ex: "Register and vote in your local elections.", topics: ["civic-life"], fillBlank: { text: "Citizens _____ in local elections to choose their leaders.", options: ["elect", "vote", "campaign", "petition"] } },
      { term: "elect",     def: "to choose a person for a position by voting",                      ex: "Citizens elect leaders to represent them in government.", topics: ["civic-life"], fillBlank: { text: "In November, voters will _____ a new mayor.", options: ["vote", "elect", "represent", "advocate"] } },
      { term: "advocate",  def: "to publicly support a cause or group of people",                   ex: "She advocates for better schools in her neighborhood.", topics: ["civic-life"], fillBlank: { text: "She _____ for better schools in her neighborhood.", options: ["represent", "advocate", "campaign", "petition"] } },
      { term: "petition",  def: "to formally ask for change by collecting signatures",               ex: "We started a petition to fix the broken street lights.", topics: ["civic-life"], fillBlank: { text: "We _____ the city to fix the broken streetlights by collecting signatures.", options: ["campaign", "petition", "advocate", "vote"] } },
      { term: "represent", def: "to speak or act on behalf of others",                              ex: "Your city council member represents your neighborhood.", topics: ["civic-life"], fillBlank: { text: "Your city council member _____ your neighborhood in government.", options: ["elect", "represent", "advocate", "vote"] } },
      { term: "campaign",  def: "to work to get support for a cause or candidate",                  ex: "Many volunteers campaign for better housing in our city.", topics: ["civic-life"], fillBlank: { text: "Volunteers _____ for safer streets in our city.", options: ["vote", "campaign", "petition", "elect"] } },
    ],
  },
  "nov-w4": {
    topic: "Community Issues: Problem-Solving Verbs",
    words: [
      { term: "analyze",     def: "to study something carefully to understand it",                  ex: "Let's analyze the problem before we decide what to do.", topics: ["civic-life"], fillBlank: { text: "Let's _____ the problem carefully before we choose a solution.", options: ["resolve", "analyze", "improve", "report"] } },
      { term: "resolve",     def: "to find a solution to a problem",                                ex: "We worked together to resolve the conflict peacefully.", topics: ["civic-life"], fillBlank: { text: "They worked together to _____ the conflict peacefully.", options: ["analyze", "resolve", "prevent", "improve"] } },
      { term: "improve",     def: "to make something better",                                       ex: "The city wants to improve public transportation.", topics: ["civic-life"], fillBlank: { text: "The city wants to _____ bus service in our area.", options: ["prevent", "improve", "resolve", "collaborate"] } },
      { term: "collaborate",def: "to work together with others to achieve a goal",                  ex: "We collaborated with local businesses to start the event.", topics: ["civic-life", "soft-skills"], fillBlank: { text: "We _____ with local businesses to organize the street fair.", options: ["improve", "collaborate", "report", "analyze"] } },
      { term: "report",      def: "to tell someone in authority about a problem",                   ex: "Report broken streetlights to the city using the hotline.", topics: ["civic-life"], fillBlank: { text: "_____ broken streetlights to the city using the 311 hotline.", options: ["prevent", "report", "resolve", "analyze"] } },
      { term: "prevent",     def: "to stop something bad from happening",                           ex: "We can prevent crime by working together as a community.", topics: ["civic-life"], fillBlank: { text: "Working together can _____ crime in our neighborhood.", options: ["improve", "prevent", "resolve", "report"] } },
    ],
  },

  /** Unit 4 – Consumer Smarts (December) */
  "dec-w1": {
  "topic": "Spending and Budgeting",
  "words": [
    {
      "term": "purchase price",
      "pos": "noun phrase",
      "def": "the amount paid to buy something",
      "ex": "The purchase price does not include delivery.",
      "fillBlank": {
        "text": "The _____ does not include delivery. (Meaning: the amount paid to buy something.)",
        "options": [
          "purchase price",
          "comparison shop",
          "budget",
          "set aside"
        ]
      }
    },
    {
      "term": "comparison shop",
      "pos": "verb phrase",
      "def": "to compare prices or features at different stores before buying",
      "ex": "I comparison shop before buying an appliance.",
      "fillBlank": {
        "text": "I _____ before buying an appliance. (Meaning: to compare prices or features at different stores before buying.)",
        "options": [
          "purchase price",
          "budget",
          "set aside",
          "comparison shop"
        ]
      }
    },
    {
      "term": "budget",
      "def": "to plan how much money to spend",
      "ex": "Budget your money so you can pay all your bills.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ your money so you can pay all your bills. (Meaning: to plan how much money to spend.)",
        "options": [
          "comparison shop",
          "set aside",
          "budget",
          "purchase price"
        ]
      }
    },
    {
      "term": "set aside",
      "pos": "verb phrase",
      "def": "to keep money, time, or something else for a particular purpose",
      "ex": "I set aside a little money each payday.",
      "fillBlank": {
        "text": "I _____ a little money each payday. (Meaning: to keep money, time, or something else for a particular purpose.)",
        "options": [
          "budget",
          "set aside",
          "purchase price",
          "comparison shop"
        ]
      }
    },
    {
      "term": "keep track of",
      "pos": "verb phrase",
      "def": "to record or pay attention to something as it changes",
      "ex": "I use an app to keep track of my spending.",
      "fillBlank": {
        "text": "I use an app to _____ my spending. (Meaning: to record or pay attention to something as it changes.)",
        "options": [
          "keep track of",
          "purchase price",
          "comparison shop",
          "budget"
        ]
      }
    },
    {
      "term": "total cost",
      "pos": "noun phrase",
      "def": "the full amount to pay, including extra charges",
      "ex": "What is the total cost with tax and delivery?",
      "fillBlank": {
        "text": "What is the _____ with tax and delivery? (Meaning: the full amount to pay, including extra charges.)",
        "options": [
          "purchase price",
          "comparison shop",
          "budget",
          "total cost"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "purchase",
      "def": "to buy something",
      "ex": "Think carefully before you purchase anything online.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "Think carefully before you _____ something online.",
        "options": [
          "spend",
          "purchase",
          "save",
          "budget"
        ]
      }
    },
    {
      "term": "compare",
      "def": "to look at two or more things to find differences",
      "ex": "Always compare prices before you buy.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "Always _____ prices at two stores before you buy.",
        "options": [
          "calculate",
          "compare",
          "budget",
          "purchase"
        ]
      }
    },
    {
      "term": "save",
      "def": "to keep money so you can use it later",
      "ex": "Try to save at least 10% of your income each month.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "Try to _____ at least 10% of your paycheck each month.",
        "options": [
          "spend",
          "save",
          "budget",
          "purchase"
        ]
      }
    },
    {
      "term": "spend",
      "def": "to use money to pay for things",
      "ex": "Don't spend more than you earn.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "Don't _____ more money than you earn.",
        "options": [
          "save",
          "spend",
          "purchase",
          "budget"
        ]
      }
    },
    {
      "term": "calculate",
      "def": "to use math to find an answer",
      "ex": "Calculate the total cost before you decide to buy.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ the total cost, including tax, before you pay.",
        "options": [
          "compare",
          "calculate",
          "budget",
          "purchase"
        ]
      }
    }
  ]
},
  "dec-w2": {
  "topic": "Returns and Financial Problems",
  "words": [
    {
      "term": "exchange",
      "def": "to return one item and get a different one",
      "ex": "I want to exchange this shirt for a larger size.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "The shirt is too small, so I want to _____ it for a larger one. (Meaning: to return one item and get a different one.)",
        "options": [
          "exchange",
          "refund",
          "withdraw",
          "deposit"
        ]
      }
    },
    {
      "term": "refund",
      "pos": "noun",
      "def": "money returned to a customer after a purchase",
      "ex": "The store gave me a full refund for the broken item.",
      "fillBlank": {
        "text": "The store returned my money and gave me a full _____. (Meaning: money returned to a customer after a purchase.)",
        "options": [
          "exchange",
          "withdraw",
          "deposit",
          "refund"
        ]
      }
    },
    {
      "term": "withdraw",
      "def": "to take money out of a bank account",
      "ex": "I need to withdraw cash from the ATM.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "I need to _____ cash from the ATM. (Meaning: to take money out of a bank account.)",
        "options": [
          "refund",
          "deposit",
          "withdraw",
          "exchange"
        ]
      }
    },
    {
      "term": "deposit",
      "def": "to put money into a bank account",
      "ex": "Deposit your check before the end of the business day.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ your check before the end of the business day. (Meaning: to put money into a bank account.)",
        "options": [
          "withdraw",
          "deposit",
          "exchange",
          "refund"
        ]
      }
    },
    {
      "term": "charge",
      "def": "to ask for payment; to add to a credit card bill",
      "ex": "The store will charge your card when the item ships.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "The store will _____ your card when the item ships. (Meaning: to ask for payment; to add to a credit card bill.)",
        "options": [
          "charge",
          "exchange",
          "refund",
          "withdraw"
        ]
      }
    },
    {
      "term": "dispute",
      "def": "to say that something is wrong and ask for a correction",
      "ex": "If there is an error on your bill, call to dispute it.",
      "topics": [
        "money",
        "communication"
      ],
      "fillBlank": {
        "text": "If there is an error on your bill, call to _____ it. (Meaning: to say that something is wrong and ask for a correction.)",
        "options": [
          "exchange",
          "refund",
          "withdraw",
          "dispute"
        ]
      }
    }
  ],
  "bonusWords": []
},
  "dec-w3": {
  "topic": "Understanding Economic News",
  "words": [
    {
      "term": "cost of living",
      "pos": "noun phrase",
      "def": "the money needed for basic expenses such as housing, food, and transportation",
      "ex": "The cost of living has increased in our area.",
      "fillBlank": {
        "text": "The _____ has increased in our area. (Meaning: the money needed for basic expenses such as housing, food, and transportation.)",
        "options": [
          "cost of living",
          "inflation",
          "wages",
          "unemployed"
        ]
      }
    },
    {
      "term": "inflation",
      "def": "when prices rise and money buys less than before",
      "ex": "Inflation means your paycheck doesn't go as far as it used to.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ means your paycheck doesn't go as far as it used to. (Meaning: when prices rise and money buys less than before.)",
        "options": [
          "cost of living",
          "wages",
          "unemployed",
          "inflation"
        ]
      }
    },
    {
      "term": "wages",
      "def": "the money a worker earns for their work",
      "ex": "Many workers are asking for higher wages this year.",
      "topics": [
        "money",
        "work"
      ],
      "fillBlank": {
        "text": "Many workers are asking for higher _____ this year. (Meaning: the money a worker earns for their work.)",
        "options": [
          "inflation",
          "unemployed",
          "wages",
          "cost of living"
        ]
      }
    },
    {
      "term": "unemployed",
      "pos": "adjective",
      "def": "without a paid job and looking for work",
      "ex": "She was unemployed for two months before finding a new job.",
      "fillBlank": {
        "text": "She was _____ for two months before finding a new job. (Meaning: without a paid job and looking for work.)",
        "options": [
          "wages",
          "unemployed",
          "cost of living",
          "inflation"
        ]
      }
    },
    {
      "term": "interest rate",
      "pos": "noun phrase",
      "def": "the percentage used to calculate interest on money borrowed or saved",
      "ex": "What is the interest rate on this loan?",
      "fillBlank": {
        "text": "What is the _____ on this loan? (Meaning: the percentage used to calculate interest on money borrowed or saved.)",
        "options": [
          "interest rate",
          "cost of living",
          "inflation",
          "wages"
        ]
      }
    },
    {
      "term": "economy",
      "pos": "noun",
      "def": "the system of producing, buying, and selling goods and services in a place",
      "ex": "The news discussed jobs and the local economy.",
      "fillBlank": {
        "text": "The news discussed jobs and the local _____. (Meaning: the system of producing, buying, and selling goods and services in a place.)",
        "options": [
          "cost of living",
          "inflation",
          "wages",
          "economy"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "prices",
      "def": "how much things cost",
      "ex": "Prices went up at the grocery store this year.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ went up at the grocery store this year.",
        "options": [
          "Jobs",
          "Prices",
          "Wages",
          "Taxes"
        ]
      }
    }
  ]
},

  /** Unit 5 – Housing (January) */
  "jan-w1": {
  "topic": "Housing Basics",
  "words": [
    {
      "term": "security deposit",
      "pos": "noun phrase",
      "def": "money held by a landlord to cover certain damage or unpaid charges under a rental agreement",
      "ex": "How much is the security deposit for this apartment?",
      "fillBlank": {
        "text": "How much is the _____ for this apartment? (Meaning: money held by a landlord to cover certain damage or unpaid charges under a rental agreement.)",
        "options": [
          "security deposit",
          "lease",
          "move in",
          "utilities included"
        ]
      }
    },
    {
      "term": "lease",
      "pos": "noun",
      "def": "an agreement allowing someone to rent property for a set time",
      "ex": "We signed a twelve-month lease for the apartment.",
      "fillBlank": {
        "text": "We signed a twelve-month _____ for the apartment. (Meaning: an agreement allowing someone to rent property for a set time.)",
        "options": [
          "security deposit",
          "move in",
          "utilities included",
          "lease"
        ]
      }
    },
    {
      "term": "move in",
      "def": "to start living in a home",
      "ex": "When can we move in?",
      "pos": "phrasal verb",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "When can we _____? (Meaning: to start living in a home.)",
        "options": [
          "lease",
          "utilities included",
          "move in",
          "security deposit"
        ]
      }
    },
    {
      "term": "utilities included",
      "pos": "phrase",
      "def": "basic services, such as heat or water, covered by the rent",
      "ex": "The listing says utilities included, but which services does that cover?",
      "fillBlank": {
        "text": "The listing says _____, but which services does that cover? (Meaning: basic services, such as heat or water, covered by the rent.)",
        "options": [
          "move in",
          "utilities included",
          "security deposit",
          "lease"
        ]
      }
    },
    {
      "term": "qualify for",
      "pos": "verb phrase",
      "def": "to meet the requirements for something",
      "ex": "Do I qualify for this housing program?",
      "fillBlank": {
        "text": "Do I _____ this housing program? (Meaning: to meet the requirements for something.)",
        "options": [
          "qualify for",
          "security deposit",
          "lease",
          "move in"
        ]
      }
    },
    {
      "term": "rental application",
      "pos": "noun phrase",
      "def": "a form used to ask to rent a home",
      "ex": "What documents do I need for the rental application?",
      "fillBlank": {
        "text": "What documents do I need for the _____? (Meaning: a form used to ask to rent a home.)",
        "options": [
          "security deposit",
          "lease",
          "move in",
          "rental application"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "occupy",
      "def": "to live in or use a space",
      "ex": "How many people will occupy this apartment?",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "rent",
      "def": "to pay money to use something (an apartment, a car) that belongs to someone else",
      "ex": "We rent our apartment for $1,200 a month.",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "move",
      "def": "to go to live in a different place",
      "ex": "We plan to move to a bigger apartment next month.",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "qualify",
      "def": "to meet the requirements needed for something",
      "ex": "Do I qualify for the low-income housing program?",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "apply",
      "def": "to formally request something (a job, an apartment, a program)",
      "ex": "You need to apply online for that apartment.",
      "topics": [
        "housing",
        "career-job-search"
      ]
    }
  ]
},
  "jan-w2": {
  "topic": "Comparing Housing Options",
  "words": [
    {
      "term": "weigh your options",
      "pos": "verb phrase",
      "def": "to compare possible choices carefully before deciding",
      "ex": "It helps to weigh your options before signing a lease.",
      "fillBlank": {
        "text": "It helps to _____ before signing a lease. (Meaning: to compare possible choices carefully before deciding.)",
        "options": [
          "weigh your options",
          "afford",
          "check out",
          "trade-off"
        ]
      }
    },
    {
      "term": "afford",
      "def": "to have enough money to pay for something",
      "ex": "I can't afford an apartment in that area.",
      "topics": [
        "housing",
        "money"
      ],
      "fillBlank": {
        "text": "I can't _____ an apartment in that area. (Meaning: to have enough money to pay for something.)",
        "options": [
          "weigh your options",
          "check out",
          "trade-off",
          "afford"
        ]
      }
    },
    {
      "term": "check out",
      "def": "to look at something to decide what you think of it",
      "ex": "Let’s check out the apartment before we decide.",
      "pos": "phrasal verb",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "Let’s _____ the apartment before we decide. (Meaning: to look at something to decide what you think of it.)",
        "options": [
          "afford",
          "trade-off",
          "check out",
          "weigh your options"
        ]
      }
    },
    {
      "term": "trade-off",
      "pos": "noun",
      "def": "a situation in which you give up one advantage to get another",
      "ex": "A smaller apartment near work may be a good trade-off.",
      "fillBlank": {
        "text": "A smaller apartment near work may be a good _____. (Meaning: a situation in which you give up one advantage to get another.)",
        "options": [
          "check out",
          "trade-off",
          "weigh your options",
          "afford"
        ]
      }
    },
    {
      "term": "negotiate",
      "def": "to talk with someone to reach an agreement",
      "ex": "You can negotiate the rent with the landlord.",
      "topics": [
        "housing",
        "communication"
      ],
      "fillBlank": {
        "text": "You can _____ the rent with the landlord. (Meaning: to talk with someone to reach an agreement.)",
        "options": [
          "negotiate",
          "weigh your options",
          "afford",
          "check out"
        ]
      }
    },
    {
      "term": "within your budget",
      "pos": "phrase",
      "def": "costing no more than the amount you have planned to spend",
      "ex": "Is this apartment within your budget?",
      "fillBlank": {
        "text": "Is this apartment _____? (Meaning: costing no more than the amount you have planned to spend.)",
        "options": [
          "weigh your options",
          "afford",
          "check out",
          "within your budget"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "evaluate",
      "def": "to study all parts of something to judge its quality or value",
      "ex": "Evaluate the location, price, and size before deciding.",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "select",
      "def": "to choose something from a group of options",
      "ex": "We will select an apartment by the end of the week.",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "compare",
      "def": "to look at two or more things to find differences",
      "ex": "Compare the rent and size of each apartment.",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "choose",
      "def": "to decide which one you want",
      "ex": "We need to choose an apartment this week.",
      "pos": "verb",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "own",
      "def": "to have something as your legal property",
      "ex": "Someday I hope to own my own home.",
      "topics": [
        "housing"
      ]
    }
  ]
},
  "jan-w3": {
  "topic": "Landlord Calls and Repair Requests",
  "words": [
    {
      "term": "request a repair",
      "pos": "verb phrase",
      "def": "to ask for something broken to be fixed",
      "ex": "I need to request a repair for the heater.",
      "fillBlank": {
        "text": "I need to _____ for the heater. (Meaning: to ask for something broken to be fixed.)",
        "options": [
          "request a repair",
          "inspect",
          "leak",
          "clogged"
        ]
      }
    },
    {
      "term": "report a problem",
      "pos": "verb phrase",
      "def": "to tell the responsible person that something is wrong",
      "ex": "How can I report a problem with the elevator?",
      "fillBlank": {
        "text": "How can I _____ with the elevator? (Meaning: to tell the responsible person that something is wrong.)",
        "options": [
          "inspect",
          "leak",
          "clogged",
          "report a problem"
        ]
      }
    },
    {
      "term": "inspect",
      "def": "to look at something carefully to check its condition",
      "ex": "The landlord will inspect the apartment next Monday.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "The landlord will _____ the apartment next Monday. (Meaning: to look at something carefully to check its condition.)",
        "options": [
          "report a problem",
          "maintenance request",
          "inspect",
          "request a repair"
        ]
      }
    },
    {
      "term": "maintenance request",
      "pos": "noun phrase",
      "def": "a message or form asking for a building or appliance to be checked or fixed",
      "ex": "I submitted a maintenance request for the broken lock.",
      "fillBlank": {
        "text": "I submitted a _____ for the broken lock. (Meaning: a message or form asking for a building or appliance to be checked or fixed.)",
        "options": [
          "clogged",
          "maintenance request",
          "inspect",
          "leak"
        ]
      }
    },
    {
      "term": "leak",
      "def": "(of liquid) to drip or flow through a crack or hole",
      "ex": "The ceiling is leaking after the heavy rain.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "Water can _____ through the crack in this pipe. (Meaning: (of liquid) to drip or flow through a crack or hole.)",
        "options": [
          "leak",
          "request a repair",
          "report a problem",
          "inspect"
        ]
      }
    },
    {
      "term": "clogged",
      "pos": "adjective",
      "def": "blocked so that water or something else cannot pass through",
      "ex": "The kitchen sink is clogged and the water will not drain.",
      "fillBlank": {
        "text": "The kitchen sink is _____ and the water will not drain. (Meaning: blocked so that water or something else cannot pass through.)",
        "options": [
          "request a repair",
          "report a problem",
          "inspect",
          "clogged"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "request",
      "def": "to politely ask for something officially",
      "ex": "I need to request a repair for the broken heater.",
      "topics": [
        "housing",
        "communication"
      ],
      "fillBlank": {
        "text": "I need to _____ a repair for the broken heater.",
        "options": [
          "report",
          "request",
          "inspect",
          "repair"
        ]
      }
    },
    {
      "term": "report",
      "def": "to tell someone in authority about a problem",
      "ex": "Report any leaks or damage to your landlord right away.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "_____ any water damage to your landlord right away.",
        "options": [
          "request",
          "report",
          "inspect",
          "repair"
        ]
      }
    },
    {
      "term": "repair",
      "pos": "verb",
      "def": "to fix something that is broken or damaged",
      "ex": "Could you repair the heater as soon as possible?"
    },
    {
      "term": "clog",
      "def": "to block a pipe so water cannot flow",
      "ex": "The kitchen sink is clogged and the water won't drain.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "The kitchen sink is _____ and the water won't drain.",
        "options": [
          "leak",
          "clog",
          "repair",
          "inspect"
        ]
      }
    }
  ]
},
  "jan-w4": {
  "topic": "Resolving Housing Problems",
  "words": [
    {
      "term": "resolve",
      "pos": "verb",
      "def": "to find a solution to a problem or disagreement",
      "ex": "Can we resolve the problem before the next rent payment?",
      "fillBlank": {
        "text": "Can we _____ the problem before the next rent payment? (Meaning: to find a solution to a problem or disagreement.)",
        "options": [
          "resolve",
          "maintain",
          "notify",
          "document"
        ]
      }
    },
    {
      "term": "maintain",
      "def": "to keep something in good condition",
      "ex": "Tenants must maintain a clean and safe apartment.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "Tenants must _____ a clean and safe apartment. (Meaning: to keep something in good condition.)",
        "options": [
          "resolve",
          "notify",
          "document",
          "maintain"
        ]
      }
    },
    {
      "term": "notify",
      "pos": "verb",
      "def": "to tell someone information they need, often formally",
      "ex": "Please notify the landlord about the leak.",
      "fillBlank": {
        "text": "Please _____ the landlord about the leak. (Meaning: to tell someone information they need, often formally.)",
        "options": [
          "maintain",
          "document",
          "notify",
          "resolve"
        ]
      }
    },
    {
      "term": "document",
      "def": "to write down or photograph something as a record",
      "ex": "Document the damage with photos before the landlord visits.",
      "topics": [
        "housing"
      ],
      "fillBlank": {
        "text": "_____ the damage with photos before the landlord visits. (Meaning: to write down or photograph something as a record.)",
        "options": [
          "notify",
          "document",
          "resolve",
          "maintain"
        ]
      }
    },
    {
      "term": "prevent",
      "pos": "verb",
      "def": "to stop something from happening",
      "ex": "What steps can help prevent this problem from happening again?",
      "fillBlank": {
        "text": "What steps can help _____ this problem from happening again? (Meaning: to stop something from happening.)",
        "options": [
          "prevent",
          "resolve",
          "maintain",
          "notify"
        ]
      }
    },
    {
      "term": "reimburse",
      "pos": "verb",
      "def": "to pay someone back for money they spent on an expense",
      "ex": "Will the landlord reimburse me for the approved repair?",
      "fillBlank": {
        "text": "Will the landlord _____ me for the approved repair? (Meaning: to pay someone back for money they spent on an expense.)",
        "options": [
          "resolve",
          "maintain",
          "notify",
          "reimburse"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "fix",
      "def": "to make a problem better or make something work again",
      "ex": "When can you fix the heat?",
      "pos": "verb",
      "topics": [
        "housing"
      ]
    },
    {
      "term": "let someone know",
      "def": "to tell someone information they need",
      "ex": "Please let someone know if you will be late.",
      "pos": "verb phrase",
      "topics": [
        "housing",
        "communication"
      ]
    },
    {
      "term": "pay back",
      "def": "to return money someone spent or lent",
      "ex": "Will the landlord pay back the money I spent on the repair?",
      "pos": "phrasal verb",
      "topics": [
        "housing",
        "money"
      ]
    }
  ]
},

  // ── CYCLE 2: Units 6–10 (Feb–Jun) ─ 12 words per week ────────────────────
  "feb-3-5": {
  "topic": "Work Experience and Expectations",
  "words": [
    {
      "term": "availability",
      "pos": "noun",
      "def": "the times when someone is free to work or meet",
      "ex": "My availability changes when my class schedule changes.",
      "fillBlank": {
        "text": "My _____ changes when my class schedule changes. (Meaning: the times when someone is free to work or meet.)",
        "options": [
          "availability",
          "responsibility",
          "time off",
          "work independently"
        ]
      }
    },
    {
      "term": "responsibility",
      "pos": "noun",
      "def": "a duty or task someone is expected to take care of",
      "ex": "Checking the supplies is my responsibility.",
      "fillBlank": {
        "text": "Checking the supplies is my _____. (Meaning: a duty or task someone is expected to take care of.)",
        "options": [
          "availability",
          "time off",
          "work independently",
          "responsibility"
        ]
      }
    },
    {
      "term": "time off",
      "pos": "noun phrase",
      "def": "time away from work, such as leave or vacation",
      "ex": "I requested time off for a family visit.",
      "fillBlank": {
        "text": "I requested _____ for a family visit. (Meaning: time away from work, such as leave or vacation.)",
        "options": [
          "responsibility",
          "work independently",
          "time off",
          "availability"
        ]
      }
    },
    {
      "term": "work independently",
      "pos": "verb phrase",
      "def": "to do a task without needing someone to guide every step",
      "ex": "I can work independently after the training.",
      "fillBlank": {
        "text": "I can _____ after the training. (Meaning: to do a task without needing someone to guide every step.)",
        "options": [
          "time off",
          "work independently",
          "availability",
          "responsibility"
        ]
      }
    },
    {
      "term": "reliable",
      "def": "dependable; you can count on this person",
      "ex": "He is a reliable worker who always shows up on time.",
      "topics": [
        "soft-skills",
        "career-job-search"
      ],
      "fillBlank": {
        "text": "He is a _____ worker who always shows up on time. (Meaning: dependable; you can count on this person.)",
        "options": [
          "reliable",
          "availability",
          "responsibility",
          "time off"
        ]
      }
    },
    {
      "term": "flexible",
      "def": "able to change, adjust to new situations",
      "ex": "Can you be flexible with your hours next week?",
      "topics": [
        "soft-skills",
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Can you be _____ with your hours next week? (Meaning: able to change, adjust to new situations.)",
        "options": [
          "availability",
          "responsibility",
          "time off",
          "flexible"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "environment",
      "def": "the place or situation around you",
      "ex": "We try to create a friendly and supportive work environment.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "role",
      "def": "a job or position someone has",
      "ex": "My role in the company is to help customers with their orders.",
      "topics": [
        "career-on-the-job",
        "career-job-search"
      ]
    },
    {
      "term": "self-confidence",
      "def": "belief in yourself",
      "ex": "Learning new skills helped increase her self-confidence.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "enthusiasm",
      "def": "strong excitement or interest",
      "ex": "The new employee showed a lot of enthusiasm for the project.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "teamwork",
      "def": "working well with others",
      "ex": "Good teamwork helps us finish the job faster.",
      "topics": [
        "soft-skills",
        "career-on-the-job"
      ]
    },
    {
      "term": "preferences",
      "def": "things you like more than others",
      "ex": "Please let us know your schedule preferences for next month.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "schedule",
      "def": "your plan for the day or week",
      "ex": "My work schedule changes every week.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Check the _____ to see which days you work next week.",
        "options": [
          "break",
          "schedule",
          "team",
          "time off"
        ]
      }
    },
    {
      "term": "break",
      "def": "a short rest from work",
      "ex": "We take a 15-minute break at 10:00 AM.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "We take a 15-minute _____ at 10:00 AM every day.",
        "options": [
          "schedule",
          "break",
          "time off",
          "team"
        ]
      }
    },
    {
      "term": "team",
      "def": "the group of people you work with",
      "ex": "Our sales team meets every Monday morning.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Our sales _____ meets every Monday morning to plan the week.",
        "options": [
          "schedule",
          "team",
          "break",
          "flexible"
        ]
      }
    }
  ]
},
  "feb-10-12": {
  "topic": "Shifts and Attendance",
  "words": [
    {
      "term": "clock in",
      "def": "to arrive at work and record your start time",
      "ex": "I always clock in when my shift starts.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "I always _____ when my shift starts. (Meaning: to arrive at work and record your start time.)",
        "options": [
          "clock in",
          "clock out",
          "call in sick",
          "shift"
        ]
      }
    },
    {
      "term": "clock out",
      "def": "to leave work and record your end time",
      "ex": "Please clock out when your shift ends.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Please _____ when your shift ends. (Meaning: to leave work and record your end time.)",
        "options": [
          "clock in",
          "call in sick",
          "shift",
          "clock out"
        ]
      }
    },
    {
      "term": "call in sick",
      "pos": "verb phrase",
      "def": "to contact your workplace to say you cannot work because you are sick",
      "ex": "I had to call in sick yesterday.",
      "fillBlank": {
        "text": "I had to _____ yesterday. (Meaning: to contact your workplace to say you cannot work because you are sick.)",
        "options": [
          "clock out",
          "shift",
          "call in sick",
          "clock in"
        ]
      }
    },
    {
      "term": "shift",
      "def": "your scheduled hours of work",
      "ex": "My shift is eight hours, and it changes every week.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "My _____ is eight hours, and it changes every week. (Meaning: your scheduled hours of work.)",
        "options": [
          "call in sick",
          "shift",
          "clock in",
          "clock out"
        ]
      }
    },
    {
      "term": "supervisor",
      "def": "the person who manages you at work",
      "ex": "If you are sick, call your supervisor before your shift.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "If you are sick, call your _____ before your shift. (Meaning: the person who manages you at work.)",
        "options": [
          "supervisor",
          "clock in",
          "clock out",
          "call in sick"
        ]
      }
    },
    {
      "term": "cover a shift",
      "pos": "verb phrase",
      "def": "to work during another employee's scheduled hours",
      "ex": "Can you cover a shift for me on Friday?",
      "fillBlank": {
        "text": "Can you _____ for me on Friday? (Meaning: to work during another employee's scheduled hours.)",
        "options": [
          "clock in",
          "clock out",
          "call in sick",
          "cover a shift"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "fill out",
      "def": "to write information on a form",
      "ex": "Please fill out this safety form before you start.",
      "topics": [
        "career-on-the-job",
        "digital-skills"
      ]
    },
    {
      "term": "turn in",
      "def": "to give homework or forms to your teacher or boss",
      "ex": "You need to turn in your timesheet every Friday.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "log in",
      "def": "to enter your username and password on a computer",
      "ex": "First, log in to the computer and open your email.",
      "topics": [
        "digital-skills",
        "career-on-the-job"
      ]
    },
    {
      "term": "go over",
      "def": "to review or explain again",
      "ex": "Let's go over the safety rules one more time.",
      "topics": [
        "career-on-the-job",
        "communication"
      ]
    },
    {
      "term": "timesheet",
      "def": "a form that records your work hours",
      "ex": "Turn in your timesheet by Friday so you get paid on time.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "policy",
      "def": "a rule or guideline at work",
      "ex": "Our company policy says you must call out if you cannot come to work.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "call out",
      "def": "to phone your job to say you will not work that day",
      "ex": "I had to call out on Monday because my son was sick.",
      "topics": [
        "career-on-the-job",
        "communication"
      ],
      "fillBlank": {
        "text": "I had to _____ on Monday because my son was sick and I could not come to work.",
        "options": [
          "clock in",
          "call out",
          "follow up",
          "clock out"
        ]
      }
    },
    {
      "term": "follow up",
      "def": "to check in later about something",
      "ex": "I will follow up with an email after our meeting.",
      "topics": [
        "career-on-the-job",
        "communication"
      ],
      "fillBlank": {
        "text": "I will _____ with an email after our meeting to confirm the details.",
        "options": [
          "call out",
          "follow up",
          "clock in",
          "clock out"
        ]
      }
    }
  ]
},
  "feb-24-26": {
  "topic": "Job Applications and Interviews",
  "words": [
    {
      "term": "experience",
      "def": "knowledge or skills from doing something",
      "ex": "Do you have any customer service experience?",
      "topics": [
        "career-job-search"
      ],
      "fillBlank": {
        "text": "Do you have any customer service _____? (Meaning: knowledge or skills from doing something.)",
        "options": [
          "experience",
          "resume",
          "cover letter",
          "reference"
        ]
      }
    },
    {
      "term": "resume",
      "def": "a document listing your work history and skills",
      "ex": "You should update your resume before applying.",
      "topics": [
        "career-job-search"
      ],
      "fillBlank": {
        "text": "You should update your _____ before applying. (Meaning: a document listing your work history and skills.)",
        "options": [
          "experience",
          "cover letter",
          "reference",
          "resume"
        ]
      }
    },
    {
      "term": "cover letter",
      "def": "a letter explaining why you want the job",
      "ex": "Include a cover letter explaining why you are a good fit.",
      "topics": [
        "career-job-search"
      ],
      "fillBlank": {
        "text": "Include a _____ explaining why you are a good fit. (Meaning: a letter explaining why you want the job.)",
        "options": [
          "resume",
          "reference",
          "cover letter",
          "experience"
        ]
      }
    },
    {
      "term": "reference",
      "def": "a person who can speak about your work or character",
      "ex": "My former boss agreed to be a reference for me.",
      "topics": [
        "career-job-search"
      ],
      "fillBlank": {
        "text": "My former boss agreed to be a _____ for me. (Meaning: a person who can speak about your work or character.)",
        "options": [
          "cover letter",
          "reference",
          "experience",
          "resume"
        ]
      }
    },
    {
      "term": "submit",
      "def": "to send or give something officially",
      "ex": "Please submit your application online.",
      "topics": [
        "career-job-search",
        "digital-skills"
      ],
      "fillBlank": {
        "text": "Please _____ your application online. (Meaning: to send or give something officially.)",
        "options": [
          "submit",
          "experience",
          "resume",
          "cover letter"
        ]
      }
    },
    {
      "term": "deadline",
      "def": "the date or time when something is due",
      "ex": "The deadline for the project is next Tuesday.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "The _____ for the project is next Tuesday. (Meaning: the date or time when something is due.)",
        "options": [
          "experience",
          "resume",
          "cover letter",
          "deadline"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "career",
      "def": "your work life over many years",
      "ex": "She plans to have a long career in healthcare.",
      "topics": [
        "career-job-search",
        "career-on-the-job"
      ]
    },
    {
      "term": "journey",
      "def": "your path or progress over time",
      "ex": "His career journey started as an intern and led to CEO.",
      "topics": [
        "career-job-search"
      ]
    },
    {
      "term": "fluent",
      "def": "able to speak a language easily and well",
      "ex": "The job requires someone who is fluent in Spanish.",
      "topics": [
        "career-job-search",
        "soft-skills"
      ]
    },
    {
      "term": "advancement",
      "def": "moving forward in your career",
      "ex": "There are many opportunities for advancement in this company.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "path",
      "def": "the direction or route you take",
      "ex": "He is unsure which career path to follow.",
      "topics": [
        "career-job-search"
      ]
    },
    {
      "term": "under pressure",
      "def": "in a stressful situation",
      "ex": "Can you work well under pressure during busy times?",
      "topics": [
        "soft-skills",
        "career-job-search"
      ]
    }
  ]
},
  "mar-3-5": {
  "topic": "Career Progress and Pay",
  "words": [
    {
      "term": "promotion",
      "def": "moving to a higher position at work",
      "ex": "After working hard for two years, he received a promotion.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "After working hard for two years, he received a _____. (Meaning: moving to a higher position at work.)",
        "options": [
          "promotion",
          "gross pay",
          "deductions",
          "benefits"
        ]
      }
    },
    {
      "term": "gross pay",
      "def": "the total money you earn before taxes or deductions",
      "ex": "Your gross pay is your salary before taxes are taken out.",
      "topics": [
        "career-on-the-job",
        "money"
      ],
      "fillBlank": {
        "text": "Your _____ is your salary before taxes are taken out. (Meaning: the total money you earn before taxes or deductions.)",
        "options": [
          "promotion",
          "deductions",
          "benefits",
          "gross pay"
        ]
      }
    },
    {
      "term": "deductions",
      "def": "money taken out of your paycheck for taxes or other costs",
      "ex": "Check your pay stub to see the deductions for taxes and insurance.",
      "topics": [
        "career-on-the-job",
        "money"
      ],
      "fillBlank": {
        "text": "Check your pay stub to see the _____ for taxes and insurance. (Meaning: money taken out of your paycheck for taxes or other costs.)",
        "options": [
          "gross pay",
          "benefits",
          "deductions",
          "promotion"
        ]
      }
    },
    {
      "term": "benefits",
      "def": "things your job gives you besides pay (e.g. health insurance)",
      "ex": "The job offers great benefits, including health insurance and paid time off.",
      "topics": [
        "career-on-the-job",
        "career-job-search",
        "money"
      ],
      "fillBlank": {
        "text": "The job offers great _____, including health insurance and paid time off. (Meaning: things your job gives you besides pay (e.g. health insurance).)",
        "options": [
          "deductions",
          "benefits",
          "promotion",
          "gross pay"
        ]
      }
    },
    {
      "term": "priority",
      "pos": "noun",
      "def": "something treated as more important or urgent than other things",
      "ex": "Finishing the application is my top priority today.",
      "fillBlank": {
        "text": "Finishing the application is my top _____ today. (Meaning: something treated as more important or urgent than other things.)",
        "options": [
          "priority",
          "promotion",
          "gross pay",
          "deductions"
        ]
      }
    },
    {
      "term": "emergency fund",
      "def": "money saved for unexpected problems",
      "ex": "It is smart to save money in an emergency fund for unexpected costs.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "It is smart to save money in an _____ for unexpected costs. (Meaning: money saved for unexpected problems.)",
        "options": [
          "promotion",
          "gross pay",
          "deductions",
          "emergency fund"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "ambitious",
      "def": "wanting to be successful or achieve goals",
      "ex": "She is ambitious and hopes to become a manager soon.",
      "topics": [
        "soft-skills",
        "career-job-search"
      ]
    },
    {
      "term": "decade",
      "def": "a period of ten years",
      "ex": "He has worked at the same company for over a decade.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "retire",
      "def": "to stop working, usually at an older age",
      "ex": "My father plans to retire when he turns 65.",
      "topics": [
        "career-on-the-job",
        "money"
      ]
    },
    {
      "term": "achieve",
      "def": "to reach a goal, to succeed",
      "ex": "With hard work, you can achieve your goals.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "milestone",
      "pos": "noun",
      "def": "an important point or achievement in a process",
      "ex": "Finishing this course will be a milestone for me."
    },
    {
      "term": "long-term",
      "def": "over a long time (years, not months)",
      "ex": "Buying a house is a long-term financial goal.",
      "topics": [
        "money"
      ]
    }
  ]
},
  "mar-10-12": {
  "topic": "Past Jobs and Workplace Routines",
  "words": [
    {
      "term": "previous position",
      "pos": "noun phrase",
      "def": "a job someone had before their current job",
      "ex": "In my previous position, I trained new employees.",
      "fillBlank": {
        "text": "In my _____, I trained new employees. (Meaning: a job someone had before their current job.)",
        "options": [
          "previous position",
          "job duties",
          "work overtime",
          "required"
        ]
      }
    },
    {
      "term": "job duties",
      "pos": "noun phrase",
      "def": "the tasks a person is expected to do at work",
      "ex": "My job duties used to include answering phones.",
      "fillBlank": {
        "text": "My _____ used to include answering phones. (Meaning: the tasks a person is expected to do at work.)",
        "options": [
          "previous position",
          "work overtime",
          "required",
          "job duties"
        ]
      }
    },
    {
      "term": "work overtime",
      "pos": "verb phrase",
      "def": "to work more than your usual scheduled hours",
      "ex": "I used to work overtime during the busy season.",
      "fillBlank": {
        "text": "I used to _____ during the busy season. (Meaning: to work more than your usual scheduled hours.)",
        "options": [
          "job duties",
          "required",
          "work overtime",
          "previous position"
        ]
      }
    },
    {
      "term": "required",
      "def": "necessary; must be done",
      "ex": "A photo ID is required to enter the building.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "A photo ID is _____ to enter the building. (Meaning: necessary; must be done.)",
        "options": [
          "work overtime",
          "required",
          "previous position",
          "job duties"
        ]
      }
    },
    {
      "term": "allowed",
      "def": "permitted; okay to do",
      "ex": "Cell phones are not allowed during the test.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Cell phones are not _____ during the test. (Meaning: permitted; okay to do.)",
        "options": [
          "allowed",
          "previous position",
          "job duties",
          "work overtime"
        ]
      }
    },
    {
      "term": "safety procedure",
      "pos": "noun phrase",
      "def": "a set of steps used to reduce the risk of injury or harm",
      "ex": "We practiced the safety procedure during training.",
      "fillBlank": {
        "text": "We practiced the _____ during training. (Meaning: a set of steps used to reduce the risk of injury or harm.)",
        "options": [
          "previous position",
          "job duties",
          "work overtime",
          "safety procedure"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "permission",
      "def": "approval to do something",
      "ex": "You need permission before using the company car.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "rule",
      "def": "an official instruction you must follow",
      "ex": "One important rule is to wash your hands before cooking.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "prohibited",
      "def": "not allowed; forbidden",
      "ex": "Smoking is prohibited near the entrance.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "polite",
      "def": "showing respect and good manners",
      "ex": "It is polite to ask before leaving early.",
      "topics": [
        "soft-skills",
        "communication"
      ]
    },
    {
      "term": "request",
      "def": "a polite way to ask for something",
      "ex": "She made a polite request to change her schedule.",
      "topics": [
        "career-on-the-job",
        "communication"
      ]
    },
    {
      "term": "training",
      "def": "learning how to do a job or task",
      "ex": "New employees complete safety training before they start work.",
      "topics": [
        "career-on-the-job",
        "career-job-search"
      ]
    },
    {
      "term": "must",
      "def": "used to show a strong obligation or rule",
      "ex": "You must wear closed-toe shoes in the kitchen.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "It's the law—all workers _____ wear hard hats on the construction site.",
        "options": [
          "should",
          "must",
          "can",
          "request"
        ]
      }
    },
    {
      "term": "should",
      "def": "used to give advice or say the best thing to do",
      "ex": "You should ask your supervisor if you are unsure.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "My coworker gave me advice: I _____ bring lunch to save money.",
        "options": [
          "must",
          "can",
          "should",
          "required"
        ]
      }
    },
    {
      "term": "can",
      "def": "used to show permission or ability",
      "ex": "You can take your break after you finish this task.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Good news! You _____ wear jeans on Fridays if you want.",
        "options": [
          "rule",
          "must",
          "can",
          "prohibited"
        ]
      }
    },
    {
      "term": "safety",
      "def": "protection from danger or harm",
      "ex": "Safety is very important in the kitchen.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "The company cares about _____, so we have regular fire drills.",
        "options": [
          "permission",
          "safety",
          "polite",
          "can"
        ]
      }
    }
  ]
},
  "mar-17-19": {
  "topic": "Workplace Rights and Concerns",
  "words": [
    {
      "term": "right",
      "pos": "noun",
      "def": "something a person is entitled to do or have",
      "ex": "Workers discussed their right to a safe workplace.",
      "fillBlank": {
        "text": "Workers discussed their _____ to a safe workplace. (Meaning: something a person is entitled to do or have.)",
        "options": [
          "right",
          "advocate",
          "raise a concern",
          "workplace policy"
        ]
      }
    },
    {
      "term": "advocate",
      "def": "to speak up for yourself or others",
      "ex": "You need to advocate for yourself if you want a raise.",
      "topics": [
        "soft-skills",
        "civic-life",
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "At the meeting, residents can _____ for better bus service. (Meaning: to speak up for yourself or others.)",
        "options": [
          "right",
          "raise a concern",
          "workplace policy",
          "advocate"
        ]
      }
    },
    {
      "term": "raise a concern",
      "pos": "verb phrase",
      "def": "to tell others about something you think may be a problem",
      "ex": "I would like to raise a concern about the bus schedule.",
      "fillBlank": {
        "text": "I want to _____ about the broken lights before someone gets hurt. (Meaning: to tell others about something you think may be a problem.)",
        "options": [
          "advocate",
          "workplace policy",
          "raise a concern",
          "right"
        ]
      }
    },
    {
      "term": "workplace policy",
      "pos": "noun phrase",
      "def": "an official rule or guideline at a job",
      "ex": "The workplace policy explains how to request time off.",
      "fillBlank": {
        "text": "The _____ explains how to request time off. (Meaning: an official rule or guideline at a job.)",
        "options": [
          "raise a concern",
          "workplace policy",
          "right",
          "advocate"
        ]
      }
    },
    {
      "term": "file a complaint",
      "pos": "verb phrase",
      "def": "to formally report a problem and ask for it to be addressed",
      "ex": "Where can I file a complaint about this issue?",
      "fillBlank": {
        "text": "Where can I _____ about this issue? (Meaning: to formally report a problem and ask for it to be addressed.)",
        "options": [
          "file a complaint",
          "right",
          "advocate",
          "raise a concern"
        ]
      }
    },
    {
      "term": "violation",
      "pos": "noun",
      "def": "an action that breaks a rule, agreement, or law",
      "ex": "Blocking the emergency exit is a safety violation.",
      "fillBlank": {
        "text": "Blocking the emergency exit is a safety _____. (Meaning: an action that breaks a rule, agreement, or law.)",
        "options": [
          "right",
          "advocate",
          "raise a concern",
          "violation"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "require",
      "def": "to need something or make it necessary",
      "ex": "This job may require you to work some weekends.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "allow",
      "def": "to let someone do something",
      "ex": "Does your company allow employees to work from home?",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "rule",
      "def": "a guideline or regulation you must follow",
      "ex": "Please follow every safety rule to avoid accidents.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "prohibit",
      "def": "to not allow, to ban something",
      "ex": "Company policy prohibits smoking in the building.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "coordinate",
      "def": "to organize people or activities so they work well together",
      "ex": "I need to coordinate the schedule with the other managers.",
      "topics": [
        "career-on-the-job",
        "soft-skills"
      ]
    },
    {
      "term": "recruit",
      "def": "to find and bring new people into a company or group",
      "ex": "We are trying to recruit new engineers for the team.",
      "topics": [
        "career-job-search"
      ]
    },
    {
      "term": "courtesy",
      "def": "polite and respectful behavior",
      "ex": "Treat all customers with patience and courtesy.",
      "topics": [
        "soft-skills",
        "communication"
      ]
    },
    {
      "term": "comply",
      "def": "to follow rules or requirements",
      "ex": "All employees must comply with the new regulations.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "violate",
      "def": "to break a rule or law",
      "ex": "If you violate the policy, you may receive a warning.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "respect",
      "def": "polite and fair treatment of other people",
      "ex": "We should treat coworkers with respect.",
      "pos": "noun",
      "topics": [
        "soft-skills",
        "communication"
      ]
    },
    {
      "term": "strict",
      "def": "following rules very closely; not flexible",
      "ex": "The company has strict rules about using cell phones at work.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "follow the rules",
      "def": "to do what the rules say",
      "ex": "Everyone needs to follow the rules at work.",
      "pos": "verb phrase",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "break a rule",
      "def": "to do something a rule does not allow",
      "ex": "You could get a warning if you break a rule.",
      "pos": "verb phrase",
      "topics": [
        "career-on-the-job"
      ]
    }
  ]
},
  "mar-24-26": {
  "topic": "Feedback and Decisions",
  "words": [
    {
      "term": "feedback",
      "def": "comments or advice about your work",
      "ex": "I appreciate your honest feedback on my work.",
      "topics": [
        "career-on-the-job",
        "communication"
      ],
      "fillBlank": {
        "text": "I appreciate your honest _____ on my work. (Meaning: comments or advice about your work.)",
        "options": [
          "feedback",
          "constructive criticism",
          "make a decision",
          "consequence"
        ]
      }
    },
    {
      "term": "constructive criticism",
      "pos": "noun phrase",
      "def": "feedback that identifies a problem and helps someone improve",
      "ex": "I appreciate constructive criticism that includes a useful suggestion.",
      "fillBlank": {
        "text": "I appreciate _____ that includes a useful suggestion. (Meaning: feedback that identifies a problem and helps someone improve.)",
        "options": [
          "feedback",
          "make a decision",
          "consequence",
          "constructive criticism"
        ]
      }
    },
    {
      "term": "make a decision",
      "pos": "verb phrase",
      "def": "to choose what to do after considering the options",
      "ex": "We need to make a decision about the schedule.",
      "fillBlank": {
        "text": "We need to _____ about the schedule. (Meaning: to choose what to do after considering the options.)",
        "options": [
          "constructive criticism",
          "consequence",
          "make a decision",
          "feedback"
        ]
      }
    },
    {
      "term": "consequence",
      "def": "a result or effect of an action",
      "ex": "Losing your job can be a serious consequence of violating safety rules.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Losing your job can be a serious _____ of violating safety rules. (Meaning: a result or effect of an action.)",
        "options": [
          "make a decision",
          "consequence",
          "feedback",
          "constructive criticism"
        ]
      }
    },
    {
      "term": "take into account",
      "pos": "verb phrase",
      "def": "to consider something when making a judgment or decision",
      "ex": "We need to take into account the cost of transportation.",
      "fillBlank": {
        "text": "We need to _____ the cost of transportation. (Meaning: to consider something when making a judgment or decision.)",
        "options": [
          "take into account",
          "feedback",
          "constructive criticism",
          "make a decision"
        ]
      }
    },
    {
      "term": "recommend",
      "def": "to suggest something is good",
      "ex": "I can recommend a good mechanic if you need one.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "Can you _____ a reliable repair company based on your experience? (Meaning: to suggest something is good.)",
        "options": [
          "feedback",
          "constructive criticism",
          "make a decision",
          "recommend"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "risk",
      "def": "the possibility of something bad happening",
      "ex": "There is always a risk when starting a new business.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "regret",
      "def": "to feel sorry about something you did or didn't do",
      "ex": "I regret not finishing college when I was younger.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "experience",
      "def": "knowledge or skill gained from doing something",
      "ex": "You will gain valuable experience in this internship.",
      "topics": [
        "career-job-search"
      ]
    },
    {
      "term": "choice",
      "def": "a decision you make",
      "ex": "You have a choice between working the day shift or the night shift.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "result",
      "def": "what happens because of an action",
      "ex": "The result of the project was better than we expected.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "career",
      "def": "your work life over many years",
      "ex": "She changed her career path after ten years in sales.",
      "topics": [
        "career-job-search",
        "career-on-the-job"
      ]
    },
    {
      "term": "reflect",
      "def": "to think carefully about something",
      "ex": "Take some time to reflect on your performance this year.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "advice",
      "def": "suggestions or recommendations about what to do",
      "ex": "Can you give me some advice on how to ask for a promotion?",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "decision",
      "def": "a choice you make",
      "ex": "We need to make a decision about the budget by tomorrow.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "think about",
      "def": "to spend time considering something",
      "ex": "I need to think about your advice.",
      "pos": "verb phrase",
      "topics": [
        "soft-skills"
      ]
    }
  ]
},
  "mar-31-apr-2": {
  "topic": "Workplace Conversation and Clarification",
  "words": [
    {
      "term": "clarify",
      "def": "to make something clearer or easier to understand",
      "ex": "Can you clarify what time the meeting starts?",
      "topics": [
        "communication",
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Can you _____ what time the meeting starts? (Meaning: to make something clearer or easier to understand.)",
        "options": [
          "clarify",
          "show up",
          "follow up",
          "help out"
        ]
      }
    },
    {
      "term": "show up",
      "def": "to arrive at a place",
      "ex": "I usually show up a few minutes early for work.",
      "topics": [
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "I usually _____ a few minutes early for work. (Meaning: to arrive at a place.)",
        "options": [
          "clarify",
          "follow up",
          "find out",
          "show up"
        ]
      }
    },
    {
      "term": "follow up",
      "def": "to check in later about something",
      "ex": "I will follow up with an email after our meeting.",
      "topics": [
        "career-on-the-job",
        "communication"
      ],
      "fillBlank": {
        "text": "I will _____ with an email after our meeting. (Meaning: to check in later about something.)",
        "options": [
          "show up",
          "find out",
          "follow up",
          "clarify"
        ]
      }
    },
    {
      "term": "find out",
      "def": "to learn or discover information",
      "ex": "I need to find out what time the training starts.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I need to _____ what time the training starts. (Meaning: to learn or discover information.)",
        "options": [
          "help out",
          "find out",
          "show up",
          "follow up"
        ]
      }
    },
    {
      "term": "help out",
      "def": "to help someone with something",
      "ex": "My coworker helped out when the front desk got busy.",
      "topics": [
        "soft-skills",
        "career-on-the-job"
      ],
      "fillBlank": {
        "text": "Can you _____ at the front desk while I answer this call? (Meaning: to help someone with something.)",
        "options": [
          "help out",
          "clarify",
          "show up",
          "follow up"
        ]
      }
    },
    {
      "term": "look forward to",
      "def": "to feel excited about something in the future",
      "ex": "We are looking forward to the long weekend.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I _____ meeting my new coworkers. (Meaning: to feel excited about something in the future.)",
        "options": [
          "clarify",
          "show up",
          "follow up",
          "look forward to"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "drop by",
      "def": "to visit briefly",
      "ex": "You can drop by my desk if you have a quick question.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "run into",
      "def": "to meet someone unexpectedly",
      "ex": "I ran into my old supervisor at the grocery store.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "hang out",
      "def": "to spend time together socially",
      "ex": "Sometimes our team hangs out after work and gets coffee.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "hear from",
      "def": "to get news or a message from someone",
      "ex": "I hope to hear from the manager by Friday.",
      "topics": [
        "communication",
        "career-job-search"
      ]
    },
    {
      "term": "catch up on",
      "def": "to do something that you did not have time to do before",
      "ex": "I used Friday afternoon to catch up on my email.",
      "topics": [
        "career-on-the-job"
      ]
    },
    {
      "term": "stop by",
      "def": "to visit briefly",
      "ex": "Stop by my office before you leave if you have questions.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "work out",
      "def": "to exercise",
      "ex": "I like to work out before I go to work.",
      "topics": [
        "health"
      ]
    }
  ]
},
  "apr-7-9": {
  "topic": "Describing Symptoms and Getting Care",
  "words": [
    {
      "term": "symptom",
      "pos": "noun",
      "def": "a change in how someone feels or functions that may indicate a health problem",
      "ex": "I wrote down each symptom before my appointment.",
      "fillBlank": {
        "text": "I wrote down each _____ before my appointment. (Meaning: a change in how someone feels or functions that may indicate a health problem.)",
        "options": [
          "symptom",
          "persistent",
          "diagnosis",
          "contagious"
        ]
      }
    },
    {
      "term": "persistent",
      "pos": "adjective",
      "def": "continuing for a long time or repeatedly returning",
      "ex": "I want to ask the clinic about this persistent cough.",
      "fillBlank": {
        "text": "I want to ask the clinic about this _____ cough. (Meaning: continuing for a long time or repeatedly returning.)",
        "options": [
          "symptom",
          "diagnosis",
          "contagious",
          "persistent"
        ]
      }
    },
    {
      "term": "diagnosis",
      "pos": "noun",
      "def": "a healthcare professional's identification of a health condition",
      "ex": "The doctor explained the diagnosis and answered my questions.",
      "fillBlank": {
        "text": "The doctor explained the _____ and answered my questions. (Meaning: a healthcare professional's identification of a health condition.)",
        "options": [
          "persistent",
          "contagious",
          "diagnosis",
          "symptom"
        ]
      }
    },
    {
      "term": "contagious",
      "pos": "adjective",
      "def": "able to spread from one person to another",
      "ex": "I asked the clinic whether the illness was contagious.",
      "fillBlank": {
        "text": "I asked the clinic whether the illness was _____. (Meaning: able to spread from one person to another.)",
        "options": [
          "diagnosis",
          "contagious",
          "symptom",
          "persistent"
        ]
      }
    },
    {
      "term": "seek care",
      "pos": "verb phrase",
      "def": "to try to get help from a healthcare professional",
      "ex": "I called the clinic to ask where I could seek care.",
      "fillBlank": {
        "text": "I called the clinic to ask where I could _____. (Meaning: to try to get help from a healthcare professional.)",
        "options": [
          "seek care",
          "symptom",
          "persistent",
          "diagnosis"
        ]
      }
    },
    {
      "term": "follow-up appointment",
      "pos": "noun phrase",
      "def": "a later visit to check progress or discuss what happens next",
      "ex": "When is my follow-up appointment?",
      "fillBlank": {
        "text": "When is my _____? (Meaning: a later visit to check progress or discuss what happens next.)",
        "options": [
          "symptom",
          "persistent",
          "diagnosis",
          "follow-up appointment"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "inflamed",
      "def": "swollen, red, or painful",
      "ex": "Her ankle was inflamed and swollen after she twisted it.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "pediatrician",
      "def": "a doctor for children",
      "ex": "We took the baby to the pediatrician for a checkup.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "cardiologist",
      "def": "a doctor for the heart",
      "ex": "The cardiologist said he needs to exercise more for his heart.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "track",
      "def": "to record and monitor",
      "ex": "Use a calendar to track your appointments.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "arteries",
      "def": "blood vessels that carry blood from the heart",
      "ex": "Healthy food keeps your arteries clear and your heart strong.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "stroke",
      "def": "a sudden problem in the brain that can stop it working correctly",
      "ex": "High blood pressure is a major risk factor for stroke.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "cough",
      "def": "to force air out of your lungs with a sound",
      "ex": "Please cover your mouth when you cough.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "Please cover your mouth when you _____.",
        "options": [
          "avoid",
          "cough",
          "quit",
          "habit"
        ]
      }
    },
    {
      "term": "infected",
      "def": "having germs that make you sick",
      "ex": "The cut on his finger became infected because he didn't clean it.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "The cut on his finger became _____ because he did not clean it.",
        "options": [
          "depressed",
          "infected",
          "habit",
          "avoid"
        ]
      }
    },
    {
      "term": "depressed",
      "pos": "adjective",
      "def": "experiencing a low mood; in a health context, possibly a symptom of depression",
      "ex": "She told a healthcare professional that she had been feeling depressed."
    },
    {
      "term": "habit",
      "def": "something you do regularly",
      "ex": "Smoking is a bad habit that is hard to break.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "Smoking is a bad _____ that is hard to break.",
        "options": [
          "habit",
          "avoid",
          "quit",
          "cough"
        ]
      }
    },
    {
      "term": "avoid",
      "def": "to stay away from",
      "ex": "You should avoid eating too much sugar.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "You should _____ eating too much sugar if you want to be healthier.",
        "options": [
          "quit",
          "avoid",
          "cough",
          "habit"
        ]
      }
    },
    {
      "term": "quit",
      "def": "to stop doing something",
      "ex": "He decided to quit his job and go back to school.",
      "topics": [
        "career-on-the-job",
        "health"
      ],
      "fillBlank": {
        "text": "He decided to _____ smoking after his doctor warned him.",
        "options": [
          "avoid",
          "quit",
          "cough",
          "habit"
        ]
      }
    }
  ]
},
  "apr-14-16": {
  "topic": "Recovery and Changing Habits",
  "words": [
    {
      "term": "recover from",
      "pos": "verb phrase",
      "def": "to get better after an illness, injury, or difficult experience",
      "ex": "It took me several weeks to recover from the surgery.",
      "fillBlank": {
        "text": "It took me several weeks to _____ the surgery. (Meaning: to get better after an illness, injury, or difficult experience.)",
        "options": [
          "recover from",
          "ease up",
          "cut back on",
          "build up"
        ]
      }
    },
    {
      "term": "ease up",
      "pos": "verb phrase",
      "def": "to become less strong or severe",
      "ex": "The pain began to ease up yesterday.",
      "fillBlank": {
        "text": "The pain began to _____ yesterday. (Meaning: to become less strong or severe.)",
        "options": [
          "recover from",
          "cut back on",
          "build up",
          "ease up"
        ]
      }
    },
    {
      "term": "cut back on",
      "pos": "verb phrase",
      "def": "to reduce how much you use, do, or consume",
      "ex": "I am trying to cut back on soda.",
      "fillBlank": {
        "text": "I am trying to _____ soda. (Meaning: to reduce how much you use, do, or consume.)",
        "options": [
          "ease up",
          "build up",
          "cut back on",
          "recover from"
        ]
      }
    },
    {
      "term": "build up",
      "pos": "verb phrase",
      "def": "to increase something gradually over time",
      "ex": "I want to build up my strength gradually.",
      "fillBlank": {
        "text": "I want to _____ my strength gradually. (Meaning: to increase something gradually over time.)",
        "options": [
          "cut back on",
          "build up",
          "recover from",
          "ease up"
        ]
      }
    },
    {
      "term": "prevent",
      "pos": "verb",
      "def": "to stop something from happening",
      "ex": "What steps can help prevent this problem from happening again?",
      "fillBlank": {
        "text": "What steps can help _____ this problem from happening again? (Meaning: to stop something from happening.)",
        "options": [
          "prevent",
          "recover from",
          "ease up",
          "cut back on"
        ]
      }
    },
    {
      "term": "adjust to",
      "pos": "verb phrase",
      "def": "to become used to a new situation or change",
      "ex": "It takes time to adjust to a new routine.",
      "fillBlank": {
        "text": "It takes time to _____ a new routine. (Meaning: to become used to a new situation or change.)",
        "options": [
          "recover from",
          "ease up",
          "cut back on",
          "adjust to"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "result",
      "def": "the outcome or effect of something",
      "ex": "The doctor will call you with the result of your blood test.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "duration",
      "def": "how long something lasts",
      "ex": "The duration of the flu is usually about one week.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "bladder",
      "def": "the organ that holds urine",
      "ex": "Drinking plenty of water is good for your bladder.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "liver",
      "def": "the organ that cleans your blood",
      "ex": "Alcohol can damage your liver over time.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "used to",
      "def": "something you did in the past but not now",
      "ex": "I used to smoke, but I quit five years ago.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "pattern",
      "def": "a regular way you do things (like a habit)",
      "ex": "Sleep problems can disrupt your daily pattern.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "lifestyle",
      "def": "the way you live, your daily habits",
      "ex": "Eating healthy and exercising are part of a good lifestyle.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "recover",
      "def": "to get better after being sick",
      "ex": "It took him a few weeks to fully recover from the surgery.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "improve",
      "def": "to get better, to make progress",
      "ex": "Rest and fluids will help you improve quickly.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "exercise",
      "def": "to do physical activity to stay healthy",
      "ex": "You should exercise for at least 30 minutes every day.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "routine",
      "def": "the things you usually do each day",
      "ex": "I want to change my evening routine.",
      "pos": "noun",
      "topics": [
        "health"
      ]
    },
    {
      "term": "adjust",
      "def": "to change to fit a new situation",
      "ex": "It takes time to adjust to a new medication.",
      "topics": [
        "health"
      ]
    }
  ]
},
  "apr-28-30": {
  "topic": "Pharmacy Communication",
  "words": [
    {
      "term": "refill",
      "pos": "noun",
      "def": "another supply of a medicine prescribed before",
      "ex": "I need to ask the pharmacy for a refill.",
      "fillBlank": {
        "text": "I need to ask the pharmacy for a _____. (Meaning: another supply of a medicine prescribed before.)",
        "options": [
          "refill",
          "over-the-counter",
          "dosage",
          "prescription"
        ]
      }
    },
    {
      "term": "over-the-counter",
      "pos": "adjective",
      "def": "sold without a prescription",
      "ex": "Can I ask you about this over-the-counter medicine?",
      "fillBlank": {
        "text": "Can I ask you about this _____ medicine? (Meaning: sold without a prescription.)",
        "options": [
          "refill",
          "dosage",
          "prescription",
          "over-the-counter"
        ]
      }
    },
    {
      "term": "dosage",
      "pos": "noun",
      "def": "instructions for the amount of medicine to take and how often to take it",
      "ex": "Could you explain the dosage on this label?",
      "fillBlank": {
        "text": "Could you explain the _____ on this label? (Meaning: instructions for the amount of medicine to take and how often to take it.)",
        "options": [
          "over-the-counter",
          "prescription",
          "dosage",
          "refill"
        ]
      }
    },
    {
      "term": "prescription",
      "pos": "noun",
      "def": "an order from an authorized healthcare professional for medicine or treatment",
      "ex": "The clinic sent my prescription to the pharmacy.",
      "fillBlank": {
        "text": "The clinic sent my _____ to the pharmacy. (Meaning: an order from an authorized healthcare professional for medicine or treatment.)",
        "options": [
          "dosage",
          "prescription",
          "refill",
          "over-the-counter"
        ]
      }
    },
    {
      "term": "pharmacist",
      "pos": "noun",
      "def": "a healthcare professional who prepares medicines and explains their use",
      "ex": "The pharmacist answered my questions about the label.",
      "fillBlank": {
        "text": "The _____ answered my questions about the label. (Meaning: a healthcare professional who prepares medicines and explains their use.)",
        "options": [
          "pharmacist",
          "refill",
          "over-the-counter",
          "dosage"
        ]
      }
    },
    {
      "term": "interaction",
      "pos": "noun",
      "def": "a change in a medicine's effect when it is taken with another substance",
      "ex": "Could there be an interaction between these medicines?",
      "fillBlank": {
        "text": "Could there be an _____ between these medicines? (Meaning: a change in a medicine's effect when it is taken with another substance.)",
        "options": [
          "refill",
          "over-the-counter",
          "dosage",
          "interaction"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "accustomed",
      "def": "familiar with something, used to it",
      "ex": "It took me a while to get accustomed to the cold weather.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "prefer",
      "def": "to like one thing more than another",
      "ex": "I prefer tea over coffee in the morning.",
      "topics": [
        "communication"
      ]
    },
    {
      "term": "routine",
      "def": "a regular way of doing things",
      "ex": "My morning routine includes coffee and the news.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "transition",
      "def": "moving from one situation to another",
      "ex": "The transition from my home country was hard at first.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "maintain",
      "def": "to keep something going or in good condition",
      "ex": "It is hard to maintain a healthy diet when you are busy.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "substitute",
      "def": "to replace one thing with something else",
      "ex": "You can substitute water for soda to be healthier.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "appointment",
      "def": "a scheduled time to see a doctor",
      "ex": "I have a dentist appointment next Tuesday at 2:00.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "I have a dentist _____ next Tuesday at 2:00.",
        "options": [
          "checkup",
          "appointment",
          "prescription",
          "diagnosis"
        ]
      }
    },
    {
      "term": "checkup",
      "def": "a regular doctor visit when you're not sick",
      "ex": "You should go to the doctor for a yearly checkup.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "You should go to the doctor for a yearly _____ even when you are not sick.",
        "options": [
          "appointment",
          "checkup",
          "diagnosis",
          "prescription"
        ]
      }
    },
    {
      "term": "diagnosis",
      "pos": "noun",
      "def": "a healthcare professional's identification of a health condition",
      "ex": "The doctor explained the diagnosis and answered my questions."
    },
    {
      "term": "fever",
      "def": "when your body temperature is too high",
      "ex": "She has a high fever and needs to rest.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "She has a high _____ and needs to rest at home.",
        "options": [
          "fever",
          "contagious",
          "diagnosis",
          "prescription"
        ]
      }
    },
    {
      "term": "contagious",
      "pos": "adjective",
      "def": "able to spread from one person to another",
      "ex": "I asked the clinic whether the illness was contagious."
    }
  ]
},
  "may-5-7": {
  "topic": "Treatment and Wellness Goals",
  "words": [
    {
      "term": "symptom",
      "pos": "noun",
      "def": "a change in how someone feels or functions that may indicate a health problem",
      "ex": "I wrote down each symptom before my appointment.",
      "fillBlank": {
        "text": "I wrote down each _____ before my appointment. (Meaning: a change in how someone feels or functions that may indicate a health problem.)",
        "options": [
          "symptom",
          "treatment plan",
          "prescribe",
          "dose"
        ]
      }
    },
    {
      "term": "treatment plan",
      "pos": "noun phrase",
      "def": "the agreed steps for managing a health condition",
      "ex": "At my next visit, I will ask about my treatment plan.",
      "fillBlank": {
        "text": "At my next visit, I will ask about my _____. (Meaning: the agreed steps for managing a health condition.)",
        "options": [
          "symptom",
          "prescribe",
          "dose",
          "treatment plan"
        ]
      }
    },
    {
      "term": "prescribe",
      "pos": "verb",
      "def": "to order medicine or treatment for a patient",
      "ex": "Will the clinician prescribe a medicine or suggest another treatment?",
      "fillBlank": {
        "text": "Will the clinician _____ a medicine or suggest another treatment? (Meaning: to order medicine or treatment for a patient.)",
        "options": [
          "treatment plan",
          "dose",
          "prescribe",
          "symptom"
        ]
      }
    },
    {
      "term": "dose",
      "pos": "noun",
      "def": "one measured amount of medicine taken at one time",
      "ex": "Where does the label show the amount for one dose?",
      "fillBlank": {
        "text": "Where does the label show the amount for one _____? (Meaning: one measured amount of medicine taken at one time.)",
        "options": [
          "prescribe",
          "dose",
          "symptom",
          "treatment plan"
        ]
      }
    },
    {
      "term": "chronic",
      "pos": "adjective",
      "def": "lasting a long time or repeatedly returning",
      "ex": "She asked about treatment options for chronic pain.",
      "fillBlank": {
        "text": "She asked about treatment options for _____ pain. (Meaning: lasting a long time or repeatedly returning.)",
        "options": [
          "chronic",
          "symptom",
          "treatment plan",
          "prescribe"
        ]
      }
    },
    {
      "term": "side effect",
      "def": "an unwanted effect a medicine can have",
      "ex": "Is feeling sleepy a side effect of this medicine?",
      "pos": "noun",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "Is feeling sleepy a _____ of this medicine? (Meaning: an unwanted effect a medicine can have.)",
        "options": [
          "symptom",
          "treatment plan",
          "prescribe",
          "side effect"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "muscles",
      "def": "parts of the body that help you move",
      "ex": "Stretching helps keep your muscles flexible.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "bones",
      "def": "hard parts inside your body that give shape and support",
      "ex": "Calcium is important for strong bones.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "drowsy",
      "def": "sleepy or less alert, often after taking medicine",
      "ex": "This allergy medicine can make you feel drowsy.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "sign",
      "def": "something that shows you might be sick",
      "ex": "A fever is often a sign of an infection.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "caution",
      "def": "being careful to avoid danger",
      "ex": "Use caution when taking new medicine for the first time.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "organ",
      "def": "a body part with a specific job, like the heart or lungs",
      "ex": "The heart is a vital organ that pumps blood.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "nutrient",
      "def": "something in food your body needs, like vitamins",
      "ex": "Fruits and vegetables are full of important nutrients.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "temperature",
      "def": "how hot or cold your body is",
      "ex": "The nurse took my temperature to check for a fever.",
      "topics": [
        "health"
      ]
    }
  ]
},
  "may-12-14": {
  "topic": "Stress and Adjustment",
  "words": [
    {
      "term": "wellness",
      "def": "overall health and well-being",
      "ex": "The company offers a wellness program for employees.",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "The company offers a _____ program for employees. (Meaning: overall health and well-being.)",
        "options": [
          "wellness",
          "self-care",
          "unwind",
          "coping skills"
        ]
      }
    },
    {
      "term": "self-care",
      "def": "taking care of your own needs",
      "ex": "Taking time to relax is an important part of self-care.",
      "topics": [
        "health",
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Taking time to relax is an important part of _____. (Meaning: taking care of your own needs.)",
        "options": [
          "wellness",
          "unwind",
          "coping skills",
          "self-care"
        ]
      }
    },
    {
      "term": "unwind",
      "pos": "verb",
      "def": "to relax after work, stress, or activity",
      "ex": "I listen to music to unwind after work.",
      "fillBlank": {
        "text": "I listen to music to _____ after work. (Meaning: to relax after work, stress, or activity.)",
        "options": [
          "self-care",
          "coping skills",
          "unwind",
          "wellness"
        ]
      }
    },
    {
      "term": "coping skills",
      "def": "ways to handle stress or problems",
      "ex": "Deep breathing is one of my coping skills for stress.",
      "topics": [
        "health",
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Deep breathing is one of my _____ for stress. (Meaning: ways to handle stress or problems.)",
        "options": [
          "unwind",
          "coping skills",
          "wellness",
          "self-care"
        ]
      }
    },
    {
      "term": "work-life balance",
      "pos": "noun phrase",
      "def": "a manageable balance between work and the rest of your life",
      "ex": "A predictable schedule helps my work-life balance.",
      "fillBlank": {
        "text": "A predictable schedule helps my _____. (Meaning: a manageable balance between work and the rest of your life.)",
        "options": [
          "work-life balance",
          "wellness",
          "self-care",
          "unwind"
        ]
      }
    },
    {
      "term": "set boundaries",
      "pos": "verb phrase",
      "def": "to make clear limits about what you can accept or do",
      "ex": "I am learning to set boundaries with my time.",
      "fillBlank": {
        "text": "I am learning to _____ with my time. (Meaning: to make clear limits about what you can accept or do.)",
        "options": [
          "wellness",
          "self-care",
          "unwind",
          "set boundaries"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "regimen",
      "def": "a routine plan, often for health or fitness",
      "ex": "He follows a strict workout regimen to stay fit.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "hydration",
      "def": "having enough water in your body",
      "ex": "Good hydration is essential for athletes.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "moderation",
      "def": "not too much or too little",
      "ex": "It is okay to eat dessert in moderation.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "nourish",
      "def": "to give your body the food and care it needs",
      "ex": "Eating fruits and vegetables helps nourish your body.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "recreational",
      "def": "related to fun or relaxing activities",
      "ex": "The park offers many recreational activities for families.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "restore",
      "def": "to bring back to good condition",
      "ex": "A good night's sleep will restore your energy.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "mindful",
      "def": "aware and present in the moment",
      "ex": "Try to be mindful of how much sugar you eat.",
      "topics": [
        "health",
        "soft-skills"
      ]
    },
    {
      "term": "relax",
      "def": "to rest and become calm",
      "ex": "I like to relax with a good book after work.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "balance",
      "def": "having the right amount of different things",
      "ex": "A good balance of work and rest keeps you healthy.",
      "topics": [
        "health",
        "soft-skills"
      ]
    },
    {
      "term": "take a break",
      "def": "to stop an activity for a short rest",
      "ex": "I need to take a break after work.",
      "pos": "verb phrase",
      "topics": [
        "health",
        "soft-skills"
      ]
    }
  ]
},
  "may-19-21": {
  "topic": "Food, Remedies, and Recovery",
  "words": [
    {
      "term": "processed",
      "pos": "adjective",
      "def": "changed during preparation or manufacturing, for example by cooking, freezing, or adding ingredients",
      "ex": "The class compared labels on different processed foods.",
      "fillBlank": {
        "text": "The class compared labels on different _____ foods. (Meaning: changed during preparation or manufacturing, for example by cooking, freezing, or adding ingredients.)",
        "options": [
          "processed",
          "home remedy",
          "relieve",
          "recover your energy"
        ]
      }
    },
    {
      "term": "home remedy",
      "def": "something people use at home to try to feel better",
      "ex": "My aunt told me about a home remedy for a cough.",
      "pos": "noun",
      "topics": [
        "health"
      ],
      "fillBlank": {
        "text": "My aunt told me about a _____ for a cough. (Meaning: something people use at home to try to feel better.)",
        "options": [
          "processed",
          "relieve",
          "recover your energy",
          "home remedy"
        ]
      }
    },
    {
      "term": "relieve",
      "pos": "verb",
      "def": "to make pain, discomfort, or worry less severe",
      "ex": "I asked what might relieve the discomfort.",
      "fillBlank": {
        "text": "I asked what might _____ the discomfort. (Meaning: to make pain, discomfort, or worry less severe.)",
        "options": [
          "home remedy",
          "recover your energy",
          "relieve",
          "processed"
        ]
      }
    },
    {
      "term": "recover your energy",
      "pos": "verb phrase",
      "def": "to regain strength or feel less tired",
      "ex": "What helps you recover your energy after a busy week?",
      "fillBlank": {
        "text": "After a tiring week, what helps you _____? (Meaning: to regain strength or feel less tired.)",
        "options": [
          "relieve",
          "recover your energy",
          "processed",
          "home remedy"
        ]
      }
    },
    {
      "term": "fluids",
      "pos": "noun",
      "def": "liquids, including drinks such as water, tea, or broth",
      "ex": "The nurse asked whether I had been drinking enough fluids.",
      "fillBlank": {
        "text": "The nurse asked whether I had been drinking enough _____. (Meaning: liquids, including drinks such as water, tea, or broth.)",
        "options": [
          "fluids",
          "processed",
          "home remedy",
          "relieve"
        ]
      }
    },
    {
      "term": "wear off",
      "pos": "verb phrase",
      "def": "to gradually stop having an effect",
      "ex": "I asked the pharmacist when the effect might wear off.",
      "fillBlank": {
        "text": "I asked the pharmacist when the effect might _____. (Meaning: to gradually stop having an effect.)",
        "options": [
          "processed",
          "home remedy",
          "relieve",
          "wear off"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "packaged",
      "def": "put in a container or box",
      "ex": "The cookies are packaged in a plastic box.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "preserved",
      "def": "kept fresh for a long time",
      "ex": "Salt was used to keep the meat preserved for the winter.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "required",
      "def": "needed, must be done",
      "ex": "A helmet is required when riding a motorcycle.",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "listed",
      "def": "written down in order",
      "ex": "The ingredients are listed on the back of the package.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "measured",
      "def": "checked the amount or size",
      "ex": "She carefully measured the flour for the cake.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "detox",
      "def": "to remove harmful or addictive substances from the body",
      "ex": "He went on a detox diet to clean his system.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "remedy",
      "def": "something you do or take at home to feel better",
      "ex": "Honey and lemon is a good home remedy for a sore throat.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "soothe",
      "def": "to calm or comfort (e.g. a sore throat)",
      "ex": "Warm milk can soothe an upset stomach.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "ailment",
      "def": "a minor illness or discomfort (e.g. cold, headache)",
      "ex": "Ginger tea is good for a stomach ailment.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "rest",
      "def": "to stop working or being active for a while",
      "ex": "I want to rest after my shift.",
      "pos": "verb",
      "topics": [
        "health"
      ]
    },
    {
      "term": "sore throat",
      "def": "pain or irritation in your throat",
      "ex": "I have a sore throat and a cough.",
      "pos": "noun",
      "topics": [
        "health"
      ]
    }
  ]
},
  "may-26-28": {
  "topic": "Reflecting on Progress",
  "words": [
    {
      "term": "make progress",
      "pos": "verb phrase",
      "def": "to improve or move closer to a goal",
      "ex": "I make progress when I practice regularly.",
      "fillBlank": {
        "text": "I _____ when I practice regularly. (Meaning: to improve or move closer to a goal.)",
        "options": [
          "make progress",
          "overcome a challenge",
          "take pride in",
          "look back"
        ]
      }
    },
    {
      "term": "overcome a challenge",
      "pos": "verb phrase",
      "def": "to successfully deal with something difficult",
      "ex": "Support from classmates can help you overcome a challenge.",
      "fillBlank": {
        "text": "Support from classmates can help you _____. (Meaning: to successfully deal with something difficult.)",
        "options": [
          "make progress",
          "milestone",
          "accomplish",
          "overcome a challenge"
        ]
      }
    },
    {
      "term": "milestone",
      "pos": "noun",
      "def": "an important point or achievement in a process",
      "ex": "Finishing this course will be a milestone for me.",
      "fillBlank": {
        "text": "Finishing this course will be a _____ for me. (Meaning: an important point or achievement in a process.)",
        "options": [
          "take pride in",
          "look back",
          "milestone",
          "overcome a challenge"
        ]
      }
    },
    {
      "term": "accomplish",
      "def": "to finish something successfully",
      "ex": "She accomplished her goal of running a 5K.",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "I hope to _____ my goal of completing the training. (Meaning: to finish something successfully.)",
        "options": [
          "look back",
          "accomplish",
          "overcome a challenge",
          "take pride in"
        ]
      }
    },
    {
      "term": "take pride in",
      "pos": "verb phrase",
      "def": "to feel pleased about something you do or achieve",
      "ex": "I take pride in the progress I have made.",
      "fillBlank": {
        "text": "I _____ the progress I have made. (Meaning: to feel pleased about something you do or achieve.)",
        "options": [
          "take pride in",
          "make progress",
          "overcome a challenge",
          "milestone"
        ]
      }
    },
    {
      "term": "look back",
      "def": "to think about something that happened before",
      "ex": "When I look back, I can see my progress.",
      "pos": "phrasal verb",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "When I _____, I can see my progress. (Meaning: to think about something that happened before.)",
        "options": [
          "make progress",
          "overcome a challenge",
          "milestone",
          "look back"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "nerves",
      "def": "feelings of stress or anxiety; or fibers that carry signals in the body",
      "ex": "She checked her nerves before the big speech.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "mind",
      "def": "the part that thinks, feels, and remembers; your thoughts",
      "ex": "Keep an open mind when listening to new ideas.",
      "topics": [
        "health",
        "soft-skills"
      ]
    },
    {
      "term": "cycle",
      "def": "a repeating pattern (e.g. weekly habits)",
      "ex": "The life cycle of a butterfly is fascinating.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "outcome",
      "def": "the result of something",
      "ex": "We are waiting for the outcome of the election.",
      "topics": [
        "civic-life"
      ]
    },
    {
      "term": "keep",
      "def": "to continue doing something",
      "ex": "Please keep the door closed."
    },
    {
      "term": "sustain",
      "def": "to keep something going over time",
      "ex": "It is hard to sustain high energy all day.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "reflection",
      "def": "thinking about your experience",
      "ex": "Quiet reflection helps me solve problems.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "progress",
      "def": "improvement over time",
      "ex": "You are making good progress in your English class.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "challenge",
      "def": "something difficult",
      "ex": "Learning a new language is a big challenge.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "success",
      "def": "achieving your goal",
      "ex": "Hard work is the key to success.",
      "topics": [
        "soft-skills"
      ]
    },
    {
      "term": "proud",
      "def": "feeling good about achievement",
      "ex": "I am very proud of my son for graduating.",
      "topics": [
        "soft-skills"
      ]
    }
  ]
},
  "jun-2-4": {
  "topic": "Next Steps",
  "words": [
    {
      "term": "set a goal",
      "pos": "verb phrase",
      "def": "to decide on something you want to achieve",
      "ex": "I want to set a goal for my next English class.",
      "fillBlank": {
        "text": "I want to _____ for my next English class. (Meaning: to decide on something you want to achieve.)",
        "options": [
          "set a goal",
          "achievement",
          "growth",
          "confident"
        ]
      }
    },
    {
      "term": "achievement",
      "def": "something you did well or completed",
      "ex": "Winning the award was a great achievement.",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Winning the award was a great _____. (Meaning: something you did well or completed.)",
        "options": [
          "set a goal",
          "confident",
          "commitment",
          "achievement"
        ]
      }
    },
    {
      "term": "growth",
      "def": "getting better over time",
      "ex": "This job offers many opportunities for personal growth.",
      "topics": [
        "career-on-the-job",
        "soft-skills"
      ],
      "fillBlank": {
        "text": "This job offers many opportunities for personal _____. (Meaning: getting better over time.)",
        "options": [
          "confident",
          "commitment",
          "growth",
          "set a goal"
        ]
      }
    },
    {
      "term": "confident",
      "def": "feeling sure of yourself",
      "ex": "She feels confident that she will pass the exam.",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "She feels _____ that she will pass the exam. (Meaning: feeling sure of yourself.)",
        "options": [
          "growth",
          "confident",
          "set a goal",
          "achievement"
        ]
      }
    },
    {
      "term": "commitment",
      "def": "a promise to keep doing something",
      "ex": "Learning English takes real commitment and practice.",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "Learning English takes real _____ and practice. (Meaning: a promise to keep doing something.)",
        "options": [
          "commitment",
          "set a goal",
          "achievement",
          "growth"
        ]
      }
    },
    {
      "term": "appreciate",
      "def": "to be thankful for something",
      "ex": "I appreciate all the help my teacher gave me this year.",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I _____ all the help my teacher gave me this year. (Meaning: to be thankful for something.)",
        "options": [
          "set a goal",
          "achievement",
          "growth",
          "appreciate"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "next steps",
      "def": "what you will do after this",
      "ex": "Let's discuss the next steps for the project."
    },
    {
      "term": "plan",
      "def": "a way to reach a goal",
      "ex": "Do you have a plan for the weekend?"
    },
    {
      "term": "resource",
      "def": "something that helps you (book, website, person)",
      "ex": "The library is a great resource for information."
    },
    {
      "term": "community",
      "def": "a group of people in one place",
      "ex": "It is important to be involved in your local community.",
      "topics": [
        "civic-life"
      ]
    },
    {
      "term": "review",
      "def": "to look back and think about",
      "ex": "Let's review the material before the test."
    },
    {
      "term": "continue",
      "def": "to keep doing something",
      "ex": "Please continue working until 5:00 PM."
    },
    {
      "term": "goal",
      "def": "something you want to achieve",
      "ex": "My goal is to save enough money for a car.",
      "topics": [
        "soft-skills"
      ],
      "fillBlank": {
        "text": "My _____ is to save enough money to buy a car next year.",
        "options": [
          "goal",
          "achievement",
          "growth",
          "commitment"
        ]
      }
    }
  ]
},
  "dec-groceries": {
  "topic": "Grocery Shopping: Quantity, Value, and Waste",
  "words": [
    {
      "term": "run out of",
      "pos": "verb phrase",
      "def": "to use all of something so that none is left",
      "ex": "We often run out of coffee before Friday.",
      "fillBlank": {
        "text": "We often _____ coffee before Friday. (Meaning: to use all of something so that none is left.)",
        "options": [
          "run out of",
          "stock up on",
          "buy in bulk",
          "unit price"
        ]
      }
    },
    {
      "term": "stock up on",
      "pos": "verb phrase",
      "def": "to buy extra supplies to use later",
      "ex": "I stock up on rice when it is on sale.",
      "fillBlank": {
        "text": "I _____ rice when it is on sale. (Meaning: to buy extra supplies to use later.)",
        "options": [
          "run out of",
          "buy in bulk",
          "unit price",
          "stock up on"
        ]
      }
    },
    {
      "term": "buy in bulk",
      "pos": "verb phrase",
      "def": "to buy a large amount of something at one time",
      "ex": "Is it cheaper to buy in bulk?",
      "fillBlank": {
        "text": "Is it cheaper to _____? (Meaning: to buy a large amount of something at one time.)",
        "options": [
          "stock up on",
          "unit price",
          "buy in bulk",
          "run out of"
        ]
      }
    },
    {
      "term": "unit price",
      "pos": "noun phrase",
      "def": "the cost for one standard amount, such as one ounce or one pound",
      "ex": "Compare the unit price before choosing a package.",
      "fillBlank": {
        "text": "Compare the _____ before choosing a package. (Meaning: the cost for one standard amount, such as one ounce or one pound.)",
        "options": [
          "buy in bulk",
          "unit price",
          "run out of",
          "stock up on"
        ]
      }
    },
    {
      "term": "serving size",
      "pos": "noun phrase",
      "def": "the amount of food counted as one serving on a label",
      "ex": "The serving size on this label is one cup.",
      "fillBlank": {
        "text": "The _____ on this label is one cup. (Meaning: the amount of food counted as one serving on a label.)",
        "options": [
          "serving size",
          "run out of",
          "stock up on",
          "buy in bulk"
        ]
      }
    },
    {
      "term": "go bad",
      "pos": "verb phrase",
      "def": "to spoil and no longer be good to eat",
      "ex": "How much food will go bad if we buy too much?",
      "fillBlank": {
        "text": "How much food will _____ if we buy too much? (Meaning: to spoil and no longer be good to eat.)",
        "options": [
          "run out of",
          "stock up on",
          "buy in bulk",
          "go bad"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "rice",
      "def": "small grains cooked and eaten as food",
      "ex": "How much rice do we need?",
      "pos": "noun"
    },
    {
      "term": "bread",
      "def": "food made from flour and baked",
      "ex": "We need a loaf of bread.",
      "pos": "noun"
    },
    {
      "term": "milk",
      "def": "a white drink often sold in a carton or bottle",
      "ex": "How much milk is left?",
      "pos": "noun"
    },
    {
      "term": "eggs",
      "def": "foods with shells that are often cooked for breakfast",
      "ex": "How many eggs should I buy?",
      "pos": "noun"
    },
    {
      "term": "vegetables",
      "def": "plants or parts of plants eaten as food",
      "ex": "I need some vegetables for dinner.",
      "pos": "noun"
    },
    {
      "term": "fruit",
      "def": "food such as apples, oranges, and bananas",
      "ex": "Let’s buy some fruit for snacks.",
      "pos": "noun"
    }
  ]
},
  "dec-fall-review": {
  "topic": "Fall Review: Six Useful Words and Phrases",
  "words": [
    {
      "term": "reschedule",
      "def": "to change a planned event to a different time",
      "ex": "I need to reschedule my appointment.",
      "pos": "verb",
      "topics": [
        "communication"
      ],
      "fillBlank": {
        "text": "I need to _____ my appointment. (Meaning: to change a planned event to a different time.)",
        "options": [
          "reschedule",
          "raise a concern",
          "set aside",
          "volunteer"
        ]
      }
    },
    {
      "term": "raise a concern",
      "pos": "verb phrase",
      "def": "to tell others about something you think may be a problem",
      "ex": "I would like to raise a concern about the bus schedule.",
      "fillBlank": {
        "text": "I want to _____ about the broken lights before someone gets hurt. (Meaning: to tell others about something you think may be a problem.)",
        "options": [
          "reschedule",
          "set aside",
          "volunteer",
          "raise a concern"
        ]
      }
    },
    {
      "term": "set aside",
      "pos": "verb phrase",
      "def": "to keep money, time, or something else for a particular purpose",
      "ex": "I set aside a little money each payday.",
      "fillBlank": {
        "text": "I _____ a little money each payday. (Meaning: to keep money, time, or something else for a particular purpose.)",
        "options": [
          "raise a concern",
          "volunteer",
          "set aside",
          "reschedule"
        ]
      }
    },
    {
      "term": "volunteer",
      "def": "to offer to do something without being paid",
      "ex": "She volunteers at the food bank every Saturday.",
      "topics": [
        "civic-life"
      ],
      "fillBlank": {
        "text": "I _____ at the food bank without being paid. (Meaning: to offer to do something without being paid.)",
        "options": [
          "set aside",
          "volunteer",
          "reschedule",
          "raise a concern"
        ]
      }
    },
    {
      "term": "budget",
      "def": "to plan how much money to spend",
      "ex": "Budget your money so you can pay all your bills.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "_____ your money so you can pay all your bills. (Meaning: to plan how much money to spend.)",
        "options": [
          "budget",
          "reschedule",
          "raise a concern",
          "set aside"
        ]
      }
    },
    {
      "term": "unit price",
      "pos": "noun phrase",
      "def": "the cost for one standard amount, such as one ounce or one pound",
      "ex": "Compare the unit price before choosing a package.",
      "fillBlank": {
        "text": "Compare the _____ before choosing a package. (Meaning: the cost for one standard amount, such as one ounce or one pound.)",
        "options": [
          "reschedule",
          "raise a concern",
          "set aside",
          "unit price"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "introduce",
      "def": "to present yourself or another person for the first time",
      "ex": "Please introduce yourself to the class.",
      "fillBlank": {
        "text": "On the first day, please _____ yourself to the class.",
        "options": [
          "introduce",
          "greet",
          "share",
          "prefer"
        ]
      }
    },
    {
      "term": "focus",
      "pos": "verb",
      "def": "to give your attention to one thing",
      "ex": "Focus on one sentence at a time.",
      "fillBlank": {
        "text": "Put other work away and _____ on this one sentence.",
        "options": [
          "notice",
          "focus",
          "correct",
          "compare"
        ]
      },
      "quizDistractors": [
        "correct",
        "remember"
      ]
    },
    {
      "term": "leave",
      "def": "to go away from a place",
      "ex": "What time does the bus leave?",
      "pos": "verb",
      "topics": [
        "transportation"
      ]
    },
    {
      "term": "compare",
      "def": "to look at two or more things to find differences",
      "ex": "Always compare prices before you buy.",
      "topics": [
        "money"
      ],
      "fillBlank": {
        "text": "Always _____ prices at two stores before you buy.",
        "options": [
          "calculate",
          "compare",
          "budget",
          "purchase"
        ]
      }
    }
  ]
},
  "apr-w30-review": {
  "topic": "Doctor Follow-Up: Six-Item Review",
  "words": [
    {
      "term": "persistent",
      "pos": "adjective",
      "def": "continuing for a long time or repeatedly returning",
      "ex": "I want to ask the clinic about this persistent cough.",
      "fillBlank": {
        "text": "I want to ask the clinic about this _____ cough. (Meaning: continuing for a long time or repeatedly returning.)",
        "options": [
          "persistent",
          "follow-up appointment",
          "recover from",
          "cut back on"
        ]
      }
    },
    {
      "term": "follow-up appointment",
      "pos": "noun phrase",
      "def": "a later visit to check progress or discuss what happens next",
      "ex": "When is my follow-up appointment?",
      "fillBlank": {
        "text": "When is my _____? (Meaning: a later visit to check progress or discuss what happens next.)",
        "options": [
          "persistent",
          "recover from",
          "cut back on",
          "follow-up appointment"
        ]
      }
    },
    {
      "term": "recover from",
      "pos": "verb phrase",
      "def": "to get better after an illness, injury, or difficult experience",
      "ex": "It took me several weeks to recover from the surgery.",
      "fillBlank": {
        "text": "It took me several weeks to _____ the surgery. (Meaning: to get better after an illness, injury, or difficult experience.)",
        "options": [
          "follow-up appointment",
          "cut back on",
          "recover from",
          "persistent"
        ]
      }
    },
    {
      "term": "cut back on",
      "pos": "verb phrase",
      "def": "to reduce how much you use, do, or consume",
      "ex": "I am trying to cut back on soda.",
      "fillBlank": {
        "text": "I am trying to _____ soda. (Meaning: to reduce how much you use, do, or consume.)",
        "options": [
          "recover from",
          "cut back on",
          "persistent",
          "follow-up appointment"
        ]
      }
    },
    {
      "term": "prevent",
      "pos": "verb",
      "def": "to stop something from happening",
      "ex": "What steps can help prevent this problem from happening again?",
      "fillBlank": {
        "text": "What steps can help _____ this problem from happening again? (Meaning: to stop something from happening.)",
        "options": [
          "prevent",
          "persistent",
          "follow-up appointment",
          "recover from"
        ]
      }
    },
    {
      "term": "adjust to",
      "pos": "verb phrase",
      "def": "to become used to a new situation or change",
      "ex": "It takes time to adjust to a new routine.",
      "fillBlank": {
        "text": "It takes time to _____ a new routine. (Meaning: to become used to a new situation or change.)",
        "options": [
          "persistent",
          "follow-up appointment",
          "recover from",
          "adjust to"
        ]
      }
    }
  ],
  "bonusWords": [
    {
      "term": "recover",
      "def": "to get better after being sick",
      "ex": "It took him a few weeks to fully recover from the surgery.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "improve",
      "def": "to get better, to make progress",
      "ex": "Rest and fluids will help you improve quickly.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "exercise",
      "def": "to do physical activity to stay healthy",
      "ex": "You should exercise for at least 30 minutes every day.",
      "topics": [
        "health"
      ]
    },
    {
      "term": "routine",
      "def": "the things you usually do each day",
      "ex": "I want to change my evening routine.",
      "pos": "noun",
      "topics": [
        "health"
      ]
    },
    {
      "term": "adjust",
      "def": "to change to fit a new situation",
      "ex": "It takes time to adjust to a new medication.",
      "topics": [
        "health"
      ]
    }
  ]
},
};

module.exports = { weeklyVocabData };
