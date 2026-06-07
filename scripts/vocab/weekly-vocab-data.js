/**
 * Weekly vocabulary words for Cycle 1 (Sep–Jan) and Cycle 2 (Feb–Jun).
 * Target cadence: 6 words per week year-round (curated for real-world frequency).
 * Cycle 2 weeks currently still hold 12 words each — to be trimmed to 6 in a future pass.
 *
 * Each word may carry a `topics: string[]` array used to populate VocabCard.topics
 * during seed. The topical vocab library reads these to group words across weeks.
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
    topic: "Start the Class: Digital Habits",
    words: [
      { term: "log in",    def: "to enter your username and password to access a website or app",       ex: "Please log in to the app every day to practice English.", topics: ["digital-skills"], fillBlank: { text: "Enter your username and password to _____ to the learning app.", options: ["access", "log in", "navigate", "submit"] } },
      { term: "navigate",  def: "to move around a website or app",                                      ex: "Use the menu at the top to navigate the website.", topics: ["digital-skills"], fillBlank: { text: "Use the menu at the top to _____ between pages on the website.", options: ["submit", "log in", "navigate", "complete"] } },
      { term: "submit",   def: "to send your work or information officially",                          ex: "Submit your answers before the timer runs out.", topics: ["digital-skills"], fillBlank: { text: "Click the button to _____ your homework before the deadline.", options: ["review", "submit", "access", "complete"] } },
      { term: "access",   def: "to open or enter a file, website, or building",                       ex: "You can access your lessons from any device.", topics: ["digital-skills"], fillBlank: { text: "You can _____ your lessons from your phone or computer.", options: ["log in", "access", "navigate", "submit"] } },
      { term: "complete", def: "to finish all parts of a task",                                       ex: "Try to complete at least one activity each day.", fillBlank: { text: "Try to _____ at least one vocabulary activity every day.", options: ["review", "complete", "submit", "access"] } },
      { term: "review",   def: "to look at something again to check or learn it better",              ex: "Review the words before the quiz on Friday.", fillBlank: { text: "Before the quiz on Friday, _____ the new words one more time.", options: ["complete", "review", "submit", "navigate"] } },
    ],
  },
  "sep-w2": {
    topic: "Parts of Speech: Key Verbs",
    words: [
      { term: "identify",   def: "to recognize and name something",                                   ex: "Can you identify the noun in this sentence?", fillBlank: { text: "Can you _____ the noun in this sentence: \"The book is on the table\"?", options: ["categorize", "identify", "spell", "translate"] } },
      { term: "categorize", def: "to put things into groups",                                         ex: "Categorize these words as nouns, verbs, or adjectives.", fillBlank: { text: "_____ these words into nouns, verbs, and adjectives.", options: ["identify", "categorize", "pronounce", "practice"] } },
      { term: "pronounce",  def: "to say a word out loud correctly",                                  ex: "Practice how to pronounce each new word.", fillBlank: { text: "Repeat after me and _____ each new word out loud.", options: ["spell", "pronounce", "translate", "practice"] } },
      { term: "spell",      def: "to write or say the letters of a word in order",                   ex: "Can you spell your last name for me, please?", fillBlank: { text: "G-A-R-C-I-A — please _____ your last name letter by letter.", options: ["pronounce", "spell", "practice", "identify"] } },
      { term: "translate",  def: "to change words from one language to another",                      ex: "I used my phone to translate that word into English.", fillBlank: { text: "I wrote a word in Spanish. Can you _____ it into English for the class?", options: ["identify", "translate", "spell", "categorize"] } },
      { term: "practice",   def: "to do something many times to improve",                             ex: "Practice speaking English every day to get better.", fillBlank: { text: "You will improve faster if you _____ speaking English every day.", options: ["pronounce", "practice", "identify", "translate"] } },
    ],
  },
  "sep-w3": {
    topic: "Verb Forms: Action Words",
    words: [
      { term: "explain",  def: "to make something clear by giving details",                          ex: "Can you explain how to use this form?", fillBlank: { text: "Can you _____ step by step how to fill out this form?", options: ["describe", "explain", "discuss", "record"] } },
      { term: "describe", def: "to say what something or someone is like",                           ex: "Describe your neighborhood to the class.", fillBlank: { text: "_____ your neighborhood. Is it quiet or busy?", options: ["explain", "describe", "discuss", "listen"] } },
      { term: "discuss",  def: "to talk about something with others",                                ex: "We will discuss the homework in class.", fillBlank: { text: "After we read the article, we will _____ it in small groups.", options: ["describe", "discuss", "explain", "repeat"] } },
      { term: "listen",   def: "to pay attention to sounds or someone speaking",                     ex: "Listen carefully and repeat the words you hear.", fillBlank: { text: "_____ carefully to the audio and write down what you hear.", options: ["repeat", "listen", "record", "discuss"] } },
      { term: "record",   def: "to save or write down information; to make an audio or video",       ex: "Record yourself reading the sentence aloud.", fillBlank: { text: "Use your phone to _____ yourself reading the sentence aloud.", options: ["repeat", "record", "listen", "explain"] } },
      { term: "repeat",   def: "to do or say something again",                                       ex: "Please repeat the word after me.", fillBlank: { text: "Please _____ the word after me: \"appointment.\"", options: ["listen", "repeat", "record", "describe"] } },
    ],
  },
  "sep-w4": {
    topic: "Life Experience: Personal Journey Verbs",
    words: [
      { term: "relocate",  def: "to move to a new city or country",                                  ex: "My family decided to relocate to the United States.", fillBlank: { text: "My family decided to _____ from Guatemala to Boston.", options: ["immigrate", "relocate", "introduce", "achieve"] } },
      { term: "introduce", def: "to present yourself or another person for the first time",           ex: "Please introduce yourself to the class.", fillBlank: { text: "On the first day, please _____ yourself to the class.", options: ["introduce", "motivate", "relocate", "achieve"] } },
      { term: "motivate",  def: "to give someone a reason to do something",                          ex: "My children motivate me to learn English every day.", fillBlank: { text: "My children _____ me to study English every evening.", options: ["achieve", "motivate", "overcome", "introduce"] } },
      { term: "achieve",   def: "to reach a goal through hard work",                                 ex: "With practice, you can achieve your language goals.", fillBlank: { text: "With hard work, you can _____ your goal of passing the test.", options: ["overcome", "achieve", "motivate", "immigrate"] } },
      { term: "overcome",  def: "to successfully deal with a challenge",                             ex: "She worked hard to overcome the language barrier.", fillBlank: { text: "She worked hard to _____ her fear of speaking in public.", options: ["achieve", "overcome", "motivate", "relocate"] } },
      { term: "immigrate", def: "to come to a new country to live there permanently",                ex: "He immigrated to the U.S. five years ago.", fillBlank: { text: "He _____ to the United States to live here permanently.", options: ["relocate", "immigrate", "introduce", "overcome"] } },
    ],
  },

  /** Unit 2 – Daily Life in the Community (October) */
  "oct-w1": {
    topic: "Community + Daily Routines: Schedule Verbs",
    words: [
      { term: "schedule", def: "to plan a time for something to happen",                             ex: "I need to schedule a doctor's appointment for next week.", topics: ["health"], fillBlank: { text: "I need to _____ a doctor's appointment for next Tuesday.", options: ["prepare", "schedule", "attend", "commute"] } },
      { term: "commute",  def: "to travel regularly between home and work or school",                ex: "She commutes by bus every morning.", topics: ["transportation", "career-on-the-job"], fillBlank: { text: "She _____ by bus from home to work every morning.", options: ["attend", "commute", "schedule", "balance"] } },
      { term: "prepare",  def: "to get ready for something",                                         ex: "Prepare your bag the night before class.", fillBlank: { text: "_____ your bag and homework the night before class.", options: ["schedule", "prepare", "attend", "exercise"] } },
      { term: "attend",   def: "to go to an event, class, or meeting",                               ex: "All students are expected to attend class on time.", fillBlank: { text: "All students must _____ class on time.", options: ["prepare", "attend", "schedule", "commute"] } },
      { term: "balance",  def: "to manage two or more things at the same time fairly",               ex: "It is hard to balance work, school, and family.", topics: ["soft-skills"], fillBlank: { text: "It is hard to _____ work, school, and family at the same time.", options: ["prepare", "balance", "exercise", "commute"] } },
      { term: "exercise", def: "to do physical activity to stay healthy",                            ex: "Try to exercise for at least 30 minutes a day.", topics: ["health"], fillBlank: { text: "Doctors say you should _____ for at least 30 minutes a day.", options: ["balance", "exercise", "prepare", "attend"] } },
    ],
  },
  "oct-w2": {
    topic: "Transportation + Directions: Movement Verbs",
    words: [
      { term: "depart",   def: "to leave a place",                                                   ex: "The bus departs from Main Street at 7:00 AM.", topics: ["transportation"], fillBlank: { text: "The 7:00 AM bus _____ from Main Street.", options: ["arrive", "depart", "transfer", "cross"] } },
      { term: "arrive",   def: "to reach a place",                                                   ex: "What time does the train arrive at the station?", topics: ["transportation"], fillBlank: { text: "What time does the train _____ at South Station?", options: ["depart", "arrive", "transfer", "locate"] } },
      { term: "transfer", def: "to change from one bus, train, or route to another",                 ex: "Transfer to the Red Line at Downtown Station.", topics: ["transportation"], fillBlank: { text: "_____ to the Red Line at Downtown Station.", options: ["follow", "transfer", "cross", "depart"] } },
      { term: "locate",   def: "to find the position of something",                                  ex: "Can you locate the nearest pharmacy on the map?", topics: ["transportation"], fillBlank: { text: "Can you _____ the nearest pharmacy on this map?", options: ["follow", "locate", "transfer", "cross"] } },
      { term: "follow",   def: "to go in the same direction; to use directions step by step",        ex: "Follow the signs to the emergency exit.", topics: ["transportation"], fillBlank: { text: "_____ the signs to the emergency exit.", options: ["cross", "follow", "locate", "transfer"] } },
      { term: "cross",    def: "to go from one side to the other",                                   ex: "Cross the street at the crosswalk when the light is green.", topics: ["transportation"], fillBlank: { text: "_____ the street only when the walk signal is green.", options: ["follow", "cross", "depart", "arrive"] } },
    ],
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
    topic: "Phone English + Family Connection: Communication Verbs",
    words: [
      { term: "contact",   def: "to reach someone by phone, email, or message",                     ex: "Contact the school if your child will be absent.", topics: ["communication"], fillBlank: { text: "_____ the school office if your child will be absent.", options: ["respond", "contact", "confirm", "connect"] } },
      { term: "respond",   def: "to answer or react to a message or question",                       ex: "Please respond to the email within 24 hours.", topics: ["communication"], fillBlank: { text: "Please _____ to the email within 24 hours.", options: ["contact", "respond", "confirm", "decline"] } },
      { term: "confirm",   def: "to say that something is definitely true or agreed upon",           ex: "Call to confirm your appointment the day before.", topics: ["communication"], fillBlank: { text: "Call the doctor's office to _____ your appointment for tomorrow.", options: ["postpone", "confirm", "decline", "respond"] } },
      { term: "decline",   def: "to politely say no to an offer or invitation",                      ex: "She had to decline the meeting because she was sick.", topics: ["communication"], fillBlank: { text: "She was sick, so she had to _____ the invitation to the meeting.", options: ["confirm", "decline", "postpone", "respond"] } },
      { term: "postpone",  def: "to move something to a later time",                                 ex: "We need to postpone the meeting until next week.", topics: ["communication"], fillBlank: { text: "We need to _____ the meeting until next week.", options: ["confirm", "postpone", "decline", "contact"] } },
      { term: "connect",   def: "to join or link with someone or something",                         ex: "I couldn't connect to the Wi-Fi at the library.", topics: ["communication", "digital-skills"], fillBlank: { text: "I couldn't _____ to the library Wi-Fi on my laptop.", options: ["contact", "connect", "respond", "confirm"] } },
    ],
  },

  /** Unit 3 – Community Participation (November) */
  "nov-w1": {
    topic: "Helping + Volunteering: Action Verbs",
    words: [
      { term: "volunteer",  def: "to offer to do something without being paid",                      ex: "She volunteers at the food bank every Saturday.", topics: ["civic-life"], fillBlank: { text: "She _____ at the food bank every Saturday without pay.", options: ["donate", "volunteer", "assist", "join"] } },
      { term: "assist",     def: "to help someone with a task",                                      ex: "Can you assist me with this form?", topics: ["civic-life", "soft-skills"], fillBlank: { text: "Can you _____ me with this registration form?", options: ["support", "assist", "contribute", "donate"] } },
      { term: "support",    def: "to help or encourage someone or a cause",                          ex: "Our community supports local families in need.", topics: ["civic-life"], fillBlank: { text: "Our neighborhood _____ families who need help with food and rent.", options: ["donate", "support", "volunteer", "contribute"] } },
      { term: "contribute",def: "to give time, money, or effort to help something",                  ex: "Everyone can contribute in a small way to make things better.", topics: ["civic-life"], fillBlank: { text: "Everyone can _____ time or money to help the community garden.", options: ["donate", "contribute", "support", "join"] } },
      { term: "donate",     def: "to give something (money, food, clothing) to help others",         ex: "We donate clothing to the shelter twice a year.", topics: ["civic-life"], fillBlank: { text: "We _____ winter coats to the shelter twice a year.", options: ["contribute", "donate", "volunteer", "assist"] } },
      { term: "join",       def: "to become a member of a group or start participating",             ex: "Would you like to join our community garden project?", topics: ["civic-life"], fillBlank: { text: "Would you like to _____ our community cleanup group?", options: ["volunteer", "join", "assist", "support"] } },
    ],
  },
  "nov-w2": {
    topic: "Public Meetings + Suggestions: Discussion Verbs",
    words: [
      { term: "participate", def: "to take part in an activity or event",                           ex: "Everyone is welcome to participate in the town meeting.", topics: ["civic-life"], fillBlank: { text: "Everyone is welcome to _____ in the town hall meeting.", options: ["suggest", "participate", "agree", "listen"] } },
      { term: "suggest",     def: "to offer an idea for others to consider",                         ex: "I'd like to suggest adding more bus routes to our area.", topics: ["civic-life", "communication"], fillBlank: { text: "I'd like to _____ adding a bus stop on Oak Street.", options: ["propose", "suggest", "recommend", "agree"] } },
      { term: "propose",     def: "to formally put forward an idea or plan",                         ex: "The committee will propose a new community garden.", topics: ["civic-life"], fillBlank: { text: "The committee will _____ a plan for a new park.", options: ["suggest", "propose", "recommend", "participate"] } },
      { term: "recommend",   def: "to advise that something is a good choice",                      ex: "The teacher recommended that we study for at least one hour.", topics: ["communication"], fillBlank: { text: "The teacher _____ that we study for at least one hour.", options: ["suggest", "recommend", "agree", "propose"] } },
      { term: "agree",       def: "to have the same opinion or say yes to something",                ex: "Most people at the meeting agreed with the new plan.", topics: ["communication"], fillBlank: { text: "Most neighbors _____ with the plan to fix the streetlights.", options: ["recommend", "agree", "suggest", "listen"] } },
      { term: "listen",      def: "to pay attention to what someone is saying",                     ex: "Good leaders listen to the concerns of their community.", topics: ["communication", "soft-skills"], fillBlank: { text: "Good leaders _____ to people's concerns before making decisions.", options: ["agree", "listen", "participate", "recommend"] } },
    ],
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
    topic: "Smart Spending + Big Numbers: Money Verbs",
    words: [
      { term: "purchase",  def: "to buy something",                                                 ex: "Think carefully before you purchase anything online.", topics: ["money"], fillBlank: { text: "Think carefully before you _____ something online.", options: ["spend", "purchase", "save", "budget"] } },
      { term: "compare",   def: "to look at two or more things to find differences",                ex: "Always compare prices before you buy.", topics: ["money"], fillBlank: { text: "Always _____ prices at two stores before you buy.", options: ["calculate", "compare", "budget", "purchase"] } },
      { term: "budget",    def: "to plan how much money to spend",                                   ex: "Budget your money so you can pay all your bills.", topics: ["money"], fillBlank: { text: "_____ your money so you can pay rent and all your bills.", options: ["save", "budget", "spend", "calculate"] } },
      { term: "save",      def: "to keep money so you can use it later",                             ex: "Try to save at least 10% of your income each month.", topics: ["money"], fillBlank: { text: "Try to _____ at least 10% of your paycheck each month.", options: ["spend", "save", "budget", "purchase"] } },
      { term: "spend",     def: "to use money to pay for things",                                   ex: "Don't spend more than you earn.", topics: ["money"], fillBlank: { text: "Don't _____ more money than you earn.", options: ["save", "spend", "purchase", "budget"] } },
      { term: "calculate",def: "to use math to find an answer",                                     ex: "Calculate the total cost before you decide to buy.", topics: ["money"], fillBlank: { text: "_____ the total cost, including tax, before you pay.", options: ["compare", "calculate", "budget", "purchase"] } },
    ],
  },
  "dec-w2": {
    topic: "Bills, Returns + Scams: Financial Action Verbs",
    words: [
      { term: "exchange",  def: "to return one item and get a different one",                        ex: "I want to exchange this shirt for a larger size.", topics: ["money"], fillBlank: { text: "This shirt is too small. I want to _____ it for a larger size.", options: ["refund", "exchange", "deposit", "withdraw"] } },
      { term: "refund",    def: "to get your money back after returning something",                  ex: "The store gave me a full refund for the broken item.", topics: ["money"], fillBlank: { text: "The store agreed to _____ my money for the broken item.", options: ["exchange", "refund", "charge", "dispute"] } },
      { term: "withdraw",  def: "to take money out of a bank account",                              ex: "I need to withdraw cash from the ATM.", topics: ["money"], fillBlank: { text: "I need to _____ cash from the ATM.", options: ["deposit", "withdraw", "charge", "refund"] } },
      { term: "deposit",   def: "to put money into a bank account",                                 ex: "Deposit your check before the end of the business day.", topics: ["money"], fillBlank: { text: "_____ your paycheck into your bank account on payday.", options: ["withdraw", "deposit", "charge", "exchange"] } },
      { term: "charge",    def: "to ask for payment; to add to a credit card bill",                 ex: "The store will charge your card when the item ships.", topics: ["money"], fillBlank: { text: "The online store will _____ your credit card when the order ships.", options: ["refund", "charge", "deposit", "dispute"] } },
      { term: "dispute",   def: "to say that something is wrong and ask for a correction",          ex: "If there is an error on your bill, call to dispute it.", topics: ["money", "communication"], fillBlank: { text: "If your bill is wrong, call the bank to _____ the charge.", options: ["charge", "dispute", "refund", "exchange"] } },
    ],
  },

  /** Unit 5 – Housing (January) */
  "jan-w1": {
    topic: "Housing Basics: Renter Verbs",
    words: [
      { term: "rent",     def: "to pay money to use something (an apartment, a car) that belongs to someone else", ex: "We rent our apartment for $1,200 a month.", topics: ["housing"], fillBlank: { text: "We _____ our apartment for $1,200 per month.", options: ["lease", "rent", "occupy", "move"] } },
      { term: "lease",    def: "to sign an agreement to use property for a set time",               ex: "We signed a 12-month lease for the apartment.", topics: ["housing"], fillBlank: { text: "We _____ the apartment for one year.", options: ["rent", "lease", "apply", "occupy"] } },
      { term: "occupy",   def: "to live in or use a space",                                         ex: "How many people will occupy this apartment?", topics: ["housing"], fillBlank: { text: "How many people will _____ this two-bedroom apartment?", options: ["rent", "occupy", "move", "qualify"] } },
      { term: "move",     def: "to go to live in a different place",                                 ex: "We plan to move to a bigger apartment next month.", topics: ["housing"], fillBlank: { text: "We plan to _____ to a bigger apartment next month.", options: ["occupy", "move", "rent", "apply"] } },
      { term: "qualify",  def: "to meet the requirements needed for something",                     ex: "Do I qualify for the low-income housing program?", topics: ["housing"], fillBlank: { text: "Do I _____ for the low-income housing program?", options: ["apply", "qualify", "rent", "lease"] } },
      { term: "apply",    def: "to formally request something (a job, an apartment, a program)",   ex: "You need to apply online for that apartment.", topics: ["housing", "career-job-search"], fillBlank: { text: "You need to _____ online to be considered for that apartment.", options: ["qualify", "apply", "lease", "move"] } },
    ],
  },
  "jan-w2": {
    topic: "Comparing Housing Options: Decision Verbs",
    words: [
      { term: "compare",   def: "to look at two or more things to find differences",                ex: "Compare the rent and size of each apartment.", topics: ["housing"], fillBlank: { text: "_____ the rent and size of each apartment on your list.", options: ["evaluate", "compare", "select", "afford"] } },
      { term: "afford",    def: "to have enough money to pay for something",                        ex: "I can't afford an apartment in that area.", topics: ["housing", "money"], fillBlank: { text: "I can't _____ an apartment in that expensive neighborhood.", options: ["compare", "afford", "select", "own"] } },
      { term: "evaluate",  def: "to study all parts of something to judge its quality or value",   ex: "Evaluate the location, price, and size before deciding.", topics: ["housing"], fillBlank: { text: "_____ the location, price, and size before you decide.", options: ["compare", "evaluate", "select", "negotiate"] } },
      { term: "select",    def: "to choose something from a group of options",                      ex: "We will select an apartment by the end of the week.", topics: ["housing"], fillBlank: { text: "We will _____ an apartment by the end of the week.", options: ["evaluate", "select", "negotiate", "compare"] } },
      { term: "negotiate", def: "to talk with someone to reach an agreement",                       ex: "You can negotiate the rent with the landlord.", topics: ["housing", "communication"], fillBlank: { text: "You can _____ the rent with the landlord before you sign.", options: ["select", "negotiate", "afford", "own"] } },
      { term: "own",       def: "to have something as your legal property",                         ex: "Someday I hope to own my own home.", topics: ["housing"], fillBlank: { text: "Someday I hope to _____ my own home instead of renting.", options: ["afford", "own", "select", "negotiate"] } },
    ],
  },
  "jan-w3": {
    topic: "Landlord Calls + Repair Requests: Maintenance Verbs",
    words: [
      { term: "request",  def: "to politely ask for something officially",                          ex: "I need to request a repair for the broken heater.", topics: ["housing", "communication"], fillBlank: { text: "I need to _____ a repair for the broken heater.", options: ["report", "request", "inspect", "repair"] } },
      { term: "report",   def: "to tell someone in authority about a problem",                      ex: "Report any leaks or damage to your landlord right away.", topics: ["housing"], fillBlank: { text: "_____ any water damage to your landlord right away.", options: ["request", "report", "inspect", "repair"] } },
      { term: "inspect",  def: "to look at something carefully to check its condition",             ex: "The landlord will inspect the apartment next Monday.", topics: ["housing"], fillBlank: { text: "The landlord will _____ the apartment on Monday.", options: ["repair", "inspect", "report", "request"] } },
      { term: "repair",   def: "to fix something that is broken or damaged",                        ex: "The landlord must repair the broken window within 24 hours.", topics: ["housing"], fillBlank: { text: "The landlord must _____ the broken window within 24 hours.", options: ["inspect", "repair", "report", "request"] } },
      { term: "leak",     def: "(of liquid) to drip or flow through a crack or hole",               ex: "The ceiling is leaking after the heavy rain.", topics: ["housing"], fillBlank: { text: "Water is _____ from the ceiling after the heavy rain.", options: ["clog", "leak", "repair", "inspect"] } },
      { term: "clog",     def: "to block a pipe so water cannot flow",                              ex: "The kitchen sink is clogged and the water won't drain.", topics: ["housing"], fillBlank: { text: "The kitchen sink is _____ and the water won't drain.", options: ["leak", "clog", "repair", "inspect"] } },
    ],
  },
  "jan-w4": {
    topic: "Housing Problems + Solutions: Resolution Verbs",
    words: [
      { term: "resolve",     def: "to find a solution and fix a problem",                           ex: "The landlord promised to resolve the heating issue today.", topics: ["housing"], fillBlank: { text: "The landlord promised to _____ the heating problem today.", options: ["maintain", "resolve", "prevent", "document"] } },
      { term: "maintain",    def: "to keep something in good condition",                             ex: "Tenants must maintain a clean and safe apartment.", topics: ["housing"], fillBlank: { text: "Tenants must _____ a clean and safe apartment.", options: ["prevent", "maintain", "resolve", "notify"] } },
      { term: "notify",      def: "to officially tell someone about something",                      ex: "Notify your landlord in writing if you plan to move out.", topics: ["housing", "communication"], fillBlank: { text: "_____ your landlord in writing if you plan to move out.", options: ["document", "notify", "maintain", "reimburse"] } },
      { term: "document",    def: "to write down or photograph something as a record",              ex: "Document the damage with photos before the landlord visits.", topics: ["housing"], fillBlank: { text: "_____ the damage with photos before the landlord visits.", options: ["notify", "document", "maintain", "resolve"] } },
      { term: "prevent",     def: "to stop something bad from happening",                           ex: "Regular cleaning can prevent mold in the bathroom.", topics: ["housing"], fillBlank: { text: "Regular cleaning can _____ mold in the bathroom.", options: ["resolve", "prevent", "maintain", "document"] } },
      { term: "reimburse",   def: "to pay someone back for money they spent",                       ex: "The landlord agreed to reimburse us for the plumber's cost.", topics: ["housing", "money"], fillBlank: { text: "The landlord agreed to _____ us for the plumber's bill.", options: ["document", "reimburse", "notify", "resolve"] } },
    ],
  },

  // ── CYCLE 2: Units 6–10 (Feb–Jun) ─ 12 words per week ────────────────────
  "feb-3-5": {
    topic: "Jobs: Foundations",
    words: [
      { term: "schedule", def: "your plan for the day or week", ex: "My work schedule changes every week.", topics: ["career-on-the-job"], fillBlank: { text: "Check the _____ to see which days you work next week.", options: ["break", "schedule", "team", "time off"] } },
      { term: "break", def: "a short rest from work", ex: "We take a 15-minute break at 10:00 AM.", topics: ["career-on-the-job"], fillBlank: { text: "We take a 15-minute _____ at 10:00 AM every day.", options: ["schedule", "break", "time off", "team"] } },
      { term: "time off", def: "days when you don't work (e.g. Saturday, Sunday, vacation)", ex: "I asked my boss for some time off to visit my family.", topics: ["career-on-the-job"], fillBlank: { text: "I asked my boss for some _____ to visit my family in Mexico.", options: ["break", "time off", "schedule", "team"] } },
      { term: "team", def: "the group of people you work with", ex: "Our sales team meets every Monday morning.", topics: ["career-on-the-job"], fillBlank: { text: "Our sales _____ meets every Monday morning to plan the week.", options: ["schedule", "team", "break", "flexible"] } },
      { term: "reliable", def: "dependable; you can count on this person", ex: "He is a reliable worker who always shows up on time.", topics: ["soft-skills", "career-job-search"], fillBlank: { text: "He is a _____ worker who always shows up on time.", options: ["flexible", "reliable", "team", "break"] } },
      { term: "flexible", def: "able to change, adjust to new situations", ex: "Can you be flexible with your hours next week?", topics: ["soft-skills", "career-on-the-job"], fillBlank: { text: "Can you be _____ with your hours next week? We need extra help on Saturday.", options: ["reliable", "flexible", "schedule", "team"] } },
    ],
    bonusWords: [
      { term: "environment", def: "the place or situation around you", ex: "We try to create a friendly and supportive work environment.", topics: ["career-on-the-job"] },
      { term: "role", def: "a job or position someone has", ex: "My role in the company is to help customers with their orders.", topics: ["career-on-the-job", "career-job-search"] },
      { term: "self-confidence", def: "belief in yourself", ex: "Learning new skills helped increase her self-confidence.", topics: ["soft-skills"] },
      { term: "enthusiasm", def: "strong excitement or interest", ex: "The new employee showed a lot of enthusiasm for the project.", topics: ["soft-skills"] },
      { term: "teamwork", def: "working well with others", ex: "Good teamwork helps us finish the job faster.", topics: ["soft-skills", "career-on-the-job"] },
      { term: "preferences", def: "things you like more than others", ex: "Please let us know your schedule preferences for next month.", topics: ["career-on-the-job"] },
    ],
  },
  "feb-10-12": {
    topic: "Cycle 1 Review + Workplace Phrasal Verbs",
    words: [
      { term: "clock in", def: "to arrive at work and record your start time", ex: "I always clock in when my shift starts.", topics: ["career-on-the-job"], fillBlank: { text: "I always _____ when my shift starts at 8:00 AM.", options: ["clock out", "clock in", "call out", "follow up"] } },
      { term: "clock out", def: "to leave work and record your end time", ex: "Please clock out when your shift ends.", topics: ["career-on-the-job"], fillBlank: { text: "Please _____ when your shift ends so payroll knows your hours.", options: ["clock in", "clock out", "call out", "shift"] } },
      { term: "call out", def: "to phone your job to say you will not work that day", ex: "I had to call out on Monday because my son was sick.", topics: ["career-on-the-job", "communication"], fillBlank: { text: "I had to _____ on Monday because my son was sick and I could not come to work.", options: ["clock in", "call out", "follow up", "clock out"] } },
      { term: "shift", def: "your scheduled hours of work", ex: "My shift is eight hours, and it changes every week.", topics: ["career-on-the-job"], fillBlank: { text: "My _____ is eight hours long, and it changes every week.", options: ["shift", "supervisor", "clock in", "call out"] } },
      { term: "supervisor", def: "the person who manages you at work", ex: "If you are sick, call your supervisor before your shift.", topics: ["career-on-the-job"], fillBlank: { text: "If you are sick, call your _____ before your shift starts.", options: ["supervisor", "shift", "follow up", "clock in"] } },
      { term: "follow up", def: "to check in later about something", ex: "I will follow up with an email after our meeting.", topics: ["career-on-the-job", "communication"], fillBlank: { text: "I will _____ with an email after our meeting to confirm the details.", options: ["call out", "follow up", "clock in", "clock out"] } },
    ],
    bonusWords: [
      { term: "fill out", def: "to write information on a form", ex: "Please fill out this safety form before you start.", topics: ["career-on-the-job", "digital-skills"] },
      { term: "turn in", def: "to give homework or forms to your teacher or boss", ex: "You need to turn in your timesheet every Friday.", topics: ["career-on-the-job"] },
      { term: "log in", def: "to enter your username and password on a computer", ex: "First, log in to the computer and open your email.", topics: ["digital-skills", "career-on-the-job"] },
      { term: "go over", def: "to review or explain again", ex: "Let's go over the safety rules one more time.", topics: ["career-on-the-job", "communication"] },
      { term: "timesheet", def: "a form that records your work hours", ex: "Turn in your timesheet by Friday so you get paid on time.", topics: ["career-on-the-job"] },
      { term: "policy", def: "a rule or guideline at work", ex: "Our company policy says you must call out if you cannot come to work.", topics: ["career-on-the-job"] },
    ],
  },
  "feb-24-26": {
    topic: "Jobs: Experience & Timelines",
    words: [
      { term: "experience", def: "knowledge or skills from doing something", ex: "Do you have any customer service experience?", topics: ["career-job-search"], fillBlank: { text: "Do you have any customer service _____?", options: ["experience", "resume", "reference", "deadline"] } },
      { term: "resume", def: "a document listing your work history and skills", ex: "You should update your resume before applying.", topics: ["career-job-search"], fillBlank: { text: "You should update your _____ before you apply for a new job.", options: ["cover letter", "resume", "reference", "deadline"] } },
      { term: "cover letter", def: "a letter explaining why you want the job", ex: "Include a cover letter explaining why you are a good fit.", topics: ["career-job-search"], fillBlank: { text: "Include a _____ explaining why you are a good fit for the job.", options: ["resume", "cover letter", "reference", "experience"] } },
      { term: "reference", def: "a person who can speak about your work or character", ex: "My former boss agreed to be a reference for me.", topics: ["career-job-search"], fillBlank: { text: "My former boss agreed to be a _____ and speak about my work.", options: ["reference", "resume", "cover letter", "experience"] } },
      { term: "submit", def: "to send or give something officially", ex: "Please submit your application online.", topics: ["career-job-search", "digital-skills"], fillBlank: { text: "Please _____ your job application online before the deadline.", options: ["submit", "deadline", "resume", "reference"] } },
      { term: "deadline", def: "the date or time when something is due", ex: "The deadline for the project is next Tuesday.", topics: ["career-on-the-job"], fillBlank: { text: "The _____ for the job application is next Tuesday at midnight.", options: ["reference", "deadline", "submit", "resume"] } },
    ],
    bonusWords: [
      { term: "career", def: "your work life over many years", ex: "She plans to have a long career in healthcare.", topics: ["career-job-search", "career-on-the-job"] },
      { term: "journey", def: "your path or progress over time", ex: "His career journey started as an intern and led to CEO.", topics: ["career-job-search"] },
      { term: "fluent", def: "able to speak a language easily and well", ex: "The job requires someone who is fluent in Spanish.", topics: ["career-job-search", "soft-skills"] },
      { term: "advancement", def: "moving forward in your career", ex: "There are many opportunities for advancement in this company.", topics: ["career-on-the-job"] },
      { term: "path", def: "the direction or route you take", ex: "He is unsure which career path to follow.", topics: ["career-job-search"] },
      { term: "under pressure", def: "in a stressful situation", ex: "Can you work well under pressure during busy times?", topics: ["soft-skills", "career-job-search"] },
    ],
  },
  "mar-3-5": {
    topic: "Jobs: Skills & Qualifications",
    words: [
      { term: "promotion", def: "moving to a higher position at work", ex: "After working hard for two years, he received a promotion.", topics: ["career-on-the-job"], fillBlank: { text: "After two years of hard work, he received a _____ to manager.", options: ["promotion", "benefits", "priority", "deductions"] } },
      { term: "gross pay", def: "the total money you earn before taxes or deductions", ex: "Your gross pay is your salary before taxes are taken out.", topics: ["career-on-the-job", "money"], fillBlank: { text: "Your _____ is your total salary before taxes are taken out.", options: ["deductions", "gross pay", "benefits", "emergency fund"] } },
      { term: "deductions", def: "money taken out of your paycheck for taxes or other costs", ex: "Check your pay stub to see the deductions for taxes and insurance.", topics: ["career-on-the-job", "money"], fillBlank: { text: "Check your pay stub to see the _____ for taxes and insurance.", options: ["benefits", "deductions", "gross pay", "promotion"] } },
      { term: "benefits", def: "things your job gives you besides pay (e.g. health insurance)", ex: "The job offers great benefits, including health insurance and paid time off.", topics: ["career-on-the-job", "career-job-search", "money"], fillBlank: { text: "The job offers great _____, including health insurance and paid time off.", options: ["deductions", "benefits", "promotion", "priority"] } },
      { term: "priority", def: "the most important thing", ex: "Completing this report is my top priority for today.", topics: ["career-on-the-job", "soft-skills"], fillBlank: { text: "Finishing this report is my top _____ for today.", options: ["benefits", "priority", "promotion", "deductions"] } },
      { term: "emergency fund", def: "money saved for unexpected problems", ex: "It is smart to save money in an emergency fund for unexpected costs.", topics: ["money"], fillBlank: { text: "It is smart to save money in an _____ for unexpected costs like car repairs.", options: ["benefits", "emergency fund", "deductions", "gross pay"] } },
    ],
    bonusWords: [
      { term: "ambitious", def: "wanting to be successful or achieve goals", ex: "She is ambitious and hopes to become a manager soon.", topics: ["soft-skills", "career-job-search"] },
      { term: "decade", def: "a period of ten years", ex: "He has worked at the same company for over a decade.", topics: ["career-on-the-job"] },
      { term: "retire", def: "to stop working, usually at an older age", ex: "My father plans to retire when he turns 65.", topics: ["career-on-the-job", "money"] },
      { term: "achieve", def: "to reach a goal, to succeed", ex: "With hard work, you can achieve your goals.", topics: ["soft-skills"] },
      { term: "milestone", def: "an important step toward a goal", ex: "Graduating from college was a major milestone in her life.", topics: ["soft-skills"] },
      { term: "long-term", def: "over a long time (years, not months)", ex: "Buying a house is a long-term financial goal.", topics: ["money"] },
    ],
  },
  "mar-10-12": {
    topic: "Jobs: Rules, Obligation & Permission",
    words: [
      { term: "must", def: "used to show a strong obligation or rule", ex: "You must wear closed-toe shoes in the kitchen.", topics: ["career-on-the-job"], fillBlank: { text: "It's the law—all workers _____ wear hard hats on the construction site.", options: ["should", "must", "can", "request"] } },
      { term: "should", def: "used to give advice or say the best thing to do", ex: "You should ask your supervisor if you are unsure.", topics: ["career-on-the-job"], fillBlank: { text: "My coworker gave me advice: I _____ bring lunch to save money.", options: ["must", "can", "should", "required"] } },
      { term: "can", def: "used to show permission or ability", ex: "You can take your break after you finish this task.", topics: ["career-on-the-job"], fillBlank: { text: "Good news! You _____ wear jeans on Fridays if you want.", options: ["rule", "must", "can", "prohibited"] } },
      { term: "required", def: "necessary; must be done", ex: "A photo ID is required to enter the building.", topics: ["career-on-the-job"], fillBlank: { text: "Safety goggles are _____ when using the machines.", options: ["allowed", "permission", "required", "can"] } },
      { term: "allowed", def: "permitted; okay to do", ex: "Cell phones are not allowed during the test.", topics: ["career-on-the-job"], fillBlank: { text: "Eating at your desk is _____ if you clean up after.", options: ["prohibited", "allowed", "required", "polite"] } },
      { term: "safety", def: "protection from danger or harm", ex: "Safety is very important in the kitchen.", topics: ["career-on-the-job"], fillBlank: { text: "The company cares about _____, so we have regular fire drills.", options: ["permission", "safety", "polite", "can"] } },
    ],
    bonusWords: [
      { term: "permission", def: "approval to do something", ex: "You need permission before using the company car.", topics: ["career-on-the-job"] },
      { term: "rule", def: "an official instruction you must follow", ex: "One important rule is to wash your hands before cooking.", topics: ["career-on-the-job"] },
      { term: "prohibited", def: "not allowed; forbidden", ex: "Smoking is prohibited near the entrance.", topics: ["career-on-the-job"] },
      { term: "polite", def: "showing respect and good manners", ex: "It is polite to ask before leaving early.", topics: ["soft-skills", "communication"] },
      { term: "request", def: "a polite way to ask for something", ex: "She made a polite request to change her schedule.", topics: ["career-on-the-job", "communication"] },
      { term: "training", def: "learning how to do a job or task", ex: "New employees complete safety training before they start work.", topics: ["career-on-the-job", "career-job-search"] },
    ],
  },
  "mar-17-19": {
    topic: "Jobs: Communication & Feedback",
    words: [
      { term: "right", def: "official approval to do something", ex: "Workers have the right to a safe workplace.", topics: ["career-on-the-job", "civic-life"], fillBlank: { text: "Workers have the _____ to a safe workplace.", options: ["courtesy", "right", "strict", "comply"] } },
      { term: "advocate", def: "to speak up for yourself or others", ex: "You need to advocate for yourself if you want a raise.", topics: ["soft-skills", "civic-life", "career-on-the-job"], fillBlank: { text: "You need to _____ for yourself if you want to ask for a raise.", options: ["comply", "advocate", "violate", "courtesy"] } },
      { term: "courtesy", def: "polite and respectful behavior", ex: "Treat all customers with patience and courtesy.", topics: ["soft-skills", "communication"], fillBlank: { text: "Treat all customers with patience and _____ at the front desk.", options: ["courtesy", "strict", "right", "comply"] } },
      { term: "strict", def: "following rules very closely; not flexible", ex: "The company has strict rules about using cell phones at work.", topics: ["career-on-the-job"], fillBlank: { text: "The company has _____ rules about using cell phones at work.", options: ["strict", "courtesy", "comply", "right"] } },
      { term: "comply", def: "to follow rules or requirements", ex: "All employees must comply with the new regulations.", topics: ["career-on-the-job"], fillBlank: { text: "All employees must _____ with the new safety regulations.", options: ["violate", "comply", "advocate", "strict"] } },
      { term: "violate", def: "to break a rule or law", ex: "If you violate the policy, you may receive a warning.", topics: ["career-on-the-job"], fillBlank: { text: "If you _____ company policy, you may receive a warning.", options: ["comply", "violate", "advocate", "courtesy"] } },
    ],
    bonusWords: [
      { term: "require", def: "to need something or make it necessary", ex: "This job may require you to work some weekends.", topics: ["career-on-the-job"] },
      { term: "allow", def: "to let someone do something", ex: "Does your company allow employees to work from home?", topics: ["career-on-the-job"] },
      { term: "rule", def: "a guideline or regulation you must follow", ex: "Please follow every safety rule to avoid accidents.", topics: ["career-on-the-job"] },
      { term: "prohibit", def: "to not allow, to ban something", ex: "Company policy prohibits smoking in the building.", topics: ["career-on-the-job"] },
      { term: "coordinate", def: "to organize people or activities so they work well together", ex: "I need to coordinate the schedule with the other managers.", topics: ["career-on-the-job", "soft-skills"] },
      { term: "recruit", def: "to find and bring new people into a company or group", ex: "We are trying to recruit new engineers for the team.", topics: ["career-job-search"] },
    ],
  },
  "mar-24-26": {
    topic: "Jobs: Rights, Rules & Advocacy",
    words: [
      { term: "feedback", def: "comments or advice about your work", ex: "I appreciate your honest feedback on my work.", topics: ["career-on-the-job", "communication"], fillBlank: { text: "I appreciate your honest _____ on my presentation.", options: ["advice", "feedback", "decision", "recommend"] } },
      { term: "advice", def: "suggestions or recommendations about what to do", ex: "Can you give me some advice on how to ask for a promotion?", topics: ["communication"], fillBlank: { text: "Can you give me some _____ on how to ask for a promotion?", options: ["feedback", "advice", "decision", "consequence"] } },
      { term: "decision", def: "a choice you make", ex: "We need to make a decision about the budget by tomorrow.", topics: ["soft-skills"], fillBlank: { text: "We need to make a _____ about the budget by tomorrow.", options: ["consequence", "decision", "advice", "reflect"] } },
      { term: "consequence", def: "a result or effect of an action", ex: "Losing your job can be a serious consequence of violating safety rules.", topics: ["career-on-the-job"], fillBlank: { text: "Losing your job can be a serious _____ of violating safety rules.", options: ["decision", "consequence", "feedback", "reflect"] } },
      { term: "reflect", def: "to think carefully about something", ex: "Take some time to reflect on your performance this year.", topics: ["soft-skills"], fillBlank: { text: "Take some time to _____ on your performance this year before the review.", options: ["recommend", "reflect", "advice", "feedback"] } },
      { term: "recommend", def: "to suggest something is good", ex: "I can recommend a good mechanic if you need one.", topics: ["communication"], fillBlank: { text: "I can _____ a good mechanic if you need your car fixed.", options: ["reflect", "recommend", "advice", "feedback"] } },
    ],
    bonusWords: [
      { term: "risk", def: "the possibility of something bad happening", ex: "There is always a risk when starting a new business.", topics: ["career-on-the-job"] },
      { term: "regret", def: "to feel sorry about something you did or didn't do", ex: "I regret not finishing college when I was younger.", topics: ["soft-skills"] },
      { term: "experience", def: "knowledge or skill gained from doing something", ex: "You will gain valuable experience in this internship.", topics: ["career-job-search"] },
      { term: "choice", def: "a decision you make", ex: "You have a choice between working the day shift or the night shift.", topics: ["soft-skills"] },
      { term: "result", def: "what happens because of an action", ex: "The result of the project was better than we expected.", topics: ["career-on-the-job"] },
      { term: "career", def: "your work life over many years", ex: "She changed her career path after ten years in sales.", topics: ["career-job-search", "career-on-the-job"] },
    ],
  },
  "mar-31-apr-2": {
    topic: "Jobs: Small Talk & Social Conversation",
    words: [
      { term: "catch up", def: "to talk and share news with someone", ex: "It's always nice to catch up with coworkers on Monday morning.", topics: ["communication", "career-on-the-job"], fillBlank: { text: "We had not talked in weeks, so we stayed after class to _____ for a few minutes.", options: ["run into", "catch up", "show up", "drop by"] } },
      { term: "show up", def: "to arrive at a place", ex: "I usually show up a few minutes early for work.", topics: ["career-on-the-job"], fillBlank: { text: "Please _____ on time for the meeting tomorrow morning.", options: ["show up", "hang out", "run into", "look forward to"] } },
      { term: "follow up", def: "to check in later about something", ex: "I will follow up with an email after our meeting.", topics: ["career-on-the-job", "communication"], fillBlank: { text: "I need to _____ with the manager after the interview.", options: ["follow up", "hang out", "run into", "show up"] } },
      { term: "find out", def: "to learn or discover information", ex: "I need to find out what time the training starts.", topics: ["communication"], fillBlank: { text: "Let's _____ whether the office is open on Friday.", options: ["hang out", "show up", "find out", "catch up"] } },
      { term: "help out", def: "to help someone with something", ex: "My coworker helped out when the front desk got busy.", topics: ["soft-skills", "career-on-the-job"], fillBlank: { text: "Can you _____ at the front desk for ten minutes?", options: ["help out", "hear from", "work out", "show up"] } },
      { term: "look forward to", def: "to feel excited about something in the future", ex: "We are looking forward to the long weekend.", topics: ["communication"], fillBlank: { text: "I _____ the team lunch on Friday because everyone will be there.", options: ["run into", "show up", "look forward to", "drop by"] } },
    ],
    bonusWords: [
      { term: "drop by", def: "to visit briefly", ex: "You can drop by my desk if you have a quick question.", topics: ["communication"] },
      { term: "run into", def: "to meet someone unexpectedly", ex: "I ran into my old supervisor at the grocery store.", topics: ["communication"] },
      { term: "hang out", def: "to spend time together socially", ex: "Sometimes our team hangs out after work and gets coffee.", topics: ["communication"] },
      { term: "hear from", def: "to get news or a message from someone", ex: "I hope to hear from the manager by Friday.", topics: ["communication", "career-job-search"] },
      { term: "catch up on", def: "to do something that you did not have time to do before", ex: "I used Friday afternoon to catch up on my email.", topics: ["career-on-the-job"] },
      { term: "stop by", def: "to visit briefly", ex: "Stop by my office before you leave if you have questions.", topics: ["communication"] },
      { term: "work out", def: "to exercise", ex: "I like to work out before I go to work.", topics: ["health"] },
    ],
  },
  "apr-7-9": {
    topic: "Health: Symptoms & Lifestyle",
    words: [
      { term: "cough", def: "to force air out of your lungs with a sound", ex: "Please cover your mouth when you cough.", topics: ["health"], fillBlank: { text: "Please cover your mouth when you _____.", options: ["avoid", "cough", "quit", "habit"] } },
      { term: "infected", def: "having germs that make you sick", ex: "The cut on his finger became infected because he didn't clean it.", topics: ["health"], fillBlank: { text: "The cut on his finger became _____ because he did not clean it.", options: ["depressed", "infected", "habit", "avoid"] } },
      { term: "depressed", def: "feeling very sad or unhappy", ex: "Feeling depressed is a common reaction to losing a job.", topics: ["health"], fillBlank: { text: "Feeling _____ is a common reaction to losing a job.", options: ["infected", "depressed", "habit", "avoid"] } },
      { term: "habit", def: "something you do regularly", ex: "Smoking is a bad habit that is hard to break.", topics: ["health"], fillBlank: { text: "Smoking is a bad _____ that is hard to break.", options: ["habit", "avoid", "quit", "cough"] } },
      { term: "avoid", def: "to stay away from", ex: "You should avoid eating too much sugar.", topics: ["health"], fillBlank: { text: "You should _____ eating too much sugar if you want to be healthier.", options: ["quit", "avoid", "cough", "habit"] } },
      { term: "quit", def: "to stop doing something", ex: "He decided to quit his job and go back to school.", topics: ["career-on-the-job", "health"], fillBlank: { text: "He decided to _____ smoking after his doctor warned him.", options: ["avoid", "quit", "cough", "habit"] } },
    ],
    bonusWords: [
      { term: "inflamed", def: "swollen, red, or painful", ex: "Her ankle was inflamed and swollen after she twisted it.", topics: ["health"] },
      { term: "pediatrician", def: "a doctor for children", ex: "We took the baby to the pediatrician for a checkup.", topics: ["health"] },
      { term: "cardiologist", def: "a doctor for the heart", ex: "The cardiologist said he needs to exercise more for his heart.", topics: ["health"] },
      { term: "track", def: "to record and monitor", ex: "Use a calendar to track your appointments.", topics: ["health"] },
      { term: "arteries", def: "blood vessels that carry blood from the heart", ex: "Healthy food keeps your arteries clear and your heart strong.", topics: ["health"] },
      { term: "stroke", def: "a sudden problem in the brain that can stop it working correctly", ex: "High blood pressure is a major risk factor for stroke.", topics: ["health"] },
    ],
  },
  "apr-14-16": {
    topic: "Health: Recovery & Lifestyle",
    words: [
      { term: "recover", def: "to get better after being sick", ex: "It took him a few weeks to fully recover from the surgery.", topics: ["health"], fillBlank: { text: "It took him a few weeks to fully _____ from the surgery.", options: ["improve", "recover", "adjust", "prevent"] } },
      { term: "improve", def: "to get better, to make progress", ex: "Rest and fluids will help you improve quickly.", topics: ["health"], fillBlank: { text: "Rest and fluids will help you _____ quickly after the flu.", options: ["recover", "improve", "prevent", "adjust"] } },
      { term: "exercise", def: "to do physical activity to stay healthy", ex: "You should exercise for at least 30 minutes every day.", topics: ["health"], fillBlank: { text: "Doctors say you should _____ for at least 30 minutes every day.", options: ["prevent", "exercise", "recover", "adjust"] } },
      { term: "lifestyle", def: "the way you live, your daily habits", ex: "Eating healthy and exercising are part of a good lifestyle.", topics: ["health"], fillBlank: { text: "Eating healthy and exercising are part of a good _____.", options: ["lifestyle", "recover", "improve", "prevent"] } },
      { term: "prevent", def: "to stop something from happening", ex: "Washing your hands helps prevent the spread of germs.", topics: ["health"], fillBlank: { text: "Washing your hands helps _____ the spread of germs.", options: ["recover", "prevent", "improve", "adjust"] } },
      { term: "adjust", def: "to change to fit a new situation", ex: "It takes time to adjust to a new medication.", topics: ["health"], fillBlank: { text: "It takes time to _____ to a new medication.", options: ["recover", "adjust", "improve", "prevent"] } },
    ],
    bonusWords: [
      { term: "result", def: "the outcome or effect of something", ex: "The doctor will call you with the result of your blood test.", topics: ["health"] },
      { term: "duration", def: "how long something lasts", ex: "The duration of the flu is usually about one week.", topics: ["health"] },
      { term: "bladder", def: "the organ that holds urine", ex: "Drinking plenty of water is good for your bladder.", topics: ["health"] },
      { term: "liver", def: "the organ that cleans your blood", ex: "Alcohol can damage your liver over time.", topics: ["health"] },
      { term: "used to", def: "something you did in the past but not now", ex: "I used to smoke, but I quit five years ago.", topics: ["health"] },
      { term: "pattern", def: "a regular way you do things (like a habit)", ex: "Sleep problems can disrupt your daily pattern.", topics: ["health"] },
    ],
  },
  "apr-28-30": {
    topic: "Health: Doctor Visits",
    words: [
      { term: "appointment", def: "a scheduled time to see a doctor", ex: "I have a dentist appointment next Tuesday at 2:00.", topics: ["health"], fillBlank: { text: "I have a dentist _____ next Tuesday at 2:00.", options: ["checkup", "appointment", "prescription", "diagnosis"] } },
      { term: "checkup", def: "a regular doctor visit when you're not sick", ex: "You should go to the doctor for a yearly checkup.", topics: ["health"], fillBlank: { text: "You should go to the doctor for a yearly _____ even when you are not sick.", options: ["appointment", "checkup", "diagnosis", "prescription"] } },
      { term: "diagnosis", def: "what the doctor says is wrong with you", ex: "The doctor gave him a diagnosis of strep throat.", topics: ["health"], fillBlank: { text: "The doctor gave him a _____ of strep throat after the test.", options: ["prescription", "diagnosis", "checkup", "appointment"] } },
      { term: "prescription", def: "a written order from a doctor for medicine", ex: "The doctor wrote a prescription for pain medicine.", topics: ["health"], fillBlank: { text: "The doctor wrote a _____ for antibiotics.", options: ["diagnosis", "prescription", "checkup", "appointment"] } },
      { term: "fever", def: "when your body temperature is too high", ex: "She has a high fever and needs to rest.", topics: ["health"], fillBlank: { text: "She has a high _____ and needs to rest at home.", options: ["fever", "contagious", "diagnosis", "prescription"] } },
      { term: "contagious", def: "can spread easily to other people", ex: "The flu is very contagious, so stay home from work.", topics: ["health"], fillBlank: { text: "The flu is very _____, so stay home from work if you are sick.", options: ["contagious", "fever", "diagnosis", "checkup"] } },
    ],
    bonusWords: [
      { term: "accustomed", def: "familiar with something, used to it", ex: "It took me a while to get accustomed to the cold weather.", topics: ["soft-skills"] },
      { term: "prefer", def: "to like one thing more than another", ex: "I prefer tea over coffee in the morning.", topics: ["communication"] },
      { term: "routine", def: "a regular way of doing things", ex: "My morning routine includes coffee and the news.", topics: ["health"] },
      { term: "transition", def: "moving from one situation to another", ex: "The transition from my home country was hard at first.", topics: ["soft-skills"] },
      { term: "maintain", def: "to keep something going or in good condition", ex: "It is hard to maintain a healthy diet when you are busy.", topics: ["health"] },
      { term: "substitute", def: "to replace one thing with something else", ex: "You can substitute water for soda to be healthier.", topics: ["health"] },
    ],
  },
  "may-5-7": {
    topic: "Health: Body & Medicine",
    words: [
      { term: "symptom", def: "a sign that something is wrong with your body", ex: "A cough and sore throat are common symptoms of a cold.", topics: ["health"], fillBlank: { text: "A cough and sore throat are common _____ of a cold.", options: ["symptom", "dose", "chronic", "nutrient"] } },
      { term: "temperature", def: "how hot or cold your body is", ex: "The nurse took my temperature to check for a fever.", topics: ["health"], fillBlank: { text: "The nurse took my _____ to check whether I have a fever.", options: ["symptom", "temperature", "dose", "chronic"] } },
      { term: "prescribe", def: "to order medicine for a patient", ex: "The doctor will prescribe antibiotics for the infection.", topics: ["health"], fillBlank: { text: "The doctor will _____ antibiotics for the infection.", options: ["prescribe", "dose", "symptom", "chronic"] } },
      { term: "dose", def: "one measured amount of medicine to take at one time", ex: "Take one dose every six hours as directed.", topics: ["health"], fillBlank: { text: "Take one _____ of this medicine every six hours as directed.", options: ["dose", "symptom", "nutrient", "chronic"] } },
      { term: "chronic", def: "lasting a long time, not going away", ex: "She has chronic back pain that never fully goes away.", topics: ["health"], fillBlank: { text: "She has _____ back pain that never fully goes away.", options: ["chronic", "symptom", "dose", "nutrient"] } },
      { term: "nutrient", def: "something in food your body needs, like vitamins", ex: "Fruits and vegetables are full of important nutrients.", topics: ["health"], fillBlank: { text: "Fruits and vegetables are full of important _____ your body needs.", options: ["dose", "nutrient", "symptom", "chronic"] } },
    ],
    bonusWords: [
      { term: "muscles", def: "parts of the body that help you move", ex: "Stretching helps keep your muscles flexible.", topics: ["health"] },
      { term: "bones", def: "hard parts inside your body that give shape and support", ex: "Calcium is important for strong bones.", topics: ["health"] },
      { term: "drowsy", def: "sleepy or less alert, often after taking medicine", ex: "This allergy medicine can make you feel drowsy.", topics: ["health"] },
      { term: "sign", def: "something that shows you might be sick", ex: "A fever is often a sign of an infection.", topics: ["health"] },
      { term: "caution", def: "being careful to avoid danger", ex: "Use caution when taking new medicine for the first time.", topics: ["health"] },
      { term: "organ", def: "a body part with a specific job, like the heart or lungs", ex: "The heart is a vital organ that pumps blood.", topics: ["health"] },
    ],
  },
  "may-12-14": {
    topic: "Health: Self-Care & Wellness",
    words: [
      { term: "wellness", def: "overall health and well-being", ex: "The company offers a wellness program for employees.", topics: ["health"], fillBlank: { text: "The company offers a _____ program with gym discounts and stress workshops.", options: ["self-care", "wellness", "balance", "relax"] } },
      { term: "self-care", def: "taking care of your own needs", ex: "Taking time to relax is an important part of self-care.", topics: ["health", "soft-skills"], fillBlank: { text: "Taking time to rest is an important part of _____.", options: ["wellness", "self-care", "relax", "balance"] } },
      { term: "relax", def: "to rest and become calm", ex: "I like to relax with a good book after work.", topics: ["health"], fillBlank: { text: "I like to _____ with a good book after a long day at work.", options: ["balance", "relax", "mindful", "wellness"] } },
      { term: "coping skills", def: "ways to handle stress or problems", ex: "Deep breathing is one of my coping skills for stress.", topics: ["health", "soft-skills"], fillBlank: { text: "Deep breathing is one of my _____ for handling stress.", options: ["coping skills", "self-care", "wellness", "balance"] } },
      { term: "balance", def: "having the right amount of different things", ex: "A good balance of work and rest keeps you healthy.", topics: ["health", "soft-skills"], fillBlank: { text: "A good _____ of work and rest keeps you healthy.", options: ["wellness", "balance", "self-care", "mindful"] } },
      { term: "mindful", def: "aware and present in the moment", ex: "Try to be mindful of how much sugar you eat.", topics: ["health", "soft-skills"], fillBlank: { text: "Try to be _____ of how much sugar you eat each day.", options: ["mindful", "relax", "balance", "wellness"] } },
    ],
    bonusWords: [
      { term: "regimen", def: "a routine plan, often for health or fitness", ex: "He follows a strict workout regimen to stay fit.", topics: ["health"] },
      { term: "hydration", def: "having enough water in your body", ex: "Good hydration is essential for athletes.", topics: ["health"] },
      { term: "moderation", def: "not too much or too little", ex: "It is okay to eat dessert in moderation.", topics: ["health"] },
      { term: "nourish", def: "to give your body the food and care it needs", ex: "Eating fruits and vegetables helps nourish your body.", topics: ["health"] },
      { term: "recreational", def: "related to fun or relaxing activities", ex: "The park offers many recreational activities for families.", topics: ["health"] },
      { term: "restore", def: "to bring back to good condition", ex: "A good night's sleep will restore your energy.", topics: ["health"] },
    ],
  },
  "may-19-21": {
    topic: "Health: Home Remedies & Food",
    words: [
      { term: "processed", def: "changed from natural state", ex: "Try to eat less processed food and more fresh vegetables.", topics: ["health"], fillBlank: { text: "Try to eat less _____ food and more fresh vegetables.", options: ["processed", "remedy", "fluids", "ailment"] } },
      { term: "remedy", def: "something you do or take at home to feel better", ex: "Honey and lemon is a good home remedy for a sore throat.", topics: ["health"], fillBlank: { text: "Honey and lemon is a good home _____ for a sore throat.", options: ["remedy", "relieve", "soothe", "fluids"] } },
      { term: "relieve", def: "to make pain or discomfort less", ex: "Ice can help relieve the pain of a sprained ankle.", topics: ["health"], fillBlank: { text: "Ice can help _____ the pain of a sprained ankle.", options: ["soothe", "relieve", "remedy", "ailment"] } },
      { term: "soothe", def: "to calm or comfort (e.g. a sore throat)", ex: "Warm milk can soothe an upset stomach.", topics: ["health"], fillBlank: { text: "Warm tea can _____ an upset stomach.", options: ["relieve", "soothe", "remedy", "fluids"] } },
      { term: "fluids", def: "liquids you drink (water, tea, broth)", ex: "Drink plenty of fluids when you are sick.", topics: ["health"], fillBlank: { text: "Drink plenty of _____ when you are sick with a fever.", options: ["fluids", "remedy", "ailment", "soothe"] } },
      { term: "ailment", def: "a minor illness or discomfort (e.g. cold, headache)", ex: "Ginger tea is good for a stomach ailment.", topics: ["health"], fillBlank: { text: "Ginger tea is good for a minor stomach _____.", options: ["ailment", "remedy", "fluids", "relieve"] } },
    ],
    bonusWords: [
      { term: "packaged", def: "put in a container or box", ex: "The cookies are packaged in a plastic box.", topics: ["health"] },
      { term: "preserved", def: "kept fresh for a long time", ex: "Salt was used to keep the meat preserved for the winter.", topics: ["health"] },
      { term: "required", def: "needed, must be done", ex: "A helmet is required when riding a motorcycle.", topics: ["transportation"] },
      { term: "listed", def: "written down in order", ex: "The ingredients are listed on the back of the package.", topics: ["health"] },
      { term: "measured", def: "checked the amount or size", ex: "She carefully measured the flour for the cake.", topics: ["health"] },
      { term: "detox", def: "to remove harmful or addictive substances from the body", ex: "He went on a detox diet to clean his system.", topics: ["health"] },
    ],
  },
  "may-26-28": {
    topic: "Reflection & Growth",
    words: [
      { term: "progress", def: "improvement over time", ex: "You are making good progress in your English class.", topics: ["soft-skills"], fillBlank: { text: "You are making good _____ in your English class this semester.", options: ["progress", "success", "challenge", "reflection"] } },
      { term: "challenge", def: "something difficult", ex: "Learning a new language is a big challenge.", topics: ["soft-skills"], fillBlank: { text: "Learning a new language is a big _____.", options: ["success", "challenge", "progress", "accomplish"] } },
      { term: "success", def: "achieving your goal", ex: "Hard work is the key to success.", topics: ["soft-skills"], fillBlank: { text: "Hard work and practice are the keys to _____.", options: ["progress", "success", "challenge", "reflection"] } },
      { term: "accomplish", def: "to finish something successfully", ex: "She accomplished her goal of running a 5K.", topics: ["soft-skills"], fillBlank: { text: "She _____ her goal of running a 5K race last month.", options: ["accomplish", "progress", "success", "proud"] } },
      { term: "proud", def: "feeling good about achievement", ex: "I am very proud of my son for graduating.", topics: ["soft-skills"], fillBlank: { text: "I am very _____ of my son for graduating from high school.", options: ["proud", "success", "progress", "reflection"] } },
      { term: "reflection", def: "thinking about your experience", ex: "Quiet reflection helps me solve problems.", topics: ["soft-skills"], fillBlank: { text: "Quiet _____ helps me think about what I learned this year.", options: ["reflection", "progress", "challenge", "success"] } },
    ],
    bonusWords: [
      { term: "nerves", def: "feelings of stress or anxiety; or fibers that carry signals in the body", ex: "She checked her nerves before the big speech.", topics: ["health"] },
      { term: "mind", def: "the part that thinks, feels, and remembers; your thoughts", ex: "Keep an open mind when listening to new ideas.", topics: ["health", "soft-skills"] },
      { term: "cycle", def: "a repeating pattern (e.g. weekly habits)", ex: "The life cycle of a butterfly is fascinating.", topics: ["health"] },
      { term: "outcome", def: "the result of something", ex: "We are waiting for the outcome of the election.", topics: ["civic-life"] },
      { term: "keep", def: "to continue doing something", ex: "Please keep the door closed." },
      { term: "sustain", def: "to keep something going over time", ex: "It is hard to sustain high energy all day.", topics: ["soft-skills"] },
    ],
  },
  "jun-2-4": {
    topic: "Wrap-Up & Next Steps",
    words: [
      { term: "goal", def: "something you want to achieve", ex: "My goal is to save enough money for a car.", topics: ["soft-skills"], fillBlank: { text: "My _____ is to save enough money to buy a car next year.", options: ["goal", "achievement", "growth", "commitment"] } },
      { term: "achievement", def: "something you did well or completed", ex: "Winning the award was a great achievement.", topics: ["soft-skills"], fillBlank: { text: "Winning the award was a great _____ for our team.", options: ["goal", "achievement", "growth", "commitment"] } },
      { term: "growth", def: "getting better over time", ex: "This job offers many opportunities for personal growth.", topics: ["career-on-the-job", "soft-skills"], fillBlank: { text: "This English class offers many opportunities for personal _____.", options: ["achievement", "growth", "goal", "commitment"] } },
      { term: "confident", def: "feeling sure of yourself", ex: "She feels confident that she will pass the exam.", topics: ["soft-skills"], fillBlank: { text: "She feels _____ that she will pass the final exam.", options: ["confident", "commitment", "appreciate", "achievement"] } },
      { term: "commitment", def: "a promise to keep doing something", ex: "Learning English takes real commitment and practice.", topics: ["soft-skills"], fillBlank: { text: "Learning English takes real _____ and daily practice.", options: ["achievement", "commitment", "goal", "growth"] } },
      { term: "appreciate", def: "to be thankful for something", ex: "I appreciate all the help my teacher gave me this year.", topics: ["communication"], fillBlank: { text: "I _____ all the help my teacher gave me this year.", options: ["appreciate", "confident", "commitment", "achievement"] } },
    ],
    bonusWords: [
      { term: "next steps", def: "what you will do after this", ex: "Let's discuss the next steps for the project." },
      { term: "plan", def: "a way to reach a goal", ex: "Do you have a plan for the weekend?" },
      { term: "resource", def: "something that helps you (book, website, person)", ex: "The library is a great resource for information." },
      { term: "community", def: "a group of people in one place", ex: "It is important to be involved in your local community.", topics: ["civic-life"] },
      { term: "review", def: "to look back and think about", ex: "Let's review the material before the test." },
      { term: "continue", def: "to keep doing something", ex: "Please continue working until 5:00 PM." },
    ],
  },
};

module.exports = { weeklyVocabData };
