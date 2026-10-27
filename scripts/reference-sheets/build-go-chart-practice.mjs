#!/usr/bin/env node
/**
 * Blank "go chart" practice pages, styled like the 12-tense master charts in the
 * ESOL 3 Grammar Companion, but covering only the tenses taught through Present Perfect.
 *   node scripts/reference-sheets/build-go-chart-practice.mjs
 * Writes FY27/reference-sheets/go-chart-practice.html and output/pdf/go-chart-practice.pdf.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// s = subject, h = helping verb, n = not, m = main verb, anything else is punctuation.
const tenses = [
 ['Present Simple','simple',[['s:She','m:goes','.'],['s:She','h:does','n:not','m:go','.'],['h:Does','s:she','m:go','?']]],
 ['Past Simple','simple',[['s:She','m:went','.'],['s:She','h:did','n:not','m:go','.'],['h:Did','s:she','m:go','?']]],
 ['Future Simple','simple',[['s:She','h:will','m:go','.'],['s:She','h:will','n:not','m:go','.'],['h:Will','s:she','m:go','?']]],
 ['Present Continuous','continuous',[['s:She','h:is','m:going','.'],['s:She','h:is','n:not','m:going','.'],['h:Is','s:she','m:going','?']]],
 ['Past Continuous','continuous',[['s:She','h:was','m:going','.'],['s:She','h:was','n:not','m:going','.'],['h:Was','s:she','m:going','?']]],
 ['Future Continuous','continuous',[['s:She','h:will','h:be','m:going','.'],['s:She','h:will','n:not','h:be','m:going','.'],['h:Will','s:she','h:be','m:going','?']]],
 ['Present Perfect','perfect',[['s:She','h:has','m:gone','.'],['s:She','h:has','n:not','m:gone','.'],['h:Has','s:she','m:gone','?']]],
];
const role = { s:'subject', h:'helper', n:'negative', m:'main' };
const blank = r => `<span class="blank blank-${r}"></span>`;

function cell(tokens, mode) {
 if (mode === 'blank') return '';
 const hasHelper = tokens.some(t => t.startsWith('h:'));
 const out = tokens.map(t => {
  const [k, word] = t.includes(':') ? t.split(':') : [null, t];
  if (!k) return `<span class="punct">${word}</span>`;
  const hide = (k === 'h' && mode !== 'key') || (k === 'm' && mode === 'verbs');
  return hide ? blank(role[k]) : `<b class="syntax-${role[k]}">${word}</b>`;
 }).join(' ').replace(/ <span class="punct">/g, '<span class="punct">');
 return mode === 'helpers' && !hasHelper ? `${out}<span class="no-helper">no helper</span>` : out;
}

const syntaxKey = `<div class="syntax-key"><span class="syntax-subject">Subject</span><span class="syntax-helper">Helping verb</span><span class="syntax-main">Main verb</span><span class="syntax-negative">Negative</span></div>`;
const forms = `<p class="forms"><b>go</b> → <b>goes</b> → <b>going</b> → <b>went</b> → <b>gone</b> <span>V1 · V1-s · V-ing · V2 · V3</span></p>`;
const nameLine = `<div class="name"><span>Name</span><i></i><span>Date</span><i class="short"></i></div>`;

const pages = [
 { mode:'helpers', title:'Go chart 1: Helping verbs', chapter:'Practice / Go charts', intro:'Write the <b class="syntax-helper">helping verb</b> on each blue line. The subject, <b class="syntax-negative">not</b>, and the <b class="syntax-main">main verb</b> are already there.', tip:['Remember','Use <b>does</b> with she / he / it. After <b>does</b> and <b>did</b>, the main verb is V1: She does not <b>go</b>. To make a question, move the first helper before the subject.'] },
 { mode:'verbs', title:'Go chart 2: Helpers and main verbs', chapter:'Practice / Go charts', intro:'Write the <b class="syntax-helper">helping verb</b> on each blue line and the <b class="syntax-main">main verb</b> on each orange line. Choose the right form of <b>go</b>.', tip:['Which form of go?','After <b>do / does / did / will</b> → <b>go</b>. After <b>be</b> (am / is / are / was / were / be) → <b>going</b>. After <b>have / has</b> → <b>gone</b>.'] },
 { mode:'blank', title:'Go chart 3: The whole chart', chapter:'Practice / Go charts', intro:'Write the full sentence with <b>she</b> and <b>go</b>. End statements with a period and questions with a question mark.', tip:['Check your chart','Does every negative have <b>not</b>? Does every question start with a helping verb? Which two affirmatives have no helping verb?'] },
 { mode:'key', title:'Go chart: Answer key', chapter:'Teacher / Go charts', intro:'Full forms are shown so the helping verbs are easy to see. Contractions are also correct: doesn’t, didn’t, won’t, isn’t, wasn’t, hasn’t, she’s gone.', tip:['Notice','Present Simple and Past Simple affirmatives have no helping verb: She <b>goes</b>. She <b>went</b>. Every other sentence needs at least one helper.'] },
];

const table = mode => `<table class="master ${mode}"><colgroup><col style="width:14%"><col style="width:28.66%"><col style="width:28.67%"><col style="width:28.67%"></colgroup><thead><tr><th>Tense</th><th>Affirmative (+)</th><th>Negative (−)</th><th>Question (?)</th></tr></thead><tbody>${tenses.map(([name, family, cells]) => `<tr><th class="fam-${family}"><span class="family-${family}">${name}</span></th>${cells.map(c => `<td>${cell(c, mode)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const fontCss = [['Regular',400],['Bold',700]].map(([name, weight]) => `@font-face{font-family:'Atkinson Hyperlegible Next';font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${readFileSync(`scripts/reference-sheets/fonts/AtkinsonHyperlegibleNext-${name}.woff2`).toString('base64')}) format('woff2');}`).join('');
const css = `${fontCss}
*{box-sizing:border-box}body{margin:0;color:#20302e;font-family:"Atkinson Hyperlegible Next",Arial,sans-serif;font-size:11pt;line-height:1.36;background:#e9ece9}
.sheet{width:11in;height:8.5in;margin:24px auto;background:white;padding:.5in .45in;box-shadow:0 3px 18px #0002;--accent:#35695e}
.page{height:7.5in;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-top:5px solid var(--accent);padding-top:8px}
.chapter{font-size:9pt;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent)}
.name{display:flex;align-items:flex-end;gap:6px;font-size:10pt;font-weight:bold;color:#4a5e57}.name i{display:inline-block;width:2.4in;border-bottom:1px solid #4a5e57;height:1em}.name i.short{width:1.2in}
h1{font-size:21pt;line-height:1.1;margin:10px 0 6px;letter-spacing:-.5px;color:var(--accent)}
p{margin:0 0 6px}.intro{font-size:11.5pt}.forms{font-size:11pt}.forms span{font-size:9pt;color:#4a5e57;margin-left:10px;letter-spacing:.5px}
.syntax-key{display:flex;gap:20px;font-size:10pt;font-weight:bold;margin:4px 0 2px}.syntax-key span{border-bottom:3px solid currentColor;padding-bottom:2px}
.syntax-subject{color:#713c91}.syntax-helper{color:#17599a}.syntax-main{color:#9b421b}.syntax-negative{color:#a32146}
.family-simple{color:#39843e}.family-continuous{color:#24827a}.family-perfect{color:#b33e21}
table{width:100%;border-collapse:collapse;table-layout:fixed;margin:8px 0 auto}
th,td{border:1px solid #a5b6af;padding:5px 7px;text-align:left;vertical-align:middle}
thead th:first-child{border-left-width:5px}thead th{background:#e6eeeb;color:var(--accent);font-size:10.5pt;height:.3in}
tbody th{font-weight:bold;font-size:10.5pt;background:#f6f9f7;width:14%;border-left:5px solid}
th.fam-simple{border-left-color:#39843e}th.fam-continuous{border-left-color:#24827a}th.fam-perfect{border-left-color:#b33e21}
tbody td{font-size:12pt;line-height:1.5;white-space:nowrap}
.blank{display:inline-block;height:1.1em;vertical-align:baseline;border-bottom:2px solid}.blank-helper{width:.54in;border-color:#17599a}.blank-main{width:.6in;border-color:#9b421b}
.punct{margin-left:1px}.no-helper{display:block;font-size:8.5pt;color:#6b7c76;font-style:italic;letter-spacing:.3px}
tbody tr{height:.64in}
aside{border-left:3px solid var(--accent);padding:6px 10px;background:#eef3f1;font-size:10.5pt}aside strong{color:var(--accent)}
.footer{display:flex;justify-content:space-between;font-size:9pt;border-top:1px solid #a7b8b0;padding-top:5px;margin-top:8px;color:#4a5e57}
@page{size:letter landscape;margin:0}@media print{body{background:white}.sheet{margin:0;box-shadow:none;break-after:page;print-color-adjust:exact;-webkit-print-color-adjust:exact}.sheet:last-child{break-after:auto}}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Go Chart Practice</title><style>${css}</style></head><body>${pages.map((pg, i) => `<article class="sheet"><div class="page"><div class="top"><span class="chapter">${pg.chapter}</span>${pg.mode === 'key' ? '' : nameLine}</div><h1>${pg.title}</h1><p class="intro">${pg.intro}</p>${forms}${syntaxKey}${table(pg.mode)}<aside><strong>${pg.tip[0]}:</strong> ${pg.tip[1]}</aside><div class="footer"><span>ESOL 3 · Seven tenses, from Present Simple to Present Perfect</span><span>${i + 1}</span></div></div></article>`).join('')}</body></html>`;

await mkdir('FY27/reference-sheets', { recursive: true });
await writeFile('FY27/reference-sheets/go-chart-practice.html', html);

const browser = await chromium.launch({ headless: true });
try {
 const page = await browser.newPage();
 await page.goto(pathToFileURL(path.resolve('FY27/reference-sheets/go-chart-practice.html')).href);
 await page.emulateMedia({ media: 'print' });
 await page.evaluate(() => document.fonts.ready);
 const overflow = await page.evaluate(() => [...document.querySelectorAll('.page, td')].map((p, i) => [i + 1, Math.max(p.scrollHeight - p.clientHeight, p.scrollWidth - p.clientWidth)]).filter(([, o]) => o > 2));
 if (overflow.length) throw new Error('Page overflow: ' + JSON.stringify(overflow));
 await mkdir('output/pdf', { recursive: true });
 await page.pdf({ path: 'output/pdf/go-chart-practice.pdf', preferCSSPageSize: true, printBackground: true });
 process.stdout.write(`Saved output/pdf/go-chart-practice.pdf (${pages.length} pages)\n`);
} finally { await browser.close(); }
