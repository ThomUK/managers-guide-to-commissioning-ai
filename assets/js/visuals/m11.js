/* Module 11 visual: the sizing explorer. Method: assets/js/estimate.js (SPEC 7.7).
   An order-of-magnitude guide for conversation with a technical team. Not a procurement tool. */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST;
  if (!J) return;
  var el = J.el;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  /* Print only the questions card */
  var printBtn = document.getElementById("print-card");
  if (printBtn) printBtn.addEventListener("click", function () {
    document.body.classList.add("print-card");
    window.print();
    setTimeout(function () { document.body.classList.remove("print-card"); }, 500);
  });

  var host = document.getElementById("explorer-body");
  if (!host || !H || !E) return;
  var SIZES = [4, 8, 12, 27, 35, 70, 120, 200, 400], ACTIVES = [3, 6, 12, 20, 40];
  var st = { size: 3, moe: false, active: 3, bits: 8, rung: 0 };
  var SYMBOL = { spare: "✓ ", tight: "! ", no: "✕ " };

  function seg(name, options, current, onChange) {
    var box = el("div", { "class": "seg" });
    options.forEach(function (o) {
      var input = el("input", { type: "radio", name: name, value: String(o[0]) });
      if (o[0] === current) input.checked = true;
      input.addEventListener("change", function () { onChange(o[0]); draw(); });
      box.appendChild(el("label", {}, [input, o[1]]));
    });
    return box;
  }
  var out = el("div", { "class": "readout", role: "status" });
  var sizeIn = el("input", { type: "range", id: "x-size", min: "0", max: String(SIZES.length - 1), step: "1", value: String(st.size) });
  var sizeLab = el("label", { "for": "x-size" });
  var activeSel = el("select", { id: "x-active" });
  var activeField = el("div", { "class": "field" }, [el("label", { "for": "x-active", text: "Active size (MoE only)" }), activeSel]);
  var rungSel = el("select", { id: "x-rung" });
  H.rungs.forEach(function (r, i) { rungSel.appendChild(el("option", { value: String(i), text: r.n + ". " + r.name + " (" + r.memory.shown + ")" })); });
  sizeIn.addEventListener("input", function () { st.size = +sizeIn.value; draw(); });
  activeSel.addEventListener("change", function () { st.active = +activeSel.value; draw(); });
  rungSel.addEventListener("change", function () { st.rung = +rungSel.value; draw(); });

  host.appendChild(out);
  host.appendChild(el("div", { "class": "field" }, [sizeLab, sizeIn, el("div", { "class": "ends" }, [el("span", { text: "4B" }), el("span", { text: "400B" })])]));
  host.appendChild(el("div", { "class": "field" }, [el("span", { "class": "lab", text: "Model type" }),
    seg("x-type", [[false, "Dense"], [true, "MoE"]], st.moe, function (v) { st.moe = v; })]));
  host.appendChild(activeField);
  host.appendChild(el("div", { "class": "field" }, [el("span", { "class": "lab", text: "Precision" }),
    seg("x-bits", [[16, "16-bit"], [8, "8-bit"], [4, "4-bit"]], st.bits, function (v) { st.bits = v; })]));
  host.appendChild(el("div", { "class": "field" }, [el("label", { "for": "x-rung", text: "Machine" }), rungSel]));

  function row(dl, k, v) { dl.appendChild(el("dt", { "class": "muted", text: k })); dl.appendChild(el("dd", { style: "margin:0" }, typeof v === "string" ? [v] : v)); }

  function draw() {
    var total = SIZES[st.size], r = H.rungs[st.rung];
    /* active sizes offered must be smaller than the total */
    var opts = ACTIVES.filter(function (a) { return a < total; });
    if (opts.indexOf(st.active) === -1) st.active = opts[0];
    activeSel.textContent = "";
    opts.forEach(function (a) { var o = el("option", { value: String(a), text: "about " + a + " billion active" }); if (a === st.active) o.selected = true; activeSel.appendChild(o); });
    activeField.hidden = !st.moe;
    var active = st.moe ? st.active : total;
    var size = E.sizeGb(total, st.bits), f = E.fit(size, r.memory.gb), tps = E.tokensPerSecond(r, total, active, st.bits);
    var spills = !!(r.est.fastGb && size > r.est.fastGb) && f !== "no";
    sizeLab.textContent = "Model size: " + total + " billion parameters" + (st.moe ? " in total" : "");

    out.textContent = "";
    out.appendChild(el("p", { "class": "small muted", style: "margin-bottom:.5em", text:
      total + "B " + (st.moe ? "MoE (" + active + "B active)" : "dense") + " at " + st.bits + "-bit on machine " + r.n + ": " + r.name }));
    var dl = el("dl", { "class": "kv" });
    row(dl, "Does it fit?", [el("span", { "class": "fit-" + f, text: SYMBOL[f] + E.FIT_TEXT[f] + ". " }),
      "Needs " + E.showGb(size) + " of " + r.memory.shown + "." + (spills ? " Runs from this machine’s slower memory." : "")]);
    row(dl, "Speed, one user", f === "no" ? "None: it does not run." : [el("strong", { text: E.speedPhrase(tps) + " tokens per second" }), " (rough estimate)"]);
    row(dl, "Purchase price", [J.chip(r.price.shown, { product: r.product, original: r.price.original, basis: r.price.basis, sourceIds: r.price.sourceIds }), " inc VAT"]);
    row(dl, "Power under load", r.power.shown);
    row(dl, "Electricity a year", r.electricity.shown + " (" + r.electricity.basis + ", indicative)");
    out.appendChild(dl);
  }
  draw();
})();
