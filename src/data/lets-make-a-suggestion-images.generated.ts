export const letsMakeASuggestionImages: Record<string, {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}> = {
  sceneHallway: {
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80&auto=format&fit=crop",
    alt: "Interior hallway of an apartment building with tiled floors and numbered doors.",
    unsplashId: "photo-1568605114967-8130f3a36994",
    credit: { name: "R ARCHITECTURE", url: "https://unsplash.com/@rarchitecture_melbourne" },
  },
  sceneHallwayKevin: {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
    alt: "Exterior of a residential apartment building on a quiet street.",
    unsplashId: "photo-1600585154340-be6161a56a0c",
    credit: { name: "Breno Assis", url: "https://unsplash.com/@brenoassis" },
  },
  sceneRestaurantBreak: {
    url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80&auto=format&fit=crop",
    alt: "Restaurant kitchen with workers preparing food under warm overhead lights.",
    unsplashId: "photo-1466978913421-dad2ebd01d17",
    credit: { name: "Dmitry Dreyer", url: "https://unsplash.com/@dmitrydreyer" },
  },
  sceneContrast: {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
    alt: "Two people looking at a phone together, having a conversation.",
    unsplashId: "photo-1522202176988-66273c2fd55f",
    credit: { name: "Brooke Cagle", url: "https://unsplash.com/@brookecagle" },
  },
};
