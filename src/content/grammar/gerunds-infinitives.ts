import { InteractiveGuideContent } from "@/types/activity";

export const gerundsInfinitivesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Gerunds & Infinitives: The -ING vs TO Choice",
      icon: "🔄",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.1) 0%, rgba(3, 105, 161, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: #d97757; font-size: 1.25rem;">🎯 The Big Idea</h3>
          <p style="font-size: 1.05rem; margin-bottom: 0;">English verbs can act like nouns, but you must choose: add <strong style="color: #d97757;">-ING</strong> (gerund) or add <strong style="color: #0369a1;">TO</strong> (infinitive). The secret? <strong>Look at what comes BEFORE the verb</strong>. That tells you which form to use!</p>
        </div>

        <p><strong>What You'll Learn:</strong></p>
        <ul>
          <li><strong>Pattern 1:</strong> Subject = Gerund → "Swimming is fun"</li>
          <li><strong>Pattern 2:</strong> Verb + Gerund → "I enjoy reading"</li>
          <li><strong>Pattern 3:</strong> Preposition + Gerund → "I'm interested in learning Spanish"</li>
          <li><strong>Pattern 4:</strong> Adjective + Infinitive → "I'm happy to help"</li>
          <li><strong>Pattern 5:</strong> Noun + Infinitive → "The ability to speak three languages"</li>
          <li><strong>Pattern 6:</strong> Verb + Infinitive → "I want to travel"</li>
          <li><strong>Special Cases:</strong> Verbs that take BOTH (stop, remember, try) with meaning changes</li>
        </ul>

        <div style="background: rgba(3, 105, 161, 0.1); border-left: 4px solid #0369a1; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
          <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
          <p style="margin-bottom: 0.5rem;"><strong>In daily life:</strong></p>
          <ul style="margin: 0.5rem 0 0 0;">
            <li>Talking about hobbies and interests</li>
            <li>Making plans and setting goals</li>
            <li>Expressing feelings and preferences</li>
            <li>Giving thanks and showing appreciation</li>
          </ul>
          <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 The pattern BEFORE the verb tells you which form to use!</p>
        </div>
      `,
      futureChoiceFlow: {
        title: "🧭 Quick Decision Tree: Gerund or Infinitive?",
        description: "Ask yourself: What comes BEFORE the verb?",
        options: [
          {
            form: "going-to" as const,
            trigger: "Is there a PREPOSITION? (in, at, for, about, of, to*)",
            example: "I'm interested in <strong>learning</strong> Spanish.",
            color: "green"
          },
          {
            form: "present-continuous" as const,
            trigger: "Is the verb the SUBJECT of the sentence?",
            example: "<strong>Swimming</strong> is my favorite exercise.",
            color: "cyan"
          },
          {
            form: "will" as const,
            trigger: "Is there an ADJECTIVE? (happy, ready, important)",
            example: "I'm happy <strong>to help</strong> you.",
            color: "violet"
          },
          {
            form: "future-continuous" as const,
            trigger: "Is there a NOUN? (ability, chance, time, decision)",
            example: "I have the ability <strong>to speak</strong> three languages.",
            color: "amber"
          }
        ]
      },
      exercises: [
        {
          id: "intro-exercise",
          title: "Quick Check: Gerund or Infinitive?",
          instructions: "Use the decision tree above to choose the correct form.",
          items: [
            {
              type: "select",
              label: "I'm interested in ___ Spanish. (preposition before verb)",
              options: ["learning", "to learn", "learn"],
              expectedAnswer: "learning"
            },
            {
              type: "select",
              label: "___ is my favorite hobby. (verb is subject)",
              options: ["Reading", "To read", "Read"],
              expectedAnswer: "Reading"
            },
            {
              type: "select",
              label: "I'm happy ___ you. (adjective before verb)",
              options: ["to help", "helping", "help"],
              expectedAnswer: "to help"
            }
          ]
        }
      ]
    },
    {
      id: "real-world-contexts",
      title: "Real-World Contexts: When You'll Use This",
      icon: "🌍",
      explanation: `
        <p>Gerunds and infinitives are everywhere in daily English! Here are <strong>real situations</strong> where you'll use them:</p>
      `,
      usageMeanings: [
        {
          title: "💼 Job Interviews & Career",
          description: "Talking about skills, experience, and professional goals",
          examples: [
            { sentence: "I <strong>enjoy working</strong> with customers.", explanation: "verb + gerund (enjoy)" },
            { sentence: "I'm good <strong>at solving</strong> problems.", explanation: "adjective + preposition + gerund" },
            { sentence: "I have the ability <strong>to work</strong> under pressure.", explanation: "noun + infinitive" },
            { sentence: "I'm interested <strong>in learning</strong> new skills.", explanation: "adjective + preposition + gerund" }
          ]
        },
        {
          title: "🏥 Healthcare Settings",
          description: "Discussing health habits, appointments, and instructions",
          examples: [
            { sentence: "I stopped <strong>smoking</strong> last year.", explanation: "stop + gerund = quit the habit" },
            { sentence: "Remember <strong>to take</strong> your medication.", explanation: "remember + infinitive = don't forget" },
            { sentence: "I'm afraid <strong>of getting</strong> a shot.", explanation: "adjective + preposition + gerund" },
            { sentence: "It's important <strong>to exercise</strong> regularly.", explanation: "adjective + infinitive" }
          ]
        },
        {
          title: "🏠 Housing & Landlords",
          description: "Talking about living situations and making plans",
          examples: [
            { sentence: "I'm tired <strong>of waiting</strong> for repairs.", explanation: "adjective + preposition + gerund" },
            { sentence: "I plan <strong>to move</strong> next month.", explanation: "verb + infinitive (plan)" },
            { sentence: "<strong>Finding</strong> a good apartment is challenging.", explanation: "gerund as subject" },
            { sentence: "Thank you <strong>for fixing</strong> the sink.", explanation: "preposition + gerund" }
          ]
        },
        {
          title: "🏢 Workplace Communication",
          description: "Professional requests, suggestions, and updates",
          examples: [
            { sentence: "I suggest <strong>taking</strong> a break.", explanation: "verb + gerund (suggest)" },
            { sentence: "I finished <strong>writing</strong> the report.", explanation: "verb + gerund (finish)" },
            { sentence: "I need <strong>to leave</strong> early today.", explanation: "verb + infinitive (need)" },
            { sentence: "She offered <strong>to help</strong> with the project.", explanation: "verb + infinitive (offer)" }
          ]
        },
        {
          title: "🎨 Daily Life & Hobbies",
          description: "Talking about interests, preferences, and activities",
          examples: [
            { sentence: "I enjoy <strong>cooking</strong> at home.", explanation: "verb + gerund (enjoy)" },
            { sentence: "<strong>Swimming</strong> is my favorite exercise.", explanation: "gerund as subject" },
            { sentence: "I would like <strong>to try</strong> yoga.", explanation: "verb + infinitive (would like)" },
            { sentence: "Let's go <strong>shopping</strong> this weekend.", explanation: "go + gerund (activities)" }
          ]
        },
        {
          title: "📚 Education & Learning",
          description: "Goals, progress, and educational experiences",
          examples: [
            { sentence: "I plan <strong>to study</strong> nursing.", explanation: "verb + infinitive (plan)" },
            { sentence: "<strong>Learning</strong> English takes time.", explanation: "gerund as subject" },
            { sentence: "I'm considering <strong>taking</strong> online classes.", explanation: "verb + gerund (consider)" },
            { sentence: "I look forward <strong>to graduating</strong> next year.", explanation: "look forward to + gerund (to = preposition!)" }
          ]
        }
      ],
      exercises: [
        {
          id: "real-world-exercise",
          title: "Practice: Real-World Situations",
          instructions: "Complete these sentences from real-life contexts.",
          items: [
            {
              type: "select",
              label: "Job interview: I'm good at ___ problems.",
              options: ["solving", "to solve", "solve"],
              expectedAnswer: "solving"
            },
            {
              type: "select",
              label: "Healthcare: Remember ___ your medication every day.",
              options: ["to take", "taking", "take"],
              expectedAnswer: "to take"
            },
            {
              type: "select",
              label: "Housing: Thank you for ___ the sink.",
              options: ["fixing", "to fix", "fix"],
              expectedAnswer: "fixing"
            },
            {
              type: "select",
              label: "Workplace: I finished ___ the report.",
              options: ["writing", "to write", "write"],
              expectedAnswer: "writing"
            }
          ]
        }
      ]
    },
    {
      id: "definitions",
      stepNumber: 1,
      title: "Quick Definitions",
      icon: "📖",
      explanation: `
        <h3>What is a Gerund?</h3>
        <p>A <strong>gerund</strong> is a verb + -ing that acts as a noun.</p>
        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 5px 10px; border-radius: 4px; font-weight: 600;"><strong>verb + -ing</strong></span></p>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <p><strong>Everyday Examples:</strong></p>
          <ul>
            <li><strong>Swimming</strong> is my favorite exercise.</li>
            <li>I enjoy <strong>reading</strong> mystery novels.</li>
            <li>I'm interested in <strong>learning</strong> French.</li>
          </ul>
        </div>

        <h3>What is an Infinitive?</h3>
        <p>An <strong>infinitive</strong> is "to" + base verb.</p>
        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 5px 10px; border-radius: 4px; font-weight: 600;"><strong>to + verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <p><strong>Everyday Examples:</strong></p>
          <ul>
            <li>I'm happy <strong>to help</strong> you.</li>
            <li>I have the ability <strong>to speak</strong> three languages.</li>
            <li>I want <strong>to visit</strong> Japan someday.</li>
          </ul>
        </div>

        <div style="background-color: #fff3cd; border-left: 4px solid #f4d35e; padding: 15px; margin: 20px 0;">
          <p><strong>💡 Key Point:</strong> Both gerunds and infinitives are verb forms used as nouns, but they follow different rules depending on what comes before them.</p>
        </div>
      `,
      comparison: {
        title: "⚡ Gerund vs Infinitive at a Glance",
        leftLabel: "Gerund (-ING)",
        rightLabel: "Infinitive (TO + verb)",
        rows: [
          { label: "Form", left: "verb + <strong>-ing</strong>", right: "<strong>to</strong> + base verb" },
          { label: "After prepositions", left: "✅ <strong>ALWAYS</strong> used", right: "❌ Never used" },
          { label: "As subject", left: "✅ Common & natural", right: "⚠️ Formal / old-fashioned" },
          { label: "After adjective", left: "⚠️ Only with preposition<br/>(good <em>at</em> doing)", right: "✅ Common<br/>(happy <em>to</em> help)" },
          { label: "After noun", left: "❌ Rare", right: "✅ Common<br/>(ability <em>to</em> speak)" },
          { label: "After certain verbs", left: "enjoy, finish, avoid, suggest", right: "want, hope, plan, decide" },
          { label: "Example", left: "<strong>Swimming</strong> is fun.", right: "I want <strong>to swim</strong>." }
        ]
      },
      exercises: [
        {
          id: "definitions-exercise",
          title: "Identify: Gerund or Infinitive?",
          instructions: "Is the underlined word a gerund or infinitive?",
          items: [
            {
              type: "radio",
              label: "'Swimming is fun.' - What is 'swimming'?",
              options: [
                { value: "gerund", label: "Gerund (verb + -ing acting as noun)" },
                { value: "infinitive", label: "Infinitive (to + verb)" }
              ],
              expectedAnswer: "gerund"
            },
            {
              type: "radio",
              label: "'I want to learn.' - What is 'to learn'?",
              options: [
                { value: "gerund", label: "Gerund (verb + -ing acting as noun)" },
                { value: "infinitive", label: "Infinitive (to + verb)" }
              ],
              expectedAnswer: "infinitive"
            },
            {
              type: "radio",
              label: "'I enjoy reading.' - What is 'reading'?",
              options: [
                { value: "gerund", label: "Gerund (verb + -ing acting as noun)" },
                { value: "infinitive", label: "Infinitive (to + verb)" }
              ],
              expectedAnswer: "gerund"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-1",
      stepNumber: 2,
      title: "Pattern 1: Subject = Gerund",
      icon: "1️⃣",
      explanation: `
        <p>When a verb is the <strong>subject</strong> of a sentence, use the <strong>gerund (-ing)</strong> form.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Gerund + verb + ...</strong></span></p>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Sports & Exercise:</h4>
          <ul>
            <li><strong>Swimming</strong> is excellent exercise.</li>
            <li><strong>Running</strong> every morning keeps you healthy.</li>
            <li><strong>Dancing</strong> is a fun way to stay active.</li>
          </ul>

          <h4>Hobbies & Interests:</h4>
          <ul>
            <li><strong>Reading</strong> helps you improve your English.</li>
            <li><strong>Cooking</strong> at home saves money.</li>
            <li><strong>Traveling</strong> teaches you about other cultures.</li>
            <li><strong>Painting</strong> is very relaxing.</li>
          </ul>

          <h4>Daily Life:</h4>
          <ul>
            <li><strong>Learning</strong> a new language takes time.</li>
            <li><strong>Saving</strong> money is important for the future.</li>
            <li><strong>Finding</strong> a good apartment in Boston can be challenging.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "When the verb is the subject (the main topic), it must be a gerund, not an infinitive. ✅ Swimming is fun. ❌ To swim is fun. (less common)"
      },
      exercises: [
        {
          id: "pattern-1-exercise",
          title: "Practice: Using Gerunds as Subjects",
          instructions: "Choose the correct form to complete each sentence.",
          items: [
            {
              type: "select",
              label: "___ a new language takes practice and patience.",
              options: ["Learning", "To learn", "Learn"],
              expectedAnswer: "Learning"
            },
            {
              type: "select",
              label: "___ is my favorite hobby.",
              options: ["Reading", "To read", "Read"],
              expectedAnswer: "Reading"
            },
            {
              type: "select",
              label: "___ helps you stay healthy.",
              options: ["Exercising", "To exercise", "Exercise"],
              expectedAnswer: "Exercising"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-2",
      stepNumber: 3,
      title: "Pattern 2: Verb + Gerund",
      icon: "2️⃣",
      explanation: `
        <p>Certain verbs are always followed by <strong>gerunds (-ing)</strong>, never infinitives.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Subject + Verb + Gerund</strong></span></p>

        <h3>Common Verbs + Gerund</h3>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Preferences & Enjoyment:</h4>
          <ul>
            <li><strong>enjoy:</strong> I enjoy <strong>reading</strong> mystery novels.</li>
            <li><strong>like:</strong> I like <strong>cooking</strong> new recipes.</li>
            <li><strong>love:</strong> She loves <strong>listening</strong> to music.</li>
            <li><strong>prefer:</strong> I prefer <strong>walking</strong> to driving.</li>
          </ul>

          <h4>Actions & Completion:</h4>
          <ul>
            <li><strong>finish:</strong> I finished <strong>cleaning</strong> the house yesterday.</li>
            <li><strong>keep:</strong> Keep <strong>practicing</strong> your English!</li>
            <li><strong>stop:</strong> I stopped <strong>drinking</strong> coffee at night. (I quit)</li>
            <li><strong>quit:</strong> She quit <strong>smoking</strong> last year.</li>
          </ul>

          <h4>Avoidance:</h4>
          <ul>
            <li><strong>avoid:</strong> I avoid <strong>eating</strong> too much sugar.</li>
            <li><strong>miss:</strong> I miss <strong>spending</strong> time with my family.</li>
          </ul>

          <h4>Consideration & Advice:</h4>
          <ul>
            <li><strong>consider:</strong> I'm considering <strong>moving</strong> to a bigger apartment.</li>
            <li><strong>suggest:</strong> I suggest <strong>taking</strong> the train instead of driving.</li>
            <li><strong>recommend:</strong> I recommend <strong>visiting</strong> the museum on weekdays.</li>
          </ul>
        </div>
      `,
      verbTable: {
        title: "📋 Common Verbs + GERUND",
        headers: ["Category", "Verbs", "Example"],
        rows: [
          ["😊 Enjoyment", "enjoy, like, love, prefer", "I <strong>enjoy reading</strong>."],
          ["✅ Completion", "finish, keep, quit, stop", "I <strong>finished cleaning</strong>."],
          ["🚫 Avoidance", "avoid, miss, risk", "I <strong>avoid eating</strong> sugar."],
          ["🤔 Consideration", "consider, suggest, recommend", "I <strong>suggest taking</strong> the bus."],
          ["🗣️ Admission", "admit, deny, mention", "He <strong>admitted stealing</strong> it."]
        ]
      },
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take gerunds, never infinitives. ✅ I enjoy swimming. ❌ I enjoy to swim."
      },
      exercises: [
        {
          id: "pattern-2-exercise",
          title: "Practice: Verbs + Gerunds",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I finished ___ the book last night.",
              options: ["reading", "to read", "read"],
              expectedAnswer: "reading"
            },
            {
              type: "select",
              label: "I suggest ___ the museum on Saturday.",
              options: ["visiting", "to visit", "visit"],
              expectedAnswer: "visiting"
            },
            {
              type: "select",
              label: "She loves ___ to music while she works.",
              options: ["listening", "to listen", "listen"],
              expectedAnswer: "listening"
            }
          ]
        },
        {
          id: "pattern-2-word-select",
          title: "Find the Gerund",
          instructions: "Click on the gerund in each sentence.",
          items: [
            {
              type: "word-select",
              label: "Click on the gerund:",
              selectWhat: "the gerund",
              tokens: [
                { text: "I", after: " " },
                { text: "enjoy", after: " " },
                { text: "reading", isTarget: true, after: " " },
                { text: "mystery", after: " " },
                { text: "novels", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Click on the gerund:",
              selectWhat: "the gerund",
              tokens: [
                { text: "She", after: " " },
                { text: "keeps", after: " " },
                { text: "practicing", isTarget: true, after: " " },
                { text: "her", after: " " },
                { text: "English", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Click on the gerund:",
              selectWhat: "the gerund",
              tokens: [
                { text: "I", after: " " },
                { text: "recommend", after: " " },
                { text: "visiting", isTarget: true, after: " " },
                { text: "the", after: " " },
                { text: "museum", after: "." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "pattern-3",
      stepNumber: 4,
      title: "Pattern 3: Preposition + Gerund (CRITICAL RULE!)",
      icon: "3️⃣",
      explanation: `
        <p><strong>Golden Rule:</strong> After a preposition, ALWAYS use a <strong>gerund (-ing)</strong>, never an infinitive.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Preposition + Gerund</strong></span></p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p><strong>⚠️ CRITICAL RULE:</strong> After a preposition → ALWAYS gerund</p>
          <p>✅ I'm interested <strong>in learning</strong> French.<br>
          ❌ I'm interested <strong>in to learn</strong> French.</p>
        </div>

        <h3>Common Preposition + Gerund Patterns</h3>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Adjective + Preposition + Gerund:</h4>
          <ul>
            <li><strong>interested in:</strong> I'm interested in <strong>learning</strong> to play guitar.</li>
            <li><strong>good at:</strong> She's good at <strong>solving</strong> puzzles.</li>
            <li><strong>worried about:</strong> I'm worried about <strong>forgetting</strong> my password.</li>
            <li><strong>excited about:</strong> We're excited about <strong>visiting</strong> New York.</li>
            <li><strong>tired of:</strong> I'm tired of <strong>waiting</strong> in line.</li>
            <li><strong>afraid of:</strong> She's afraid of <strong>flying</strong>.</li>
          </ul>

          <h4>Common Phrases with Prepositions:</h4>
          <ul>
            <li><strong>thank you for:</strong> Thank you for <strong>helping</strong> me.</li>
            <li><strong>look forward to:</strong> I look forward to <strong>seeing</strong> you. (to = preposition here!)</li>
            <li><strong>by:</strong> I improved my English <strong>by reading</strong> every day.</li>
            <li><strong>instead of:</strong> Let's walk <strong>instead of driving</strong>.</li>
          </ul>

          <h4>Time Prepositions:</h4>
          <ul>
            <li><strong>before:</strong> Wash your hands <strong>before eating</strong>.</li>
            <li><strong>after:</strong> I'll call you <strong>after finishing</strong> my homework.</li>
            <li><strong>without:</strong> She left <strong>without saying</strong> goodbye.</li>
          </ul>
        </div>
      `,
      verbTable: {
        title: "📋 Common Preposition Patterns",
        headers: ["Pattern", "Example"],
        rows: [
          ["interested <strong>in</strong>", "I'm interested in <strong>learning</strong> French."],
          ["good/bad <strong>at</strong>", "She's good at <strong>solving</strong> puzzles."],
          ["worried <strong>about</strong>", "I'm worried about <strong>failing</strong>."],
          ["tired <strong>of</strong>", "I'm tired of <strong>waiting</strong>."],
          ["thank you <strong>for</strong>", "Thank you for <strong>helping</strong> me."],
          ["look forward <strong>to</strong> ⚠️", "I look forward to <strong>seeing</strong> you."],
          ["be used <strong>to</strong> ⚠️", "I'm used to <strong>waking</strong> up early."],
          ["instead <strong>of</strong>", "Let's walk instead of <strong>driving</strong>."]
        ]
      },
      tipBox: {
        title: "💡 Common Mistake Alert",
        content: "'to' can be BOTH an infinitive marker AND a preposition! As infinitive marker: I want to learn. As preposition: I look forward to learning. Other examples with 'to' as preposition: be used to, be accustomed to, object to"
      },
      exercises: [
        {
          id: "pattern-3-exercise",
          title: "Practice: Preposition + Gerund",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "Thank you for ___ me with my homework.",
              options: ["helping", "to help", "help"],
              expectedAnswer: "helping"
            },
            {
              type: "select",
              label: "I'm interested in ___ more about Italian culture.",
              options: ["learning", "to learn", "learn"],
              expectedAnswer: "learning"
            },
            {
              type: "select",
              label: "I look forward to ___ you next week.",
              options: ["seeing", "to see", "see"],
              expectedAnswer: "seeing"
            }
          ]
        },
        {
          id: "pattern-3-word-scramble",
          title: "Build the Sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Thank someone for their help:",
              words: ["Thank", "you", "for", "helping", "me"],
              correctAnswer: "Thank you for helping me",
              hint: "Start with 'Thank you'"
            },
            {
              type: "word-scramble",
              label: "Express interest in learning:",
              words: ["I'm", "interested", "in", "learning", "Spanish"],
              correctAnswer: "I'm interested in learning Spanish",
              hint: "Start with 'I'm interested'"
            },
            {
              type: "word-scramble",
              label: "Express anticipation:",
              words: ["I", "look", "forward", "to", "seeing", "you"],
              correctAnswer: "I look forward to seeing you",
              hint: "'look forward to' is followed by -ing"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-4",
      stepNumber: 5,
      title: "Pattern 4: Adjective + Infinitive",
      icon: "4️⃣",
      explanation: `
        <p>After certain adjectives, use the <strong>infinitive (to + verb)</strong>.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Adjective + to + Verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Feelings & Emotions:</h4>
          <ul>
            <li><strong>happy:</strong> I'm happy <strong>to help</strong> you.</li>
            <li><strong>excited:</strong> I'm excited <strong>to travel</strong> to Paris.</li>
            <li><strong>glad:</strong> I'm glad <strong>to meet</strong> you.</li>
            <li><strong>sad:</strong> I'm sad <strong>to leave</strong> my friends.</li>
            <li><strong>surprised:</strong> I'm surprised <strong>to see</strong> you here!</li>
          </ul>

          <h4>Readiness & Eagerness:</h4>
          <ul>
            <li><strong>ready:</strong> I'm ready <strong>to go</strong> now.</li>
            <li><strong>eager:</strong> She's eager <strong>to learn</strong> Spanish.</li>
            <li><strong>willing:</strong> I'm willing <strong>to wait</strong> if needed.</li>
          </ul>

          <h4>Ability & Difficulty:</h4>
          <ul>
            <li><strong>able:</strong> I'm able <strong>to swim</strong> one mile.</li>
            <li><strong>easy:</strong> This book is easy <strong>to read</strong>.</li>
            <li><strong>hard/difficult:</strong> Chinese is difficult <strong>to learn</strong>.</li>
          </ul>

          <h4>Importance & Necessity:</h4>
          <ul>
            <li><strong>important:</strong> It's important <strong>to exercise</strong> regularly.</li>
            <li><strong>necessary:</strong> It's necessary <strong>to wear</strong> a coat in winter.</li>
            <li><strong>essential:</strong> It's essential <strong>to drink</strong> water every day.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Adjective + to + verb is perfect for expressing feelings and opinions: 'I'm happy to help!' 'It's important to study.' 'I'm excited to see you!'"
      },
      exercises: [
        {
          id: "pattern-4-exercise",
          title: "Practice: Adjective + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I'm happy ___ you.",
              options: ["to help", "helping", "help"],
              expectedAnswer: "to help"
            },
            {
              type: "select",
              label: "It's important ___ healthy food.",
              options: ["to eat", "eating", "eat"],
              expectedAnswer: "to eat"
            },
            {
              type: "select",
              label: "She's excited ___ her grandmother next month.",
              options: ["to visit", "visiting", "visit"],
              expectedAnswer: "to visit"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-5",
      stepNumber: 6,
      title: "Pattern 5: Noun + Infinitive",
      icon: "5️⃣",
      explanation: `
        <p>After certain nouns, use the <strong>infinitive (to + verb)</strong>.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Noun + to + Verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Abilities & Skills:</h4>
          <ul>
            <li><strong>ability:</strong> I have the ability <strong>to speak</strong> three languages.</li>
            <li><strong>skill:</strong> She has the skill <strong>to play</strong> piano beautifully.</li>
            <li><strong>talent:</strong> He has a talent <strong>to make</strong> people laugh.</li>
          </ul>

          <h4>Opportunities & Chances:</h4>
          <ul>
            <li><strong>opportunity:</strong> I have the opportunity <strong>to study</strong> abroad.</li>
            <li><strong>chance:</strong> This is your chance <strong>to learn</strong> something new.</li>
          </ul>

          <h4>Time & Planning:</h4>
          <ul>
            <li><strong>time:</strong> I don't have time <strong>to cook</strong> tonight.</li>
            <li><strong>plan:</strong> I have a plan <strong>to save</strong> $5,000 this year.</li>
            <li><strong>decision:</strong> I made the decision <strong>to move</strong> to Boston.</li>
            <li><strong>promise:</strong> I made a promise <strong>to call</strong> my mother every week.</li>
          </ul>

          <h4>Need & Desire:</h4>
          <ul>
            <li><strong>need:</strong> I have a need <strong>to exercise</strong> more often.</li>
            <li><strong>desire:</strong> She has a strong desire <strong>to travel</strong> the world.</li>
            <li><strong>way:</strong> There's no way <strong>to finish</strong> this by tomorrow.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Noun + infinitive is perfect for describing abilities and plans: 'I have the ability to swim.' 'I made a plan to save money.' 'She has a talent to sing.'"
      },
      exercises: [
        {
          id: "pattern-5-exercise",
          title: "Practice: Noun + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I have the ability ___ very fast.",
              options: ["to run", "running", "run"],
              expectedAnswer: "to run"
            },
            {
              type: "select",
              label: "I made the decision ___ to California.",
              options: ["to move", "moving", "move"],
              expectedAnswer: "to move"
            },
            {
              type: "select",
              label: "This is your chance ___ a new language.",
              options: ["to learn", "learning", "learn"],
              expectedAnswer: "to learn"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-6",
      stepNumber: 7,
      title: "Pattern 6: Verb + Infinitive",
      icon: "6️⃣",
      explanation: `
        <p>Certain verbs are always followed by <strong>infinitives (to + verb)</strong>, never gerunds.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Subject + Verb + to + Verb</strong></span></p>

        <h3>Common Verbs + Infinitive</h3>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Goals & Aspirations:</h4>
          <ul>
            <li><strong>want:</strong> I want <strong>to visit</strong> Japan someday.</li>
            <li><strong>hope:</strong> I hope <strong>to see</strong> you soon.</li>
            <li><strong>expect:</strong> I expect <strong>to arrive</strong> around 6pm.</li>
            <li><strong>would like:</strong> I would like <strong>to order</strong> pizza tonight.</li>
          </ul>

          <h4>Planning & Decisions:</h4>
          <ul>
            <li><strong>plan:</strong> I plan <strong>to study</strong> medicine.</li>
            <li><strong>decide:</strong> I decided <strong>to buy</strong> a new car.</li>
            <li><strong>choose:</strong> She chose <strong>to stay</strong> home tonight.</li>
            <li><strong>intend:</strong> I intend <strong>to finish</strong> this book by Friday.</li>
          </ul>

          <h4>Learning & Skills:</h4>
          <ul>
            <li><strong>learn:</strong> I'm learning <strong>to cook</strong> Italian food.</li>
            <li><strong>need:</strong> I need <strong>to practice</strong> my pronunciation.</li>
            <li><strong>try:</strong> I'm trying <strong>to eat</strong> healthier. (attempting)</li>
          </ul>

          <h4>Offers & Promises:</h4>
          <ul>
            <li><strong>offer:</strong> She offered <strong>to drive</strong> me to the airport.</li>
            <li><strong>promise:</strong> I promise <strong>to call</strong> you tomorrow.</li>
            <li><strong>agree:</strong> We agreed <strong>to meet</strong> at 7pm.</li>
            <li><strong>refuse:</strong> He refused <strong>to answer</strong> the question.</li>
          </ul>
        </div>
      `,
      verbTable: {
        title: "📋 Common Verbs + INFINITIVE",
        headers: ["Category", "Verbs", "Example"],
        rows: [
          ["🎯 Goals", "want, hope, expect, wish", "I <strong>want to visit</strong> Japan."],
          ["📅 Plans", "plan, decide, choose, intend", "I <strong>decided to stay</strong>."],
          ["📚 Learning", "learn, need, try (effort)", "I'm <strong>learning to cook</strong>."],
          ["🤝 Offers", "offer, promise, agree, refuse", "She <strong>offered to help</strong>."]
        ]
      },
      comparison: {
        title: "⚡ Gerund Verbs vs Infinitive Verbs",
        leftLabel: "Always + Gerund",
        rightLabel: "Always + Infinitive",
        rows: [
          { label: "Enjoyment", left: "enjoy, like, love", right: "want, hope, wish" },
          { label: "Completion", left: "finish, keep, quit", right: "plan, decide, choose" },
          { label: "Other", left: "avoid, suggest, consider", right: "need, learn, agree" },
          { label: "Common Error", left: "❌ I enjoy <em>to read</em>", right: "❌ I want <em>reading</em>" },
          { label: "Correct Form", left: "✅ I enjoy <em>reading</em>", right: "✅ I want <em>to read</em>" }
        ]
      },
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take infinitives, never gerunds. ✅ I want to travel. ❌ I want traveling."
      },
      exercises: [
        {
          id: "pattern-6-exercise",
          title: "Practice: Verbs + Infinitives",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I hope ___ you at the party.",
              options: ["to see", "seeing", "see"],
              expectedAnswer: "to see"
            },
            {
              type: "select",
              label: "She decided ___ a new apartment.",
              options: ["to rent", "renting", "rent"],
              expectedAnswer: "to rent"
            },
            {
              type: "select",
              label: "I need ___ more English.",
              options: ["to practice", "practicing", "practice"],
              expectedAnswer: "to practice"
            }
          ]
        },
        {
          id: "pattern-6-word-scramble",
          title: "Build the Sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Express a goal:",
              words: ["I", "want", "to", "learn", "Spanish"],
              correctAnswer: "I want to learn Spanish",
              hint: "want + to + verb"
            },
            {
              type: "word-scramble",
              label: "Make a plan:",
              words: ["She", "decided", "to", "move", "to", "Boston"],
              correctAnswer: "She decided to move to Boston",
              hint: "decide + to + verb"
            }
          ]
        }
      ]
    },
    {
      id: "special-cases",
      stepNumber: 8,
      title: "Special Cases: Stop, Remember, Try",
      icon: "⚠️",
      explanation: `
        <p>Some verbs can be followed by BOTH gerunds and infinitives, but the <strong>meaning changes</strong>!</p>

        <h3>Stop + Gerund vs Stop + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>stop + gerund</strong> = quit doing something</p>
          <p>Example: I stopped <strong>smoking</strong>. (I quit the habit)</p>
          <p style="margin-top: 1rem;"><strong>stop + infinitive</strong> = pause one activity to do another</p>
          <p>Example: I stopped <strong>to buy</strong> gas. (I paused my trip to buy gas)</p>
        </div>

        <h3>Remember + Gerund vs Remember + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>remember + gerund</strong> = recall a past event</p>
          <p>Example: I remember <strong>meeting</strong> you at the party. (I have a memory of it)</p>
          <p style="margin-top: 1rem;"><strong>remember + infinitive</strong> = not forget to do something (future/present)</p>
          <p>Example: Remember <strong>to call</strong> your mother. (Don't forget!)</p>
        </div>

        <h3>Try + Gerund vs Try + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>try + gerund</strong> = experiment with something to see if it works</p>
          <p>Example: I'm tired. I'll try <strong>drinking</strong> coffee. (Let's see if coffee helps)</p>
          <p style="margin-top: 1rem;"><strong>try + infinitive</strong> = make an effort, attempt</p>
          <p>Example: I'm trying <strong>to learn</strong> Spanish. (I'm making an effort)</p>
        </div>
      `,
      timeline: {
        title: "⏰ Remember: Past Memory vs Future Duty",
        description: "The direction of time changes the meaning!",
        events: [
          { label: "I remember meeting you at the party.", order: 1, tenseLabel: "PAST (memory)" },
          { label: "NOW", order: 2, tenseLabel: "Present moment" },
          { label: "Remember to call your mother tonight.", order: 3, tenseLabel: "FUTURE (duty)" }
        ]
      },
      usageMeanings: [
        {
          title: "🛑 STOP + Gerund = Quit the Activity",
          description: "The activity ends permanently or temporarily",
          examples: [
            { sentence: "I stopped <strong>smoking</strong>.", explanation: "I quit the habit of smoking." },
            { sentence: "He stopped <strong>eating</strong> junk food.", explanation: "He quit eating junk food." },
            { sentence: "She stopped <strong>watching</strong> TV late at night.", explanation: "She quit that habit." }
          ]
        },
        {
          title: "⏸️ STOP + Infinitive = Pause to Do Something",
          description: "You pause one activity to start another",
          examples: [
            { sentence: "I stopped <strong>to buy</strong> coffee.", explanation: "I was walking, paused, bought coffee." },
            { sentence: "She stopped <strong>to answer</strong> the phone.", explanation: "She paused her work to answer." },
            { sentence: "We stopped <strong>to take</strong> a photo.", explanation: "We paused our walk to take a photo." }
          ]
        },
        {
          title: "🧠 REMEMBER + Gerund = Past Memory",
          description: "You recall something that already happened",
          examples: [
            { sentence: "I remember <strong>meeting</strong> you.", explanation: "I have a memory of when we met." },
            { sentence: "She remembers <strong>visiting</strong> Paris.", explanation: "She has a memory of visiting Paris." }
          ]
        },
        {
          title: "📝 REMEMBER + Infinitive = Future Duty",
          description: "Don't forget to do something (it hasn't happened yet)",
          examples: [
            { sentence: "Remember <strong>to call</strong> your mother.", explanation: "Don't forget! (future action)" },
            { sentence: "Remember <strong>to take</strong> your keys.", explanation: "Don't forget! (before leaving)" }
          ]
        },
        {
          title: "🔬 TRY + Gerund = Experiment",
          description: "Test something to see if it works",
          examples: [
            { sentence: "Try <strong>drinking</strong> water.", explanation: "Let's see if water helps." },
            { sentence: "Try <strong>restarting</strong> the computer.", explanation: "Let's see if restarting fixes it." }
          ]
        },
        {
          title: "💪 TRY + Infinitive = Make an Effort",
          description: "Attempt something difficult",
          examples: [
            { sentence: "I'm trying <strong>to learn</strong> Spanish.", explanation: "I'm making an effort to learn." },
            { sentence: "He tried <strong>to open</strong> the door.", explanation: "He attempted to open it (maybe it was hard)." }
          ]
        }
      ],
      tipBox: {
        title: "💡 Quick Test",
        content: "Is it about the PAST (gerund) or FUTURE (infinitive)? 'I remember seeing you' (past memory) vs 'Remember to call' (future action)"
      },
      exercises: [
        {
          id: "special-cases-exercise",
          title: "Practice: Stop, Remember, Try",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "I stopped ___ TV at midnight. (I quit the habit)",
              options: [
                { value: "watching", label: "watching (quit the habit)" },
                { value: "to-watch", label: "to watch (paused to do it)" }
              ],
              expectedAnswer: "watching"
            },
            {
              type: "radio",
              label: "Remember ___ your keys before leaving. (Don't forget!)",
              options: [
                { value: "taking", label: "taking (past memory)" },
                { value: "to-take", label: "to take (don't forget)" }
              ],
              expectedAnswer: "to-take"
            },
            {
              type: "radio",
              label: "If you have a headache, try ___ some water. (Experiment)",
              options: [
                { value: "drinking", label: "drinking (experiment)" },
                { value: "to-drink", label: "to drink (make an effort)" }
              ],
              expectedAnswer: "drinking"
            }
          ]
        }
      ]
    },
    {
      id: "verbs-both",
      stepNumber: 9,
      title: "Verbs That Take BOTH (Same Meaning)",
      icon: "🔀",
      explanation: `
        <p>Some verbs can be followed by <strong>either</strong> a gerund OR an infinitive with <strong>no change in meaning</strong>!</p>

        <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 119, 87, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
          <h3 style="margin-top: 0; color: #8b5cf6;">✨ Good News!</h3>
          <p style="margin-bottom: 0;">These verbs are <strong>flexible</strong> – you can use gerund OR infinitive and the meaning stays the same.</p>
        </div>

        <h3>Verbs with No Meaning Difference</h3>
        <div style="background-color: rgba(139, 92, 246, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2);">
          <ul>
            <li><strong>begin:</strong> It began <strong>raining</strong>. = It began <strong>to rain</strong>.</li>
            <li><strong>start:</strong> I started <strong>working</strong>. = I started <strong>to work</strong>.</li>
            <li><strong>continue:</strong> She continued <strong>studying</strong>. = She continued <strong>to study</strong>.</li>
            <li><strong>hate:</strong> I hate <strong>waiting</strong>. = I hate <strong>to wait</strong>.</li>
            <li><strong>like:</strong> I like <strong>swimming</strong>. = I like <strong>to swim</strong>.</li>
            <li><strong>love:</strong> She loves <strong>dancing</strong>. = She loves <strong>to dance</strong>.</li>
            <li><strong>prefer:</strong> I prefer <strong>walking</strong>. = I prefer <strong>to walk</strong>.</li>
          </ul>
        </div>

        <div style="background-color: #fff3cd; border-left: 4px solid #f4d35e; padding: 15px; margin: 20px 0;">
          <p><strong>⚠️ Note:</strong> While both forms work, native speakers often prefer gerunds for general statements and infinitives for specific situations.</p>
          <ul style="margin: 0.5rem 0 0 0;">
            <li>"I like <strong>swimming</strong>." (general hobby)</li>
            <li>"I'd like <strong>to swim</strong> tomorrow." (specific plan)</li>
          </ul>
        </div>
      `,
      comparison: {
        title: "Both Forms OK – Same Meaning",
        leftLabel: "With Gerund",
        rightLabel: "With Infinitive",
        rows: [
          { label: "begin", left: "It began <em>raining</em>.", right: "It began <em>to rain</em>." },
          { label: "start", left: "I started <em>working</em>.", right: "I started <em>to work</em>." },
          { label: "continue", left: "She continued <em>studying</em>.", right: "She continued <em>to study</em>." },
          { label: "like", left: "I like <em>reading</em>.", right: "I like <em>to read</em>." },
          { label: "love", left: "He loves <em>cooking</em>.", right: "He loves <em>to cook</em>." },
          { label: "hate", left: "I hate <em>waiting</em>.", right: "I hate <em>to wait</em>." }
        ]
      },
      tipBox: {
        title: "💡 Easy Win!",
        content: "With begin, start, continue, like, love, hate, prefer – you can't go wrong! Both forms are correct with the same meaning."
      },
      exercises: [
        {
          id: "verbs-both-exercise",
          title: "Practice: Both Forms OK",
          instructions: "Both answers are correct! Choose either one.",
          items: [
            {
              type: "select",
              label: "It started ___. (both correct!)",
              options: ["raining", "to rain"],
              expectedAnswers: ["raining", "to rain"]
            },
            {
              type: "select",
              label: "She continued ___. (both correct!)",
              options: ["working", "to work"],
              expectedAnswers: ["working", "to work"]
            },
            {
              type: "select",
              label: "I love ___. (both correct!)",
              options: ["cooking", "to cook"],
              expectedAnswers: ["cooking", "to cook"]
            }
          ]
        },
        {
          id: "verbs-both-contrast",
          title: "Contrast: Flexible vs Fixed Verbs",
          instructions: "Is this verb flexible (both forms OK) or fixed (only one form)?",
          items: [
            {
              type: "radio",
              label: "'begin' - Can it take both gerund AND infinitive?",
              options: [
                { value: "yes", label: "Yes - both forms work (began raining / began to rain)" },
                { value: "no", label: "No - only one form works" }
              ],
              expectedAnswer: "yes"
            },
            {
              type: "radio",
              label: "'enjoy' - Can it take both gerund AND infinitive?",
              options: [
                { value: "yes", label: "Yes - both forms work" },
                { value: "no", label: "No - only gerund works (enjoy reading, NOT enjoy to read)" }
              ],
              expectedAnswer: "no"
            },
            {
              type: "radio",
              label: "'want' - Can it take both gerund AND infinitive?",
              options: [
                { value: "yes", label: "Yes - both forms work" },
                { value: "no", label: "No - only infinitive works (want to read, NOT want reading)" }
              ],
              expectedAnswer: "no"
            }
          ]
        }
      ]
    },
    {
      id: "go-gerund",
      stepNumber: 10,
      title: "GO + Gerund for Activities",
      icon: "🏃",
      explanation: `
        <p>Use <strong>go + gerund</strong> for recreational activities and sports!</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>go + verb-ing</strong></span></p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p><strong>⚠️ Common Mistake:</strong></p>
          <p>❌ "I go <em>to swim</em>" or "I go <em>to shop</em>"</p>
          <p>✅ "I go <strong>swimming</strong>" or "I go <strong>shopping</strong>"</p>
        </div>

        <h3>Common "Go + Gerund" Activities</h3>
        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>🏊 Water & Outdoor:</h4>
          <ul>
            <li>go <strong>swimming</strong></li>
            <li>go <strong>fishing</strong></li>
            <li>go <strong>hiking</strong></li>
            <li>go <strong>camping</strong></li>
            <li>go <strong>skiing</strong></li>
          </ul>

          <h4>🏃 Sports & Exercise:</h4>
          <ul>
            <li>go <strong>running</strong></li>
            <li>go <strong>jogging</strong></li>
            <li>go <strong>cycling</strong></li>
            <li>go <strong>bowling</strong></li>
            <li>go <strong>dancing</strong></li>
          </ul>

          <h4>🛍️ Everyday Activities:</h4>
          <ul>
            <li>go <strong>shopping</strong></li>
            <li>go <strong>sightseeing</strong></li>
            <li>go <strong>clubbing</strong></li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "When talking about recreational activities with 'go', always use the gerund: go swimming, go shopping, go hiking. Never use 'go to swim' or 'go to shop'."
      },
      exercises: [
        {
          id: "go-gerund-exercise",
          title: "Practice: GO + Gerund",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "Let's go ___ this weekend.",
              options: ["hiking", "to hike", "hike"],
              expectedAnswer: "hiking"
            },
            {
              type: "select",
              label: "We went ___ at the lake yesterday.",
              options: ["fishing", "to fish", "fish"],
              expectedAnswer: "fishing"
            },
            {
              type: "select",
              label: "Do you want to go ___ with me?",
              options: ["shopping", "to shop", "shop"],
              expectedAnswer: "shopping"
            }
          ]
        },
        {
          id: "go-gerund-word-scramble",
          title: "Build the Sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "A weekend activity:",
              words: ["We", "went", "swimming", "at", "the", "beach"],
              correctAnswer: "We went swimming at the beach",
              hint: "go + gerund"
            },
            {
              type: "word-scramble",
              label: "Make a suggestion:",
              words: ["Let's", "go", "dancing", "tonight"],
              correctAnswer: "Let's go dancing tonight",
              hint: "go + gerund"
            }
          ]
        }
      ]
    },
    {
      id: "common-mistakes",
      stepNumber: 11,
      title: "Common Mistakes to Avoid",
      icon: "🚫",
      explanation: `
        <p>Here are the <strong>most common errors</strong> students make with gerunds and infinitives – and how to fix them!</p>

        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: #ef4444; font-size: 1.25rem;">🎯 Learning from Mistakes</h3>
          <p style="margin-bottom: 0;">Recognizing these common errors will help you avoid them and sound more natural in English!</p>
        </div>
      `,
      usageMeanings: [
        {
          title: "❌ Mistake #1: Infinitive After Prepositions",
          description: "NEVER use infinitive after a preposition – always use gerund!",
          examples: [
            { sentence: "❌ I'm interested in <strong>to learn</strong> Spanish.", explanation: "WRONG – infinitive after preposition" },
            { sentence: "✅ I'm interested in <strong>learning</strong> Spanish.", explanation: "CORRECT – gerund after preposition" },
            { sentence: "❌ She's good at <strong>to solve</strong> problems.", explanation: "WRONG – infinitive after preposition" },
            { sentence: "✅ She's good at <strong>solving</strong> problems.", explanation: "CORRECT – gerund after preposition" }
          ]
        },
        {
          title: "❌ Mistake #2: Wrong Verb + Form Combination",
          description: "Some verbs ONLY take gerund, others ONLY take infinitive",
          examples: [
            { sentence: "❌ I <strong>enjoy to read</strong> books.", explanation: "WRONG – enjoy always takes gerund" },
            { sentence: "✅ I <strong>enjoy reading</strong> books.", explanation: "CORRECT – enjoy + gerund" },
            { sentence: "❌ I <strong>want reading</strong> a book.", explanation: "WRONG – want always takes infinitive" },
            { sentence: "✅ I <strong>want to read</strong> a book.", explanation: "CORRECT – want + infinitive" }
          ]
        },
        {
          title: "❌ Mistake #3: 'TO' as Preposition Confusion",
          description: "In some phrases, 'to' is a preposition (not infinitive) – use gerund!",
          examples: [
            { sentence: "❌ I look forward to <strong>see</strong> you.", explanation: "WRONG – 'to' is a preposition here" },
            { sentence: "✅ I look forward to <strong>seeing</strong> you.", explanation: "CORRECT – preposition + gerund" },
            { sentence: "❌ I'm used to <strong>wake</strong> up early.", explanation: "WRONG – 'to' is a preposition here" },
            { sentence: "✅ I'm used to <strong>waking</strong> up early.", explanation: "CORRECT – preposition + gerund" }
          ]
        },
        {
          title: "❌ Mistake #4: GO + Infinitive",
          description: "Use GO + GERUND for activities, not infinitive",
          examples: [
            { sentence: "❌ Let's go <strong>to swim</strong>.", explanation: "WRONG – go + infinitive" },
            { sentence: "✅ Let's go <strong>swimming</strong>.", explanation: "CORRECT – go + gerund" },
            { sentence: "❌ I want to go <strong>to shop</strong>.", explanation: "WRONG – go + infinitive" },
            { sentence: "✅ I want to go <strong>shopping</strong>.", explanation: "CORRECT – go + gerund" }
          ]
        }
      ],
      tipBox: {
        title: "💡 Quick Fix Strategy",
        content: "When in doubt, ask: 1) Is there a preposition? → Use gerund. 2) Is it 'go' + activity? → Use gerund. 3) Is it a specific verb? → Check if it takes gerund or infinitive."
      },
      exercises: [
        {
          id: "common-mistakes-word-select",
          title: "Find the Error",
          instructions: "Click on the ERROR in each sentence.",
          items: [
            {
              type: "word-select",
              label: "Find the error:",
              selectWhat: "the error",
              tokens: [
                { text: "I", after: " " },
                { text: "enjoy", after: " " },
                { text: "to read", isTarget: true, after: " " },
                { text: "books", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Find the error:",
              selectWhat: "the error",
              tokens: [
                { text: "I'm", after: " " },
                { text: "interested", after: " " },
                { text: "in to learn", isTarget: true, after: " " },
                { text: "Spanish", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Find the error:",
              selectWhat: "the error",
              tokens: [
                { text: "Let's", after: " " },
                { text: "go", after: " " },
                { text: "to swim", isTarget: true, after: " " },
                { text: "today", after: "." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "memory-tricks",
      stepNumber: 12,
      title: "Memory Tricks & Quick Tips",
      icon: "🧠",
      explanation: `
        <p>Use these <strong>memory tricks</strong> to remember gerund and infinitive rules!</p>

        <div style="background: linear-gradient(135deg, rgba(123, 168, 132, 0.15) 0%, rgba(244, 211, 94, 0.15) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: #7ba884; font-size: 1.25rem;">🎯 Make It Stick!</h3>
          <p style="margin-bottom: 0;">These simple tricks will help you remember the rules without memorizing every verb!</p>
        </div>
      `,
      usageMeanings: [
        {
          title: "🔤 PREP = ING",
          description: "After a PREPosition, always use -ING (gerund)",
          examples: [
            { sentence: "interested <strong>in learning</strong>", explanation: "preposition 'in' → gerund" },
            { sentence: "good <strong>at solving</strong>", explanation: "preposition 'at' → gerund" },
            { sentence: "tired <strong>of waiting</strong>", explanation: "preposition 'of' → gerund" }
          ]
        },
        {
          title: "😊 Enjoy the -ING",
          description: "Verbs about ENJOYING activities usually take gerund",
          examples: [
            { sentence: "enjoy <strong>reading</strong>", explanation: "enjoyment → gerund" },
            { sentence: "love <strong>cooking</strong>", explanation: "enjoyment → gerund" },
            { sentence: "miss <strong>traveling</strong>", explanation: "enjoyment → gerund" }
          ]
        },
        {
          title: "🎯 Want TO do it",
          description: "Verbs about GOALS and PLANS usually take infinitive",
          examples: [
            { sentence: "want <strong>to learn</strong>", explanation: "goal → infinitive" },
            { sentence: "plan <strong>to move</strong>", explanation: "plan → infinitive" },
            { sentence: "hope <strong>to see</strong>", explanation: "hope/goal → infinitive" }
          ]
        },
        {
          title: "🏃 GO + Activity = GO -ING",
          description: "Activities with 'go' always use gerund",
          examples: [
            { sentence: "go <strong>swimming</strong>", explanation: "go + activity → gerund" },
            { sentence: "go <strong>shopping</strong>", explanation: "go + activity → gerund" },
            { sentence: "go <strong>hiking</strong>", explanation: "go + activity → gerund" }
          ]
        },
        {
          title: "⏰ Past = -ING, Future = TO",
          description: "For stop/remember/try: past events use gerund, future actions use infinitive",
          examples: [
            { sentence: "I remember <strong>meeting</strong> you (past)", explanation: "memory of past → gerund" },
            { sentence: "Remember <strong>to call</strong> mom (future)", explanation: "future duty → infinitive" }
          ]
        },
        {
          title: "⚠️ Look Forward TO -ING",
          description: "The 'to' in 'look forward to' is a PREPOSITION!",
          examples: [
            { sentence: "I look forward to <strong>seeing</strong> you", explanation: "'to' = preposition → gerund" },
            { sentence: "I'm used to <strong>waking</strong> up early", explanation: "'to' = preposition → gerund" }
          ]
        }
      ],
      tipBox: {
        title: "💡 The Golden Question",
        content: "Always ask: 'What comes BEFORE the verb?' Preposition? → Gerund. Adjective? → Usually infinitive. Specific verb? → Check if it's a gerund or infinitive verb!"
      },
      exercises: [
        {
          id: "memory-tricks-exercise",
          title: "Apply the Memory Tricks",
          instructions: "Use the memory tricks to choose the correct form.",
          items: [
            {
              type: "select",
              label: "PREP = ING: I'm tired ___ waiting.",
              options: ["of", "to"],
              expectedAnswer: "of"
            },
            {
              type: "select",
              label: "Enjoy the -ING: I enjoy ___.",
              options: ["reading", "to read"],
              expectedAnswer: "reading"
            },
            {
              type: "select",
              label: "Want TO do it: I want ___ Spanish.",
              options: ["to learn", "learning"],
              expectedAnswer: "to learn"
            },
            {
              type: "select",
              label: "GO + Activity: Let's go ___.",
              options: ["swimming", "to swim"],
              expectedAnswer: "swimming"
            },
            {
              type: "select",
              label: "Past = -ING: I remember ___ you at the party.",
              options: ["meeting", "to meet"],
              expectedAnswer: "meeting"
            },
            {
              type: "select",
              label: "Look Forward TO -ING: I look forward to ___ you.",
              options: ["seeing", "see"],
              expectedAnswer: "seeing"
            }
          ]
        }
      ]
    },
    {
      id: "summary",
      title: "Summary: Quick Reference Guide",
      icon: "✓",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(123, 168, 132, 0.1) 0%, rgba(217, 119, 87, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: #7ba884; font-size: 1.25rem;">🎉 You Made It!</h3>
          <p style="margin-bottom: 0;">You've learned all the major patterns for gerunds and infinitives. Use this summary as your quick reference guide!</p>
        </div>

        <h3 style="margin-top: 2rem;">Key Reminders</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>After a preposition → ALWAYS gerund!</strong> This is the most important rule.</li>
          <li><strong>Look what comes BEFORE the verb</strong> to decide gerund or infinitive.</li>
          <li>Certain verbs always take gerunds: enjoy, finish, keep, stop, avoid, consider, suggest, recommend</li>
          <li>Certain verbs always take infinitives: want, hope, plan, decide, learn, need, offer, promise, agree</li>
          <li>Some verbs take BOTH with same meaning: begin, start, continue, like, love, hate</li>
          <li>Special cases (stop, remember, try) change meaning depending on gerund or infinitive</li>
          <li>GO + activities = always gerund (go swimming, go shopping)</li>
          <li>Subject of sentence = gerund (Swimming is fun)</li>
          <li>Watch out for "to" as a preposition: look forward <strong>to</strong>, be used <strong>to</strong></li>
        </ul>
      `,
      comparison: {
        title: "📊 Master Reference Chart",
        leftLabel: "Use GERUND (-ing)",
        rightLabel: "Use INFINITIVE (to + verb)",
        rows: [
          { label: "After preposition", left: "✅ ALWAYS<br/>(interested in learning)", right: "❌ NEVER" },
          { label: "As subject", left: "✅ Common<br/>(Swimming is fun)", right: "⚠️ Formal<br/>(To swim is fun)" },
          { label: "After adjective", left: "⚠️ With preposition only<br/>(good at solving)", right: "✅ Common<br/>(happy to help)" },
          { label: "After noun", left: "❌ Rare", right: "✅ Common<br/>(ability to speak)" },
          { label: "After GO + activity", left: "✅ ALWAYS<br/>(go swimming)", right: "❌ NEVER" },
          { label: "Specific verbs", left: "enjoy, finish, avoid, suggest, keep, quit", right: "want, hope, plan, decide, need, learn" },
          { label: "Both OK (same meaning)", left: "begin, start, continue, like, love, hate", right: "begin, start, continue, like, love, hate" },
          { label: "Special (meaning changes)", left: "stop doing (quit)<br/>remember doing (past)<br/>try doing (experiment)", right: "stop to do (pause)<br/>remember to do (future)<br/>try to do (effort)" }
        ]
      },
      tipBox: {
        title: "💡 The Golden Question",
        content: "When in doubt, ask: 'What comes BEFORE the verb?' A preposition? Use gerund. An adjective or noun? Usually infinitive. GO + activity? Always gerund. A specific verb? Check if it's a gerund verb or infinitive verb!"
      },
    },
  ],

  miniQuiz: [
    {
      id: "quiz-1",
      question: "What should you use after a preposition?",
      options: [
        { value: "b", label: "Always infinitive (to + verb)" },
        { value: "a", label: "Always gerund (-ing)" },
        { value: "c", label: "Either one" },
    ],
    correctAnswer: "a",
      explanation:
        "After a preposition, you MUST use a gerund. Example: 'I'm interested in learning' (not 'in to learn').",
      skillTag: "prep-plus-gerund-core-rule",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Which is correct?",
      options: [
        { value: "a", label: "I enjoy to read books." },
        { value: "c", label: "I enjoy read books." },
        { value: "b", label: "I enjoy reading books." },
    ],
    correctAnswer: "b",
      explanation:
        "'Enjoy' is always followed by a gerund, never an infinitive. Correct: 'I enjoy reading books.'",
      skillTag: "verb-plus-gerund-enjoy-like-love",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "Which is correct?",
      options: [
        { value: "b", label: "I want to visit Japan." },
        { value: "a", label: "I want visiting Japan." },
        { value: "c", label: "I want visit Japan." },
    ],
    correctAnswer: "b",
      explanation:
        "'Want' is always followed by an infinitive, never a gerund. Correct: 'I want to visit Japan.'",
      skillTag: "verb-plus-infinitive-want-hope-plan",
      difficulty: "easy",
    },
    {
      id: "quiz-4",
      question: "When the verb is the subject, which form is more natural in modern English?",
      options: [
        { value: "b", label: "Infinitive: 'To swim is fun'" },
        { value: "a", label: "Gerund: 'Swimming is fun'" },
        { value: "c", label: "Both are equally wrong" },
    ],
    correctAnswer: "a",
      explanation:
        "When a verb is the subject, we usually use the gerund: 'Swimming is fun.' 'To swim is fun' is possible but sounds more formal or old‑fashioned.",
      skillTag: "subject-gerund-choice",
      difficulty: "easy",
    },
    {
      id: "quiz-5",
      question: "What's the difference: 'I stopped smoking' vs 'I stopped to smoke'?",
      options: [
        { value: "a", label: "No difference – same meaning" },
        { value: "c", label: "'stopped smoking' is wrong in English" },
        { value: "b", label: "'stopped smoking' = quit the habit, 'stopped to smoke' = paused to have a cigarette" },
    ],
    correctAnswer: "b",
      explanation:
        "Stop + gerund = quit doing something. Stop + infinitive = pause one activity to do another. The meaning completely changes.",
      skillTag: "special-stop-gerund-vs-infinitive",
      difficulty: "medium",
    },
    {
      id: "quiz-6",
      question: "Which sentence is correct?",
      options: [
        { value: "c", label: "Thank you for helping me." },
        { value: "a", label: "Thank you for help me." },
        { value: "b", label: "Thank you for to help me." },
    ],
    correctAnswer: "c",
      explanation:
        "'For' is a preposition, so it must be followed by a gerund: 'Thank you for helping me.'",
      skillTag: "prep-for-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Choose the correct: 'I'm happy ___ you.'",
      options: [
        { value: "a", label: "seeing" },
        { value: "b", label: "to see" },
        { value: "c", label: "see" },
      ],
      correctAnswer: "b",
      explanation:
        "After an adjective (happy), we use an infinitive: 'I'm happy to see you.'",
      skillTag: "adjective-plus-infinitive-feelings",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "Which is correct for a past memory?",
      options: [
        { value: "a", label: "I remember to meet you at the party." },
        { value: "c", label: "I remember meet you at the party." },
        { value: "b", label: "I remember meeting you at the party." },
    ],
    correctAnswer: "b",
      explanation:
        "Remember + gerund = recall a past event. 'I remember meeting you' means you have a memory of that event.",
      skillTag: "special-remember-gerund-past-memory",
      difficulty: "medium",
    },
    {
      id: "quiz-9",
      question: "Choose the correct: 'I look forward ___ you soon.'",
      options: [
        { value: "b", label: "to seeing" },
        { value: "a", label: "to see" },
        { value: "c", label: "seeing" },
    ],
    correctAnswer: "b",
      explanation:
        "'To' in 'look forward to' is a preposition, not an infinitive marker. After prepositions, always use a gerund: 'I look forward to seeing you.'",
      skillTag: "phrase-look-forward-to-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-10",
      question: "What is the best strategy for choosing gerund or infinitive?",
      options: [
        { value: "a", label: "Use your favorite form" },
        { value: "b", label: "Look at what comes BEFORE the verb (preposition, adjective, specific verbs, etc.)" },
        { value: "c", label: "Always use gerunds with long verbs and infinitives with short verbs" },
      ],
      correctAnswer: "b",
      explanation:
        "The key is to look at what comes BEFORE the verb. Prepositions, specific verbs, adjectives, and nouns usually decide gerund vs infinitive.",
      skillTag: "meta-look-before-verb-strategy",
      difficulty: "easy",
    },
    {
      id: "quiz-11",
      question: "Which sentence correctly follows 'adjective + preposition + gerund'?",
      options: [
        { value: "a", label: "She is good at to solve problems." },
        { value: "c", label: "She is good to solving problems." },
        { value: "b", label: "She is good at solving problems." },
    ],
    correctAnswer: "b",
      explanation:
        "After a preposition (at), we must use a gerund: 'good at solving problems.'",
      skillTag: "adj-prep-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Which sentence is a correct example of noun + infinitive?",
      options: [
        { value: "b", label: "I have the ability to speak three languages." },
        { value: "a", label: "I have the ability speaking three languages." },
        { value: "c", label: "I have the ability speak three languages." },
    ],
    correctAnswer: "b",
      explanation:
        "Certain nouns are followed by an infinitive: 'the ability to speak three languages.'",
      skillTag: "noun-plus-infinitive-ability-chance-time",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question: "Which is correct?",
      options: [
        { value: "a", label: "I plan studying nursing next year." },
        { value: "b", label: "I plan to study nursing next year." },
        { value: "c", label: "I plan study nursing next year." },
      ],
      correctAnswer: "b",
      explanation:
        "'Plan' is followed by an infinitive: 'plan to study nursing next year.'",
      skillTag: "verb-plus-infinitive-plan-decide-hope",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question: "Which sentence uses 'try' to show an experiment (see if it helps)?",
      options: [
        { value: "a", label: "I'll try to drink more water every day." },
        { value: "c", label: "I'll try drink more water." },
        { value: "b", label: "I'll try drinking more water to see if it helps." },
    ],
    correctAnswer: "b",
      explanation:
        "Try + gerund is used for experiments (see if it helps). Try + infinitive is used for effort.",
      skillTag: "special-try-gerund-vs-infinitive",
      difficulty: "medium",
    },
    {
      id: "quiz-15",
      question: "Which is correct if you don’t want to forget an action?",
      options: [
        { value: "b", label: "Remember to call your mother tonight." },
        { value: "a", label: "Remember calling your mother tonight." },
        { value: "c", label: "Remember call your mother tonight." },
    ],
    correctAnswer: "b",
      explanation:
        "Remember + infinitive is used for not forgetting to do something: 'Remember to call your mother tonight.'",
      skillTag: "special-remember-infinitive-future-duty",
      difficulty: "medium",
    },
    {
      id: "quiz-16",
      question: "Which sentence has a gerund as the subject?",
      options: [
        { value: "a", label: "To study late at night is hard for me." },
        { value: "b", label: "Studying late at night is hard for me." },
        { value: "c", label: "I study late at night." },
      ],
      correctAnswer: "b",
      explanation:
        "'Studying' is a gerund used as the subject of the sentence.",
      skillTag: "subject-gerund-identification",
      difficulty: "easy",
    },
    // HARD DIFFICULTY QUESTIONS
    {
      id: "quiz-17",
      question: "Which sentence uses 'to' as a PREPOSITION (not as part of an infinitive)?",
      options: [
        { value: "a", label: "I want to learn Spanish." },
        { value: "b", label: "I look forward to meeting you." },
        { value: "c", label: "I need to practice more." },
      ],
      correctAnswer: "b",
      explanation:
        "In 'look forward to', the 'to' is a preposition, so it must be followed by a gerund: 'to meeting'. In options A and C, 'to' is part of the infinitive.",
      skillTag: "to-as-preposition-advanced",
      difficulty: "hard",
    },
    {
      id: "quiz-18",
      question: "Complete: 'I'm used to ___ up early for work.'",
      options: [
        { value: "a", label: "wake" },
        { value: "b", label: "waking" },
        { value: "c", label: "to wake" },
      ],
      correctAnswer: "b",
      explanation:
        "'Be used to' means 'be accustomed to'. The 'to' here is a preposition, so it must be followed by a gerund: 'I'm used to waking up early.'",
      skillTag: "be-used-to-gerund",
      difficulty: "hard",
    },
    {
      id: "quiz-19",
      question: "'I stopped buying coffee every day' vs 'I stopped to buy coffee' – which means QUIT?",
      options: [
        { value: "a", label: "'I stopped buying coffee' means I quit." },
        { value: "b", label: "'I stopped to buy coffee' means I quit." },
        { value: "c", label: "Both mean the same thing." },
      ],
      correctAnswer: "a",
      explanation:
        "'Stopped buying' = quit the habit. 'Stopped to buy' = paused (another activity) in order to buy coffee. The gerund indicates quitting, the infinitive indicates pausing.",
      skillTag: "special-stop-advanced",
      difficulty: "hard",
    },
    {
      id: "quiz-20",
      question: "After 'afraid of', you should use ___",
      options: [
        { value: "a", label: "infinitive (afraid of to fly)" },
        { value: "b", label: "gerund (afraid of flying)" },
        { value: "c", label: "base verb (afraid of fly)" },
      ],
      correctAnswer: "b",
      explanation:
        "'Of' is a preposition, and after prepositions you ALWAYS use a gerund. Correct: 'I'm afraid of flying.'",
      skillTag: "adj-prep-plus-gerund-advanced",
      difficulty: "hard",
    },
    {
      id: "quiz-21",
      question: "Which is correct for recreational activities?",
      options: [
        { value: "a", label: "Let's go to swim at the pool." },
        { value: "b", label: "Let's go swimming at the pool." },
        { value: "c", label: "Let's go swim at the pool." },
      ],
      correctAnswer: "b",
      explanation:
        "For recreational activities with 'go', always use gerund: go swimming, go shopping, go hiking. Never 'go to swim' or 'go to shop'.",
      skillTag: "go-plus-gerund",
      difficulty: "hard",
    },
    {
      id: "quiz-22",
      question: "Which verb can take BOTH gerund AND infinitive with the SAME meaning?",
      options: [
        { value: "a", label: "enjoy (enjoy reading / enjoy to read)" },
        { value: "b", label: "want (want reading / want to read)" },
        { value: "c", label: "begin (begin reading / begin to read)" },
      ],
      correctAnswer: "c",
      explanation:
        "'Begin' (like start, continue, like, love, hate) can take either gerund or infinitive with the same meaning. 'Enjoy' only takes gerund. 'Want' only takes infinitive.",
      skillTag: "verbs-both-forms",
      difficulty: "hard",
    },
  ],
  /*
  TEACHER DIAGNOSTIC NOTES – Gerunds & Infinitives Mini Quiz

  This mini quiz checks whether students can:
  - Apply the core rule: after a preposition → ALWAYS gerund.
  - Recognize common verb + gerund and verb + infinitive patterns.
  - Use subject = gerund naturally.
  - Use adjective + infinitive and noun + infinitive patterns.
  - Understand meaning changes with stop / remember / try.
  - Use the strategy “look at what comes BEFORE the verb” to choose form.

  Skill tags:

  Core rule & strategy:
  - prep-plus-gerund-core-rule
  - meta-look-before-verb-strategy

  Preposition + gerund patterns:
  - prep-for-plus-gerund
  - phrase-look-forward-to-plus-gerund
  - adj-prep-plus-gerund

  Verb + gerund patterns:
  - verb-plus-gerund-enjoy-like-love
  - special-stop-gerund-vs-infinitive
  - special-remember-gerund-past-memory
  - special-try-gerund-vs-infinitive

  Verb + infinitive patterns:
  - verb-plus-infinitive-want-hope-plan
  - verb-plus-infinitive-plan-decide-hope
  - special-remember-infinitive-future-duty

  Adjective / noun + infinitive patterns:
  - adjective-plus-infinitive-feelings
  - noun-plus-infinitive-ability-chance-time

  Subject = gerund:
  - subject-gerund-choice
  - subject-gerund-identification

  How to read the diagnostics:
  - If prep-plus-gerund tags are weak → Re-teach the golden rule: after a preposition, always -ing. Use color-coding to highlight the prepositions and circle the gerunds (in, at, about, for, without, before, after, to in “look forward to”).
  - If verb-plus-gerund tags are weak → Focus on the high-frequency set (enjoy, like, love, finish, keep, avoid, consider, suggest, recommend). Build a verb wall where students add their own examples with gerunds.
  - If verb-plus-infinitive tags are weak → Revisit the “goal and plan” verbs (want, hope, plan, decide, need, learn, agree, offer). Have students write 3 true sentences about their goals using these verbs + to + verb.
  - If adjective/noun + infinitive tags are weak → Practice common frames: happy to…, ready to…, important to…, ability to…, time to…, chance to…. Use sentence stems your students can personalize (I’m happy to…, I don’t have time to…).
  - If special stop/remember/try tags are weak → Re-teach using short contrast pairs on the board: stop smoking vs stop to smoke, remember meeting vs remember to meet, try drinking vs try to drink. Ask students which one is about PAST memory, which is about FUTURE duty, and which is about EXPERIMENT vs EFFORT.
  - If subject-gerund tags are weak → Give pairs like “Cooking at home saves money” / “To cook at home saves money” and have students choose the more natural version. Emphasize that in modern English, gerunds are the normal choice for subjects.

  Suggested use:
  - Use this mini quiz after students have worked through the main patterns (subject = gerund, verb + gerund, preposition + gerund, adjective/noun/verb + infinitive, and the special-case verbs).
  - Use class-level skillTag results to decide which pattern to revisit:
    • Many errors on preposition tags → do more “preposition + -ing” drills.
    • Many errors on verb group tags → slow down and sort VERB CARDS into “+ gerund” and “+ infinitive” piles together as a class.
    • Many errors on special-case tags → spend a short focused day on stop / remember / try with timeline drawings.
  */
};
