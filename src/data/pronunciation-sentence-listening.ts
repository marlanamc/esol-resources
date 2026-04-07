import type {
  PronunciationSentenceListeningContent,
  PronunciationSentenceListeningQuestion,
} from "@/types/activity";

type SentenceSetKey =
  | "short-i-long-e"
  | "b-v"
  | "r-l"
  | "sh-ch"
  | "s-th"
  | "v-w"
  | "mixed-review";

type SentenceSetConfig = Omit<PronunciationSentenceListeningContent, "type">;
type SentenceChoice = PronunciationSentenceListeningQuestion["choices"][number];

function choice(label: string, cue?: string): SentenceChoice {
  return cue ? { label, cue } : { label };
}

function question(config: {
  id: string;
  audioPrompt: string;
  prompt: string;
  choices: SentenceChoice[];
  correctChoiceIndex: number;
  revealFocus: string;
  coachingTip?: string;
  transcript?: string;
}): PronunciationSentenceListeningQuestion {
  return {
    id: config.id,
    audioPrompt: config.audioPrompt,
    prompt: config.prompt,
    choices: config.choices,
    correctChoiceIndex: config.correctChoiceIndex,
    transcript: config.transcript ?? config.audioPrompt,
    revealFocus: config.revealFocus,
    coachingTip: config.coachingTip,
  };
}

const SHORT_I_LONG_E_CHOICES = [
  choice("Short i", "like sit"),
  choice("Long e", "like seat"),
];
const B_V_CHOICES = [choice("B sound", "like Ben"), choice("V sound", "like Victor")];
const R_L_CHOICES = [choice("R sound", "like red"), choice("L sound", "like light")];
const SH_CH_CHOICES = [choice("SH sound", "like share"), choice("CH sound", "like chair")];
const S_TH_CHOICES = [choice("S sound", "like sun"), choice("TH sound", "like think")];
const V_W_CHOICES = [choice("V sound", "like vest"), choice("W sound", "like west")];

export const PRONUNCIATION_SENTENCE_LISTENING_SETS: Record<SentenceSetKey, SentenceSetConfig> = {
  "short-i-long-e": {
    targetSound: "Short i vs Long e",
    instructions: "Listen to a real sentence. Then choose the key vowel sound you heard.",
    roundSize: 8,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "Short i vs Long e",
      targetDescription: "hear short /i/ versus long /i:/ inside real sentences",
      recommendedOrder: 9,
    },
    soundExplainer: {
      sounds: [
        {
          label: "Short i /ɪ/",
          tip: "Tongue stays relaxed in the middle of your mouth. The sound is short and quick.",
          examples: "sit, ship, bit, fill",
        },
        {
          label: "Long e /iː/",
          tip: "Tongue pushes high and tense. Hold the sound a little longer.",
          examples: "seat, beach, beat, feel",
        },
      ],
      commonMistake:
        "Many learners stretch both sounds the same way. Try the short i quick — don't hold it — then let the long e linger.",
    },
    sentences: [
      question({
        id: "sie-1",
        audioPrompt: "Please leave the sheet on the seat.",
        prompt: "In the word seat, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: long e /i:/ in seat.",
        coachingTip: "Long e stays longer in leave, sheet, and seat.",
      }),
      question({
        id: "sie-2",
        audioPrompt: "The ship is still near the beach.",
        prompt: "In the word ship, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in ship.",
        coachingTip: "Short i in ship is shorter and more relaxed than long e in sheep.",
      }),
      question({
        id: "sie-3",
        audioPrompt: "We need six clean dishes.",
        prompt: "In the word six, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in six.",
        coachingTip: "Stretch the vowel in need and clean, but keep six short.",
      }),
      question({
        id: "sie-4",
        audioPrompt: "I sit in the front seat every day.",
        prompt: "In the word seat, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: long e /i:/ in seat.",
        coachingTip: "This sentence mixes both sounds: short i in sit and long e in seat.",
      }),
      question({
        id: "sie-5",
        audioPrompt: "She keeps the keys in a big zip bag.",
        prompt: "In the word zip, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in zip.",
        coachingTip: "Keeps and keys are long e, but zip stays short and quick.",
      }),
      question({
        id: "sie-6",
        audioPrompt: "My shift starts at three today.",
        prompt: "In the word three, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: long e /i:/ in three.",
        coachingTip: "Three uses a long e sound. Shift stays short.",
      }),
      question({
        id: "sie-7",
        audioPrompt: "Did you fill out the form for HR?",
        prompt: "In the word fill, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in fill.",
        coachingTip: "Fill has a quick short i, unlike feel.",
      }),
      question({
        id: "sie-8",
        audioPrompt: "The team will meet at six.",
        prompt: "In the word six, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in six.",
        coachingTip: "Listen for the quick vowel in the number six.",
      }),
      question({
        id: "sie-9",
        audioPrompt: "Keep the receipt with the bill.",
        prompt: "In the word bill, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in bill.",
        coachingTip: "Keep and receipt are long e, but bill is short i.",
      }),
      question({
        id: "sie-10",
        audioPrompt: "This street is busy near the clinic.",
        prompt: "In the word clinic, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: short i /i/ in clinic.",
        coachingTip: "Clinic uses short i, while street uses long e.",
      }),
    ],
  },
  "b-v": {
    targetSound: "B vs V",
    instructions: "Listen to the sentence. Then choose the key start sound you heard.",
    roundSize: 8,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "B vs V",
      targetDescription: "hear both-lips /b/ versus lip-teeth /v/ inside real sentences",
      recommendedOrder: 10,
    },
    soundExplainer: {
      sounds: [
        {
          label: "B /b/",
          tip: "Press both lips together, then push air out. Your lips pop open.",
          examples: "best, buy, bag, blue",
        },
        {
          label: "V /v/",
          tip: "Rest your top teeth lightly on your bottom lip and make your voice vibrate. No lip pop.",
          examples: "vest, very, van, vote",
        },
      ],
      commonMistake:
        "Spanish has one sound for both B and V, so speakers often say B for V. Try feeling your teeth on your lip for every V word.",
    },
    sentences: [
      question({
        id: "bv-1",
        audioPrompt: "Victor bought a blue vest.",
        prompt: "At the start of Victor, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of Victor.",
        coachingTip: "For /v/, touch your top teeth to your lower lip. /b/ closes both lips.",
      }),
      question({
        id: "bv-2",
        audioPrompt: "Please vote before noon.",
        prompt: "At the start of vote, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of vote.",
        coachingTip: "Vote starts with friction on the lip. Boat begins with both lips together.",
      }),
      question({
        id: "bv-3",
        audioPrompt: "The van is behind the building.",
        prompt: "At the start of van, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of van.",
        coachingTip: "Listen for the soft friction of /v/ before the vowel.",
      }),
      question({
        id: "bv-4",
        audioPrompt: "I saved every receipt.",
        prompt: "In the middle of saved, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ in saved.",
        coachingTip: "Keep air moving across the lip for /v/ in saved and every.",
      }),
      question({
        id: "bv-5",
        audioPrompt: "Ben wears a very warm jacket.",
        prompt: "At the start of Ben, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /b/ at the start of Ben.",
        coachingTip: "This sentence mixes /b/ in Ben with /v/ in very. Notice the lip position change.",
      }),
      question({
        id: "bv-6",
        audioPrompt: "Bring your badge to the lobby.",
        prompt: "At the start of bring, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /b/ at the start of bring.",
        coachingTip: "Hear /b/ at the start of bring and badge with both lips together.",
      }),
      question({
        id: "bv-7",
        audioPrompt: "The bank will verify your balance.",
        prompt: "At the start of verify, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of verify.",
        coachingTip: "Bank starts with /b/; verify uses /v/. Focus on the lip-teeth contact in verify.",
      }),
      question({
        id: "bv-8",
        audioPrompt: "A volunteer helped before the meeting.",
        prompt: "At the start of volunteer, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of volunteer.",
        coachingTip: "Volunteer begins with /v/, not /b/.",
      }),
      question({
        id: "bv-9",
        audioPrompt: "We booked a vacation online.",
        prompt: "At the start of vacation, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of vacation.",
        coachingTip: "Booked uses /b/; vacation uses /v/. Listen for the friction in vacation.",
      }),
      question({
        id: "bv-10",
        audioPrompt: "The boss asked for a backup van.",
        prompt: "At the start of backup, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /b/ at the start of backup.",
        coachingTip: "Boss and backup use /b/. Keep both lips together before the vowel.",
      }),
    ],
  },
  "r-l": {
    targetSound: "R vs L",
    instructions: "Listen to the sentence. Then choose the key sound you heard.",
    roundSize: 8,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "R vs L",
      targetDescription: "hear English /r/ and /l/ inside real sentences",
      recommendedOrder: 11,
    },
    soundExplainer: {
      sounds: [
        {
          label: "R /r/",
          tip: "Curl your tongue back slightly — it should NOT touch the roof of your mouth. Round your lips a little.",
          examples: "red, ride, road, right",
        },
        {
          label: "L /l/",
          tip: "Touch the tip of your tongue to the ridge just behind your top front teeth, then let air flow around the sides.",
          examples: "led, light, load, look",
        },
      ],
      commonMistake:
        "This contrast is very hard for Japanese, Chinese, and Korean speakers whose languages use one sound for both. Practice touching your tongue for L but never touching for R.",
    },
    sentences: [
      question({
        id: "rl-1",
        audioPrompt: "Laura rides the red line home.",
        prompt: "At the start of rides, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /r/ at the start of rides.",
        coachingTip: "English /r/ pulls the tongue back. /l/ touches just behind the teeth.",
      }),
      question({
        id: "rl-2",
        audioPrompt: "Please lock the rear door.",
        prompt: "At the start of lock, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of lock.",
        coachingTip: "This sentence alternates /l/ and /r/. Listen to each position instead of guessing from context.",
      }),
      question({
        id: "rl-3",
        audioPrompt: "Really, Laura likes rice.",
        prompt: "At the start of really, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /r/ at the start of really.",
        coachingTip: "Really and rice begin with /r/. Laura and likes use /l/.",
      }),
      question({
        id: "rl-4",
        audioPrompt: "Turn right at the light.",
        prompt: "At the start of light, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of light.",
        coachingTip: "Right and light are a high-value contrast. Keep the tongue positions clearly different.",
      }),
      question({
        id: "rl-5",
        audioPrompt: "The red folder is on the left shelf.",
        prompt: "At the start of left, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of left.",
        coachingTip: "Red starts with /r/; left starts with /l/. Keep those tongue positions different.",
      }),
      question({
        id: "rl-6",
        audioPrompt: "Please return the rental car by noon.",
        prompt: "At the start of return, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /r/ at the start of return.",
        coachingTip: "Return and rental both start with /r/.",
      }),
      question({
        id: "rl-7",
        audioPrompt: "The library is on River Road.",
        prompt: "At the start of library, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of library.",
        coachingTip: "Library uses /l/; River repeats /r/.",
      }),
      question({
        id: "rl-8",
        audioPrompt: "Rice is cheaper than lice for this lesson.",
        prompt: "At the start of rice, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /r/ at the start of rice.",
        coachingTip: "Rice starts with /r/; lice would start with /l/.",
      }),
      question({
        id: "rl-9",
        audioPrompt: "The last train arrives early.",
        prompt: "At the start of last, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of last.",
        coachingTip: "Last and leaves use /l/; train has /r/.",
      }),
      question({
        id: "rl-10",
        audioPrompt: "Please collect the forms from reception.",
        prompt: "At the start of collect, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ in collect.",
        coachingTip: "Collect uses /l/ sounds. Listen for collect versus correct.",
      }),
    ],
  },
  "sh-ch": {
    targetSound: "Sh vs Ch",
    instructions: "Listen to the sentence. Then choose the key start sound you heard.",
    roundSize: 5,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "Sh vs Ch",
      targetDescription: "hear /sh/ and /ch/ inside short real sentences",
      recommendedOrder: 12,
    },
    soundExplainer: {
      sounds: [
        {
          label: "SH /ʃ/",
          tip: "Push your lips forward slightly and let air flow out smoothly and steadily — like telling someone to be quiet.",
          examples: "share, ship, wash, shoe",
        },
        {
          label: "CH /tʃ/",
          tip: "Start with your tongue touching the roof of your mouth, then release a small burst of air — like a tiny sneeze.",
          examples: "chair, chip, watch, chew",
        },
      ],
      commonMistake:
        "Many learners use SH for both. The difference is the burst: SH flows smoothly, CH pops. Try saying 'shhhh' (smooth) then 'chh!' (burst) back to back.",
    },
    sentences: [
      question({
        id: "shch-1",
        audioPrompt: "We should wash the dishes before lunch.",
        prompt: "At the start of wash, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /sh/ at the start of wash.",
        coachingTip: "Wash is /sh/; watch begins with /ch/.",
      }),
      question({
        id: "shch-2",
        audioPrompt: "The ship leaves after lunch.",
        prompt: "At the start of ship, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /sh/ at the start of ship.",
        coachingTip: "Ship is /sh/; chip is /ch/.",
      }),
      question({
        id: "shch-3",
        audioPrompt: "Share your ideas with the manager.",
        prompt: "At the start of share, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /sh/ at the start of share.",
        coachingTip: "Share starts with /sh/; chair starts with /ch/.",
      }),
      question({
        id: "shch-4",
        audioPrompt: "Please choose the cheaper option.",
        prompt: "At the start of choose, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /ch/ at the start of choose.",
        coachingTip: "Choose uses /ch/, not /sh/.",
      }),
      question({
        id: "shch-5",
        audioPrompt: "The chair is next to the shelf.",
        prompt: "At the start of chair, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /ch/ at the start of chair.",
        coachingTip: "Chair begins with /ch/; shelf begins with /sh/.",
      }),
    ],
  },
  "s-th": {
    targetSound: "S vs Th",
    instructions: "Listen to the sentence. Then choose the key start sound you heard.",
    roundSize: 5,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "S vs Th",
      targetDescription: "hear /s/ and /th/ inside short real sentences",
      recommendedOrder: 13,
    },
    soundExplainer: {
      sounds: [
        {
          label: "S /s/",
          tip: "Keep your tongue near the roof of your mouth but not touching. Air flows through the center — no tongue between teeth.",
          examples: "sun, sink, face, some",
        },
        {
          label: "TH /θ/",
          tip: "Stick the tip of your tongue lightly between your teeth. Push air over the top of your tongue. It feels a little weird at first.",
          examples: "think, thin, faith, thumb",
        },
      ],
      commonMistake:
        "The TH sound doesn't exist in Spanish, Arabic, or many other languages, so learners replace it with S or D. Practice putting your tongue between your teeth — it's the only way.",
    },
    sentences: [
      question({
        id: "sth-1",
        audioPrompt: "I think the clinic opens at nine.",
        prompt: "At the start of think, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the start of think.",
        coachingTip: "Think uses /th/; sink starts with /s/.",
      }),
      question({
        id: "sth-2",
        audioPrompt: "Thank you for calling about the appointment.",
        prompt: "At the start of thank, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the start of thank.",
        coachingTip: "Thank has /th/. Put the tongue lightly between the teeth.",
      }),
      question({
        id: "sth-3",
        audioPrompt: "The path is behind the store.",
        prompt: "At the end of path, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the end of path.",
        coachingTip: "Path uses /th/; pass uses /s/.",
      }),
      question({
        id: "sth-4",
        audioPrompt: "The soup is still too salty.",
        prompt: "At the start of soup, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /s/ at the start of soup.",
        coachingTip: "Soup starts with /s/. Keep the tongue behind the teeth, not between them.",
      }),
      question({
        id: "sth-5",
        audioPrompt: "Math class starts at seven.",
        prompt: "At the end of math, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the end of math.",
        coachingTip: "Math ends with /th/; mass ends with /s/.",
      }),
    ],
  },
  "v-w": {
    targetSound: "V vs W",
    instructions: "Listen to the sentence. Then choose the key start sound you heard.",
    roundSize: 5,
    meta: {
      skillFamily: "sentence-listening",
      practiceMode: "sentence-context",
      targetLabel: "V vs W",
      targetDescription: "hear /v/ and /w/ inside short real sentences",
      recommendedOrder: 14,
    },
    soundExplainer: {
      sounds: [
        {
          label: "V /v/",
          tip: "Rest your top teeth lightly on your bottom lip and make your voice vibrate. You should feel a tingle in your lip.",
          examples: "vest, very, van, vine",
        },
        {
          label: "W /w/",
          tip: "Round your lips like you're about to whistle, then open them as you make the sound. No teeth involved.",
          examples: "west, wary, well, wine",
        },
      ],
      commonMistake:
        "German and some East Asian speakers often use V where English uses W. The key check: for W your teeth never touch your lip.",
    },
    sentences: [
      question({
        id: "vw-1",
        audioPrompt: "The vet opens at eight on weekdays.",
        prompt: "At the start of vet, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /v/ at the start of vet.",
        coachingTip: "Vet starts with /v/; wet starts with /w/.",
      }),
      question({
        id: "vw-2",
        audioPrompt: "They serve wine at the event.",
        prompt: "At the start of wine, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /w/ at the start of wine.",
        coachingTip: "Wine uses /w/; vine uses /v/.",
      }),
      question({
        id: "vw-3",
        audioPrompt: "She wore a veil to the wedding.",
        prompt: "At the start of veil, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /v/ at the start of veil.",
        coachingTip: "Veil begins with /v/; whale begins with /w/.",
      }),
      question({
        id: "vw-4",
        audioPrompt: "The vest is in the west closet.",
        prompt: "At the start of west, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /w/ at the start of west.",
        coachingTip: "Vest uses /v/; west uses /w/.",
      }),
      question({
        id: "vw-5",
        audioPrompt: "We went to the vet on Wednesday.",
        prompt: "At the start of went, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /w/ at the start of went.",
        coachingTip: "Went uses /w/; vent uses /v/.",
      }),
    ],
  },
  "mixed-review": {
    targetSound: "Mixed pronunciation review",
    instructions: "Listen to each sentence, then choose the key sound you heard.",
    roundSize: 12,
    meta: {
      skillFamily: "mixed-review",
      practiceMode: "mixed-review",
      targetLabel: "Mixed pronunciation review",
      targetDescription: "hear mixed contrasts from every track inside real sentences",
      recommendedOrder: 15,
    },
    soundExplainer: {
      sounds: [
        {
          label: "All six contrasts",
          tip: "Short i vs Long e · B vs V · R vs L · SH vs CH · S vs TH · V vs W",
          examples: "sit/seat · best/vest · red/led · share/chair · sun/think · vine/wine",
        },
        {
          label: "Quick reminders",
          tip: "Short i = quick · Long e = held longer · B = lips pop · V = teeth on lip · L = tongue touches · R = tongue free · SH = smooth · CH = burst · TH = tongue between teeth",
          examples: "Practice the ones that feel hardest for you",
        },
      ],
      commonMistake:
        "In this mixed track each sentence uses a different contrast. Stay alert — you can't predict which sound is coming. Focus on the highlighted word each time.",
    },
    sentences: [
      question({
        id: "mix-1",
        audioPrompt: "My shift starts at three today.",
        prompt: "In the word three, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: long e /i:/ in three.",
      }),
      question({
        id: "mix-2",
        audioPrompt: "The bank will verify your balance.",
        prompt: "At the start of verify, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of verify.",
      }),
      question({
        id: "mix-3",
        audioPrompt: "The library is on River Road.",
        prompt: "At the start of library, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of library.",
      }),
      question({
        id: "mix-4",
        audioPrompt: "We should wash the dishes before lunch.",
        prompt: "At the start of wash, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /sh/ at the start of wash.",
      }),
      question({
        id: "mix-5",
        audioPrompt: "Thank you for calling about the appointment.",
        prompt: "At the start of thank, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the start of thank.",
      }),
      question({
        id: "mix-6",
        audioPrompt: "The vet opens at eight on weekdays.",
        prompt: "At the start of vet, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /v/ at the start of vet.",
      }),
      question({
        id: "mix-7",
        audioPrompt: "Please leave the sheet on the seat.",
        prompt: "In the word seat, which vowel sound do you hear?",
        choices: SHORT_I_LONG_E_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: long e /i:/ in seat.",
      }),
      question({
        id: "mix-8",
        audioPrompt: "Turn right at the light.",
        prompt: "At the start of light, which sound do you hear?",
        choices: R_L_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /l/ at the start of light.",
      }),
      question({
        id: "mix-9",
        audioPrompt: "Share your ideas with the manager.",
        prompt: "At the start of share, which sound do you hear?",
        choices: SH_CH_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /sh/ at the start of share.",
      }),
      question({
        id: "mix-10",
        audioPrompt: "I think the clinic opens at nine.",
        prompt: "At the start of think, which sound do you hear?",
        choices: S_TH_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /th/ at the start of think.",
      }),
      question({
        id: "mix-11",
        audioPrompt: "She wore a veil to the wedding.",
        prompt: "At the start of veil, which sound do you hear?",
        choices: V_W_CHOICES,
        correctChoiceIndex: 0,
        revealFocus: "Key sound: /v/ at the start of veil.",
      }),
      question({
        id: "mix-12",
        audioPrompt: "A volunteer helped before the meeting.",
        prompt: "At the start of volunteer, which sound do you hear?",
        choices: B_V_CHOICES,
        correctChoiceIndex: 1,
        revealFocus: "Key sound: /v/ at the start of volunteer.",
      }),
    ],
  },
};

export function getAllPronunciationSentencePrompts() {
  return Object.entries(PRONUNCIATION_SENTENCE_LISTENING_SETS).flatMap(([setKey, set]) =>
    set.sentences.map((sentence) => ({
      setKey,
      id: sentence.id,
      text: sentence.audioPrompt,
    }))
  );
}
