/* Hardware ladder (SPEC.md 7.3, 7.4): price, memory, bandwidth, power, measured performance.
   "est" holds the inputs for the teaching estimator (7.7):
     bandwidthGbs = bandwidth used for one user's stream, factor = efficiency factor.
   Simplifications agreed with the owner:
     - rung 2 (two linked units) gains capacity, not speed: one unit's bandwidth, factor 0.6;
     - rung 3 uses the fast figure only if the model fits in its 252 GB of GPU memory,
       otherwise the slower figure for the rest of its memory. */
window.JEAI_HARDWARE = {
  checked: "13 November 2026",
  electricityRate: { pencePerKwh: 30, shown: "30p per kWh inc VAT",
    note: "A round illustration. The UK average business rate was 24.14p per kWh ex VAT in Q1 2026 government data, about 29p with VAT; November 2026 quotes were higher.",
    sourceIds: ["S22", "S23"] },

  rungs: [
    { n: 1, id: "desk", name: "Desk-sized AI computer", product: "NVIDIA DGX Spark, one unit",
      price: { low: 5250, high: 6399, shown: "£5,250 to £6,399",
        original: "£5,250 to £6,399 UK retail", basis: "Retail prices, already including VAT.", sourceIds: ["S9", "S10"] },
      memory: { gb: 128, shown: "128 GB", note: "unified memory" },
      bandwidth: { shown: "273 GB/s" },
      est: { bandwidthGbs: 273, factor: 0.7 },
      power: { shown: "about 60 to 170 W (typically around 100 W)", short: "about 100 W",
        rated: "240 W power supply", sourceIds: ["S17", "S18"],
        note: "Measurements differ by reviewer and workload: 60 to 90 W in many LLM inference runs, 135 to 170 W under heavier AI load." },
      electricity: { shown: "about £260", basis: "at 100 W", kw: 0.1 } },

    { n: 2, id: "desk2", name: "Two desk-sized units, linked", product: "Two NVIDIA DGX Spark units",
      price: { low: 12845, high: 12845, shown: "£12,845",
        original: "£12,845 UK retail", basis: "Retail price, already including VAT.", sourceIds: ["S9"] },
      memory: { gb: 256, shown: "256 GB", note: "128 GB in each unit" },
      bandwidth: { shown: "273 GB/s each" },
      est: { bandwidthGbs: 273, factor: 0.6 },
      power: { shown: "about 120 to 340 W", short: "about 200 W",
        rated: "2 × 240 W power supplies", sourceIds: ["S17", "S18"], note: "Derived from rung 1." },
      electricity: { shown: "about £530", basis: "at 200 W", kw: 0.2 } },

    { n: 3, id: "deskside", name: "Deskside workstation", product: "NVIDIA DGX Station GB300 class",
      price: { low: 75000, high: 109000, shown: "about £75,000 to £109,000",
        original: "US list prices of $85,000 to $122,851",
        basis: "Converted from USD at $1 = £0.74, plus 20% VAT. No UK list price found: partner-built versions are sold on quote. A European reseller range of €88,000 to €110,500 ex VAT is a second reference.",
        sourceIds: ["S11", "S12"] },
      memory: { gb: 748, fastGb: 252, shown: "748 GB", note: "of which 252 GB is fast GPU memory" },
      bandwidth: { shown: "7.1 TB/s (GPU memory); 396 GB/s (the rest)" },
      est: { bandwidthGbs: 7100, slowBandwidthGbs: 396, fastGb: 252, factor: 0.7 },
      power: { shown: "up to about 1.0 to 1.2 kW at full load; idle about 200 W", short: "up to about 1.1 kW at full load",
        rated: "1,600 W power supply", sourceIds: ["S11"],
        note: "No measured inference-only figure was found; this is a stress-test maximum." },
      electricity: { shown: "about £2,900", basis: "at 1.1 kW", kw: 1.1 } },

    { n: 4, id: "h200x8", name: "Rack server, 8 × H200 GPUs", product: "Eight-GPU H200 server",
      price: { low: 323000, high: 415000, shown: "about £323,000 to £415,000",
        original: "UK reseller “from” prices of £269,060 to £346,157",
        basis: "Assumed ex VAT at source; 20% added.", sourceIds: ["S13", "S14", "S16"] },
      memory: { gb: 1128, shown: "1,128 GB", note: "8 × 141 GB" },
      bandwidth: { shown: "4.8 TB/s per GPU" },
      est: { bandwidthGbs: 8 * 4800, factor: 0.6 },
      power: { shown: "about 10 to 10.5 kW", short: "about 10 kW",
        rated: "about 10.2 kW system maximum", sourceIds: ["S16", "S19"], note: "Excludes cooling." },
      electricity: { shown: "about £26,800", basis: "at 10.2 kW", kw: 10.2 } },

    { n: 5, id: "b300x8", name: "Rack server, 8 × B300 GPUs", product: "NVIDIA DGX B300",
      price: { low: 575000, high: 618000, shown: "about £575,000 to £618,000",
        original: "£617,999 inc VAT (£514,999 ex) at one UK retailer; £479,169 “from” price at another",
        basis: "The “from” price is assumed ex VAT at source; 20% added. Quotes vary widely: some UK listings for the same machine reach about £1.16 million inc VAT (£963,747 ex VAT).",
        sourceIds: ["S13", "S15", "S14"] },
      memory: { gb: 2304, shown: "2,304 GB", note: "8 × 288 GB" },
      bandwidth: { shown: "up to 8 TB/s per GPU" },
      est: { bandwidthGbs: 8 * 8000, factor: 0.6 },
      power: { shown: "about 14.5 to 15 kW, peaks near 19.7 kW", short: "about 14.5 to 15 kW",
        rated: null, sourceIds: ["S16"], note: "Excludes cooling." },
      electricity: { shown: "about £38,100", basis: "at 14.5 kW", kw: 14.5 } }
  ],

  /* Measured performance to quote. Each is one model on one setup, from published tests. */
  measured: [
    { id: "dense27", modules: [7, 9], rung: 1, sourceIds: ["S24"],
      text: "Dense 27-billion-parameter model at 8-bit: reads prompts at about 1,900 tokens per second, writes about 8 tokens per second for one user." },
    { id: "batch10", modules: [8], rung: 1, sourceIds: ["S24"],
      text: "Same test: with 10 users at once, about 58 tokens per second in total." },
    { id: "moe35", modules: [9], rung: 1, sourceIds: ["S25"],
      text: "MoE model, 35 billion parameters in total, about 3 billion active, 16-bit: about 30 tokens per second for one user." },
    { id: "files27", modules: [10], rung: 1, sourceIds: ["S24"],
      text: "Same 27-billion-parameter model: 8-bit file about 29 GB, 4-bit file about 17 GB." },
    { id: "quant16users", modules: [10], rung: 1, sourceIds: ["S26"],
      text: "Same 27-billion-parameter model, 16 users at once: about 134 tokens per second in total at 4-bit against about 104 at 8-bit." },
    { id: "moe120", modules: [8], rung: 1, sourceIds: ["S27"],
      text: "120-billion-parameter MoE model at 4-bit: about 61 tokens per second for one user, 116 to 153 in total for 8 users." },
    { id: "h200sizing", modules: [8], rung: 4, sourceIds: ["S28"], estimate: true,
      text: "Estimated 80 to 120 simultaneous chat users at about 12,400 tokens per second in total on one large MoE model (a sizing estimate, not a measurement)." },
    { id: "h200vsb200", modules: [8], rung: 4, sourceIds: ["S29"],
      text: "8 × H200 against 8 × B200 on the same large model, 1,024 simultaneous requests: about 6,700 against about 9,900 tokens per second in total." }
  ]
};
