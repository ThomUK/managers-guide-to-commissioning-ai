/* Module 9 visual: weights lighting up, dense against MoE.
   ILLUSTRATIVE: twelve experts with two chosen per token is a simplification.
   Both models are 35 billion parameters at 16-bit on rung 1; the MoE model has 3 billion active.
   Speeds come from assets/js/estimate.js and are labelled "rough estimate". */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST, host = document.getElementById("lighting-body");
  if (!J || !H || !E || !host) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var TOKENS = ["The", " report", " is", " ready", " for", " review", "."];
  var PICKS = [[2, 9], [0, 5], [7, 9], [3, 10], [1, 5], [4, 11], [6, 2]]; /* which two experts light for each token */
  var TOTAL = 35, ACTIVE = 3, BITS = 16, rung = H.rungs[0];
  var mem = E.showGb(E.sizeGb(TOTAL, BITS));
  var FACTS = {
    dense: { read: E.showGb(E.readPerTokenGb(TOTAL, BITS)), tps: E.showSpeed(E.tokensPerSecond(rung, TOTAL, TOTAL, BITS)) },
    moe:   { read: E.showGb(E.readPerTokenGb(ACTIVE, BITS)), tps: E.showSpeed(E.tokensPerSecond(rung, TOTAL, ACTIVE, BITS)) }
  };

  function grid(kind, step) {
    var lit = step > 0, picks = lit ? PICKS[step - 1] : [];
    var s = svg("svg", { viewBox: "0 0 170 152", width: 240, height: 215, role: "img",
      "aria-label": kind === "dense" ? (lit ? "Dense model: the whole grid is lit." : "Dense model: waiting.")
        : (lit ? "MoE model: experts " + (picks[0] + 1) + " and " + (picks[1] + 1) + " of 12 are lit." : "MoE model: waiting.") });
    if (kind === "moe") {
      s.appendChild(svg("rect", { x: 45, y: 2, width: 80, height: 18, rx: 9, "class": "svg-pill" + (lit ? " on" : "") }));
      s.appendChild(svg("text", { x: 85, y: 15, "font-size": 10, "text-anchor": "middle", "class": lit ? "svg-on-accent" : "", text: lit ? "Router: " + (picks[0] + 1) + " and " + (picks[1] + 1) : "Router" }));
    } else {
      s.appendChild(svg("text", { x: 85, y: 15, "font-size": 10, "text-anchor": "middle", "class": "svg-muted", text: "No router: everything is used" }));
    }
    for (var b = 0; b < 12; b++) {
      var dense = kind === "dense";
      var bx = dense ? 19 + (b % 4) * 33 : 7 + (b % 4) * 40, by = dense ? 28 + Math.floor(b / 4) * 33 : 28 + Math.floor(b / 4) * 42, on = kind === "dense" ? lit : picks.indexOf(b) !== -1;
      if (kind === "moe") s.appendChild(svg("rect", { x: bx - 2, y: by - 2, width: 37, height: 39, rx: 4, "class": on ? "svg-accent-soft" : "svg-pill" }));
      for (var i = 0; i < 9; i++) {
        s.appendChild(svg("rect", { x: bx + (i % 3) * 11, y: by + Math.floor(i / 3) * (kind === "moe" ? 8.6 : 11), width: 9, height: kind === "moe" ? 7 : 9, rx: 1.5, "class": on ? "w-lit" : "w-dim" }));
      }
      if (kind === "moe") s.appendChild(svg("text", { x: bx + 16.5, y: by + 34.5, "font-size": 8, "text-anchor": "middle", "class": on ? "" : "svg-muted", text: "E" + (b + 1) }));
    }
    return s;
  }
  function facts(kind) {
    var f = FACTS[kind];
    return el("dl", { "class": "rungs-facts", style: "display:grid;grid-template-columns:auto 1fr;gap:.15em .8em;margin:.4em 0 0;font-size:.92rem" }, [
      el("dt", { "class": "muted", text: "Memory needed" }), el("dd", { style: "margin:0", text: mem }),
      el("dt", { "class": "muted", text: "Read per token" }), el("dd", { style: "margin:0;font-weight:700", text: f.read }),
      el("dt", { "class": "muted", text: "Rough estimate" }), el("dd", { style: "margin:0;font-weight:700", text: "about " + f.tps + " tokens per second" })
    ]);
  }

  var strip = el("div", { "class": "tok-strip", "aria-live": "polite" });
  var densePic = el("div"), moePic = el("div"), say = el("div", { "class": "status", role: "status" });
  host.appendChild(el("p", { "class": "small", style: "margin:0", text: "Both models are writing the same sentence:" }));
  host.appendChild(strip);
  host.appendChild(el("div", { "class": "two-col" }, [
    el("div", {}, [el("h3", { "class": "vis-title", text: "Dense: 35B" }), densePic, facts("dense")]),
    el("div", {}, [el("h3", { "class": "vis-title", text: "MoE: 35B-A3B" }), moePic, facts("moe")])
  ]));
  host.appendChild(say);
  J.stepper(host, {
    steps: TOKENS.length + 1, interval: 1500,
    onStep: function (i) {
      strip.textContent = "";
      TOKENS.forEach(function (t, k) { strip.appendChild(el("span", { "class": "tok" + (k >= i ? " out" : k === i - 1 ? " new" : ""), style: k >= i ? "text-decoration:none" : "", text: t })); });
      densePic.textContent = ""; densePic.appendChild(grid("dense", i));
      moePic.textContent = ""; moePic.appendChild(grid("moe", i));
      say.textContent = i === 0 ? "Ready. Both models are loaded in full and take the same memory."
        : "Token " + i + " of " + TOKENS.length + ": the dense model reads all of its weights. The MoE model’s router picks experts " +
          (PICKS[i - 1][0] + 1) + " and " + (PICKS[i - 1][1] + 1) + " and reads only those.";
    }
  });
})();
