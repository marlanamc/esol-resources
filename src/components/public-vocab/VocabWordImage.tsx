"use client";

import Image from "next/image";

type Variant = "square" | "banner" | "tile";

/**
 * Level 1 vocab illustrations (hotlinked URLs in vocab-images.ts; static.photos WebP or legacy hosts).
 * Uses next/image with unoptimized remote URLs so hosts are allowed via next.config `images.remotePatterns`.
 */
export function VocabWordImage({
  src,
  alt,
  variant = "banner",
  className,
}: {
  src: string;
  alt: string;
  variant?: Variant;
  /** Extra classes on the outer positioned wrapper */
  className?: string;
}) {
  if (variant === "tile") {
    return (
      <div
        className={`relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm ${className ?? ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 42vw, (max-width: 768px) 44vw, 180px"
          unoptimized
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (variant === "square") {
    return (
      <div
        className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm ${className ?? ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 128px, 160px"
          unoptimized
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 640px"
        unoptimized
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
