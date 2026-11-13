/* Single source of truth for module order, titles and summaries.
   Used by assets/js/site.js (sidebar, progress) and tools/build-pages.js (contents page). */
window.JEAI_COURSE = {
  title: "Just Enough AI: A Manager's Guide to Commissioning AI Capability",
  shortTitle: "Just Enough AI",
  figuresChecked: "13 November 2026",
  parts: [
    { id: "A", title: "Part A: Using it" },
    { id: "B", title: "Part B: Running it",
      note: "Part B explains what your technical team is weighing up. Read it if you make or approve decisions about hosting AI yourselves. Otherwise Part A is enough." }
  ],
  modules: [
    { n: 1, part: "A", file: "01-what-is-an-llm.html", title: "What an LLM is",
      need: "you want a one-sentence answer to “what is this thing actually doing?”" },
    { n: 2, part: "A", file: "02-local-vs-cloud.html", title: "Local AI vs. cloud AI",
      need: "you are asked to approve, buy or govern an AI tool." },
    { n: 3, part: "A", file: "03-chat-vs-agent.html", title: "A chat window vs. an agentic system",
      need: "someone asks you to approve an AI “agent”, or an AI tool that can take actions." },
    { n: 4, part: "A", file: "04-ai-assisted-coding.html", title: "AI-assisted code development",
      need: "you manage people who write code or analysis, or you are asked what “AI coding tools” change." },
    { n: 5, part: "A", file: "05-improving-results.html", title: "Three ways to improve results",
      need: "a tool “isn’t good enough” and you are asked to fund a fix." },
    { n: 6, part: "B", file: "06-what-a-model-is.html", title: "What a model physically is",
      need: "someone tells you a model “won’t fit” or “needs a bigger GPU”." },
    { n: 7, part: "B", file: "07-how-a-response-is-made.html", title: "How a response gets made",
      need: "you want to understand why AI sometimes pauses before answering, and why long conversations cost more." },
    { n: 8, part: "B", file: "08-hardware-and-performance.html", title: "Hardware and performance",
      need: "you are shown a hardware quote, or told a system will be “too slow”." },
    { n: 9, part: "B", file: "09-dense-vs-moe.html", title: "Dense vs. MoE models",
      need: "you see a model described like “35B-A3B” or hear “mixture of experts”." },
    { n: 10, part: "B", file: "10-quantisation.html", title: "Quantisation",
      need: "you are told a model has been “quantised” or see labels like “4-bit”, “Q4”, “FP8”." },
    { n: 11, part: "B", file: "11-putting-it-together.html", title: "Putting it together",
      need: "you want to turn the course into questions for a real decision." }
  ]
};
