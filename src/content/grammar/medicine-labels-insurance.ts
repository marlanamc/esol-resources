import type { InteractiveGuideContent } from "@/types/activity";
import { medicineLabelsImages as img } from "@/data/medicine-labels-images.generated";

// ---------------------------------------------------------------------------
// Reusable inline HTML helpers
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" | "green" | "red" | "purple" = "terracotta"
): string => {
  const scene = img[sceneId];
  if (!scene) return "";
  const credit = scene.credit.url
    ? `<a href="${scene.credit.url}" rel="noopener" target="_blank">${scene.credit.name}</a>`
    : scene.credit.name;
  const sourceLabel = scene.sourceLabel ?? "Unsplash";
  const maxHeight = scene.maxHeight ?? "260px";
  const objectFit = scene.objectFit ?? "cover";
  return `
    <div class="gc-bg-white" style="margin: 0 0 1.5rem 0; padding: 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 10px rgba(0,0,0,0.06)">
      <img src="${scene.url}" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: ${maxHeight}; object-fit: ${objectFit}" />
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
        <span style="font-size: 0.68rem; opacity: 0.7">Photo: ${credit} / ${sourceLabel}</span>
      </div>
    </div>
  `;
};

type Turn = { speaker: string; avatar: string; text: string; side: "left" | "right"; tone: "terracotta" | "sage" | "blue" | "amber" | "purple" | "green" };

const dialogue = (turns: Turn[]): string => {
  const bubbles = turns
    .map((t) => {
      const bgClass = `gc-bg-${t.tone}-alpha`;
      const radius =
        t.side === "left"
          ? "0.875rem 0.875rem 0.875rem 0.25rem"
          : "0.875rem 0.875rem 0.25rem 0.875rem";
      const rowStyle =
        t.side === "left"
          ? "display: flex; gap: 0.625rem; align-items: flex-start"
          : "display: flex; gap: 0.625rem; align-items: flex-start; flex-direction: row-reverse";
      return `
        <div style="${rowStyle}">
          <div style="font-size: 1.65rem; line-height: 1; flex-shrink: 0; padding-top: 0.25rem">${t.avatar}</div>
          <div class="${bgClass}" style="padding: 0.65rem 0.9rem; border-radius: ${radius}; max-width: 82%">
            <div class="gc-text-${t.tone}" style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 0.15rem">${t.speaker}</div>
            <div style="line-height: 1.5">${t.text}</div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="display: flex; flex-direction: column; gap: 0.625rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06)">
      ${bubbles}
    </div>
  `;
};

const fakeMedicineLabel = (opts: {
  drugName: string;
  genericName: string;
  activeIngredient: string;
  purpose: string;
  directions: string[];
  warnings: string[];
  otherInfo: string[];
  expDate: string;
  lotNumber: string;
}): string => `
  <div style="font-family: 'Courier New', Courier, monospace; border: 2px solid #1a202c; border-radius: 0.5rem; overflow: hidden; margin: 1.25rem 0; max-width: 520px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1)">
    <div style="background: #1a202c; color: #ffffff; padding: 0.5rem 0.875rem; display: flex; justify-content: space-between; align-items: center">
      <span style="font-size: 1.05rem; font-weight: 700; letter-spacing: 0.04em">${opts.drugName}</span>
      <span style="font-size: 0.72rem; opacity: 0.8">Drug Facts</span>
    </div>
    <div style="padding: 0.75rem 0.875rem; border-bottom: 2px solid #1a202c">
      <div class="gc-text-dark" style="font-size: 0.75rem">Generic name: <strong>${opts.genericName}</strong></div>
      <div class="gc-text-dark" style="font-size: 0.75rem; margin-top: 0.2rem">Active Ingredient: <strong>${opts.activeIngredient}</strong> &nbsp;·&nbsp; Purpose: <strong>${opts.purpose}</strong></div>
    </div>
    <div style="padding: 0.6rem 0.875rem; border-bottom: 1px solid #ccc">
      <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem">Directions</div>
      ${opts.directions.map((d) => `<div style="font-size: 0.78rem; line-height: 1.55; padding-left: 0.75rem">• ${d}</div>`).join("")}
    </div>
    <div style="padding: 0.6rem 0.875rem; border-bottom: 1px solid #ccc; background: #fff8f8">
      <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin-bottom: 0.35rem">⚠ Warnings</div>
      ${opts.warnings.map((w) => `<div style="font-size: 0.78rem; line-height: 1.55; padding-left: 0.75rem; color: #c0392b">• ${w}</div>`).join("")}
    </div>
    <div style="padding: 0.6rem 0.875rem; border-bottom: 1px solid #ccc">
      <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem">Other Information</div>
      ${opts.otherInfo.map((o) => `<div style="font-size: 0.78rem; line-height: 1.55; padding-left: 0.75rem">• ${o}</div>`).join("")}
    </div>
    <div class="gc-bg-slate gc-text-dark" style="padding: 0.45rem 0.875rem; display: flex; gap: 1.5rem; font-size: 0.72rem">
      <span>EXP: <strong>${opts.expDate}</strong></span>
      <span>LOT: <strong>${opts.lotNumber}</strong></span>
    </div>
  </div>
`;

const fakeInsuranceCard = (opts: {
  planName: string;
  memberName: string;
  memberId: string;
  groupNumber: string;
  pcpName: string;
  copayOffice: string;
  copaySpecialist: string;
  copayER: string;
  rxBin: string;
  rxPcn: string;
  customerService: string;
  claimsAddress: string;
}): string => `
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.25rem 0; max-width: 640px">
    <div style="border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.12); box-shadow: 0 2px 8px rgba(0,0,0,0.08); background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%); color: #ffffff; padding: 1rem; font-family: 'DM Sans', sans-serif">
      <div style="font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.75; margin-bottom: 0.1rem">Health Insurance</div>
      <div style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem">${opts.planName}</div>
      <div style="font-size: 0.68rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em">Member</div>
      <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem">${opts.memberName}</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.72rem">
        <div><div style="opacity:0.75; font-size:0.62rem; text-transform:uppercase">Member ID</div><div style="font-weight:600">${opts.memberId}</div></div>
        <div><div style="opacity:0.75; font-size:0.62rem; text-transform:uppercase">Group #</div><div style="font-weight:600">${opts.groupNumber}</div></div>
        <div><div style="opacity:0.75; font-size:0.62rem; text-transform:uppercase">PCP</div><div style="font-weight:600">${opts.pcpName}</div></div>
        <div><div style="opacity:0.75; font-size:0.62rem; text-transform:uppercase">RxBIN</div><div style="font-weight:600">${opts.rxBin}</div></div>
      </div>
      <div style="margin-top: 0.6rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.68rem">
        <div style="opacity:0.75; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.2rem">Copay</div>
        <div>Office: <strong style="color:#ffd166">${opts.copayOffice}</strong> &nbsp;·&nbsp; Specialist: <strong style="color:#ffd166">${opts.copaySpecialist}</strong> &nbsp;·&nbsp; ER: <strong style="color:#ffd166">${opts.copayER}</strong></div>
      </div>
      <div style="margin-top:0.4rem; text-align:right; font-size:0.6rem; opacity:0.6; font-style:italic">FRONT</div>
    </div>
    <div class="gc-bg-slate gc-text-dark" style="border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.12); box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.72rem">
      <div style="font-weight: 700; font-size: 0.78rem; margin-bottom: 0.6rem; color: #1e3a5f">📞 Customer Service</div>
      <div style="margin-bottom: 0.5rem">${opts.customerService}</div>
      <div style="font-weight: 700; font-size: 0.78rem; margin-bottom: 0.3rem; color: #1e3a5f">📬 Claims Address</div>
      <div style="margin-bottom: 0.6rem; line-height: 1.4">${opts.claimsAddress}</div>
      <div style="font-weight: 700; font-size: 0.78rem; margin-bottom: 0.3rem; color: #1e3a5f">💊 Pharmacy (Rx)</div>
      <div>BIN: <strong>${opts.rxBin}</strong> &nbsp;·&nbsp; PCN: <strong>${opts.rxPcn}</strong></div>
      <div class="gc-text-muted" style="margin-top:0.5rem; padding-top:0.4rem; border-top:1px solid #e2e8f0; font-size:0.64rem; line-height:1.4">
        Present this card at every visit. For questions about benefits, call the Customer Service number on this card.
      </div>
      <div class="gc-text-muted" style="margin-top:0.4rem; text-align:right; font-size:0.6rem; font-style:italic">BACK</div>
    </div>
  </div>
`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const medicineLabelsInsuranceContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =================================================================
    // 1. INTRO — At the Pharmacy
    // =================================================================
    {
      id: "intro-pharmacy",
      stepNumber: 1,
      title: "You're at the pharmacy",
      icon: "🛒",
      explanation: `
        ${sceneCard("pillBottleClose", "Your child's medicine — but what does it say?", "terracotta")}

        <div class="gc-grad-terracotta" style="padding: 1.25rem 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem">
          <p style="font-size: 1.05rem; margin: 0 0 0.5rem 0"><strong>The pharmacist hands you a small orange bottle.</strong></p>
          <p style="font-size: 1rem; margin: 0; line-height: 1.6"><em>"Take 2 tablets every 4–6 hours. Do not exceed 5 doses in 24 hours. Do not use if your child is under 6 years old. May cause drowsiness. Keep out of reach of children."</em></p>
          <p style="margin: 0.75rem 0 0; font-weight: 600">That is a lot of English. But every word matters. This guide will help you read and understand it all.</p>
        </div>

        <h3>What you will learn in this guide</h3>
        <ol style="margin: 0.5rem 0 1.25rem 1rem; line-height: 1.9">
          <li>🏷️ <strong>Anatomy of the label</strong> — every section, every field</li>
          <li>🗣️ <strong>Imperatives on labels</strong> — why medicine uses commands</li>
          <li>⚠️ <strong>Warnings and modals</strong> — must not, may, should</li>
          <li>🔢 <strong>Dosage language</strong> — numbers, time, conditions</li>
          <li>💬 <strong>Talking to the pharmacist</strong> — asking questions confidently</li>
          <li>🎭 <strong>Label role-play</strong> — full practice with a real-style label</li>
          <li>🏪 <strong>OTC vs. Prescription</strong> — do you need a doctor's note?</li>
          <li>💳 <strong>Your insurance card</strong> — what every field means</li>
          <li>🏥 <strong>Types of insurance in the USA</strong> — Medicaid, Medicare, ACA and more</li>
          <li>🔑 <strong>Key insurance terms</strong> — copay, deductible, in-network</li>
          <li>📋 <strong>Using your insurance</strong> — at the pharmacy and doctor's office</li>
          <li>🧭 <strong>Healthcare rights in Massachusetts</strong> — uninsured care, immigration questions, and work injuries</li>
          <li>💵 <strong>Prescription savings cards</strong> — GoodRx, coupon prices, generics, and privacy</li>
        </ol>

        <div style="display: grid; gap: 0.875rem; margin: 1.25rem 0">
          <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-terracotta" style="margin: 0 0 0.25rem 0">🗯️ Imperatives — commands</h4>
            <p style="margin: 0">"<strong>Take</strong> 2 tablets." &nbsp;·&nbsp; "<strong>Do not</strong> exceed 5 doses." &nbsp;·&nbsp; "<strong>Keep</strong> out of reach of children."</p>
          </div>
          <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-sage" style="margin: 0 0 0.25rem 0">💬 Declaratives — statements</h4>
            <p style="margin: 0">"The dose <strong>is</strong> 2 tablets." &nbsp;·&nbsp; "You <strong>should not</strong> give this to children under 6."</p>
          </div>
          <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.875rem 1rem; border-radius: 0.5rem">
            <h4 class="gc-text-blue" style="margin: 0 0 0.25rem 0">🔑 Modals — meaning-changers</h4>
            <p style="margin: 0"><strong>may</strong> (possible side effect) · <strong>must not / do not</strong> (danger) · <strong>should</strong> (advice) · <strong>can</strong> (permission)</p>
          </div>
        </div>
      `,
      tipBox: {
        title: "💡 Why this matters",
        content: "The CDC reports that adverse drug events cause more than 1.5 million emergency department visits each year in the United States. Reading labels carefully is one way to reduce risk at home.",
      },
      exercises: [
        {
          id: "intro-sentence-type",
          title: "Quick Check: What Kind of Sentence?",
          instructions: "Look at each label phrase. What type of sentence is it?",
          items: [
            {
              type: "radio",
              label: "\"<strong>Take</strong> 2 tablets every 4–6 hours.\"",
              options: [
                { value: "imperative", label: "Imperative — a command (no subject)" },
                { value: "declarative", label: "Declarative — a statement (has a subject)" },
              ],
              expectedAnswer: "imperative",
            },
            {
              type: "radio",
              label: "\"<strong>May cause</strong> drowsiness.\"",
              options: [
                { value: "imperative", label: "Imperative — a command" },
                { value: "declarative", label: "Declarative — a statement with a modal" },
              ],
              expectedAnswer: "declarative",
            },
            {
              type: "radio",
              label: "\"<strong>Do not use</strong> if child is under 6 years.\"",
              options: [
                { value: "imperative", label: "Imperative — a command (negative)" },
                { value: "declarative", label: "Declarative — a statement" },
              ],
              expectedAnswer: "imperative",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 2. ANATOMY OF THE LABEL
    // =================================================================
    {
      id: "label-anatomy",
      stepNumber: 2,
      title: "Anatomy of the label",
      icon: "🏷️",
      explanation: `
        ${sceneCard("parentChild", "Reading every section carefully at home", "sage")}

        <p>A medicine label in the USA is organized into <strong>standard sections</strong>. The government requires these sections to appear in a specific order — so once you know the pattern, you can read <em>any</em> label.</p>

        <h3>The faux label below uses the standard Drug Facts format</h3>
        <p class="gc-text-muted" style="font-size: 0.88rem; margin-top: -0.5rem">Study each section. The exercises will test you on it.</p>

        ${fakeMedicineLabel({
          drugName: "Children's Ibuprofen",
          genericName: "Ibuprofen",
          activeIngredient: "Ibuprofen 100 mg per 5 mL",
          purpose: "Pain reliever / Fever reducer",
          directions: [
            "Adults and children 12 years and over: take 400 mg (20 mL) every 4 to 6 hours while symptoms persist.",
            "Children 6–11 years: take 200 mg (10 mL) every 6 to 8 hours. Do not exceed 3 doses in 24 hours.",
            "Children under 6 years: ask a doctor.",
            "Do not use more than directed.",
          ],
          warnings: [
            "Do not use if child has had an allergic reaction to ibuprofen or any other pain reliever/fever reducer.",
            "Ask a doctor before use if the child has stomach bleeding problems.",
            "Stop use and ask a doctor if symptoms do not improve in 10 days.",
            "May cause stomach upset. Take with food or milk.",
            "Keep out of reach of children.",
          ],
          otherInfo: [
            "Store at room temperature (59°–77°F).",
            "See bottom panel for lot number and expiration date.",
          ],
          expDate: "08/2026",
          lotNumber: "BX-4471-C",
        })}

        <h3>Label section map</h3>
        <div style="display: grid; gap: 0.6rem; margin: 1rem 0">
          ${[
            ["Drug Name", "The name on the front of the bottle. Example: Children's Ibuprofen.", "terracotta"],
            ["Generic Name", "The scientific/chemical name. Ibuprofen is the generic name. Generic medicines often cost less than brand-name medicines.", "sage"],
            ["Active Ingredient", "The chemical that actually treats your symptom. Every medicine has at least one.", "blue"],
            ["Purpose", "What the medicine does: pain reliever, fever reducer, antihistamine, etc.", "green"],
            ["Directions", "How much to take, how often, and for which age. ALWAYS read this section first.", "terracotta"],
            ["Warnings", "What can go wrong. Conditions to watch for. When to stop and call a doctor.", "red"],
            ["Other Information", "Storage instructions, allergen info, and lot number.", "amber"],
            ["EXP (Expiration)", "The date the medicine may no longer be safe or effective. Do not use after this date.", "purple"],
          ]
            .map(
              ([label, desc, color]) => `
            <div class="gc-bg-${color}-alpha" style="padding: 0.65rem 0.9rem; border-radius: 0.45rem; display: flex; gap: 0.75rem; align-items: flex-start">
              <div class="gc-text-${color}" style="font-weight: 700; min-width: 130px; font-size: 0.82rem">${label}</div>
              <div style="font-size: 0.82rem; line-height: 1.5">${desc}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Quick note: supplements are different</h3>
        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1.25rem 0">
          <p style="margin: 0 0 0.55rem 0"><strong>Vitamins, herbs, powders, gummies, and "wellness" products usually have a Supplement Facts label — not a Drug Facts label.</strong></p>
          <p style="margin: 0 0 0.55rem 0">A supplement can still affect your body. It can interact with medicine, cause side effects, or be unsafe before surgery or during pregnancy.</p>
          <p style="margin: 0 0 0.55rem 0"><strong>TikTok tip:</strong> popular does not mean safe. "Natural" does not always mean safe. Be careful with products that promise to cure, detox, melt fat, balance hormones, or fix a health problem fast.</p>
          <p style="margin: 0"><strong>Useful pharmacist question:</strong> "Can I take this supplement with my medicine?"</p>
        </div>
      `,
      tipBox: {
        title: "💡 Read the Directions section first",
        content: "New readers often skip straight to the drug name. But the Directions section tells you the most important information: the right dose for the right person at the right time.",
      },
      exercises: [
        {
          id: "anatomy-match",
          title: "Label Section Match",
          instructions: "Which section of the label would you find this information in?",
          items: [
            {
              type: "radio",
              label: "\"Children 6–11 years: take 200 mg every 6 to 8 hours.\"",
              options: [
                { value: "directions", label: "Directions" },
                { value: "warnings", label: "Warnings" },
                { value: "other", label: "Other Information" },
              ],
              expectedAnswer: "directions",
            },
            {
              type: "radio",
              label: "\"Do not use if child has had an allergic reaction to ibuprofen.\"",
              options: [
                { value: "directions", label: "Directions" },
                { value: "warnings", label: "Warnings" },
                { value: "ingredient", label: "Active Ingredient" },
              ],
              expectedAnswer: "warnings",
            },
            {
              type: "radio",
              label: "\"Ibuprofen 100 mg per 5 mL\"",
              options: [
                { value: "name", label: "Drug Name" },
                { value: "active", label: "Active Ingredient" },
                { value: "directions", label: "Directions" },
              ],
              expectedAnswer: "active",
            },
            {
              type: "radio",
              label: "\"Store at room temperature (59°–77°F).\"",
              options: [
                { value: "warnings", label: "Warnings" },
                { value: "other", label: "Other Information" },
                { value: "directions", label: "Directions" },
              ],
              expectedAnswer: "other",
            },
          ],
        },
        {
          id: "anatomy-expiration",
          title: "Expiration Date Reading",
          instructions: "Look at the faux label above. Answer these questions.",
          items: [
            {
              type: "radio",
              label: "The expiration date on the label above is:",
              options: [
                { value: "aug2026", label: "August 2026" },
                { value: "aug2024", label: "August 2024" },
                { value: "nov2026", label: "November 2026" },
              ],
              expectedAnswer: "aug2026",
            },
            {
              type: "radio",
              label: "It is March 2027. Is this medicine still safe to use?",
              options: [
                { value: "yes", label: "Yes — expiration dates are just suggestions" },
                { value: "no", label: "No — the medicine expired in August 2026" },
                { value: "maybe", label: "Maybe — only if it smells fine" },
              ],
              expectedAnswer: "no",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 3. IMPERATIVES ON LABELS
    // =================================================================
    {
      id: "imperatives-labels",
      stepNumber: 3,
      title: "Imperatives on labels",
      icon: "🗣️",
      explanation: `
        <p>Look at a medicine label and you will see the same grammar pattern over and over: <strong>a verb at the start, no subject (no "you").</strong> That pattern is called an <strong>imperative</strong>.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1.25rem 0">
          <h4 class="gc-text-terracotta" style="margin: 0 0 0.5rem 0">The Imperative Formula</h4>
          <p style="margin: 0; font-size: 1rem"><strong>[base verb]</strong> + rest of sentence &nbsp;→&nbsp; <em>"Take 2 tablets."</em></p>
          <p style="margin: 0.4rem 0 0; font-size: 1rem"><strong>Do not + [base verb]</strong> + rest &nbsp;→&nbsp; <em>"Do not exceed 5 doses."</em></p>
        </div>

        <h3>Why do medicine labels use imperatives?</h3>
        <p>Imperatives are <strong>short, direct, and impossible to misunderstand.</strong> There is no extra grammar to slow you down. The label needs to give instructions fast — so it uses commands.</p>

        <div style="display: grid; gap: 0.5rem; margin: 1.25rem 0">
          ${[
            ["Take 2 tablets every 4–6 hours.", "Take (base verb) — positive imperative"],
            ["Do not exceed 5 doses in 24 hours.", "Do not + exceed — negative imperative"],
            ["Keep out of reach of children.", "Keep (base verb) — safety imperative"],
            ["Store at room temperature.", "Store (base verb) — storage imperative"],
            ["Ask a doctor before use.", "Ask (base verb) — advice imperative"],
            ["Stop use if symptoms worsen.", "Stop (base verb) — warning imperative"],
          ]
            .map(
              ([sentence, annotation]) => `
            <div class="gc-bg-slate" style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.6rem 0.875rem; border-radius: 0.4rem; border-left: 3px solid #b05740">
              <div style="flex: 1; font-family: 'Courier New', monospace; font-size: 0.88rem; font-weight: 600">${sentence}</div>
              <div class="gc-text-muted" style="font-size: 0.75rem; min-width: 200px; padding-top: 0.1rem">${annotation}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Declarative vs. Imperative — same meaning, different grammar</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0">
          <div class="gc-bg-terracotta-alpha" style="padding: 0.875rem; border-radius: 0.5rem">
            <div class="gc-text-terracotta" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem">Imperative (label style)</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem">Take 2 tablets.</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; margin-top: 0.25rem">Do not drink alcohol.</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; margin-top: 0.25rem">Store below 77°F.</div>
          </div>
          <div class="gc-bg-sage-alpha" style="padding: 0.875rem; border-radius: 0.5rem">
            <div class="gc-text-sage" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem">Declarative (doctor/conversation)</div>
            <div style="font-size: 0.85rem">You should take 2 tablets.</div>
            <div style="font-size: 0.85rem; margin-top: 0.25rem">You must not drink alcohol.</div>
            <div style="font-size: 0.85rem; margin-top: 0.25rem">You should store it below 77°F.</div>
          </div>
        </div>

        ${sceneCard("imperativeMeds", "Medicine labels use imperative verbs to give clear directions", "amber")}
      `,
      tipBox: {
        title: "💡 The verb is always first",
        content: "On a medicine label, a verb at the start of a sentence with no 'you' before it is usually an imperative. Label instructions often begin with the action word: Take, Store, Keep, Ask, or Stop.",
      },
      exercises: [
        {
          id: "imperatives-identify",
          title: "Spot the Imperative",
          instructions: "Which of these sentences is an imperative (command)?",
          items: [
            {
              type: "radio",
              label: "Which sentence is an imperative?",
              options: [
                { value: "a", label: "\"You should take this with food.\"" },
                { value: "b", label: "\"Take this with food.\"" },
                { value: "c", label: "\"The patient takes this with food.\"" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is an imperative?",
              options: [
                { value: "a", label: "\"Alcohol can make you drowsy.\"" },
                { value: "b", label: "\"You must not drink alcohol with this medicine.\"" },
                { value: "c", label: "\"Do not drink alcohol while taking this medicine.\"" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "imperatives-transform",
          title: "Transform: Declarative → Imperative",
          instructions: "Rewrite each sentence as an imperative (label style). Drop the subject and modal.",
          items: [
            {
              type: "text",
              label: "\"You should take 1 tablet every 6 hours.\" → (imperative)",
              expectedAnswers: ["Take 1 tablet every 6 hours.", "take 1 tablet every 6 hours"],
            },
            {
              type: "text",
              label: "\"You must not exceed 3 doses per day.\" → (imperative)",
              expectedAnswers: ["Do not exceed 3 doses per day.", "do not exceed 3 doses per day"],
            },
            {
              type: "text",
              label: "\"You should store this below 77°F.\" → (imperative)",
              expectedAnswers: ["Store below 77°F.", "Store this below 77°F.", "store below 77°F."],
            },
          ],
        },
        {
          id: "imperatives-word-scramble-1",
          title: "Build the Label Sentence",
          instructions: "Put the words in the correct order to make an imperative.",
          items: [
            {
              type: "word-scramble",
              label: "Rebuild this dosage instruction:",
              words: ["every", "6", "tablet", "hours", "Take", "1"],
              correctAnswer: "Take 1 tablet every 6 hours",
            },
            {
              type: "word-scramble",
              label: "Rebuild this warning:",
              words: ["children", "out", "Keep", "of", "reach", "of"],
              correctAnswer: "Keep out of reach of children",
            },
          ],
        },
      ],
    },
    // =================================================================
    // 4. WARNINGS & MODALS
    // =================================================================
    {
      id: "warnings-modals",
      stepNumber: 4,
      title: "Warnings and modals",
      icon: "⚠️",
      explanation: `
        <p>The Warnings section of a label uses <strong>two kinds of grammar</strong>: imperatives for hard rules, and <strong>modals</strong> for softer information. Knowing the difference can protect your family.</p>

        <div style="display: grid; gap: 0.75rem; margin: 1.25rem 0">
          <div class="gc-bg-red-alpha" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #dc2626">
            <div style="font-weight: 700; color: #dc2626; margin-bottom: 0.35rem">🚫 DO NOT / DO NOT USE — Danger (negative imperative)</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6">
              "Do not use if allergic to ibuprofen."<br/>
              "Do not give to children under 2."<br/>
              "Do not take with alcohol."
            </div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Meaning:</strong> This is a hard rule. It could cause serious harm.</div>
          </div>
          <div class="gc-bg-amber-alpha" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #d97706">
            <div style="font-weight: 700; color: #d97706; margin-bottom: 0.35rem">⚡ MAY — Possible side effect (modal)</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6">
              "May cause drowsiness."<br/>
              "May cause stomach upset."<br/>
              "May cause allergic reactions in some people."
            </div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Meaning:</strong> This is possible, not certain. Watch for these symptoms.</div>
          </div>
          <div class="gc-bg-sage-alpha" style="padding: 0.875rem 1rem; border-radius: 0.5rem; border-left: 4px solid #6a8d73">
            <div style="font-weight: 700; color: #6a8d73; margin-bottom: 0.35rem">💬 ASK A DOCTOR / CONSULT — Advice (imperative + advice)</div>
            <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6">
              "Ask a doctor before use if you have liver disease."<br/>
              "Stop use and ask a doctor if symptoms worsen."<br/>
              "Consult your doctor before taking this product."
            </div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Meaning:</strong> Call your doctor. You need professional advice for your situation.</div>
          </div>
        </div>

        <h3>Decision tree: What kind of warning is this?</h3>
        <div class="gc-bg-slate" style="border: 1px dashed rgba(148,163,184,0.35); border-radius: 0.75rem; padding: 1.1rem 1.25rem; margin: 1rem 0; font-size: 0.85rem; line-height: 1.8">
          <p style="margin: 0 0 0.5rem; font-weight: 700">You see a warning on the label. Ask yourself:</p>
          <p style="margin: 0">Does it start with <strong>"Do not"</strong>? → <span style="color: #dc2626; font-weight: 700">HARD RULE — do not ignore</span></p>
          <p style="margin: 0">Does it say <strong>"May cause"</strong>? → <span style="color: #d97706; font-weight: 700">POSSIBLE SIDE EFFECT — watch for it</span></p>
          <p style="margin: 0">Does it say <strong>"Ask a doctor"</strong> or <strong>"Stop use if"</strong>? → <span style="color: #6a8d73; font-weight: 700">CALL YOUR DOCTOR if this applies to you</span></p>
        </div>

        ${sceneCard("pharmacyCounter", "Your pharmacist can explain any warning you don't understand", "blue")}
      `,
      tipBox: {
        title: "💡 \"May\" does not mean \"will\"",
        content: "\"May cause drowsiness\" does not mean you WILL feel sleepy. It means some people do. Pay attention to how you feel after taking a new medicine — especially before driving.",
      },
      exercises: [
        {
          id: "warnings-classify",
          title: "Classify the Warning",
          instructions: "Read each warning. What kind is it?",
          items: [
            {
              type: "radio",
              label: "\"Do not use if seal is broken.\"",
              options: [
                { value: "hard", label: "Hard rule — do not do this" },
                { value: "side", label: "Possible side effect" },
                { value: "advice", label: "Ask a doctor" },
              ],
              expectedAnswer: "hard",
            },
            {
              type: "radio",
              label: "\"May cause dizziness. Use caution when driving.\"",
              options: [
                { value: "hard", label: "Hard rule — do not do this" },
                { value: "side", label: "Possible side effect" },
                { value: "advice", label: "Ask a doctor" },
              ],
              expectedAnswer: "side",
            },
            {
              type: "radio",
              label: "\"Ask a doctor before use if you are pregnant.\"",
              options: [
                { value: "hard", label: "Hard rule — do not do this" },
                { value: "side", label: "Possible side effect" },
                { value: "advice", label: "Ask a doctor" },
              ],
              expectedAnswer: "advice",
            },
          ],
        },
        {
          id: "warnings-modal-meaning",
          title: "Modal Meaning",
          instructions: "Choose the best explanation for each warning.",
          items: [
            {
              type: "radio",
              label: "\"May cause stomach upset.\"",
              options: [
                { value: "a", label: "Everyone who takes this will have stomach problems." },
                { value: "b", label: "Some people might feel stomach discomfort after taking this." },
                { value: "c", label: "You must eat before taking this medicine." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Do not exceed 3 doses in 24 hours.\"",
              options: [
                { value: "a", label: "You can take 3 doses, but 4 is also okay if needed." },
                { value: "b", label: "3 doses per day is the maximum. Taking more is dangerous." },
                { value: "c", label: "You should try to take exactly 3 doses every day." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "warnings-checkbox",
          title: "Real Label Warning Check",
          instructions: "Look at these label phrases. Select ALL that are hard rules (things you must NEVER do).",
          items: [
            {
              type: "checkbox",
              label: "Which of these are hard rules?",
              options: [
                { value: "a", label: "\"Do not give to children under 2 years.\"" },
                { value: "b", label: "\"May cause dry mouth.\"" },
                { value: "c", label: "\"Do not use with other products containing acetaminophen.\"" },
                { value: "d", label: "\"Ask a doctor if you have high blood pressure.\"" },
                { value: "e", label: "\"Do not take more than directed.\"" },
              ],
              expectedAnswers: ["a", "c", "e"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 5. DOSAGE LANGUAGE
    // =================================================================
    {
      id: "dosage-language",
      stepNumber: 5,
      title: "Dosage language",
      icon: "🔢",
      explanation: `
        ${sceneCard("dosingLanguage", "Dosing language tells you how much, how often, and when to stop", "terracotta")}

        <p>The Directions section tells you <strong>how much</strong> and <strong>how often</strong>. These sentences use special time and number language you need to know.</p>

        <h3>Time expressions on medicine labels</h3>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          ${[
            ["every 4–6 hours", "Take one dose, then wait at least 4 hours. You can wait up to 6 hours. Then take the next dose."],
            ["every 6 to 8 hours", "Same idea — wait between 6 and 8 hours between doses."],
            ["not more than 4 times in 24 hours", "You can take a maximum of 4 doses total per day. Spread them out."],
            ["for no more than 10 days", "Do not take this medicine longer than 10 days in a row without calling a doctor."],
            ["as needed", "Only take it when you feel the symptom. You do not have to take it on a schedule."],
          ]
            .map(
              ([term, meaning]) => `
            <div class="gc-bg-slate" style="display: grid; grid-template-columns: 200px 1fr; gap: 0.75rem; align-items: flex-start; padding: 0.6rem 0.875rem; border-radius: 0.4rem">
              <div class="gc-text-terracotta" style="font-family: 'Courier New', monospace; font-size: 0.82rem; font-weight: 700">${term}</div>
              <div class="gc-text-dark" style="font-size: 0.82rem; line-height: 1.5">${meaning}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Conditional sentences in directions</h3>
        <p>Many dosage instructions use <strong>if</strong> to tell you what to do in a specific situation:</p>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          ${[
            ["If symptoms last more than 3 days, stop use and call a doctor.", "Condition: symptoms last too long → Action: stop and call"],
            ["If you are pregnant or breastfeeding, ask a health professional.", "Condition: pregnant/nursing → Action: ask a professional first"],
            ["If child is under 6, ask a doctor.", "Condition: child is young → Action: get professional dosing advice"],
            ["Take with food if stomach upset occurs.", "Condition: you feel sick → Action: take with food next time"],
          ]
            .map(
              ([sentence, label]) => `
            <div class="gc-bg-slate" style="padding: 0.6rem 0.875rem; border-radius: 0.4rem; border-left: 3px solid #6a8d73">
              <div class="gc-text-dark" style="font-family: 'Courier New', monospace; font-size: 0.82rem; font-weight: 600">${sentence}</div>
              <div class="gc-text-muted" style="font-size: 0.75rem; margin-top: 0.2rem">${label}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `,
      tipBox: {
        title: "💡 \"Every 4–6 hours\" does NOT mean every 4 hours all day",
        content: "If the label says \"every 4–6 hours, not more than 4 times in 24 hours\" — you need to space the doses. 4 doses × 6 hours = 24 hours. Never take more than the maximum number of doses.",
      },
      exercises: [
        {
          id: "dosage-time-reading",
          title: "Read the Dosage",
          instructions: "Answer these questions based on the faux label from Section 2.",
          items: [
            {
              type: "radio",
              label: "Your child is 8 years old. How much medicine should she take?",
              options: [
                { value: "a", label: "400 mg (20 mL)" },
                { value: "b", label: "200 mg (10 mL)" },
                { value: "c", label: "Ask a doctor" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Your child is 8 years old. How many doses can she have in one day?",
              options: [
                { value: "a", label: "Up to 5 doses" },
                { value: "b", label: "Up to 3 doses" },
                { value: "c", label: "Up to 4 doses" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Your child is 4 years old. What should you do for this medicine?",
              options: [
                { value: "a", label: "Give her half the 6–11 dose" },
                { value: "b", label: "Ask a doctor before giving this medicine" },
                { value: "c", label: "Give her the smallest dose listed" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "dosage-conditional",
          title: "Conditional Sentence Reading",
          instructions: "Read the dosage instruction. What happens in each condition?",
          items: [
            {
              type: "radio",
              label: "\"Stop use and ask a doctor if symptoms do not improve in 10 days.\" — When should you call a doctor?",
              options: [
                { value: "a", label: "After taking 10 doses" },
                { value: "b", label: "If you still feel sick after 10 days of taking the medicine" },
                { value: "c", label: "Every 10 hours while taking the medicine" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 6. TALKING TO THE PHARMACIST
    // =================================================================
    {
      id: "pharmacist-dialogue",
      stepNumber: 6,
      title: "Talking to the pharmacist",
      icon: "💬",
      explanation: `
        <p>You do not have to figure out medicine labels alone. Your pharmacist is there to help. Here is how to ask good questions — politely and clearly.</p>

        ${sceneCard("pharmacyCounter", "A pharmacist can compare prices, check interactions, and explain directions", "blue")}

        ${dialogue([
          { speaker: "Sofía", avatar: "👩", text: "Excuse me — my daughter is 8 years old. Can I give her this medicine?", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "Yes, you can. For her age, the dose is 200 mg — that's 10 mL. Give it every 6 to 8 hours, no more than 3 times per day.", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "What does 'active ingredient' mean on the label?", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "That's the chemical that actually treats the pain or fever. Ibuprofen is the active ingredient here. It's the same thing as Advil.", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "She also takes an allergy medicine. Can I give her both at the same time?", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "Let me check. What allergy medicine does she take? I can look it up in our system and make sure there's no interaction.", side: "left", tone: "blue" },
        ])}

        <h3>Useful phrases at the pharmacy</h3>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          ${[
            ["What does ___ mean on the label?", "Asking for a definition"],
            ["Can my child take this? She is ___ years old.", "Getting age-specific advice"],
            ["Can she take this with ___?", "Checking for drug interactions"],
            ["Is there a generic version? It's cheaper.", "Asking about a lower-cost option"],
            ["How should I store this?", "Storage questions"],
            ["What should I do if she misses a dose?", "Missed dose question"],
            ["Are there side effects I should watch for?", "Side effect question"],
          ]
            .map(
              ([phrase, label]) => `
            <div class="gc-bg-slate" style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.55rem 0.875rem; border-radius: 0.4rem">
              <div class="gc-text-dark" style="flex: 1; font-size: 0.85rem; font-style: italic">"${phrase}"</div>
              <div class="gc-text-muted" style="font-size: 0.72rem; min-width: 180px">${label}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `,
      tipBox: {
        title: "💡 Pharmacists are free to talk to",
        content: "You do not need an appointment to talk to a pharmacist. They are trained to answer questions about medicines. You do not need insurance or a prescription to ask for help.",
      },
      exercises: [
        {
          id: "pharmacist-question-register",
          title: "Choose the Right Question",
          instructions: "Which question would you ask the pharmacist in each situation?",
          items: [
            {
              type: "radio",
              label: "You want to know if the medicine will make your child sleepy.",
              options: [
                { value: "a", label: "\"Tell me if this makes my daughter sleepy.\"" },
                { value: "b", label: "\"Are there any side effects I should watch for?\"" },
                { value: "c", label: "\"Why does this medicine exist?\"" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The medicine is expensive and you want a cheaper option.",
              options: [
                { value: "a", label: "\"This is too expensive. Give me something else.\"" },
                { value: "b", label: "\"Is there a generic version available? It would be more affordable.\"" },
                { value: "c", label: "\"Do you have this medicine in a different color?\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "pharmacist-dialogue-rebuild",
          title: "Rebuild the Conversation",
          instructions: "Put the words in order to form a polite question for the pharmacist.",
          items: [
            {
              type: "word-scramble",
              label: "Ask about giving the medicine to your child:",
              words: ["Can", "my", "daughter", "take", "this", "if", "she", "is", "8", "years", "old"],
              correctAnswer: "Can my daughter take this if she is 8 years old",
              correctAnswers: [
                "Can my daughter take this if she is 8 years old",
                "If she is 8 years old can my daughter take this",
              ],
            },
            {
              type: "word-scramble",
              label: "Ask about a drug interaction:",
              words: ["she", "this", "Can", "allergy", "with", "her", "take", "medicine"],
              correctAnswer: "Can she take this with her allergy medicine",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 7. LABEL ROLE-PLAY — Full Practice
    // =================================================================
    {
      id: "label-roleplay",
      stepNumber: 7,
      title: "Label reading role-play",
      icon: "🎭",
      explanation: `
        ${sceneCard("pharmacyAisle", "You can find OTC medicines on the shelf — no prescription needed", "terracotta")}

        <p>You are at home. Your son Carlos (age 9) has a fever. You pick up the bottle of Children's Ibuprofen from Section 2. Your neighbor Ana is visiting and asks you to explain the label.</p>

        ${dialogue([
          { speaker: "Ana", avatar: "👩🏽", text: "What does this medicine do? I can't read all the English.", side: "left", tone: "amber" },
          { speaker: "You", avatar: "🧑", text: "It's ibuprofen. It's a pain reliever and fever reducer. The active ingredient is ibuprofen — 100 mg per 5 mL.", side: "right", tone: "sage" },
          { speaker: "Ana", avatar: "👩🏽", text: "How much do I give my son? He's 7.", side: "left", tone: "amber" },
          { speaker: "You", avatar: "🧑", text: "He's between 6 and 11, so you give him 200 mg — that's 10 mL. You can give it every 6 to 8 hours, but not more than 3 times a day.", side: "right", tone: "sage" },
          { speaker: "Ana", avatar: "👩🏽", text: "And the warnings? What do I need to watch out for?", side: "left", tone: "amber" },
          { speaker: "You", avatar: "🧑", text: "It may cause stomach upset — so give it with food. And do not give it if he's allergic to ibuprofen. If he doesn't feel better in 10 days, call the doctor.", side: "right", tone: "sage" },
        ])}

        <p class="gc-text-muted" style="font-size: 0.88rem; margin-top: 0.5rem">Use the label from Section 2 to answer the exercises below. You can scroll up if you need to look at it again.</p>
      `,
      tipBox: {
        title: "💡 You can explain it too",
        content: "Helping a neighbor read a label is a real skill. You are using the same language doctors and pharmacists use — and you can do it.",
      },
      exercises: [
        {
          id: "roleplay-find-dose",
          title: "Find the Information",
          instructions: "Use the label from Section 2 to answer these questions.",
          items: [
            {
              type: "radio",
              label: "Carlos is 9 years old. What is the correct dose for him?",
              options: [
                { value: "a", label: "400 mg (20 mL)" },
                { value: "b", label: "200 mg (10 mL)" },
                { value: "c", label: "100 mg (5 mL)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "How many hours should you wait between doses for Carlos?",
              options: [
                { value: "a", label: "4 to 6 hours" },
                { value: "b", label: "6 to 8 hours" },
                { value: "c", label: "8 to 12 hours" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "roleplay-word-select",
          title: "Find the Warning Words",
          instructions: "Tap or click all words in this sentence that signal a WARNING.",
          items: [
            {
              type: "word-select",
              label: "Identify the warning signal words:",
              selectWhat: "the warning signal words",
              tokens: [
                { text: "Do", isTarget: true }, { text: "not", isTarget: true }, { text: "use" }, { text: "if" }, { text: "allergic" }, { text: "to" }, { text: "ibuprofen" }, { text: "." },
              ],
            },
            {
              type: "word-select",
              label: "Identify the modal that signals a POSSIBLE side effect:",
              selectWhat: "the modal",
              tokens: [
                { text: "May", isTarget: true }, { text: "cause" }, { text: "stomach" }, { text: "upset" }, { text: "." }, { text: "Take" }, { text: "with" }, { text: "food" }, { text: "." },
              ],
            },
          ],
        },
        {
          id: "roleplay-explain",
          title: "Explain It in Your Own Words",
          instructions: "Write one sentence explaining this warning to a neighbor who doesn't read English well.",
          items: [
            {
              type: "text",
              label: "\"Stop use and ask a doctor if symptoms do not improve in 10 days.\" — Explain this in simple English:",
              expectedAnswers: [
                "If your child is still sick after 10 days, stop giving the medicine and call a doctor.",
                "After 10 days, if the fever or pain doesn't get better, stop and call your doctor.",
              ],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 8. OTC VS. PRESCRIPTION
    // =================================================================
    {
      id: "otc-vs-rx",
      stepNumber: 8,
      title: "OTC vs. Prescription — do you need a doctor's note?",
      icon: "🏪",
      explanation: `
        <p>There are two kinds of medicines in the USA. Knowing the difference saves you time and money.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.25rem 0">
          <div class="gc-bg-green-alpha" style="padding: 1rem; border-radius: 0.65rem; border: 2px solid #6a8d73">
            <div class="gc-text-green" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem">✅ OTC — Over-the-Counter</div>
            <div style="font-size: 0.88rem; line-height: 1.6">
              <strong>No prescription needed.</strong><br/>
              You can buy it yourself off the shelf.<br/><br/>
              The label says: <span style="font-family:'Courier New',monospace; font-size:0.82rem">Drug Facts</span><br/><br/>
              Examples: Tylenol, Motrin, Benadryl, Pepto-Bismol, Robitussin, antacids, bandages, vitamins
            </div>
          </div>
          <div class="gc-bg-blue-alpha" style="padding: 1rem; border-radius: 0.65rem; border: 2px solid #3b82f6">
            <div class="gc-text-blue" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem">💊 Rx — Prescription Only</div>
            <div style="font-size: 0.88rem; line-height: 1.6">
              <strong>You need a doctor's order.</strong><br/>
              The pharmacist fills it and gives it to you.<br/><br/>
              The label says: <span style="font-family:'Courier New',monospace; font-size:0.82rem">Rx Only</span><br/><br/>
              Examples: antibiotics, blood pressure medicine, many types of insulin, birth control pills, most allergy shots
            </div>
          </div>
        </div>

        <h3>Common OTC medicines and what they do</h3>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          ${[
            ["Tylenol", "Acetaminophen", "Pain reliever / fever reducer", "Headache, fever, mild pain. Does NOT reduce inflammation."],
            ["Motrin / Advil", "Ibuprofen", "Pain reliever / fever reducer / anti-inflammatory", "Fever, headache, body aches, swelling. Can reduce inflammation."],
            ["Benadryl", "Diphenhydramine", "Antihistamine", "Allergies, runny nose, sneezing. May cause strong drowsiness."],
            ["Claritin / Zyrtec", "Loratadine / Cetirizine", "Antihistamine (non-drowsy)", "Allergies, hay fever. Less drowsiness than Benadryl."],
            ["Robitussin DM", "Dextromethorphan + Guaifenesin", "Cough suppressant + expectorant", "Cough and chest congestion."],
            ["Pepto-Bismol", "Bismuth subsalicylate", "Antacid / stomach soother", "Upset stomach, nausea, diarrhea, heartburn."],
            ["Tums", "Calcium carbonate", "Antacid", "Heartburn, acid indigestion, sour stomach."],
            ["Neosporin", "Bacitracin + Neomycin + Polymyxin B", "Antibiotic ointment", "Minor cuts, scrapes, burns — prevents infection."],
          ]
            .map(
              ([brand, generic, purpose, notes]) => `
            <div class="gc-bg-slate" style="display: grid; grid-template-columns: 100px 130px 1fr; gap: 0.6rem; align-items: flex-start; padding: 0.6rem 0.875rem; border-radius: 0.4rem; font-size: 0.8rem">
              <div style="font-weight: 700; color: #b05740">${brand}</div>
              <div class="gc-text-dark" style="font-family: 'Courier New', monospace">${generic}</div>
              <div><span style="font-weight: 600">${purpose}</span><br/><span class="gc-text-muted" style="font-size: 0.74rem">${notes}</span></div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Label differences</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0">
          <div style="border: 2px solid #6a8d73; border-radius: 0.5rem; overflow: hidden">
            <div style="background: #6a8d73; color: white; padding: 0.4rem 0.75rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase">OTC Label</div>
            <div class="gc-bg-white gc-text-dark" style="padding: 0.75rem; font-family: 'Courier New', monospace; font-size: 0.78rem; line-height: 1.6">
              <strong>Drug Facts</strong><br/>
              Active Ingredient: Acetaminophen 160 mg<br/>
              Purpose: Pain reliever/Fever reducer<br/>
              Directions: Children 6–11 yrs: take 2 tablets...
            </div>
          </div>
          <div style="border: 2px solid #3b82f6; border-radius: 0.5rem; overflow: hidden">
            <div style="background: #3b82f6; color: white; padding: 0.4rem 0.75rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase">Rx Label</div>
            <div class="gc-bg-white gc-text-dark" style="padding: 0.75rem; font-family: 'Courier New', monospace; font-size: 0.78rem; line-height: 1.6">
              <strong>Rx Only</strong><br/>
              Patient: Maria Rodriguez<br/>
              Dr. Singh — 04/15/2026<br/>
              Amoxicillin 500 mg — Take 1 capsule 3×/day
            </div>
          </div>
        </div>
      `,
      tipBox: {
        title: "💡 Tylenol and Motrin are NOT the same",
        content: "They both reduce fever and pain, but they work differently. Tylenol (acetaminophen) is not an anti-inflammatory. Motrin (ibuprofen) can reduce swelling. Ask a doctor or pharmacist before giving both to a child or combining medicines.",
      },
      exercises: [
        {
          id: "otc-rx-sort",
          title: "OTC or Prescription?",
          instructions: "Decide: does this medicine need a prescription (Rx) or can you buy it yourself (OTC)?",
          items: [
            {
              type: "radio",
              label: "Tylenol Children's — fever reducer, found on the pharmacy shelf",
              options: [
                { value: "otc", label: "OTC — buy it yourself" },
                { value: "rx", label: "Rx — need a prescription" },
              ],
              expectedAnswer: "otc",
            },
            {
              type: "radio",
              label: "Amoxicillin — antibiotic for a strep throat infection",
              options: [
                { value: "otc", label: "OTC — buy it yourself" },
                { value: "rx", label: "Rx — need a prescription" },
              ],
              expectedAnswer: "rx",
            },
            {
              type: "radio",
              label: "Benadryl — allergy medicine for runny nose",
              options: [
                { value: "otc", label: "OTC — buy it yourself" },
                { value: "rx", label: "Rx — need a prescription" },
              ],
              expectedAnswer: "otc",
            },
            {
              type: "radio",
              label: "Insulin glargine pen — prescribed for a patient with diabetes",
              options: [
                { value: "otc", label: "OTC — buy it yourself" },
                { value: "rx", label: "Rx — need a prescription" },
              ],
              expectedAnswer: "rx",
            },
          ],
        },
        {
          id: "otc-generic-match",
          title: "Brand Name → Generic Name",
          instructions: "Match the brand name to its generic ingredient.",
          items: [
            {
              type: "radio",
              label: "Tylenol contains which active ingredient?",
              options: [
                { value: "a", label: "Ibuprofen" },
                { value: "b", label: "Acetaminophen" },
                { value: "c", label: "Diphenhydramine" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Motrin / Advil contains which active ingredient?",
              options: [
                { value: "a", label: "Ibuprofen" },
                { value: "b", label: "Acetaminophen" },
                { value: "c", label: "Loratadine" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Benadryl contains which active ingredient?",
              options: [
                { value: "a", label: "Acetaminophen" },
                { value: "b", label: "Cetirizine" },
                { value: "c", label: "Diphenhydramine" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 9. YOUR INSURANCE CARD
    // =================================================================
    {
      id: "insurance-card",
      stepNumber: 9,
      title: "Your insurance card",
      icon: "💳",
      explanation: `
        ${sceneCard("insuranceCard", "This small card opens doors to healthcare", "blue")}

        <p>When your child starts school, when you visit a doctor, or when you pick up a prescription — you will need your <strong>insurance card</strong>. Keep it in your wallet at all times.</p>

        <h3>Here is a sample insurance card — front and back</h3>

        ${fakeInsuranceCard({
          planName: "BlueStar Health Plan",
          memberName: "MARIA L. RODRIGUEZ",
          memberId: "BSH-779204-01",
          groupNumber: "GRP-44821",
          pcpName: "Dr. A. Singh",
          copayOffice: "$25",
          copaySpecialist: "$50",
          copayER: "$150",
          rxBin: "610494",
          rxPcn: "ADV",
          customerService: "1-800-555-0192 (24/7)",
          claimsAddress: "BlueStar Health\nP.O. Box 18830\nAtlanta, GA 30301",
        })}

        <h3>Every field explained</h3>
        <div style="display: grid; gap: 0.55rem; margin: 1rem 0">
          ${[
            ["Plan Name", "BlueStar Health Plan", "The name of your insurance company and plan type."],
            ["Member Name", "MARIA L. RODRIGUEZ", "Your full legal name. Must match your ID."],
            ["Member ID", "BSH-779204-01", "Your unique insurance number. The pharmacy and doctor need this."],
            ["Group #", "GRP-44821", "Your employer's or plan group number. Needed for billing."],
            ["PCP", "Dr. A. Singh", "Your Primary Care Physician — your main doctor for regular visits."],
            ["Copay (Office)", "$25", "The fixed amount YOU pay for a covered in-network doctor visit."],
            ["Copay (Specialist)", "$50", "More expensive because specialists are experts in one area."],
            ["Copay (ER)", "$150", "Emergency room visits usually cost more. For non-life-threatening problems, urgent care may cost less."],
            ["RxBIN", "610494", "A pharmacy billing number the pharmacy may use to process your prescription."],
            ["RxPCN", "ADV", "Another pharmacy billing code that may appear near the RxBIN."],
            ["Customer Service", "1-800-555-0192", "Call this number if you have questions about your coverage."],
            ["Claims Address", "P.O. Box 18830", "Where doctors send their bills. You usually don't mail anything here."],
          ]
            .map(
              ([field, example, desc]) => `
            <div class="gc-bg-slate" style="display: grid; grid-template-columns: 130px 160px 1fr; gap: 0.6rem; align-items: flex-start; padding: 0.55rem 0.875rem; border-radius: 0.4rem; font-size: 0.8rem">
              <div style="font-weight: 700; color: #1e3a5f">${field}</div>
              <div class="gc-text-dark" style="font-family: 'Courier New', monospace; font-size: 0.78rem">${example}</div>
              <div class="gc-text-dark" style="line-height: 1.45">${desc}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `,
      tipBox: {
        title: "💡 Take a photo of both sides",
        content: "Photograph the front and back of your insurance card and save it in your phone. If you ever forget your card, you can show the photo. Some clinics also accept digital cards.",
      },
      exercises: [
        {
          id: "insurance-card-front-reading",
          title: "Read the Card",
          instructions: "Use the sample insurance card above to answer these questions.",
          items: [
            {
              type: "radio",
              label: "What is María's Member ID?",
              options: [
                { value: "a", label: "GRP-44821" },
                { value: "b", label: "BSH-779204-01" },
                { value: "c", label: "610494" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "How much does María pay when she visits a specialist?",
              options: [
                { value: "a", label: "$25" },
                { value: "b", label: "$150" },
                { value: "c", label: "$50" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "What number should María call if she has a question about her coverage?",
              options: [
                { value: "a", label: "The Group Number (GRP-44821)" },
                { value: "b", label: "Customer Service (1-800-555-0192)" },
                { value: "c", label: "The RxBIN (610494)" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "insurance-card-back-reading",
          title: "Front or Back of the Card?",
          instructions: "Where would you find each piece of information?",
          items: [
            {
              type: "radio",
              label: "The Member ID number",
              options: [
                { value: "front", label: "Front of the card" },
                { value: "back", label: "Back of the card" },
              ],
              expectedAnswer: "front",
            },
            {
              type: "radio",
              label: "The claims mailing address",
              options: [
                { value: "front", label: "Front of the card" },
                { value: "back", label: "Back of the card" },
              ],
              expectedAnswer: "back",
            },
            {
              type: "radio",
              label: "The RxPCN (pharmacy billing code)",
              options: [
                { value: "front", label: "Front of the card" },
                { value: "back", label: "Back of the card" },
              ],
              expectedAnswer: "back",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 10. TYPES OF INSURANCE IN THE USA (2026)
    // =================================================================
    {
      id: "insurance-types",
      stepNumber: 10,
      title: "Types of insurance in the USA",
      icon: "🏥",
      explanation: `
        ${sceneCard("enrollmentPaperwork", "Understanding your options is the first step to getting care", "blue")}

        <p>In the United States, there is no one national health insurance system. Instead, there are several different programs. Many families qualify for more than one. Here is a plain-English guide to the most common types as of 2026.</p>

        <div style="display: grid; gap: 0.875rem; margin: 1.25rem 0">
          <div class="gc-bg-blue-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #3b82f6">
            <div style="font-weight: 700; font-size: 0.95rem; color: #1e40af; margin-bottom: 0.3rem">🏢 Employer Insurance</div>
            <div style="font-size: 0.85rem; line-height: 1.65">Your job offers health insurance as a benefit. Your employer pays part of the cost; you pay part (taken from your paycheck). Usually the most common type for working adults. Coverage often includes doctor visits, hospital care, and prescriptions; dental and vision may be separate options.</div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "My employer <em>provides</em> insurance." / "The premium <em>is deducted</em> from my paycheck."</div>
          </div>

          <div class="gc-bg-terracotta-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #b05740">
            <div style="font-weight: 700; font-size: 0.95rem; color: #b05740; margin-bottom: 0.3rem">🛒 Marketplace / ACA Plans (Obamacare)</div>
            <div style="font-size: 0.85rem; line-height: 1.65">If your job doesn't offer insurance or you are self-employed, you can shop for a plan at <strong>healthcare.gov</strong>. Based on your income, you <em>may</em> qualify for a subsidy (financial help) to lower the cost. Open enrollment is usually November through mid-January, but exact dates can vary by state.</div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "If I earn under $X, I <em>may qualify</em> for lower premiums." / "<em>You can apply</em> at healthcare.gov."</div>
          </div>

          <div class="gc-bg-sage-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #6a8d73">
            <div style="font-weight: 700; font-size: 0.95rem; color: #6a8d73; margin-bottom: 0.3rem">🌿 Medicaid</div>
            <div style="font-size: 0.85rem; line-height: 1.65">Free or very low-cost insurance for people with low incomes. Each state runs its own Medicaid program with different names (e.g., Medi-Cal in California, TennCare in Tennessee). Covers doctor visits, hospital, prescriptions, mental health, and more. <strong>You can apply any time of year.</strong></div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "If you <em>earn</em> under the income limit, you <em>may qualify</em> for Medicaid." / "Medicaid <em>covers</em> most services at no cost."</div>
          </div>

          <div class="gc-bg-green-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #22c55e">
            <div style="font-weight: 700; font-size: 0.95rem; color: #16a34a; margin-bottom: 0.3rem">👶 CHIP — Children's Health Insurance Program</div>
            <div style="font-size: 0.85rem; line-height: 1.65">Low-cost or free health coverage for <strong>children</strong> in families who earn too much for Medicaid but can't afford private insurance. Covers check-ups, shots, dental, vision, emergency care, and more. Even if parents don't have insurance, the child can have CHIP.</div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "Your child <em>can be covered</em> under CHIP even if you <em>are not</em> eligible." / "CHIP <em>provides</em> coverage for children up to age 19."</div>
          </div>

          <div class="gc-bg-purple-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #9333ea">
            <div style="font-weight: 700; font-size: 0.95rem; color: #7e22ce; margin-bottom: 0.3rem">👵 Medicare</div>
            <div style="font-size: 0.85rem; line-height: 1.65">Federal insurance for adults <strong>65 and older</strong>, and for some people with disabilities. It has four parts:
              <ul style="margin: 0.4rem 0 0 1rem; line-height: 1.7">
                <li><strong>Part A</strong> — Inpatient hospital care and some skilled nursing facility, hospice, and home health care (usually no premium if you paid Medicare taxes long enough)</li>
                <li><strong>Part B</strong> — Doctor visits and outpatient care (monthly premium)</li>
                <li><strong>Part C</strong> — Medicare Advantage plans (private plans that bundle A+B and usually D)</li>
                <li><strong>Part D</strong> — Prescription drug coverage</li>
              </ul>
            </div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "Medicare Part A <em>covers</em> hospital stays." / "You <em>may need to enroll</em> on time to avoid a penalty."</div>
          </div>

          <div class="gc-bg-amber-alpha" style="padding: 1rem 1.25rem; border-radius: 0.65rem; border-left: 4px solid #d97706">
            <div style="font-weight: 700; font-size: 0.95rem; color: #b45309; margin-bottom: 0.3rem">🏥 No Insurance? Community Health Centers</div>
            <div style="font-size: 0.85rem; line-height: 1.65">If you don't have insurance, you can still get care. <strong>Federally Qualified Health Centers (FQHCs)</strong> charge on a sliding scale based on your income — meaning you pay what you can afford. Many are bilingual. Find one at <strong>findahealthcenter.hrsa.gov</strong>. Hospital emergency rooms are also required by law to treat you, even without insurance.</div>
            <div class="gc-text-muted" style="font-size: 0.78rem; margin-top: 0.4rem"><strong>Grammar:</strong> "Even if you <em>don't have</em> insurance, you <em>can receive</em> care." / "Payment <em>is based on</em> your income."</div>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.875rem 1rem; border-radius: 0.5rem; margin-top: 0.5rem">
          <div class="gc-text-blue" style="font-weight: 700; margin-bottom: 0.35rem">How to check if you qualify</div>
          <ul style="margin: 0 0 0 1rem; line-height: 1.8; font-size: 0.85rem">
            <li>For <strong>Medicaid and CHIP</strong>: go to your state's Medicaid website or call 1-877-543-7669</li>
            <li>For <strong>Marketplace plans</strong>: go to healthcare.gov or call 1-800-318-2596</li>
            <li>For <strong>Medicare</strong>: go to medicare.gov or call 1-800-633-4227</li>
            <li>For <strong>Community Health Centers</strong>: findahealthcenter.hrsa.gov</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 You may qualify for free coverage right now",
        content: "Many families with children qualify for Medicaid or CHIP and don't know it. There is no shame in using these programs — they exist for exactly this reason. Apply online or call your state's health department.",
      },
      exercises: [
        {
          id: "insurance-types-match",
          title: "Which Program?",
          instructions: "Which insurance program best fits each person?",
          items: [
            {
              type: "radio",
              label: "Dolores is 67 years old and retired. She paid taxes for 20 years.",
              options: [
                { value: "medicaid", label: "Medicaid" },
                { value: "medicare", label: "Medicare" },
                { value: "chip", label: "CHIP" },
                { value: "employer", label: "Employer insurance" },
              ],
              expectedAnswer: "medicare",
            },
            {
              type: "radio",
              label: "Carlos is 10 years old. His parents work but can't afford private insurance, and they earn too much for Medicaid.",
              options: [
                { value: "chip", label: "CHIP — Children's Health Insurance Program" },
                { value: "medicare", label: "Medicare" },
                { value: "aca", label: "ACA Marketplace" },
                { value: "employer", label: "Employer insurance" },
              ],
              expectedAnswer: "chip",
            },
            {
              type: "radio",
              label: "Ana has a low income and no job with benefits. She needs coverage for herself.",
              options: [
                { value: "medicare", label: "Medicare" },
                { value: "medicaid", label: "Medicaid" },
                { value: "chip", label: "CHIP" },
                { value: "employer", label: "Employer insurance" },
              ],
              expectedAnswer: "medicaid",
            },
            {
              type: "radio",
              label: "Roberto is self-employed. He has a moderate income and needs to buy his own plan.",
              options: [
                { value: "chip", label: "CHIP" },
                { value: "medicaid", label: "Medicaid" },
                { value: "aca", label: "ACA Marketplace plan (healthcare.gov)" },
                { value: "medicare", label: "Medicare" },
              ],
              expectedAnswer: "aca",
            },
          ],
        },
        {
          id: "insurance-medicare-parts",
          title: "Medicare Parts",
          instructions: "What does each Medicare part cover?",
          items: [
            {
              type: "radio",
              label: "Medicare Part D covers:",
              options: [
                { value: "a", label: "Hospital stays" },
                { value: "b", label: "Prescription drugs" },
                { value: "c", label: "Doctor visits" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Medicare Part A covers:",
              options: [
                { value: "a", label: "Prescription drugs" },
                { value: "b", label: "Doctor's office visits" },
                { value: "c", label: "Hospital stays" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 11. KEY INSURANCE TERMS
    // =================================================================
    {
      id: "insurance-terms",
      stepNumber: 11,
      title: "Key insurance terms",
      icon: "🔑",
      explanation: `
        ${sceneCard("doctorReception", "Every visit starts here — knowing your terms helps you navigate it", "sage")}

        <p>Health insurance has its own vocabulary. These are the most important words you will see and hear.</p>

        <div style="display: grid; gap: 0.65rem; margin: 1.25rem 0">
          ${[
            ["Premium", "The monthly amount you pay to have insurance — even if you never use it. Like rent for your health coverage.", "#3b82f6"],
            ["Copay", "A fixed amount you pay for a covered service, such as a doctor visit or prescription. Example: $25 per office visit.", "#6a8d73"],
            ["Deductible", "The amount you pay OUT OF POCKET for many covered services before insurance starts paying more. Example: with a $1,000 deductible, you may pay the first $1,000 of covered bills.", "#b05740"],
            ["Out-of-Pocket Maximum", "The most you pay in one year for covered in-network care. After you reach this limit, insurance pays 100% for covered in-network services for the rest of the plan year.", "#22c55e"],
            ["In-Network", "Doctors and hospitals that have an agreement with your insurance company. These cost LESS for you.", "#9333ea"],
            ["Out-of-Network", "Doctors or hospitals that do NOT have an agreement with your insurance. These cost MORE — sometimes a lot more.", "#dc2626"],
            ["Formulary", "The list of prescription medicines your insurance covers. If your medicine is not on the list, you may pay full price.", "#d97706"],
            ["PCP (Primary Care Physician)", "Your main doctor. You see them for regular check-ups and non-emergency problems. They can refer you to specialists.", "#3b82f6"],
            ["Referral", "A written order from your PCP sending you to a specialist. Some plans require a referral before you can see a specialist.", "#6a8d73"],
            ["Prior Authorization", "Permission from your insurance company before you receive certain treatments or medicines. Your doctor's office usually handles this.", "#b05740"],
            ["EOB (Explanation of Benefits)", "A document your insurance sends after you get care. It shows what was billed, what insurance paid, and what you owe. It is NOT a bill.", "#555"],
          ]
            .map(
              ([term, def, color]) => `
            <div class="gc-bg-slate" style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid ${color}">
              <div style="font-weight: 700; color: ${color}; margin-bottom: 0.25rem">${term}</div>
              <div class="gc-text-dark" style="font-size: 0.83rem; line-height: 1.55">${def}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Copay vs. Deductible — the most confused pair</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0">
          <div class="gc-bg-sage-alpha" style="padding: 0.875rem; border-radius: 0.5rem">
            <div class="gc-text-sage" style="font-weight: 700; margin-bottom: 0.4rem">Copay</div>
            <div style="font-size: 0.83rem; line-height: 1.6">A fixed amount for a covered service.<br/>You pay $25 for each covered office visit if that is your plan's office copay.<br/><br/><em>"I pay a $25 copay each time I go."</em></div>
          </div>
          <div class="gc-bg-terracotta-alpha" style="padding: 0.875rem; border-radius: 0.5rem">
            <div class="gc-text-terracotta" style="font-weight: 700; margin-bottom: 0.4rem">Deductible</div>
            <div style="font-size: 0.83rem; line-height: 1.6">Resets each plan year.<br/>For many covered services, you pay up to the deductible amount before insurance helps more.<br/><br/><em>"I haven't met my deductible yet this year."</em></div>
          </div>
        </div>
      `,
      tipBox: {
        title: "💡 Always stay in-network when possible",
        content: "Before you see a new doctor, call your insurance company or check their website to confirm the doctor is in-network. Seeing an out-of-network doctor by mistake can cost hundreds of dollars more.",
      },
      exercises: [
        {
          id: "insurance-copay-vs-deductible",
          title: "Copay or Deductible?",
          instructions: "Is each example a copay or a deductible situation?",
          items: [
            {
              type: "radio",
              label: "María pays $25 every time she visits her doctor.",
              options: [
                { value: "copay", label: "Copay" },
                { value: "deductible", label: "Deductible" },
              ],
              expectedAnswer: "copay",
            },
            {
              type: "radio",
              label: "In January, Roberto gets a hospital bill. Insurance says he must pay the first $1,500 before they help.",
              options: [
                { value: "copay", label: "Copay" },
                { value: "deductible", label: "Deductible" },
              ],
              expectedAnswer: "deductible",
            },
          ],
        },
        {
          id: "insurance-in-network-meaning",
          title: "In-Network vs. Out-of-Network",
          instructions: "Choose the correct answer.",
          items: [
            {
              type: "radio",
              label: "Ana's insurance card shows her plan is BlueStar. She wants to see a doctor. Which doctor should she choose to pay LESS?",
              options: [
                { value: "a", label: "Any doctor she finds on Google" },
                { value: "b", label: "A BlueStar in-network doctor" },
                { value: "c", label: "A specialist without a referral" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "What does \"formulary\" mean?",
              options: [
                { value: "a", label: "A type of medical form you sign at the doctor's office" },
                { value: "b", label: "The list of prescription medicines your insurance covers" },
                { value: "c", label: "The amount you pay at the pharmacy each visit" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "insurance-referral-meaning",
          title: "Referrals",
          instructions: "Answer these questions about referrals.",
          items: [
            {
              type: "radio",
              label: "What is a referral?",
              options: [
                { value: "a", label: "A discount coupon from your insurance company" },
                { value: "b", label: "A written order from your PCP sending you to a specialist" },
                { value: "c", label: "A form you fill out at the pharmacy" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Sofía wants to see a cardiologist (heart doctor). Her plan requires a referral. What should she do first?",
              options: [
                { value: "a", label: "Call the cardiologist directly and make an appointment" },
                { value: "b", label: "Visit her PCP and ask for a referral to a cardiologist" },
                { value: "c", label: "Go to the emergency room" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =================================================================
    // 12. USING YOUR INSURANCE
    // =================================================================
    {
      id: "using-insurance",
      stepNumber: 12,
      title: "Using your insurance",
      icon: "📋",
      explanation: `
        <p>You have your card. You know the words. Now let's practice using it in real situations.</p>

        <h3>At the doctor's office</h3>
        ${dialogue([
          { speaker: "Receptionist", avatar: "💁", text: "Hi! Do you have insurance today?", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "Yes, I have BlueStar Health. Here is my card.", side: "right", tone: "sage" },
          { speaker: "Receptionist", avatar: "💁", text: "Thank you. Your copay today is $25. Will you pay with cash or card?", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "Card, please. Also — is Dr. Singh in-network for BlueStar?", side: "right", tone: "sage" },
          { speaker: "Receptionist", avatar: "💁", text: "Yes, Dr. Singh is in-network. You're all set!", side: "left", tone: "blue" },
        ])}

        <h3>At the pharmacy</h3>
        ${dialogue([
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "Hi, I have a prescription ready for Rodríguez?", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "That's me. I have insurance — here is my card. The RxBIN is on the back.", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "I'm showing a copay of $10 with your plan. Is that okay?", side: "left", tone: "blue" },
          { speaker: "Sofía", avatar: "👩", text: "Yes, that's fine. Is there a generic version? It's usually cheaper.", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "Good news — the generic is only $4. Same medicine, lower price.", side: "left", tone: "blue" },
        ])}

        <h3>What if they say you're "not covered"?</h3>
        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1rem 0">
          <div style="font-weight: 700; color: #b45309; margin-bottom: 0.5rem">⚡ Don't panic. Take these steps:</div>
          <ol style="margin: 0 0 0 1rem; line-height: 1.9; font-size: 0.88rem">
            <li>Ask: <em>"Can you run it again? My Member ID is ___."</em></li>
            <li>Ask: <em>"Is this doctor in-network for my plan?"</em></li>
            <li>If still not covered: <em>"I would like to call my insurance company. What is the claims number?"</em></li>
            <li>Call the Customer Service number on the BACK of your card.</li>
            <li>Say: <em>"I am covered for this service. My plan is ___ and my Member ID is ___. Can you help me understand why this is showing as not covered?"</em></li>
          </ol>
        </div>

        <h3>Rights language — you have these rights</h3>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          ${[
            ["I am covered for ___.", "Stating your coverage right"],
            ["My plan includes ___.", "Describing your benefits"],
            ["I would like to appeal this decision.", "Challenging a denied claim"],
            ["I have the right to request a copy of my EOB.", "Requesting your Explanation of Benefits"],
            ["May I speak to a patient advocate?", "Asking for help navigating insurance"],
          ]
            .map(
              ([phrase, label]) => `
            <div class="gc-bg-slate" style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.55rem 0.875rem; border-radius: 0.4rem">
              <div class="gc-text-dark" style="flex: 1; font-size: 0.85rem; font-style: italic">"${phrase}"</div>
              <div class="gc-text-muted" style="font-size: 0.72rem; min-width: 220px">${label}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `,
      tipBox: {
        title: "💡 You have the right to appeal",
        content: "If your insurance denies a claim or says something is not covered, you usually have the right to appeal (ask the plan to review the decision). Your doctor can often help by writing a letter explaining why you need the treatment.",
      },
      exercises: [
        {
          id: "insurance-pharmacy-dialogue",
          title: "At the Pharmacy",
          instructions: "Choose the best response in each situation.",
          items: [
            {
              type: "radio",
              label: "The pharmacist asks for your insurance information. What do you say?",
              options: [
                { value: "a", label: "\"I have insurance. Here is my card. The RxBIN is on the back.\"" },
                { value: "b", label: "\"I don't know. My doctor has the information.\"" },
                { value: "c", label: "\"Give me the medicine and I will pay cash.\"" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The pharmacist says your copay is $45. You think it should be $10. What do you say?",
              options: [
                { value: "a", label: "\"That's fine. I'll pay it.\"" },
                { value: "b", label: "\"Can you check again? My plan shows a $10 copay for generics.\"" },
                { value: "c", label: "\"Never mind. I don't want the medicine.\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "insurance-rights-language",
          title: "Rights Language",
          instructions: "Which sentence uses the right language to assert your insurance rights?",
          items: [
            {
              type: "radio",
              label: "You were charged for a visit that your insurance should have covered. What do you say?",
              options: [
                { value: "a", label: "\"I don't think this is right.\"" },
                { value: "b", label: "\"I am covered for this service under my BlueStar plan. My Member ID is BSH-779204-01. I would like to dispute this charge.\"" },
                { value: "c", label: "\"Can you give me a discount?\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "label-vs-insurance-contrast",
          title: "Label vs. Insurance Card",
          instructions: "Does this information come from a medicine label or an insurance card?",
          items: [
            {
              type: "radio",
              label: "\"Member ID: BSH-779204-01\"",
              options: [
                { value: "label", label: "Medicine label" },
                { value: "card", label: "Insurance card" },
              ],
              expectedAnswer: "card",
            },
            {
              type: "radio",
              label: "\"Active Ingredient: Ibuprofen 100 mg per 5 mL\"",
              options: [
                { value: "label", label: "Medicine label" },
                { value: "card", label: "Insurance card" },
              ],
              expectedAnswer: "label",
            },
            {
              type: "radio",
              label: "\"EXP: 08/2026\"",
              options: [
                { value: "label", label: "Medicine label" },
                { value: "card", label: "Insurance card" },
              ],
              expectedAnswer: "label",
            },
            {
              type: "radio",
              label: "\"Copay: $25 Office / $50 Specialist\"",
              options: [
                { value: "label", label: "Medicine label" },
                { value: "card", label: "Insurance card" },
              ],
              expectedAnswer: "card",
            },
          ],
        },
        {
          id: "real-world-scenario-choice",
          title: "Real-World Scenario",
          instructions: "What would you do in this situation?",
          items: [
            {
              type: "radio",
              label: "The pharmacist says your prescription is \"not covered\" by your insurance. What is the BEST first step?",
              options: [
                { value: "a", label: "Give up and go home without the medicine." },
                { value: "b", label: "Ask the pharmacist to run the insurance again with your Member ID, and ask if a generic is available." },
                { value: "c", label: "Argue loudly until they change their answer." },
                { value: "d", label: "Pay full price without asking any questions." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

  // =================================================================
  // 13. HEALTHCARE RIGHTS IN MASSACHUSETTS
  // =================================================================
    {
      id: "massachusetts-healthcare-rights",
      stepNumber: 13,
      title: "Healthcare rights in Massachusetts",
      icon: "🧭",
      explanation: `
        <p>Massachusetts has programs that can help people get care even when they do not have regular health insurance. This section is not legal advice, but it gives you the words and first steps to ask for help.</p>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1rem 0">
          <h4 class="gc-text-blue" style="margin: 0 0 0.5rem 0">Important words for Massachusetts</h4>
          <ul style="margin: 0 0 0 1rem; line-height: 1.8; font-size: 0.88rem">
            <li><strong>MassHealth Limited</strong> helps pay for emergency health services for some Massachusetts residents whose immigration status keeps them from getting more MassHealth benefits.</li>
            <li><strong>Health Safety Net (HSN)</strong> is not insurance. It helps pay for some medically necessary care at Massachusetts acute care hospitals and community health centers for qualified low-income uninsured or underinsured residents.</li>
            <li><strong>Worker's compensation</strong> can pay for medical care related to a work injury. It is separate from regular health insurance.</li>
          </ul>
        </div>

        <h3>FAQ: Can I get help if I am undocumented?</h3>
        <div style="display: grid; gap: 0.65rem; margin: 1rem 0">
          ${[
            ["Can I get help if I am undocumented?", "Yes, maybe. In Massachusetts, you may be able to get MassHealth Limited or Health Safety Net. Ask before you decide the answer is no."],
            ["Is Health Safety Net regular insurance?", "No. It helps pay for some care, but it is not a regular insurance plan. You usually get a letter, not a card."],
            ["Where can I use Health Safety Net?", "Use it at many Massachusetts hospitals and community health centers. It may not work at every doctor's office or pharmacy."],
            ["What should I say at the hospital?", "\"I live in Massachusetts. I do not have insurance. Can I apply for help? Can I speak with a financial counselor?\""],
          ]
            .map(
              ([question, answer]) => `
            <div class="gc-bg-slate" style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #3b82f6">
              <div class="gc-text-blue" style="font-weight: 700; margin-bottom: 0.25rem">${question}</div>
              <div class="gc-text-dark" style="font-size: 0.84rem; line-height: 1.6">${answer}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Story 1: Rosa needs care but has no insurance</h3>
        ${dialogue([
          { speaker: "Rosa", avatar: "👩", text: "I do not have insurance. I am afraid to go to the clinic because I cannot pay.", side: "right", tone: "sage" },
          { speaker: "Clinic worker", avatar: "💁", text: "You can still ask for help. Are you a Massachusetts resident? We can help you apply for MassHealth Limited or Health Safety Net if you qualify.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩", text: "What should I bring?", side: "right", tone: "sage" },
          { speaker: "Clinic worker", avatar: "💁", text: "Bring proof of who you are, proof that you live in Massachusetts, and income information if you have it. If something is missing, ask what else you can use.", side: "left", tone: "blue" },
        ])}

        <h3>Story 2: Luis gets hurt at work</h3>
        <p>Luis cuts his hand badly at work. His boss says, <em>"Go to the hospital."</em> Luis is worried because he has no health insurance.</p>
        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1rem 0">
          <h4 class="gc-text-amber" style="margin: 0 0 0.5rem 0">What Luis should do</h4>
          <ol style="margin: 0 0 0 1rem; line-height: 1.85; font-size: 0.88rem">
            <li>Get medical care first if it is urgent.</li>
            <li>Tell the hospital: <em>"This injury happened at work."</em></li>
            <li>Tell the employer as soon as possible and write down the date, time, place, and what happened.</li>
            <li>Ask the employer for the worker's compensation insurance information.</li>
            <li>If the claim is denied or the employer will not help, contact the Massachusetts Department of Industrial Accidents (DIA).</li>
          </ol>
        </div>

        <h3>Story 3: Ana is afraid to report a work injury</h3>
        <p>Ana hurt her back lifting boxes at work. She is at a community clinic asking for help. She is afraid her boss will get angry, fire her, or ask about her immigration status if she says the injury happened at work.</p>
        ${dialogue([
          { speaker: "Ana", avatar: "👩🏽", text: "I got hurt at work, but I am scared to report it. Can my boss ask about my immigration status?", side: "right", tone: "amber" },
          { speaker: "Worker advocate", avatar: "🧑‍💼", text: "The Massachusetts Attorney General says their office serves all workers regardless of immigration status. Workers have rights to safe workplaces and protection from retaliation.", side: "left", tone: "blue" },
          { speaker: "Ana", avatar: "👩🏽", text: "What should I say at the clinic?", side: "right", tone: "amber" },
          { speaker: "Worker advocate", avatar: "🧑‍💼", text: "Say: \"I was injured at work. I need medical care, and I need the worker's compensation insurance information. I would like everything in writing.\"", side: "left", tone: "blue" },
        ])}

        <h3>Useful Massachusetts contacts</h3>
        <div style="display: grid; gap: 0.55rem; margin: 1rem 0">
          ${[
            ["MassHealth Customer Service", "1-800-841-2900", "Apply for MassHealth, Health Safety Net, or ask about letters."],
            ["Health Connector", "1-877-623-6765", "Ask about Marketplace plans and free application help."],
            ["Health Safety Net Help Desk", "1-877-910-2100", "Ask patient questions about HSN."],
            ["Department of Industrial Accidents", "617-727-4900", "Ask about worker's compensation after a job injury."],
            ["Massachusetts Attorney General Civil Rights Division", "617-963-2917", "Ask about immigrant worker rights and retaliation."],
          ]
            .map(
              ([name, phone, purpose]) => `
            <div class="gc-bg-slate" style="display: grid; grid-template-columns: 220px 150px 1fr; gap: 0.75rem; align-items: flex-start; padding: 0.65rem 0.9rem; border-radius: 0.45rem">
              <div class="gc-text-blue" style="font-weight: 700; font-size: 0.82rem">${name}</div>
              <div class="gc-text-dark" style="font-family: 'Courier New', monospace; font-size: 0.82rem">${phone}</div>
              <div class="gc-text-muted" style="font-size: 0.78rem; line-height: 1.5">${purpose}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <p class="gc-text-muted" style="font-size: 0.82rem; line-height: 1.6">For urgent symptoms or serious injuries, get medical care first. You can ask billing and coverage questions after you are safe.</p>
      `,
      tipBox: {
        title: "💡 Ask for a financial counselor",
        content: "Hospitals and community health centers often have staff who help patients apply for coverage or financial assistance. A useful sentence is: \"Can I speak with a financial counselor or certified application assister?\"",
      },
      exercises: [
        {
          id: "ma-rights-coverage-faq",
          title: "Massachusetts Coverage FAQ",
          instructions: "Choose the clearest answer based on this section.",
          items: [
            {
              type: "radio",
              label: "Marisol lives in Massachusetts, has no insurance, and is worried she cannot pay for a clinic visit. What is the best first step?",
              options: [
                { value: "a", label: "Assume she cannot get any help and avoid the clinic" },
                { value: "b", label: "Ask the clinic or a MassHealth assister if she can apply for help paying for care" },
                { value: "c", label: "Use someone else's insurance card" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Nadia has a Health Safety Net eligibility letter. What does that mean?",
              options: [
                { value: "a", label: "A regular insurance plan with a card you use anywhere" },
                { value: "b", label: "A program that may help pay for some care at Massachusetts hospitals and community health centers" },
                { value: "c", label: "A discount card for any pharmacy" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "ma-work-injury-first-step",
          title: "Work Injury: First Steps",
          instructions: "Choose the best first step.",
          items: [
            {
              type: "radio",
              label: "Mateo falls from a ladder while painting at work. He goes to urgent care. What should he say?",
              options: [
                { value: "a", label: "\"This happened while I was working.\"" },
                { value: "b", label: "\"I hurt myself at home.\"" },
                { value: "c", label: "\"Please bill my friend.\"" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "After a work injury, who should Mateo ask for the worker's compensation insurance information?",
              options: [
                { value: "a", label: "His employer" },
                { value: "b", label: "His landlord" },
                { value: "c", label: "The grocery store cashier" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "ma-rights-language",
          title: "Rights Language",
          instructions: "Choose the sentence that asks for help clearly and safely.",
          items: [
            {
              type: "radio",
              label: "Elena is at the hospital registration desk. She has no insurance and does not understand the bill. What should she ask?",
              options: [
                { value: "a", label: "\"Is there someone who can help me apply for coverage or financial help?\"" },
                { value: "b", label: "\"Never mind, I will leave.\"" },
                { value: "c", label: "\"Give me free care now.\"" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

  // =================================================================
  // 14. PRESCRIPTION SAVINGS CARDS
  // =================================================================
    {
      id: "prescription-savings-cards",
      stepNumber: 14,
      title: "Prescription savings cards",
      icon: "💵",
      explanation: `
        <p>Sometimes the pharmacy price is too high. A prescription savings card or coupon, like GoodRx or a store discount program, may lower the price. These cards can help, but they are <strong>not insurance</strong>.</p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1rem 0">
          <h4 class="gc-text-amber" style="margin: 0 0 0.5rem 0">Important: coupon or insurance?</h4>
          <ul style="margin: 0 0 0 1rem; line-height: 1.8; font-size: 0.88rem">
            <li>A savings card is <strong>not insurance</strong>.</li>
            <li>You usually use either your insurance <strong>or</strong> the coupon price for one prescription, not both together.</li>
            <li>If you use a coupon instead of insurance, that payment may not count toward your deductible or out-of-pocket maximum.</li>
            <li>Prices can change by pharmacy. The same medicine may cost less at one pharmacy and more at another.</li>
          </ul>
        </div>

        <h3>What to ask at the pharmacy</h3>
        ${dialogue([
          { speaker: "Patient", avatar: "👩", text: "My copay is $45. Is there a cheaper option?", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "We can check. Do you want me to compare your insurance price with the cash price or a coupon price?", side: "left", tone: "blue" },
          { speaker: "Patient", avatar: "👩", text: "Yes, please. Can you check the price with my insurance and also the cash price with this coupon? Which one is cheaper?", side: "right", tone: "sage" },
          { speaker: "Pharmacist", avatar: "👨‍⚕️", text: "The coupon price is cheaper today. But it will not go through your insurance.", side: "left", tone: "blue" },
        ])}

        <h3>Three ways to lower prescription costs</h3>
        <div style="display: grid; gap: 0.65rem; margin: 1rem 0">
          ${[
            ["Ask for a generic", "\"Is there a generic version?\" Generic medicine often costs less than brand-name medicine."],
            ["Compare prices", "\"Can you check my insurance price and the coupon price?\" Ask before you pay."],
            ["Call the doctor", "\"This medicine is too expensive. Is there a cheaper similar medicine?\" The doctor may be able to change the prescription."],
            ["Ask about assistance", "\"Is there a patient assistance program?\" Some drug companies, hospitals, and state programs help with costs."],
          ]
            .map(
              ([title, text]) => `
            <div class="gc-bg-slate" style="padding: 0.75rem 1rem; border-radius: 0.5rem; border-left: 3px solid #d97706">
              <div class="gc-text-amber" style="font-weight: 700; margin-bottom: 0.25rem">${title}</div>
              <div class="gc-text-dark" style="font-size: 0.84rem; line-height: 1.6">${text}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <h3>Privacy note</h3>
        <p>Some coupon apps and discount websites collect information about searches, coupons, and prescriptions. If privacy is a concern, you can still ask the pharmacist these questions without using an app:</p>
        <ul style="margin: 0.5rem 0 1rem 1rem; line-height: 1.8">
          <li><em>"What is the cash price?"</em></li>
          <li><em>"Is there a store discount program?"</em></li>
          <li><em>"Is there a cheaper generic?"</em></li>
        </ul>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.6rem; margin: 1rem 0">
          <h4 class="gc-text-blue" style="margin: 0 0 0.5rem 0">Massachusetts note</h4>
          <p style="margin: 0; line-height: 1.65">Massachusetts also has <strong>Prescription Advantage</strong>, a state prescription drug assistance program for many older adults and some people with disabilities. If medicine costs are a long-term problem, ask about it.</p>
        </div>
      `,
      tipBox: {
        title: "💡 The magic question",
        content: "At the pharmacy, say: \"Can you check the price with my insurance and also the cash price with this coupon? Which one is cheaper?\"",
      },
      exercises: [
        {
          id: "savings-card-or-insurance",
          title: "Savings Card or Insurance?",
          instructions: "Choose the clearest answer.",
          items: [
            {
              type: "radio",
              label: "A pharmacy coupon website shows a lower price for Daniela's medicine. What should Daniela understand?",
              options: [
                { value: "a", label: "The coupon is the same as health insurance" },
                { value: "b", label: "The coupon may lower the cash price, but it is not insurance" },
                { value: "c", label: "A free doctor visit program" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jae uses a coupon price instead of his insurance for one refill. What should he know?",
              options: [
                { value: "a", label: "The payment may not count toward your deductible or out-of-pocket maximum" },
                { value: "b", label: "It automatically counts twice toward your insurance" },
                { value: "c", label: "You never have to pay again" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "savings-card-pharmacy-script",
          title: "Pharmacy Script",
          instructions: "Choose the best sentence to ask for a lower price.",
          items: [
            {
              type: "radio",
              label: "Amina's prescription is $68 with insurance. She has a coupon on her phone. What should she ask?",
              options: [
                { value: "a", label: "\"Could you compare my insurance price with the coupon price before I pay?\"" },
                { value: "b", label: "\"Give it to me for free.\"" },
                { value: "c", label: "\"I will stop taking medicine forever.\"" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The coupon still does not make the medicine affordable. What is another good question?",
              options: [
                { value: "a", label: "\"Can I ask my doctor if there is a lower-cost medicine that treats the same problem?\"" },
                { value: "b", label: "\"Can I take someone else's medicine?\"" },
                { value: "c", label: "\"Can I ignore the directions?\"" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
  ],

  // =========================================================================
  // MINI-QUIZ
  // =========================================================================
  miniQuiz: [
    {
      id: "mq-label-imperative-id",
      question: "Which sentence is an imperative from a medicine label?",
      options: [
        { value: "a", label: "\"You should take 2 tablets every 6 hours.\"" },
        { value: "b", label: "\"Take 2 tablets every 6 hours.\"" },
        { value: "c", label: "\"The patient takes 2 tablets every 6 hours.\"" },
      ],
      correctAnswer: "b",
      skillTag: "label-imperative-identification",
      difficulty: "easy",
    },
    {
      id: "mq-label-imperative-transform",
      question: "Transform this declarative into a label-style imperative: \"You should store this below 77°F.\"",
      options: [
        { value: "a", label: "\"You must store this below 77°F.\"" },
        { value: "b", label: "\"Storing below 77°F is recommended.\"" },
        { value: "c", label: "\"Store below 77°F.\"" },
      ],
      correctAnswer: "c",
      skillTag: "label-imperative-transform",
      difficulty: "easy",
    },
    {
      id: "mq-warning-must-not",
      question: "\"Do not use if child has had an allergic reaction to ibuprofen.\" This is:",
      options: [
        { value: "a", label: "A possible side effect — watch for it" },
        { value: "b", label: "A hard rule — do not ignore it" },
        { value: "c", label: "Advice — call your doctor about it" },
      ],
      correctAnswer: "b",
      skillTag: "label-warning-modal-must-not",
      difficulty: "easy",
    },
    {
      id: "mq-modal-may",
      question: "\"May cause drowsiness.\" What does \"may\" mean here?",
      options: [
        { value: "a", label: "Everyone will feel drowsy after taking this." },
        { value: "b", label: "Some people might feel drowsy. Watch for it." },
        { value: "c", label: "You are allowed to feel drowsy." },
      ],
      correctAnswer: "b",
      skillTag: "label-modal-may-side-effect",
      difficulty: "easy",
    },
    {
      id: "mq-dosage-time",
      question: "The label says: \"every 6 to 8 hours, not more than 3 times in 24 hours.\" Your child took a dose at 8 AM. When is the earliest she can have the next dose?",
      options: [
        { value: "a", label: "10 AM (2 hours later)" },
        { value: "b", label: "2 PM (6 hours later)" },
        { value: "c", label: "8 PM (12 hours later)" },
      ],
      correctAnswer: "b",
      skillTag: "label-dosage-time-reading",
      difficulty: "medium",
    },
    {
      id: "mq-label-conditional",
      question: "\"Stop use and ask a doctor if symptoms do not improve in 10 days.\" When should you call the doctor?",
      options: [
        { value: "a", label: "After taking 10 doses" },
        { value: "b", label: "If the illness is still there after 10 days on the medicine" },
        { value: "c", label: "Every 10 hours while taking the medicine" },
      ],
      correctAnswer: "b",
      skillTag: "label-conditional-reading",
      difficulty: "medium",
    },
    {
      id: "mq-active-ingredient",
      question: "The label says \"Active Ingredient: Acetaminophen 160 mg.\" What does \"active ingredient\" mean?",
      options: [
        { value: "a", label: "The brand name of the medicine" },
        { value: "b", label: "The chemical that actually treats your symptom" },
        { value: "c", label: "The expiration date information" },
      ],
      correctAnswer: "b",
      skillTag: "label-active-ingredient-vocab",
      difficulty: "easy",
    },
    {
      id: "mq-expiration",
      question: "The label shows EXP: 06/2025. It is now August 2025. What should you do?",
      options: [
        { value: "a", label: "Use the medicine — it's only 2 months past the date" },
        { value: "b", label: "Do not use it — it has expired. Get a new bottle." },
        { value: "c", label: "Cut the dose in half to be safe" },
      ],
      correctAnswer: "b",
      skillTag: "label-expiration-reading",
      difficulty: "easy",
    },
    {
      id: "mq-pharmacist-question",
      question: "You want to ask the pharmacist if your daughter can take this medicine with her allergy medicine. Which question is most polite and clear?",
      options: [
        { value: "a", label: "\"Can she take both?\"" },
        { value: "b", label: "\"Is it okay if my daughter takes this with her allergy medicine?\"" },
        { value: "c", label: "\"Tell me if these medicines work together.\"" },
      ],
      correctAnswer: "b",
      skillTag: "pharmacist-question-register",
      difficulty: "medium",
    },
    {
      id: "mq-dialogue-rebuild",
      question: "Put these words in order: [every / 6 / tablet / hours / Take / 1]",
      options: [
        { value: "a", label: "\"1 tablet Take every 6 hours\"" },
        { value: "b", label: "\"Take 1 tablet every 6 hours\"" },
        { value: "c", label: "\"Every 6 hours take 1 tablet\"" },
      ],
      correctAnswer: "b",
      skillTag: "pharmacist-dialogue-rebuild",
      difficulty: "easy",
    },
    {
      id: "mq-card-front",
      question: "You are at the doctor's office. The receptionist asks for your Member ID. Where do you look?",
      options: [
        { value: "a", label: "Back of the insurance card — it's with the claims address" },
        { value: "b", label: "Front of the insurance card — it's listed as Member ID" },
        { value: "c", label: "Your medicine label" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-card-front-reading",
      difficulty: "easy",
    },
    {
      id: "mq-card-back",
      question: "On the sample insurance card in this guide, where is the Customer Service phone number?",
      options: [
        { value: "a", label: "Front of the card" },
        { value: "b", label: "Back of the card" },
        { value: "c", label: "It's not on the card — you have to search online" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-card-back-reading",
      difficulty: "easy",
    },
    {
      id: "mq-copay-deductible",
      question: "María pays $25 every time she goes to the doctor. This is her:",
      options: [
        { value: "a", label: "Deductible" },
        { value: "b", label: "Premium" },
        { value: "c", label: "Copay" },
      ],
      correctAnswer: "c",
      skillTag: "insurance-copay-vs-deductible",
      difficulty: "easy",
    },
    {
      id: "mq-in-network",
      question: "What does \"in-network\" mean for your insurance?",
      options: [
        { value: "a", label: "Doctors who are very popular and hard to get an appointment with" },
        { value: "b", label: "Doctors who have an agreement with your insurance company, so you pay less" },
        { value: "c", label: "Doctors who are near your home" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-in-network-meaning",
      difficulty: "medium",
    },
    {
      id: "mq-rights-language",
      question: "The pharmacy says your prescription isn't covered. Which response is most effective?",
      options: [
        { value: "a", label: "\"Okay, I'll pay full price.\"" },
        { value: "b", label: "\"I am covered for this under my plan. My Member ID is ___. Can you try running it again?\"" },
        { value: "c", label: "\"This is wrong! Fix it!\"" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-rights-language",
      difficulty: "medium",
    },
    {
      id: "mq-pharmacy-dialogue",
      question: "At the pharmacy, what information do you give when you pick up a prescription?",
      options: [
        { value: "a", label: "Your name, date of birth, and insurance card (especially Member ID and RxBIN)" },
        { value: "b", label: "Your social security number and credit score" },
        { value: "c", label: "Your doctor's personal phone number" },
      ],
      correctAnswer: "a",
      skillTag: "insurance-pharmacy-dialogue",
      difficulty: "easy",
    },
    {
      id: "mq-referral",
      question: "Sofía wants to see a cardiologist. Her insurance requires a referral. What is the correct first step?",
      options: [
        { value: "a", label: "Call the cardiologist directly and make an appointment" },
        { value: "b", label: "Visit her PCP first and ask for a referral to a cardiologist" },
        { value: "c", label: "Call her insurance company and ask them to send a referral" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-referral-meaning",
      difficulty: "medium",
    },
    {
      id: "mq-formulary",
      question: "Your doctor prescribed a medicine but the pharmacy says it's \"not on the formulary.\" What does this mean?",
      options: [
        { value: "a", label: "The medicine is expired" },
        { value: "b", label: "Your insurance doesn't cover this specific medicine — you may pay full price or need a different one" },
        { value: "c", label: "The medicine is only available at certain pharmacies" },
      ],
      correctAnswer: "b",
      skillTag: "insurance-formulary-vocabulary",
      difficulty: "medium",
    },
    {
      id: "mq-label-vs-card",
      question: "Which of these pieces of information would you find on a MEDICINE LABEL — not an insurance card?",
      options: [
        { value: "a", label: "Group Number (GRP-44821)" },
        { value: "b", label: "\"Do not exceed 5 doses in 24 hours.\"" },
        { value: "c", label: "Copay: $25 Office" },
      ],
      correctAnswer: "b",
      skillTag: "label-vs-insurance-contrast",
      difficulty: "medium",
    },
    {
      id: "mq-real-world-scenario",
      question: "You go to a new doctor. They say your insurance is not accepted there. What is the BEST next step?",
      options: [
        { value: "a", label: "Pay out-of-pocket for the full visit without asking any questions" },
        { value: "b", label: "Call your insurance company's Customer Service number to find an in-network doctor nearby, or ask the office if they will submit an out-of-network claim" },
        { value: "c", label: "Give up and do not see a doctor" },
        { value: "d", label: "Go to the emergency room instead" },
      ],
      correctAnswer: "b",
      skillTag: "real-world-scenario-choice",
      difficulty: "hard",
    },
  ],

  /*
  TEACHER DIAGNOSTIC NOTES — Medicine Labels & Insurance Cards Mini Quiz (20 items)

  This mini quiz checks whether students can:
  - Recognize and produce imperatives in the style of medicine labels.
  - Distinguish between hard warnings (do not), possible side effects (may), and advice (ask a doctor).
  - Read dosage instructions: time intervals, max doses, age-based directions.
  - Read and interpret conditional sentences in label warnings.
  - Identify active ingredient, expiration date, and label section fields.
  - Ask polite, clear questions at the pharmacy.
  - Read an insurance card (front and back).
  - Distinguish copay from deductible.
  - Understand in-network, formulary, referral, and rights language.
  - Use empowerment language when insurance says "not covered."
  - Distinguish what information is on a label vs. on an insurance card.

  Skill tags:

  Medicine Labels:
  - label-imperative-identification
  - label-imperative-transform
  - label-warning-modal-must-not
  - label-modal-may-side-effect
  - label-dosage-time-reading
  - label-conditional-reading
  - label-active-ingredient-vocab
  - label-expiration-reading
  - pharmacist-question-register
  - pharmacist-dialogue-rebuild

  Insurance Cards:
  - insurance-card-front-reading
  - insurance-card-back-reading
  - insurance-copay-vs-deductible
  - insurance-in-network-meaning
  - insurance-rights-language
  - insurance-pharmacy-dialogue
  - insurance-referral-meaning
  - insurance-formulary-vocabulary
  - label-vs-insurance-contrast
  - real-world-scenario-choice

  How to read the diagnostics:

  - If label-imperative tags are weak →
    Return to Section 3. Practice the formula: [base verb] + rest. No "you."
    Do side-by-side: declarative vs. imperative. Emphasize that the label drops the subject
    because it's speaking to everyone. Have students transform: "You should..." → base verb form.

  - If warning modal tags are weak (must-not, may) →
    Return to Section 4. Drill the three warning types: DO NOT (hard rule), MAY (possible),
    ASK A DOCTOR (conditional advice). Use sorting activities with real label phrases.
    Key insight: "may" does NOT mean "will" — it signals possibility, not certainty.

  - If dosage-time-reading is weak →
    Return to Section 5. Focus on the math: "every 6 to 8 hours" means minimum 6 hours between doses.
    "Not more than 3 times in 24 hours" means 3 doses spread across the day, not 3 in a row.
    Use a timeline diagram to make the spacing visual.

  - If label-conditional-reading is weak →
    Return to Section 5. Practice "if" sentence structures:
    If [condition] → [action]. Have students underline the condition and circle the action.
    Focus on "if symptoms don't improve in X days" as the most common label pattern.

  - If pharmacist-question tags are weak →
    Return to Section 6. Model the register shift: label uses imperatives (commands),
    but YOU use polite questions and declaratives with the pharmacist.
    Practice: "Can ___?" / "Is there ___?" / "What does ___ mean?" Role-play at the pharmacy counter.

  - If insurance-card tags are weak (front/back reading) →
    Return to Section 9. Give students a physical mock card to annotate.
    Focus on: Member ID (front), Customer Service number (back), and pharmacy billing codes such as RxBIN/RxPCN.
    Practice: "Where is ___? Point to it."

  - If copay-vs-deductible is weak →
    Return to Section 11. Use the analogy:
    Copay = toll on a bridge — for the same covered service, you pay a fixed amount.
    Deductible = a tab at a restaurant — for many covered services, you pay first before the plan pays more.

  - If in-network / formulary / referral tags are weak →
    Return to Section 11. Use a comparison chart: in-network (cheaper, covered) vs. out-of-network (expensive, maybe not covered).
    Formulary: "approved list" — like a grocery store brand list that your insurance prefers.
    Referral: "permission note" from your main doctor to see a specialist.

  - If insurance-rights-language is weak →
    Return to Section 12. Practice the three steps for a denied claim:
    1. State your coverage: "I am covered for this under my plan."
    2. Give your ID: "My Member ID is ___."
    3. Request action: "Can you try running it again?" / "I would like to appeal."
    Emphasize: saying "no" is not the end. You have rights.

  - If real-world-scenario-choice is weak →
    This is the highest-order skill in the guide. Students need to combine:
    knowing the card, knowing their rights, and knowing the language to use.
    Run a full role-play: student plays patient, teacher plays pharmacist/receptionist.
    Vary the scenario: correct billing, wrong billing, not covered, wrong doctor.
  */
};
