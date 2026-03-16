import { InteractiveGuideContent } from "@/types/activity";

export const gerundsInfinitivesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "The -ING vs TO Choice: See the Pattern First",
      icon: "🔄",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.1) 0%, rgba(3, 105, 161, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem">
          <h3 class="gc-text-terracotta" style="margin-top: 0; ; font-size: 1.25rem">🎯 What We're Learning</h3>
          <p style="font-size: 1.05rem; margin-bottom: 0">Sometimes you put another verb right after a word. English gives you two choices: add <strong class="gc-text-terracotta">-ING</strong> or add <strong style="color: #0369a1">TO</strong> before the verb. Before we learn any grammar words, let's <strong>see the pattern and feel confident using it</strong>.</p>
        </div>

        <p><strong>Here are examples. Notice what stays the same and what changes:</strong></p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0">
          <div class="gc-callout-terracotta" style="padding: 1rem; background: rgba(217, 119, 87, 0.08); ; border-radius: 0.5rem">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600">The -ING form:</p>
            <p style="margin: 0"><strong>Reading</strong> is fun. <em>(verb as subject)</em></p>
            <p style="margin: 0">I enjoy <strong>reading</strong>.</p>
            <p style="margin: 0">I finished <strong>working</strong>.</p>
            <p style="margin: 0">I like <strong>cooking</strong>.</p>
          </div>
          <div style="padding: 1rem; background: rgba(3, 105, 161, 0.08); border-left: 4px solid #0369a1; border-radius: 0.5rem">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600">The TO + verb form:</p>
            <p style="margin: 0">I want <strong>to learn</strong>.</p>
            <p style="margin: 0">I'm happy <strong>to help</strong>. <em>(adjective before)</em></p>
            <p style="margin: 0">I plan <strong>to study</strong>.</p>
            <p style="margin: 0">I need <strong>to practice</strong>.</p>
          </div>
        </div>

        <div class="gc-callout-sage" style="background: rgba(123, 168, 132, 0.1); ; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem">
          <p style="margin: 0; font-style: italic; color: #3a3a3a">💡 Use -ING when: the verb is the <strong>subject</strong> (Reading is fun) OR when a certain word comes <strong>before</strong> it (enjoy, for, in…). Use TO when a <strong>verb</strong> (want, plan, need) or <strong>adjective</strong> (happy, important) comes before. We'll learn the patterns!</p>
        </div>
      `,
      exercises: [
        {
          id: "intro-exercise",
          title: "Practice: Which Form Sounds Right?",
          instructions: "Choose the option that sounds natural. Don't worry about grammar words yet—trust your ear.",
          items: [
            {
              type: "select",
              label: "I enjoy ___ books.",
              options: ["to read", "reading", "read"],
              expectedAnswer: "reading"
            },
            {
              type: "select",
              label: "I want ___ Spanish.",
              options: ["to learn", "learning", "learn"],
              expectedAnswer: "to learn"
            },
            {
              type: "select",
              label: "I finished ___ the report.",
              options: ["to write", "write", "writing"],
              expectedAnswer: "writing"
            },
            {
              type: "select",
              label: "I plan ___ nursing next year.",
              options: ["studying", "to study", "study"],
              expectedAnswer: "to study"
            },
            {
              type: "select",
              label: "I'm happy ___ you.",
              options: ["helping", "help", "to help"],
              expectedAnswer: "to help"
            },
            {
              type: "select",
              label: "___ is relaxing.",
              options: ["To read", "Reading", "Read"],
              expectedAnswer: "Reading"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-practice-ing",
      title: "Pattern Practice: -ING After Certain Words",
      icon: "🔶",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.12) 0%, rgba(217, 119, 87, 0.04) 100%); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem">
          <p class="gc-text-terracotta" style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600; ">👀 Look at these sentences. What stays the same?</p>
          <p style="margin: 0; color: #666; font-size: 0.95rem">Notice the pattern in each example below.</p>
        </div>

        <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem">
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">subject</span>
            <span><strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">Swimming</strong> is good exercise.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">enjoy</span>
            <span>I enjoy <strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">reading</strong> mystery novels.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">finished</span>
            <span>I finished <strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">cleaning</strong> the house.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">suggest</span>
            <span>I suggest <strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">taking</strong> the train.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">for</span>
            <span>Thank you for <strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">helping</strong> me.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(217, 119, 87, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span class="gc-text-terracotta" style="background: rgba(217, 119, 87, 0.15); ; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">in</span>
            <span>I'm interested in <strong class="gc-text-terracotta" style="background: #fed7aa; padding: 0.1rem 0.4rem; border-radius: 0.25rem">learning</strong> French.</span>
          </div>
        </div>

        <div style="background: #d97757; color: white; border-radius: 0.75rem; padding: 1rem 1.25rem; text-align: center">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 700">💡 The Pattern</p>
          <p style="margin: 0; font-size: 0.95rem">Use <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">-ING</strong> when: the verb is the <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">subject</strong> (Swimming is fun) OR when a word like enjoy, for, in comes <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">before</strong> it!</p>
        </div>
      `,
      exercises: [
        {
          id: "pattern-practice-ing-parts",
          title: "Identify: What comes before the blank?",
          instructions: "Look at the word right before the blank. What type of word is it? This helps you know which form to use.",
          items: [
            {
              type: "select",
              label: "I enjoy ___ books. → What is 'enjoy'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "verb"
            },
            {
              type: "select",
              label: "Thank you for ___ me. → What is 'for'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "preposition"
            },
            {
              type: "select",
              label: "I'm interested in ___ French. → What is 'in'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "preposition"
            },
            {
              type: "select",
              label: "I suggest ___ the train. → What is 'suggest'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "verb"
            },
            {
              type: "select",
              label: "___ is relaxing. → What position is the blank?",
              options: ["subject", "after verb", "after preposition", "after adjective"],
              expectedAnswer: "subject"
            }
          ]
        },
        {
          id: "pattern-practice-ing-ex",
          title: "Choose the -ING form",
          instructions: "Pick the option that follows the pattern.",
          items: [
            {
              type: "select",
              label: "I suggest ___ the museum on Saturday.",
              options: ["to visit", "visiting", "visit"],
              expectedAnswer: "visiting"
            },
            {
              type: "select",
              label: "Thank you for ___ me with my homework.",
              options: ["help", "to help", "helping"],
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
              label: "I avoid ___ junk food.",
              options: ["to eat", "eating", "eat"],
              expectedAnswer: "eating"
            },
            {
              type: "select",
              label: "She keeps ___ about her trip.",
              options: ["talk", "to talk", "talking"],
              expectedAnswer: "talking"
            },
            {
              type: "select",
              label: "We considered ___ to the beach.",
              options: ["going", "to go", "go"],
              expectedAnswer: "going"
            },
            {
              type: "select",
              label: "She's good at ___ languages.",
              options: ["to speak", "speaking", "speak"],
              expectedAnswer: "speaking"
            },
            {
              type: "select",
              label: "___ a new language takes time.",
              options: ["Learn", "Learning", "To learn"],
              expectedAnswer: "Learning"
            },
            {
              type: "select",
              label: "___ every morning helps me focus.",
              options: ["To meditate", "Meditate", "Meditating"],
              expectedAnswer: "Meditating"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-practice-to",
      title: "Pattern Practice: TO + Verb After Certain Words",
      icon: "🔷",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(3, 105, 161, 0.12) 0%, rgba(3, 105, 161, 0.04) 100%); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600; color: #0369a1">👀 Now look at these. What stays the same?</p>
          <p style="margin: 0; color: #666; font-size: 0.95rem">Notice the pattern in each example below.</p>
        </div>

        <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem">
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">happy</span>
            <span>I'm happy <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to help</strong> you.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">want</span>
            <span>I want <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to visit</strong> Japan someday.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">plan</span>
            <span>I plan <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to study</strong> medicine.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">need</span>
            <span>I need <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to practice</strong> my English.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">important</span>
            <span>It's important <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to exercise</strong> regularly.</span>
          </div>
          <div class="gc-bg-white" style="display: flex; align-items: center; gap: 0.75rem; ; border: 1px solid rgba(3, 105, 161, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
            <span style="background: rgba(3, 105, 161, 0.15); color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.85rem">ability</span>
            <span>I have the ability <strong class="gc-inf-highlight" style="color: #0369a1; background: #bae6fd; padding: 0.1rem 0.4rem; border-radius: 0.25rem">to speak</strong> three languages.</span>
          </div>
        </div>

        <div style="background: #0369a1; color: white; border-radius: 0.75rem; padding: 1rem 1.25rem; text-align: center">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 700">💡 The Pattern</p>
          <p style="margin: 0; font-size: 0.95rem">Use <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">TO + verb</strong> when: an <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">adjective</strong> (happy, important, ready) comes before, OR a <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">verb</strong> (want, plan, need) or <strong style="color: #fff; background: rgba(255,255,255,0.25); padding: 0.1em 0.35em; border-radius: 0.25em">noun</strong> (ability) comes before!</p>
        </div>
      `,
      exercises: [
        {
          id: "pattern-practice-to-parts",
          title: "Identify: What comes before the blank?",
          instructions: "Look at the word right before the blank. What type of word is it? This helps you know which form to use.",
          items: [
            {
              type: "select",
              label: "I want ___ Spanish. → What is 'want'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "verb"
            },
            {
              type: "select",
              label: "I'm happy ___ help you. → What is 'happy'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "adjective"
            },
            {
              type: "select",
              label: "I have the ability ___ speak three languages. → What is 'ability'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "noun"
            },
            {
              type: "select",
              label: "It's important ___ practice every day. → What is 'important'?",
              options: ["verb", "preposition", "adjective", "noun"],
              expectedAnswer: "adjective"
            }
          ]
        },
        {
          id: "pattern-practice-to-ex",
          title: "Choose the TO + verb form",
          instructions: "Pick the option that follows the pattern.",
          items: [
            {
              type: "select",
              label: "I hope ___ you at the party.",
              options: ["seeing", "to see", "see"],
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
              label: "It's important ___ on time.",
              options: ["arrive", "arriving", "to arrive"],
              expectedAnswer: "to arrive"
            },
            {
              type: "select",
              label: "He promised ___ call me tomorrow.",
              options: ["calling", "to call", "call"],
              expectedAnswer: "to call"
            },
            {
              type: "select",
              label: "She offered ___ drive us to the airport.",
              options: ["driving", "drive", "to drive"],
              expectedAnswer: "to drive"
            },
            {
              type: "select",
              label: "We expect ___ finish by Friday.",
              options: ["to finish", "finishing", "finish"],
              expectedAnswer: "to finish"
            },
            {
              type: "select",
              label: "She's excited ___ start her new job.",
              options: ["starting", "start", "to start"],
              expectedAnswer: "to start"
            }
          ]
        }
      ]
    },
    {
      id: "notice-the-pattern",
      title: "Notice: What Stays the Same?",
      icon: "🔍",
      explanation: `
        <div style="background: rgba(244, 211, 94, 0.15); padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin-bottom: 1rem">
          <h3 style="margin-top: 0; color: #b8860b">What did you notice?</h3>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem">
            <li><strong>Use -ING when:</strong> the verb is the subject (Swimming is fun), OR after certain words: enjoy, finish, suggest, thank you for, interested in, good at…</li>
            <li><strong>Use TO + verb after:</strong> adjectives (happy, important, ready), verbs (want, plan, need, hope, decide), or nouns (ability)…</li>
          </ul>
        </div>
        <p>Use -ING when the verb is the subject or when certain words come before it. Use TO + verb after other words. If you can identify the pattern and feel confident choosing, you're ready for the next step.</p>
        <p><strong>Now we can give these patterns their grammar names.</strong></p>
      `,
    },
    {
      id: "the-names",
      title: "The Names and the Rule",
      icon: "📖",
      explanation: `
        <p>You've practiced the patterns. Here are the official names:</p>

        <h3 style="margin-top: 1.5rem">-ING form = <strong>Gerund</strong></h3>
        <p>A <strong>gerund</strong> is a verb + -ing that acts like a noun. Gerunds can be the <strong>subject</strong> of a sentence or come after certain words.</p>
        <ul style="margin: 0.5rem 0 1rem 0">
          <li><strong>Reading</strong> is fun. (gerund as subject)</li>
          <li>I enjoy <strong>reading</strong>. (gerund after verb)</li>
          <li>Thank you for <strong>helping</strong> me. (gerund after preposition)</li>
        </ul>

        <h3 style="margin-top: 1.5rem">TO + verb = <strong>Infinitive</strong></h3>
        <p>An <strong>infinitive</strong> is <em>to</em> + the base form of the verb. Use it after <strong>adjectives</strong> (happy, important), <strong>verbs</strong> (want, plan), or <strong>nouns</strong> (ability).</p>
        <ul style="margin: 0.5rem 0 1rem 0">
          <li>I'm happy <strong>to help</strong>. (adjective + infinitive)</li>
          <li>I want <strong>to learn</strong>. (verb + infinitive)</li>
          <li>I have the ability <strong>to speak</strong> three languages. (noun + infinitive)</li>
        </ul>

        <div class="gc-callout-sage" style="background: rgba(123, 168, 132, 0.1); ; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem">
          <p style="margin: 0"><strong>Rule:</strong> Subject? → gerund. <strong>Adjective</strong> (happy, important) or <strong>verb</strong> (want, plan) or <strong>noun</strong> (ability) before? → infinitive. <strong>Preposition</strong> (in, for, at)? → gerund.</p>
        </div>
      `,
      exercises: [
        {
          id: "the-names-exercise",
          title: "Identify: Gerund or Infinitive?",
          instructions: "Now that you know the names, which is it?",
          items: [
            {
              type: "radio",
              label: "'I enjoy reading.' – What is 'reading'?",
              options: [
                { value: "infinitive", label: "Infinitive (to + verb)" },
                { value: "gerund", label: "Gerund (verb + -ing)" }
              ],
              expectedAnswer: "gerund"
            },
            {
              type: "radio",
              label: "'I want to learn.' – What is 'to learn'?",
              options: [
                { value: "infinitive", label: "Infinitive (to + verb)" },
                { value: "gerund", label: "Gerund (verb + -ing)" }
              ],
              expectedAnswer: "infinitive"
            },
            {
              type: "radio",
              label: "'Reading is fun.' – What is 'Reading'? (verb as subject)",
              options: [
                { value: "infinitive", label: "Infinitive (to + verb)" },
                { value: "gerund", label: "Gerund (verb + -ing as subject)" }
              ],
              expectedAnswer: "gerund"
            }
          ]
        }
      ]
    },
    {
      id: "decision-tree",
      title: "Quick Decision Tree",
      icon: "🧭",
      explanation: `
        <p>Now that you know the names (gerund and infinitive), here's a quick guide. Ask yourself: <strong>What comes BEFORE the verb?</strong></p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem">
          <div class="gc-callout-terracotta" style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.15) 0%, rgba(217, 119, 87, 0.05) 100%); ; border-radius: 0.5rem; padding: 1rem">
            <h4 class="gc-text-terracotta" style="margin: 0 0 0.75rem 0; font-size: 1rem">Use <span style="background: #d97757; color: white; padding: 0.15rem 0.4rem; border-radius: 0.25rem">GERUND (-ING)</span></h4>
            <div style="margin-bottom: 0.75rem">
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">Preposition before verb?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">"I'm interested in <strong>learning</strong> Spanish."</p>
            </div>
            <div style="margin-bottom: 0.75rem">
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">Verb is the subject?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">"<strong>Swimming</strong> is my favorite exercise."</p>
            </div>
            <div>
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">After certain verbs?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">enjoy, finish, avoid, consider, suggest</p>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, rgba(3, 105, 161, 0.15) 0%, rgba(3, 105, 161, 0.05) 100%); border-left: 4px solid #0369a1; border-radius: 0.5rem; padding: 1rem">
            <h4 style="color: #0369a1; margin: 0 0 0.75rem 0; font-size: 1rem">Use <span style="background: #0369a1; color: white; padding: 0.15rem 0.4rem; border-radius: 0.25rem">INFINITIVE (TO)</span></h4>
            <div style="margin-bottom: 0.75rem">
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">Adjective before verb?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">"I'm happy <strong>to help</strong> you."</p>
            </div>
            <div style="margin-bottom: 0.75rem">
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">Noun before verb?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">"I have the ability <strong>to speak</strong> three languages."</p>
            </div>
            <div>
              <p style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem">After certain verbs?</p>
              <p style="margin: 0; color: #666; font-size: 0.85rem; font-style: italic">want, need, plan, decide, hope, offer</p>
            </div>
          </div>
        </div>

        <div style="background: rgba(244, 211, 94, 0.2); border: 1px solid #f4d35e; border-radius: 0.5rem; padding: 1rem; text-align: center">
          <p style="margin: 0; font-weight: 600; color: #b8860b">⚠️ Watch out for "TO" as a preposition!</p>
          <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem">"I look forward <strong>to meeting</strong> you" → "to" is a preposition here, so use gerund!</p>
        </div>
      `,
      exercises: [
        {
          id: "decision-tree-exercise",
          title: "Practice: Use the Decision Tree",
          instructions: "Look at what comes BEFORE the blank and choose the correct form.",
          items: [
            {
              type: "select",
              label: "She's good at ___ languages. (preposition 'at' before verb)",
              options: ["to learn", "learning", "learn"],
              expectedAnswer: "learning"
            },
            {
              type: "select",
              label: "It's important ___ on time. (adjective 'important' before verb)",
              options: ["to arrive", "arriving", "arrive"],
              expectedAnswer: "to arrive"
            },
            {
              type: "select",
              label: "___ is relaxing. (verb is the subject)",
              options: ["To read", "Read", "Reading"],
              expectedAnswer: "Reading"
            },
            {
              type: "select",
              label: "I look forward to ___ you. ('to' is a preposition here!)",
              options: ["to meet", "meeting", "meet"],
              expectedAnswer: "meeting"
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
              options: ["to solve", "solving", "solve"],
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
              options: ["to fix", "fix", "fixing"],
              expectedAnswer: "fixing"
            },
            {
              type: "select",
              label: "Workplace: I finished ___ the report.",
              options: ["to write", "writing", "write"],
              expectedAnswer: "writing"
            }
          ]
        }
      ]
    },
    {
      id: "gerund-patterns",
      stepNumber: 1,
      title: "Gerund Patterns: When to Use -ING",
      icon: "🔶",
      explanation: `
        <p>Use a <strong>gerund (-ing)</strong> in these three situations. Follow the flowchart!</p>

        <!-- Visual Flowchart -->
        <div style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.08) 0%, rgba(217, 119, 87, 0.02) 100%); border: 2px solid rgba(217, 119, 87, 0.3); border-radius: 1rem; padding: 1.5rem; margin: 1.5rem 0">
          <div style="text-align: center; margin-bottom: 1rem">
            <div style="display: inline-block; background: #d97757; color: white; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1rem">
              🤔 What comes BEFORE the verb?
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin: 0.5rem 0">
            <div style="width: 2px; height: 20px; background: #d97757"></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center">
            <div style="background: rgba(217, 119, 87, 0.15); border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div class="gc-text-terracotta" style="font-weight: 700; ; margin-bottom: 0.25rem">Preposition?</div>
              <div style="font-size: 0.85rem; color: #666">in, at, for, about, of</div>
            </div>
            <div style="background: rgba(217, 119, 87, 0.15); border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div class="gc-text-terracotta" style="font-weight: 700; ; margin-bottom: 0.25rem">Subject position?</div>
              <div style="font-size: 0.85rem; color: #666">verb is the topic</div>
            </div>
            <div style="background: rgba(217, 119, 87, 0.15); border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div class="gc-text-terracotta" style="font-weight: 700; ; margin-bottom: 0.25rem">Gerund verb?</div>
              <div style="font-size: 0.85rem; color: #666">enjoy, finish, avoid...</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin: 0.5rem 0">
            <div style="width: 2px; height: 20px; background: #d97757"></div>
          </div>

          <div style="text-align: center">
            <div style="display: inline-block; background: #d97757; color: white; padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700">
              ✅ Use GERUND (-ING)
            </div>
          </div>
        </div>

        <h3 class="gc-text-terracotta" style="margin-top: 1.5rem">Pattern A: Subject = Gerund</h3>
        <p>When a verb is the <strong>subject</strong> of a sentence:</p>
        <ul style="margin: 0.5rem 0 1rem 0; padding-left: 1.25rem">
          <li><strong>Swimming</strong> is excellent exercise.</li>
          <li><strong>Learning</strong> a new language takes time.</li>
          <li><strong>Cooking</strong> at home saves money.</li>
        </ul>

        <h3 class="gc-text-terracotta">Pattern B: Verb + Gerund</h3>
        <p>Certain verbs are <strong>always</strong> followed by gerunds:</p>
        <ul style="margin: 0.5rem 0 1rem 0; padding-left: 1.25rem">
          <li><strong>enjoy, like, love:</strong> I enjoy <strong>reading</strong>.</li>
          <li><strong>finish, keep, quit:</strong> I finished <strong>cleaning</strong>.</li>
          <li><strong>avoid, miss, risk:</strong> I avoid <strong>eating</strong> sugar.</li>
          <li><strong>consider, suggest:</strong> I suggest <strong>taking</strong> the bus.</li>
        </ul>

        <h3 class="gc-text-terracotta">Pattern C: Preposition + Gerund (CRITICAL!)</h3>
        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 1rem; margin: 0.75rem 0; border-radius: 0.5rem">
          <p style="margin: 0"><strong>⚠️ Golden Rule:</strong> After a preposition → <strong>ALWAYS</strong> use gerund!</p>
        </div>
        <ul style="margin: 0.5rem 0; padding-left: 1.25rem">
          <li>I'm interested <strong>in learning</strong> French.</li>
          <li>She's good <strong>at solving</strong> problems.</li>
          <li>Thank you <strong>for helping</strong> me.</li>
          <li>I look forward <strong>to seeing</strong> you. <em>("to" is a preposition here!)</em></li>
        </ul>
      `,
      verbTable: {
        title: "📋 Common Gerund Patterns",
        headers: ["Pattern", "Examples", "Sample Sentence"],
        rows: [
          ["Subject", "Swimming, Learning, Cooking", "<strong>Swimming</strong> is fun."],
          ["enjoy, finish, avoid...", "enjoy, finish, keep, avoid, suggest", "I <strong>enjoy reading</strong>."],
          ["Preposition +", "interested in, good at, thank you for", "I'm good at <strong>solving</strong> puzzles."],
          ["look forward to ⚠️", "to = preposition, not infinitive!", "I look forward to <strong>meeting</strong> you."]
        ]
      },
      tipBox: {
        title: "💡 Memory Trick: PREP = ING",
        content: "After a PREPosition, always use -ING. This is the most common mistake—don't fall for it!"
      },
      exercises: [
        {
          id: "gerund-patterns-exercise",
          title: "Practice: Gerund Patterns",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "___ a new language takes practice. (subject)",
              options: ["To learn", "Learning", "Learn"],
              expectedAnswer: "Learning"
            },
            {
              type: "select",
              label: "I finished ___ the report. (verb + gerund)",
              options: ["to write", "write", "writing"],
              expectedAnswer: "writing"
            },
            {
              type: "select",
              label: "She's good at ___ problems. (preposition + gerund)",
              options: ["solving", "to solve", "solve"],
              expectedAnswer: "solving"
            },
            {
              type: "select",
              label: "I look forward to ___ you. (preposition!)",
              options: ["to meet", "meeting", "meet"],
              expectedAnswer: "meeting"
            }
          ]
        },
        {
          id: "gerund-word-select",
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
                { text: "cooking", isTarget: true, after: " " },
                { text: "Italian", after: " " },
                { text: "food", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Click on the gerund:",
              selectWhat: "the gerund",
              tokens: [
                { text: "She's", after: " " },
                { text: "interested", after: " " },
                { text: "in", after: " " },
                { text: "learning", isTarget: true, after: " " },
                { text: "French", after: "." }
              ]
            },
            {
              type: "word-select",
              label: "Click on the gerund (as subject):",
              selectWhat: "the gerund",
              tokens: [
                { text: "Swimming", isTarget: true, after: " " },
                { text: "is", after: " " },
                { text: "good", after: " " },
                { text: "exercise", after: "." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "preposition-before-gerund",
      title: "Which Preposition Before the Gerund?",
      icon: "📌",
      explanation: `
        <p>You know: after a preposition → use gerund. But <strong>which preposition</strong>? This is hard because there's no rule—each adjective or phrase has its <strong>fixed</strong> preposition. You have to learn them!</p>

        <div style="background: rgba(244, 211, 94, 0.15); border-left: 4px solid #f4d35e; padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 600">❌ Common mistakes: "interested <em>to</em> learn" · "good <em>in</em> solving" · "thank you <em>to</em> help"</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem">✅ Correct: interested <strong>in</strong> learning · good <strong>at</strong> solving · thank you <strong>for</strong> helping</p>
        </div>

        <h3 class="gc-text-terracotta" style="margin-top: 1.5rem">Common Adjective/Verb + Preposition + Gerund</h3>
        <p>Learn these fixed combinations. They appear often in real English!</p>
      `,
      usageMeanings: [
        {
          title: "IN + gerund",
          description: "interested in, succeed in, believe in, specialize in",
          examples: [
            { sentence: "I'm interested <strong>in learning</strong> Spanish.", explanation: "interested in + gerund" },
            { sentence: "She succeeded <strong>in passing</strong> the exam.", explanation: "succeed in + gerund" }
          ]
        },
        {
          title: "AT + gerund",
          description: "good at, bad at, skilled at, expert at",
          examples: [
            { sentence: "She's good <strong>at solving</strong> problems.", explanation: "good at + gerund" },
            { sentence: "He's skilled <strong>at speaking</strong> in public.", explanation: "skilled at + gerund" }
          ]
        },
        {
          title: "FOR + gerund",
          description: "thank you for, responsible for, famous for, known for",
          examples: [
            { sentence: "Thank you <strong>for helping</strong> me.", explanation: "thank you for + gerund" },
            { sentence: "She's responsible <strong>for completing</strong> the report.", explanation: "responsible for + gerund" }
          ]
        },
        {
          title: "OF + gerund",
          description: "afraid of, tired of, capable of, fond of",
          examples: [
            { sentence: "I'm afraid <strong>of flying</strong>.", explanation: "afraid of + gerund" },
            { sentence: "She's tired <strong>of waiting</strong>.", explanation: "tired of + gerund" }
          ]
        },
        {
          title: "ABOUT + gerund",
          description: "excited about, nervous about, worried about, think about",
          examples: [
            { sentence: "I'm excited <strong>about starting</strong> my new job.", explanation: "excited about + gerund" },
            { sentence: "She's worried <strong>about failing</strong> the test.", explanation: "worried about + gerund" }
          ]
        },
        {
          title: "TO + gerund (⚠️ TO is a preposition here!)",
          description: "look forward to, be used to, get used to",
          examples: [
            { sentence: "I look forward <strong>to seeing</strong> you.", explanation: "look forward to + gerund (NOT infinitive!)" },
            { sentence: "I'm used <strong>to waking</strong> up early.", explanation: "be used to + gerund" }
          ]
        }
      ],
      comparison: {
        title: "📋 Quick Reference: Preposition + Gerund",
        leftLabel: "Preposition",
        rightLabel: "Common phrases",
        showLabelColumn: false,
        rows: [
          { label: "in", left: "in", right: "interested in, succeed in, believe in" },
          { label: "at", left: "at", right: "good at, bad at, skilled at" },
          { label: "for", left: "for", right: "thank you for, responsible for" },
          { label: "of", left: "of", right: "afraid of, tired of, capable of" },
          { label: "about", left: "about", right: "excited about, worried about" },
          { label: "to ⚠️", left: "to", right: "look forward to, be used to, get used to" }
        ]
      },
      tipBox: {
        title: "💡 No Rule—Memorize!",
        content: "English doesn't have a rule for which preposition goes with which word. Learn the whole phrase: 'interested in', 'good at', 'thank you for'. Practice with real sentences!"
      },
      exercises: [
        {
          id: "preposition-before-gerund-exercise",
          title: "Practice: Choose the Preposition",
          instructions: "Pick the correct preposition before the gerund.",
          items: [
            {
              type: "select",
              label: "I'm interested ___ learning French.",
              options: ["in", "at", "for", "to"],
              expectedAnswer: "in"
            },
            {
              type: "select",
              label: "She's good ___ solving puzzles.",
              options: ["in", "at", "for", "to"],
              expectedAnswer: "at"
            },
            {
              type: "select",
              label: "Thank you ___ helping me.",
              options: ["in", "at", "for", "to"],
              expectedAnswer: "for"
            },
            {
              type: "select",
              label: "I'm tired ___ waiting.",
              options: ["in", "of", "for", "at"],
              expectedAnswer: "of"
            },
            {
              type: "select",
              label: "I look forward ___ meeting you.",
              options: ["in", "at", "for", "to"],
              expectedAnswer: "to"
            },
            {
              type: "select",
              label: "She's excited ___ starting her new job.",
              options: ["about", "at", "for", "of"],
              expectedAnswer: "about"
            }
          ]
        }
      ]
    },
    {
      id: "infinitive-patterns",
      stepNumber: 2,
      title: "Infinitive Patterns: When to Use TO + Verb",
      icon: "🔷",
      explanation: `
        <p>Use an <strong>infinitive (to + verb)</strong> in these three situations. Follow the flowchart!</p>

        <!-- Visual Flowchart -->
        <div style="background: linear-gradient(135deg, rgba(3, 105, 161, 0.08) 0%, rgba(3, 105, 161, 0.02) 100%); border: 2px solid rgba(3, 105, 161, 0.3); border-radius: 1rem; padding: 1.5rem; margin: 1.5rem 0">
          <div style="text-align: center; margin-bottom: 1rem">
            <div style="display: inline-block; background: #0369a1; color: white; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1rem">
              🤔 What comes BEFORE the verb?
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin: 0.5rem 0">
            <div style="width: 2px; height: 20px; background: #0369a1"></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center">
            <div style="background: rgba(3, 105, 161, 0.15); border: 1px solid rgba(3, 105, 161, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div style="font-weight: 700; color: #0369a1; margin-bottom: 0.25rem">Adjective?</div>
              <div style="font-size: 0.85rem; color: #666">happy, ready, important</div>
            </div>
            <div style="background: rgba(3, 105, 161, 0.15); border: 1px solid rgba(3, 105, 161, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div style="font-weight: 700; color: #0369a1; margin-bottom: 0.25rem">Noun?</div>
              <div style="font-size: 0.85rem; color: #666">ability, chance, time</div>
            </div>
            <div style="background: rgba(3, 105, 161, 0.15); border: 1px solid rgba(3, 105, 161, 0.3); border-radius: 0.5rem; padding: 0.75rem">
              <div style="font-weight: 700; color: #0369a1; margin-bottom: 0.25rem">Infinitive verb?</div>
              <div style="font-size: 0.85rem; color: #666">want, plan, decide...</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin: 0.5rem 0">
            <div style="width: 2px; height: 20px; background: #0369a1"></div>
          </div>

          <div style="text-align: center">
            <div style="display: inline-block; background: #0369a1; color: white; padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 700">
              ✅ Use INFINITIVE (TO + verb)
            </div>
          </div>
        </div>

        <h3 style="color: #0369a1; margin-top: 1.5rem">Pattern A: Adjective + Infinitive</h3>
        <p>After adjectives expressing feelings, readiness, or importance:</p>
        <ul style="margin: 0.5rem 0 1rem 0; padding-left: 1.25rem">
          <li>I'm happy <strong>to help</strong> you.</li>
          <li>She's ready <strong>to go</strong> now.</li>
          <li>It's important <strong>to exercise</strong> regularly.</li>
        </ul>

        <h3 style="color: #0369a1">Pattern B: Noun + Infinitive</h3>
        <p>After nouns describing abilities, chances, or time:</p>
        <ul style="margin: 0.5rem 0 1rem 0; padding-left: 1.25rem">
          <li>I have the ability <strong>to speak</strong> three languages.</li>
          <li>This is your chance <strong>to learn</strong> something new.</li>
          <li>I don't have time <strong>to cook</strong> tonight.</li>
        </ul>

        <h3 style="color: #0369a1">Pattern C: Verb + Infinitive</h3>
        <p>Certain verbs are <strong>always</strong> followed by infinitives:</p>
        <ul style="margin: 0.5rem 0; padding-left: 1.25rem">
          <li><strong>want, hope, wish:</strong> I want <strong>to visit</strong> Japan.</li>
          <li><strong>plan, decide, choose:</strong> I decided <strong>to stay</strong> home.</li>
          <li><strong>need, learn, try:</strong> I need <strong>to practice</strong> more.</li>
          <li><strong>offer, promise, agree:</strong> She offered <strong>to help</strong>.</li>
        </ul>
      `,
      verbTable: {
        title: "📋 Common Infinitive Patterns",
        headers: ["Pattern", "Examples", "Sample Sentence"],
        rows: [
          ["Adjective +", "happy, ready, important, easy", "I'm happy <strong>to help</strong>."],
          ["Noun +", "ability, chance, time, decision", "I have the ability <strong>to speak</strong> French."],
          ["want, plan, need...", "want, hope, plan, decide, need", "I want <strong>to learn</strong> Spanish."],
          ["offer, promise...", "offer, promise, agree, refuse", "She offered <strong>to drive</strong> me."]
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
        title: "💡 Memory Trick: Want TO do it",
        content: "Goal verbs (want, hope, plan) point to the future → use TO + verb. Enjoyment verbs (enjoy, love) describe ongoing activities → use -ING."
      },
      exercises: [
        {
          id: "infinitive-patterns-exercise",
          title: "Practice: Infinitive Patterns",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I'm happy ___ you. (adjective + infinitive)",
              options: ["helping", "to help", "help"],
              expectedAnswer: "to help"
            },
            {
              type: "select",
              label: "I have the ability ___ fast. (noun + infinitive)",
              options: ["to run", "running", "run"],
              expectedAnswer: "to run"
            },
            {
              type: "select",
              label: "She decided ___ a new car. (verb + infinitive)",
              options: ["buying", "buy", "to buy"],
              expectedAnswer: "to buy"
            },
            {
              type: "select",
              label: "It's important ___ on time. (adjective + infinitive)",
              options: ["arriving", "to arrive", "arrive"],
              expectedAnswer: "to arrive"
            }
          ]
        },
        {
          id: "infinitive-word-scramble",
          title: "Build the Sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Express a goal:",
              words: ["I", "want", "to", "visit", "Japan"],
              correctAnswer: "I want to visit Japan",
              hint: "want + to + verb"
            },
            {
              type: "word-scramble",
              label: "Describe an ability:",
              words: ["She", "has", "the", "ability", "to", "speak", "French"],
              correctAnswer: "She has the ability to speak French",
              hint: "noun + to + verb"
            }
          ]
        }
      ]
    },
    {
      id: "special-case-stop",
      stepNumber: 3,
      title: "Special Case: STOP",
      icon: "🛑",
      explanation: `
        <p>Some verbs can be followed by BOTH gerunds and infinitives, but the <strong>meaning changes</strong>! Let's start with <strong>stop</strong>.</p>

        <h3>Stop + Gerund vs Stop + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e">
          <p><strong>stop + gerund</strong> = quit doing something</p>
          <p>Example: I stopped <strong>smoking</strong>. (I quit the habit)</p>
          <p style="margin-top: 1rem"><strong>stop + infinitive</strong> = pause one activity to do another</p>
          <p>Example: I stopped <strong>to buy</strong> gas. (I paused my trip to buy gas)</p>
        </div>
      `,
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
        }
      ],
      tipBox: {
        title: "💡 Quick Test",
        content: "Quit the habit? → gerund. Pause to do something else? → infinitive."
      },
      exercises: [
        {
          id: "special-case-stop-exercise",
          title: "Practice: STOP",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "I stopped ___ TV at midnight. (I quit the habit)",
              options: [
                { value: "to-watch", label: "to watch (paused to do it)" },
                { value: "watching", label: "watching (quit the habit)" }
              ],
              expectedAnswer: "watching"
            }
          ]
        }
      ]
    },
    {
      id: "special-case-remember",
      stepNumber: 4,
      title: "Special Case: REMEMBER",
      icon: "🧠",
      explanation: `
        <h3>Remember + Gerund vs Remember + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e">
          <p><strong>remember + gerund</strong> = recall a past event</p>
          <p>Example: I remember <strong>meeting</strong> you at the party. (I have a memory of it)</p>
          <p style="margin-top: 1rem"><strong>remember + infinitive</strong> = not forget to do something (future/present)</p>
          <p>Example: Remember <strong>to call</strong> your mother. (Don't forget!)</p>
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
        }
      ],
      tipBox: {
        title: "💡 Quick Test",
        content: "Past memory? → gerund. Future duty (don't forget)? → infinitive. 'I remember seeing you' vs 'Remember to call'."
      },
      exercises: [
        {
          id: "special-case-remember-exercise",
          title: "Practice: REMEMBER",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Remember ___ your keys before leaving. (Don't forget!)",
              options: [
                { value: "taking", label: "taking (past memory)" },
                { value: "to-take", label: "to take (don't forget)" }
              ],
              expectedAnswer: "to-take"
            }
          ]
        }
      ]
    },
    {
      id: "special-case-try",
      stepNumber: 5,
      title: "Special Case: TRY",
      icon: "🔬",
      explanation: `
        <h3>Try + Gerund vs Try + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e">
          <p><strong>try + gerund</strong> = experiment with something to see if it works</p>
          <p>Example: I'm tired. I'll try <strong>drinking</strong> coffee. (Let's see if coffee helps)</p>
          <p style="margin-top: 1rem"><strong>try + infinitive</strong> = make an effort, attempt</p>
          <p>Example: I'm trying <strong>to learn</strong> Spanish. (I'm making an effort)</p>
        </div>
      `,
      usageMeanings: [
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
        content: "Experiment to see if it works? → gerund. Make an effort or attempt? → infinitive."
      },
      exercises: [
        {
          id: "special-case-try-exercise",
          title: "Practice: TRY",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "If you have a headache, try ___ some water. (Experiment)",
              options: [
                { value: "to-drink", label: "to drink (make an effort)" },
                { value: "drinking", label: "drinking (experiment)" }
              ],
              expectedAnswer: "drinking"
            }
          ]
        }
      ]
    },
    {
      id: "verbs-both",
      stepNumber: 6,
      title: "Verbs That Take BOTH (Same Meaning)",
      icon: "🔀",
      explanation: `
        <p>Some verbs can be followed by <strong>either</strong> a gerund OR an infinitive with <strong>no change in meaning</strong>!</p>

        <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 119, 87, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0">
          <h3 class="gc-text-purple" style="margin-top: 0; ">✨ Good News!</h3>
          <p style="margin-bottom: 0">These verbs are <strong>flexible</strong> – you can use gerund OR infinitive and the meaning stays the same.</p>
        </div>

        <h3>Verbs with No Meaning Difference</h3>
        <div style="background-color: rgba(139, 92, 246, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2)">
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

        <div style="background-color: #fff3cd; border-left: 4px solid #f4d35e; padding: 15px; margin: 20px 0">
          <p><strong>⚠️ Note:</strong> While both forms work, native speakers often prefer gerunds for general statements and infinitives for specific situations.</p>
          <ul style="margin: 0.5rem 0 0 0">
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
                { value: "no", label: "No - only one form works" },
                { value: "yes", label: "Yes - both forms work (began raining / began to rain)" }
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
      stepNumber: 7,
      title: "GO + Gerund for Activities",
      icon: "🏃",
      explanation: `
        <p>Use <strong>go + gerund</strong> for recreational activities and sports!</p>

        <p><strong>Formula:</strong> <span class="gc-text-terracotta" style="background-color: #fed7aa; ; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600"><strong>go + verb-ing</strong></span></p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 15px; margin: 20px 0; border-radius: 8px">
          <p><strong>⚠️ Common Mistake:</strong></p>
          <p>❌ "I go <em>to swim</em>" or "I go <em>to shop</em>"</p>
          <p>✅ "I go <strong>swimming</strong>" or "I go <strong>shopping</strong>"</p>
        </div>

        <h3>Common "Go + Gerund" Activities</h3>
        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2)">
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
              options: ["to hike", "hiking", "hike"],
              expectedAnswer: "hiking"
            },
            {
              type: "select",
              label: "We went ___ at the lake yesterday.",
              options: ["fish", "to fish", "fishing"],
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
      id: "quick-fixes",
      stepNumber: 8,
      title: "Quick Fixes: Common Mistakes & Memory Tricks",
      icon: "🔧",
      explanation: `
        <p>Learn to <strong>spot errors</strong> and use <strong>memory tricks</strong> to fix them instantly!</p>

        <!-- Visual: Mistake → Memory Trick → Fix -->
        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(123, 168, 132, 0.08) 100%); border-radius: 1rem; padding: 1.5rem; margin: 1.5rem 0">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; text-align: center">
            <div style="background: rgba(239, 68, 68, 0.15); border-radius: 0.5rem; padding: 1rem">
              <div style="font-size: 1.5rem">❌</div>
              <div class="gc-text-red" style="font-weight: 700; ">Common Mistake</div>
            </div>
            <div class="gc-text-sage" style="font-size: 1.5rem; ">→</div>
            <div style="background: rgba(123, 168, 132, 0.15); border-radius: 0.5rem; padding: 1rem">
              <div style="font-size: 1.5rem">✅</div>
              <div class="gc-text-sage" style="font-weight: 700; ">Memory Trick Fix</div>
            </div>
          </div>
        </div>
      `,
      usageMeanings: [
        {
          title: "❌ Mistake: Infinitive After Preposition → 🔤 Fix: PREP = ING",
          description: "After a PREPosition, always use -ING (gerund)",
          examples: [
            { sentence: "❌ I'm interested in <strong>to learn</strong>", explanation: "WRONG – infinitive after preposition" },
            { sentence: "✅ I'm interested in <strong>learning</strong>", explanation: "PREP = ING! Use gerund after 'in'" },
            { sentence: "❌ She's good at <strong>to solve</strong>", explanation: "WRONG – infinitive after preposition" },
            { sentence: "✅ She's good at <strong>solving</strong>", explanation: "PREP = ING! Use gerund after 'at'" }
          ]
        },
        {
          title: "❌ Mistake: Wrong Verb + Form → 😊 Fix: Enjoy -ING, Want TO",
          description: "Enjoyment verbs → gerund. Goal verbs → infinitive.",
          examples: [
            { sentence: "❌ I <strong>enjoy to read</strong>", explanation: "WRONG – enjoy takes gerund" },
            { sentence: "✅ I <strong>enjoy reading</strong>", explanation: "Enjoy the -ING! Enjoyment → gerund" },
            { sentence: "❌ I <strong>want reading</strong>", explanation: "WRONG – want takes infinitive" },
            { sentence: "✅ I <strong>want to read</strong>", explanation: "Want TO do it! Goals → infinitive" }
          ]
        },
        {
          title: "❌ Mistake: 'Look forward to see' → ⚠️ Fix: TO as Preposition = ING",
          description: "In 'look forward to' and 'be used to', the 'to' is a preposition!",
          examples: [
            { sentence: "❌ I look forward to <strong>see</strong> you", explanation: "WRONG – 'to' is a preposition here!" },
            { sentence: "✅ I look forward to <strong>seeing</strong> you", explanation: "TO as preposition → use gerund" },
            { sentence: "❌ I'm used to <strong>wake</strong> up early", explanation: "WRONG – 'to' is a preposition here!" },
            { sentence: "✅ I'm used to <strong>waking</strong> up early", explanation: "TO as preposition → use gerund" }
          ]
        },
        {
          title: "❌ Mistake: Wrong Preposition → 📌 Fix: Learn the Fixed Phrase",
          description: "Each adjective has its own preposition—no rule, must memorize",
          examples: [
            { sentence: "❌ I'm interested <strong>to</strong> learn", explanation: "WRONG – use 'interested in'" },
            { sentence: "✅ I'm interested <strong>in</strong> learning", explanation: "interested in + gerund" },
            { sentence: "❌ She's good <strong>in</strong> solving problems", explanation: "WRONG – use 'good at'" },
            { sentence: "✅ She's good <strong>at</strong> solving problems", explanation: "good at + gerund" }
          ]
        },
        {
          title: "❌ Mistake: 'Go to swim' → 🏃 Fix: GO + Activity = GO -ING",
          description: "Activities with 'go' always use gerund",
          examples: [
            { sentence: "❌ Let's go <strong>to swim</strong>", explanation: "WRONG – go + infinitive" },
            { sentence: "✅ Let's go <strong>swimming</strong>", explanation: "GO + Activity = GO -ING!" },
            { sentence: "❌ I want to go <strong>to shop</strong>", explanation: "WRONG – go + infinitive" },
            { sentence: "✅ I want to go <strong>shopping</strong>", explanation: "GO + Activity = GO -ING!" }
          ]
        }
      ],
      tipBox: {
        title: "💡 The Golden Question",
        content: `Always ask: "What comes BEFORE the verb?"
                <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem">
                    <div><strong>Preposition?</strong> <span class="gc-text-terracotta" style="font-weight: 600">→</span> Use gerund (PREP = ING)</div>
                    <div><strong>GO + activity?</strong> <span class="gc-text-terracotta" style="font-weight: 600">→</span> Use gerund (GO -ING)</div>
                    <div><strong>Enjoy/finish/avoid?</strong> <span class="gc-text-terracotta" style="font-weight: 600">→</span> Use gerund (Enjoy the -ING)</div>
                    <div><strong>Want/plan/hope?</strong> <span style="color: #0369a1; font-weight: 600">→</span> Use infinitive (Want TO do it)</div>
                </div>`
      },
      exercises: [
        {
          id: "quick-fixes-error-spotting",
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
        },
        {
          id: "quick-fixes-apply-tricks",
          title: "Apply the Memory Tricks",
          instructions: "Use the memory tricks to choose the correct form.",
          items: [
            {
              type: "select",
              label: "PREP = ING: I'm tired ___ waiting.",
              options: ["to", "of"],
              expectedAnswer: "of"
            },
            {
              type: "select",
              label: "Enjoy the -ING: I enjoy ___.",
              options: ["to read", "reading"],
              expectedAnswer: "reading"
            },
            {
              type: "select",
              label: "Want TO: I want ___ Spanish.",
              options: ["to learn", "learning"],
              expectedAnswer: "to learn"
            },
            {
              type: "select",
              label: "GO -ING: Let's go ___.",
              options: ["to swim", "swimming"],
              expectedAnswer: "swimming"
            }
          ]
        }
      ]
    },
    {
      id: "summary",
      title: "Summary: Master Reference Chart",
      icon: "✓",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(123, 168, 132, 0.1) 0%, rgba(217, 119, 87, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <h3 class="gc-text-sage" style="margin-top: 0; ; font-size: 1.25rem">🎉 You Made It!</h3>
          <p style="margin-bottom: 0">Use this chart as your quick reference when choosing between gerund and infinitive.</p>
        </div>
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
      question: "What is the best strategy for choosing gerund or infinitive?",
      options: [
        { value: "a", label: "Use your favorite form" },
        { value: "b", label: "Look at what comes BEFORE the verb (subject, preposition, adjective, verb, noun)" },
        { value: "c", label: "Always use gerunds with long verbs and infinitives with short verbs" },
      ],
      correctAnswer: "b",
      explanation: "The key is to look at what comes BEFORE the verb. Subject? → gerund. Preposition? → gerund. Adjective (happy, important) or verb (want, plan) or noun (ability)? → infinitive.",
      skillTag: "meta-look-before-verb-strategy",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Which sentence uses a gerund as the subject?",
      options: [
        { value: "a", label: "I enjoy reading before bed." },
        { value: "b", label: "Reading before bed helps me relax." },
        { value: "c", label: "I want to read before bed." },
      ],
      correctAnswer: "b",
      explanation: "'Reading' is a gerund used as the subject. When the verb is the topic of the sentence, use -ING form.",
      skillTag: "subject-gerund-identification",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "Complete: '___ a new language takes time.'",
      options: [
        { value: "b", label: "To learn" },
        { value: "a", label: "Learning" },
        { value: "c", label: "Learn" },
      ],
      correctAnswer: "a",
      explanation: "When the verb is the subject, use the gerund: 'Learning a new language takes time.'",
      skillTag: "subject-gerund-choice",
      difficulty: "easy",
    },
    {
      id: "quiz-4",
      question: "What should you use after a preposition?",
      options: [
        { value: "c", label: "Either one" },
        { value: "b", label: "Always infinitive (to + verb)" },
        { value: "a", label: "Always gerund (-ing)" },
      ],
      correctAnswer: "a",
      explanation: "After a preposition (in, at, for, about), you MUST use a gerund. Example: 'I'm interested in learning' (not 'in to learn').",
      skillTag: "prep-plus-gerund-core-rule",
      difficulty: "easy",
    },
    {
      id: "quiz-5",
      question: "Choose the correct: 'I enjoy ___ books.'",
      options: [
        { value: "b", label: "to read" },
        { value: "a", label: "reading" },
        { value: "c", label: "read" },
      ],
      correctAnswer: "a",
      explanation: "'Enjoy' is always followed by a gerund: 'I enjoy reading books.'",
      skillTag: "verb-plus-gerund-enjoy-like-love",
      difficulty: "easy",
    },
    {
      id: "quiz-6",
      question: "Choose the correct: 'Thank you for ___ me.'",
      options: [
        { value: "c", label: "help" },
        { value: "a", label: "helping" },
        { value: "b", label: "to help" },
      ],
      correctAnswer: "a",
      explanation: "'For' is a preposition, so it must be followed by a gerund: 'Thank you for helping me.'",
      skillTag: "prep-for-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Choose the correct: 'I'm happy ___ you.' (The word before the blank is an adjective.)",
      options: [
        { value: "a", label: "to see" },
        { value: "b", label: "seeing" },
        { value: "c", label: "see" },
      ],
      correctAnswer: "a",
      explanation: "After an adjective (happy, important, ready), use an infinitive: 'I'm happy to see you.'",
      skillTag: "adjective-plus-infinitive-feelings",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "Choose the correct: 'It's important ___ on time.'",
      options: [
        { value: "b", label: "arriving" },
        { value: "c", label: "arrive" },
        { value: "a", label: "to arrive" },
      ],
      correctAnswer: "a",
      explanation: "After an adjective (important), use an infinitive: 'It's important to arrive on time.'",
      skillTag: "adjective-plus-infinitive-feelings",
      difficulty: "easy",
    },
    {
      id: "quiz-9",
      question: "Choose the correct: 'I have the ability ___ three languages.' (The word before the blank is a noun.)",
      options: [
        { value: "c", label: "speak" },
        { value: "a", label: "to speak" },
        { value: "b", label: "speaking" },
      ],
      correctAnswer: "a",
      explanation: "After certain nouns (ability, chance, time), use an infinitive: 'I have the ability to speak three languages.'",
      skillTag: "noun-plus-infinitive-ability-chance-time",
      difficulty: "easy",
    },
    {
      id: "quiz-10",
      question: "Choose the correct: 'I want ___ Japan someday.'",
      options: [
        { value: "b", label: "visiting" },
        { value: "a", label: "to visit" },
        { value: "c", label: "visit" },
      ],
      correctAnswer: "a",
      explanation: "Verbs like want, plan, need are followed by an infinitive: 'I want to visit Japan.'",
      skillTag: "verb-plus-infinitive-want-hope-plan",
      difficulty: "easy",
    },
    {
      id: "quiz-11",
      question: "Choose the correct: 'I look forward ___ you soon.' (Here 'to' is a preposition!)",
      options: [
        { value: "c", label: "seeing" },
        { value: "a", label: "to seeing" },
        { value: "b", label: "to see" },
      ],
      correctAnswer: "a",
      explanation: "In 'look forward to', 'to' is a preposition, so use a gerund: 'I look forward to seeing you.'",
      skillTag: "phrase-look-forward-to-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Which sentence correctly uses adjective + preposition + gerund?",
      options: [
        { value: "b", label: "She is good at to solve problems." },
        { value: "c", label: "She is good to solving problems." },
        { value: "a", label: "She is good at solving problems." },
      ],
      correctAnswer: "a",
      explanation: "After a preposition (at), use a gerund: 'good at solving problems.'",
      skillTag: "adj-prep-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question: "'I stopped smoking' vs 'I stopped to smoke' – what's the difference?",
      options: [
        { value: "c", label: "'Stopped to smoke' is wrong in English" },
        { value: "a", label: "'Stopped smoking' = quit the habit. 'Stopped to smoke' = paused to have a cigarette." },
        { value: "b", label: "No difference – same meaning" },
      ],
      correctAnswer: "a",
      explanation: "Stop + gerund = quit doing something. Stop + infinitive = pause one activity to do another. The meaning changes completely.",
      skillTag: "special-stop-gerund-vs-infinitive",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question: "Which is correct if you want to NOT forget a future action?",
      options: [
        { value: "b", label: "Remember calling your mother tonight." },
        { value: "a", label: "Remember to call your mother tonight." },
        { value: "c", label: "Remember call your mother tonight." },
      ],
      correctAnswer: "a",
      explanation: "Remember + infinitive = don't forget (future). Remember + gerund = recall a past event. For future reminders: 'Remember to call.'",
      skillTag: "special-remember-infinitive-future-duty",
      difficulty: "medium",
    }
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
