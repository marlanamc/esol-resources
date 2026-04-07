import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevel1PublicVocabUnit,
  LEVEL1_PUBLIC_VOCAB_UNITS,
} from "@/data/public-level1-vocab";
import { UnitMatchingActivityWrapper } from "@/components/public-vocab/UnitMatchingActivityWrapper";

interface Props {
  params: Promise<{
    unitSlug: string;
  }>;
}

export async function generateStaticParams() {
  return LEVEL1_PUBLIC_VOCAB_UNITS.map((unit) => ({
    unitSlug: unit.slug,
  }));
}

export default async function UnitMatchingPage({ params }: Props) {
  const { unitSlug } = await params;
  const unit = await getLevel1PublicVocabUnit(unitSlug);

  if (!unit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-canvas">
      {/* Header / Navigation */}
      <div className="sticky top-0 z-40 w-full border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/vocab/level-1"
              className="group flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-light transition group-hover:bg-gray-200">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              <span>Back to Units</span>
            </Link>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {unit.title}
            </span>
          </div>
        </div>
      </div>

      <main className="py-8">
        <UnitMatchingActivityWrapper unit={unit} />
      </main>
    </div>
  );
}
