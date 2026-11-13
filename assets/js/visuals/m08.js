/* Module 8 visuals: tank, pipe and workers; batching; the hardware ladder with power.
   Speed estimates use assets/js/estimate.js (SPEC 7.7) and are always labelled "rough estimate".
   The CPU case has no sourced bandwidth figure (SPEC 7.6), so it is described in words with no number. */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST;
  if (!J || !H || !E) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });
  function txt(x, y, s, size, cls, anchor) { return svg("text", { x: x, y: y, "font-size": size || 11, "class": cls || "", "text-anchor": anchor || "start", text: s }); }

  /* ---------- Tank, pipe and workers ---------- */
  var host = document.getElementById("tank-body");
  if (host) {
    var SIZES = [4, 8, 12, 27, 35, 70, 120, 200, 400], BITS = 16;
    var st = { size: 3, rung: 0, cpu: false };
    var pic = el("div"), out = el("div", { "class": "readout", role: "status" });
    var sizeIn = el("input", { type: "range", id: "t-size", min: "0", max: String(SIZES.length - 1), step: "1", value: String(st.size) });
    var sizeLab = el("label", { "for": "t-size" });
    var rungSel = el("select", { id: "t-rung" });
    H.rungs.forEach(function (r, i) { rungSel.appendChild(el("option", { value: String(i), text: r.n + ". " + r.name + " (" + r.memory.shown + ", " + r.bandwidth.shown + ")" })); });
    var procSeg = el("div", { "class": "seg" });
    [["gpu", "GPU"], ["cpu", "CPU with ordinary memory"]].forEach(function (o) {
      var input = el("input", { type: "radio", name: "proc", value: o[0] });
      if (o[0] === "gpu") input.checked = true;
      input.addEventListener("change", function () { st.cpu = o[0] === "cpu"; draw(); });
      procSeg.appendChild(el("label", {}, [input, o[1]]));
    });
    sizeIn.addEventListener("input", function () { st.size = +sizeIn.value; draw(); });
    rungSel.addEventListener("change", function () { st.rung = +rungSel.value; draw(); });
    host.appendChild(pic);
    host.appendChild(out);
    host.appendChild(el("div", { "class": "field" }, [sizeLab, sizeIn, el("div", { "class": "ends" }, [el("span", { text: "4B" }), el("span", { text: "400B" })])]));
    host.appendChild(el("div", { "class": "field" }, [el("label", { "for": "t-rung", text: "Machine (sets the tank size and the pipe width)" }), rungSel]));
    host.appendChild(el("div", { "class": "field" }, [el("span", { "class": "lab", text: "Processor" }), procSeg]));

    var draw = function () {
      var params = SIZES[st.size], r = H.rungs[st.rung];
      var size = E.sizeGb(params, BITS), fit = E.fit(size, r.memory.gb);
      var spills = !!(r.est.fastGb && size > r.est.fastGb);
      var bw = st.cpu ? null : (spills ? r.est.slowBandwidthGbs : r.est.bandwidthGbs);
      var tps = st.cpu ? null : E.tokensPerSecond(r, params, params, BITS);
      sizeLab.textContent = "Model size: " + params + " billion parameters (" + E.showGb(size) + " at 16-bit)";

      /* pipe width on a log scale: tens of GB/s (CPU) up to 64,000 GB/s */
      var pipeH = st.cpu ? 5 : 6 + (Math.log10(bw) - 2) / (Math.log10(64000) - 2) * 46;
      var W = 360, Ht = 210, s = svg("svg", { viewBox: "0 0 " + W + " " + Ht, width: 600, height: Ht * 600 / W, role: "img",
        "aria-label": "Tank: " + E.showGb(size) + " model in " + r.memory.shown + " of memory. " + E.FIT_TEXT[fit] + ". Pipe: " +
          (st.cpu ? "narrow, tens of gigabytes per second" : (spills ? "slower memory, " : "") + bw.toLocaleString("en-GB") + " gigabytes per second") +
          ". Processor: " + (st.cpu ? "a CPU, a few large workers." : "a GPU, many small workers.") });
      /* tank */
      s.appendChild(txt(10, 14, "Memory: " + r.memory.shown, 11));
      s.appendChild(svg("rect", { x: 10, y: 20, width: 124, height: 150, rx: 6, "class": "note-pad" }));
      var frac = Math.min(1, size / r.memory.gb), fh = Math.max(4, 146 * frac);
      var pat = J.uid("wp");
      s.appendChild(svg("defs", {}, [svg("pattern", { id: pat, width: 8, height: 8, patternUnits: "userSpaceOnUse" }, [svg("rect", { x: 1, y: 1, width: 6, height: 6, rx: 1, "class": fit === "no" ? "svg-arrowhead" : "svg-weight" })])]));
      s.appendChild(svg("rect", { x: 12, y: 168 - fh, width: 120, height: fh, fill: "url(#" + pat + ")" }));
      s.appendChild(txt(72, 186, "Model: " + E.showGb(size), 11, "", "middle"));
      s.appendChild(txt(72, 201, fit === "no" ? "✕ does not fit" : fit === "tight" ? "! fits, tight" : "✓ fits", 11, "fit-" + fit, "middle"));
      /* pipe */
      var py = 95 - pipeH / 2;
      s.appendChild(svg("rect", { x: 134, y: py, width: 104, height: pipeH, "class": "seg-write" }));
      if (fit !== "no" && pipeH >= 5) s.appendChild(svg("line", { x1: 136, y1: 95, x2: 236, y2: 95, "class": "flow" }));
      s.appendChild(txt(186, 46, "Memory bandwidth", 10, "", "middle"));
      s.appendChild(txt(186, 60, st.cpu ? "tens of GB/s" : bw.toLocaleString("en-GB") + " GB/s", 11, "svg-muted", "middle"));
      if (spills && !st.cpu) s.appendChild(txt(186, 140, "(slower memory)", 10, "svg-muted", "middle"));
      /* processor: a row of workers */
      s.appendChild(txt(244, 14, st.cpu ? "CPU: few large workers" : "GPU: many small", 11));
      s.appendChild(svg("rect", { x: 238, y: 20, width: 114, height: 150, rx: 6, "class": "svg-box" }));
      if (st.cpu) {
        for (var c = 0; c < 4; c++) s.appendChild(svg("rect", { x: 252 + (c % 2) * 46, y: 40 + Math.floor(c / 2) * 58, width: 38, height: 46, rx: 5, "class": "svg-accent" }));
      } else {
        for (var g = 0; g < 96; g++) s.appendChild(svg("rect", { x: 246 + (g % 8) * 12.4, y: 28 + Math.floor(g / 8) * 11.4, width: 9, height: 8, rx: 1.5, "class": "svg-accent" }));
      }
      s.appendChild(txt(295, 186, "Processor", 11, "", "middle"));
      pic.textContent = ""; pic.appendChild(s);

      out.textContent = "";
      out.appendChild(el("p", {}, [el("span", { "class": "fit-" + fit, text: E.FIT_TEXT[fit] + ". " }),
        E.showGb(size) + " in " + r.memory.shown + " of memory."]));
      if (fit === "no") out.appendChild(el("p", { text: "No speed to show: a model that does not fit does not run." }));
      else if (st.cpu) out.appendChild(el("p", { text: "On a CPU with ordinary memory the pipe is far narrower, so the model writes far more slowly. No estimate is shown, because this course has no sourced bandwidth figure for a typical CPU." }));
      else {
        out.appendChild(el("p", {}, [el("span", { "class": "big", text: "About " + E.showSpeed(tps) + " tokens per second" }), " for one user (rough estimate)"]));
        if (spills) out.appendChild(el("p", { "class": "small", text: "The model is too big for this machine’s 252 GB of fast GPU memory, so it runs from the slower memory: a big tank with a narrow pipe." }));
        if (tps > E.CAP) out.appendChild(el("p", { "class": "small", text: "Shown as 100+ because at this speed other limits take over, and it is already faster than anyone can read." }));
      }
    };
    draw();
  }

  /* ---------- Batching: one sweep shared by many users ---------- */
  var batch = document.getElementById("batch-body");
  if (batch) {
    var s2 = svg("svg", { viewBox: "0 0 360 96", width: 600, height: 160, role: "img", "aria-label": "One user: about 8 tokens per second in total. Ten users: about 58 tokens per second in total." });
    var scale = 220 / 58;
    s2.appendChild(txt(8, 26, "1 user", 12)); s2.appendChild(svg("rect", { x: 70, y: 12, width: 8 * scale, height: 20, rx: 2, "class": "seg-write" }));
    s2.appendChild(txt(70 + 8 * scale + 6, 27, "about 8 tokens/s", 11));
    s2.appendChild(txt(8, 64, "10 users", 12));
    for (var u = 0; u < 10; u++) s2.appendChild(svg("rect", { x: 70 + u * 22, y: 50, width: 21, height: 20, rx: 2, "class": "seg-write" }));
    s2.appendChild(txt(70, 88, "about 58 tokens/s in total (one block per user)", 11));
    batch.appendChild(s2);
  }

  /* ---------- Hardware ladder with power and performance ---------- */
  var lad = document.getElementById("ladder-body");
  if (lad) {
    var COMPARE = { 1: "about one old-style 100 W light bulb", 5: "about five electric ovens running flat out" };
    var NOTE = { 2: "None quoted in this course.", 3: "None quoted in this course.",
      5: "No published benchmark was found. The 8 × B200 figure under rung 4 is the nearest evidence; B300 is the newer generation, with more memory." };
    var ol = el("ol", { "class": "rung-cards" });
    H.rungs.forEach(function (r) {
      var pct = Math.max(2, Math.log10(r.electricity.kw * 1000 / 10) / 4 * 100); /* 10 W to 100 kW, log scale */
      var perf = el("ul");
      H.measured.filter(function (m) { return m.rung === r.n && m.modules.indexOf(8) !== -1; }).forEach(function (m) {
        perf.appendChild(el("li", {}, [m.text + " (", J.sourceLinks(m.sourceIds), ")"]));
      });
      var bar = el("div", { "class": "powerbar", "aria-hidden": "true" }, [el("span")]);
      bar.firstChild.style.width = pct + "%";
      ol.appendChild(el("li", {}, [
        el("h4", { text: r.n + ". " + r.name }),
        el("dl", {}, [
          el("dt", { text: "Memory" }), el("dd", { text: r.memory.shown + " (" + r.memory.note + ")" }),
          el("dt", { text: "Bandwidth" }), el("dd", { text: r.bandwidth.shown }),
          el("dt", { text: "Power while generating" }), el("dd", {}, [r.power.shown + (COMPARE[r.n] ? ": " + COMPARE[r.n] : ""), bar]),
          el("dt", { text: "Electricity per year" }), el("dd", { text: r.electricity.shown + " (" + r.electricity.basis + ")" }),
          el("dt", { text: "Measured performance" }), el("dd", {}, [perf.childNodes.length ? perf : NOTE[r.n]])
        ])
      ]));
    });
    lad.appendChild(ol);
  }
})();
