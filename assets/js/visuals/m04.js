/* Module 4 visual: an annotated walkthrough of one small coding task.
   ILLUSTRATIVE: the task, code and test results are made up. */
(function () {
  "use strict";
  var J = window.JEAI, host = document.getElementById("walk-body");
  if (!J || !host) return;
  var el = J.el;
  document.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  /* code: array of [class, text]; class "" = plain, "del" / "add" = diff lines, "err" / "ok" = results */
  var STEPS = [
    { who: "human", title: "A person describes the task", perm: null,
      text: "“The monthly report is double-counting cancelled appointments. Please fix it.”",
      note: "A clear description of the problem is the specification. The better it is, the better the result." },
    { who: "agent", title: "The agent reads the relevant files", perm: ["Read files", "allowed automatically"],
      code: [["", "Searching for “monthly report”…"], ["", "Reading report.py"], ["", "Reading test_report.py"]],
      note: "It looks before it changes anything, as a careful colleague would." },
    { who: "agent", title: "It proposes a plan", perm: null,
      text: "“Cancelled appointments are being included in the total. I will subtract them, update the label to say so, and run the tests.”",
      note: "A plan is cheap to read. This is the easiest moment for a person to redirect the work." },
    { who: "agent", title: "It edits two lines", perm: ["Edit files", "allowed in its own working copy"],
      code: [["", "report.py"],
        ["del", "- total = counts[\"booked\"] + counts[\"rebooked\"]"],
        ["add", "+ total = counts[\"booked\"] + counts[\"rebooked\"] - counts[\"cancelled\"]"],
        ["del", "- label = \"Appointments\""],
        ["add", "+ label = \"Appointments (excluding cancelled)\""]],
      note: "Lines starting with a minus were removed; lines starting with a plus were added. Version control keeps both." },
    { who: "agent", title: "It runs the tests", perm: ["Run commands", "asked first, approved"],
      code: [["", "$ run tests"], ["", "Running 13 tests…"]],
      note: "Running commands is the riskier permission, so here it had to ask." },
    { who: "agent", title: "One test fails", perm: null,
      code: [["ok", "12 passed"], ["err", "1 failed: test_month_with_no_cancellations"], ["err", "KeyError: 'cancelled'"]],
      note: "The fix broke months that have no cancellations at all. The tests caught it; without them, nobody would know yet." },
    { who: "agent", title: "It reads the error, fixes it and re-runs", perm: ["Edit files, Run commands", "as before"],
      code: [["", "report.py"],
        ["del", "- total = counts[\"booked\"] + counts[\"rebooked\"] - counts[\"cancelled\"]"],
        ["add", "+ total = counts[\"booked\"] + counts[\"rebooked\"] - counts.get(\"cancelled\", 0)"],
        ["", "$ run tests"]],
      note: "This is the think, act, observe loop from module 3." },
    { who: "agent", title: "All tests pass", perm: null,
      code: [["ok", "13 passed"]],
      note: "Good evidence that the change works. Not proof: the tests only check what someone thought to test." },
    { who: "agent", title: "It summarises what it changed", perm: null,
      text: "“The report now excludes cancelled appointments from the total, including in months with none. I changed two lines in report.py. All 13 tests pass. Ready for review.”",
      note: "The summary is written for a person to check against the actual change." },
    { who: "human", title: "A person reviews the change", perm: null,
      text: "A colleague reads the two changed lines, checks them against the request, and merges the change.",
      note: "The person who merges it owns it. That has not moved." }
  ];

  var card = el("div", { role: "status" });
  host.appendChild(card);
  J.stepper(host, {
    steps: STEPS.length, interval: 3200,
    onStep: function (i) {
      var s = STEPS[i];
      card.textContent = "";
      card.appendChild(el("div", { "class": "pills" }, [
        el("span", { "class": "pill " + s.who, text: s.who === "human" ? "Who: a person" : "Who: the agent" }),
        s.perm ? el("span", { "class": "pill", text: "Permission: " + s.perm[0] + " (" + s.perm[1] + ")" })
               : el("span", { "class": "pill", text: s.who === "human" ? "No AI permission involved" : "No tool used" })
      ]));
      card.appendChild(el("h3", { "class": "vis-title", text: (i + 1) + ". " + s.title }));
      if (s.text) card.appendChild(el("p", { text: s.text }));
      if (s.code) {
        var pre = el("pre", { "class": "code" });
        s.code.forEach(function (line) { pre.appendChild(el("span", { "class": line[0], style: "display:block", text: line[1] })); });
        card.appendChild(pre);
      }
      card.appendChild(el("p", { "class": "small muted", text: s.note }));
    }
  });
})();
