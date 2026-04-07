import { vocabImagesGenerated } from "@/data/vocab-images-generated";
import { vocabImageOverrides } from "@/data/vocab-images-overrides";

/** Merged map: manual overrides replace auto-generated URLs for the same term. */
export const vocabImages: Record<string, string> = {
  ...vocabImagesGenerated,
  ...vocabImageOverrides,
};
