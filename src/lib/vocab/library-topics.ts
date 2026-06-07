export type VocabLibraryTopic = {
  slug: string;
  label: string;
  description: string;
};

export const VOCAB_LIBRARY_TOPICS: VocabLibraryTopic[] = [
  { slug: "career-job-search", label: "Career: Job Search", description: "Resumes, applications, interviews" },
  { slug: "career-on-the-job", label: "Career: On the Job", description: "Shifts, supervisors, workplace communication" },
  { slug: "health", label: "Health", description: "Symptoms, care, body, holistic wellness" },
  { slug: "housing", label: "Housing", description: "Lease, landlord, repairs, tenant rights" },
  { slug: "money", label: "Money", description: "Spending, bills, banking, scams" },
  { slug: "civic-life", label: "Civic Life", description: "Volunteering, voting, meetings, community" },
  { slug: "digital-skills", label: "Digital Skills", description: "Logging in, navigating apps, online safety" },
  { slug: "communication", label: "Communication", description: "Phone, email, polite phrases" },
  { slug: "transportation", label: "Transportation", description: "Directions, buses, trains, movement" },
  { slug: "soft-skills", label: "Soft Skills", description: "Reliability, flexibility, mindfulness" },
];

export const VOCAB_LIBRARY_TOPIC_SLUGS = new Set(VOCAB_LIBRARY_TOPICS.map((t) => t.slug));

export function isVocabLibraryTopicSlug(slug: string): boolean {
  return VOCAB_LIBRARY_TOPIC_SLUGS.has(slug);
}

export function getVocabLibraryTopic(slug: string): VocabLibraryTopic | null {
  return VOCAB_LIBRARY_TOPICS.find((t) => t.slug === slug) ?? null;
}
