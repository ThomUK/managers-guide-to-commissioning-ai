/* Glossary. "short" is one plain-English sentence (also used for tooltips);
   "more" is an optional sentence of precision.
   After editing, run: node tools/build-pages.js (regenerates glossary.html). */
window.JEAI_GLOSSARY = [
  { id: "llm", term: "LLM (large language model)", short: "A computer program that produces text by repeatedly predicting the next small piece of text.", more: "What it learned in training is held as billions of numbers." },
  { id: "token", term: "Token", short: "A small piece of text, often a word or part of a word, that a model reads or writes as one unit.", more: "As a rule of thumb, a token is about three-quarters of an English word." },
  { id: "context-window", term: "Context window", short: "The amount of text a model can take into account at once, counted in tokens.", more: "It holds the instructions, the conversation so far and any documents supplied." },
  { id: "training", term: "Training", short: "The one-off process, done by the model’s maker, of setting the model’s numbers by showing it very large amounts of text." },
  { id: "inference", term: "Inference", short: "Using a trained model to produce an answer.", more: "Every prompt you send is inference; it does not change the model." },
  { id: "parameter", term: "Parameter (weight)", short: "One of the numbers inside a model that were set during training.", more: "“27B” means 27 billion parameters." },
  { id: "open-weights", term: "Open weights", short: "A model whose file of numbers is published, so that anyone can download it and run it on their own hardware.", more: "Licence terms still apply." },
  { id: "api", term: "API", short: "A way for one piece of software to use another; here, your software sending text to a vendor’s model and getting text back.", more: "API use is usually paid for per token." },
  { id: "gpu", term: "GPU", short: "A processor that does a very large number of simple calculations at the same time, which is what running a model needs.", more: "The letters stand for graphics processing unit, after its original use." },
  { id: "cpu", term: "CPU", short: "The general-purpose processor in every computer, with a small number of powerful cores.", more: "It can run a model, but usually far more slowly than a GPU." },
  { id: "memory", term: "Memory (RAM / GPU memory)", short: "The fast working storage a model must be loaded into before it can run.", more: "RAM serves the CPU and GPU memory serves the GPU; some machines share one pool, called unified memory." },
  { id: "memory-bandwidth", term: "Memory bandwidth", short: "How quickly data can be moved from memory to the processor, measured in gigabytes per second." },
  { id: "prompt-processing", term: "Prompt processing (prefill)", short: "The first phase of a response, in which the model reads the whole prompt in one go.", more: "Engineers call this prefill." },
  { id: "token-generation", term: "Token generation (decode)", short: "The second phase of a response, in which the model writes the answer one token at a time.", more: "Engineers call this decode." },
  { id: "time-to-first-token", term: "Time to first token", short: "The wait between sending a prompt and seeing the first piece of the answer." },
  { id: "tokens-per-second", term: "Tokens per second", short: "How fast a model writes its answer once it has started." },
  { id: "kv-cache", term: "KV cache", short: "The model’s working notes on the text it has already read, kept so that it does not have to re-read it for every new token.", more: "It takes memory and grows with the length of the conversation." },
  { id: "prompt-caching", term: "Prompt caching", short: "A provider keeping its notes on a prompt it has seen before, so that it can reuse them.", more: "Cached input is usually priced lower." },
  { id: "agent", term: "Agent", short: "An AI system that uses a model in a loop to carry out a task by using tools, rather than only replying with text." },
  { id: "tool", term: "Tool", short: "Something a model has been connected to that lets it fetch information or take an action, such as searching files or sending an email." },
  { id: "permission", term: "Permission", short: "A setting that controls whether an agent may use a tool freely, must ask first, or may not use it at all." },
  { id: "rag", term: "RAG (retrieval-augmented generation)", short: "Finding the most relevant passages in your documents and giving them to the model along with the question." },
  { id: "fine-tuning", term: "Fine-tuning", short: "Further training of an existing model on your own examples, which changes its numbers.", more: "It suits changes of behaviour and style better than adding facts." },
  { id: "dense-model", term: "Dense model", short: "A model that uses all of its parameters for every token." },
  { id: "moe", term: "MoE (mixture of experts)", short: "A model built from many specialist groups of parameters, of which only a few are used for each token." },
  { id: "active-parameters", term: "Active parameters", short: "The number of parameters an MoE model actually uses for each token.", more: "Active parameters decide speed; total parameters decide whether the model fits in memory." },
  { id: "quantisation", term: "Quantisation", short: "Storing each of a model’s numbers less precisely, so that the model is smaller and faster at a small cost in quality." },
  { id: "bit", term: "Bit", short: "The smallest unit of computer storage: one yes-or-no.", more: "A number stored in 16 bits is more precise than one stored in 4." },
  { id: "batching", term: "Batching (concurrency)", short: "Serving several users’ requests in the same pass through the model.", more: "Each user slows a little while total output rises a lot." }
];
