import { MINIMAL_PAIR_CONTRASTS, type MinimalPairContrastId } from "@/lib/minimal-pairs-data";
import type {
  EdPronunciationContent,
  MinimalPairsContent,
  PronunciationActivityMetadata,
  PronunciationSentenceListeningContent,
} from "@/types/activity";

type PronunciationContent =
  | EdPronunciationContent
  | MinimalPairsContent
  | PronunciationSentenceListeningContent
  | Record<string, unknown>;

export type PronunciationVisualMotif =
  | "minimal-pairs"
  | "ed-sounds"
  | "sentence-listening"
  | "mixed-review"
  | "pronunciation-wave";

export interface PronunciationActivityDescriptor {
  friendlyTitle: string;
  useThisFor: string;
  motif: PronunciationVisualMotif;
  color: string;
  recommendedOrder: number | null;
  pathChip: string | null;
  targetLabel: string | null;
  practiceMode: PronunciationActivityMetadata["practiceMode"] | null;
}

type PronunciationActivityLike = {
  id?: string | null;
  title?: string | null;
  ui?: string | null;
  content?: string | null;
};

const CONTRAST_BY_ID = new Map<MinimalPairContrastId, (typeof MINIMAL_PAIR_CONTRASTS)[number]>(
  MINIMAL_PAIR_CONTRASTS.map((contrast) => [contrast.id, contrast])
);
const LEGACY_MINIMAL_PAIRS_TITLE = "Minimal Pairs Listening Lab";
const LEGACY_ED_TITLE = "-ed Sounds Game";
const SENTENCE_LAB_TITLE = "Sentence Listening Lab";
const LAB_TITLE_ORDER = new Map<string, number>([
  [LEGACY_MINIMAL_PAIRS_TITLE, 0],
  [LEGACY_ED_TITLE, 1],
  [SENTENCE_LAB_TITLE, 2],
]);

function safeParseContent(content?: string | null): PronunciationContent | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as PronunciationContent;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function pathChipFromOrder(order?: number | null, skillFamily?: string) {
  if (skillFamily === "mixed-review") return "Challenge";
  if (!order || order < 1) return null;
  if (order === 1) return "Start Here";
  return `Path ${order}`;
}

function buildFallbackDescriptor(activity: PronunciationActivityLike): PronunciationActivityDescriptor {
  const haystack = `${activity.id ?? ""} ${activity.title ?? ""} ${activity.ui ?? ""}`.toLowerCase();

  if (haystack.includes("minimal-pairs") || haystack.includes("minimal pairs")) {
    return {
      friendlyTitle: "Minimal pairs listening",
      useThisFor: "hear the difference between similar English sounds",
      motif: "minimal-pairs",
      color: "#4f46e5",
      recommendedOrder: null,
      pathChip: null,
      targetLabel: null,
      practiceMode: "listening",
    };
  }

  if (haystack.includes("ed-pronunciation") || haystack.includes("ed sounds") || haystack.includes("-ed")) {
    return {
      friendlyTitle: "Past -ed endings",
      useThisFor: "practice the /t/, /d/, and /id/ sound patterns clearly",
      motif: "ed-sounds",
      color: "#ec4899",
      recommendedOrder: null,
      pathChip: null,
      targetLabel: null,
      practiceMode: "listening",
    };
  }

  return {
    friendlyTitle: "Pronunciation practice",
    useThisFor: "listen closely and produce clearer English sounds",
    motif: "pronunciation-wave",
    color: "#f472b6",
    recommendedOrder: null,
    pathChip: null,
    targetLabel: null,
    practiceMode: null,
  };
}

export function getPronunciationMetadata(activity: PronunciationActivityLike): PronunciationActivityMetadata | null {
  const parsed = safeParseContent(activity.content);
  if (!parsed || typeof parsed !== "object") return null;

  if (
    parsed.type === "minimal-pairs" ||
    parsed.type === "ed-pronunciation" ||
    parsed.type === "pronunciation-listening"
  ) {
    const meta = "meta" in parsed ? parsed.meta : null;
    if (meta && typeof meta === "object") {
      return meta as PronunciationActivityMetadata;
    }
  }

  return null;
}

export function getPronunciationActivityDescriptor(activity: PronunciationActivityLike): PronunciationActivityDescriptor {
  const parsed = safeParseContent(activity.content);
  const fallback = buildFallbackDescriptor(activity);
  const title = activity.title ?? "";

  if (!parsed || typeof parsed !== "object" || !("type" in parsed)) {
    return fallback;
  }

  if (parsed.type === "minimal-pairs") {
    if (title === LEGACY_MINIMAL_PAIRS_TITLE) {
      return {
        friendlyTitle: "Minimal pairs listening",
        useThisFor: "hear the difference between similar English sounds",
        motif: "minimal-pairs",
        color: "#4f46e5",
        recommendedOrder: null,
        pathChip: null,
        targetLabel: null,
        practiceMode: "listening",
      };
    }
    const minimalPairsContent = parsed as MinimalPairsContent;
    const meta = getPronunciationMetadata(activity);
    const contrastId = minimalPairsContent.contrastId ?? "mixed";
    const contrast = contrastId !== "mixed" ? CONTRAST_BY_ID.get(contrastId) ?? null : null;
    const targetLabel = meta?.targetLabel ?? contrast?.label ?? "Mixed minimal pairs";
    return {
      friendlyTitle: `${targetLabel} listening`,
      useThisFor:
        meta?.targetDescription ??
        (contrast
          ? contrast.description
          : "review several high-impact sound contrasts before moving into sentence work"),
      motif: contrastId === "mixed" ? "mixed-review" : "minimal-pairs",
      color: contrastId === "mixed" ? "#7c3aed" : "#4f46e5",
      recommendedOrder: meta?.recommendedOrder ?? null,
      pathChip: pathChipFromOrder(meta?.recommendedOrder, meta?.skillFamily),
      targetLabel,
      practiceMode: meta?.practiceMode ?? "listening",
    };
  }

  if (parsed.type === "ed-pronunciation") {
    if (title === LEGACY_ED_TITLE) {
      return {
        friendlyTitle: "Past -ed endings",
        useThisFor: "practice the /t/, /d/, and /id/ sound patterns clearly",
        motif: "ed-sounds",
        color: "#ec4899",
        recommendedOrder: null,
        pathChip: null,
        targetLabel: null,
        practiceMode: "listening",
      };
    }
    const meta = getPronunciationMetadata(activity);
    const targetLabel = meta?.targetLabel ?? "Past -ed endings";
    return {
      friendlyTitle: targetLabel,
      useThisFor:
        meta?.targetDescription ??
        "practice the /t/, /d/, and /id/ sound patterns clearly in common verbs",
      motif: "ed-sounds",
      color: "#ec4899",
      recommendedOrder: meta?.recommendedOrder ?? null,
      pathChip: pathChipFromOrder(meta?.recommendedOrder, meta?.skillFamily),
      targetLabel,
      practiceMode: meta?.practiceMode ?? "listening",
    };
  }

  if (parsed.type === "pronunciation-listening") {
    const sentenceListeningContent = parsed as PronunciationSentenceListeningContent;
    const isSentenceLabHub =
      title === SENTENCE_LAB_TITLE ||
      (Array.isArray(sentenceListeningContent.setKeys) && sentenceListeningContent.setKeys.length > 0);
    if (isSentenceLabHub) {
      return {
        friendlyTitle: "Sentence listening lab",
        useThisFor: "listen to short sentences and identify the key sound you hear",
        motif: "sentence-listening",
        color: "#0ea5a4",
        recommendedOrder: null,
        pathChip: null,
        targetLabel: null,
        practiceMode: "sentence-context",
      };
    }
    const meta = getPronunciationMetadata(activity);
    const targetSound = sentenceListeningContent.targetSound;
    const isMixed = meta?.skillFamily === "mixed-review" || targetSound.toLowerCase().includes("mixed");
    const targetLabel = meta?.targetLabel ?? targetSound;
      return {
      friendlyTitle: isMixed ? "Mixed pronunciation review" : `${targetLabel} in sentences`,
      useThisFor:
        meta?.targetDescription ??
        "hear the target sound inside short real sentences and choose the key sound you heard",
      motif: isMixed ? "mixed-review" : "sentence-listening",
      color: isMixed ? "#7c3aed" : "#0ea5a4",
      recommendedOrder: meta?.recommendedOrder ?? null,
      pathChip: pathChipFromOrder(meta?.recommendedOrder, meta?.skillFamily),
      targetLabel,
      practiceMode: meta?.practiceMode ?? (isMixed ? "mixed-review" : "sentence-context"),
    };
  }

  return fallback;
}

export function comparePronunciationActivities<T extends PronunciationActivityLike>(left: T, right: T) {
  const leftLabOrder = LAB_TITLE_ORDER.get(left.title ?? "") ?? Number.MAX_SAFE_INTEGER;
  const rightLabOrder = LAB_TITLE_ORDER.get(right.title ?? "") ?? Number.MAX_SAFE_INTEGER;
  if (leftLabOrder !== rightLabOrder) return leftLabOrder - rightLabOrder;

  const leftDescriptor = getPronunciationActivityDescriptor(left);
  const rightDescriptor = getPronunciationActivityDescriptor(right);
  const leftOrder = leftDescriptor.recommendedOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightDescriptor.recommendedOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return (left.title ?? "").localeCompare(right.title ?? "");
}
