/* =====================================================================
   SITE MACHINERY — you should not need to edit this file.
   ---------------------------------------------------------------------
   Reads SITE and PROJECTS from site.js and:
     • builds the nav bar and footer on every page
     • fills the home page (hero buttons, skills, facts, project cards, contact)
     • on project pages: "Project N of M", the on-this-page TOC, the
       "Other projects" list and the Previous/Next links
     • turns <figure class="embed" data-src="..."> into click-to-load
       iframes / link cards / .sce scene cards
     • colour-codes tables marked with data-heat
     • click-to-zoom lightbox for figures marked class="zoomable"
     • light/dark theme toggle
   ===================================================================== */
(function () {
  "use strict";

  const ROOT = document.body.dataset.root || "";      // "" on index.html, "../" inside projects/
  const PAGE = document.body.dataset.page || "";      // "home" | "project"
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICON = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  };

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const btn = $(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const root = document.documentElement;
      const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = root.dataset.theme || (osDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode etc. */ }
    });
  }

  /* ---------- Nav + footer ---------- */
  function buildNav() {
    const host = $("#site-nav");
    if (!host) return;
    const home = ROOT + "index.html";
    const projectsHref = PAGE === "home" ? "#projects" : home + "#projects";
    const aboutHref = PAGE === "home" ? "#about" : home + "#about";
    const contactHref = PAGE === "home" ? "#contact" : home + "#contact";
    host.outerHTML = `
      <header class="nav">
        <div class="container">
          <a class="nav-brand" href="${home}">${esc(SITE.name)}</a>
          <nav class="nav-links" aria-label="Site">
            <a href="${projectsHref}">Projects</a>
            <a href="${aboutHref}">About</a>
            <a href="${contactHref}">Contact</a>
            <button class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">${ICON.sun}${ICON.moon}</button>
          </nav>
        </div>
      </header>`;
  }

  function buildFooter() {
    const host = $("#site-footer");
    if (!host) return;
    const links = [];
    if (SITE.email) links.push(`<a href="mailto:${esc(SITE.email)}">Email</a>`);
    if (SITE.linkedin) links.push(`<a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (SITE.github) links.push(`<a href="${esc(SITE.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (SITE.portfolioPdf) links.push(`<a href="${ROOT + esc(SITE.portfolioPdf)}" target="_blank" rel="noopener">PDF version</a>`);
    host.outerHTML = `
      <footer class="footer">
        <div class="container">
          <span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span>
          <span>${links.join(" · ")}</span>
        </div>
      </footer>`;
  }

  /* ---------- Simple text fills: <span data-fill="name"></span> ---------- */
  function fillText() {
    $$("[data-fill]").forEach((el) => {
      const v = SITE[el.dataset.fill];
      if (v) el.textContent = v;
    });
  }

  /* ---------- Home page ---------- */
  function buildHome() {
    if (PAGE !== "home") return;

    // Hero buttons
    const btns = $("#hero-buttons");
    if (btns) {
      const out = [`<a class="btn btn-primary" href="#projects">View projects ${ICON.arrow}</a>`];
      if (SITE.resume) out.push(`<a class="btn" href="${esc(SITE.resume)}" target="_blank" rel="noopener">${ICON.file} Résumé</a>`);
      if (SITE.portfolioPdf) out.push(`<a class="btn" href="${esc(SITE.portfolioPdf)}" target="_blank" rel="noopener">${ICON.file} Portfolio (PDF)</a>`);
      if (SITE.email) out.push(`<a class="btn" href="mailto:${esc(SITE.email)}">${ICON.mail} Email</a>`);
      if (SITE.linkedin) out.push(`<a class="btn" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${ICON.linkedin} LinkedIn</a>`);
      if (SITE.github) out.push(`<a class="btn" href="${esc(SITE.github)}" target="_blank" rel="noopener">${ICON.github} GitHub</a>`);
      btns.innerHTML = out.join("");
    }

    // Skills chips
    const skills = $("#skills");
    if (skills && SITE.skills) skills.innerHTML = SITE.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join("");

    // Facts box
    const facts = $("#facts");
    if (facts && SITE.facts) {
      const rows = SITE.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
      facts.innerHTML = `<h3>At a glance</h3><dl>${rows}${SITE.location ? `<dt>Based</dt><dd>${esc(SITE.location)}</dd>` : ""}</dl>`;
    }

    // Project cards
    const grid = $("#project-grid");
    if (grid) {
      grid.innerHTML = PROJECTS.map((p, i) => `
        <a class="card" href="projects/${esc(p.file)}">
          <div class="card-thumb">${p.thumb ? `<img src="${esc(p.thumb)}" alt="" loading="lazy">` : ""}</div>
          <div class="card-body">
            <ul class="chips">${(p.tags || []).map((t) => `<li class="chip">${esc(t)}</li>`).join("")}</ul>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.summary)}</p>
            ${p.highlight ? `<div class="card-highlight">${esc(p.highlight)}</div>` : ""}
            <div class="card-foot"><span class="card-num">${String(i + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}</span><span class="more">Read the study →</span></div>
          </div>
        </a>`).join("");
    }

    // Contact list
    const contact = $("#contact-list");
    if (contact) {
      const out = [];
      if (SITE.email) out.push(`<li><a href="mailto:${esc(SITE.email)}">${ICON.mail} ${esc(SITE.email)}</a></li>`);
      if (SITE.linkedin) out.push(`<li><a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${ICON.linkedin} LinkedIn</a></li>`);
      if (SITE.github) out.push(`<li><a href="${esc(SITE.github)}" target="_blank" rel="noopener">${ICON.github} GitHub</a></li>`);
      if (SITE.resume) out.push(`<li><a href="${esc(SITE.resume)}" target="_blank" rel="noopener">${ICON.file} Résumé (PDF)</a></li>`);
      if (SITE.portfolioPdf) out.push(`<li><a href="${esc(SITE.portfolioPdf)}" target="_blank" rel="noopener">${ICON.file} Portfolio (PDF)</a></li>`);
      contact.innerHTML = out.length ? out.join("") : `<li class="muted">Add your email / LinkedIn in <code>assets/js/site.js</code>.</li>`;
    }
  }

  /* ---------- Project pages ---------- */
  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function buildProject() {
    if (PAGE !== "project") return;
    const file = location.pathname.split("/").pop() || "";
    const idx = PROJECTS.findIndex((p) => p.file === file);
    const article = $("article");

    // "Project N of M"
    const eyebrow = $("#project-eyebrow");
    if (eyebrow && idx >= 0) eyebrow.textContent = `Project ${idx + 1} of ${PROJECTS.length}`;

    // Sidebar "Other projects"
    const list = $("#sidebar-projects");
    if (list) {
      list.innerHTML = PROJECTS.map((p, i) =>
        `<li><a href="${esc(p.file)}" ${i === idx ? 'aria-current="page"' : ""}>${esc(p.title)}</a></li>`).join("");
    }

    // Prev / next
    const pager = $("#pager");
    if (pager && idx >= 0) {
      const prev = PROJECTS[idx - 1], next = PROJECTS[idx + 1];
      pager.innerHTML =
        (prev ? `<a class="prev" href="${esc(prev.file)}"><span class="dir">← Previous</span><br><span class="title">${esc(prev.title)}</span></a>` : "<span></span>") +
        (next ? `<a class="next" href="${esc(next.file)}"><span class="dir">Next →</span><br><span class="title">${esc(next.title)}</span></a>`
              : `<a class="next" href="${ROOT}index.html#projects"><span class="dir">Back to</span><br><span class="title">All projects</span></a>`);
    }

    // Table of contents from h2 / h3 in the article
    if (!article) return;
    const heads = $$("h2, h3", article).filter((h) => !h.closest(".callout, .scene-card, figure"));
    heads.forEach((h) => { if (!h.id) h.id = slugify(h.textContent); });
    const items = heads.map((h) =>
      `<li class="${h.tagName === "H3" ? "sub" : ""}"><a href="#${h.id}">${esc(h.textContent)}</a></li>`).join("");
    const toc = $("#toc"), tocMobile = $("#toc-mobile");
    if (toc) toc.innerHTML = `<ul>${items}</ul>`;
    if (tocMobile) tocMobile.innerHTML = `<ul>${items}</ul>`;

    // Scroll-spy: highlight the current section in the sidebar
    if (toc && "IntersectionObserver" in window) {
      const links = new Map(heads.map((h) => [h.id, toc.querySelector(`a[href="#${h.id}"]`)]));
      let current = null;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) current = e.target.id; });
        if (!current) return;
        links.forEach((a, id) => a && a.classList.toggle("active", id === current));
      }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
      heads.forEach((h) => io.observe(h));
    }
  }

  /* ---------- Embeds ----------
     <figure class="embed" data-src="URL" data-mode="iframe|card|scene"
             data-height="520" data-ratio="16/9" data-poster="img.png" data-autoload>
       <figcaption>Caption</figcaption>
     </figure>
     Or paste a provider's own <iframe> inside <figure class="embed"> and it is
     made responsive automatically.
  ------------------------------------------------------------------ */
  const VIEWER_URL = "https://cloud.sw.siemens.com/simcenterviewer/_";

  function sizeFrame(frame, fig) {
    if (fig.dataset.ratio) frame.style.aspectRatio = fig.dataset.ratio.replace("/", " / ");
    else frame.style.height = (parseInt(fig.dataset.height, 10) || 480) + "px";
  }

  function buildEmbeds() {
    $$("figure.embed").forEach((fig) => {
      const src = fig.dataset.src;
      const mode = fig.dataset.mode || "iframe";
      const poster = fig.dataset.poster;
      const caption = fig.querySelector("figcaption");
      const captionText = caption ? caption.innerHTML : "";
      const title = fig.dataset.title || (caption ? caption.textContent.trim() : "Embedded content");

      // Case 0: author pasted a raw <iframe> — just make it responsive
      const raw = fig.querySelector("iframe");
      if (!src && raw) {
        const frame = document.createElement("div");
        frame.className = "embed-frame";
        sizeFrame(frame, fig);
        raw.setAttribute("loading", "lazy");
        raw.setAttribute("allowfullscreen", "");
        raw.replaceWith(frame);
        frame.appendChild(raw);
        fig.prepend(frame);
        if (caption && raw.src) caption.insertAdjacentHTML("beforeend", `<a class="open-link" href="${esc(raw.src)}" target="_blank" rel="noopener">Open in new tab ↗</a>`);
        return;
      }
      if (!src) return;

      // Case 1: .sce scene card → download + open Simcenter Web Viewer
      if (mode === "scene") {
        const name = src.split("/").pop();
        fig.innerHTML = `
          <div class="scene-card">
            ${poster ? `<figure class="scene-poster"><img src="${esc(poster)}" alt=""></figure>`
                     : `<div class="scene-poster placeholder">STAR-CCM+ scene (.sce)</div>`}
            <div>
              <h4>${esc(title)}</h4>
              ${captionText ? `<p class="scene-desc">${captionText}</p>` : ""}
              <div class="btn-row">
                <a class="btn btn-primary" href="${esc(src)}" download>${ICON.download} Download scene (.sce)${fig.dataset.size ? ` · ${esc(fig.dataset.size)}` : ""}</a>
                <a class="btn" href="${VIEWER_URL}" target="_blank" rel="noopener">${ICON.ext} Open Simcenter Web Viewer</a>
              </div>
              <p class="steps">Free, no install: open the viewer, press <code>O</code> (or the folder icon) and pick <code>${esc(name)}</code>. The file is rendered locally in your browser.</p>
            </div>
          </div>`;
        return;
      }

      // Case 2: link card (for sites that refuse to be iframed)
      if (mode === "card") {
        const frame = document.createElement("div");
        frame.className = "embed-frame";
        sizeFrame(frame, fig);
        frame.innerHTML = `
          ${poster ? `<img class="embed-poster" src="${esc(poster)}" alt="">` : ""}
          <div class="embed-overlay">
            <a class="btn btn-primary" href="${esc(src)}" target="_blank" rel="noopener">${ICON.ext} Open ${esc(title)}</a>
            <span class="hint">Opens in a new tab</span>
          </div>`;
        fig.prepend(frame);
        if (caption) caption.insertAdjacentHTML("beforeend", `<a class="open-link" href="${esc(src)}" target="_blank" rel="noopener">Open in new tab ↗</a>`);
        return;
      }

      // Case 3 (default): click-to-load iframe
      const frame = document.createElement("div");
      frame.className = "embed-frame";
      sizeFrame(frame, fig);
      const load = () => {
        frame.innerHTML = `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allowfullscreen allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope; autoplay"></iframe>`;
      };
      if ("autoload" in fig.dataset) {
        load();
      } else {
        frame.innerHTML = `
          ${poster ? `<img class="embed-poster" src="${esc(poster)}" alt="">` : ""}
          <div class="embed-overlay">
            <button class="btn btn-primary" type="button">${ICON.play} Load interactive viewer</button>
            <span class="hint">Loads external content from ${esc(new URL(src, location.href).hostname)}</span>
          </div>`;
        frame.querySelector("button").addEventListener("click", load);
      }
      fig.prepend(frame);
      if (caption) caption.insertAdjacentHTML("beforeend", `<a class="open-link" href="${esc(src)}" target="_blank" rel="noopener">Open in new tab ↗</a>`);
    });
  }

  /* ---------- Heat-coloured tables: <table data-heat data-heat-min="-25" data-heat-max="90"> ---------- */
  function buildHeatTables() {
    $$("table[data-heat]").forEach((table) => {
      const cells = $$("tbody td", table).filter((td) => !td.classList.contains("group") && !td.classList.contains("no-heat"));
      // accept "−" (typographic minus) as well as "-", and ignore % and thousands separators
      const nums = cells.map((td) => parseFloat(td.textContent.replace(/−/g, "-").replace(/[%,\s]/g, "")));
      const valid = nums.filter((n) => !isNaN(n));
      if (!valid.length) return;
      const min = table.dataset.heatMin !== undefined ? parseFloat(table.dataset.heatMin) : Math.min(...valid);
      const max = table.dataset.heatMax !== undefined ? parseFloat(table.dataset.heatMax) : Math.max(...valid);
      cells.forEach((td, i) => {
        const v = nums[i];
        if (isNaN(v)) return;
        if (v >= 0) {
          const t = max > 0 ? Math.min(1, v / max) : 0;            // 0 → clear, max → strong green
          td.style.background = `rgba(20, 160, 90, ${0.08 + 0.42 * t})`;
        } else {
          const t = min < 0 ? Math.min(1, v / min) : 0;            // 0 → clear, min → strong red
          td.style.background = `rgba(220, 60, 50, ${0.12 + 0.4 * t})`;
        }
      });
    });
  }

  /* ---------- Lightbox for figure.zoomable ---------- */
  function buildLightbox() {
    const figs = $$("figure.zoomable");
    if (!figs.length) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img alt=""><figcaption></figcaption>`;
    document.body.appendChild(box);
    const img = box.querySelector("img"), cap = box.querySelector("figcaption");
    const close = () => { box.classList.remove("open"); img.src = ""; };
    box.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    figs.forEach((fig) => {
      const src = fig.querySelector("img");
      if (!src) return;
      src.addEventListener("click", () => {
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        const c = fig.querySelector("figcaption");
        cap.textContent = c ? c.textContent : "";
        box.classList.add("open");
      });
    });
  }

  /* ---------- Go ---------- */
  buildNav();
  buildFooter();
  initTheme();
  fillText();
  buildHome();
  buildProject();
  buildEmbeds();
  buildHeatTables();
  buildLightbox();
})();
