"use client";

import Link from "next/link";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { Level1Shell, TopicCard } from "./level1-ui";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";

interface UnitTopicsClientProps {
  unit: PublicLevel1VocabularyUnit;
}

const UNIT_GRADIENT: Record<string, string> = {
  "unit-1": "linear-gradient(135deg, #FFD8A8, #FFB347)",
  "unit-2": "linear-gradient(135deg, #BCE3FF, #74B9FF)",
  "unit-3": "linear-gradient(135deg, #C8E6C9, #81C784)",
  "unit-4": "linear-gradient(135deg, #FFCCBC, #FF8A65)",
  "unit-5": "linear-gradient(135deg, #D1C4E9, #9575CD)",
  "unit-6-7": "linear-gradient(135deg, #FFF59D, #FFD54F)",
  "unit-8": "linear-gradient(135deg, #F8BBD0, #F06292)",
  "unit-9": "linear-gradient(135deg, #B2EBF2, #4DD0E1)",
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

const THEME_TITLE_ES: Record<string, string> = {
  "me-and-my-identity": "Yo y mi identidad",
  "people-and-pronouns": "Personas y pronombres",
  "time-and-numbers": "Tiempo y números",
  "learning-tools": "Útiles escolares",
  "calendar-and-time": "Calendario y tiempo",
  "my-family": "Mi familia",
  "classroom-and-appearance": "Clase y apariencia",
  "civic-life": "Vida cívica",
  "places-and-services": "Lugares y servicios",
  "communication-and-directions": "Comunicación y direcciones",
  "celebrations": "Celebraciones",
  "what-i-wear": "La ropa",
  "products-and-money": "Productos y dinero",
  "holidays": "Los días festivos",
  "renting-and-managing": "Alquiler y gestión",
  "rooms-and-spaces": "Cuartos y espacios",
  "furniture-and-appliances": "Muebles y electrodomésticos",
  "finding-work": "Buscar trabajo",
  "on-the-job": "En el trabajo",
  "my-skills": "Mis habilidades",
  "occupations": "Las ocupaciones",
  "my-body": "Mi cuerpo",
  "feeling-sick": "Cuando me enfermo",
  "getting-care": "Atención médica",
  "food-groups": "Grupos alimenticios",
  "breakfast-and-basics": "Desayuno y básicos",
  "fresh-foods": "Alimentos frescos",
  "cooking-and-eating": "Cocinar y comer",
  "treats-and-storage": "Dulces y almacenamiento",
};

function shortTitle(unit: PublicLevel1VocabularyUnit): string {
  return unit.title.replace(/^Units?\s+[\d\s&,\-and]+:\s*/i, "");
}

function unitNum(unit: PublicLevel1VocabularyUnit): string {
  const m = unit.title.match(/^Units?\s+([\d\s&,\-and]+):/i);
  return m ? m[1].trim() : "";
}

export function UnitTopicsClient({ unit }: UnitTopicsClientProps) {
  const themes = unit.themes ?? [];
  const { hasPlayableUnitMatching } = getUnitMatchingAvailability(unit);
  const title = shortTitle(unit);
  const titleEs = UNIT_TITLE_ES[unit.slug];
  const gradient = UNIT_GRADIENT[unit.slug] ?? "linear-gradient(135deg, #BCE3FF, #74B9FF)";
  const icon = UNIT_ICON[unit.slug] ?? unit.themes?.[0]?.icon ?? "📘";
  const num = unitNum(unit);

  return (
    <Level1Shell backHref="/vocab/level-1" backLabel="Back" eyebrow={title}>
      {/* Unit hero banner */}
      <section className="mb-5 px-0">
        <div
          className="relative flex items-center justify-center rounded-[22px] overflow-hidden"
          style={{ background: gradient, aspectRatio: "2.4" }}
        >
          <span
            className="text-[72px] leading-none"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}
            aria-hidden
          >
            {icon}
          </span>
          {num && (
            <div
              className="absolute bottom-3 left-3 text-[12px] font-black text-white px-3 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.60)", letterSpacing: "0.06em" }}
            >
              UNIT {num}
            </div>
          )}
        </div>
        <p className="mt-3 px-1 text-[15px] text-slate-700 leading-relaxed">{unit.theme}</p>
        {titleEs && (
          <p className="mt-1 px-1 text-[13px] italic font-semibold" style={{ color: "#a64822" }}>
            {titleEs}
          </p>
        )}
      </section>

      {/* Section label */}
      <p className="mb-3 pl-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
        Pick a topic · Elige un tema
      </p>

      {/* Theme rows */}
      <div className="flex flex-col gap-2.5">
        {themes.map((theme, i) => (
          <TopicCard
            key={theme.id}
            title={theme.title}
            titleEs={THEME_TITLE_ES[theme.id]}
            icon={theme.icon}
            wordCount={theme.cards.length}
            href={`/vocab/level-1/${unit.slug}/${theme.id}`}
            sampleWords={theme.cards.slice(0, 3).map((c) => c.term)}
            paletteIndex={i}
          />
        ))}
      </div>

      {/* Matching game CTA */}
      {hasPlayableUnitMatching && (
        <Link
          href={`/vocab/level-1/${unit.slug}/matching`}
          className="mt-4 block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
          aria-label="Play matching game for the whole unit"
        >
          <div
            className="flex items-center gap-3 rounded-[20px] p-4 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: "#f3effc",
              border: "2px dashed #b9a4ee",
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[26px]">
              🧩
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[15px]" style={{ color: "#4d3697" }}>
                Play the matching game
              </p>
              <p className="text-[12px] text-slate-500">
                Match pictures to words · Juego
              </p>
            </div>
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4d3697"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}
    </Level1Shell>
  );
}
