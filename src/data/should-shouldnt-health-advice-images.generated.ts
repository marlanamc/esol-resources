export const shouldShouldntHealthAdviceImages: Record<string, {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}> = {
  sceneClinicWaiting: {
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80&auto=format&fit=crop",
    alt: "A bright clinic waiting room with chairs along the wall and a reception desk in the background.",
    unsplashId: "photo-1586773860418-d37222d8fce3",
    credit: { name: "Martha Dominguez de Gouveia", url: "https://unsplash.com/@mdominguezfoto" },
  },
  scenePharmacyCounter: {
    url: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=1200&q=80&auto=format&fit=crop",
    alt: "A pharmacist behind a counter handing a paper bag to a customer.",
    unsplashId: "byGTytEGjBo",
    credit: { name: "National Cancer Institute", url: "https://unsplash.com/@nci" },
  },
};
