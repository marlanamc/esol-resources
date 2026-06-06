// Hand-curated Unsplash images for the Welcome Back: Tenses Review guide.
// Unit 1 — Getting to Know You. Scenes: bus stop, classroom, neighborhood, phone/app.

export interface WelcomeBackSceneImage {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}

export const welcomeBackImages: Record<string, WelcomeBackSceneImage> = {
  sceneBusStop: {
    url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80&auto=format&fit=crop",
    alt: "Yellow and black city bus on a street between buildings.",
    unsplashId: "HOtPD7Z_74s",
    credit: {
      name: "Osman Rana",
      url: "https://unsplash.com/@osmanrana",
    },
  },
  sceneClassroom: {
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80&auto=format&fit=crop",
    alt: "Adult students sitting together in a bright classroom, engaged in learning.",
    unsplashId: "1580582932707-520aed937b7b",
    credit: {
      name: "Alexis Brown",
      url: "https://unsplash.com/@alexisrbrown",
    },
  },
  sceneNeighborhood: {
    url: "https://images.unsplash.com/photo-1565983272040-f48be3cd7914?w=1200&q=80&auto=format&fit=crop",
    alt: "City skyline with high-rise buildings.",
    unsplashId: "wwF1UEuudH8",
    credit: {
      name: "CDMA",
      url: "https://unsplash.com/@barebonesfotoes",
    },
  },
  scenePhone: {
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80&auto=format&fit=crop",
    alt: "A person looking at a learning app on their smartphone.",
    unsplashId: "1512941937669-90a1b58e7e9c",
    credit: {
      name: "Robin Worrall",
      url: "https://unsplash.com/@robin_rednine",
    },
  },
};
