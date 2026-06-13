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
    url: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=1200&q=80&auto=format&fit=crop",
    alt: "A neighborhood pharmacy counter with shelves of medicine and a prescription pickup window.",
    unsplashId: "FOSgYGDktlE",
    credit: { name: "Bernd 📷 Dittrich", url: "https://unsplash.com/@hdbernd" },
  },
  sceneApartmentHallway: {
    url: "https://images.unsplash.com/photo-1664797523026-f6e277258f0c?w=1200&q=80&auto=format&fit=crop",
    alt: "A residential apartment hallway with numbered doors and natural light at the end of the corridor.",
    unsplashId: "mHuljON3bC8",
    credit: { name: "Peter Herrmann", url: "https://unsplash.com/@tama66" },
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
    url: "https://images.unsplash.com/photo-1709422889872-49b1d6aa77b5?w=1200&q=80&auto=format&fit=crop",
    alt: "a kitchen counter with a napkin and a pen on it",
    unsplashId: "_3yOqmFjE8I",
    credit: { name: "Marc Pell", url: "https://unsplash.com/@blinky264" },
  },
};
