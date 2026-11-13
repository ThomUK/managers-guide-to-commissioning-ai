/* Module 7 visual: the response timeline.
   Phase 1 (prompt processing): all prompt tiles light together; the notepad (KV cache) gains a line per token.
   Phase 2 (token generation): answer tiles appear one at a time; each is one sweep of the weights.
   ILLUSTRATIVE: timings are in made-up units and each tile stands for one token.
   The two quoted speeds are measured (data/hardware.js, "dense27", source S24). */
(function () {
  "use strict";
  var J = window.JEAI, host = document.getElementById("timeline-body");
  if (!J || !host) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var PROMPTS = { short: 8, "long": 20, "very long": 40 };
  var ANSWERS = { short: 6, "long": 14 };
  var state = { prompt: "long", answer: "short", cache: true };

  /* Made-up time units. Reading is one parallel sweep, so it grows only gently with length. */
  function readTime(tokens) { return 0.6 + tokens * 0.03; }
  var WRITE = 0.5;
  function plan(cache) {
    var P = PROMPTS[state.prompt], N = ANSWERS[state.answer], t = readTime(P);
    var segs = [{ kind: "read", from: 0, to: t }];
    for (var k = 0; k < N; k++) {
      if (!cache) { var r = readTime(P + k); segs.push({ kind: "reread", from: t, to: t + r }); t += r; }
      segs.push({ kind: "write", from: t, to: t + WRITE }); t += WRITE;
    }
    return { segs: segs, total: t, first: readTime(P) };
  }
  /* time at which step i ends (step 0 = before anything, 1 = prompt read, 1+k = k tokens written) */
  function timeAt(p, i) {
    if (i === 0) return 0;
    if (i === 1) return p.first;
    var writes = p.segs.filter(function (s) { return s.kind === "write"; });
    return writes[i - 2].to;
  }

  function control(title, name, options, current, onChange) {
    var fs = el("fieldset", { style: "border:0;padding:0;margin:0" }, [el("legend", { "class": "small", style: "font-weight:600;padding:0", text: title })]);
    var seg = el("div", { "class": "seg" });
    options.forEach(function (o) {
      var input = el("input", { type: "radio", name: name, value: o });
      if (o === current) input.checked = true;
      input.addEventListener("change", function () { onChange(o); });
      seg.appendChild(el("label", {}, [input, o.charAt(0).toUpperCase() + o.slice(1)]));
    });
    fs.appendChild(seg);
    return fs;
  }
  var cacheBox = el("input", { type: "checkbox", id: "cache-off" });
  var controls = el("div", { "class": "controls", style: "align-items:flex-end" }, [
    control("Prompt length", "plen", Object.keys(PROMPTS), state.prompt, function (v) { state.prompt = v; reset(); }),
    control("Answer length", "alen", Object.keys(ANSWERS), state.answer, function (v) { state.answer = v; reset(); }),
    el("label", { "for": "cache-off", style: "display:flex;gap:.4em;align-items:center;font-weight:600" }, [cacheBox, "KV cache off (illustrative)"])
  ]);
  cacheBox.addEventListener("change", function () { state.cache = !cacheBox.checked; reset(); });
  var pic = el("div"), say = el("div", { "class": "status", role: "status" });
  host.appendChild(controls);
  host.appendChild(pic);
  host.appendChild(say);

  function txt(x, y, s, size, cls, anchor) { return svg("text", { x: x, y: y, "font-size": size || 11, "class": cls || "", "text-anchor": anchor || "start", text: s }); }

  function bar(s, y, p, scale, label, active, t) {
    s.appendChild(txt(8, y - 5, label, 11, active ? "" : "svg-muted"));
    var g = svg("g", active ? {} : { opacity: .55 });
    p.segs.forEach(function (sg) {
      g.appendChild(svg("rect", { x: 8 + sg.from * scale, y: y, width: Math.max(.6, (sg.to - sg.from) * scale - .4), height: 16,
        "class": sg.kind === "read" ? "seg-read" : sg.kind === "write" ? "seg-write" : "seg-reread" }));
    });
    s.appendChild(g);
    var fx = 8 + p.first * scale;
    s.appendChild(svg("line", { x1: fx, y1: y - 2, x2: fx, y2: y + 22, "class": "svg-arrow", "stroke-width": 1.2 }));
    s.appendChild(txt(fx + 3, y + 28, "time to first token", 9.5, "svg-muted"));
    if (active) s.appendChild(svg("line", { x1: 8 + t * scale, y1: y - 4, x2: 8 + t * scale, y2: y + 20, "class": "playhead" }));
  }

  function render(i) {
    var P = PROMPTS[state.prompt], N = ANSWERS[state.answer];
    var written = Math.max(0, i - 1), read = i >= 1;
    var on = plan(true), off = plan(false), scale = 344 / off.total;
    var W = 360, Hh = 306;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + Hh, width: 620, height: Hh * 620 / W, role: "img",
      "aria-label": i === 0 ? "Before the response starts. " + P + " prompt tokens are waiting."
        : i === 1 ? "Phase one complete: all " + P + " prompt tokens read in one sweep."
        : "Phase two: " + written + " of " + N + " answer tokens written." });

    /* prompt tiles */
    s.appendChild(txt(8, 12, "Prompt (" + P + " tokens)", 11));
    var rereading = !state.cache && i >= 2;
    for (var k = 0; k < P; k++) {
      s.appendChild(svg("rect", { x: 8 + (k % 20) * 11.5, y: 18 + Math.floor(k / 20) * 12, width: 10, height: 10, rx: 2,
        "class": !read ? "tile-dim" : rereading ? "tile-flash" : "tile-lit" }));
    }
    if (rereading) s.appendChild(txt(8, 54, "re-read for every new token", 9.5, "svg-label-theirs"));

    /* weights grid, with a sweep for the newest token */
    s.appendChild(txt(8, 70, "Model weights: one sweep per token written", 11));
    for (var r = 0; r < 4; r++) for (var c = 0; c < 20; c++) {
      s.appendChild(svg("rect", { x: 8 + c * 11.5, y: 76 + r * 11.5, width: 10, height: 10, rx: 1.5, "class": i >= 2 ? "w-lit" : "w-dim" }));
    }
    if (i >= 2) s.appendChild(svg("rect", { x: 8, y: 74, width: 14, height: 48, "class": "sweep" }));

    /* answer tiles */
    s.appendChild(txt(8, 140, "Answer (" + written + " of " + N + " tokens)", 11));
    for (var a = 0; a < N; a++) {
      s.appendChild(svg("rect", { x: 8 + a * 16, y: 146, width: 14, height: 14, rx: 3, "class": a < written ? (a === written - 1 ? "tile-out" : "tile-lit") : "tile-dim" }));
    }

    /* notepad: the KV cache, one line per token read or written */
    var lines = state.cache ? (read ? P + written : 0) : 0;
    s.appendChild(txt(252, 12, "KV cache (notes)", 11));
    s.appendChild(svg("rect", { x: 252, y: 18, width: 100, height: 10 + Math.max(lines, 2) * 2.5, rx: 3, "class": "note-pad" }));
    for (var l = 0; l < lines; l++) s.appendChild(svg("line", { x1: 258, y1: 24 + l * 2.5, x2: 346 - (l % 3) * 8, y2: 24 + l * 2.5, "class": "note-line" }));
    s.appendChild(txt(252, 42 + Math.max(lines, 2) * 2.5, state.cache ? lines + (lines === 1 ? " line" : " lines") : "off: no notes kept", 9.5, "svg-muted"));

    /* two timelines, drawn to the same scale */
    bar(s, 196, on, scale, "With KV cache", state.cache, timeAt(on, i));
    bar(s, 256, off, scale, "Without KV cache (illustrative)", !state.cache, timeAt(off, i));
    /* key */
    s.appendChild(svg("rect", { x: 8, y: 293, width: 10, height: 8, "class": "seg-read" })); s.appendChild(txt(21, 300, "read prompt", 9.5));
    s.appendChild(svg("rect", { x: 88, y: 293, width: 10, height: 8, "class": "seg-write" })); s.appendChild(txt(101, 300, "write one token", 9.5));
    s.appendChild(svg("rect", { x: 186, y: 293, width: 10, height: 8, "class": "seg-reread" })); s.appendChild(txt(199, 300, "re-read everything so far", 9.5));

    pic.textContent = ""; pic.appendChild(s);

    say.textContent = "";
    if (i === 0) say.appendChild(el("p", { text: "Ready. The prompt has arrived; nothing has been read yet." }));
    else if (i === 1) {
      say.appendChild(el("p", {}, [el("strong", { text: "Phase 1: prompt processing. " }), "All " + P + " tokens are read together in one sweep" +
        (state.cache ? ", and the notepad gains a line for each." : ". With the cache off, no notes are kept.") + " This moment is the time to first token."]));
      say.appendChild(el("p", { "class": "small muted", text: "Measured example: about 1,900 tokens per second read." }));
    } else {
      say.appendChild(el("p", {}, [el("strong", { text: "Phase 2: token generation. " }), "Token " + written + " of " + N + ". " +
        (state.cache ? "One sweep of the weights, one more line on the notepad." : "With no notes, the model re-reads the whole prompt and its answer so far, then writes one token.")]));
      say.appendChild(el("p", { "class": "small muted", text: "Measured example: about 8 tokens per second written." }));
    }
  }

  var ctl = J.stepper(host, {
    steps: function () { return 2 + ANSWERS[state.answer]; },
    interval: function (i) { return i === 0 ? 700 : state.cache ? 550 : 1300; },
    onStep: render
  });
  function reset() { ctl.stop(); ctl.go(0); }
})();
