/* Module 6 visual: model blocks dropping into memory bars.
   Size in GB = parameters (billions) x bits / 8, at 16 bits. Memory figures from data/hardware.js. */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST, host = document.getElementById("fit-body");
  if (!J || !H || !E || !host) return;
  var el = J.el;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var MODELS = [4, 12, 27, 70, 120, 400, 2000], BITS = 16, chosen = 27;
  /* ILLUSTRATIVE ASSUMPTION: the makers of the leading hosted ("frontier") models do not publish
     their sizes. 2,000 billion (2 trillion) is used only to show the scale involved. */
  var FRONTIER = 2000;
  var SYMBOL = { spare: "✓ ", tight: "! ", no: "✕ " };

  var picker = el("fieldset", { style: "border:0;padding:0;margin:0" }, [
    el("legend", { "class": "vis-title", style: "font-weight:700;padding:0", text: "Model size (billions of parameters)" })
  ]);
  var seg = el("div", { "class": "seg" });
  MODELS.forEach(function (m) {
    var input = el("input", { type: "radio", name: "model", value: String(m) });
    if (m === chosen) input.checked = true;
    input.addEventListener("change", function () { chosen = m; draw(); });
    seg.appendChild(el("label", {}, [input, m === FRONTIER ? "2,000B (frontier scale, assumed)" : m + "B"]));
  });
  picker.appendChild(seg);
  /* Precision: 16-bit is how models are normally published; 8 and 4 are quantised (module 10). */
  var QUANT = {
    16: "",
    8: "Quantised to 8 bits: half the size. Generally very close to the original in quality.",
    4: "Quantised to 4 bits: a quarter of the size. Generally a small loss of quality."
  };
  var precision = el("fieldset", { style: "border:0;padding:0;margin:.7em 0 0" }, [
    el("legend", { "class": "vis-title", style: "font-weight:700;padding:0", text: "Each number stored in" })
  ]);
  var pseg = el("div", { "class": "seg" });
  [[16, "16 bits (original)"], [8, "8 bits"], [4, "4 bits"]].forEach(function (o) {
    var input = el("input", { type: "radio", name: "bits", value: String(o[0]) });
    if (o[0] === BITS) input.checked = true;
    input.addEventListener("change", function () { BITS = o[0]; draw(); });
    pseg.appendChild(el("label", {}, [input, o[1]]));
  });
  precision.appendChild(pseg);
  var sum = el("p", { "class": "readout", role: "status" });
  var list = el("ol", { "class": "machines" });
  host.appendChild(picker);
  host.appendChild(precision);
  host.appendChild(sum);
  host.appendChild(list);

  /* A reference point below the ladder. ILLUSTRATIVE: 32 GB is a typical figure, not a sourced one. */
  var OFFICE = { ordinary: true, name: "Ordinary office computer (not built for AI)",
    memory: { gb: 32, shown: "32 GB" }, memoryLabel: "32 GB of ordinary memory (slow; not GPU memory)" };

  /* Build each machine row once, then update it, so the fill can animate. */
  var rows = [OFFICE].concat(H.rungs).map(function (r) {
    var fill = el("span", { "class": "fill" }), head = el("span", { "class": "headroom", title: "15% working space" });
    var bar = el("div", { "class": "membar", "aria-hidden": "true" }, [fill, head]);
    if (r.memory.fastGb) {
      var split = el("span", { "class": "split" });
      split.style.left = (r.memory.fastGb / r.memory.gb * 100) + "%";
      bar.appendChild(split);
    }
    var result = el("div", { "class": "result" });
    list.appendChild(el("li", {}, [
      el("div", { "class": "name" }, [el("strong", { text: r.ordinary ? r.name : r.n + ". " + r.name + (r.n === 1 ? " (the practical entry point)" : "") }),
        el("span", { text: r.memoryLabel || r.memory.shown + " of memory" })]),
      bar, result
    ]));
    return { rung: r, fill: fill, head: head, result: result };
  });

  function draw() {
    var size = E.sizeGb(chosen, BITS);
    sum.textContent = "";
    sum.appendChild(document.createTextNode(chosen.toLocaleString("en-GB") + " billion parameters × " + BITS + " bits ÷ 8 = " + E.showGb(size)));
    if (QUANT[BITS]) sum.appendChild(el("span", { "class": "small", style: "display:block;margin-top:.3em", text: QUANT[BITS] }));
    if (chosen === FRONTIER) sum.appendChild(el("span", { "class": "small", style: "display:block;margin-top:.3em", text:
      "An assumption for illustration: the makers of the leading hosted models do not publish their sizes. A vendor also runs many copies at once to serve its customers."
    }));
    rows.forEach(function (row) {
      var mem = row.rung.memory.gb, f = E.fit(size, mem), pct = Math.min(100, size / mem * 100);
      row.fill.style.width = pct + "%";
      row.fill.className = "fill" + (f === "no" ? " over" : "");
      row.head.style.left = pct + "%";
      row.head.style.width = f === "no" ? "0%" : Math.min(100 - pct, pct * (E.HEADROOM - 1)) + "%";
      row.result.textContent = "";
      row.result.appendChild(el("span", { "class": "fit-" + f, text: SYMBOL[f] + E.FIT_TEXT[f] + ". " }));
      var note = f === "no" ? "Needs " + E.showGb(size) + "; the machine has " + row.rung.memory.shown + "."
        : "Uses " + Math.round(size / mem * 100) + "% of memory" + (f === "tight" ? ", leaving too little working space." : ".");
      if (row.rung.memory.fastGb && f !== "no") {
        note += size > row.rung.memory.fastGb ? " It spills past the dashed line into this machine’s slower memory." : " It sits within the fast GPU memory, left of the dashed line.";
      }
      if (f === "no" && row.rung.n === 5) {
        var need = Math.ceil(size * E.HEADROOM / mem);
        note += " One copy would need " + (need === 2 ? "two" : need) + " of these servers working together.";
      }
      if (row.rung.ordinary && f !== "no") note += " But this is ordinary memory, not GPU memory, so the model would write slowly.";
      row.result.appendChild(document.createTextNode(note));
    });
  }
  draw();
})();
