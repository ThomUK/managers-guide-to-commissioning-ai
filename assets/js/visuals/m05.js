/* Module 5 visuals: the RAG stepper and the "Which one do I need?" flow.
   (The ladder itself is plain HTML in the page.) ILLUSTRATIVE throughout. */
(function () {
  "use strict";
  var J = window.JEAI;
  if (!J) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  /* ---------- RAG: question -> document store -> passages into the context window -> answer ---------- */
  var rag = document.getElementById("rag-body");
  if (rag) {
    var QUESTION = ["How", " much", " notice", " for", " annual", " leave", "?"];
    var HITS = [1, 4, 6]; /* which of the eight documents hold the relevant passages */
    var SAY = [
      "A question is asked. On its own, the model has never seen your documents.",
      "The question is used to search the document store. The three most relevant passages are found.",
      "Those three passages are placed in the context window, beside the question.",
      "The model answers from what is now in front of it. Its weights have not changed."
    ];
    var pic = el("div"), ctx = el("div"), say = el("div", { "class": "status", role: "status" });
    rag.appendChild(pic); rag.appendChild(ctx); rag.appendChild(say);

    var storeSvg = function (step) {
      var s = svg("svg", { viewBox: "0 0 360 112", width: 480, height: 150, role: "img",
        "aria-label": step >= 1 ? "Document store with eight documents. Three are marked as relevant." : "Document store with eight documents." });
      s.appendChild(svg("rect", { x: 4, y: 4, width: 352, height: 104, rx: 8, "class": "svg-yours" }));
      s.appendChild(svg("text", { x: 14, y: 22, "font-size": 12, "class": "svg-label-yours", text: "Your document store" }));
      for (var i = 0; i < 8; i++) {
        var x = 16 + i * 42, hit = step >= 1 && HITS.indexOf(i) !== -1;
        s.appendChild(svg("rect", { x: x, y: 34, width: 32, height: 42, rx: 3, "class": "svg-doc" + (hit ? " hit" : "") }));
        for (var l = 0; l < 4; l++) s.appendChild(svg("line", { x1: x + 5, y1: 43 + l * 8, x2: x + 27 - (l === 3 ? 8 : 0), y2: 43 + l * 8, "class": "svg-line", "stroke-width": 1.5 }));
        if (hit) s.appendChild(svg("text", { x: x + 16, y: 92, "font-size": 10.5, "text-anchor": "middle", "class": "svg-label-yours", text: "match" }));
      }
      return s;
    };
    J.stepper(rag, {
      steps: 4, interval: 2800,
      onStep: function (i) {
        pic.textContent = ""; pic.appendChild(storeSvg(i));
        ctx.textContent = "";
        ctx.appendChild(el("p", { "class": "small", style: "margin:.8em 0 .2em;font-weight:700", text: "Context window (what the model can see)" }));
        var strip = el("div", { "class": "tok-strip", style: "border:2px solid var(--text);border-top:0;border-radius:0 0 8px 8px;padding:.4em .5em" });
        QUESTION.forEach(function (t) { strip.appendChild(el("span", { "class": "tok", text: t })); });
        if (i >= 2) ["Passage 1", "Passage 2", "Passage 3"].forEach(function (t) { strip.appendChild(el("span", { "class": "tok passage", text: t })); });
        ctx.appendChild(strip);
        say.textContent = "";
        say.appendChild(el("p", { text: SAY[i] }));
        if (i === 3) say.appendChild(el("p", {}, [el("strong", { text: "Model: " }), "an answer drawn from passages 1 to 3, which a person can check against the source."]));
      }
    });
  }

  /* ---------- Which one do I need? ---------- */
  var which = document.getElementById("which-body");
  if (which) {
    var Q = [
      { q: "Have you given it clear instructions and examples yet?",
        no: { title: "Start with prompting", text: "Write down exactly what you want, show two or three examples of a good answer, and give the context a new colleague would need. It costs minutes. Come back here if that is not enough." } },
      { q: "Is the model missing facts that are in your documents?",
        yes: { title: "Use RAG", text: "The model needs to read your documents at the time of asking. Budget for the documents as well as the software: the answers will only be as good and as current as they are." } },
      { q: "Does it know enough, but answer in the wrong format, tone or style even with clear instructions and examples?",
        yes: { title: "Consider fine-tuning", text: "This is the case fine-tuning is for. Ask first what it will cost to host the resulting model and to repeat the work when the base model changes." },
        no: { title: "Look again at the problem", text: "None of the three levers is an obvious fit. The task may need a more capable model, or a clearer way of measuring what “good enough” means." } }
    ];
    var trail = [], at = 0;
    var draw = function (result) {
      which.textContent = "";
      if (trail.length) {
        var ul = el("ul", { "class": "flow-trail" });
        trail.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
        which.appendChild(ul);
      }
      var live = el("div", { role: "status" });
      which.appendChild(live);
      if (result) {
        live.appendChild(el("div", { "class": "flow-card" }, [el("h4", { text: result.title }), el("p", { style: "margin:0", text: result.text })]));
        var again = el("button", { type: "button", "class": "btn secondary", text: "Start again" });
        again.addEventListener("click", function () { trail = []; at = 0; draw(); });
        which.appendChild(el("div", { "class": "controls" }, [again]));
        return;
      }
      var item = Q[at];
      live.appendChild(el("p", { "class": "flow-q", text: "Question " + (at + 1) + " of " + Q.length + ": " + item.q }));
      var yes = el("button", { type: "button", "class": "btn", text: "Yes" });
      var no = el("button", { type: "button", "class": "btn", text: "No" });
      var answer = function (a) {
        trail.push(item.q + " " + (a === "yes" ? "Yes." : "No."));
        if (item[a]) { draw(item[a]); return; }
        at += 1; draw();
      };
      yes.addEventListener("click", function () { answer("yes"); });
      no.addEventListener("click", function () { answer("no"); });
      which.appendChild(el("div", { "class": "controls" }, [yes, no]));
    };
    draw();
  }
})();
