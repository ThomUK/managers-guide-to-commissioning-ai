#!/usr/bin/env node
/* Unit tests for assets/js/estimate.js against SPEC.md section 7.7.  Run: node tools/test-estimate.js */
"use strict";
const assert = require("assert");
const path = require("path");
global.window = globalThis;
require(path.join(__dirname, "..", "data", "hardware.js"));
require(path.join(__dirname, "..", "assets", "js", "estimate.js"));
const E = globalThis.JEAI_EST, R = globalThis.JEAI_HARDWARE.rungs;
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);

// Size: parameters x bits / 8
near(E.sizeGb(27, 16), 54); near(E.sizeGb(70, 16), 140); near(E.sizeGb(27, 8), 27); near(E.sizeGb(27, 4), 13.5);
// Fit: 15% headroom; tight between 1.0 and 1.15
assert.strictEqual(E.fit(54, 128), "spare");
assert.strictEqual(E.fit(120, 128), "tight");
assert.strictEqual(E.fit(140, 128), "no");
assert.strictEqual(E.fit(800, 1128), "spare");
// The spec's sanity check: rung 1, dense 27B at 8-bit -> about 7 tokens/s (about 8 measured)
near(E.tokensPerSecond(R[0], 27, 27, 8), 0.7 * 273 / 27, 1e-9);
assert.strictEqual(E.showSpeed(E.tokensPerSecond(R[0], 27, 27, 8)), "7");
// MoE 35B total, 3B active, 16-bit on rung 1 -> about 32 (about 30 measured)
assert.strictEqual(E.showSpeed(E.tokensPerSecond(R[0], 35, 3, 16)), "32");
// Does not fit -> no speed
assert.strictEqual(E.tokensPerSecond(R[0], 70, 70, 16), null);
// Multi-GPU: per-GPU bandwidth x 8, factor 0.6; capped display
near(E.tokensPerSecond(R[3], 70, 70, 16), 0.6 * 8 * 4800 / 140, 1e-9);
assert.strictEqual(E.showSpeed(E.tokensPerSecond(R[3], 70, 70, 16)), "100+");
// Rung 3: fast memory if the model fits in 252 GB, slower memory otherwise
near(E.tokensPerSecond(R[2], 120, 120, 16), 0.7 * 7100 / 240, 1e-9);
near(E.tokensPerSecond(R[2], 200, 200, 16), 0.7 * 396 / 400, 1e-9);
// Rounding: one significant figure below 10, two above
assert.strictEqual(E.round(7.08), 7); assert.strictEqual(E.round(31.85), 32); assert.strictEqual(E.round(0.693), 0.7);
// Worked examples in section 7.2
near(50 * 18 * 12, 10800); near((10 * 2 + 2 * 10) * 0.74 * 1.2, 35.52); near(2.68 * 8 * 21, 450.24); near(64.10 * 730, 46793);
// Electricity in 7.4: kW x 8,760 h x 30p
R.forEach((r) => { const pounds = r.electricity.kw * 8760 * 0.30; const shown = +r.electricity.shown.replace(/[^\d]/g, "");
  assert.ok(Math.abs(pounds - shown) / shown < 0.02, `rung ${r.n}: ${pounds} vs ${shown}`); });
console.log("All estimator and arithmetic tests passed.");
