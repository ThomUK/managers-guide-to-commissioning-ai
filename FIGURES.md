# Figures shown in the course

Every number shown on every page, with the page it appears on and where it comes from.
Figures checked 13 November 2026. Source IDs resolve in `data/sources.js` and on `sources.html`; section numbers refer to `SPEC.md`.

"Illustrative" means the page labels the figure as illustrative, assumed or a rule of thumb. "Derived" means simple arithmetic on sourced figures. "Computed" means produced by the teaching formulas in SPEC 7.7 (`assets/js/estimate.js`) and labelled "rough estimate" on the page.

## Module 2: Local AI vs. cloud AI

| Figure | Shown as | Original figure and basis | Source |
|---|---|---|---|
| Chat subscription: Claude Team, standard seat | £18 billed annually; £22.50 billed monthly | £18 and £22.50 as listed. Vendor UK page price includes VAT. Checked 13 October 2026. | S1 |
| Chat subscription: ChatGPT Business, standard seat | £18 billed annually; £21.60 billed monthly | £15 and £18. Assumed ex VAT at source; 20% added. | S2 |
| Chat subscription: Microsoft 365 Copilot Business | £19.32 paid yearly | £16.10 ex VAT. 20% VAT added. Needs a Microsoft 365 licence underneath. | S2, S3 |
| API access: Cheapest small models | about £0.09 input; about £0.44 output | $0.10 input and $0.50 output per million tokens. USD list price, converted from USD at $1 = £0.74, plus 20% VAT. | S4 |
| API access: Mid-tier models from the three largest vendors | about £1.78 input; about £8.88 output | $2 input and $10 output per million tokens. USD list price, converted from USD at $1 = £0.74, plus 20% VAT. | S5 |
| API access: Most expensive flagships | about £8.88 input; about £44 output | $10 input and $50 output per million tokens. USD list price, converted from USD at $1 = £0.74, plus 20% VAT. | S4 |
| Open model on a rented cloud GPU: One H100 GPU, specialist GPU clouds | about £1.77 to £3.54 per hour | $1.99 to $3.99 per hour, published rates on 10 November 2026. Converted from USD at $1 = £0.74, plus 20% VAT. | S6 |
| Open model on a rented cloud GPU: One H100 GPU, large cloud, London region | about £8.02 per hour (AWS); about £13.57 per hour (Azure, UK South) | £6.68 and £11.31 per hour, checked 29 September 2026. Assumed ex VAT at source; 20% added. | S7 |
| Open model on a rented cloud GPU: Eight-H100 server, large cloud, London region | about £64.10 per hour | £53.42 per hour. Assumed ex VAT at source; 20% added. | S7 |
| Open model on a rented cloud GPU: One B200 GPU, market index | about £8.74 per hour | $9.84 per hour. Converted from USD at $1 = £0.74, plus 20% VAT. | S8 |
| Worked example: 50 seats | £900 a month, £10,800 a year | 50 × £18 × 12 | Derived (S1, S2) |
| Worked example: API | $40 at list, about £36 inc VAT | 10M × $2 + 2M × $10, × 0.74 × 1.2 | Derived (S4, S5) |
| Rule of thumb: words per million tokens | very roughly 750,000 words | Rule of thumb, labelled as such | Illustrative (SPEC 7.2) |
| Worked example: one H100 | about £450 a month | £2.68 × 8 hours × 21 days; £2.68 is a mid-range rate within £1.77 to £3.54 | Derived (S6); see OPEN-ITEMS 8 |
| Worked example: eight-H100 server | about £46,800 a month | £64.10 × 730 hours | Derived (S7) |
| Prices move: desk-sized unit | about £3,700 (Oct 2025) to £5,250 to £6,399 (Nov 2026) | Launch and retail prices inc VAT | S30, S9, S10 |
| Prices move: H100 rental index | $2.00 (Dec 2025) to $3.01 (Nov 2026) an hour | One rental index, USD | S31 |
| Hosted eight-GPU server, yearly running cost | roughly £31,000 to £129,000 | $35,000 to $145,000 a year (energy, hosting, support). Published estimates, converted from USD at $1 = £0.74, plus 20% VAT. | S21 |
| VAT | 20%; one-sixth less if reclaimable | UK standard rate; 20 ÷ 120 | SPEC 7.1 |
| Top rung against bottom rung | roughly 100 times | £575,000 ÷ £5,250 | Derived (S9, S13, S14) |
| Ladder rung 1 (Desk-sized AI computer): price | £5,250 to £6,399 | £5,250 to £6,399 UK retail. Retail prices, already including VAT. | S9, S10 |
| Ladder rung 1: memory | 128 GB | unified memory | S9, S10 |
| Ladder rung 1: power while generating | about 100 W | about 60 to 170 W (typically around 100 W); rated 240 W power supply | S17, S18 |
| Ladder rung 2 (Two desk-sized units, linked): price | £12,845 | £12,845 UK retail. Retail price, already including VAT. | S9 |
| Ladder rung 2: memory | 256 GB | 128 GB in each unit | S9 |
| Ladder rung 2: power while generating | about 200 W | about 120 to 340 W; rated 2 × 240 W power supplies | S17, S18 |
| Ladder rung 3 (Deskside workstation): price | about £75,000 to £109,000 | US list prices of $85,000 to $122,851. Converted from USD at $1 = £0.74, plus 20% VAT. No UK list price found: partner-built versions are sold on quote. A European reseller range of €88,000 to €110,500 ex VAT is a second reference. | S11, S12 |
| Ladder rung 3: memory | 748 GB | of which 252 GB is fast GPU memory | S11, S12 |
| Ladder rung 3: power while generating | up to about 1.1 kW at full load | up to about 1.0 to 1.2 kW at full load; idle about 200 W; rated 1,600 W power supply | S11 |
| Ladder rung 4 (Rack server, 8 × H200 GPUs): price | about £323,000 to £415,000 | UK reseller “from” prices of £269,060 to £346,157. Assumed ex VAT at source; 20% added. | S13, S14, S16 |
| Ladder rung 4: memory | 1,128 GB | 8 × 141 GB | S13, S14, S16 |
| Ladder rung 4: power while generating | about 10 kW | about 10 to 10.5 kW; rated about 10.2 kW system maximum | S16, S19 |
| Ladder rung 5 (Rack server, 8 × B300 GPUs): price | about £575,000 to £618,000 | £617,999 inc VAT (£514,999 ex) at one UK retailer; £479,169 “from” price at another. The “from” price is assumed ex VAT at source; 20% added. Quotes vary widely: some UK listings for the same machine reach about £1.16 million inc VAT (£963,747 ex VAT). | S13, S15, S14 |
| Ladder rung 5: memory | 2,304 GB | 8 × 288 GB | S13, S15, S14 |
| Ladder rung 5: power while generating | about 14.5 to 15 kW | about 14.5 to 15 kW, peaks near 19.7 kW | S16 |

## Module 6: What a model physically is

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| Machine memory, rungs 1 to 5 | 128, 256, 748 (252 fast), 1,128, 2,304 GB | As module 2 ladder | S9, S11, S13, S16 |
| Model sizes | 4B, 12B, 27B, 70B, 120B, 400B | Example sizes | Illustrative (SPEC module 6) |
| Frontier-scale model | 2,000B | Assumption; makers do not publish sizes | Illustrative; OPEN-ITEMS 10 |
| Ordinary office computer | 32 GB of ordinary memory | Typical figure | Illustrative; OPEN-ITEMS 10 |
| Model size in GB | parameters × bits ÷ 8 (for example 27B at 16-bit = 54 GB; 70B = 140 GB) | Formula | Computed (SPEC 7.7) |
| Working space | extra 15%; "tight" between 1.0 and 1.15 | Teaching rule of thumb | SPEC 7.7 |
| Servers needed for one frontier copy | two of the top-rung servers | 4,000 GB × 1.15 ÷ 2,304 GB, rounded up | Computed |

## Module 7: How a response gets made

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| Prompt reading speed | about 1,900 tokens per second | Rung 1, dense 27B at 8-bit | S24 |
| Writing speed | about 8 tokens per second | Same test, one user | S24 |
| Reading and writing times | 4,000 tokens in about two seconds; 500 tokens in about a minute | 4,000 ÷ 1,900; 500 ÷ 8 | Derived (S24) |
| Animation: prompt and answer lengths, timings | 8, 20 or 40 prompt tokens; 6 or 14 answer tokens | Made-up units, not to scale | Illustrative |

## Module 8: Hardware and performance

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| Rung 1: bandwidth | 273 GB/s | Published specification | S9, S10 |
| Rung 1: power | about 60 to 170 W (typically around 100 W) | Measurements differ by reviewer and workload: 60 to 90 W in many LLM inference runs, 135 to 170 W under heavier AI load. | S17, S18 |
| Rung 1: electricity per year | about £260 | at 100 W × 8,760 hours × 30p per kWh | Derived (S17, S18; S22, S23) |
| Rung 2: bandwidth | 273 GB/s each | Published specification | S9 |
| Rung 2: power | about 120 to 340 W | Derived from rung 1. | S17, S18 |
| Rung 2: electricity per year | about £530 | at 200 W × 8,760 hours × 30p per kWh | Derived (S17, S18; S22, S23) |
| Rung 3: bandwidth | 7.1 TB/s (GPU memory); 396 GB/s (the rest) | Published specification | S11, S12 |
| Rung 3: power | up to about 1.0 to 1.2 kW at full load; idle about 200 W | No measured inference-only figure was found; this is a stress-test maximum. | S11 |
| Rung 3: electricity per year | about £2,900 | at 1.1 kW × 8,760 hours × 30p per kWh | Derived (S11; S22, S23) |
| Rung 4: bandwidth | 4.8 TB/s per GPU | Published specification | S13, S14, S16 |
| Rung 4: power | about 10 to 10.5 kW | Excludes cooling. | S16, S19 |
| Rung 4: electricity per year | about £26,800 | at 10.2 kW × 8,760 hours × 30p per kWh | Derived (S16, S19; S22, S23) |
| Rung 5: bandwidth | up to 8 TB/s per GPU | Published specification | S13, S15, S14 |
| Rung 5: power | about 14.5 to 15 kW, peaks near 19.7 kW | Excludes cooling. | S16 |
| Rung 5: electricity per year | about £38,100 | at 14.5 kW × 8,760 hours × 30p per kWh | Derived (S16; S22, S23) |
| Measured, rung 1 | Same test: with 10 users at once, about 58 tokens per second in total. | Published test: one model on one setup | S24 |
| Measured, rung 1 | 120-billion-parameter MoE model at 4-bit: about 61 tokens per second for one user, 116 to 153 in total for 8 users. | Published test: one model on one setup | S27 |
| Measured, rung 4 | Estimated 80 to 120 simultaneous chat users at about 12,400 tokens per second in total on one large MoE model (a sizing estimate, not a measurement). | Sizing estimate, labelled as such | S28 |
| Measured, rung 4 | 8 × H200 against 8 × B200 on the same large model, 1,024 simultaneous requests: about 6,700 against about 9,900 tokens per second in total. | Published test: one model on one setup | S29 |
| Batching chart | 1 user about 8 tokens/s; 10 users about 58 in total; "about seven times" | 58 ÷ 8 | S24; derived. See OPEN-ITEMS 7 |
| Electricity rate | 30p per kWh inc VAT | Round illustration; 24.14p ex VAT average in Q1 2026, about 29p with VAT | Illustrative (S22, S23) |
| Power comparisons | one old-style 100 W light bulb; five electric ovens | Scale comparisons | Illustrative |
| CPU bandwidth | tens of GB/s | Typical order of magnitude, in words only | No sourced figure (SPEC 7.6) |
| Tank and pipe: speed readout | "about N tokens per second", capped at 100+ | 0.7 (or 0.6) × bandwidth ÷ GB read per token | Computed (SPEC 7.7) |
| Tank and pipe: model sizes | 4B to 400B at 16-bit | Example sizes | Illustrative |

## Module 9: Dense vs. MoE models

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| Dense model speed | about 8 tokens per second | Rung 1, dense 27B at 8-bit | S24 |
| MoE model speed | about 30 tokens per second | Rung 1, 35B total, about 3B active, 16-bit | S25 |
| Visual: memory needed | 70 GB for both | 35B × 16 ÷ 8 | Computed (SPEC 7.7) |
| Visual: read per token | 70 GB dense; 6 GB MoE | 35B and 3B × 16 ÷ 8 | Computed (SPEC 7.7) |
| Visual: speed | about 3 and about 32 tokens per second | 0.7 × 273 ÷ 70 and ÷ 6 | Computed (SPEC 7.7; S9) |
| Visual: experts | twelve experts, two chosen | Simplification | Illustrative |
| Check question | 120 billion total, 12 billion active | Example | Illustrative (SPEC module 9) |

## Module 10: Quantisation

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| File sizes, 27B model | 8-bit about 29 GB; 4-bit about 17 GB | Published test | S24 |
| Average bits in the 4-bit file | about 5 bits per number | 17 GB × 8 ÷ 27 billion | Derived (S24) |
| Throughput, 16 users | about 134 tokens/s at 4-bit; about 104 at 8-bit | Published test | S26 |
| Slider: model size | 120B: 240, 120, 60, 30 GB at 16, 8, 4, 2 bits, in 128 GB | parameters × bits ÷ 8 | Computed (SPEC 7.7; S9) |
| Slider: speed | 2, 4, 8 times the 16-bit speed | Data per token halves with the bits | Computed (SPEC 7.7) |
| Slider: example numbers and quality gauge | 0.7384 and others; gauge positions | Made up | Illustrative |
| Pattern | 256, 16, 4, 2 shades | Drawn pattern | Illustrative |
| Check question | 54 GB at 16-bit, about 14 GB at 4-bit | 54 ÷ 4 | Derived (SPEC module 10) |

## Module 11: Putting it together

| Figure | Shown as | Basis | Source |
|---|---|---|---|
| Sizing explorer: fit and speed | fits / tight / does not fit; "about N tokens per second" | Formulas | Computed (SPEC 7.7) |
| Sizing explorer: price, power, electricity | As module 2 ladder and module 8 | As above | S9 to S19, S22, S23 |
| Sizing explorer: model and active sizes | 4B to 400B; 3B to 40B active | Example sizes | Illustrative |

## Modules 1, 3, 4 and 5

| Page | Figure | Shown as | Source |
|---|---|---|---|
| Module 1 | Token length | roughly three-quarters of a word | Rule of thumb (SPEC module 1) |
| Module 1 | Candidate tokens and probabilities; 28-token passage | Hand-written table | Illustrative |
| Module 3 | Overdue invoices; ten steps | seven invoices | Illustrative |
| Module 4 | Tests | 12 passed, 1 failed; 13 passed | Illustrative |
| Module 5 | Time to try | minutes; days to weeks; weeks to months | Illustrative (indicative) |

## Sources page and footers

| Figure | Shown as | Source |
|---|---|---|
| Exchange rate | $1 = £0.74; interbank about £0.743 on 6 to 9 November 2026 | S20 |
| VAT | 20%; conversion is USD × 0.74 × 1.2 | SPEC 7.1 |
| Electricity | 30p per kWh inc VAT; 24.14p ex VAT in Q1 2026; about 29p with VAT | S22, S23 |
| Checked date | 13 November 2026 | SPEC 7 |
