#!/usr/bin/env node
/**
 * Go chart practice: list the verb forms, then fill the 7-tense chart.
 * Same black-and-white style as verb-chart-7-tenses.html.
 *   node FY27/worksheets/group-handouts/verb-chart/build-go-chart-practice.mjs
 * Writes go-chart-practice.html next to this file. Print it to PDF with Chrome.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const forms = { V1: 'go', 'V1-s': 'goes', 'V-ing': 'going', V2: 'went', V3: 'gone' };
const subject = 'she';

// h = helper, n = not, m = main verb (with its form label), s = subject.
const S = ['s', 'She'], s = ['s', 'she'], not = ['n', 'not'];
const h = w => ['h', w], m = f => ['m', f];
const tenses = [
 ['Present simple', 'every day · usually', [[S, m('V1-s'), '.'], [S, h('does'), not, m('V1'), '.'], [h('Does'), s, m('V1'), '?']]],
 ['Past simple', 'yesterday · last week', [[S, m('V2'), '.'], [S, h('did'), not, m('V1'), '.'], [h('Did'), s, m('V1'), '?']]],
 ['Future simple', 'tomorrow · next week', [[S, h('will'), m('V1'), '.'], [S, h('will'), not, m('V1'), '.'], [h('Will'), s, m('V1'), '?']]],
 ['Present continuous', 'now · right now', [[S, h('is'), m('V-ing'), '.'], [S, h('is'), not, m('V-ing'), '.'], [h('Is'), s, m('V-ing'), '?']], 'group'],
 ['Past continuous', 'at 8:00 last night', [[S, h('was'), m('V-ing'), '.'], [S, h('was'), not, m('V-ing'), '.'], [h('Was'), s, m('V-ing'), '?']]],
 ['Future continuous', 'at 8:00 tomorrow', [[S, h('will'), h('be'), m('V-ing'), '.'], [S, h('will'), not, h('be'), m('V-ing'), '.'], [h('Will'), s, h('be'), m('V-ing'), '?']]],
 ['Present perfect', 'ever · never · for · since', [[S, h('has'), m('V3'), '.'], [S, h('has'), not, m('V3'), '.'], [h('Has'), s, m('V3'), '?']], 'group'],
];

const line = '<span class="line"></span>';
function sentence(tokens, mode) {
 if (mode === 'blank') return '';
 const words = tokens.map(t => {
  if (typeof t === 'string') return t;
  const [k, w] = t;
  if (k === 'h') return mode === 'key' ? `<span class="help">${w}</span>` : line;
  if (k === 'm') return mode === 'verbs' ? line : forms[w];
  return w;
 });
 const out = words.join(' ').replace(/ ([.?])$/, '$1');
 return mode === 'helpers' && !tokens.some(t => t[0] === 'h') ? `${out}<span class="fx">no helper</span>` : out;
}

const formsBox = (mode, anyVerb) => `<div class="box">
    <h2>Step 1. Write the verb forms.</h2>
    <div class="given-row"><span>Verb (V1): ${anyVerb ? '<span class="fill"></span>' : `<b>${forms.V1}</b>`}</span><span>Subject: ${anyVerb ? '<span class="fill"></span>' : `<b>${subject}</b>`}</span></div>
    <table class="forms">
      <tr><th>V1<span>base form</span></th><th>V1-s<span>he / she / it</span></th><th>V-ing<span>-ing form</span></th><th>V2<span>past form</span></th><th>V3<span>past participle</span></th></tr>
      <tr>${Object.entries(forms).map(([k, w]) => `<td>${!anyVerb && (k === 'V1' || mode === 'key') ? w : ''}</td>`).join('')}</tr>
    </table>
  </div>`;

const chart = mode => `<table class="chart">
    <tr><th class="corner">Tense</th><th class="col-h">+ <span>yes</span></th><th class="col-h">− <span>no</span></th><th class="col-h">? <span>question</span></th></tr>
${tenses.map(([name, when, cells, group]) => `    <tr${group ? ' class="group"' : ''}><th class="tense">${name}<span class="when">${when}</span></th>${cells.map(c => `<td>${sentence(c, mode)}</td>`).join('')}</tr>`).join('\n')}
  </table>`;

const check = `<div class="check">
    <b>Check:</b>
    <span><span class="cb"></span>Every − has <i>not</i>.</span>
    <span><span class="cb"></span>Every ? starts with a helper.</span>
    <span><span class="cb"></span>After do / does / did / will: V1.</span>
  </div>`;

const pages = [
 { mode: 'helpers', title: 'Go Chart 1: Helpers', sub: 'Write the forms, then the helpers.', step2: 'Write the helper on each line. The verb is there for you.' },
 { mode: 'verbs', title: 'Go Chart 2: Helpers + Verbs', sub: 'Use your forms from Step 1.', step2: 'Write the helper and the verb form on each line.' },
 { mode: 'blank', title: 'Go Chart 3: The Whole Chart', sub: 'Use your forms from Step 1.', step2: 'Write the full sentence. End with . or ?' },
 { mode: 'blank', anyVerb: true, title: 'My Verb Chart', sub: 'Any verb, any subject.', step2: 'Write the full sentence. End with . or ?' },
 { mode: 'key', title: 'Go Chart: Answer Key', sub: 'Contractions are OK too.', step2: '<span class="help">underline</span> = the helper. doesn’t, didn’t, won’t, isn’t, wasn’t, hasn’t, she’s gone are also correct.' },
];

const page = p => `<section class="page">
  ${p.mode === 'key' ? '' : '<div class="name-row">Name: <span class="fill"></span> Date: <span class="fill date"></span></div>'}
  <div class="title-row">
    <h1>${p.title}</h1>
    <span class="sub">${p.sub}</span>
  </div>

  ${formsBox(p.mode, p.anyVerb)}

  <h2>Step 2. Fill in the chart.</h2>
  <div class="hint">${p.step2}</div>
  ${chart(p.mode)}

  ${p.mode === 'key' ? '' : check}
</section>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Go Chart Practice</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 14px;
    line-height: 1.35;
  }

  /* One .page = one portrait letter side. */
  .page {
    width: 8.5in;
    height: 11in;
    padding: 0.4in 0.45in;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }

  @media screen {
    body { background: #e6e6e6; padding: 24px 0; }
    .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
  }
  @media print {
    @page { size: letter portrait; margin: 0; }
  }

  /* Type scale: 22 / 18 / 14 / 11 */
  h1 { font-size: 22px; }
  h2 { font-size: 18px; margin-bottom: 5px; }

  .name-row { display: flex; gap: 18px; align-items: flex-end; font-size: 18px; font-weight: bold; margin-bottom: 8px; }
  .name-row .fill { flex: 1; border-bottom: 2px solid #000; height: 26px; }
  .name-row .fill.date { flex: none; width: 1.3in; }

  .title-row {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 8px;
  }
  .title-row .sub { font-size: 14px; font-style: italic; }

  .box { border: 2px solid #000; padding: 6px 11px 10px; margin-bottom: 10px; }
  .hint { font-size: 11px; font-style: italic; margin-bottom: 4px; }
  .help { font-weight: bold; text-decoration: underline; text-decoration-thickness: 2px; }

  /* Step 1: verb forms */
  .given-row { display: flex; gap: 36px; font-size: 18px; margin-bottom: 6px; }
  .given-row .fill { display: inline-block; width: 1.6in; border-bottom: 2px solid #000; height: 20px; vertical-align: bottom; }
  table.forms { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.forms th, table.forms td { border: 1.5px solid #000; padding: 3px 7px; text-align: center; }
  table.forms th { font-size: 18px; }
  table.forms th span { display: block; font-size: 11px; font-weight: normal; font-style: italic; }
  table.forms td { height: 44px; font-size: 18px; }

  /* Step 2: the chart (rows = tenses, columns = + / − / ?) */
  table.chart { width: 100%; border-collapse: collapse; table-layout: fixed; border: 2px solid #000; flex: 1; margin-bottom: 8px; }
  table.chart th, table.chart td { border: 1.5px solid #000; padding: 3px 6px; text-align: left; vertical-align: middle; font-size: 14px; }
  table.chart td { line-height: 1.9; height: 78px; }
  table.chart th.corner { font-size: 11px; width: 1.3in; }
  table.chart th.col-h { font-size: 18px; text-align: center; height: 34px; }
  table.chart th.col-h span { font-size: 11px; font-weight: normal; font-style: italic; }
  table.chart th.tense .when { display: block; font-size: 11px; font-weight: normal; font-style: italic; }
  table.chart .fx { display: block; font-size: 11px; font-style: italic; }
  table.chart tr.group td, table.chart tr.group th { border-top: 2px solid #000; }
  .line { display: inline-block; width: 0.48in; border-bottom: 2px solid #000; height: 16px; vertical-align: baseline; }

  .check { border: 1.5px dashed #000; padding: 5px 9px; font-size: 14px; }
  .cb { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #000; vertical-align: -2px; margin-right: 4px; }
  .check span { margin-right: 14px; white-space: nowrap; }
</style>
</head>
<body>

${pages.map(page).join('\n\n')}

</body>
</html>
`;

await writeFile(fileURLToPath(new URL('go-chart-practice.html', import.meta.url)), html);
process.stdout.write(`Built go-chart-practice.html (${pages.length} pages)\n`);
