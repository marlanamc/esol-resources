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
      { term: "log in",    def: "to enter your username and password to access a website or app",       ex: "Please log in to the app every day to practice English.", topics: ["digital-skills"] },
      { term: "navigate",  def: "to move around a website or app",                                      ex: "Use the menu at the top to navigate the website.", topics: ["digital-skills"] },
      { term: "submit",   def: "to send your work or information officially",                          ex: "Submit your answers before the timer runs out.", topics: ["digital-skills"] },
      { term: "access",   def: "to open or enter a file, website, or building",                       ex: "You can access your lessons from any device.", topics: ["digital-skills"] },
      { term: "complete", def: "to finish all parts of a task",                                       ex: "Try to complete at least one activity each day." },
      { term: "review",   def: "to look at something again to check or learn it better",              ex: "Review the words before the quiz on Friday." },
    ],
  },
  "sep-w2": {
    topic: "Parts of Speech: Key Verbs",
    words: [
      { term: "identify",   def: "to recognize and name something",                                   ex: "Can you identify the noun in this sentence?" },
      { term: "categorize", def: "to put things into groups",                                         ex: "Categorize these words as nouns, verbs, or adjectives." },
      { term: "pronounce",  def: "to say a word out loud correctly",                                  ex: "Practice how to pronounce each new word." },
      { term: "spell",      def: "to write or say the letters of a word in order",                   ex: "Can you spell your last name for me, please?" },
      { term: "translate",  def: "to change words from one language to another",                      ex: "I used my phone to translate that word into English." },
      { term: "practice",   def: "to do something many times to improve",                             ex: "Practice speaking English every day to get better." },
    ],
  },
  "sep-w3": {
    topic: "Verb Forms: Action Words",
    words: [
      { term: "explain",  def: "to make something clear by giving details",                          ex: "Can you explain how to use this form?" },
      { term: "describe", def: "to say what something or someone is like",                           ex: "Describe your neighborhood to the class." },
      { term: "discuss",  def: "to talk about something with others",                                ex: "We will discuss the homework in class." },
      { term: "listen",   def: "to pay attention to sounds or someone speaking",                     ex: "Listen carefully and repeat the words you hear." },
      { term: "record",   def: "to save or write down information; to make an audio or video",       ex: "Record yourself reading the sentence aloud." },
      { term: "repeat",   def: "to do or say something again",                                       ex: "Please repeat the word after me." },
    ],
  },
  "sep-w4": {
    topic: "Life Experience: Personal Journey Verbs",
    words: [
      { term: "relocate",  def: "to move to a new city or country",                                  ex: "My family decided to relocate to the United States." },
      { term: "introduce", def: "to present yourself or another person for the first time",           ex: "Please introduce yourself to the class." },
      { term: "motivate",  def: "to give someone a reason to do something",                          ex: "My children motivate me to learn English every day." },
      { term: "achieve",   def: "to reach a goal through hard work",                                 ex: "With practice, you can achieve your language goals." },
      { term: "overcome",  def: "to successfully deal with a challenge",                             ex: "She worked hard to overcome the language barrier." },
      { term: "immigrate", def: "to come to a new country to live there permanently",                ex: "He immigrated to the U.S. five years ago." },
    ],
  },

  /** Unit 2 – Daily Life in the Community (October) */
  "oct-w1": {
    topic: "Community + Daily Routines: Schedule Verbs",
    words: [
      { term: "schedule", def: "to plan a time for something to happen",                             ex: "I need to schedule a doctor's appointment for next week.", topics: ["health"] },
      { term: "commute",  def: "to travel regularly between home and work or school",                ex: "She commutes by bus every morning.", topics: ["transportation", "career-on-the-job"] },
      { term: "prepare",  def: "to get ready for something",                                         ex: "Prepare your bag the night before class." },
      { term: "attend",   def: "to go to an event, class, or meeting",                               ex: "All students are expected to attend class on time." },
      { term: "balance",  def: "to manage two or more things at the same time fairly",               ex: "It is hard to balance work, school, and family.", topics: ["soft-skills"] },
      { term: "exercise", def: "to do physical activity to stay healthy",                            ex: "Try to exercise for at least 30 minutes a day.", topics: ["health"] },
    ],
  },
  "oct-w2": {
    topic: "Transportation + Directions: Movement Verbs",
    words: [
      { term: "depart",   def: "to leave a place",                                                   ex: "The bus departs from Main Street at 7:00 AM.", topics: ["transportation"] },
      { term: "arrive",   def: "to reach a place",                                                   ex: "What time does the train arrive at the station?", topics: ["transportation"] },
      { term: "transfer", def: "to change from one bus, train, or route to another",                 ex: "Transfer to the Red Line at Downtown Station.", topics: ["transportation"] },
      { term: "locate",   def: "to find the position of something",                                  ex: "Can you locate the nearest pharmacy on the map?", topics: ["transportation"] },
      { term: "follow",   def: "to go in the same direction; to use directions step by step",        ex: "Follow the signs to the emergency exit.", topics: ["transportation"] },
      { term: "cross",    def: "to go from one side to the other",                                   ex: "Cross the street at the crosswalk when the light is green.", topics: ["transportation"] },
    ],
  },
  "oct-w3": {
    topic: "Digital Safety + Forms: Protect Yourself Verbs",
    words: [
      { term: "register",  def: "to sign up officially for a service or program",                    ex: "You need to register online before your first appointment.", topics: ["digital-skills"] },
      { term: "protect",   def: "to keep something safe from harm",                                  ex: "Use a strong password to protect your account.", topics: ["digital-skills"] },
      { term: "verify",    def: "to check that something is correct or true",                        ex: "The website will send a code to verify your identity.", topics: ["digital-skills"] },
      { term: "avoid",     def: "to stay away from something dangerous or unwanted",                 ex: "Avoid clicking on unknown links in your email.", topics: ["digital-skills"] },
      { term: "sign",      def: "to write your name on a document to show agreement",                ex: "Read the form carefully before you sign it.", topics: ["digital-skills"] },
      { term: "update",    def: "to add new information or change to the newest version",            ex: "Update your password every few months for security.", topics: ["digital-skills"] },
    ],
  },
  "oct-w4": {
    topic: "Phone English + Family Connection: Communication Verbs",
    words: [
      { term: "contact",   def: "to reach someone by phone, email, or message",                     ex: "Contact the school if your child will be absent.", topics: ["communication"] },
      { term: "respond",   def: "to answer or react to a message or question",                       ex: "Please respond to the email within 24 hours.", topics: ["communication"] },
      { term: "confirm",   def: "to say that something is definitely true or agreed upon",           ex: "Call to confirm your appointment the day before.", topics: ["communication"] },
      { term: "decline",   def: "to politely say no to an offer or invitation",                      ex: "She had to decline the meeting because she was sick.", topics: ["communication"] },
      { term: "postpone",  def: "to move something to a later time",                                 ex: "We need to postpone the meeting until next week.", topics: ["communication"] },
      { term: "connect",   def: "to join or link with someone or something",                         ex: "I couldn't connect to the Wi-Fi at the library.", topics: ["communication", "digital-skills"] },
    ],
  },

  /** Unit 3 – Community Participation (November) */
  "nov-w1": {
    topic: "Helping + Volunteering: Action Verbs",
    words: [
      { term: "volunteer",  def: "to offer to do something without being paid",                      ex: "She volunteers at the food bank every Saturday.", topics: ["civic-life"] },
      { term: "assist",     def: "to help someone with a task",                                      ex: "Can you assist me with this form?", topics: ["civic-life", "soft-skills"] },
      { term: "support",    def: "to help or encourage someone or a cause",                          ex: "Our community supports local families in need.", topics: ["civic-life"] },
      { term: "contribute",def: "to give time, money, or effort to help something",                  ex: "Everyone can contribute in a small way to make things better.", topics: ["civic-life"] },
      { term: "donate",     def: "to give something (money, food, clothing) to help others",         ex: "We donate clothing to the shelter twice a year.", topics: ["civic-life"] },
      { term: "join",       def: "to become a member of a group or start participating",             ex: "Would you like to join our community garden project?", topics: ["civic-life"] },
    ],
  },
  "nov-w2": {
    topic: "Public Meetings + Suggestions: Discussion Verbs",
    words: [
      { term: "participate", def: "to take part in an activity or event",                           ex: "Everyone is welcome to participate in the town meeting.", topics: ["civic-life"] },
      { term: "suggest",     def: "to offer an idea for others to consider",                         ex: "I'd like to suggest adding more bus routes to our area.", topics: ["civic-life", "communication"] },
      { term: "propose",     def: "to formally put forward an idea or plan",                         ex: "The committee will propose a new community garden.", topics: ["civic-life"] },
      { term: "recommend",   def: "to advise that something is a good choice",                      ex: "The teacher recommended that we study for at least one hour.", topics: ["communication"] },
      { term: "agree",       def: "to have the same opinion or say yes to something",                ex: "Most people at the meeting agreed with the new plan.", topics: ["communication"] },
      { term: "listen",      def: "to pay attention to what someone is saying",                     ex: "Good leaders listen to the concerns of their community.", topics: ["communication", "soft-skills"] },
    ],
  },
  "nov-w3": {
    topic: "Voting + Contacting Officials: Civic Verbs",
    words: [
      { term: "vote",      def: "to officially choose a person or option in an election",           ex: "Register and vote in your local elections.", topics: ["civic-life"] },
      { term: "elect",     def: "to choose a person for a position by voting",                      ex: "Citizens elect leaders to represent them in government.", topics: ["civic-life"] },
      { term: "advocate",  def: "to publicly support a cause or group of people",                   ex: "She advocates for better schools in her neighborhood.", topics: ["civic-life"] },
      { term: "petition",  def: "to formally ask for change by collecting signatures",               ex: "We started a petition to fix the broken street lights.", topics: ["civic-life"] },
      { term: "represent", def: "to speak or act on behalf of others",                              ex: "Your city council member represents your neighborhood.", topics: ["civic-life"] },
      { term: "campaign",  def: "to work to get support for a cause or candidate",                  ex: "Many volunteers campaign for better housing in our city.", topics: ["civic-life"] },
    ],
  },
  "nov-w4": {
    topic: "Community Issues: Problem-Solving Verbs",
    words: [
      { term: "analyze",     def: "to study something carefully to understand it",                  ex: "Let's analyze the problem before we decide what to do.", topics: ["civic-life"] },
      { term: "resolve",     def: "to find a solution to a problem",                                ex: "We worked together to resolve the conflict peacefully.", topics: ["civic-life"] },
      { term: "improve",     def: "to make something better",                                       ex: "The city wants to improve public transportation.", topics: ["civic-life"] },
      { term: "collaborate",def: "to work together with others to achieve a goal",                  ex: "We collaborated with local businesses to start the event.", topics: ["civic-life", "soft-skills"] },
      { term: "report",      def: "to tell someone in authority about a problem",                   ex: "Report broken streetlights to the city using the hotline.", topics: ["civic-life"] },
      { term: "prevent",     def: "to stop something bad from happening",                           ex: "We can prevent crime by working together as a community.", topics: ["civic-life"] },
    ],
  },

  /** Unit 4 – Consumer Smarts (December) */
  "dec-w1": {
    topic: "Smart Spending + Big Numbers: Money Verbs",
    words: [
      { term: "purchase",  def: "to buy something",                                                 ex: "Think carefully before you purchase anything online.", topics: ["money"] },
      { term: "compare",   def: "to look at two or more things to find differences",                ex: "Always compare prices before you buy.", topics: ["money"] },
      { term: "budget",    def: "to plan how much money to spend",                                   ex: "Budget your money so you can pay all your bills.", topics: ["money"] },
      { term: "save",      def: "to keep money so you can use it later",                             ex: "Try to save at least 10% of your income each month.", topics: ["money"] },
      { term: "spend",     def: "to use money to pay for things",                                   ex: "Don't spend more than you earn.", topics: ["money"] },
      { term: "calculate",def: "to use math to find an answer",                                     ex: "Calculate the total cost before you decide to buy.", topics: ["money"] },
    ],
  },
  "dec-w2": {
    topic: "Bills, Returns + Scams: Financial Action Verbs",
    words: [
      { term: "exchange",  def: "to return one item and get a different one",                        ex: "I want to exchange this shirt for a larger size.", topics: ["money"] },
      { term: "refund",    def: "to get your money back after returning something",                  ex: "The store gave me a full refund for the broken item.", topics: ["money"] },
      { term: "withdraw",  def: "to take money out of a bank account",                              ex: "I need to withdraw cash from the ATM.", topics: ["money"] },
      { term: "deposit",   def: "to put money into a bank account",                                 ex: "Deposit your check before the end of the business day.", topics: ["money"] },
      { term: "charge",    def: "to ask for payment; to add to a credit card bill",                 ex: "The store will charge your card when the item ships.", topics: ["money"] },
      { term: "dispute",   def: "to say that something is wrong and ask for a correction",          ex: "If there is an error on your bill, call to dispute it.", topics: ["money", "communication"] },
    ],
  },

  /** Unit 5 – Housing (January) */
  "jan-w1": {
    topic: "Housing Basics: Renter Verbs",
    words: [
      { term: "rent",     def: "to pay money to use something (an apartment, a car) that belongs to someone else", ex: "We rent our apartment for $1,200 a month.", topics: ["housing"] },
      { term: "lease",    def: "to sign an agreement to use property for a set time",               ex: "We signed a 12-month lease for the apartment.", topics: ["housing"] },
      { term: "occupy",   def: "to live in or use a space",                                         ex: "How many people will occupy this apartment?", topics: ["housing"] },
      { term: "move",     def: "to go to live in a different place",                                 ex: "We plan to move to a bigger apartment next month.", topics: ["housing"] },
      { term: "qualify",  def: "to meet the requirements needed for something",                     ex: "Do I qualify for the low-income housing program?", topics: ["housing"] },
      { term: "apply",    def: "to formally request something (a job, an apartment, a program)",   ex: "You need to apply online for that apartment.", topics: ["housing", "career-job-search"] },
    ],
  },
  "jan-w2": {
    topic: "Comparing Housing Options: Decision Verbs",
    words: [
      { term: "compare",   def: "to look at two or more things to find differences",                ex: "Compare the rent and size of each apartment.", topics: ["housing"] },
      { term: "afford",    def: "to have enough money to pay for something",                        ex: "I can't afford an apartment in that area.", topics: ["housing", "money"] },
      { term: "evaluate",  def: "to study all parts of something to judge its quality or value",   ex: "Evaluate the location, price, and size before deciding.", topics: ["housing"] },
      { term: "select",    def: "to choose something from a group of options",                      ex: "We will select an apartment by the end of the week.", topics: ["housing"] },
      { term: "negotiate", def: "to talk with someone to reach an agreement",                       ex: "You can negotiate the rent with the landlord.", topics: ["housing", "communication"] },
      { term: "own",       def: "to have something as your legal property",                         ex: "Someday I hope to own my own home.", topics: ["housing"] },
    ],
  },
  "jan-w3": {
    topic: "Landlord Calls + Repair Requests: Maintenance Verbs",
    words: [
      { term: "request",  def: "to politely ask for something officially",                          ex: "I need to request a repair for the broken heater.", topics: ["housing", "communication"] },
      { term: "report",   def: "to tell someone in authority about a problem",                      ex: "Report any leaks or damage to your landlord right away.", topics: ["housing"] },
      { term: "inspect",  def: "to look at something carefully to check its condition",             ex: "The landlord will inspect the apartment next Monday.", topics: ["housing"] },
      { term: "repair",   def: "to fix something that is broken or damaged",                        ex: "The landlord must repair the broken window within 24 hours.", topics: ["housing"] },
      { term: "leak",     def: "(of liquid) to drip or flow through a crack or hole",               ex: "The ceiling is leaking after the heavy rain.", topics: ["housing"] },
      { term: "clog",     def: "to block a pipe so water cannot flow",                              ex: "The kitchen sink is clogged and the water won't drain.", topics: ["housing"] },
    ],
  },
  "jan-w4": {
    topic: "Housing Problems + Solutions: Resolution Verbs",
    words: [
      { term: "resolve",     def: "to find a solution and fix a problem",                           ex: "The landlord promised to resolve the heating issue today.", topics: ["housing"] },
      { term: "maintain",    def: "to keep something in good condition",                             ex: "Tenants must maintain a clean and safe apartment.", topics: ["housing"] },
      { term: "notify",      def: "to officially tell someone about something",                      ex: "Notify your landlord in writing if you plan to move out.", topics: ["housing", "communication"] },
      { term: "document",    def: "to write down or photograph something as a record",              ex: "Document the damage with photos before the landlord visits.", topics: ["housing"] },
      { term: "prevent",     def: "to stop something bad from happening",                           ex: "Regular cleaning can prevent mold in the bathroom.", topics: ["housing"] },
      { term: "reimburse",   def: "to pay someone back for money they spent",                       ex: "The landlord agreed to reimburse us for the plumber's cost.", topics: ["housing", "money"] },
    ],
  },

  // ── CYCLE 2: Units 6–10 (Feb–Jun) ─ 12 words per week ────────────────────
  "feb-3-5": {
    topic: "Jobs: Foundations",
    words: [
      { term: "schedule", def: "your plan for the day or week", ex: "My work schedule changes every week.", topics: ["career-on-the-job"] },
      { term: "break", def: "a short rest from work", ex: "We take a 15-minute break at 10:00 AM.", topics: ["career-on-the-job"] },
      { term: "time off", def: "days when you don't work (e.g. Saturday, Sunday, vacation)", ex: "I asked my boss for some time off to visit my family.", topics: ["career-on-the-job"] },
      { term: "team", def: "the group of people you work with", ex: "Our sales team meets every Monday morning.", topics: ["career-on-the-job"] },
      { term: "reliable", def: "dependable; you can count on this person", ex: "He is a reliable worker who always shows up on time.", topics: ["soft-skills", "career-job-search"] },
      { term: "flexible", def: "able to change, adjust to new situations", ex: "Can you be flexible with your hours next week?", topics: ["soft-skills", "career-on-the-job"] },
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
      { term: "clock in", def: "to arrive at work and record your start time", ex: "I always clock in when my shift starts.", topics: ["career-on-the-job"] },
      { term: "clock out", def: "to leave work and record your end time", ex: "Please clock out when your shift ends.", topics: ["career-on-the-job"] },
      { term: "call out", def: "to phone your job to say you will not work that day", ex: "I had to call out on Monday because my son was sick.", topics: ["career-on-the-job", "communication"] },
      { term: "shift", def: "your scheduled hours of work", ex: "My shift is eight hours, and it changes every week.", topics: ["career-on-the-job"] },
      { term: "supervisor", def: "the person who manages you at work", ex: "If you are sick, call your supervisor before your shift.", topics: ["career-on-the-job"] },
      { term: "follow up", def: "to check in later about something", ex: "I will follow up with an email after our meeting.", topics: ["career-on-the-job", "communication"] },
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
      { term: "experience", def: "knowledge or skills from doing something", ex: "Do you have any customer service experience?", topics: ["career-job-search"] },
      { term: "resume", def: "a document listing your work history and skills", ex: "You should update your resume before applying.", topics: ["career-job-search"] },
      { term: "cover letter", def: "a letter explaining why you want the job", ex: "Include a cover letter explaining why you are a good fit.", topics: ["career-job-search"] },
      { term: "reference", def: "a person who can speak about your work or character", ex: "My former boss agreed to be a reference for me.", topics: ["career-job-search"] },
      { term: "submit", def: "to send or give something officially", ex: "Please submit your application online.", topics: ["career-job-search", "digital-skills"] },
      { term: "deadline", def: "the date or time when something is due", ex: "The deadline for the project is next Tuesday.", topics: ["career-on-the-job"] },
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
      { term: "promotion", def: "moving to a higher position at work", ex: "After working hard for two years, he received a promotion.", topics: ["career-on-the-job"] },
      { term: "gross pay", def: "the total money you earn before taxes or deductions", ex: "Your gross pay is your salary before taxes are taken out.", topics: ["career-on-the-job", "money"] },
      { term: "deductions", def: "money taken out of your paycheck for taxes or other costs", ex: "Check your pay stub to see the deductions for taxes and insurance.", topics: ["career-on-the-job", "money"] },
      { term: "benefits", def: "things your job gives you besides pay (e.g. health insurance)", ex: "The job offers great benefits, including health insurance and paid time off.", topics: ["career-on-the-job", "career-job-search", "money"] },
      { term: "priority", def: "the most important thing", ex: "Completing this report is my top priority for today.", topics: ["career-on-the-job", "soft-skills"] },
      { term: "emergency fund", def: "money saved for unexpected problems", ex: "It is smart to save money in an emergency fund for unexpected costs.", topics: ["money"] },
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
      { term: "right", def: "official approval to do something", ex: "Workers have the right to a safe workplace.", topics: ["career-on-the-job", "civic-life"] },
      { term: "advocate", def: "to speak up for yourself or others", ex: "You need to advocate for yourself if you want a raise.", topics: ["soft-skills", "civic-life", "career-on-the-job"] },
      { term: "courtesy", def: "polite and respectful behavior", ex: "Treat all customers with patience and courtesy.", topics: ["soft-skills", "communication"] },
      { term: "strict", def: "following rules very closely; not flexible", ex: "The company has strict rules about using cell phones at work.", topics: ["career-on-the-job"] },
      { term: "comply", def: "to follow rules or requirements", ex: "All employees must comply with the new regulations.", topics: ["career-on-the-job"] },
      { term: "violate", def: "to break a rule or law", ex: "If you violate the policy, you may receive a warning.", topics: ["career-on-the-job"] },
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
      { term: "feedback", def: "comments or advice about your work", ex: "I appreciate your honest feedback on my work.", topics: ["career-on-the-job", "communication"] },
      { term: "advice", def: "suggestions or recommendations about what to do", ex: "Can you give me some advice on how to ask for a promotion?", topics: ["communication"] },
      { term: "decision", def: "a choice you make", ex: "We need to make a decision about the budget by tomorrow.", topics: ["soft-skills"] },
      { term: "consequence", def: "a result or effect of an action", ex: "Losing your job can be a serious consequence of violating safety rules.", topics: ["career-on-the-job"] },
      { term: "reflect", def: "to think carefully about something", ex: "Take some time to reflect on your performance this year.", topics: ["soft-skills"] },
      { term: "recommend", def: "to suggest something is good", ex: "I can recommend a good mechanic if you need one.", topics: ["communication"] },
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
      { term: "cough", def: "to force air out of your lungs with a sound", ex: "Please cover your mouth when you cough.", topics: ["health"] },
      { term: "infected", def: "having germs that make you sick", ex: "The cut on his finger became infected because he didn't clean it.", topics: ["health"] },
      { term: "depressed", def: "feeling very sad or unhappy", ex: "Feeling depressed is a common reaction to losing a job.", topics: ["health"] },
      { term: "habit", def: "something you do regularly", ex: "Smoking is a bad habit that is hard to break.", topics: ["health"] },
      { term: "avoid", def: "to stay away from", ex: "You should avoid eating too much sugar.", topics: ["health"] },
      { term: "quit", def: "to stop doing something", ex: "He decided to quit his job and go back to school.", topics: ["career-on-the-job", "health"] },
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
      { term: "recover", def: "to get better after being sick", ex: "It took him a few weeks to fully recover from the surgery.", topics: ["health"] },
      { term: "improve", def: "to get better, to make progress", ex: "Rest and fluids will help you improve quickly.", topics: ["health"] },
      { term: "exercise", def: "to do physical activity to stay healthy", ex: "You should exercise for at least 30 minutes every day.", topics: ["health"] },
      { term: "lifestyle", def: "the way you live, your daily habits", ex: "Eating healthy and exercising are part of a good lifestyle.", topics: ["health"] },
      { term: "prevent", def: "to stop something from happening", ex: "Washing your hands helps prevent the spread of germs.", topics: ["health"] },
      { term: "adjust", def: "to change to fit a new situation", ex: "It takes time to adjust to a new medication.", topics: ["health"] },
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
      { term: "appointment", def: "a scheduled time to see a doctor", ex: "I have a dentist appointment next Tuesday at 2:00.", topics: ["health"] },
      { term: "checkup", def: "a regular doctor visit when you're not sick", ex: "You should go to the doctor for a yearly checkup.", topics: ["health"] },
      { term: "diagnosis", def: "what the doctor says is wrong with you", ex: "The doctor gave him a diagnosis of strep throat.", topics: ["health"] },
      { term: "prescription", def: "a written order from a doctor for medicine", ex: "The doctor wrote a prescription for pain medicine.", topics: ["health"] },
      { term: "fever", def: "when your body temperature is too high", ex: "She has a high fever and needs to rest.", topics: ["health"] },
      { term: "contagious", def: "can spread easily to other people", ex: "The flu is very contagious, so stay home from work.", topics: ["health"] },
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
      { term: "symptom", def: "a sign that something is wrong with your body", ex: "A cough and sore throat are common symptoms of a cold.", topics: ["health"] },
      { term: "temperature", def: "how hot or cold your body is", ex: "The nurse took my temperature to check for a fever.", topics: ["health"] },
      { term: "prescribe", def: "to order medicine for a patient", ex: "The doctor will prescribe antibiotics for the infection.", topics: ["health"] },
      { term: "dose", def: "one measured amount of medicine to take at one time", ex: "Take one dose every six hours as directed.", topics: ["health"] },
      { term: "chronic", def: "lasting a long time, not going away", ex: "She has chronic back pain that never fully goes away.", topics: ["health"] },
      { term: "nutrient", def: "something in food your body needs, like vitamins", ex: "Fruits and vegetables are full of important nutrients.", topics: ["health"] },
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
      { term: "wellness", def: "overall health and well-being", ex: "The company offers a wellness program for employees.", topics: ["health"] },
      { term: "self-care", def: "taking care of your own needs", ex: "Taking time to relax is an important part of self-care.", topics: ["health", "soft-skills"] },
      { term: "relax", def: "to rest and become calm", ex: "I like to relax with a good book after work.", topics: ["health"] },
      { term: "coping skills", def: "ways to handle stress or problems", ex: "Deep breathing is one of my coping skills for stress.", topics: ["health", "soft-skills"] },
      { term: "balance", def: "having the right amount of different things", ex: "A good balance of work and rest keeps you healthy.", topics: ["health", "soft-skills"] },
      { term: "mindful", def: "aware and present in the moment", ex: "Try to be mindful of how much sugar you eat.", topics: ["health", "soft-skills"] },
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
      { term: "processed", def: "changed from natural state", ex: "Try to eat less processed food and more fresh vegetables.", topics: ["health"] },
      { term: "remedy", def: "something you do or take at home to feel better", ex: "Honey and lemon is a good home remedy for a sore throat.", topics: ["health"] },
      { term: "relieve", def: "to make pain or discomfort less", ex: "Ice can help relieve the pain of a sprained ankle.", topics: ["health"] },
      { term: "soothe", def: "to calm or comfort (e.g. a sore throat)", ex: "Warm milk can soothe an upset stomach.", topics: ["health"] },
      { term: "fluids", def: "liquids you drink (water, tea, broth)", ex: "Drink plenty of fluids when you are sick.", topics: ["health"] },
      { term: "ailment", def: "a minor illness or discomfort (e.g. cold, headache)", ex: "Ginger tea is good for a stomach ailment.", topics: ["health"] },
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
      { term: "progress", def: "improvement over time", ex: "You are making good progress in your English class.", topics: ["soft-skills"] },
      { term: "challenge", def: "something difficult", ex: "Learning a new language is a big challenge.", topics: ["soft-skills"] },
      { term: "success", def: "achieving your goal", ex: "Hard work is the key to success.", topics: ["soft-skills"] },
      { term: "accomplish", def: "to finish something successfully", ex: "She accomplished her goal of running a 5K.", topics: ["soft-skills"] },
      { term: "proud", def: "feeling good about achievement", ex: "I am very proud of my son for graduating.", topics: ["soft-skills"] },
      { term: "reflection", def: "thinking about your experience", ex: "Quiet reflection helps me solve problems.", topics: ["soft-skills"] },
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
      { term: "goal", def: "something you want to achieve", ex: "My goal is to save enough money for a car.", topics: ["soft-skills"] },
      { term: "achievement", def: "something you did well or completed", ex: "Winning the award was a great achievement.", topics: ["soft-skills"] },
      { term: "growth", def: "getting better over time", ex: "This job offers many opportunities for personal growth.", topics: ["career-on-the-job", "soft-skills"] },
      { term: "confident", def: "feeling sure of yourself", ex: "She feels confident that she will pass the exam.", topics: ["soft-skills"] },
      { term: "commitment", def: "a promise to keep doing something", ex: "Learning English takes real commitment and practice.", topics: ["soft-skills"] },
      { term: "appreciate", def: "to be thankful for something", ex: "I appreciate all the help my teacher gave me this year.", topics: ["communication"] },
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
