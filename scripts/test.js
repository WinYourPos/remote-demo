#!/usr/bin/env node
/*
 * Test harness for spark-system.html
 * - Extracts the inline <script>, syntax-checks it
 * - Renders every report against a minimal DOM stub
 * - Simulates pay-and-close to confirm the live reporting update path works
 *
 * Usage:  node scripts/test.js
 * Expect: "JS parses OK", "Reports OK 36/36", "payAndClose OK ..."
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'spark-system.html');
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('No <script> block found.'); process.exit(1); }
let js = m[1];

// 1) syntax check
try { new Function(js); console.log('JS parses OK (' + js.length + ' chars)'); }
catch (e) { console.error('SYNTAX ERROR:', e.message); process.exit(1); }

// 2) minimal DOM stub
const el = () => ({
  innerHTML: '', style: {}, textContent: '', value: '', dataset: {}, children: [],
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  querySelectorAll() { return []; }, querySelector() { return el(); },
  appendChild() {}, closest() { return null; }, onclick: null, oninput: null,
});
global.document = {
  getElementById: el, querySelectorAll: () => [], querySelector: () => el(),
  createElement: el, addEventListener() {},
};
global.window = {};
global.setInterval = () => 0;
global.setTimeout = () => 0;

// 3) append in-scope assertions and run
js += `
;(function(){
  let ok = 0, bad = [];
  REPORTS.forEach(g => g.items.forEach(it => {
    try { const out = it.fn(); if (typeof out !== 'string' || out.length < 10) bad.push(it.id + ' (empty)'); else ok++; }
    catch (e) { bad.push(it.id + ': ' + e.message); }
  }));
  console.log('Reports OK ' + ok + '/' + (ok + bad.length));
  if (bad.length) { console.log('PROBLEMS:\\n - ' + bad.join('\\n - ')); process.exitCode = 1; }

  const before = Math.round(state.rep.netSales);
  state.check = [{ id:'byo', nm:'BYO Burger', st:'grill', base:14, qty:1, mods:[{t:'temp',v:'Medium'}], notes:'', unit:21 }];
  state._sub = 21; state._tot = 22.7;
  try { payAndClose(); console.log('payAndClose OK · netSales ' + before + ' -> ' + Math.round(state.rep.netSales)); }
  catch (e) { console.log('payAndClose ERR: ' + e.message); process.exitCode = 1; }
})();
`;
try { eval(js); }
catch (e) { console.error('RUNTIME ERROR:', e.message); process.exit(1); }
