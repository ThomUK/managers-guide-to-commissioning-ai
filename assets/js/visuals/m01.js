/* Module 1 visuals: the next-token predictor, and the token strip with a context window.
   ILLUSTRATIVE: the candidates and probabilities below are a small hand-written table. */
(function () {
  "use strict";
  var J = window.JEAI;
  if (!J) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  /* Each state lists candidate next tokens: [text, probability, next state]. */
  var STEM = ["The", " patient", " was", " dis", "charged", " from", " the"];
  var T = {
    start: [[" hospital", .48, "place"], [" ward", .22, "place"], [" clinic", .12, "place"], [" unit", .08, "place"], [" emergency", .06, "emerg"], [" army", .04, "army"]],
    emerg: [[" department", .85, "place"], [" room", .09, "place"], [" unit", .04, "place"], [" ward", .02, "place"]],
    army:  [[" in", .50, "year"], [" after", .25, "after"], [" with", .15, "with"], [" and", .10, "and"]],
    place: [[" yesterday", .30, "end"], [" on", .24, "day"], [" after", .18, "after"], [" with", .12, "with"], [" and", .10, "and"], [".", .06, "END"]],
    year:  [[" 1945", .35, "end"], [" 1946", .20, "end"], [" 1919", .15, "end"], [" March", .15, "end"], [" May", .15, "end"]],
    day:   [[" Monday", .30, "end"], [" Friday", .26, "end"], [" Tuesday", .18, "end"], [" Wednesday", .14, "end"], [" Sunday", .12, "end"]],
    after: [[" three", .28, "days"], [" two", .26, "days"], [" a", .20, "a"], [" five", .14, "days"], [" surgery", .12, "end"]],
    days:  [[" days", .62, "end"], [" weeks", .25, "end"], [" nights", .08, "end"], [" months", .05, "end"]],
    a:     [[" week", .40, "end"], [" short", .25, "stay"], [" fortnight", .15, "end"], [" successful", .12, "op"], [" month", .08, "end"]],
    stay:  [[" stay", .80, "end"], [" illness", .15, "end"], [" admission", .05, "end"]],
    op:    [[" operation", .70, "end"], [" recovery", .20, "end"], [" procedure", .10, "end"]],
    "with": [[" a", .40, "witha"], [" instructions", .25, "end"], [" medication", .20, "end"], [" antibiotics", .15, "end"]],
    witha: [[" prescription", .40, "end"], [" follow", .30, "followup"], [" care", .20, "plan"], [" letter", .10, "end"]],
    followup: [["-up", .92, "appt"], [" on", .08, "appt"]],
    appt:  [[" appointment", .80, "end"], [" visit", .15, "end"], [" call", .05, "end"]],
    plan:  [[" plan", .90, "end"], [" package", .10, "end"]],
    and:   [[" sent", .35, "home"], [" went", .30, "home"], [" returned", .20, "home"], [" is", .15, "now"]],
    home:  [[" home", .85, "end"], [" back", .15, "end"]],
    now:   [[" recovering", .50, "end"], [" well", .30, "end"], [" resting", .20, "end"]],
    end:   [[".", .88, "END"], [",", .12, "comma"]],
    comma: [[" and", .60, "and"], [" with", .40, "with"]]
  };
  var MAX_ADDED = 16;

  var host = document.getElementById("predictor-body");
  if (host) {
    var state = "start", added = [], temp = 1;
    var strip = el("div", { "class": "tok-strip", "aria-live": "polite" });
    var chart = el("div");
    var pick = el("button", { type: "button", "class": "btn", text: "Pick next token" });
    var restart = el("button", { type: "button", "class": "btn secondary", text: "Restart" });
    var slider = el("input", { type: "range", min: "0", max: "100", value: "50", id: "temp", "aria-label": "From more predictable to more varied" });
    var note = el("p", { "class": "small muted", role: "status" });
    host.appendChild(strip);
    host.appendChild(el("p", { "class": "small", id: "chart-title", text: "Candidates for the next token, and how likely the model thinks each one is:" }));
    host.appendChild(chart);
    host.appendChild(el("div", { "class": "slider-row" }, [
      el("label", { "for": "temp", text: "More predictable" }), slider, el("span", { text: "More varied" })
    ]));
    host.appendChild(el("div", { "class": "controls" }, [pick, restart]));
    host.appendChild(note);

    /* Slider 0..100 maps to temperature 0.3..2.5 (50 = 1.0, the table as written). */
    function temperature() {
      var v = +slider.value;
      return v <= 50 ? 0.3 + (v / 50) * 0.7 : 1 + ((v - 50) / 50) * 1.5;
    }
    function dist() {
      var c = T[state] || [], t = temperature();
      var w = c.map(function (x) { return Math.pow(x[1], 1 / t); });
      var sum = w.reduce(function (a, b) { return a + b; }, 0);
      return c.map(function (x, i) { return { tok: x[0], p: w[i] / sum, next: x[2] }; });
    }
    function draw() {
      strip.textContent = "";
      STEM.forEach(function (t) { strip.appendChild(el("span", { "class": "tok", text: t })); });
      added.forEach(function (t, i) {
        strip.appendChild(el("span", { "class": "tok" + (i === added.length - 1 ? " new" : ""), text: t }));
      });
      chart.textContent = "";
      var finished = state === "END" || added.length >= MAX_ADDED;
      pick.disabled = finished;
      if (finished) {
        note.textContent = "The sentence has ended. Press Restart and you will probably get a different one.";
        return;
      }
      note.textContent = added.length ? "Added “" + added[added.length - 1].trim() + "”. The candidates are now for the next position." : "";
      var d = dist(), rowH = 28, W = 360, labelW = 118, barW = 180;
      var s = svg("svg", { viewBox: "0 0 " + W + " " + (d.length * rowH + 4), role: "img", width: 520, height: (d.length * rowH + 4) * 520 / W,
        "aria-label": "Candidates: " + d.map(function (x) { return x.tok.trim() + " " + Math.round(x.p * 100) + " per cent"; }).join(", ") });
      d.forEach(function (x, i) {
        var y = i * rowH + 4;
        s.appendChild(svg("text", { x: labelW - 8, y: y + 15, "text-anchor": "end", "font-size": 13, "font-family": "ui-monospace, Menlo, Consolas, monospace", text: x.tok.trim() }));
        s.appendChild(svg("rect", { x: labelW, y: y, width: barW, height: 20, rx: 3, "class": "svg-bar-track" }));
        s.appendChild(svg("rect", { x: labelW, y: y, width: Math.max(1.5, barW * x.p), height: 20, rx: 3, "class": "svg-bar" }));
        s.appendChild(svg("text", { x: labelW + barW + 8, y: y + 15, "font-size": 13, text: Math.round(x.p * 100) + "%" }));
      });
      chart.appendChild(s);
    }
    pick.addEventListener("click", function () {
      var d = dist(), r = Math.random(), acc = 0, chosen = d[d.length - 1];
      for (var i = 0; i < d.length; i++) { acc += d[i].p; if (r < acc) { chosen = d[i]; break; } }
      added.push(chosen.tok);
      state = chosen.next;
      draw();
    });
    restart.addEventListener("click", function () { state = "start"; added = []; draw(); });
    slider.addEventListener("input", draw);
    draw();
  }

  /* ---------- Token strip and context window ---------- */
  var win = document.getElementById("window-body");
  if (win) {
    var TOKENS = ["Thank", " you", " for", " your", " email", ".", " Un", "fortun", "ately", " the", " inv", "oice", " was", " dup", "licated", " in", " our", " system", ",", " so", " the", " re", "minder", " was", " sent", " in", " error", "."];
    var tiles = el("div", { "class": "tok-strip" });
    var ws = el("input", { type: "range", min: "6", max: String(TOKENS.length), value: "16", id: "winsize" });
    var msg = el("p", { "class": "small", role: "status" });
    win.appendChild(tiles);
    win.appendChild(el("div", { "class": "slider-row" }, [el("label", { "for": "winsize", text: "Context window: smaller" }), ws, el("span", { text: "larger" })]));
    win.appendChild(msg);
    var drawWin = function () {
      var n = +ws.value, cut = TOKENS.length - n;
      tiles.textContent = "";
      TOKENS.forEach(function (t, i) { tiles.appendChild(el("span", { "class": "tok" + (i < cut ? " out" : ""), text: t })); });
      msg.textContent = "This passage is " + TOKENS.length + " tokens. The window holds the most recent " + n + "." +
        (cut > 0 ? " The first " + cut + " (struck through) are outside it: the model cannot see them." : " All of it is in view.");
    };
    ws.addEventListener("input", drawWin);
    drawWin();
  }
})();
