/* Module 6 visual: model blocks dropping into memory bars.
   Size in GB = parameters (billions) x bits / 8, at 16 bits. Memory figures from data/hardware.js. */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST, host = document.getElementById("fit-body");
  if (!J || !H || !E || !host) return;
  var el = J.el;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var MODELS = [4, 12, 27, 70, 120, 400], BITS = 16, chosen = 27;
  var SYMBOL = { spare: "✓ ", tight: "! ", no: "✕ " };

  var picker = el("fieldset", { style: "border:0;padding:0;margin:0" }, [
    el("legend", { "class": "vis-title", style: "font-weight:700;padding:0", text: "Model size (billions of parameters)" })
  ]);
  var seg = el("div", { "class": "seg" });
  MODELS.forEach(function (m) {
    var input = el("input", { type: "radio", name: "model", value: String(m) });
    if (m === chosen) input.checked = true;
    input.addEventListener("change", function () { chosen = m; draw(); });
    seg.appendChild(el("label", {}, [input, m + "B"]));
  });
  picker.appendChild(seg);
  var sum = el("p", { "class": "readout", role: "status" });
  var list = el("ol", { "class": "machines" });
  host.appendChild(picker);
  host.appendChild(sum);
  host.appendChild(list);

  /* Build each machine row once, then update it, so the fill can animate. */
  var rows = H.rungs.map(function (r) {
    var fill = el("span", { "class": "fill" }), head = el("span", { "class": "headroom", title: "15% working space" });
    var bar = el("div", { "class": "membar", "aria-hidden": "true" }, [fill, head]);
    if (r.memory.fastGb) {
      var split = el("span", { "class": "split" });
      split.style.left = (r.memory.fastGb / r.memory.gb * 100) + "%";
      bar.appendChild(split);
    }
    var result = el("div", { "class": "result" });
    list.appendChild(el("li", {}, [
      el("div", { "class": "name" }, [el("strong", { text: r.n + ". " + r.name }), el("span", { text: r.memory.shown + " of memory" })]),
      bar, result
    ]));
    return { rung: r, fill: fill, head: head, result: result };
  });

  function draw() {
    var size = E.sizeGb(chosen, BITS);
    sum.textContent = chosen + " billion parameters × " + BITS + " bits ÷ 8 = " + E.showGb(size);
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
      row.result.appendChild(document.createTextNode(note));
    });
  }
  draw();
})();
