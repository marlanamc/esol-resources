export type VocabLibraryTopic = {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
};

export const VOCAB_LIBRARY_TOPICS: VocabLibraryTopic[] = [
  { slug: "career-job-search", label: "Career: Job Search", shortLabel: "Job Search", description: "Resumes, applications, interviews" },
  { slug: "career-on-the-job", label: "Career: On the Job", shortLabel: "On the Job", description: "Shifts, supervisors, workplace communication" },
  { slug: "health", label: "Health", shortLabel: "Health", description: "Symptoms, care, body, holistic wellness" },
  { slug: "housing", label: "Housing", shortLabel: "Housing", description: "Lease, landlord, repairs, tenant rights" },
  { slug: "money", label: "Money", shortLabel: "Money", description: "Spending, bills, banking, scams" },
  { slug: "civic-life", label: "Civic Life", shortLabel: "Civic Life", description: "Volunteering, voting, meetings, community" },
  { slug: "digital-skills", label: "Digital Skills", shortLabel: "Digital", description: "Logging in, navigating apps, online safety" },
  { slug: "communication", label: "Communication", shortLabel: "Comm.", description: "Phone, email, polite phrases" },
  { slug: "transportation", label: "Transportation", shortLabel: "Transit", description: "Directions, buses, trains, movement" },
  { slug: "soft-skills", label: "Soft Skills", shortLabel: "Soft Skills", description: "Reliability, flexibility, mindfulness" },
];

export const VOCAB_LIBRARY_TOPIC_SLUGS = new Set(VOCAB_LIBRARY_TOPICS.map((t) => t.slug));

export function isVocabLibraryTopicSlug(slug: string): boolean {
  return VOCAB_LIBRARY_TOPIC_SLUGS.has(slug);
}

export function getVocabLibraryTopic(slug: string): VocabLibraryTopic | null {
  return VOCAB_LIBRARY_TOPICS.find((t) => t.slug === slug) ?? null;
}
