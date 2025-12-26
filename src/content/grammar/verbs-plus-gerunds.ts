import type { InteractiveGuideContent } from "@/types/activity";

export const verbsPlusGerundsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Verbs + Gerunds: Talking About Habits",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I enjoy walking." "I stopped smoking." "I avoid eating junk food." "I keep forgetting to exercise." Many common verbs are ALWAYS followed by -ing (gerunds), never by 'to' (infinitives). Using the wrong form sounds very strange to native speakers!</p>
                </div>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0;"><strong>📚 Part of the 6 Patterns:</strong> This guide focuses on <strong>Pattern 2: Verb + Gerund</strong> from the "Infinitives vs Gerunds" guide. For a complete overview of all 6 patterns (Subject = Gerund, Verb + Gerund, Preposition + Gerund, Adjective + Infinitive, Noun + Infinitive, and Verb + Infinitive), check out the main "Infinitives vs Gerunds" guide!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Certain verbs require gerunds (-ing) for talking about habits and activities:</p>
                <ul>
                    <li><strong>Health habits:</strong> "I stopped smoking." (NOT "I stopped to smoke")</li>
                    <li><strong>Wellness goals:</strong> "I enjoy exercising." (NOT "I enjoy to exercise")</li>
                    <li><strong>Daily routines:</strong> "I avoid eating fast food." (NOT "I avoid to eat")</li>
                    <li><strong>Progress tracking:</strong> "I finished writing my journal." (NOT "I finished to write")</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Reporting your healthy habit tracker results ("I keep exercising 3 times a week")</li>
                        <li>Talking about wellness changes ("I stopped eating junk food" "I enjoy walking now")</li>
                        <li>Practicing wellness presentations ("I avoid stressful situations" "I finished making my action plan")</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💪 These verbs help you describe your progress and commitment to healthy habits!</p>
                </div>
            `,
            exercises: [
                {
                    id: "verbs-gerunds-intro-1",
                    title: "Practice: Verbs + Gerunds",
                    instructions: "Choose the correct form after each verb.",
                    items: [
                        {
                            type: "radio",
                            label: '"I stopped _____ last year."',
                            options: [
                                { value: "a", label: "smoking (gerund -ing)" },
                                { value: "b", label: "to smoke (infinitive)" },
                                { value: "c", label: "smoke (base verb)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I enjoy _____."',
                            options: [
                                { value: "a", label: "exercising (gerund -ing)" },
                                { value: "b", label: "to exercise (infinitive)" },
                                { value: "c", label: "exercise (base verb)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why is using the correct form important?",
                            options: [
                                { value: "a", label: "Using the wrong form sounds very strange to native speakers" },
                                { value: "b", label: "It doesn't matter which form you use" },
                                { value: "c", label: "Only infinitives are correct" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-verbs-gerunds",
            stepNumber: 1,
            title: "Common Verbs That Take Gerunds",
            icon: "📝",
            explanation: `
                <h3>Verbs That ALWAYS Take Gerunds (Never Infinitives)</h3>
                <p>These verbs are ALWAYS followed by -ing form:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">The Big List:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
                        <div>
                            <p style="font-weight: bold; margin: 0;">• avoid</p>
                            <p style="font-weight: bold; margin: 0;">• enjoy</p>
                            <p style="font-weight: bold; margin: 0;">• finish</p>
                            <p style="font-weight: bold; margin: 0;">• keep (continue)</p>
                            <p style="font-weight: bold; margin: 0;">• stop</p>
                            <p style="font-weight: bold; margin: 0;">• quit</p>
                        </div>
                        <div>
                            <p style="font-weight: bold; margin: 0;">• consider</p>
                            <p style="font-weight: bold; margin: 0;">• suggest</p>
                            <p style="font-weight: bold; margin: 0;">• recommend</p>
                            <p style="font-weight: bold; margin: 0;">• mind</p>
                            <p style="font-weight: bold; margin: 0;">• miss</p>
                            <p style="font-weight: bold; margin: 0;">• practice</p>
                        </div>
                    </div>
                </div>

                <h3>Examples</h3>
                <ul>
                    <li>I <strong>avoid eating</strong> junk food. ❌ NOT "avoid to eat"</li>
                    <li>She <strong>enjoys walking</strong>. ❌ NOT "enjoys to walk"</li>
                    <li>I <strong>finished writing</strong> my journal. ❌ NOT "finished to write"</li>
                    <li>He <strong>keeps forgetting</strong> to take his medicine. ❌ NOT "keeps to forget"</li>
                    <li>I <strong>stopped smoking</strong> last year. ❌ NOT "stopped to smoke"</li>
                    <li>She <strong>quit drinking</strong> soda. ❌ NOT "quit to drink"</li>
                    <li>I'm <strong>considering joining</strong> a gym. ❌ NOT "considering to join"</li>
                </ul>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #d97757;">⚠️ Important!</h4>
                    <p style="margin: 0;">You CANNOT use infinitives (to + verb) with these verbs. It will sound VERY wrong!</p>
                </div>
            `,
            tipBox: {
                title: "💡 Memory Trick",
                content: "Think: AVOID, ENJOY, FINISH, KEEP, STOP, QUIT = all take -ING. No 'to'!",
            },
            exercises: [
                {
                    id: "verbs-plus-gerunds-common-verbs-1",
                    title: "Practice: Verbs That Take Gerunds",
                    instructions: "Choose the correct form (gerund or infinitive) after each verb.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I avoid eating junk food." },
                                { value: "b", label: "I avoid to eat junk food." },
                                { value: "c", label: "I avoid eat junk food." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "She enjoys walking." },
                                { value: "b", label: "She enjoys to walk." },
                                { value: "c", label: "She enjoys walk." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I finished writing my journal." },
                                { value: "b", label: "I finished to write my journal." },
                                { value: "c", label: "I finished write my journal." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What form comes after verbs like 'avoid,' 'enjoy,' 'finish,' 'stop'?",
                            options: [
                                { value: "a", label: "Always gerund (-ing form), never infinitive (to + verb)" },
                                { value: "b", label: "Always infinitive (to + verb)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "wellness-contexts",
            stepNumber: 2,
            title: "Wellness & Healthy Habits",
            icon: "🏋️",
            explanation: `
                <h3>Exercise & Physical Activity</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>I <strong>enjoy walking</strong> in the park every morning.</li>
                        <li>I <strong>stopped going</strong> to the gym because it's too expensive.</li>
                        <li>I <strong>keep forgetting</strong> to stretch after exercise.</li>
                        <li>I <strong>finished doing</strong> my yoga routine.</li>
                        <li>I <strong>avoid running</strong> because of my knee pain.</li>
                    </ul>
                </div>

                <h3>Nutrition & Diet</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>I <strong>quit eating</strong> fast food.</li>
                        <li>I <strong>avoid drinking</strong> soda.</li>
                        <li>I <strong>enjoy cooking</strong> healthy meals at home.</li>
                        <li>I <strong>stopped buying</strong> junk food.</li>
                        <li>I'm <strong>considering becoming</strong> vegetarian.</li>
                    </ul>
                </div>

                <h3>Bad Habits & Addictions</h3>
                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>I <strong>quit smoking</strong> 5 years ago.</li>
                        <li>I <strong>stopped drinking</strong> alcohol.</li>
                        <li>I <strong>avoid staying up</strong> late.</li>
                        <li>I <strong>stopped checking</strong> my phone before bed.</li>
                        <li>I <strong>quit biting</strong> my nails.</li>
                    </ul>
                </div>

                <h3>Wellness Practices</h3>
                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>I <strong>enjoy meditating</strong> in the morning.</li>
                        <li>I <strong>practice doing</strong> deep breathing exercises.</li>
                        <li>I <strong>keep trying</strong> to get 8 hours of sleep.</li>
                        <li>I <strong>finished reading</strong> a book about stress management.</li>
                        <li>I <strong>miss having</strong> time to relax.</li>
                    </ul>
                </div>

                <h3>Habit Tracking</h3>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>I <strong>started tracking</strong> my water intake. (Note: 'start' can take gerund OR infinitive!)</li>
                        <li>I <strong>enjoy recording</strong> my progress in a journal.</li>
                        <li>I <strong>keep forgetting</strong> to log my meals.</li>
                        <li>I <strong>finished completing</strong> my weekly wellness goals.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "verbs-plus-gerunds-wellness-1",
                    title: "Practice: Verbs + Gerunds in Wellness Contexts",
                    instructions: "Choose the correct form (gerund) after verbs that take gerunds.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence correctly uses a verb + gerund?",
                            options: [
                                { value: "a", label: "I enjoy walking in the park every morning." },
                                { value: "b", label: "I enjoy to walk in the park every morning." },
                                { value: "c", label: "I enjoy walk in the park every morning." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'quit' + gerund?",
                            options: [
                                { value: "a", label: "I quit eating fast food." },
                                { value: "b", label: "I quit to eat fast food." },
                                { value: "c", label: "I quit eat fast food." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'avoid' + gerund?",
                            options: [
                                { value: "a", label: "I avoid drinking soda." },
                                { value: "b", label: "I avoid to drink soda." },
                                { value: "c", label: "I avoid drink soda." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'finished' + gerund?",
                            options: [
                                { value: "a", label: "I finished doing my yoga routine." },
                                { value: "b", label: "I finished to do my yoga routine." },
                                { value: "c", label: "I finished do my yoga routine." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "verb-categories",
            stepNumber: 3,
            title: "Why These Verbs Take Gerunds",
            icon: "🤔",
            explanation: `
                <h3>Pattern #1: Verbs About Stopping/Avoiding</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>stop, quit, avoid, give up</strong></p>
                    <p>These verbs describe ending or not doing an activity:</p>
                    <ul>
                        <li>I stopped <strong>smoking</strong>. (I ended the activity of smoking)</li>
                        <li>I quit <strong>drinking</strong> soda. (I ended the habit)</li>
                        <li>I avoid <strong>eating</strong> sugar. (I don't do this activity)</li>
                    </ul>
                </div>

                <h3>Pattern #2: Verbs About Continuing</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>keep, continue</strong></p>
                    <p>These verbs describe ongoing activities:</p>
                    <ul>
                        <li>I keep <strong>forgetting</strong> to exercise. (ongoing problem)</li>
                        <li>I continue <strong>working</strong> on my health. (ongoing activity)</li>
                    </ul>
                </div>

                <h3>Pattern #3: Verbs About Completion</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>finish</strong></p>
                    <p>This verb describes completing an activity:</p>
                    <ul>
                        <li>I finished <strong>writing</strong> my journal. (I completed the activity)</li>
                        <li>I finished <strong>exercising</strong>. (I completed the workout)</li>
                    </ul>
                </div>

                <h3>Pattern #4: Verbs About Feelings/Opinions</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1px 0;">
                    <p><strong>enjoy, love, hate, dislike, don't mind, miss</strong></p>
                    <p>These verbs describe your feelings about an activity:</p>
                    <ul>
                        <li>I enjoy <strong>walking</strong>. (I like the activity)</li>
                        <li>I hate <strong>running</strong>. (I dislike the activity)</li>
                        <li>I miss <strong>eating</strong> junk food. (I have nostalgia for the activity)</li>
                        <li>I don't mind <strong>cooking</strong>. (I'm okay with the activity)</li>
                    </ul>
                </div>

                <h3>Pattern #5: Verbs About Thinking/Considering</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>consider, suggest, recommend</strong></p>
                    <p>These verbs describe thinking about activities:</p>
                    <ul>
                        <li>I'm considering <strong>joining</strong> a gym. (thinking about it)</li>
                        <li>I suggest <strong>trying</strong> meditation. (recommendation)</li>
                        <li>The doctor recommended <strong>walking</strong> 30 minutes daily.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "verbs-plus-gerunds-why-1",
                    title: "Practice: Understanding Why Verbs Take Gerunds",
                    instructions: "Identify which verb patterns take gerunds and why.",
                    items: [
                        {
                            type: "radio",
                            label: "Which verbs describe stopping or avoiding an activity?",
                            options: [
                                { value: "a", label: "stop, quit, avoid, give up (all take gerunds)" },
                                { value: "b", label: "stop, quit, avoid (take infinitives)" },
                                { value: "c", label: "enjoy, love, hate (these are different - feelings)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which verbs describe ongoing activities?",
                            options: [
                                { value: "a", label: "keep, continue (take gerunds for ongoing activities)" },
                                { value: "b", label: "finish, complete (these are about completion)" },
                                { value: "c", label: "enjoy, love (these are about feelings)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which verbs describe feelings or opinions about activities?",
                            options: [
                                { value: "a", label: "enjoy, love, hate, dislike, miss (take gerunds for activities)" },
                                { value: "b", label: "stop, quit, avoid (these are about stopping)" },
                                { value: "c", label: "finish, complete (these are about completion)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which verbs describe thinking about or recommending activities?",
                            options: [
                                { value: "a", label: "consider, suggest, recommend (take gerunds for activities being considered)" },
                                { value: "b", label: "stop, quit (these are about stopping)" },
                                { value: "c", label: "enjoy, love (these are about feelings)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "special-cases",
            stepNumber: 4,
            title: "Special Case: 'Stop' with Different Meanings",
            icon: "⚠️",
            explanation: `
                <h3>'Stop' Can Take Gerund OR Infinitive (Different Meanings!)</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>stop + gerund = quit/end the activity</h4>
                    <ul>
                        <li>I <strong>stopped smoking</strong>. (I quit smoking, I don't smoke anymore)</li>
                        <li>I <strong>stopped eating</strong> meat. (I became vegetarian)</li>
                        <li>I <strong>stopped drinking</strong> coffee. (I quit coffee)</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>stop + infinitive = pause one activity to do another</h4>
                    <ul>
                        <li>I <strong>stopped to smoke</strong>. (I paused what I was doing, THEN I smoked)</li>
                        <li>I <strong>stopped to eat</strong>. (I paused, THEN I ate)</li>
                        <li>I <strong>stopped to rest</strong>. (I paused my activity, THEN I rested)</li>
                    </ul>
                </div>

                <h3>Compare:</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">stop + gerund</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">stop + infinitive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I stopped smoking. (I quit)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I stopped to smoke. (I paused to have a cigarette)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I stopped eating meat. (I became vegetarian)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I stopped to eat. (I paused my drive to grab food)</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "stop + -ing = quit. stop + to = pause to do something else.",
            },
            exercises: [
                {
                    id: "verbs-plus-gerunds-stop-special-1",
                    title: "Practice: Stop + -ing vs Stop + to",
                    instructions: "Choose the form that matches the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '"I stopped smoking." What does it mean?',
                            options: [
                                { value: "a", label: "I quit the activity (I do not smoke anymore)." },
                                { value: "b", label: "I paused another activity to smoke." },
                                { value: "c", label: "I plan to smoke later." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I stopped to smoke." What does it mean?',
                            options: [
                                { value: "a", label: "I quit smoking forever." },
                                { value: "b", label: "I paused what I was doing in order to smoke." },
                                { value: "c", label: "I hate smoking." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "text",
                            label: "Complete: I stopped ___ (smoke) because it was expensive.",
                            expectedAnswer: "smoking",
                        },
                        {
                            type: "text",
                            label: "Complete: We stopped ___ (eat) because we were getting hungry during the trip.",
                            expectedAnswer: "to eat",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using infinitive instead of gerund</h3>
                <ul>
                    <li>❌ "I enjoy <strong>to walk</strong>." → ✅ "I enjoy <strong>walking</strong>."</li>
                    <li>❌ "I stopped <strong>to smoke</strong>." (means you paused!) → ✅ "I stopped <strong>smoking</strong>." (quit)</li>
                    <li>❌ "I avoid <strong>to eat</strong> sugar." → ✅ "I avoid <strong>eating</strong> sugar."</li>
                    <li>❌ "I finished <strong>to write</strong>." → ✅ "I finished <strong>writing</strong>."</li>
                </ul>

                <h3>Mistake #2: Forgetting the gerund entirely</h3>
                <ul>
                    <li>❌ "I enjoy walk." → ✅ "I enjoy walk<strong>ing</strong>."</li>
                    <li>❌ "I keep forget." → ✅ "I keep forget<strong>ting</strong>."</li>
                </ul>

                <h3>Mistake #3: Confusing gerund with present continuous</h3>
                <ul>
                    <li>❌ "I am enjoy walking." → ✅ "I enjoy walking." (no 'am'!)</li>
                    <li>Gerund ≠ present continuous. Just use: verb + -ing</li>
                </ul>
            `,
            exercises: [
                {
                    id: "verbs-plus-gerunds-common-mistakes-1",
                    title: "Practice: Common Mistakes with Verbs + Gerunds",
                    instructions: "Identify and correct common mistakes.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Mistake #1?",
                            options: [
                                { value: "a", label: "Using infinitive instead of gerund - 'I enjoy to walk' should be 'I enjoy walking' (gerund)" },
                                { value: "b", label: "Using wrong verb" },
                                { value: "c", label: "Missing the object" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #2?",
                            options: [
                                { value: "a", label: "Forgetting the gerund entirely - 'I enjoy walk' should be 'I enjoy walking' (needs -ing)" },
                                { value: "b", label: "Using wrong tense" },
                                { value: "c", label: "Using wrong subject" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #3?",
                            options: [
                                { value: "a", label: "Confusing gerund with present continuous - 'I am enjoy walking' should be 'I enjoy walking' (no 'am')" },
                                { value: "b", label: "Using wrong verb form" },
                                { value: "c", label: "Missing the -ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What's the difference between 'I stopped smoking' and 'I stopped to smoke'?",
                            options: [
                                { value: "a", label: "'Stopped smoking' = quit the habit; 'stopped to smoke' = paused to do something (different meanings)" },
                                { value: "b", label: "They mean the same thing" },
                                { value: "c", label: "One is past, one is present" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "verbs-plus-gerunds-ex-1",
                    title: "Exercise 1: Enjoy + -ing",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I enjoy _____ (walk) in the park.",
                            expectedAnswer: "walking",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-2",
                    title: "Exercise 2: Stop + -ing (Quit)",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I stopped _____ (smoke) last year. (meaning: quit)",
                            expectedAnswer: "smoking",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-3",
                    title: "Exercise 3: Fix the Error",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "I avoid to eat sugar."',
                            options: [
                                { value: "a", label: "I avoid eating sugar." },
                                { value: "b", label: "I avoid to eat sugar." },
                                { value: "c", label: "I avoid eat sugar." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-4",
                    title: "Exercise 4: Finish + -ing",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I finished _____ (write) my journal.",
                            expectedAnswer: "writing",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-5",
                    title: "Exercise 5: Keep + -ing",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I keep _____ (forget) to take my medicine.",
                            expectedAnswer: "forgetting",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-6",
                    title: "Exercise 6: Consider + -ing",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I'm considering _____ (join) a gym.",
                            expectedAnswer: "joining",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-7",
                    title: "Exercise 7: Stop + -ing vs Stop + to",
                    instructions: "Match each sentence to its meaning.",
                    items: [
                        {
                            type: "radio",
                            label: 'Meaning of "I stopped smoking":',
                            options: [
                                { value: "quit", label: "I quit (I don't smoke anymore)." },
                                { value: "pause", label: "I paused in order to smoke." },
                            ],
                            expectedAnswer: "quit",
                        },
                        {
                            type: "radio",
                            label: 'Meaning of "I stopped to smoke":',
                            options: [
                                { value: "quit", label: "I quit (I don't smoke anymore)." },
                                { value: "pause", label: "I paused in order to smoke." },
                            ],
                            expectedAnswer: "pause",
                        },
                    ],
                },
                {
                    id: "verbs-plus-gerunds-ex-8",
                    title: "Exercise 8: Quit + -ing",
                    instructions: "Complete with the gerund (-ing form).",
                    items: [
                        {
                            type: "text",
                            label: "I quit _____ (drink) soda.",
                            expectedAnswer: "drinking",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference Guide",
            icon: "📋",
            explanation: `
                <h3>Verbs That ALWAYS Take Gerunds (-ing)</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; margin-bottom: 0.5rem;">Core List:</p>
                    <ul style="column-count: 2; margin: 0;">
                        <li>avoid</li>
                        <li>enjoy</li>
                        <li>finish</li>
                        <li>keep</li>
                        <li>stop (to quit)</li>
                        <li>quit</li>
                        <li>consider</li>
                        <li>suggest</li>
                        <li>recommend</li>
                        <li>mind</li>
                        <li>miss</li>
                        <li>practice</li>
                    </ul>
                </div>

                <h3>Common Patterns</h3>
                <ul>
                    <li><strong>Stopping:</strong> stop, quit, avoid, give up + -ing</li>
                    <li><strong>Continuing:</strong> keep, continue + -ing</li>
                    <li><strong>Completing:</strong> finish + -ing</li>
                    <li><strong>Feelings:</strong> enjoy, love, hate, dislike, miss + -ing</li>
                    <li><strong>Thinking:</strong> consider, suggest, recommend + -ing</li>
                </ul>

                <h3>Special Case: Stop</h3>
                <ul>
                    <li><strong>stop + gerund:</strong> quit/end (I stopped smoking = I quit)</li>
                    <li><strong>stop + infinitive:</strong> pause to do (I stopped to smoke = I paused, then smoked)</li>
                </ul>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ enjoy to walk → ✅ enjoy walk<strong>ing</strong></li>
                    <li>❌ avoid to eat → ✅ avoid eat<strong>ing</strong></li>
                    <li>❌ finish to write → ✅ finish writ<strong>ing</strong></li>
                    <li>❌ keep to forget → ✅ keep forgett<strong>ing</strong></li>
                </ul>
            `,
            tipBox: {
                title: "💡 Memory Aid",
                content: "If the verb is about STOPPING, CONTINUING, FINISHING, FEELINGS, or THINKING → use -ING!",
            },
            exercises: [
                {
                    id: "verbs-plus-gerunds-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of verbs that take gerunds.",
                    items: [
                        {
                            type: "radio",
                            label: "What form comes after verbs like 'avoid,' 'enjoy,' 'finish,' 'stop'?",
                            options: [
                                { value: "a", label: "Always gerund (-ing form), never infinitive (to + verb)" },
                                { value: "b", label: "Always infinitive (to + verb)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the difference between 'stop + gerund' and 'stop + infinitive'?",
                            options: [
                                { value: "a", label: "stop + gerund = quit | stop + infinitive = pause to do something" },
                                { value: "b", label: "They mean the same thing" },
                                { value: "c", label: "stop + gerund = pause | stop + infinitive = quit" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I enjoy walking." },
                                { value: "b", label: "I enjoy to walk." },
                                { value: "c", label: "I enjoy walk." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which verbs take gerunds?",
                            options: [
                                { value: "a", label: "avoid, enjoy, finish, keep, stop, quit, consider, suggest, recommend, mind, miss, practice" },
                                { value: "b", label: "want, need, plan, decide, hope" },
                                { value: "c", label: "All verbs take gerunds" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I finished writing my journal." },
                                { value: "b", label: "I finished to write my journal." },
                                { value: "c", label: "I finished write my journal." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I enjoy to walk." },
                { value: "b", label: "I enjoy walking." },
                { value: "c", label: "I enjoy walk." },
            ],
            correctAnswer: "b",
            explanation: "'Enjoy' always takes a gerund (-ing form), not an infinitive.",
        },
        {
            id: "quiz-2",
            question: "Complete: I stopped _____ last year. (quit smoking)",
            options: [
                { value: "a", label: "to smoke" },
                { value: "b", label: "smoking" },
                { value: "c", label: "smoke" },
            ],
            correctAnswer: "b",
            explanation: "'Stop + gerund' means quit. 'I stopped smoking' = I quit smoking.",
        },
        {
            id: "quiz-3",
            question: "Which verb does NOT take a gerund?",
            options: [
                { value: "a", label: "avoid" },
                { value: "b", label: "want" },
                { value: "c", label: "finish" },
            ],
            correctAnswer: "b",
            explanation: "'Want' takes an infinitive (want to...), not a gerund. Avoid and finish take gerunds.",
        },
        {
            id: "quiz-4",
            question: "Complete: I finished _____ my journal.",
            options: [
                { value: "a", label: "to write" },
                { value: "b", label: "writing" },
                { value: "c", label: "write" },
            ],
            correctAnswer: "b",
            explanation: "'Finish' always takes a gerund: 'finished writing.'",
        },
        {
            id: "quiz-5",
            question: "What's the difference? 'I stopped smoking' vs 'I stopped to smoke'",
            options: [
                { value: "a", label: "They mean the same thing" },
                { value: "b", label: "First = quit, Second = paused to have a cigarette" },
                { value: "c", label: "First = paused, Second = quit" },
            ],
            correctAnswer: "b",
            explanation: "'stop + gerund' = quit. 'stop + infinitive' = pause one activity to do another.",
        },
        {
            id: "quiz-6",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I avoid to eat sugar." },
                { value: "b", label: "I avoid eating sugar." },
                { value: "c", label: "I avoid eat sugar." },
            ],
            correctAnswer: "b",
            explanation: "'Avoid' always takes a gerund: 'avoid eating.'",
        },
    ],
};
