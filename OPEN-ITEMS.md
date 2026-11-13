# Open items for the owner

1. **Own measurements.** If you have measured tokens per second, concurrency and power draw from your own hardware, they should replace the published figures for rung 1 (SPEC 7.4).
2. **Deskside workstation UK price.** No UK list price was found for rung 3. A UK reseller quote would replace the converted figure.
3. **VAT assumptions.** All prices are shown inc VAT. Several sellers did not state their basis and were assumed to be ex VAT (marked in SPEC section 7 and in the data files); confirm these against the seller pages.
4. **Top-rung benchmark.** No published inference benchmark for an 8 × B300 server was found. The 8 × B200 comparison (S29) is used as the nearest evidence.
5. **Vendor naming.** Confirm you are content for named products to appear in the price tables.
6. **Course title.** Agreed: "Just Enough AI: A Manager's Guide to Commissioning AI Capability". Short form: "Just Enough AI".

## Raised during the build

7. **Batching figure (SPEC 7.4, source S24).** The spec says 10 users got "about 7 tokens/s each, 58 tokens/s in total"; these do not agree (7 × 10 = 70). Only the 58 total is used. Check S24 and correct `data/hardware.js` (`batch10`).
8. **H100 worked example rate.** The £2.68 an hour used in the module 2 rented-GPU example is not in any table; it is shown as "a mid-range" rate within the sourced £1.77 to £3.54 range.
9. **Estimator simplifications (SPEC 7.7).** Single-user speed readouts are capped at "100+"; rung 2 is treated as adding capacity, not speed; rung 3 uses its fast bandwidth only when the model fits in its 252 GB of GPU memory.
10. **Frontier model size (module 6).** The "2,000B (frontier scale, assumed)" option is an assumption with no source: the makers of the leading hosted models do not publish parameter counts. It is labelled as assumed on the page. Replace or remove it if you have a figure you are content to cite. The 32 GB "ordinary office computer" is likewise an illustrative figure.
11. **Source links not checked from the build environment.** The build ran on a network that blocks outside sites, so none of the 33 source addresses on `sources.html` could be opened to confirm they resolve. Check them by hand before publishing widely, along with the prices in SPEC 7.2 and 7.3.
12. **Live site not checked from the build environment.** For the same reason the acceptance checks were run against a local copy served under the same project path, not against the published GitHub Pages address. A quick click through the live site is worth doing.
13. **Word limit.** Raised from 450 to 500 at the owner's request (SPEC sections 1 and 9 updated). Module 6 is at 494.
