// Hand-curated Unsplash images for the Just, Already, Yet guide.
// Unit 2 — Daily Life in the Community. Scenes: community center, pharmacy, apartment hallway, kitchen table, to-do list.

export interface JustAlreadyYetSceneImage {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}

export const justAlreadyYetImages: Record<string, JustAlreadyYetSceneImage> = {
  sceneCommunityCenter: {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
    alt: "Bright community center reception area with a front desk and welcoming entrance.",
    unsplashId: "1497366216548-37526070297c",
    credit: {
      name: "Adolfo Félix",
      url: "https://unsplash.com/@adolfofelix",
    },
  },
  scenePharmacy: {
    url: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=1200&q=80&auto=format&fit=crop",
    alt: "Pharmacy counter with shelves of medicine and a service window.",
    unsplashId: "1563213126-a4273aed2016",
    credit: {
      name: "Myriam Zilles",
      url: "https://unsplash.com/@myriamzilles",
    },
  },
  sceneApartmentHallway: {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
    alt: "Apartment building hallway with doors and natural light from a window at the end.",
    unsplashId: "1558618666-fcd25c85cd64",
    credit: {
      name: "Naomi Hébert",
      url: "https://unsplash.com/@naomish",
    },
  },
  sceneKitchenTable: {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&auto=format&fit=crop",
    alt: "Kitchen table with a phone, papers, and a cup of coffee. A person organizing their week.",
    unsplashId: "1556909114-f6e7ad7d3136",
    credit: {
      name: "Jason Briscoe",
      url: "https://unsplash.com/@jsnbrsc",
    },
  },
  sceneToDoList: {
    url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80&auto=format&fit=crop",
    alt: "Open notebook with a handwritten to-do list and a pen resting on the page.",
    unsplashId: "1484480974693-6ca0a78fb36b",
    credit: {
      name: "Glenn Carstens-Peters",
      url: "https://unsplash.com/@glenncarstenspeters",
    },
  },
};
