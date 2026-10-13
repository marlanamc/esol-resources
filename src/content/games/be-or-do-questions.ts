/**
 * "Be or Do?" — Week 5 question game.
 *
 * Rounds 1-2: pick BE or DO. Round 3: pick the exact word (am / is / are / do / does).
 * The rule the game teaches is "find the verb": if the verb is am / is / are, BE goes
 * first; any other verb (including feel, like, have, need, know) needs DO.
 *
 * Card format (see parseBeOrDoRounds):
 *   ___ question :: Answer :: key: value :: key: value
 * Keys: context, verb (underlined in the answer), reply, why, hint, twin.
 * A twin card follows its same-meaning partner, so cards are played in this order.
 */

export const BE_OR_DO_ACTIVITY_ID = "be-or-do-questions";
export const BE_OR_DO_TITLE = "Be or Do?";
export const BE_OR_DO_DESCRIPTION =
  "Finish each question with BE or DO. Find the verb: am, is, or are goes first; any other verb needs do or does.";

const NO_VERB = "Look after the blank. Is there a verb? If not, the missing verb is BE.";

export const BE_OR_DO_CONTENT = `GAME: be-or-do

[ROUND 1]
NOTE: Find the verb. If the verb is am, is, or are, BE goes first. If there is another verb, DO comes to help.
___ you tired? :: Are :: context: Your classmate is yawning. :: reply: Yes, I am. :: why: There is no verb after "you". The sentence is "You are tired," so BE goes first. :: hint: ${NO_VERB}
___ you feel tired? :: Do :: verb: feel :: twin: Are you tired? :: context: Ask the same thing another way. :: reply: Yes, I do. :: why: The verb is feel. Feel is not BE, so DO comes to help. :: hint: Find the verb: feel. Is feel am, is, or are?
___ you back up your photos? :: Do :: verb: back up :: context: Ask about phone habits. :: reply: Yes, I do. :: why: The verb is back up. It is not BE, so DO helps. :: hint: Find the verb: back up. Is it am, is, or are?
___ your phone charged? :: Is :: context: Before a video call. :: reply: Yes, it is. :: why: There is no verb after "your phone". The sentence is "Your phone is charged," so BE goes first. :: hint: ${NO_VERB}
___ it cold in here? :: Is :: context: At the library. :: reply: Yes, it is. :: why: There is no verb after "it". The sentence is "It is cold," so BE goes first. :: hint: ${NO_VERB}
___ it feel cold in here? :: Does :: verb: feel :: twin: Is it cold in here? :: context: Ask the same thing another way. :: reply: Yes, it does. :: why: The verb is feel. With it, DO becomes does. :: hint: Find the verb: feel. Is feel am, is, or are?
___ she use a password manager? :: Does :: verb: use :: context: Ask about your coworker. :: reply: Yes, she does. :: why: The verb is use. With he, she, or it, DO becomes does. :: hint: Find the verb: use. Is it am, is, or are?
___ you on WhatsApp? :: Are :: context: Your neighbor wants your number. :: reply: Yes, I am. :: why: There is no verb after "you". The sentence is "You are on WhatsApp," so BE goes first. :: hint: ${NO_VERB}
___ you have WhatsApp? :: Do :: verb: have :: twin: Are you on WhatsApp? :: context: Ask the same thing another way. :: reply: Yes, I do. :: why: The verb is have. Have is not BE, so DO helps. :: hint: Find the verb: have. Is have am, is, or are?
___ they check email every day? :: Do :: verb: check :: context: Ask about your classmates. :: reply: Yes, they do. :: why: The verb is check. It is not BE, so DO helps. :: hint: Find the verb: check. Is it am, is, or are?

[ROUND 2]
NOTE: Careful! Some verbs are not actions, but they still need DO: like, want, need, have, know.
___ you hungry? :: Are :: context: Ask your classmate before lunch. :: reply: Yes, I am. :: why: No verb after "you". In English we say "I am hungry," not "I have hunger." :: hint: ${NO_VERB}
___ you like your new phone? :: Do :: verb: like :: context: Your friend got a new phone. :: reply: Yes, I do. :: why: Like is not an action, but it is a verb, and it is not BE. So DO helps. :: hint: Find the verb: like. Is like am, is, or are?
___ you watching a video now? :: Are :: verb: watching :: context: Your friend can't hear you. :: reply: Yes, I am. :: why: Watching has -ing. A verb with -ing always comes with BE: "You are watching." :: hint: Watching has -ing. Verb-ing always goes with am, is, or are.
___ you 30 years old? :: Are :: context: Filling out a form together. :: reply: No, I'm 32. :: why: No verb after "you". In English, age uses BE: "I am 30," not "I have 30 years." :: hint: ${NO_VERB}
___ he need a new charger? :: Does :: verb: need :: context: Your son's phone is always dead. :: reply: Yes, he does. :: why: Need is not an action, but it is a verb, and it is not BE. With he, DO becomes does. :: hint: Find the verb: need. Is need am, is, or are?
___ the Wi-Fi slow today? :: Is :: context: At the library. :: reply: Yes, it is. :: why: No verb after "the Wi-Fi". The sentence is "The Wi-Fi is slow," so BE goes first. :: hint: ${NO_VERB}
___ you know your password? :: Do :: verb: know :: context: The app wants you to log in. :: reply: No, I don't! :: why: Know happens in your head, but it is still a verb, and it is not BE. So DO helps. :: hint: Find the verb: know. Is know am, is, or are?
___ your kids playing games right now? :: Are :: verb: playing :: context: It's late on a school night. :: reply: Yes, they are. :: why: Playing has -ing. A verb with -ing always comes with BE: "They are playing." :: hint: Playing has -ing. Verb-ing always goes with am, is, or are.
___ you a student? :: Are :: context: Meeting someone new. :: reply: Yes, I am. :: why: No verb after "you". The sentence is "You are a student," so BE goes first. :: hint: ${NO_VERB}
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
`;
