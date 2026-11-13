#!/usr/bin/env node
/* Regenerates index.html, glossary.html and sources.html from the files in data/.
   The site itself has no build step: this is a convenience so those three pages
   never drift from the data. Run from the repository root:

       node tools/build-pages.js

   Module pages are hand-written HTML and are not touched (a placeholder is
   created only for a module file that does not exist yet). */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

global.window = {};
["modules", "glossary", "sources"].forEach((f) => require(path.join(ROOT, "data", f + ".js")));
const course = window.JEAI_COURSE;
const glossary = window.JEAI_GLOSSARY;
const sources = window.JEAI_SOURCES;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function shell({ title, root, body, moduleN, scripts = [] }) {
  const single = moduleN ? "" : " single";
  const sidebar = moduleN
    ? `<nav id="sidebar" class="sidebar" aria-label="Course contents">
    <ul>
      <li><a href="${root}index.html">Contents</a></li>
      <li><a href="${root}glossary.html">Glossary</a></li>
      <li><a href="${root}sources.html">Sources</a></li>
    </ul>
  </nav>`
    : "";
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${root}assets/css/site.css">
</head>
<body data-root="${root}"${moduleN ? ` data-module="${moduleN}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <a class="brand" href="${root}index.html">${esc(course.shortTitle)}</a>
  ${moduleN ? '<button type="button" id="menu-btn" class="btn secondary menu-btn" hidden>Menu</button>' : `<span class="small"><a href="${root}glossary.html">Glossary</a> &middot; <a href="${root}sources.html">Sources</a></span>`}
</header>
<div class="layout${single}">
  ${sidebar}
  <main id="main">
${body}
    <footer class="page-footer">
      <p>Figures checked ${esc(course.figuresChecked)}. <a href="${root}sources.html">Sources and how prices are shown</a>.</p>
    </footer>
  </main>
</div>
<script src="${root}data/modules.js"></script>
<script src="${root}data/glossary.js"></script>
${scripts.map((s) => `<script src="${root}${s}"></script>`).join("\n")}
<script src="${root}assets/js/site.js"></script>
</body>
</html>
`;
}

/* ---------- index.html ---------- */
function buildIndex() {
  const groups = course.parts.map((part) => {
    const cards = course.modules.filter((m) => m.part === part.id).map((m) => `      <li>
        <a class="card" href="modules/${m.file}" data-card="${m.n}">
          <span class="num">Module ${m.n}</span>
          <span class="title">${esc(m.title)}</span>
          <span class="need-line">You need this if ${esc(m.need)}</span>
          <span class="meta"><span>about 5 min</span><span class="visited" aria-live="polite"></span></span>
        </a>
      </li>`).join("\n");
    return `    <h2 id="part-${part.id.toLowerCase()}">${esc(part.title)}</h2>
${part.note ? `    <p class="part-note">${esc(part.note)}</p>\n` : ""}    <ul class="cards">
${cards}
    </ul>`;
  }).join("\n\n");

  const body = `    <h1>${esc(course.title)}</h1>
    <p class="intro">Eleven short modules, each built around one picture, on what large language models and AI agents are and what it takes to buy or run them. Each takes about five minutes and can be read on its own.</p>
    <p class="intro">Every module also has a closed panel called &ldquo;The detail your technical team handles&rdquo;. It is there to show that the depth exists; you do not need to open it.</p>

${groups}

    <h2 id="reference">Reference</h2>
    <p><a href="glossary.html">Glossary</a> &middot; <a href="sources.html">Sources and how prices are shown</a></p>
    <p><button type="button" id="reset-progress" class="linklike" hidden>Reset progress</button></p>
    <p class="small muted">This course was drafted with AI assistance. Figures were checked on ${esc(course.figuresChecked)}.</p>`;
  fs.writeFileSync(path.join(ROOT, "index.html"), shell({ title: course.title, root: "", body }));
}

/* ---------- glossary.html ---------- */
function buildGlossary() {
  const items = glossary.map((g) => `      <dt id="${g.id}">${esc(g.term)}</dt>
      <dd>${esc(g.short)}${g.more ? " " + esc(g.more) : ""}</dd>`).join("\n");
  const body = `    <p class="eyebrow"><a href="index.html">Contents</a></p>
    <h1>Glossary</h1>
    <p>Each term has one sentence in plain English and, where it helps, one more sentence of precision.</p>
    <dl class="glossary">
${items}
    </dl>`;
  fs.writeFileSync(path.join(ROOT, "glossary.html"), shell({ title: "Glossary — " + course.shortTitle, root: "", body }));
}

/* ---------- sources.html ---------- */
function buildSources() {
  const rows = sources.list.map((s) => `        <tr id="${s.id}">
          <th scope="row">${s.id}</th>
          <td>${esc(s.title)}</td>
          <td>${s.urls.map((u) => `<a href="${esc(u)}" rel="noopener noreferrer">${esc(u)}</a>`).join("<br>")}</td>
        </tr>`).join("\n");
  const body = `    <p class="eyebrow"><a href="index.html">Contents</a></p>
    <h1>Sources and how prices are shown</h1>
    <p>Every price, power and performance figure in this course comes from one of the sources below. All were checked on <strong>${esc(sources.checked)}</strong>. Prices and benchmarks date quickly, so treat every figure as a snapshot.</p>
    <p>This course was drafted with AI assistance. Figures were checked on the date above.</p>

    <h2 id="vat">VAT</h2>
    <p>All UK prices in this course are shown including VAT at 20%, because most public bodies and healthcare providers cannot reclaim VAT on hardware or off-the-shelf software, so the VAT-inclusive price is the real cost to them; organisations able to reclaim VAT will pay one-sixth less.</p>
    <p>Where a source gave an ex-VAT price, or a US dollar list price with no tax, 20% has been added. Where the seller&rsquo;s VAT basis was not stated, it has been assumed to be ex VAT and 20% added; these are marked &ldquo;assumed ex VAT at source&rdquo; next to the figure.</p>

    <h2 id="conversion">Currency conversion</h2>
    <p>Figures marked &ldquo;converted from USD&rdquo; are a US dollar price &times; 0.74 &times; 1.2, rounded. The exchange rate used is $1 = &pound;0.74; the interbank rate was about &pound;0.743 on 6 to 9 November 2026 (<a href="#S20">S20</a>). On pages with prices, select any price to see the original figure and its basis.</p>

    <h2 id="electricity">Electricity</h2>
    <p>Yearly electricity costs use 30p per kWh including VAT as a round illustration. The UK average business rate was 24.14p per kWh ex VAT in Q1 2026 government data, about 29p with VAT; November 2026 quotes were higher (<a href="#S22">S22</a>, <a href="#S23">S23</a>).</p>

    <h2 id="quality">How far to trust these sources</h2>
    <p>Several of these sources are trade blogs and reseller pages, not primary sources. Before relying on a price for a real decision, check it against the vendor or retailer page directly.</p>

    <h2 id="list">Source list</h2>
    <div class="table-wrap">
    <table class="plain">
      <thead><tr><th scope="col">ID</th><th scope="col">Title</th><th scope="col">Address</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>
    </div>`;
  fs.writeFileSync(path.join(ROOT, "sources.html"), shell({ title: "Sources — " + course.shortTitle, root: "", body }));
}

/* ---------- placeholders for modules not yet written ---------- */
function buildPlaceholders() {
  course.modules.forEach((m, i) => {
    const file = path.join(ROOT, "modules", m.file);
    if (fs.existsSync(file)) return;
    const part = course.parts.find((p) => p.id === m.part);
    const prev = course.modules[i - 1], next = course.modules[i + 1];
    const body = `    <p class="eyebrow"><span>Module ${m.n}</span><span>about 5 minutes</span><span class="part">${esc(part.title)}</span></p>
    <h1>${esc(m.title)}</h1>
    <p class="need"><strong>You need this if</strong> ${esc(m.need)}</p>
    <p class="part-note">This module has not been built yet.</p>
    <nav class="pager" aria-label="Previous and next module">
      ${prev ? `<a class="prev" href="${prev.file}"><span>Previous</span>${prev.n}. ${esc(prev.title)}</a>` : ""}
      <a class="contents" href="../index.html">Contents</a>
      ${next ? `<a class="next" href="${next.file}"><span>Next</span>${next.n}. ${esc(next.title)}</a>` : ""}
    </nav>`;
    fs.writeFileSync(file, shell({ title: `${m.n}. ${m.title} — ${course.shortTitle}`, root: "../", body, moduleN: m.n }));
  });
}

buildIndex();
buildGlossary();
buildSources();
buildPlaceholders();
console.log("Built index.html, glossary.html, sources.html");
