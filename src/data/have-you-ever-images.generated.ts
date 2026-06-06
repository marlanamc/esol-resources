export const haveYouEverImages: Record<
  string,
  {
    url: string;
    alt: string;
    unsplashId: string;
    credit: { name: string; url: string };
  }
> = {
  scenePhone: {
    url: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=1200&q=80&auto=format&fit=crop",
    alt: "Person reading a text message on a phone at home in the evening.",
    unsplashId: "wK-elt11pF0",
    credit: {
      name: "Jonas Leupe",
      url: "https://unsplash.com/@jonasleupe",
    },
  },
  sceneClassroom: {
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80&auto=format&fit=crop",
    alt: "Two adult learners chatting warmly after an evening class, bags in hand.",
    unsplashId: "1523580494863-6f3031224c94",
    credit: {
      name: "Nathan Dumlao",
      url: "https://unsplash.com/@nate_dumlao",
    },
  },
  sceneCommunityCenter: {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop",
    alt: "Welcoming community center hallway with people gathered near a front desk.",
    unsplashId: "1540575467063-178a50c2df87",
    credit: {
      name: "Headway",
      url: "https://unsplash.com/@headwayio",
    },
  },
  sceneVolunteering: {
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80&auto=format&fit=crop",
    alt: "Volunteers signing in at a table before a community event.",
    unsplashId: "1593113598332-cd288d649433",
    credit: {
      name: "Joel Muniz",
      url: "https://unsplash.com/@jmuniz",
    },
  },
};
