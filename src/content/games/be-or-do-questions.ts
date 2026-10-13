/**
 * "Be or Do?" — Week 5 question game.
 *
 * Present: rounds 1-2 pick BE or DO; round 3 picks the exact word.
 * Past: round 4 picks BE or DO (was / were vs did); round 5 picks the exact word.
 * Round 6 mixes present and past, so the time words decide the tense.
 * The rule the game teaches is "find the verb": if the verb is BE, BE jumps to the
 * front; any other verb (including feel, like, have, need, know) needs DO.
 *
 * Card format (see parseBeOrDoRounds):
 *   ___ question :: Answer :: key: value :: key: value
 * Keys: context, verb (underlined in the answer), reply, why, hint, twin.
 * A twin card follows its same-meaning partner, so cards are played in this order.
 */

export const BE_OR_DO_ACTIVITY_ID = "be-or-do-questions";
export const BE_OR_DO_TITLE = "Be or Do?";
export const BE_OR_DO_DESCRIPTION =
  "Finish each question with BE or DO, in the present and the past. Find the verb: BE jumps to the front; any other verb needs do, does, or did.";

const NO_VERB = "Look after the blank. Is there a verb? If not, the missing verb is BE.";

export const BE_OR_DO_CONTENT = `GAME: be-or-do

[ROUND 1]
NOTE: Find the verb. If the verb is am, is, or are, BE jumps to the front 🦘. If there is another verb, DO comes to help 🤝.
___ you tired? :: Are :: context: Your classmate is yawning. :: reply: Yes, I am. :: why: There is no verb after "you". The sentence is "You are tired," so BE jumps to the front. :: hint: ${NO_VERB}
___ you feel tired? :: Do :: verb: feel :: twin: Are you tired? :: context: Ask the same thing another way. :: reply: Yes, I do. :: why: The verb is feel. Feel is not BE, so DO comes to help. :: hint: Find the verb: feel. Is feel am, is, or are?
___ you back up your photos? :: Do :: verb: back up :: context: Ask about phone habits. :: reply: Yes, I do. :: why: The verb is back up. It is not BE, so DO helps. :: hint: Find the verb: back up. Is it am, is, or are?
___ your phone charged? :: Is :: context: Before a video call. :: reply: Yes, it is. :: why: There is no verb after "your phone". The sentence is "Your phone is charged," so BE jumps to the front. :: hint: ${NO_VERB}
___ it cold in here? :: Is :: context: At the library. :: reply: Yes, it is. :: why: There is no verb after "it". The sentence is "It is cold," so BE jumps to the front. :: hint: ${NO_VERB}
___ it feel cold in here? :: Does :: verb: feel :: twin: Is it cold in here? :: context: Ask the same thing another way. :: reply: Yes, it does. :: why: The verb is feel. With it, DO becomes does. :: hint: Find the verb: feel. Is feel am, is, or are?
___ she use a password manager? :: Does :: verb: use :: context: Ask about your coworker. :: reply: Yes, she does. :: why: The verb is use. With he, she, or it, DO becomes does. :: hint: Find the verb: use. Is it am, is, or are?
___ you on WhatsApp? :: Are :: context: Your neighbor wants your number. :: reply: Yes, I am. :: why: There is no verb after "you". The sentence is "You are on WhatsApp," so BE jumps to the front. :: hint: ${NO_VERB}
___ you have WhatsApp? :: Do :: verb: have :: twin: Are you on WhatsApp? :: context: Ask the same thing another way. :: reply: Yes, I do. :: why: The verb is have. Have is not BE, so DO helps. :: hint: Find the verb: have. Is have am, is, or are?
___ they check email every day? :: Do :: verb: check :: context: Ask about your classmates. :: reply: Yes, they do. :: why: The verb is check. It is not BE, so DO helps. :: hint: Find the verb: check. Is it am, is, or are?

[ROUND 2]
NOTE: Careful! Some verbs are not actions, but they still need DO: like, want, need, have, know.
___ you hungry? :: Are :: context: Ask your classmate before lunch. :: reply: Yes, I am. :: why: No verb after "you". In English we say "I am hungry," not "I have hunger." :: hint: ${NO_VERB}
___ you like your new phone? :: Do :: verb: like :: context: Your friend got a new phone. :: reply: Yes, I do. :: why: Like is not an action, but it is a verb, and it is not BE. So DO helps. :: hint: Find the verb: like. Is like am, is, or are?
___ you watching a video now? :: Are :: verb: watching :: context: Your friend can't hear you. :: reply: Yes, I am. :: why: Watching has -ing. A verb with -ing always comes with BE: "You are watching." :: hint: Watching has -ing. Verb-ing always goes with am, is, or are.
___ you 30 years old? :: Are :: context: Filling out a form together. :: reply: No, I'm 32. :: why: No verb after "you". In English, age uses BE: "I am 30," not "I have 30 years." :: hint: ${NO_VERB}
___ he need a new charger? :: Does :: verb: need :: context: Your son's phone is always dead. :: reply: Yes, he does. :: why: Need is not an action, but it is a verb, and it is not BE. With he, DO becomes does. :: hint: Find the verb: need. Is need am, is, or are?
___ the Wi-Fi slow today? :: Is :: context: At the library. :: reply: Yes, it is. :: why: No verb after "the Wi-Fi". The sentence is "The Wi-Fi is slow," so BE jumps to the front. :: hint: ${NO_VERB}
___ you know your password? :: Do :: verb: know :: context: The app wants you to log in. :: reply: No, I don't! :: why: Know happens in your head, but it is still a verb, and it is not BE. So DO helps. :: hint: Find the verb: know. Is know am, is, or are?
___ your kids playing games right now? :: Are :: verb: playing :: context: It's late on a school night. :: reply: Yes, they are. :: why: Playing has -ing. A verb with -ing always comes with BE: "They are playing." :: hint: Playing has -ing. Verb-ing always goes with am, is, or are.
___ you a student? :: Are :: context: Meeting someone new. :: reply: Yes, I am. :: why: No verb after "you". The sentence is "You are a student," so BE jumps to the front. :: hint: ${NO_VERB}
___ you study English? :: Do :: verb: study :: twin: Are you a student? :: context: Ask the same thing another way. :: reply: Yes, I do. :: why: The verb is study. It is not BE, so DO helps. :: hint: Find the verb: study. Is it am, is, or are?
How old ___ you? :: are :: context: Filling out a form together. :: reply: I'm 45. :: why: No verb after "you". Age uses BE: "You are 45." :: hint: ${NO_VERB}
What ___ you do on weekends? :: do :: verb: do :: context: Getting to know a classmate. :: reply: I play soccer. :: why: The main verb is do. Do is not BE, so DO helps. Yes, it is "do" two times! :: hint: Find the verb after "you": do. Is do am, is, or are?

[ROUND 3]
MODE: form
NOTE: Now choose the exact word. Look at the subject: I → am · he / she / it → is or does · you / we / they → are or do.
___ your sister on Facebook? :: Is :: context: Ask about your friend's family. :: reply: Yes, she is. :: why: No verb, so BE. Your sister = she, so is. :: hint: ${NO_VERB}
___ your sister use Facebook? :: Does :: verb: use :: twin: Is your sister on Facebook? :: context: Ask the same thing another way. :: reply: Yes, she does. :: why: The verb is use, so DO. Your sister = she, so does. :: hint: Find the verb: use. Is it am, is, or are?
___ I late? :: Am :: context: You run into class. :: reply: No, you're on time. :: why: No verb, so BE. With I, use am. :: hint: ${NO_VERB}
___ we need a password? :: Do :: verb: need :: context: Logging in to the library Wi-Fi. :: reply: Yes, we do. :: why: The verb is need, so DO. With we, use do. :: hint: Find the verb: need. Is need am, is, or are?
___ the kids tired? :: Are :: context: After a long day. :: reply: Yes, they are. :: why: No verb, so BE. The kids = they, so are. :: hint: ${NO_VERB}
___ the kids feel tired? :: Do :: verb: feel :: twin: Are the kids tired? :: context: Ask the same thing another way. :: reply: Yes, they do. :: why: The verb is feel, so DO. The kids = they, so do. :: hint: Find the verb: feel. Is feel am, is, or are?
___ your phone work? :: Does :: verb: work :: context: Your phone fell in the water. :: reply: No, it doesn't. :: why: The verb is work, so DO. Your phone = it, so does. :: hint: Find the verb: work. Is it am, is, or are?
___ this app free? :: Is :: context: Before you download it. :: reply: Yes, it is. :: why: No verb, so BE. This app = it, so is. :: hint: ${NO_VERB}
___ they using the library computers? :: Are :: verb: using :: context: Look at the people over there. :: reply: Yes, they are. :: why: Using has -ing, so BE. With they, use are. :: hint: Using has -ing. Verb-ing always goes with am, is, or are.
___ he feel sick today? :: Does :: verb: feel :: context: Your coworker went home early. :: reply: Yes, he does. :: why: The verb is feel, so DO. With he, use does. :: hint: Find the verb: feel. Is feel am, is, or are?
Where ___ you work? :: do :: verb: work :: context: Getting to know a classmate. :: reply: At the hospital. :: why: The verb is work, so DO. With you, use do. :: hint: Find the verb: work. Is it am, is, or are?
Where ___ your office? :: is :: context: Your first day at a new job. :: reply: On the second floor. :: why: No verb, so BE. Your office = it, so is. :: hint: ${NO_VERB}

[ROUND 4]
NOTE: Now the past! Find the verb. If it is was or were, BE jumps to the front 🦘. If there is another verb, use did 🤝.
___ you tired last night? :: Were :: context: Your classmate looks sleepy today. :: reply: Yes, I was. :: why: There is no verb after "you". The sentence is "You were tired," so BE jumps to the front. :: hint: ${NO_VERB}
___ you feel tired last night? :: Did :: verb: feel :: twin: Were you tired last night? :: context: Ask the same thing another way. :: reply: Yes, I did. :: why: The verb is feel. Feel is not BE, so DID comes to help. :: hint: Find the verb: feel. Is feel was or were?
___ the Wi-Fi slow yesterday? :: Was :: context: At the library. :: reply: Yes, it was. :: why: No verb after "the Wi-Fi". The sentence is "The Wi-Fi was slow," so BE jumps to the front. :: hint: ${NO_VERB}
___ she call you yesterday? :: Did :: verb: call :: context: Your friend wanted to talk. :: reply: Yes, she did. :: why: The verb is call. It is not BE, so DID helps. :: hint: Find the verb: call. Is it was or were?
___ you at home on Sunday? :: Were :: context: Ask about the weekend. :: reply: Yes, I was. :: why: No verb after "you". The sentence is "You were at home," so BE jumps to the front. :: hint: ${NO_VERB}
___ you stay home on Sunday? :: Did :: verb: stay :: twin: Were you at home on Sunday? :: context: Ask the same thing another way. :: reply: Yes, I did. :: why: The verb is stay. It is not BE, so DID helps. :: hint: Find the verb: stay. Is it was or were?
___ it cold this morning? :: Was :: context: Your coworker came in with a big coat. :: reply: Yes, it was. :: why: No verb after "it". The sentence is "It was cold," so BE jumps to the front. :: hint: ${NO_VERB}
___ they watch the video last night? :: Did :: verb: watch :: context: Ask about your classmates' homework. :: reply: Yes, they did. :: why: The verb is watch. It is not BE, so DID helps. :: hint: Find the verb: watch. Is it was or were?
___ your kids sick last week? :: Were :: context: Your neighbor's kids missed school. :: reply: Yes, they were. :: why: No verb after "your kids". The sentence is "Your kids were sick," so BE jumps to the front. :: hint: ${NO_VERB}
___ you have a good weekend? :: Did :: verb: have :: context: Monday morning in class. :: reply: Yes, I did. :: why: Have is a verb, and it is not BE. So DID helps. :: hint: Find the verb: have. Is have was or were?
___ he watching TV when you called? :: Was :: verb: watching :: context: Your brother didn't answer the phone. :: reply: Yes, he was. :: why: Watching has -ing. A verb with -ing comes with BE: "He was watching." :: hint: Watching has -ing. Verb-ing always goes with BE (was or were).
___ you know the answer? :: Did :: verb: know :: context: After the quiz. :: reply: Yes, I did! :: why: Know happens in your head, but it is still a verb, and it is not BE. So DID helps. :: hint: Find the verb: know. Is know was or were?

[ROUND 5]
MODE: form
NOTE: Choose the exact word. I / he / she / it → was · you / we / they → were · did works with every subject.
___ I late yesterday? :: Was :: context: You ask your teacher. :: reply: No, you were on time. :: why: No verb, so BE. With I, use was. :: hint: ${NO_VERB}
___ your sister at the party? :: Was :: context: Ask about your friend's family. :: reply: Yes, she was. :: why: No verb, so BE. Your sister = she, so was. :: hint: ${NO_VERB}
___ your sister go to the party? :: Did :: verb: go :: twin: Was your sister at the party? :: context: Ask the same thing another way. :: reply: Yes, she did. :: why: The verb is go, so DO. In the past, use did. :: hint: Find the verb: go. Is it was or were?
___ we need a password last time? :: Did :: verb: need :: context: Logging in to the library Wi-Fi again. :: reply: Yes, we did. :: why: The verb is need, so DO. In the past, use did. :: hint: Find the verb: need. Is need was or were?
___ the kids tired after school? :: Were :: context: Yesterday was a long day. :: reply: Yes, they were. :: why: No verb, so BE. The kids = they, so were. :: hint: ${NO_VERB}
___ the kids feel tired after school? :: Did :: verb: feel :: twin: Were the kids tired after school? :: context: Ask the same thing another way. :: reply: Yes, they did. :: why: The verb is feel, so DO. In the past, use did. :: hint: Find the verb: feel. Is feel was or were?
___ your phone work after it fell? :: Did :: verb: work :: context: Your phone fell in the water. :: reply: No, it didn't. :: why: The verb is work, so DO. In the past, use did. :: hint: Find the verb: work. Is it was or were?
___ the movie good? :: Was :: context: Your friend went to the movies last night. :: reply: Yes, it was. :: why: No verb, so BE. The movie = it, so was. :: hint: ${NO_VERB}
___ they using the computers this morning? :: Were :: verb: using :: context: The library was busy. :: reply: Yes, they were. :: why: Using has -ing, so BE. With they, use were. :: hint: Using has -ing. Verb-ing always goes with BE (was or were).
Where ___ you yesterday? :: were :: context: You missed class. :: reply: At the doctor. :: why: No verb after "you", so BE. With you, use were. :: hint: ${NO_VERB}
Where ___ you go yesterday? :: did :: verb: go :: context: Your classmate asks one more question. :: reply: To the doctor. :: why: The verb is go, so DO. In the past, use did. :: hint: Find the verb: go. Is it was or were?
How ___ the test? :: was :: context: Your classmate just finished the test. :: reply: It was easy! :: why: No verb after "the test", so BE. The test = it, so was. :: hint: ${NO_VERB}

[ROUND 6]
MODE: form
NOTE: Final challenge: present or past? Look for the time words. Now / every day → am, is, are, do, does. Yesterday / last night → was, were, did.
___ you tired now? :: Are :: context: Look for the time word: now. :: reply: Yes, I am. :: why: Now is the present. No verb, so BE: are. :: hint: ${NO_VERB}
___ you tired yesterday? :: Were :: context: Look for the time word: yesterday. :: reply: Yes, I was. :: why: Yesterday is the past. No verb, so BE: were. :: hint: ${NO_VERB}
___ she use Zoom every day? :: Does :: verb: use :: context: Look for the time word: every day. :: reply: Yes, she does. :: why: Every day is the present. The verb is use, so DO. With she, use does. :: hint: Find the verb: use. Is it BE?
___ she use Zoom yesterday? :: Did :: verb: use :: context: Look for the time word: yesterday. :: reply: Yes, she did. :: why: Yesterday is the past. The verb is use, so did. :: hint: Find the verb: use. Is it BE?
___ the store open today? :: Is :: context: Look for the time word: today. :: reply: Yes, it is. :: why: Today is the present. No verb (open describes the store), so BE: is. :: hint: ${NO_VERB}
___ the store open last Sunday? :: Was :: context: Look for the time words: last Sunday. :: reply: No, it wasn't. :: why: Last Sunday is the past. No verb, so BE: was. :: hint: ${NO_VERB}
___ they check email every morning? :: Do :: verb: check :: context: Look for the time words: every morning. :: reply: Yes, they do. :: why: Every morning is the present. The verb is check, so DO. With they, use do. :: hint: Find the verb: check. Is it BE?
___ they check email last night? :: Did :: verb: check :: context: Look for the time words: last night. :: reply: No, they didn't. :: why: Last night is the past. The verb is check, so did. :: hint: Find the verb: check. Is it BE?
___ your kids at school now? :: Are :: context: Look for the time word: now. :: reply: Yes, they are. :: why: Now is the present. No verb, so BE. Your kids = they, so are. :: hint: ${NO_VERB}
___ your kids at school yesterday? :: Were :: context: Look for the time word: yesterday. :: reply: No, they were sick. :: why: Yesterday is the past. No verb, so BE. Your kids = they, so were. :: hint: ${NO_VERB}
What ___ you do every weekend? :: do :: verb: do :: context: Look for the time words: every weekend. :: reply: I play soccer. :: why: Every weekend is the present. The verb is do, so DO helps: do. :: hint: Find the verb after "you": do. Is it BE?
What ___ you do last weekend? :: did :: verb: do :: context: Look for the time words: last weekend. :: reply: I visited my aunt. :: why: Last weekend is the past. The verb is do, so did. :: hint: Find the verb after "you": do. Is it BE?
`;
