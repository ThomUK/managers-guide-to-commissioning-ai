# SPEC: "Just Enough AI: A Manager's Guide to Commissioning AI Capability" — a visual training course on LLMs and agentic AI

Status: ready to build. Figures checked 13 November 2026.
Executor: Claude Code, working in this repository.
Host: GitHub Pages (static files, no build step).

---

## 0. How to use this spec

- Build exactly what is described here. The module order, the two-layer page design and the data tables are settled decisions; do not reorder or merge modules.
- Section 7 holds every price, power and performance figure, with its source. Use those figures. Do not add a number that has no source in section 7; if a visual needs one that is missing, use a clearly labelled illustrative value or leave it out, and list it in `OPEN-ITEMS.md`.
- Build in the order given in section 10 and stop for review at the two checkpoints.
- Where this spec says "illustrative", the page must say so too.

---

## 1. Purpose and audience

**Audience:** managers and senior leaders. Not technical. They make or influence decisions about buying, permitting and funding AI tools, and they manage people who use them.

**Aim:** after the course a manager can

1. describe what an LLM is and is not, in a sentence;
2. tell apart the ways of buying AI (who owns the model, who owns the GPU, how it is paid for, where data goes);
3. explain why an agent with tool permissions is a different risk from a chat window;
4. ask their technical team sensible questions about hardware, speed and cost;
5. recognise which details belong to the technical team and do not need their attention.

Point 5 is a design goal in its own right. The course must show that depth exists without asking managers to master it.

**Length:** 11 modules, about 5 minutes each. Roughly 350 to 500 words of top-layer text per module, plus one main visual.

**Tone:** plain UK English, direct, no hype, no jargon without a definition. Second person ("you"). No exclamation marks. Analogies are welcome but each module uses one analogy at most, and the page must say where the analogy stops being true.

---

## 2. Design principles

1. **Two layers on every module page.**
   - *Top layer (always visible):* the one key idea, the main visual, and a "What this means for your decisions" box.
   - *Detail layer (collapsed by default):* a panel titled **"The detail your technical team handles"**. It contains the more precise explanation, the terms an engineer would use, and the caveats. It opens on click. Its presence, closed, is part of the message.
2. **Visual first.** Each module is built around one main visual that carries the idea. Text supports the visual, not the other way round.
3. **One idea per module.** If a second idea appears, it goes in the detail layer or another module.
4. **A consistent visual vocabulary** across all modules (section 5). A token always looks like a token; memory always looks like memory.
5. **Every figure is sourced and dated.** Prices and benchmarks date quickly. Every page that shows a figure shows the "figures checked" date and links to the sources page.
6. **Skippable.** Any module can be read alone. Each opens with a one-line "You need this if…" and a one-line recap of anything it relies on, linking back.

---

## 3. Site architecture

### 3.1 Constraints

- Static HTML, CSS and vanilla JavaScript only. No framework, no bundler, no build step. The repository root is the published site.
- No external requests at runtime: no CDNs, web fonts, analytics or remote images. It must work on a locked-down network.
- All internal links and asset paths are **relative** (the site is served from `https://<user>.github.io/<repo>/`, not from the domain root).
- Include an empty `.nojekyll` file at the root.
- Data lives in `.js` files that assign to a global (not `.json` loaded with `fetch`), so pages also work when opened from disk by double-click.
- The text of every module is real HTML in the page. JavaScript enhances it (navigation, visuals, progress) but the words must be readable with JavaScript off.

### 3.2 File tree

```
/
├── index.html                 Contents page
├── modules/
│   ├── 01-what-is-an-llm.html
│   ├── 02-local-vs-cloud.html
│   ├── 03-chat-vs-agent.html
│   ├── 04-ai-assisted-coding.html
│   ├── 05-improving-results.html
│   ├── 06-what-a-model-is.html
│   ├── 07-how-a-response-is-made.html
│   ├── 08-hardware-and-performance.html
│   ├── 09-dense-vs-moe.html
│   ├── 10-quantisation.html
│   └── 11-putting-it-together.html
├── glossary.html
├── sources.html
├── assets/
│   ├── css/site.css
│   └── js/
│       ├── site.js            Sidebar, progress, prev/next, glossary tooltips
│       └── visuals/           One file per module visual: m01.js … m11.js
├── data/
│   ├── modules.js             Single source of truth for titles, order, part, summary
│   ├── prices.js              Module 2 arrangements and example costs
│   ├── hardware.js            Hardware ladder: price, memory, bandwidth, power, performance
│   └── sources.js             Every source: id, title, url, checked date
├── .nojekyll
├── README.md                  How to preview locally, how to update figures, how Pages is configured
├── OPEN-ITEMS.md              Anything that needs the owner's decision or better data
└── SPEC.md                    This file
```

### 3.3 Navigation

- **Contents page (`index.html`):** the course title "Just Enough AI: A Manager's Guide to Commissioning AI Capability", a two-sentence introduction, then two groups of cards: "Part A: Using it" (modules 1 to 5) and "Part B: Running it" (modules 6 to 11). Each card shows number, title, the "You need this if…" line, "about 5 min", and a visited tick. Above Part B, a short note: *"Part B explains what your technical team is weighing up. Read it if you make or approve decisions about hosting AI yourselves. Otherwise Part A is enough."*
- **Sidebar (every module page):** all 11 modules grouped by part, current module highlighted, visited modules ticked, links to Glossary and Sources. Collapses to a menu button below 900px width. Rendered by `site.js` from `data/modules.js`.
- **Without JavaScript:** each page has static "Contents", "Previous" and "Next" links in the HTML.
- **Previous / Next** buttons at the foot of every module.
- **Progress:** visited modules stored in `localStorage` under one key. Wrap every read and write in `try/catch`; if storage is unavailable the site works with no ticks. Include a "Reset progress" link on the contents page.
- **Deep links:** every section heading has an `id` so a colleague can be sent a link to one part.

### 3.4 Page template (every module)

In this order:

1. Module number, title, "about 5 minutes", part label.
2. **"You need this if…"** one line.
3. **Relies on** (only where relevant): one line linking to earlier modules.
4. **The key idea:** one or two sentences in a highlighted box.
5. **Main visual**, with a one-line caption and, where interactive, a one-line instruction.
6. **Explanation:** short paragraphs, at most three sub-headings.
7. **"What this means for your decisions":** two to four bullets in a distinct box.
8. **"The detail your technical team handles":** a `<details>` element, closed by default.
9. **Check your understanding:** one multiple-choice question with immediate feedback and a one-sentence explanation. Not scored, not stored.
10. Previous / Next.
11. Footer: "Figures checked 13 November 2026" with a link to `sources.html`.

### 3.5 Accessibility and responsiveness

- Works from 360px wide upwards. Visuals reflow or scale; none require horizontal scrolling.
- Colour is never the only carrier of meaning: pair it with labels, patterns or position.
- Text contrast at least WCAG AA.
- Every visual has a text alternative: an `aria-label` summary and a short "What this shows" sentence in the caption.
- All interactive controls are real `<button>`, `<input>` or `<details>` elements, keyboard-operable with visible focus.
- Respect `prefers-reduced-motion`: animations become stepped (a "Next step" button) or static.
- Support light and dark via `prefers-color-scheme`.
- A print stylesheet that opens all detail panels and hides navigation.

---

## 4. Shared components

| Component | Behaviour |
|---|---|
| Key idea box | Highlighted, one or two sentences, no links |
| Decision box | Titled "What this means for your decisions", bulleted |
| Detail panel | `<details>` with summary "The detail your technical team handles"; small "optional" tag |
| Glossary term | First use of a glossary term on a page is a dotted-underline link to `glossary.html#term`; `site.js` adds a tooltip with the short definition |
| Check question | Radio options, "Check" button, feedback text; correct and incorrect both get the explanation |
| Stepper | For animated visuals: Play, Pause, Step, Restart; shows "Step n of m" |
| Figure stamp | "Illustrative" or "Source: …, checked <date>" under any visual with numbers |
| Cost chip | Used in modules 2 and 8: a price inc VAT, with a source link and, on hover or focus, the original figure and basis |

**Glossary (minimum terms):** LLM, token, context window, training, inference, parameter (weight), open weights, API, GPU, CPU, memory (RAM / GPU memory), memory bandwidth, prompt processing (prefill), token generation (decode), time to first token, tokens per second, KV cache, prompt caching, agent, tool, permission, RAG, fine-tuning, dense model, MoE (mixture of experts), active parameters, quantisation, bit, batching (concurrency).

Each definition: one sentence in plain English, then optionally one sentence of precision.

---

## 5. Visual design

- Build visuals as inline SVG driven by vanilla JS. One file per module in `assets/js/visuals/`. No charting library.
- Calm, professional look. System font stack. Generous spacing. One accent colour plus a small categorical set; define all colours as CSS custom properties with light and dark values.
- Do not use any real company logo, product icon or brand mark. Vendor names appear as plain text only.

**Shared visual vocabulary (use consistently):**

| Concept | Always drawn as |
|---|---|
| Token | Small rounded tile containing a word fragment |
| Model weights | A grid of small squares (the "block of numbers") |
| Memory capacity | A container the weights sit inside, with a fill level |
| Memory bandwidth | The width of a pipe between memory and processor |
| Processor (GPU/CPU) | A row of workers: GPU many small, CPU few large |
| KV cache | A notepad that grows a line per token read |
| Tool call | An arrow leaving the model box to a labelled tool, and returning |
| Permission | A gate on that arrow: open, ask, or locked |
| Your organisation / the vendor | Two tinted zones; anything drawn in a zone is owned there |

The two tinted zones (yours / theirs) recur in modules 2, 3 and 11 and are the main carrier of the "where does my data go" message.

---

## 6. Module briefs

Each brief gives: the "You need this if" line, the key idea, the main visual, the decision bullets, the detail-panel content and the check question. Write the explanatory prose to fit; keep it accurate to the notes here.

### Part A: Using it

#### Module 1 — What an LLM is

- **You need this if:** you want a one-sentence answer to "what is this thing actually doing?"
- **Key idea:** An LLM predicts the next small piece of text, over and over. Everything it does is built from that.
- **Main visual — interactive next-token predictor.** A sentence stem such as "The patient was discharged from the" with a horizontal bar chart of five or six candidate next tokens and their probabilities. A "Pick next token" button samples one, appends it as a token tile, and the bars update for the new position. Use a small hand-written lookup table of stems and probabilities (illustrative; label it so). Include a "more predictable / more varied" slider that visibly flattens or sharpens the bars.
- **Second, smaller visual:** a strip showing a sentence split into token tiles, to make the point that tokens are word fragments, and a "context window" bracket showing how much text the model can see at once.
- **Cover in prose:** tokens (roughly three-quarters of a word each, as a rule of thumb); the context window as the model's field of view; training (done once, by the model maker, very expensive) versus inference (using it, every time you ask); the model's weights do not change when you chat with it; it produces plausible text, which is usually but not always true text.
- **Decisions:**
  - It does not look things up unless it has been given a tool to do so (module 3) or documents to read (module 5).
  - Confident wording is not evidence of accuracy. Decide where checking is needed.
  - Cost and speed are both counted in tokens (modules 2 and 7).
- **Detail panel:** transformer architecture in two sentences; sampling and temperature; why the same question can give different answers; knowledge cut-off; "hallucination" as a consequence of prediction, not a malfunction.
- **Check question:** "When you chat with an LLM, when does it learn from your conversation?" Correct: it does not change the model; it only has the conversation in its context window. Distractors: "immediately", "overnight".

#### Module 2 — Local AI vs. cloud AI

- **You need this if:** you are asked to approve, buy or govern an AI tool.
- **Key idea:** Every way of using AI answers four questions differently: who owns the model, who owns the GPU, how do you pay, and where does your data go.
- **Main visual — the ownership grid.** Four rows (the arrangements in table 7.2), four question columns. Each cell uses the yours/theirs zone colours with a text label. Selecting a row opens a panel beneath with: a small diagram showing your data's path across the yours/theirs boundary; the payment model in one line; the example UK cost chips from table 7.2; "good for" and "watch for" in one line each.
- **Second visual — the hardware ladder.** Shown when the "own hardware" row is selected. Five rungs from table 7.3 drawn on a logarithmic price axis, each with price, memory, and power under inference load. State on the visual that the axis is logarithmic and that the top rung costs roughly 100 times the bottom one. Link forward to module 8 for what the difference buys.
- **Cover in prose:** the four arrangements; that "open weights" means a model file you can download and run yourself; that only the bottom two rows make hardware your concern, which is what Part B is about; that prices move (give the two examples in 7.5); that all prices shown include VAT, and why (7.1).
- **Decisions:**
  - Ask the four questions of any AI product put in front of you.
  - Per-seat pricing is predictable; per-token pricing scales with use; owned hardware is a fixed cost that is cheap only if it is busy.
  - The purchase price of large hardware is not the whole cost: add power, hosting and people (figures in 7.4).
- **Detail panel:** enterprise terms that affect the data-flow answer (training on your data, retention, region); hybrid arrangements such as a vendor model hosted in your own cloud tenancy; why open models at the top of the ladder can match hosted ones for some tasks but not all.
- **Check question:** "Your team runs an open-weights model on a GPU rented by the hour from a cloud provider. Who owns the GPU, and what are you paying for?" Correct: the cloud provider owns it; you pay for time, whether or not it is busy.

#### Module 3 — A chat window vs. an agentic system

- **You need this if:** someone asks you to approve an AI "agent", or an AI tool that can take actions.
- **Key idea:** A chat window can only say things. An agent can do things, and what it is able to do is set by the tools and permissions you give it.
- **Main visual — side-by-side stepper.** The same request ("Find last month's overdue invoices and email a reminder to each customer") handled two ways.
  - Left, chat: request in, text out. The model explains how you could do it. Nothing outside the box changes.
  - Right, agent: a visible loop of *think → act → observe*. Tool arrows leave the model to "Read finance system", "Draft email", "Send email". Each arrow has a permission gate. The stepper pauses at "Send email" with an approval prompt; the viewer chooses Allow or Deny and sees the consequence.
- **Second visual — the permission dial.** Three settings: *read only*, *ask before acting*, *act automatically*. Changing it re-colours the gates in the main visual.
- **Cover in prose:** what a tool is; the loop; why agents take longer and use more tokens than a single answer; that the model is the same in both cases, and the difference is what it is connected to.
- **Decisions:**
  - The risk question for an agent is "what can it touch, and what can it do without asking?", not "how clever is it?"
  - Start with read-only and ask-first. Widen permissions for specific, reversible actions.
  - An agent that reads content from outside (web pages, emails, documents) can be steered by instructions hidden in that content. Limit what it can do after reading untrusted material.
- **Detail panel:** tool definitions and connectors; sandboxes; audit logs; prompt injection named and explained in three sentences; human-in-the-loop versus human-on-the-loop.
- **Check question:** "Which change most increases the risk of an AI system?" Correct: giving it permission to act without asking. Distractors: a larger model; a longer context window.

#### Module 4 — AI-assisted code development

- **You need this if:** you manage people who write code or analysis, or you are asked what "AI coding tools" change.
- **Relies on:** module 3 (agents).
- **Key idea:** AI coding tools are agents whose tools are a code editor and a command line. The human's job moves from typing to specifying, reviewing and testing.
- **Main visual — annotated walkthrough.** A stepper through one small task ("the monthly report is double-counting cancelled appointments"). Steps: the agent reads the relevant files; proposes a plan; edits two lines (show a simple before/after diff); runs the tests; one test fails; it reads the error, fixes it, re-runs; all pass; it summarises what it changed for a human to review. Each step is tagged with who is acting (agent or human) and which permission it used.
- **Second visual — three levels on a line:** autocomplete (suggests the next line), chat (answers questions about code), agent (carries out a task). Each with one sentence.
- **Cover in prose:** what it is good at (well-specified, testable, routine work; unfamiliar codebases; first drafts) and where it needs supervision (ambiguous requirements, security-sensitive changes, anything without tests); why version control and tests are what make this safe; that review remains a human responsibility.
- **Decisions:**
  - Productivity gains depend on good specifications and good tests; invest there.
  - Accountability does not move: the person who merges the change owns it.
  - Decide which repositories, data and commands the tools may use, as in module 3.
- **Detail panel:** context limits on large codebases; where the code is sent (links back to module 2); licensing and secrets hygiene; running coding agents against a local model.
- **Check question:** "An AI agent has changed some code and reports that all tests pass. What is still needed?" Correct: a person reviews the change and takes responsibility for it.

#### Module 5 — Three ways to improve results

- **You need this if:** a tool "isn't good enough" and you are asked to fund a fix.
- **Key idea:** There are three levers, in rising order of cost and effort: ask better (prompting), give it the right documents (RAG), or change the model itself (fine-tuning). Try them in that order.
- **Main visual — the ladder.** Three rungs. For each: what changes (your instructions / what the model can read / the model's weights), effort, typical time to try (minutes / days to weeks / weeks to months; label as indicative), and what it fixes.
- **Second visual — "Which one do I need?" interactive flow.** Three or four yes/no questions: *Is the model missing facts that are in your documents?* → RAG. *Does it know enough but answer in the wrong format, tone or style even with clear instructions and examples?* → consider fine-tuning. *Have you given it clear instructions and examples yet?* → prompting first. Ends on a recommendation card.
- **Third, small visual for RAG:** a question goes to a document store, the three most relevant passages are pulled out and placed in the context window beside the question, then the model answers. Reuse the token tiles and context-window bracket from module 1.
- **Cover in prose:** prompting as instructions plus examples plus context; RAG as an open-book exam (the model reads the relevant pages at the time of asking); fine-tuning as further training that changes behaviour and style, and is a poor way to add facts that change often.
- **Decisions:**
  - Most "the AI doesn't know our stuff" problems are RAG problems, not fine-tuning problems.
  - RAG is only as good as the documents behind it; budget for keeping them clean and current.
  - Fine-tuning creates a model you must then own, host and re-do when the base model changes.
- **Detail panel:** embeddings and vector search in two sentences; chunking; evaluation sets (how you know it got better); LoRA as cheap fine-tuning; combining all three.
- **Check question:** "Staff complain the assistant doesn't know this year's policies. What do you try first?" Correct: give it the policy documents (RAG), after checking the prompt.

### Part B: Running it

Open Part B with the framing line on each module's "You need this if": this part explains what a technical team weighs up when AI is run on hardware you control.

#### Module 6 — What a model physically is

- **You need this if:** someone tells you a model "won't fit" or "needs a bigger GPU".
- **Key idea:** A model is a very large file of numbers. To run it, the whole file has to sit in fast memory. Its size decides what hardware can run it at all.
- **Main visual — blocks into memory bars.** A row of model blocks of different sizes (for example 4, 12, 27, 70, 120 and 400 billion parameters), and a set of memory bars for the hardware rungs in table 7.3 (128 GB, 256 GB, 748 GB, 1,128 GB, 2,304 GB). Drag or select a model and a machine: the block drops into the bar and shows "fits with room to spare", "fits, tight" or "does not fit". Size in GB is computed as parameters × bits ÷ 8, at 16 bits by default, with a note that module 10 shows how to shrink it.
- **Cover in prose:** parameters (weights) as the numbers learned in training; "27B" means 27 billion of them; bigger models are generally more capable and always more demanding; the file must fit in memory with room left over for the working notes of each conversation (module 7).
- **Decisions:**
  - "Which model?" and "which hardware?" are one question, not two.
  - Memory capacity is a pass/fail gate. Speed comes later (module 8).
- **Detail panel:** why GPU memory specifically; unified memory versus separate GPU memory; splitting a model across several GPUs; headroom for context.
- **Check question:** "A 70-billion-parameter model stored at 16 bits per number needs roughly how much memory?" Correct: about 140 GB. (70 × 16 ÷ 8.)

#### Module 7 — How a response gets made

- **You need this if:** you want to understand why AI sometimes pauses before answering, and why long conversations cost more.
- **Relies on:** modules 1 and 6.
- **Key idea:** A response has two phases. First the model reads your whole prompt in one go (fast). Then it writes the answer one token at a time (slower). It keeps notes on what it has read, the KV cache, so it never has to re-read.
- **Main visual — the response timeline.** A horizontal timeline with a Play control.
  - Phase 1, *prompt processing*: all the prompt's token tiles light up together in one sweep. A notepad (the KV cache) fills with one line per token. A marker labels the end of this phase "time to first token".
  - Phase 2, *token generation*: output tiles appear one at a time. For each, a pulse sweeps across the weights grid (the model reading its weights) and one more line is added to the notepad. A counter shows "tokens per second".
  - Controls: prompt length (short / long / very long) and answer length. A longer prompt lengthens phase 1 and makes the notepad bigger; a longer answer lengthens phase 2.
  - Toggle: "KV cache off (illustrative)". With it off, every new output token re-sweeps the whole prompt, and the timeline visibly stretches. This is the point of the cache.
- **Cover in prose:** the two numbers people feel are time to first token and tokens per second; reading is done in parallel and is limited by raw compute; writing is one token after another and is limited by how fast the weights can be read from memory (sets up module 8); the KV cache takes memory, and grows with the length of the conversation; when a provider can reuse the notes for a prompt it has seen before, that is "prompt caching", and it is why cached input is priced lower.
- **Measured example to quote (table 7.4):** on one desk-sized machine, a 27-billion-parameter model read prompts at about 1,900 tokens per second and wrote at about 8 tokens per second.
- **Decisions:**
  - Long documents and long conversations cost more and need more memory, even if the answer is short.
  - "It's slow" has two different causes. Ask which: slow to start, or slow to write.
  - Agents (module 3) re-send a growing conversation at every step, so caching matters a great deal for their cost.
- **Detail panel:** what K and V stand for (keys and values in the attention mechanism) in two sentences; prefill and decode as the engineers' terms; why cache memory scales with context length and with the number of simultaneous conversations; context-window limits as a memory limit.
- **Check question:** "Why is the KV cache used?" Correct: so the model does not re-process the whole conversation for every new token.

#### Module 8 — Hardware and performance

- **You need this if:** you are shown a hardware quote, or told a system will be "too slow".
- **Relies on:** modules 6 and 7.
- **Key idea:** Three things decide performance. Memory capacity decides whether a model fits. Memory bandwidth decides how fast it writes. The processor decides how fast it reads, and how many people it can serve at once.
- **Main visual — tank, pipe and workers.** A memory tank holding the weights grid; a pipe to the processor whose width is the memory bandwidth; a row of workers (the processor). Each generated token is one full sweep of the weights through the pipe.
  - Slider 1: model size (changes how much must flow per token).
  - Slider 2: bandwidth (pipe width), with presets from table 7.3.
  - Toggle: CPU (few workers, narrow pipe) vs. GPU (many workers, wide pipe).
  - Readout: "fits / does not fit" and an estimated tokens per second, computed as in section 7.7 and labelled "rough estimate".
- **Second visual — the hardware ladder with power.** The same five rungs as module 2, now as a table-plus-bars showing for each: memory, bandwidth, power under inference load, indicative electricity cost per year if run continuously, and measured performance (both in 7.4). Include a one-line scale comparison for power, for example "about one bright light bulb" for the smallest rung and "about five electric ovens running flat out" for the largest (illustrative comparisons; label them).
- **Third, small visual — sharing the sweep (batching).** One sweep of the weights can produce a token for many users at once. Show 1 user and 10 users: each user's speed drops slightly, total output rises several-fold. Quote the measured example in 7.4.
- **Cover in prose:** capacity versus bandwidth as "how big is the tank" versus "how wide is the pipe"; why a GPU beats a CPU for this work; why a machine with a lot of memory but a narrow pipe can run a large model slowly; why serving many users is far more efficient than the single-user speed suggests; power, cooling and hosting as real costs at the top of the ladder.
- **Decisions:**
  - Ask of any hardware proposal: what model will it run, for how many people at once, at what speed? A price alone tells you little.
  - Small machines are for individuals and small teams and for sensitive work that must stay on site. Large machines only make sense when they are kept busy.
  - Above desk scale, you are also buying a power supply, cooling and somewhere to put it.
- **Detail panel:** bandwidth figures for each rung; why multi-GPU machines need fast links between GPUs; time to first token as a compute question, tokens per second as a bandwidth question; why published benchmarks are hard to compare (model, precision, software and concurrency all differ).
- **Check question:** "A machine has plenty of memory but low memory bandwidth. What happens with a large model?" Correct: it runs, but writes slowly.

#### Module 9 — Dense vs. MoE models

- **You need this if:** you see a model described like "35B-A3B" or hear "mixture of experts".
- **Relies on:** module 8.
- **Key idea:** A dense model uses all of its numbers for every token. A mixture-of-experts (MoE) model keeps many specialist groups and consults only a few for each token. It still has to fit in memory in full, but it writes much faster.
- **Main visual — weights lighting up.** Two weights grids side by side generating the same sentence, token by token. Dense: the whole grid lights for every token. MoE: the grid is divided into labelled expert blocks; a small "router" picks a few per token and only those light. Under each: "memory needed" (similar) and "read per token" (very different), and a tokens-per-second readout using the module 8 estimate.
- **Cover in prose:** total parameters decide whether it fits (module 6); active parameters decide how fast it writes (module 8); how to read a name such as "35B-A3B" (35 billion in total, about 3 billion active per token); MoE is how many large current models get usable speed; the trade is that an MoE model is generally less capable than a dense model of the same total size, but far more capable than a dense model of its active size (state this as a general tendency, not a rule).
- **Measured example (7.4):** on the same desk-sized machine, a dense 27-billion-parameter model wrote about 8 tokens per second; an MoE model with 35 billion parameters in total and about 3 billion active wrote about 30. Note on the page that the two were measured at different precisions and are different models, so this illustrates the direction, not an exact ratio.
- **Analogy (optional, one only):** a hospital with every specialist on site, where each patient sees only the two or three they need. Say where it breaks: the experts are not tidy human-style specialisms.
- **Decisions:**
  - Two models with similar "size" can differ several-fold in speed on the same hardware. Ask whether a model is dense or MoE, and its active size.
  - MoE helps speed, not fit. It does not let a model run on a smaller machine.
- **Detail panel:** routers and top-k expert selection; why all experts must stay loaded; MoE and batching.
- **Check question:** "An MoE model has 120 billion parameters with 12 billion active. Which number decides whether it fits in memory?" Correct: 120 billion.

#### Module 10 — Quantisation

- **You need this if:** you are told a model has been "quantised" or see labels like "4-bit", "Q4", "FP8".
- **Relies on:** modules 6 and 8.
- **Key idea:** Quantisation stores each of the model's numbers less precisely. The model gets smaller and faster, at a small cost in quality. It is how large models are made to fit on modest hardware.
- **Main visual — the precision slider.** One slider: 16-bit, 8-bit, 4-bit, 2-bit. Three things respond together:
  1. a row of example weights shown as numbers that visibly round (for example 0.7384 → 0.74 → 0.75 → 1);
  2. the model block from module 6 shrinking inside a memory bar (size = parameters × bits ÷ 8), with "fits / does not fit" updating;
  3. two gauges: speed (rising) and quality (flat from 16 to 8, slight dip at 4, clear drop at 2). The quality gauge is illustrative; label it.
- **Second, small visual:** the same photograph-style abstract pattern at four levels of colour depth, to anchor the intuition. Draw it procedurally in SVG or canvas; do not use a stock photograph.
- **Cover in prose:** a bit as one yes/no of storage; halving the bits halves the size and roughly halves what must flow through the pipe per token; 8-bit is usually close to indistinguishable, 4-bit is the common practical choice, below that quality falls away quickly (general tendencies; say so); quantisation is done once, to the model file, and is the technical team's choice to make and test.
- **Measured examples (7.4):** for one 27-billion-parameter model, the 8-bit file was about 29 GB and a 4-bit file about 17 GB; with 16 people using it at once the 4-bit version produced about 134 tokens per second in total against about 104 for 8-bit.
- **Decisions:**
  - "Can we run model X on machine Y?" often has the answer "yes, at 4-bit". Ask what was given up and how it was tested.
  - A quantised large model usually beats an unquantised small one of the same file size, but this needs checking on your own tasks.
- **Detail panel:** formats an engineer will mention (FP8, NVFP4, GGUF Q4, AWQ, INT4) as one-line entries; why some hardware runs particular formats faster; quantising the KV cache; evaluation before and after.
- **Check question:** "A model needs 54 GB at 16-bit. Roughly what does it need at 4-bit?" Correct: about 14 GB.

#### Module 11 — Putting it together

- **You need this if:** you want to turn the course into questions for a real decision.
- **Key idea:** Every choice in this course is a trade between capability, speed, cost and control. You do not need to make the technical trade-offs yourself. You need to know they exist and what to ask.
- **Main visual — the sizing explorer.** Inputs: model size (billions of parameters), dense or MoE (with active size), precision (16 / 8 / 4-bit), hardware rung (table 7.3). Outputs: does it fit; rough single-user tokens per second; purchase price; power under load; indicative electricity per year. Use the method in 7.7. Show a prominent note: "Order-of-magnitude guide for conversation with your technical team. Not a procurement tool."
- **Second visual — decision path.** A short flow that starts with "Do we need to run it ourselves at all?" (drivers: data that cannot leave, cost at high steady volume, need for a specific open model, resilience) and leads back to the module 2 grid, with each end-point listing the modules that matter for it.
- **Third element — "Questions to ask" card,** printable, grouped:
  - *About any AI product:* the four questions from module 2.
  - *About an agent:* what can it read, what can it change, what needs approval, what is logged?
  - *About results:* have we tried prompting and RAG before anything more expensive? How will we know it improved?
  - *About hardware:* which model, at what precision, for how many people at once, at what speed, drawing how much power, hosted where?
- **Decisions:** none new; this page is the summary.
- **Detail panel:** a one-paragraph recap of how modules 6 to 10 connect (fit → two phases → bandwidth → MoE and quantisation as the two ways to get more from the same machine).
- **Check question:** none. End with links back to the contents page and the glossary.

---

## 7. Data

All figures checked **13 November 2026**. Put them in `data/*.js` exactly as given, each with a `sourceId` that resolves in `data/sources.js`. All UK prices are shown including VAT (see 7.1).

### 7.1 Currency conversion and VAT

- **All UK prices in this course are shown including VAT at 20%.** Most public bodies and healthcare providers cannot reclaim VAT on hardware or off-the-shelf software, so the VAT-inclusive price is the real cost to them. State this once on the module 2 page and on the sources page, in one sentence, with the note that organisations able to reclaim VAT will pay one-sixth less.
- Where a source gave an ex-VAT price, or a US dollar list price with no tax, 20% has been added. Where the seller's VAT basis was not stated, it has been assumed to be ex VAT and 20% added; these are marked "assumed ex VAT at source".
- Exchange rate used: **$1 = £0.74** (interbank rate was about £0.743 on 6 to 9 November 2026). Source S20.
- Figures marked "converted" are a US dollar price × 0.74 × 1.2, rounded. Label such figures "converted from USD" on the page.
- Record in `data/*.js` both the VAT-inclusive figure shown and the original figure with its currency and basis, so the conversion can be audited.

### 7.2 Module 2 — arrangements and example UK costs

| Arrangement | Model owner | GPU owner | How you pay | Where your data goes |
|---|---|---|---|---|
| Chat subscription | Vendor | Vendor | Per seat, per month | To the vendor |
| API access | Vendor | Vendor | Per token | To the vendor |
| Open model on a rented cloud GPU | Open weights; you run it | Cloud provider | Per GPU-hour, busy or not | To a machine you control in someone else's data centre |
| Open model on your own hardware | Open weights; you run it | You | Purchase, then power and hosting | Stays with you |

**Example costs (all inc VAT)**

Chat subscription (per seat, per month):

| Product | UK price inc VAT | Original figure and basis | Source |
|---|---|---|---|
| Claude Team, standard seat | £18 billed annually; £22.50 billed monthly | As listed; vendor UK page price includes VAT; checked 13 Oct 2026 | S1 |
| ChatGPT Business, standard seat | £18 billed annually; £21.60 billed monthly | £15 and £18; assumed ex VAT at source | S2 |
| Microsoft 365 Copilot Business | £19.32, paid yearly | £16.10 ex VAT; needs a Microsoft 365 licence underneath | S2, S3 |

Worked example for the page: 50 standard seats at £18 a month is £900 a month, £10,800 a year.

API access (per million tokens, converted from USD list prices):

| Tier | Input, inc VAT | Output, inc VAT | USD list | Source |
|---|---|---|---|---|
| Cheapest small models | about £0.09 | about £0.44 | $0.10 / $0.50 | S4 |
| Mid-tier models from the three largest vendors | about £1.78 | about £8.88 | $2 / $10 | S5 |
| Most expensive flagships | about £8.88 | about £44 | $10 / $50 | S4 |

Worked example for the page: 10 million tokens in and 2 million out on a mid-tier model is $40 at list, about £36 inc VAT (S4). Rule of thumb, to be labelled as such: a million tokens is very roughly 750,000 words.

Open model on a rented cloud GPU (per GPU-hour):

| Offer | UK price inc VAT | Original figure and basis | Source |
|---|---|---|---|
| One H100, specialist GPU clouds | about £1.77 to £3.54 per hour | $1.99 to $3.99 published rates, 10 Nov 2026; converted | S6 |
| One H100, large cloud, London region | about £8.02 per hour (AWS); about £13.57 per hour (Azure, UK South) | £6.68 and £11.31, checked 29 Sep 2026; assumed ex VAT at source | S7 |
| Eight-H100 server, large cloud, London region | about £64.10 per hour | £53.42; assumed ex VAT at source | S7 |
| One B200, market index | about £8.74 per hour | $9.84; converted | S8 |

Worked examples for the page (arithmetic, label as such): one H100 at £2.68 an hour for 8 hours on 21 working days is about £450 a month. An eight-H100 server in a London region running continuously (730 hours) is about £46,800 a month.

Open model on your own hardware: see 7.3.

### 7.3 Hardware ladder

| # | Rung | UK price inc VAT | Original figure and basis | Memory for the model | Memory bandwidth | Sources |
|---|---|---|---|---|---|---|
| 1 | Desk-sized AI computer (NVIDIA DGX Spark, one unit) | £5,250 to £6,399 | Retail, inc VAT | 128 GB unified | 273 GB/s | S9, S10 |
| 2 | Two of the above, linked | £12,845 | Retail, inc VAT | 256 GB | 273 GB/s each | S9 |
| 3 | Deskside workstation (NVIDIA DGX Station GB300 class) | about £75,000 to £109,000 | US list prices of $85,000 to $122,851; converted; no UK list price found | 748 GB in total, of which 252 GB is fast GPU memory | 7.1 TB/s (GPU memory); 396 GB/s (the rest) | S11, S12 |
| 4 | Rack server, 8 × H200 GPUs | about £323,000 to £415,000 | UK reseller "from" prices of £269,060 to £346,157; assumed ex VAT at source | 1,128 GB (8 × 141 GB) | 4.8 TB/s per GPU | S13, S14, S16 |
| 5 | Rack server, 8 × B300 GPUs (NVIDIA DGX B300) | about £575,000 to £618,000; some UK listings far higher | £617,999 inc VAT (£514,999 ex) at one UK retailer; £479,169 "from" price at another, assumed ex VAT at source | 2,304 GB (8 × 288 GB) | up to 8 TB/s per GPU | S13, S15, S14 |

Notes for the page:

- Rung 3 has no UK list price. NVIDIA does not sell it directly; partner-built versions are sold on quote. A European reseller range of €88,000 to €110,500 ex VAT is a second reference (S12). Show the converted figure with that caveat.
- Rung 5 prices vary widely between UK sellers for the same machine: from about £575,000 up to about £1.16 million inc VAT (£963,747 ex VAT at the highest listing) (S14, S15). Show the lower cluster and state that quotes vary.
- The price range from rung 1 to rung 5 is roughly 100-fold.

### 7.4 Power under inference load, and measured performance

| # | Rung | Power while generating | Rated maximum | Indicative electricity per year, run continuously at 30p/kWh inc VAT | Sources |
|---|---|---|---|---|---|
| 1 | One desk-sized unit | about 60 to 170 W (typically around 100 W) | 240 W power supply | about £260 (at 100 W) | S17, S18 |
| 2 | Two linked | about 120 to 340 W | 2 × 240 W | about £530 (at 200 W) | derived from rung 1 |
| 3 | Deskside workstation | up to about 1.0 to 1.2 kW at full load; idle about 200 W | 1,600 W power supply | about £2,900 (at 1.1 kW) | S11 |
| 4 | 8 × H200 server | about 10 to 10.5 kW | about 10.2 kW system maximum | about £26,800 (at 10.2 kW) | S16, S19 |
| 5 | 8 × B300 server | about 14.5 to 15 kW, peaks near 19.7 kW | — | about £38,100 (at 14.5 kW) | S16 |

Notes:

- Rung 1 measurements differ by reviewer and workload: 60 to 90 W in many LLM inference runs, 135 to 170 W under heavier AI load. Show the range.
- Rung 3: no measured inference-only figure was found; the figure is a stress-test maximum. Label it "at full load".
- Rungs 4 and 5: electricity excludes cooling. For a hosted eight-GPU server, published estimates of total yearly running cost (energy, hosting, support) are about $35,000 to $145,000, roughly £31,000 to £129,000 converted (S21).
- Electricity rate: the UK average business rate was 24.14p per kWh ex VAT in Q1 2026 government data, about 29p with VAT; November 2026 quotes were higher. The page uses 30p inc VAT as a round illustration and says so (S22, S23).

**Measured performance to quote (all from published tests; each is one model on one setup)**

| Where used | Figure | Source |
|---|---|---|
| Modules 7, 9 | Rung 1, dense 27-billion-parameter model at 8-bit: reads prompts at about 1,900 tokens/s, writes about 8 tokens/s for one user | S24 |
| Module 8 (batching) | Same test: 10 users at once got about 7 tokens/s each, 58 tokens/s in total | S24 |
| Module 9 | Rung 1, MoE model, 35 billion total, about 3 billion active, 16-bit: about 30 tokens/s for one user | S25 |
| Module 10 | Same 27B model: 8-bit file about 29 GB, 4-bit file about 17 GB | S24 |
| Module 10 | Same 27B model, 16 users at once: about 134 tokens/s in total at 4-bit against about 104 at 8-bit | S26 |
| Module 8 | Rung 1, 120-billion-parameter MoE model at 4-bit: about 61 tokens/s for one user, 116 to 153 in total for 8 users | S27 |
| Module 8 | Rung 4 (8 × H200): estimated 80 to 120 simultaneous chat users at about 12,400 tokens/s in total on one large MoE model (a sizing estimate, not a measurement; label it) | S28 |
| Module 8 | 8 × H200 against 8 × B200 on the same large model, 1,024 simultaneous requests: about 6,700 against about 9,900 tokens/s in total | S29 |

No published benchmark for rung 5 (8 × B300) was found. Use the B200 comparison above as the nearest evidence and say that B300 is the newer, larger-memory generation. Add this to `OPEN-ITEMS.md`.

### 7.5 "Prices move" examples (module 2)

- The desk-sized unit launched in the UK at about £3,700 inc VAT in October 2025 and retailed at £5,250 to £6,399 in November 2026 (S30, S9, S10).
- One rental index for a single H100 rose from $2.00 an hour in December 2025 to $3.01 in November 2026 (S31).

### 7.6 Reference bandwidth for "CPU with ordinary memory" (module 8)

No sourced figure. Use "tens of GB/s" in words, mark it as a typical order of magnitude, and do not put a precise number on it.

### 7.7 Estimation method for the interactive visuals (modules 8, 9, 11)

- **Model size in GB** = total parameters (billions) × bits ÷ 8.
- **Fits** if model size × 1.15 ≤ memory for the model (15% headroom for the KV cache and working space). "Tight" if between 1.0 and 1.15.
- **Data read per token in GB** = active parameters (billions) × bits ÷ 8. For a dense model, active = total.
- **Single-user tokens per second** ≈ 0.7 × total memory bandwidth (GB/s) ÷ data read per token (GB). For multi-GPU rungs use the per-GPU bandwidth × number of GPUs, and a factor of 0.6.
- Sanity check to keep as a comment in the code: rung 1, dense 27B at 8-bit → 0.7 × 273 ÷ 27 ≈ 7 tokens/s, against about 8 measured.
- Round results to one significant figure below 10 and two above. Always show the label "rough estimate". This is a teaching model; say on the page that real speed depends on software and settings.

### 7.8 Sources

| ID | Title | URL |
|---|---|---|
| S1 | Streamlined Analytics: Claude vs ChatGPT for business, UK prices | https://streamlinedanalytics.co.uk/articles/claude-vs-chatgpt/ |
| S2 | Duncan Boyne: ChatGPT, Claude or Copilot | https://duncanboyne.co.uk/blog/chatgpt-claude-or-copilot-for-business/ |
| S3 | QuantSpark: AI tool pricing in the UK | https://quantspark.ai/guides/ai-tool-pricing |
| S4 | Digital Tatva: LLM API pricing comparison 2026 | https://digitaltatva.com/llm-api-pricing-comparison/ |
| S5 | The Frontier Wire: LLM API pricing compared (October 2026) | https://thefrontierwire.com/articles/llm-api-pricing-compared/ |
| S6 | Compare the Cloud: Rent H100 GPUs or buy an NVIDIA DGX B300 in the UK | https://www.comparethecloud.net/articles/renting-h100-gpus-or-buying-an-nvidia-dgx-b300-for-uk-ai-teams |
| S7 | Compare the Cloud: Rent or buy GPU capacity for UK AI training | https://www.comparethecloud.net/articles/renting-gpu-capacity-by-the-hour-or-buying-an-nvidia-dgx-system |
| S8 | Ornn: GPU cloud price comparison | https://data.ornn.com/gpu-cloud-price-comparison |
| S9 | Scan: NVIDIA DGX Spark | https://www.scan.co.uk/shop/computer-hardware/workstations-ai/nvidia-dgx-spark |
| S10 | CCL: NVIDIA DGX Spark | https://www.cclonline.com/dgxspark-founedit-uk-nvidia-dgx-spark-gb10-128-gb-lpddr5x-sdram-4-tb-ssd-dgx-os-workstation-gold-510831/ |
| S11 | Bizon: AI Station with NVIDIA GB300 | https://bizon-tech.com/gb300.html |
| S12 | Spheron: DGX Station GB300 price; QDNA: DGX Station GB300 | https://www.spheron.network/blog/dgx-station-gb300-vs-renting-gb300-nvl72-break-even-guide-20/ and https://qdna.fr/en/architecture/materiel/dgx-station |
| S13 | Scan: NVIDIA DGX appliances | https://www.scan.co.uk/3xs/enterprise/deep-learning/nvidiadgxappliances |
| S14 | Broadberry: 8U servers | https://www.broadberry.co.uk/8u-rackmount-servers |
| S15 | Servermall UK: servers with GPU | https://servermall.com/en-gb/sets/servers-with-gpu/ |
| S16 | Enzu: NVIDIA data center GPUs compared | https://enzu.com/nvidia-data-center-gpus.php |
| S17 | ServeTheHome: NVIDIA DGX Spark review (power) | https://www.servethehome.com/nvidia-dgx-spark-review-the-gb10-machine-is-so-freaking-cool/4/ |
| S18 | Signal65: DGX Spark first look; Classmethod: two months with DGX Spark | https://signal65.com/research/nvidia-dgx-spark-first-look-a-personal-ai-supercomputer-on-your-desk/ and https://dev.classmethod.jp/en/articles/dgx-spark-use-case-guide/ |
| S19 | Spheron: AI inference power consumption 2026 | https://www.spheron.network/blog/ai-inference-power-electricity-cost-2026/ |
| S20 | Best Exchange Rates: USD to GBP | https://bestexchangerates.com/rates/USD/GBP/ |
| S21 | Haink: AI server cost 2026 | https://haink.org/knowledge/technology/ai-infrastructure-cost-guide |
| S22 | Utility Bidder: business electricity rates | https://www.utilitybidder.co.uk/business-electricity/ |
| S23 | Purely Energy: how to compare business electricity deals | https://www.purelyenergy.co.uk/energy-hub/how-to-compare-business-electricity-deals-uk-small-businesses |
| S24 | Kubesimplify: Running Qwen3.8-27B on DGX Spark | https://blog.kubesimplify.com/qwen3-8-27b-on-dgx-spark |
| S25 | pi3g: DGX Spark benchmarking of 14 open-weight models | https://pi3g.com/dgx-spark-benchmarking-on-inference-performance-of-14-open-weight-models/ |
| S26 | GPUwerk: DGX Spark benchmarks | https://gpuwerk.com/docs/benchmarks/ |
| S27 | GPUwerk: llama.cpp vs vLLM vs SGLang on DGX Spark | https://gpuwerk.com/dgx-spark/guides/choosing-inference-engine-llama-cpp-vllm-sglang/ |
| S28 | Iternal: GPU sizing for LLMs 2026 | https://iternal.ai/hardware-sizing-guide |
| S29 | Metrum AI: Llama 4 Maverick on H200 vs B200 | https://www.metrum.ai/blog/llama-h200-v-b200-performance |
| S30 | Rost Glukhov: DGX Spark launch prices | https://www.glukhov.org/hardware/ai/nvidia-dgx-spark-prices/ |
| S31 | gr1d: Rent or buy GPU servers in 2026 | https://gr1d.us/insights/rent-vs-buy-gpu-servers |

Source quality note: several of these are trade blogs and reseller pages, not primary sources. Before publishing widely, re-check the prices in 7.2 and 7.3 against the vendor or retailer page directly and update the checked date. `sources.html` should say this plainly.

---

## 8. Content rules

- UK English spelling throughout ("quantisation", "organisation", "colour").
- Define every glossary term on first use on each page.
- Name vendors and products only where a price or measurement needs it. Otherwise describe the category ("a chat subscription", "a desk-sized AI computer"). The course should not read as a recommendation of any vendor.
- No figure without a source or an "illustrative" label.
- No invented quotations, case studies or statistics.
- Do not describe any specific organisation's policies, systems or data. Examples are generic office tasks.
- Do not overstate: where something is a general tendency (quality loss at 4-bit, MoE versus dense capability), say "generally" and put the caveat in the detail panel.
- State once, on the contents page and the sources page, that the course was drafted with AI assistance and that figures were checked on the stated date.

---

## 9. Acceptance checks

Run these before declaring the build finished, and report the result of each.

1. Every page loads from GitHub Pages under a project path with no 404s for assets (all paths relative; `.nojekyll` present).
2. Every page also opens correctly from disk by double-click.
3. With JavaScript disabled, all module text is readable and Contents / Previous / Next links work.
4. No network requests to any other origin (check the browser network panel).
5. At 360px, 768px and 1280px widths: no horizontal scroll, all visuals legible, sidebar behaves as specified.
6. Keyboard only: every control reachable and operable; focus visible.
7. `prefers-reduced-motion`: no auto-playing animation; steppers work.
8. Light and dark schemes both pass AA contrast for text.
9. Every number on every page traces to section 7 or carries an "illustrative" label. Produce a list of every figure shown, with page and source ID, in `FIGURES.md`.
10. The arithmetic in the worked examples and the estimator matches section 7 (unit-test the functions in 7.7 against the sanity check given).
11. Every glossary link resolves; every source ID resolves.
12. Each module's top layer is within 350 to 500 words (report the counts).
13. Print preview of a module shows the detail panel open and no navigation.
14. Spell-check passes in UK English.

---

## 10. Build order and review checkpoints

1. Scaffold: file tree, `site.css`, `site.js`, data files populated from section 7, contents page, page template with all shared components, glossary and sources pages.
2. Build **module 2** in full (it uses the most shared parts: zones, cost chips, ladder, data files).
3. **Checkpoint 1: stop and ask the owner to review** the look, the two-layer pattern and module 2 before building further.
4. Build modules 1, 3, 4, 5 (Part A).
5. Build modules 6, 7, 8 (the core of Part B; module 7's timeline and module 8's tank-and-pipe are the two most important visuals in the course, so spend the effort there).
6. Build modules 9, 10, 11.
7. **Checkpoint 2: stop for review** of all visuals.
8. Run the acceptance checks, write `FIGURES.md`, `README.md` and `OPEN-ITEMS.md`.
9. Set up GitHub Pages to publish from the default branch root, and report the URL.

Commit after each numbered step with a clear message.

---

## 11. Open items for the owner

Seed `OPEN-ITEMS.md` with these:

1. **Own measurements.** If you have measured tokens per second, concurrency and power draw from your own hardware, they should replace the published figures in 7.4 for rung 1.
2. **Deskside workstation UK price.** No UK list price was found for rung 3. A UK reseller quote would replace the converted figure.
3. **VAT assumptions.** All prices are shown inc VAT. Several sellers did not state their basis and were assumed to be ex VAT (marked in section 7); confirm these against the seller pages.
4. **Top-rung benchmark.** No published inference benchmark for an 8 × B300 server was found.
5. **Vendor naming.** Confirm you are content for named products to appear in the price tables.
6. **Course title.** Agreed: "Just Enough AI: A Manager's Guide to Commissioning AI Capability". Short form for the sidebar and browser tab: "Just Enough AI".
