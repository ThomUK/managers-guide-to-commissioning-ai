/* Module 2: the four arrangements and example UK costs (SPEC.md 7.1, 7.2, 7.5).
   Every price records the VAT-inclusive figure shown AND the original figure and basis,
   so each conversion can be audited. Converted = USD x 0.74 x 1.2, rounded. */
window.JEAI_PRICES = {
  checked: "13 November 2026",
  conversion: { usdToGbp: 0.74, vatRate: 0.20, sourceId: "S20",
    note: "Interbank rate was about £0.743 on 6 to 9 November 2026." },

  arrangements: [
    {
      id: "chat",
      name: "Chat subscription",
      modelOwner: { text: "Vendor", zone: "theirs" },
      gpuOwner: { text: "Vendor", zone: "theirs" },
      pay: { text: "Per seat, per month", zone: "theirs" },
      data: { text: "To the vendor", zone: "theirs" },
      payLine: "A fixed price per person per month, however much or little each person uses it.",
      goodFor: "getting many staff started quickly, at a cost you can predict.",
      watchFor: "the vendor’s terms on training and retention, and seats nobody uses.",
      costHeading: "Per seat, per month",
      costs: [
        { label: "Claude Team, standard seat",
          prices: [{ shown: "£18", note: "billed annually" }, { shown: "£22.50", note: "billed monthly" }],
          original: "£18 and £22.50 as listed",
          basis: "Vendor UK page price includes VAT. Checked 13 October 2026.",
          sourceIds: ["S1"] },
        { label: "ChatGPT Business, standard seat",
          prices: [{ shown: "£18", note: "billed annually" }, { shown: "£21.60", note: "billed monthly" }],
          original: "£15 and £18",
          basis: "Assumed ex VAT at source; 20% added.",
          sourceIds: ["S2"] },
        { label: "Microsoft 365 Copilot Business",
          prices: [{ shown: "£19.32", note: "paid yearly" }],
          original: "£16.10 ex VAT",
          basis: "20% VAT added. Needs a Microsoft 365 licence underneath.",
          sourceIds: ["S2", "S3"] }
      ],
      worked: ["50 standard seats at £18 a month is £900 a month, or £10,800 a year."]
    },
    {
      id: "api",
      name: "API access",
      modelOwner: { text: "Vendor", zone: "theirs" },
      gpuOwner: { text: "Vendor", zone: "theirs" },
      pay: { text: "Per token", zone: "theirs" },
      data: { text: "To the vendor", zone: "theirs" },
      payLine: "A price per million tokens read (input) and per million written (output). No use, no bill.",
      goodFor: "building AI into your own software and paying only for what is used.",
      watchFor: "bills that grow with use. Your data still goes to the vendor.",
      costHeading: "Per million tokens, converted from USD list prices",
      costs: [
        { label: "Cheapest small models",
          prices: [{ shown: "about £0.09", note: "input" }, { shown: "about £0.44", note: "output" }],
          original: "$0.10 input and $0.50 output per million tokens",
          basis: "USD list price, converted from USD at $1 = £0.74, plus 20% VAT.",
          sourceIds: ["S4"] },
        { label: "Mid-tier models from the three largest vendors",
          prices: [{ shown: "about £1.78", note: "input" }, { shown: "about £8.88", note: "output" }],
          original: "$2 input and $10 output per million tokens",
          basis: "USD list price, converted from USD at $1 = £0.74, plus 20% VAT.",
          sourceIds: ["S5"] },
        { label: "Most expensive flagships",
          prices: [{ shown: "about £8.88", note: "input" }, { shown: "about £44", note: "output" }],
          original: "$10 input and $50 output per million tokens",
          basis: "USD list price, converted from USD at $1 = £0.74, plus 20% VAT.",
          sourceIds: ["S4"] }
      ],
      worked: [
        "10 million tokens in and 2 million out on a mid-tier model is $40 at list price, about £36 including VAT (converted from USD; source S4).",
        "Rule of thumb: a million tokens is very roughly 750,000 words."
      ]
    },
    {
      id: "rented",
      name: "Open model on a rented cloud GPU",
      modelOwner: { text: "Open weights; you run it", zone: "yours" },
      gpuOwner: { text: "Cloud provider", zone: "theirs" },
      pay: { text: "Per GPU-hour, busy or not", zone: "theirs" },
      data: { text: "To a machine you control in someone else’s data centre", zone: "mixed" },
      payLine: "A price per hour for each GPU you have switched on, whether or not it is doing any work.",
      goodFor: "trying open models, or short bursts of heavy work, without buying hardware.",
      watchFor: "the meter runs while the GPU sits idle, and an always-on server adds up quickly.",
      costHeading: "Per GPU-hour",
      costs: [
        { label: "One H100 GPU, specialist GPU clouds",
          prices: [{ shown: "about £1.77 to £3.54", note: "per hour" }],
          original: "$1.99 to $3.99 per hour, published rates on 10 November 2026",
          basis: "Converted from USD at $1 = £0.74, plus 20% VAT.",
          sourceIds: ["S6"] },
        { label: "One H100 GPU, large cloud, London region",
          prices: [{ shown: "about £8.02", note: "per hour (AWS)" }, { shown: "about £13.57", note: "per hour (Azure, UK South)" }],
          original: "£6.68 and £11.31 per hour, checked 29 September 2026",
          basis: "Assumed ex VAT at source; 20% added.",
          sourceIds: ["S7"] },
        { label: "Eight-H100 server, large cloud, London region",
          prices: [{ shown: "about £64.10", note: "per hour" }],
          original: "£53.42 per hour",
          basis: "Assumed ex VAT at source; 20% added.",
          sourceIds: ["S7"] },
        { label: "One B200 GPU, market index",
          prices: [{ shown: "about £8.74", note: "per hour" }],
          original: "$9.84 per hour",
          basis: "Converted from USD at $1 = £0.74, plus 20% VAT.",
          sourceIds: ["S8"] }
      ],
      workedLabel: "Worked examples (arithmetic on the rates above)",
      worked: [
        "One H100 at a mid-range £2.68 an hour, for 8 hours on 21 working days, is about £450 a month.",
        "An eight-H100 server in a London region running continuously (730 hours) is about £46,800 a month."
      ]
    },
    {
      id: "own",
      name: "Open model on your own hardware",
      modelOwner: { text: "Open weights; you run it", zone: "yours" },
      gpuOwner: { text: "You", zone: "yours" },
      pay: { text: "Purchase, then power and hosting", zone: "yours" },
      data: { text: "Stays with you", zone: "yours" },
      payLine: "A purchase up front, then electricity, somewhere to put it and people to run it.",
      goodFor: "data that must stay on site, and heavy, steady use.",
      watchFor: "a fixed cost that is cheap only if the machine is kept busy.",
      costs: [],
      worked: []
    }
  ],

  /* 7.5 "Prices move" examples */
  priceMoves: [
    { text: "The desk-sized unit launched in the UK at about £3,700 inc VAT in October 2025 and retailed at £5,250 to £6,399 in November 2026.",
      sourceIds: ["S30", "S9", "S10"] },
    { text: "One rental index for a single H100 rose from $2.00 an hour in December 2025 to $3.01 in November 2026.",
      sourceIds: ["S31"] }
  ],

  /* 7.4 note: total yearly running cost of a hosted eight-GPU server */
  hostedRunningCost: { shown: "roughly £31,000 to £129,000 a year",
    original: "$35,000 to $145,000 a year (energy, hosting, support)",
    basis: "Published estimates, converted from USD at $1 = £0.74, plus 20% VAT.",
    sourceIds: ["S21"] }
};
