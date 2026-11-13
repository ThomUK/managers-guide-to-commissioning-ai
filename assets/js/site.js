/* Just Enough AI: shared behaviour.
   Sidebar, progress ticks, glossary tooltips, cost chips, check questions, stepper.
   Everything here enhances HTML that is already readable without JavaScript. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.body.getAttribute("data-root") || "";
  var course = window.JEAI_COURSE || { modules: [], parts: [] };
  var STORE_KEY = "jeai-visited";
  doc.documentElement.classList.add("js");

  function el(tag, attrs, children) {
    var node = doc.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === "string" ? doc.createTextNode(c) : c);
    });
    return node;
  }

  /* ---------- Progress (localStorage, always guarded) ---------- */
  function getVisited() {
    try {
      var v = JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function setVisited(list) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  function markVisited(n) {
    var v = getVisited();
    if (v.indexOf(n) === -1) { v.push(n); setVisited(v); }
  }

  /* ---------- Sidebar ---------- */
  var current = parseInt(doc.body.getAttribute("data-module"), 10) || null;
  if (current) markVisited(current);

  function renderSidebar() {
    var nav = doc.getElementById("sidebar");
    if (!nav || !course.modules.length) return;
    var visited = getVisited();
    nav.textContent = "";
    nav.appendChild(el("ul", {}, [
      el("li", {}, [el("a", { href: root + "index.html", text: "Contents" })])
    ]));
    course.parts.forEach(function (part) {
      nav.appendChild(el("h2", { text: part.title }));
      var ol = el("ol");
      course.modules.filter(function (m) { return m.part === part.id; }).forEach(function (m) {
        var a = el("a", { href: root + "modules/" + m.file }, [
          el("span", { "class": "num", text: m.n + "." }),
          el("span", { text: m.title })
        ]);
        if (m.n === current) a.setAttribute("aria-current", "page");
        if (visited.indexOf(m.n) !== -1) {
          a.appendChild(el("span", { "class": "tick", title: "Visited", "aria-label": "visited", text: "✓" }));
        }
        ol.appendChild(el("li", {}, [a]));
      });
      nav.appendChild(ol);
    });
    nav.appendChild(el("h2", { text: "Reference" }));
    nav.appendChild(el("ul", {}, [
      el("li", {}, [el("a", { href: root + "glossary.html", text: "Glossary" })]),
      el("li", {}, [el("a", { href: root + "sources.html", text: "Sources" })])
    ]));
  }
  renderSidebar();

  var menuBtn = doc.getElementById("menu-btn");
  var sidebar = doc.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.hidden = false;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-controls", "sidebar");
    menuBtn.addEventListener("click", function () {
      var open = sidebar.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Contents page: visited ticks and reset ---------- */
  function renderCardTicks() {
    var visited = getVisited();
    doc.querySelectorAll("[data-card]").forEach(function (card) {
      var n = parseInt(card.getAttribute("data-card"), 10);
      var slot = card.querySelector(".visited");
      if (slot) slot.textContent = visited.indexOf(n) !== -1 ? "✓ Visited" : "";
    });
  }
  renderCardTicks();
  var reset = doc.getElementById("reset-progress");
  if (reset) {
    reset.hidden = false;
    reset.addEventListener("click", function () {
      setVisited([]);
      renderCardTicks();
      reset.textContent = "Progress reset";
    });
  }

  /* ---------- Popovers (shared by glossary tooltips and cost chips) ---------- */
  var openPop = null;
  function closePop() {
    if (!openPop) return;
    openPop.pop.hidden = true;
    if (openPop.trigger.hasAttribute("aria-expanded")) openPop.trigger.setAttribute("aria-expanded", "false");
    openPop = null;
  }
  function attachPop(trigger, pop) {
    var wrap = el("span", { "class": "pop-wrap" });
    trigger.parentNode.insertBefore(wrap, trigger);
    wrap.appendChild(trigger);
    wrap.appendChild(pop);
    pop.classList.add("pop");
    pop.hidden = true;
    var timer = null;
    function show() {
      clearTimeout(timer);
      if (openPop && openPop.pop !== pop) closePop();
      pop.hidden = false;
      pop.style.left = "0px";
      var r = pop.getBoundingClientRect();
      var vw = doc.documentElement.clientWidth;
      var shift = 0;
      if (r.right > vw - 8) shift = vw - 8 - r.right;
      if (r.left + shift < 8) shift = 8 - r.left;
      pop.style.left = shift + "px";
      if (trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", "true");
      openPop = { pop: pop, trigger: trigger, wrap: wrap };
    }
    function hideSoon() { timer = setTimeout(function () { if (openPop && openPop.pop === pop) closePop(); }, 180); }
    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", hideSoon);
    wrap.addEventListener("focusin", show);
    wrap.addEventListener("focusout", function (e) { if (!wrap.contains(e.relatedTarget)) hideSoon(); });
    if (trigger.tagName === "BUTTON") trigger.addEventListener("click", show);
    return wrap;
  }
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
  doc.addEventListener("click", function (e) { if (openPop && !openPop.wrap.contains(e.target)) closePop(); });

  /* Glossary tooltips: any <a class="term" href="…glossary.html#id"> */
  var glossary = {};
  (window.JEAI_GLOSSARY || []).forEach(function (g) { glossary[g.id] = g; });
  var tipCount = 0;
  doc.querySelectorAll("a.term").forEach(function (a) {
    var id = (a.getAttribute("href") || "").split("#")[1];
    var g = glossary[id];
    if (!g) return;
    var tip = el("span", { role: "tooltip", id: "tip-" + (++tipCount), text: g.short });
    a.setAttribute("aria-describedby", tip.id);
    attachPop(a, tip);
  });

  /* ---------- Sources ---------- */
  function sourceLinks(ids) {
    var span = el("span");
    (ids || []).forEach(function (id, i) {
      if (i) span.appendChild(doc.createTextNode(", "));
      span.appendChild(el("a", { href: root + "sources.html#" + id, text: id }));
    });
    return span;
  }
  /* Figure stamp: "Illustrative" or "Source: …, checked <date>" */
  function stamp(opts) {
    var p = el("p", { "class": "stamp" });
    if (opts.illustrative) {
      p.appendChild(el("span", { "class": "illus", text: "Illustrative. " }));
      if (opts.text) p.appendChild(doc.createTextNode(opts.text + " "));
    }
    if (opts.sourceIds && opts.sourceIds.length) {
      p.appendChild(doc.createTextNode(opts.sourceIds.length > 1 ? "Sources: " : "Source: "));
      p.appendChild(sourceLinks(opts.sourceIds));
      p.appendChild(doc.createTextNode(". Checked " + course.figuresChecked + "."));
    }
    return p;
  }

  /* Cost chip: a price inc VAT; on hover, focus or tap shows the original figure, basis and source */
  function chip(shown, info) {
    var holder = el("span");
    var btn = el("button", { type: "button", "class": "chip", "aria-expanded": "false", text: shown });
    btn.setAttribute("aria-label", shown + " including VAT. Show original figure and source.");
    var pop = el("span", {}, [
      el("p", {}, [el("strong", { text: "Shown: " }), shown + " including VAT"]),
      info.product ? el("p", {}, [el("strong", { text: "Product: " }), info.product]) : null,
      el("p", {}, [el("strong", { text: "Original figure: " }), info.original]),
      el("p", {}, [el("strong", { text: "Basis: " }), info.basis]),
      el("p", {}, [el("strong", { text: "Source: " }), sourceLinks(info.sourceIds), ", checked " + course.figuresChecked])
    ]);
    holder.appendChild(btn);
    attachPop(btn, pop);
    return holder.firstChild;
  }

  /* ---------- Check questions ---------- */
  doc.querySelectorAll(".check").forEach(function (box) {
    var fallback = box.querySelector(".answer");
    var explain = box.getAttribute("data-explain") || "";
    if (fallback) fallback.hidden = true;
    var btn = el("button", { type: "button", "class": "btn", text: "Check" });
    var fb = el("p", { "class": "feedback", role: "status", hidden: "" });
    box.appendChild(btn);
    box.appendChild(fb);
    btn.addEventListener("click", function () {
      var picked = box.querySelector("input[type=radio]:checked");
      fb.hidden = false;
      fb.className = "feedback";
      if (!picked) { fb.textContent = "Choose an answer first."; return; }
      var right = picked.hasAttribute("data-correct");
      fb.classList.add(right ? "right" : "wrong");
      fb.textContent = (right ? "Correct. " : "Not quite. ") + explain;
    });
  });

  /* ---------- Stepper: Play, Pause, Step, Restart; "Step n of m" ---------- */
  function stepper(container, opts) {
    /* opts.steps: number, or a function returning one (when the length can change).
       opts.interval: milliseconds, or a function of the step index.
       opts.canAdvance(i): return false to hold the stepper at step i. */
    var i = 0, timer = null;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var play = el("button", { type: "button", "class": "btn", text: "Play" });
    var step = el("button", { type: "button", "class": "btn secondary", text: reduced ? "Next step" : "Step" });
    var restart = el("button", { type: "button", "class": "btn secondary", text: "Restart" });
    var count = el("span", { "class": "count", role: "status" });
    var bar = el("div", { "class": "stepper" }, [reduced ? null : play, step, restart, count]);
    container.appendChild(bar);
    function total() { return typeof opts.steps === "function" ? opts.steps() : opts.steps; }
    function delay() { return typeof opts.interval === "function" ? opts.interval(i) : (opts.interval || 2200); }
    function blocked() { return opts.canAdvance ? !opts.canAdvance(i) : false; }
    function stop() { clearTimeout(timer); timer = null; play.textContent = "Play"; }
    function buttons() {
      var end = i >= total() - 1 || blocked();
      if (end && timer) stop();
      step.disabled = end;
      play.disabled = end;
    }
    function draw() {
      count.textContent = "Step " + (i + 1) + " of " + total();
      opts.onStep(i);
      buttons();
    }
    function go(n) { i = Math.max(0, Math.min(total() - 1, n)); draw(); }
    function tick() { timer = setTimeout(function () { go(i + 1); if (timer) tick(); }, delay()); }
    play.addEventListener("click", function () {
      if (timer) { stop(); return; }
      play.textContent = "Pause";
      tick();
    });
    step.addEventListener("click", function () { stop(); go(i + 1); });
    restart.addEventListener("click", function () { stop(); go(0); });
    draw();
    return { go: go, stop: stop, refresh: buttons, index: function () { return i; }, reduced: reduced };
  }

  /* ---------- Print: open every detail panel ---------- */
  var reopened = [];
  window.addEventListener("beforeprint", function () {
    doc.querySelectorAll("details:not([open])").forEach(function (d) { d.open = true; reopened.push(d); });
  });
  window.addEventListener("afterprint", function () {
    reopened.forEach(function (d) { d.open = false; });
    reopened = [];
  });

  var svgCount = 0;
  window.JEAI = {
    el: el, root: root, chip: chip, stamp: stamp, sourceLinks: sourceLinks, stepper: stepper,
    svg: function (tag, attrs, children) {
      var node = doc.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.keys(attrs || {}).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k]; else node.setAttribute(k, attrs[k]);
      });
      (children || []).forEach(function (c) { if (c) node.appendChild(c); });
      return node;
    },
    uid: function (prefix) { return prefix + "-" + (++svgCount); }
  };
})();
