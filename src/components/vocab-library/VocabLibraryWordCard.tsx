"use client";

import { useState } from "react";
import Link from "next/link";
import { playLevel1VocabAudio } from "@/lib/level1-vocab-audio";
import { buildVocabLibraryHref, type VocabLibrarySort } from "@/lib/vocab/library";
import type { VocabLibraryTopic } from "@/lib/vocab/library-topics";
import { POS_COLORS } from "@/types/parts-of-speech";

type VocabLibraryWordCardProps = {
  index: number;
  term: string;
  definition: string;
  example: string | null;
  pos: string | null;
  hasAudio: boolean;
  topicLinks: VocabLibraryTopic[];
  sort: VocabLibrarySort;
};

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M18.07 5.93a9 9 0 010 12.73" />
    </svg>
  );
}

export function VocabLibraryWordCard({
  index,
  term,
  definition,
  example,
  pos,
  hasAudio,
  topicLinks,
  sort,
}: VocabLibraryWordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playTermAudio = () => {
    if (!hasAudio) return;

    const audio = playLevel1VocabAudio(term);
    setIsPlaying(true);

    const startPlayback = () => {
      void audio.play().catch(() => setIsPlaying(false));
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      startPlayback();
    } else {
      audio.addEventListener("loadedmetadata", startPlayback, { once: true });
      audio.load();
    }

    audio.addEventListener("ended", () => setIsPlaying(false), { once: true });
    audio.addEventListener("error", () => setIsPlaying(false), { once: true });
  };

  return (
    <li className="group relative overflow-hidden rounded-lg border border-border bg-white p-3 shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:border-border-dark hover:shadow-xl md:rounded-xl md:p-6 md:hover:-translate-y-1">
      <div className="absolute -top-12 -right-12 hidden h-32 w-32 rounded-full bg-blue-100/20 transition-transform duration-500 group-hover:scale-150 md:block" />
      <div className="absolute top-0 right-0 hidden justify-end p-6 md:flex">
        <span className="select-none text-5xl font-black text-gray-100 transition-colors group-hover:text-blue-100">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10">
        <div className="mb-1 flex flex-wrap items-baseline gap-2 md:mb-2 md:gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-text md:text-2xl">{term}</h3>
            {hasAudio ? (
              <button
                type="button"
                onClick={playTermAudio}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-bg-light p-1.5 text-text-muted shadow-sm hover:bg-border hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-95 ${
                  isPlaying ? "ring-2 ring-primary/30" : ""
                }`}
                aria-label={`Play pronunciation for ${term}`}
              >
                <SpeakerIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          {pos ? (
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold italic md:text-xs ${POS_COLORS[pos as keyof typeof POS_COLORS] ?? "border-border bg-bg-light text-text-muted"}`}>
              {pos}
            </span>
          ) : null}
        </div>

        <div className="mb-2 md:mb-6">
          <p className="text-sm leading-snug text-text-muted md:text-base md:leading-relaxed">
            {definition}
          </p>
        </div>

        {example ? (
          <div className="rounded-md border border-accent/20 bg-accent-light/30 p-2 md:rounded-lg md:p-4">
            <p className="text-xs italic text-text-muted md:text-sm">
              <span className="mr-1 font-semibold not-italic text-amber-700">Ex:</span>
              &ldquo;{example}&rdquo;
            </p>
          </div>
        ) : null}

        {topicLinks.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1 md:mt-3">
            {topicLinks.map((topic) => (
              <Link
                key={topic.slug}
                href={buildVocabLibraryHref({ topic: topic.slug, sort })}
                className="rounded-full bg-bg-light px-2 py-0.5 text-[11px] text-text/70 hover:bg-bg hover:brightness-95 md:text-xs"
              >
                <span className="md:hidden">{topic.shortLabel}</span>
                <span className="hidden md:inline">{topic.label}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}
