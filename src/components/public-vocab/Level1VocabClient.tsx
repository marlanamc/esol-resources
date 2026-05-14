"use client";

import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { Level1Shell, UnitCard } from "./level1-ui";

interface Level1VocabClientProps {
  units: PublicLevel1VocabularyUnit[];
}

const UNIT_TITLE_ES: Record<string, string> = {
  "unit-1": "Conócete",
  "unit-2": "Vida cotidiana",
  "unit-3": "La comunidad",
  "unit-4": "Compras y dinero",
  "unit-5": "La vivienda",
  "unit-6-7": "El trabajo",
  "unit-8": "La salud",
  "unit-9": "Bienestar",
};

const UNIT_ICON: Record<string, string> = {
  "unit-1": "👋",
  "unit-2": "📅",
  "unit-3": "🤝",
  "unit-4": "🛒",
  "unit-5": "🏠",
  "unit-6-7": "💼",
  "unit-8": "🩺",
  "unit-9": "🌿",
};

function shortTitle(unit: PublicLevel1VocabularyUnit): string {
  return unit.title.replace(/^Units?\s+[\d\s&,\-and]+:\s*/i, "");
}

function unitNum(unit: PublicLevel1VocabularyUnit): string {
  const m = unit.title.match(/^Units?\s+([\d\s&,\-and]+):/i);
  return m ? m[1].trim() : "";
}

export function Level1VocabClient({ units }: Level1VocabClientProps) {
  return (
    <Level1Shell eyebrow="Level 1 Words · Nivel 1" wide>
      {/* Hero */}
      <section className="mb-6">
        <div
          className="flex items-center gap-4 rounded-3xl p-5 border"
          style={{
            background: "linear-gradient(135deg, #FFF1E6 0%, #FFE0CC 60%, #FFD4B5 100%)",
            borderColor: "#FFD0A8",
          }}
        >
          <span
            className="text-[56px] leading-none shrink-0"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}
            aria-hidden
          >
            👋
          </span>
          <div className="min-w-0">
            <h1
              className="font-display text-[26px] font-black leading-none"
              style={{ color: "#a64822" }}
            >
              Hello!
            </h1>
            <p className="mt-1 text-[15px] text-slate-700">
              Pick a unit to practice English words.
            </p>
            <p className="mt-1 text-[13px] font-bold" style={{ color: "#a64822" }}>
              Elige una unidad.
            </p>
          </div>
        </div>
      </section>

      {/* Section label */}
      <p className="mb-3 pl-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
        Units · Unidades
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {units.map((unit, i) => (
          <UnitCard
            key={unit.slug}
            title={shortTitle(unit)}
            titleEs={UNIT_TITLE_ES[unit.slug]}
            icon={UNIT_ICON[unit.slug] ?? unit.themes?.[0]?.icon ?? "📘"}
            wordCount={unit.totalCards}
            unitNum={unitNum(unit)}
            gradientIndex={i}
            href={`/vocab/level-1/${unit.slug}`}
          />
        ))}
      </div>
    </Level1Shell>
  );
}
