// Hand-curated Unsplash images for the Verb Forms: V1 → V3 guide.
// Unit 1 — Getting to Know You. Scenes: evening class, café shift, after-class café, Chromebook quiz.

export const verbFormsOverviewImages: Record<string, {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}> = {
  sceneClassNight: {
    url: "https://images.unsplash.com/photo-1563394867331-e687a36112fd?w=1200&q=80&auto=format&fit=crop",
    alt: "People sitting inside a classroom during an evening lesson.",
    unsplashId: "IsX2ZkbSk1Y",
    credit: { name: "Ilya Sonin", url: "https://unsplash.com/@ilyasonin" },
  },
  sceneWorkShift: {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
    alt: "Busy restaurant dining room with staff serving during an evening shift.",
    unsplashId: "1414235077428-338989a2e8c0",
    credit: { name: "Patrick Tomasso", url: "https://unsplash.com/@impatrickt" },
  },
  sceneEveningHome: {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80&auto=format&fit=crop",
    alt: "Cozy neighborhood café with warm light, tables, and people relaxing after work.",
    unsplashId: "1554118811-1e0d58224f24",
    credit: { name: "Nathan Dumlao", url: "https://unsplash.com/@nate_dumlao" },
  },
  sceneAppQuiz: {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop",
    alt: "A student using a laptop to complete an online lesson at a desk.",
    unsplashId: "1516321318423-f06f85e504b3",
    credit: { name: "Christina @ wocintechchat.com", url: "https://unsplash.com/@wocintechchat" },
  },
};
