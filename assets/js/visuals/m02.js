/* Module 2 visuals: the ownership grid's detail panel (data path, costs) and the hardware ladder.
   The grid itself is a real HTML table in the page; this script makes its rows selectable. */
(function () {
  "use strict";
  var J = window.JEAI, P = window.JEAI_PRICES, H = window.JEAI_HARDWARE;
  var fig = document.getElementById("ownership-grid");
  var panel = document.getElementById("arr-panel");
  if (!J || !P || !fig || !panel) return;
  var el = J.el, svg = J.svg;

  fig.querySelectorAll(".js-only").forEach(function (n) { n.hidden = false; });

  /* ---------- Data-path diagram: two zones, yours and theirs ---------- */
  var DIAGRAMS = {
    chat:   { split: 150, user: "Your staff",    theirs: "The vendor",     model: "Vendor’s model", gpu: "Vendor’s GPU", modelYours: false,
              says: "Your prompts and files cross the boundary to the vendor’s model, running on the vendor’s GPU." },
    api:    { split: 150, user: "Your software", theirs: "The vendor",     model: "Vendor’s model", gpu: "Vendor’s GPU", modelYours: false,
              says: "Your software sends text across the boundary to the vendor’s model, running on the vendor’s GPU." },
    rented: { split: 150, user: "Your staff",    theirs: "Cloud provider", model: "Model you run",       gpu: "Rented GPU",        modelYours: true,
              says: "Your data crosses the boundary to a model you run, on a GPU that belongs to the cloud provider." },
    own:    { split: 270, user: "Your staff",    theirs: "Outside",        model: "Model you run",       gpu: "Your GPU",          modelYours: true,
              says: "Your data goes to a model you run on your own GPU. Nothing crosses the boundary." }
  };

  function diagram(id) {
    var d = DIAGRAMS[id], W = 360, Ht = 176, s = d.split, own = id === "own";
    var hatch = J.uid("hatch"), head = J.uid("head");
    var root = svg("svg", { viewBox: "0 0 " + W + " " + Ht, role: "img", "aria-label": d.says, width: W, height: Ht });
    root.appendChild(svg("defs", {}, [
      svg("pattern", { id: hatch, width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, [
        svg("line", { x1: 0, y1: 0, x2: 0, y2: 8, "class": "svg-hatch-line" })
      ]),
      svg("marker", { id: head, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: "auto" }, [
        svg("path", { d: "M0,0 L8,4 L0,8 z", "class": "svg-arrowhead" })
      ])
    ]));
    function rect(x, y, w, h, cls, rx) { return svg("rect", { x: x, y: y, width: w, height: h, rx: rx || 8, "class": cls }); }
    function text(x, y, str, cls, size, anchor) {
      return svg("text", { x: x, y: y, "class": cls || "", "font-size": size || 12, "text-anchor": anchor || "start", text: str });
    }
    /* zones */
    root.appendChild(rect(3, 3, s - 7, Ht - 6, "svg-yours"));
    root.appendChild(rect(s + 4, 3, W - s - 7, Ht - 6, "svg-theirs"));
    root.appendChild(svg("rect", { x: s + 4, y: 3, width: W - s - 7, height: Ht - 6, rx: 8, fill: "url(#" + hatch + ")" }));
    root.appendChild(text(12, 22, "Your organisation", "svg-label-yours", 12));
    root.appendChild(text(s + 13, 22, d.theirs, "svg-label-theirs", 12));

    /* user box, always in your zone */
    var uw = own ? 92 : 118;
    root.appendChild(rect(14, 68, uw, 40, "svg-box", 6));
    root.appendChild(text(14 + uw / 2, 93, d.user, "", 12, "middle"));

    /* GPU box with the model inside it */
    var gx = own ? 136 : s + 20, gw = own ? 122 : W - s - 40, gy = 40, gh = 116;
    root.appendChild(rect(gx, gy, gw, gh, own ? "svg-yours" : "svg-theirs", 6));
    root.appendChild(svg("rect", { x: gx, y: gy, width: gw, height: gh, rx: 6, fill: "var(--surface)", opacity: .55 }));
    root.appendChild(text(gx + gw / 2, gy + gh - 10, d.gpu, own ? "svg-label-yours" : "svg-label-theirs", 12, "middle"));
    var mx = gx + 10, mw = gw - 20, my = gy + 12, mh = 58;
    root.appendChild(rect(mx, my, mw, mh, d.modelYours ? "svg-yours" : "svg-theirs", 6));
    /* weights: a small grid of squares, the shared picture for "model" */
    for (var r = 0; r < 2; r++) for (var c = 0; c < 6; c++) {
      root.appendChild(svg("rect", { x: mx + mw / 2 - 26 + c * 9, y: my + 8 + r * 9, width: 7, height: 7, rx: 1, "class": "svg-weight" }));
    }
    root.appendChild(text(mx + mw / 2, my + mh - 11, d.model, d.modelYours ? "svg-label-yours" : "svg-label-theirs", 12, "middle"));

    /* arrows: data out, answer back */
    var ax1 = 14 + uw + 2, ax2 = mx - 3;
    root.appendChild(svg("line", { x1: ax1, y1: 80, x2: ax2, y2: 80, "class": "svg-arrow", "marker-end": "url(#" + head + ")" }));
    root.appendChild(svg("line", { x1: ax2, y1: 97, x2: ax1 + 1, y2: 97, "class": "svg-arrow", "marker-end": "url(#" + head + ")", "stroke-dasharray": "4 3" }));
    root.appendChild(text(14, 126, "Your data out,", "svg-muted", 11));
    root.appendChild(text(14, 140, "answers back", "svg-muted", 11));
    if (own) {
      root.appendChild(text(s + (W - s) / 2, 86, "Nothing", "svg-label-theirs", 12, "middle"));
      root.appendChild(text(s + (W - s) / 2, 102, "sent", "svg-label-theirs", 12, "middle"));
    }
    return root;
  }

  /* ---------- Hardware ladder on a logarithmic price axis ---------- */
  var AXIS_MIN = 3, AXIS_MAX = 6; /* log10 of £1,000 and £1,000,000 */
  function pos(price) { return (Math.log10(price) - AXIS_MIN) / (AXIS_MAX - AXIS_MIN) * 100; }

  function ladder() {
    var box = el("div", { "class": "ladder", id: "hardware-ladder" });
    box.appendChild(el("h4", { text: "The hardware ladder" }));
    box.appendChild(el("p", { "class": "small", text:
      "Five sizes of machine, placed by purchase price. The axis is logarithmic: each step along it is ten times the price. The top rung costs roughly 100 times the bottom one." }));
    var axis = el("div", { "class": "ladder-axis", "aria-hidden": "true" });
    [["£1k", 1e3], ["£10k", 1e4], ["£100k", 1e5], ["£1m", 1e6]].forEach(function (t) {
      var s = el("span", { text: t[0] });
      s.style.left = pos(t[1]) + "%";
      axis.appendChild(s);
    });
    box.appendChild(axis);
    var ol = el("ol");
    H.rungs.forEach(function (r) {
      var track = el("div", { "class": "ladder-track", "aria-hidden": "true" });
      var bar = el("span", { "class": "bar" });
      bar.style.left = pos(r.price.low) + "%";
      bar.style.width = Math.max(pos(r.price.high) - pos(r.price.low), 0) + "%";
      track.appendChild(bar);
      var facts = el("div", { "class": "rung-facts" }, [
        el("span", {}, [J.chip(r.price.shown, { product: r.product, original: r.price.original, basis: r.price.basis, sourceIds: r.price.sourceIds })]),
        el("span", {}, [el("span", { "class": "k", text: "Memory " }), r.memory.shown]),
        el("span", {}, [el("span", { "class": "k", text: "Power while generating " }), r.power.short])
      ]);
      ol.appendChild(el("li", {}, [
        el("div", { "class": "rung-head", text: r.n + ". " + r.name }),
        track, facts
      ]));
    });
    box.appendChild(ol);
    box.appendChild(el("p", { "class": "small", html:
      "Rung 3 has no UK list price; the figure is converted from US list prices. Quotes for rung 5 vary widely between UK sellers. " +
      "<a href=\"08-hardware-and-performance.html\">Module 8</a> shows what each step up buys." }));
    box.appendChild(J.stamp({ sourceIds: ["S9", "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17", "S18", "S19"] }));
    return box;
  }

  /* ---------- Panel for the selected arrangement ---------- */
  function renderPanel(id) {
    var a = P.arrangements.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    panel.textContent = "";
    panel.appendChild(el("h3", { text: a.name }));
    panel.appendChild(el("div", { "class": "arr-top" }, [
      el("div", {}, [diagram(id), el("p", { "class": "small muted", text: DIAGRAMS[id].says })]),
      el("div", {}, [
        el("p", {}, [el("strong", { text: "How you pay: " }), a.payLine]),
        el("p", {}, [el("strong", { text: "Good for: " }), a.goodFor]),
        el("p", {}, [el("strong", { text: "Watch for: " }), a.watchFor])
      ])
    ]));

    if (a.costs.length) {
      panel.appendChild(el("h4", { text: "Example UK costs, including VAT. " + a.costHeading }));
      var ul = el("ul", { "class": "cost-list" });
      var ids = [];
      a.costs.forEach(function (c) {
        var prices = el("span", { "class": "prices" });
        c.prices.forEach(function (p) {
          prices.appendChild(el("span", {}, [J.chip(p.shown, c), " ", el("span", { "class": "note", text: p.note })]));
        });
        c.sourceIds.forEach(function (s) { if (ids.indexOf(s) === -1) ids.push(s); });
        ul.appendChild(el("li", {}, [el("span", { text: c.label }), prices]));
      });
      panel.appendChild(ul);
      if (a.worked.length) {
        var w = el("div", { "class": "worked" }, [el("p", {}, [el("strong", { text: (a.workedLabel || "Worked example") + ":" })])]);
        a.worked.forEach(function (t) { w.appendChild(el("p", { text: t })); });
        panel.appendChild(w);
      }
      panel.appendChild(J.stamp({ sourceIds: ids }));
    }
    if (id === "own") panel.appendChild(ladder());
  }

  /* ---------- Make the table rows selectable ----------
     Wide screens: the panel sits under the grid and one arrangement is always selected.
     Narrow screens: an accordion. The panel opens directly under the card that was tapped,
     and all cards start closed so the four-way comparison is seen first. */
  var mq = window.matchMedia("(max-width: 699px)");
  var home = document.createComment("panel home");
  panel.parentNode.insertBefore(home, panel);
  var panelRow = el("tr", { "class": "panel-row" }, [el("td", { colspan: "5" })]);
  var rows = {}, selected = null;
  fig.querySelectorAll("tr[data-arr]").forEach(function (tr) {
    var th = tr.querySelector("th"), id = tr.getAttribute("data-arr");
    var btn = el("button", { type: "button", "class": "row-btn", "aria-expanded": "false" }, [
      el("span", { text: th.textContent }), el("span", { "class": "cue", text: "Costs and data path" })
    ]);
    th.textContent = "";
    th.appendChild(btn);
    rows[id] = { tr: tr, btn: btn };
    btn.addEventListener("click", function () { select(id, true); });
  });
  function place() {
    if (mq.matches && selected) {
      rows[selected].tr.parentNode.insertBefore(panelRow, rows[selected].tr.nextSibling);
      panelRow.firstChild.appendChild(panel);
    } else {
      if (panelRow.parentNode) panelRow.parentNode.removeChild(panelRow);
      home.parentNode.insertBefore(panel, home.nextSibling);
    }
  }
  function select(id, byUser) {
    if (mq.matches && selected === id) id = null;
    selected = id;
    Object.keys(rows).forEach(function (k) { rows[k].btn.setAttribute("aria-expanded", String(k === id)); });
    if (id) renderPanel(id); else panel.textContent = "";
    place();
    if (id && byUser && mq.matches) rows[id].btn.scrollIntoView({ block: "nearest" });
  }
  function onResize() { if (!mq.matches && !selected) select("chat"); else place(); }
  if (mq.addEventListener) mq.addEventListener("change", onResize); else if (mq.addListener) mq.addListener(onResize);
  if (!mq.matches) select("chat");
})();
