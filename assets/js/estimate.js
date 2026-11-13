/* The teaching estimator from SPEC.md section 7.7, used by modules 6, 8, 9, 10 and 11.
   An order-of-magnitude guide, not a procurement tool: real speed depends on software and settings.

   Sanity check (keep): rung 1, dense 27B at 8-bit -> 0.7 x 273 / 27 = about 7 tokens/s,
   against about 8 measured (source S24). Tested in tools/test-estimate.js. */
(function (root) {
  "use strict";
  var HEADROOM = 1.15; /* 15% for the KV cache and working space */
  var CAP = 100;       /* single-user readouts above this are shown as "100+" */

  function sizeGb(paramsBillion, bits) { return paramsBillion * bits / 8; }

  /* "spare" (fits with room to spare), "tight" (fits, tight) or "no" (does not fit) */
  function fit(modelGb, memoryGb) {
    if (modelGb * HEADROOM <= memoryGb) return "spare";
    if (modelGb <= memoryGb) return "tight";
    return "no";
  }

  /* For a dense model, active = total. */
  function readPerTokenGb(activeBillion, bits) { return activeBillion * bits / 8; }

  /* Single-user tokens per second on a rung from data/hardware.js; null if the model does not fit. */
  function tokensPerSecond(rung, totalBillion, activeBillion, bits) {
    var size = sizeGb(totalBillion, bits);
    if (fit(size, rung.memory.gb) === "no") return null;
    var bw = rung.est.bandwidthGbs;
    if (rung.est.fastGb && size > rung.est.fastGb) bw = rung.est.slowBandwidthGbs; /* spills into slower memory */
    return rung.est.factor * bw / readPerTokenGb(activeBillion, bits);
  }

  /* One significant figure below 10, two above. */
  function round(x) {
    if (x <= 0) return 0;
    var digits = x < 10 ? 1 : 2;
    return Number(x.toPrecision(digits));
  }

  function showSpeed(tps) {
    if (tps == null) return "—";
    if (tps > CAP) return CAP + "+";
    var r = round(tps);
    return String(r < 1 ? +r.toFixed(2) : r);
  }

  function showGb(gb) {
    var r = gb >= 100 ? Math.round(gb) : Math.round(gb * 10) / 10;
    return r.toLocaleString("en-GB") + " GB";
  }

  var FIT_TEXT = { spare: "Fits with room to spare", tight: "Fits, tight", no: "Does not fit" };

  root.JEAI_EST = { HEADROOM: HEADROOM, CAP: CAP, sizeGb: sizeGb, fit: fit, readPerTokenGb: readPerTokenGb,
    tokensPerSecond: tokensPerSecond, round: round, showSpeed: showSpeed, showGb: showGb, FIT_TEXT: FIT_TEXT };
})(typeof window !== "undefined" ? window : globalThis);
