/* Module 3 visual: the same request handled by a chat window and by an agent,
   with a permission dial that sets the gates on the agent's tools.
   ILLUSTRATIVE: the seven invoices and the wording are made up. */
(function () {
  "use strict";
  var J = window.JEAI, host = document.getElementById("cva-body");
  if (!J || !host) return;
  var el = J.el, svg = J.svg;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  var TOOLS = ["Read finance system", "Draft email", "Send email"];
  var GATES = { /* gate on each tool for each dial setting */
    read: ["open", "locked", "locked"],
    ask:  ["open", "open", "ask"],
    auto: ["open", "open", "open"]
  };
  var mode = "ask", decision = null, stepIndex = 0;

  function txt(x, y, s, cls, size, anchor) {
    return svg("text", { x: x, y: y, "class": cls || "", "font-size": size || 12, "text-anchor": anchor || "start", text: s });
  }
  function rect(x, y, w, h, cls, rx) { return svg("rect", { x: x, y: y, width: w, height: h, rx: rx == null ? 6 : rx, "class": cls }); }
  function weights(root, x, y) {
    for (var r = 0; r < 2; r++) for (var c = 0; c < 6; c++) root.appendChild(svg("rect", { x: x + c * 9, y: y + r * 9, width: 7, height: 7, rx: 1, "class": "svg-weight" }));
  }

  /* ---------- Chat diagram ---------- */
  function chatSvg(answered) {
    var s = svg("svg", { viewBox: "0 0 250 250", width: 250, height: 250, role: "img",
      "aria-label": "Chat window: a request goes in and text comes out. The tools in your systems are not connected." });
    s.appendChild(rect(6, 24, 238, 100, "svg-box", 8));
    s.appendChild(txt(125, 42, "Chat window", "", 12, "middle"));
    s.appendChild(rect(20, 52, 90, 50, "svg-accent-soft"));
    weights(s, 39, 60);
    s.appendChild(txt(65, 94, "Model", "", 12, "middle"));
    s.appendChild(txt(176, 74, answered ? "Request in," : "Request in\u2026", "svg-muted", 11, "middle"));
    s.appendChild(txt(176, 89, answered ? "text out. Finished." : "", "svg-muted", 11, "middle"));
    s.appendChild(txt(125, 141, "no connection", "svg-muted", 11, "middle"));
    s.appendChild(rect(6, 150, 238, 94, "svg-yours", 8));
    s.appendChild(txt(16, 168, "Your systems", "svg-label-yours", 12));
    [["Read finance", "system"], ["Draft", "email"], ["Send", "email"]].forEach(function (t, i) {
      var x = 16 + i * 75;
      s.appendChild(svg("g", { "class": "svg-dim" }, [rect(x, 178, 68, 54, "svg-box"), txt(x + 34, 201, t[0], "", 10.5, "middle"), txt(x + 34, 215, t[1], "", 10.5, "middle")]));
    });
    return s;
  }

  /* ---------- Agent diagram ---------- */
  function gate(s, x, y, kind) {
    s.appendChild(rect(x, y - 11, 44, 22, "gate-" + kind, 4));
    s.appendChild(txt(x + 22, y + 4, kind === "ask" ? "ask" : kind, "gate-text-" + kind, 11, "middle"));
  }
  function agentSvg(v) {
    var g = GATES[mode];
    var s = svg("svg", { viewBox: "0 0 360 250", width: 360, height: 250, role: "img",
      "aria-label": "Agent: the model works in a loop of think, act and observe. Gates: " +
        TOOLS.map(function (t, i) { return t + " is " + (g[i] === "ask" ? "ask first" : g[i]); }).join("; ") + "." });
    var head = J.uid("ah");
    s.appendChild(svg("defs", {}, [svg("marker", { id: head, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: "auto" }, [svg("path", { d: "M0,0 L8,4 L0,8 z", "class": "svg-arrowhead" })])]));
    s.appendChild(rect(6, 24, 112, 218, "svg-box", 8));
    s.appendChild(txt(62, 42, "Agent", "", 12, "middle"));
    s.appendChild(rect(17, 50, 90, 50, "svg-accent-soft"));
    weights(s, 36, 58);
    s.appendChild(txt(62, 92, "Model", "", 12, "middle"));
    ["Think", "Act", "Observe"].forEach(function (p, i) {
      var on = v.phase === p.toLowerCase();
      s.appendChild(svg("rect", { x: 22, y: 112 + i * 40, width: 80, height: 26, rx: 13, "class": "svg-pill" + (on ? " on" : "") }));
      s.appendChild(txt(62, 130 + i * 40, (on ? "▶ " : "") + p, on ? "svg-on-accent" : "", 12, "middle"));
      if (i < 2) s.appendChild(txt(62, 148 + i * 40, "↓", "svg-muted", 11, "middle"));
    });
    s.appendChild(txt(110, 177, "↺", "svg-muted", 14, "middle"));
    s.appendChild(rect(214, 8, 140, 234, "svg-yours", 8));
    s.appendChild(txt(224, 26, "Your systems", "svg-label-yours", 12));
    TOOLS.forEach(function (t, i) {
      var y = 68 + i * 66, active = v.tool === i;
      var line = svg("line", { x1: 118, y1: y, x2: 222, y2: y, "class": "svg-line" + (active ? " active" : "") });
      if (active && v.through) line.setAttribute("marker-end", "url(#" + head + ")");
      if (active && !v.through) line.setAttribute("x2", 146);
      s.appendChild(line);
      gate(s, 146, y, g[i]);
      s.appendChild(rect(226, y - 20, 118, 40, active && v.through ? "svg-accent-soft" : "svg-box"));
      s.appendChild(txt(285, y + 4, t, "", 11, "middle"));
      if (active && v.back) s.appendChild(txt(285, y + 34, "← result returns", "svg-muted", 10.5, "middle"));
    });
    return s;
  }

  /* ---------- The script: what each side shows at each step ---------- */
  var CHAT_ANSWER = "The model replies: “Run an overdue-invoices report in your finance system, write a polite reminder, then send it to each customer on the list.” Good advice, and now it is over to you. Nothing outside the box has changed.";
  function agentStep(i) {
    var g = GATES[mode], blockedDraft = g[1] === "locked";
    switch (i) {
      case 0: return { phase: "", say: "The request arrives." };
      case 1: return { phase: "think", say: "Think: “I need the list of overdue invoices. I will read the finance system.”" };
      case 2: return { phase: "act", tool: 0, through: true, say: "Act: it uses the Read finance system tool. The gate is open, so it does not need to ask." };
      case 3: return { phase: "observe", tool: 0, through: true, back: true, say: "Observe: the finance system returns seven overdue invoices." };
      case 4: return { phase: "think", say: "Think: “Next I will draft a reminder for each of the seven customers.”" };
      case 5: return blockedDraft
        ? { phase: "act", tool: 1, through: false, say: "Act: it tries the Draft email tool. The gate is locked, so the request is refused." }
        : { phase: "act", tool: 1, through: true, say: "Act: it uses the Draft email tool. The gate is open. Drafts change nothing outside." };
      case 6: return blockedDraft
        ? { phase: "observe", tool: 1, through: false, say: "Observe: “Permission refused.”" }
        : { phase: "observe", tool: 1, through: true, back: true, say: "Observe: seven drafts are ready." };
      case 7: return blockedDraft
        ? { phase: "think", say: "Think: “I am not allowed to draft or send. I will report what I found.”" }
        : { phase: "think", say: "Think: “The drafts are ready. I will send them.”" };
      case 8:
        if (blockedDraft) return { phase: "", say: "The agent does not try to send. The Send email gate stays locked." };
        if (g[2] === "open") return { phase: "act", tool: 2, through: true, say: "Act: it uses the Send email tool. The gate is open, so seven emails go to customers straight away. Nobody saw them first." };
        if (decision === "allow") return { phase: "act", tool: 2, through: true, say: "You allowed it. The seven emails are sent." };
        if (decision === "deny") return { phase: "act", tool: 2, through: false, say: "You denied it. Nothing is sent." };
        return { phase: "act", tool: 2, through: false, ask: true, say: "Act: it wants to use the Send email tool. The gate says ask, so the agent stops and waits for you." };
      default:
        if (blockedDraft) return { phase: "", say: "Finished. The agent replies with the list of seven overdue invoices. It could look, but it could not touch." };
        if (g[2] === "open") return { phase: "observe", tool: 2, through: true, back: true, say: "Finished. Seven emails sent with no human check. Fast, and if a draft was wrong, seven customers already have it." };
        if (decision === "allow") return { phase: "observe", tool: 2, through: true, back: true, say: "Finished. Seven emails sent, after a person approved them." };
        return { phase: "observe", tool: 2, through: false, say: "Finished. Nothing was sent. The drafts are kept for you to review." };
    }
  }

  /* ---------- Layout ---------- */
  var dial = el("fieldset", { style: "border:0;padding:0;margin:0 0 .8em" }, [
    el("legend", { "class": "vis-title", style: "font-weight:700;padding:0", text: "Permission dial" })
  ]);
  var seg = el("div", { "class": "seg" });
  [["read", "Read only"], ["ask", "Ask before acting"], ["auto", "Act automatically"]].forEach(function (o) {
    var input = el("input", { type: "radio", name: "dial", value: o[0] });
    if (o[0] === mode) input.checked = true;
    input.addEventListener("change", function () { mode = o[0]; decision = null; ctl.stop(); ctl.go(0); });
    seg.appendChild(el("label", {}, [input, o[1]]));
  });
  dial.appendChild(seg);

  var chatPic = el("div"), chatSay = el("div", { "class": "status" });
  var agentPic = el("div"), agentSay = el("div", { "class": "status", role: "status" });
  var cols = el("div", { "class": "two-col cva" }, [
    el("div", {}, [el("h3", { "class": "vis-title", text: "Chat window" }), chatPic, chatSay]),
    el("div", {}, [el("h3", { "class": "vis-title", text: "Agent" }), dial, agentPic, agentSay])
  ]);
  host.appendChild(cols);

  function render(i) {
    stepIndex = i;
    if (i < 8) decision = null;
    chatPic.textContent = ""; chatPic.appendChild(chatSvg(i >= 1));
    chatSay.textContent = i === 0 ? "The request arrives." : CHAT_ANSWER;
    var v = agentStep(i);
    agentPic.textContent = ""; agentPic.appendChild(agentSvg(v));
    agentSay.textContent = "";
    agentSay.appendChild(el("p", { text: v.say }));
    if (v.ask) {
      var allow = el("button", { type: "button", "class": "btn", text: "Allow" });
      var deny = el("button", { type: "button", "class": "btn secondary", text: "Deny" });
      allow.addEventListener("click", function () { decision = "allow"; render(8); ctl.refresh(); });
      deny.addEventListener("click", function () { decision = "deny"; render(8); ctl.refresh(); });
      agentSay.appendChild(el("p", {}, [el("strong", { text: "Send seven reminder emails to customers? " })]));
      agentSay.appendChild(el("div", { "class": "controls", style: "margin:.3em 0" }, [allow, deny]));
    }
  }
  var ctl = J.stepper(host, {
    steps: 10, interval: 2600, onStep: render,
    canAdvance: function (i) { return !(i === 8 && GATES[mode][2] === "ask" && !decision); }
  });
})();
