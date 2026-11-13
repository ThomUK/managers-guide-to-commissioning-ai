/* Module 10 visuals: the precision slider, and one pattern at four depths of shade.
   Size = parameters x bits / 8 (assets/js/estimate.js). Speed is relative to 16-bit, from the same formula.
   ILLUSTRATIVE: the example weights, the quality gauge and the pattern. */
(function () {
  "use strict";
  var J = window.JEAI, H = window.JEAI_HARDWARE, E = window.JEAI_EST;
  if (!J || !H || !E) return;
  var el = J.el;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var host = document.getElementById("precision-body");
  if (host) {
    var BITS = [16, 8, 4, 2], PARAMS = 120, rung = H.rungs[0];
    var WEIGHTS = [0.7384, -0.2915, 0.0462, 0.9127, -0.6038];
    /* how each example number is shown at each precision (illustrative rounding) */
    var ROUND = {
      16: function (w) { return w.toFixed(4); },
      8: function (w) { return w.toFixed(2); },
      4: function (w) { return String(Math.round(w * 8) / 8); },
      2: function (w) { return String(Math.round(w)).replace("-0", "0"); }
    };
    var QUALITY = { 16: [100, "as the original"], 8: [98, "close to indistinguishable"], 4: [91, "a slight dip"], 2: [45, "a clear drop"] };
    var SYMBOL = { spare: "✓ ", tight: "! ", no: "✕ " };

    var slider = el("input", { type: "range", id: "bits", min: "0", max: "3", step: "1", value: "0" });
    var label = el("label", { "for": "bits" });
    var nums = el("div", { "class": "tok-strip", "aria-live": "polite" });
    var fill = el("span", { "class": "fill" }), bar = el("div", { "class": "membar", "aria-hidden": "true" }, [fill]);
    var fitText = el("div", { "class": "result small", role: "status" });
    function gauge(name) {
      var inner = el("span"), b = el("div", { "class": "powerbar", style: "max-width:none;height:14px", "aria-hidden": "true" }, [inner]);
      var t = el("span", { "class": "small" });
      return { row: el("div", { style: "margin:.5em 0" }, [el("strong", { "class": "small", text: name + ": " }), t, b]), inner: inner, text: t };
    }
    var speed = gauge("Speed"), quality = gauge("Quality (illustrative)");
    quality.inner.style.background = "var(--cat-3)";

    host.appendChild(el("div", { "class": "field" }, [label, slider, el("div", { "class": "ends" }, [el("span", { text: "16-bit" }), el("span", { text: "8-bit" }), el("span", { text: "4-bit" }), el("span", { text: "2-bit" })])]));
    host.appendChild(el("p", { "class": "small", style: "margin:.6em 0 0;font-weight:700", text: "Five of the model’s numbers" }));
    host.appendChild(nums);
    host.appendChild(el("p", { "class": "small", style: "margin:.6em 0 0;font-weight:700", text: "A " + PARAMS + "-billion-parameter model in the desk-sized machine’s " + rung.memory.shown + " of memory" }));
    host.appendChild(bar);
    host.appendChild(fitText);
    host.appendChild(speed.row);
    host.appendChild(quality.row);

    var draw = function () {
      var bits = BITS[+slider.value], size = E.sizeGb(PARAMS, bits), f = E.fit(size, rung.memory.gb);
      label.textContent = "Precision: " + bits + " bits per number";
      nums.textContent = "";
      WEIGHTS.forEach(function (w) { nums.appendChild(el("span", { "class": "tok", text: ROUND[bits](w) })); });
      fill.style.width = Math.min(100, size / rung.memory.gb * 100) + "%";
      fill.className = "fill" + (f === "no" ? " over" : "");
      fitText.textContent = "";
      fitText.appendChild(el("span", { "class": "fit-" + f, text: SYMBOL[f] + E.FIT_TEXT[f] + ". " }));
      fitText.appendChild(document.createTextNode(PARAMS + " × " + bits + " ÷ 8 = " + E.showGb(size) + "."));
      var times = 16 / bits;
      speed.inner.style.width = (times / 8 * 100) + "%";
      speed.text.textContent = times === 1 ? "the starting point" : "about " + times + " times the 16-bit speed (rough estimate)";
      quality.inner.style.width = QUALITY[bits][0] + "%";
      quality.text.textContent = QUALITY[bits][1];
    };
    slider.addEventListener("input", draw);
    draw();
  }

  /* ---------- One pattern, four depths of shade (drawn procedurally) ---------- */
  var shades = document.getElementById("shades-body");
  if (shades) {
    var wrap = el("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.8em" });
    [256, 16, 4, 2].forEach(function (levels) {
      var c = el("canvas", { width: "160", height: "110", role: "img", "aria-label": "The pattern drawn with " + levels + " shades.",
        style: "width:100%;height:auto;border-radius:6px;border:1px solid var(--border);display:block" });
      var ctx = c.getContext("2d");
      if (ctx) {
        for (var y = 0; y < 110; y += 2) for (var x = 0; x < 160; x += 2) {
          var v = 0.5 + 0.25 * Math.sin(x / 19 + y / 31) + 0.15 * Math.sin(y / 13 - x / 47) + 0.1 * Math.cos((x + y) / 23) * Math.sin(x / 9);
          v = Math.max(0, Math.min(0.999, v));
          var q = Math.floor(v * levels) / (levels - 1);
          ctx.fillStyle = "hsl(265, 45%, " + Math.round(18 + q * 68) + "%)";
          ctx.fillRect(x, y, 2, 2);
        }
      }
      wrap.appendChild(el("div", {}, [c, el("p", { "class": "small", style: "margin:.2em 0 0;text-align:center", text: levels + " shades" })]));
    });
    shades.appendChild(wrap);
  }
})();
