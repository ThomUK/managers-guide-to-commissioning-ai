# Just Enough AI: A Manager's Guide to Commissioning AI Capability

A visual training course on LLMs and agentic AI for managers: 11 modules of about five
minutes each. Static HTML, CSS and vanilla JavaScript, with no framework, no build step and
no external requests. The repository root is the published site.

- `SPEC.md` is the specification the course was built from.
- `FIGURES.md` lists every number shown, with its page and source.
- `OPEN-ITEMS.md` lists what still needs the owner's decision or better data.

## Preview locally

Open `index.html` by double-click, or serve the folder:

    python3 -m http.server 8000

## How the site is put together

| Path | What it holds |
|---|---|
| `index.html`, `glossary.html`, `sources.html` | Generated from `data/` by `tools/build-pages.js` |
| `modules/*.html` | One hand-written page per module; all text is in the HTML |
| `assets/css/site.css` | All styles, light and dark, print |
| `assets/js/site.js` | Sidebar, progress ticks, glossary tooltips, cost chips, check questions, stepper |
| `assets/js/estimate.js` | The teaching formulas from SPEC 7.7 (size, fit, speed) |
| `assets/js/visuals/mNN.js` | The interactive visual for each module |
| `data/*.js` | Module list, prices, hardware ladder, sources, glossary |
| `tools/` | `build-pages.js` and `test-estimate.js` (need Node; not needed to serve the site) |

## Update figures

1. Edit the figure in `data/prices.js` or `data/hardware.js`. Each entry records the figure
   shown, the original figure and its basis, and a `sourceId`.
2. Add or edit the source in `data/sources.js`.
3. Run `node tools/build-pages.js` to regenerate `index.html`, `glossary.html` and `sources.html`.
4. Figures quoted in a module's prose are in that module's HTML: search `modules/` for the old
   value. `FIGURES.md` says which pages show each figure; update it too.
5. If the checked date changes, update `figuresChecked` in `data/modules.js`, `checked` in the
   other data files, and the footer line in each `modules/*.html`.
6. Run `node tools/test-estimate.js` to confirm the arithmetic still holds.

## GitHub Pages

Published from the `main` branch, folder `/ (root)` (Settings → Pages → Deploy from a branch).
All paths are relative and `.nojekyll` is present, so the site works under the project path:
https://thomuk.github.io/managers-guide-to-commissioning-ai/
