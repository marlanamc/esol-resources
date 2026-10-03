/** Render local HTML offline, fail on overflow, and export binder-ready Letter PDF. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 const external=[];
 await page.route('**/*',route=>{if(/^https?:/.test(route.request().url())) {external.push(route.request().url());return route.abort();} return route.continue();});
 await page.goto(pathToFileURL(path.resolve('FY27/reference-sheets/esol-3b-grammar-reference.html')).href);
 await page.emulateMedia({media:'print'});
 await page.evaluate(()=>document.fonts.ready);
 const report=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>{
   const p=s.querySelector('.page'), body=s.querySelector('.body'), footer=s.querySelector('.footer');
   return {id:s.id,overflow:Math.max(0,p.scrollHeight-p.clientHeight,p.scrollWidth-p.clientWidth),bodyHeight:body.clientHeight, footer:footer.textContent.trim()};
 }));
 const structure=await page.evaluate(()=>({
  charts:[...document.querySelectorAll('.master')].map(t=>t.querySelectorAll('tbody tr').length),
  brokenLinks:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).map(a=>a.textContent),
  tinyCells:[...document.querySelectorAll('td,th')].filter(c=>parseFloat(getComputedStyle(c).fontSize)<13.3).length,
 }));
 if(structure.charts.length!==2 || structure.charts.some(n=>n!==12) || structure.brokenLinks.length || structure.tinyCells) throw new Error('Invalid booklet structure: '+JSON.stringify(structure));
 process.stdout.write(JSON.stringify({pages:report.length,overflow:report.filter(x=>x.overflow>2),...structure})+'\n');
 if(external.length) throw new Error('External assets requested: '+external.join(', '));
 if(report.some(x=>x.overflow>2)) throw new Error('Page overflow: '+report.filter(x=>x.overflow>2).map(x=>x.id).join(', '));
 await mkdir('output/pdf',{recursive:true});
 await page.pdf({path:'output/pdf/esol-3b-grammar-reference.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
 process.stdout.write('Saved output/pdf/esol-3b-grammar-reference.pdf\n');
} finally {await browser.close();}
