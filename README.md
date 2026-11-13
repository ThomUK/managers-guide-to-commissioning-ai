# Just Enough AI: A Manager's Guide to Commissioning AI Capability

A visual training course on LLMs and agentic AI for managers. Static HTML, CSS and
vanilla JavaScript: no framework, no build step, no external requests. The repository
root is the published site. `SPEC.md` is the specification it is built from.

Status: under construction. Modules 1 to 8 are built; modules 9 to 11 are placeholders.

## Preview locally

Open `index.html` by double-click, or serve the folder:

    python3 -m http.server 8000

## Update figures

1. Edit the figure in `data/prices.js` or `data/hardware.js` (each records the figure shown,
   the original figure and its basis, and a `sourceId`).
2. Add or edit the source in `data/sources.js`.
3. Run `node tools/build-pages.js` to regenerate `index.html`, `glossary.html` and
   `sources.html` from the data files. Module pages are hand-written HTML; figures quoted
   in their prose must be edited there too.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`.
All paths are relative and `.nojekyll` is present, so the site works under a project path.
