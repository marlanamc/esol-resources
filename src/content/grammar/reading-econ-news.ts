import type { InteractiveGuideContent } from "@/types/activity";

// ---------------------------------------------------------------------------
// Reusable inline HTML helpers
// ---------------------------------------------------------------------------

const labelPill = (text: string, color: "terracotta" | "sage" | "blue" | "amber" | "green" | "red"): string =>
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

/** A fake news-site headline card, styled like a simple phone news app. */
const fakeHeadlineCard = (opts: {
  source: string;
  headline: string;
  summary: string;
  accent?: "terracotta" | "sage" | "blue" | "amber" | "red";
}): string => {
  const accent = opts.accent ?? "blue";
  return `
    <div style="border: 1px solid rgba(0,0,0,0.12); border-radius: 0.65rem; overflow: hidden; margin: 1rem 0; max-width: 520px; box-shadow: 0 2px 8px rgba(0,0,0,0.08)">
      <div class="gc-bg-${accent}-alpha gc-text-${accent}" style="padding: 0.4rem 0.875rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">${opts.source}</div>
      <div class="gc-bg-white" style="padding: 0.875rem">
        <div style="font-size: 1.05rem; font-weight: 700; line-height: 1.35; margin-bottom: 0.4rem">${opts.headline}</div>
        <div class="gc-text-muted" style="font-size: 0.85rem; line-height: 1.5">${opts.summary}</div>
      </div>
    </div>
  `;
};

/** A simple inline CSS bar chart (no image asset needed). */
const fakeBarChart = (opts: {
  title: string;
  unit?: string;
  bars: { label: string; value: number; display: string }[];
  accent?: "terracotta" | "sage" | "blue" | "amber";
}): string => {
  const accent = opts.accent ?? "terracotta";
  const max = Math.max(...opts.bars.map((b) => b.value));
  return `
    <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 0.65rem; padding: 1rem 1.1rem; margin: 1.25rem 0; max-width: 520px; background: rgba(0,0,0,0.015)">
      <div style="font-weight: 700; font-size: 0.92rem; margin-bottom: 0.9rem">${opts.title}${opts.unit ? ` <span style="font-weight: 400; font-size: 0.75rem; opacity: 0.65">(${opts.unit})</span>` : ""}</div>
      <div style="display: grid; gap: 0.6rem">
        ${opts.bars
          .map((b) => {
            const pct = Math.round((b.value / max) * 100);
            return `
          <div style="display: grid; grid-template-columns: 90px 1fr 64px; gap: 0.6rem; align-items: center">
            <div style="font-size: 0.8rem; font-weight: 600">${b.label}</div>
            <div style="background: rgba(0,0,0,0.06); border-radius: 999px; height: 16px; overflow: hidden">
              <div class="gc-bg-${accent}" style="width: ${pct}%; height: 100%; border-radius: 999px"></div>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; text-align: right">${b.display}</div>
          </div>
        `;
          })
          .join("")}
      </div>
    </div>
  `;
};

/** A simple "this month vs last month" price comparison table. */
const fakePriceTable = (rows: { item: string; before: string; after: string }[]): string => `
  <div style="border: 1px solid rgba(0,0,0,0.12); border-radius: 0.6rem; overflow: hidden; margin: 1.25rem 0; max-width: 520px">
    <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0; background: rgba(0,0,0,0.04); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em">
      <div style="padding: 0.5rem 0.75rem">Item</div>
      <div style="padding: 0.5rem 0.75rem">Last Year</div>
      <div style="padding: 0.5rem 0.75rem">This Year</div>
    </div>
    ${rows
      .map(
        (r, i) => `
      <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0; font-size: 0.85rem; ${i % 2 === 1 ? "background: rgba(0,0,0,0.015)" : ""}">
        <div style="padding: 0.5rem 0.75rem; font-weight: 600">${r.item}</div>
        <div style="padding: 0.5rem 0.75rem">${r.before}</div>
        <div style="padding: 0.5rem 0.75rem; font-weight: 700">${r.after}</div>
      </div>
    `
      )
      .join("")}
  </div>
`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const readingEconNewsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =================================================================
    // 1. READING A HEADLINE
    // =================================================================
    {
      id: "reading-headlines",
      stepNumber: 1,
      title: "Reading a news headline",
      icon: "📰",
      explanation: `
        <p>Sarah notices that her grocery bill is higher this week. She opens the news to understand why.</p>
        <p>You don't need to understand every word in the news to get the main idea. Most economy headlines answer one simple question: <strong>are things getting better or worse for workers and families?</strong></p>

        ${fakeHeadlineCard({
          source: "Local News",
          headline: "Grocery Prices Rise Again This Month",
          summary: "Shoppers say the cost of eggs, milk, and bread keeps going up, making it harder to stick to a budget.",
          accent: "red",
        })}

        <p>You don't need to read the whole article. Just the <strong>headline</strong> already tells you the main idea: prices are going up. That's usually bad news for a family paying bills.</p>

        <h3>Three quick questions for any economy headline</h3>
        <div style="display: grid; gap: 0.6rem; margin: 1rem 0">
          <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.7rem 1rem; border-radius: 0.5rem"><strong>1. What is this about?</strong> Is it prices, jobs, wages, or something else?</div>
          <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.7rem 1rem; border-radius: 0.5rem"><strong>2. Is the number going up or down?</strong> Look for words like <em>rose, fell, dropped, increased, higher, lower</em>.</div>
          <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.7rem 1rem; border-radius: 0.5rem"><strong>3. Good news or bad news for workers?</strong> More jobs and higher wages are usually good. Higher prices and more unemployment are usually bad.</div>
        </div>

        ${fakeHeadlineCard({
          source: "Local News",
          headline: "More Companies Are Hiring This Month",
          summary: "Several local employers say they are adding new positions as business picks up.",
          accent: "sage",
        })}

        <p>This headline is about <strong>jobs</strong>, the word <strong>hiring</strong> signals more jobs, and that's <strong>good news</strong> for people looking for work.</p>
      `,
      exercises: [
        {
          id: "headline-check-1",
          title: "Good news or bad news?",
          instructions: "Read each headline. Is it good news or bad news for a family paying bills?",
          items: [
            {
              type: "radio",
              label: "\"Rent Prices Hit a New High This Year\"",
              options: [
                { value: "good", label: "Good news" },
                { value: "bad", label: "Bad news" },
              ],
              expectedAnswer: "bad",
            },
            {
              type: "radio",
              label: "\"Unemployment Drops to Lowest Level in Two Years\"",
              options: [
                { value: "bad", label: "Bad news" },
                { value: "good", label: "Good news" },
              ],
              expectedAnswer: "good",
            },
            {
              type: "radio",
              label: "\"Average Wages Rise 4% This Year\"",
              options: [
                { value: "good", label: "Good news" },
                { value: "bad", label: "Bad news" },
              ],
              expectedAnswer: "good",
            },
            {
              type: "text",
              label: "\"Grocery Prices ___ Again This Month\" (the news word for \"went up\")",
              expectedAnswers: ["Rise", "rise", "Rose", "rose"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 2. READING A PRICE CHART
    // =================================================================
    {
      id: "reading-price-charts",
      stepNumber: 2,
      title: "Reading a price chart",
      icon: "📊",
      explanation: `
        <p>News articles about the economy often show a chart instead of (or next to) a paragraph of text. A chart can look confusing at first, but it's really just a picture of numbers.</p>

        <h3>Bigger bar = bigger number</h3>
        <p>In a bar chart, longer bars mean higher numbers. Compare the bars below. Which year had the highest gas price?</p>

        ${fakeBarChart({
          title: "Average Gas Price, Same Month",
          unit: "per gallon",
          bars: [
            { label: "2023", value: 3.4, display: "$3.40" },
            { label: "2024", value: 3.6, display: "$3.60" },
            { label: "2025", value: 3.9, display: "$3.90" },
            { label: "2026", value: 4.1, display: "$4.10" },
          ],
          accent: "terracotta",
        })}

        <p>The bars get longer each year. That means gas prices have been <strong>going up</strong> year after year.</p>

        <h3>A price table: this year vs. last year</h3>
        <p>Sometimes the news shows a simple table instead of a chart. Read across each row to compare.</p>

        ${fakePriceTable([
          { item: "Dozen eggs", before: "$2.80", after: "$3.60" },
          { item: "Gallon of milk", before: "$3.50", after: "$4.10" },
          { item: "Loaf of bread", before: "$2.50", after: "$3.00" },
        ])}

        <p>Every item costs <strong>more</strong> this year than last year. When many prices go up at the same time, we call that <strong>inflation</strong>.</p>
      `,
      exercises: [
        {
          id: "chart-check-1",
          title: "Read the chart",
          instructions: "Look at the gas price chart above. Answer the questions.",
          items: [
            {
              type: "radio",
              label: "In which year was gas the most expensive?",
              options: [
                { value: "2023", label: "2023" },
                { value: "2026", label: "2026" },
              ],
              expectedAnswer: "2026",
            },
            {
              type: "radio",
              label: "From 2023 to 2026, the price of gas...",
              options: [
                { value: "down", label: "went down" },
                { value: "up", label: "went up" },
                { value: "same", label: "stayed the same" },
              ],
              expectedAnswer: "up",
            },
          ],
        },
        {
          id: "chart-check-2",
          title: "Read the price table",
          instructions: "Use the egg/milk/bread table above.",
          items: [
            {
              type: "radio",
              label: "How much did a gallon of milk cost last year?",
              options: [
                { value: "a", label: "$3.50" },
                { value: "b", label: "$4.10" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "When many prices go up at the same time, we call that ___.",
              expectedAnswers: ["inflation"],
            },
          ],
        },
      ],
    },

    // =================================================================
    // 3. JOBS AND WAGES IN THE NEWS
    // =================================================================
    {
      id: "jobs-wages-news",
      stepNumber: 3,
      title: "Jobs and wages in the news",
      icon: "💼",
      explanation: `
        <p>Besides prices, the news often talks about <strong>jobs</strong> and <strong>wages</strong> (the money people earn). Two common numbers you'll hear:</p>

        <div style="display: grid; gap: 0.6rem; margin: 1rem 0">
          <div class="gc-bg-sage-alpha" style="padding: 0.8rem 1rem; border-radius: 0.5rem">
            ${labelPill("unemployment rate", "sage")}
            <p style="margin: 0.4rem 0 0">The percent of people who want a job but don't have one. A <strong>lower</strong> number is usually good news.</p>
          </div>
          <div class="gc-bg-blue-alpha" style="padding: 0.8rem 1rem; border-radius: 0.5rem">
            ${labelPill("average wage", "blue")}
            <p style="margin: 0.4rem 0 0">How much the typical worker earns. A <strong>higher</strong> number is usually good news, unless prices are rising faster.</p>
          </div>
        </div>

        ${fakeBarChart({
          title: "Unemployment Rate, Same Month",
          unit: "percent",
          bars: [
            { label: "2023", value: 5.1, display: "5.1%" },
            { label: "2024", value: 4.3, display: "4.3%" },
            { label: "2025", value: 3.8, display: "3.8%" },
            { label: "2026", value: 3.5, display: "3.5%" },
          ],
          accent: "sage",
        })}

        <p>This chart is different. The bars get <strong>shorter</strong> each year. Fewer people are unemployed, which is a positive sign for the job market.</p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.9rem 1.1rem; border-radius: 0.5rem; margin: 1.25rem 0">
          <strong>Watch out:</strong> a chart going down is not automatically bad news, and a chart going up is not automatically good news. Always ask: <em>what is this chart measuring?</em> Unemployment going down is good. Prices going up is usually bad.
        </div>
      `,
      exercises: [
        {
          id: "jobs-check-1",
          title: "Jobs and wages check",
          instructions: "Use the unemployment chart above.",
          items: [
            {
              type: "radio",
              label: "From 2023 to 2026, the unemployment rate...",
              options: [
                { value: "up", label: "went up" },
                { value: "down", label: "went down" },
                { value: "same", label: "stayed exactly the same" },
              ],
              expectedAnswer: "down",
            },
            {
              type: "radio",
              label: "A falling unemployment rate is usually...",
              options: [
                { value: "good", label: "good news for workers" },
                { value: "bad", label: "bad news for workers" },
                { value: "neutral", label: "not related to jobs at all" },
              ],
              expectedAnswer: "good",
            },
            {
              type: "text",
              label: "Fill in the blank: \"This month, the ___ rate dropped to 3.5%, the lowest in years.\"",
              expectedAnswers: ["unemployment", "Unemployment"],
            },
            {
              type: "radio",
              label: "\"Average wages rose 4% this year, but prices rose 6%.\" Overall, is this good or bad news for a family's budget?",
              options: [
                { value: "good", label: "Good news, because wages went up" },
                { value: "bad", label: "Bad news, because prices went up more than wages" },
                { value: "same", label: "No change, since both numbers went up" },
              ],
              expectedAnswer: "bad",
            },
          ],
        },
      ],
      tipBox: {
        title: "Bring it to class",
        content: "Find one real headline about prices or jobs this week, from a phone, a newspaper, or something you heard. Bring one sentence about it to share with the class.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "ren-q1",
      question: "\"Grocery prices rose 5% this month.\" What does this headline mean?",
      options: [
        { value: "a", label: "Food costs more than it did before" },
        { value: "b", label: "Food costs less than it did before" },
        { value: "c", label: "Food prices stayed the same" },
      ],
      correctAnswer: "a",
      explanation: "Rose means went up. Prices rising means things cost more.",
      topic: "reading-news",
      skill: "comprehension",
      skillTag: "headline-direction",
      difficulty: "easy",
    },
    {
      id: "ren-q2",
      question: "In a bar chart about prices, which bar shows the highest price?",
      options: [
        { value: "a", label: "The shortest bar" },
        { value: "b", label: "The longest bar" },
        { value: "c", label: "It's impossible to tell from a bar chart" },
      ],
      correctAnswer: "b",
      explanation: "In a bar chart, a longer bar means a bigger number.",
      topic: "reading-charts",
      skill: "comprehension",
      skillTag: "bar-chart-reading",
      difficulty: "easy",
    },
    {
      id: "ren-q3",
      question: "What is it called when many prices go up at the same time?",
      options: [
        { value: "a", label: "inflation" },
        { value: "b", label: "a refund" },
        { value: "c", label: "a deposit" },
      ],
      correctAnswer: "a",
      explanation: "Inflation means prices rise and money buys less than it used to.",
      topic: "economy-vocab",
      skill: "usage",
      skillTag: "inflation-meaning",
      difficulty: "easy",
    },
    {
      id: "ren-q4",
      question: "Which number is usually good news when it goes DOWN?",
      options: [
        { value: "a", label: "wages" },
        { value: "b", label: "unemployment rate" },
        { value: "c", label: "prices at the grocery store" },
      ],
      correctAnswer: "b",
      explanation: "A lower unemployment rate means more people have jobs.",
      topic: "economy-vocab",
      skill: "comprehension",
      skillTag: "unemployment-direction",
      difficulty: "medium",
    },
    {
      id: "ren-q5",
      question: "A classmate reads a chart where the bars get shorter each year and says: \"This means prices are going up every year.\" What is wrong with that reading?",
      options: [
        { value: "a", label: "Shorter bars mean a smaller number, so this chart is actually going down, not up" },
        { value: "b", label: "Nothing is wrong. Shorter bars always mean prices" },
        { value: "c", label: "The chart has too few years to read it correctly" },
      ],
      correctAnswer: "a",
      explanation: "Shorter bars mean a smaller number. The classmate mixed up the direction of the chart.",
      topic: "reading-charts",
      skill: "error-detection",
      skillTag: "bar-direction-mistake",
      difficulty: "medium",
    },
  ],
};
