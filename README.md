# Engineering Portfolio — Sushant Chadha

A static portfolio site (plain HTML/CSS/JS, no build step) ready for GitHub Pages.

```
portfolio-site/
├── index.html                 ← home page (intro, project cards, about, contact)
├── projects/
│   ├── fsi-simulation.html    ← one file per project
│   ├── propeller-modeling.html
│   ├── gpu-cfd.html
│   └── _template.html         ← copy this to start a new project page
├── assets/
│   ├── js/site.js             ← ★ YOUR INFO + PROJECT LIST — the file you edit most
│   ├── js/main.js             ← site machinery (nav, TOC, embeds, tables) — leave alone
│   ├── css/style.css          ← colours/fonts at the top, layout below
│   ├── img/<project>/         ← figures, one folder per project
│   ├── scenes/                ← STAR-CCM+ .sce files for the Simcenter Web Viewer
│   └── docs/                  ← portfolio.pdf, resume.pdf
├── .nojekyll                  ← tells GitHub Pages to serve files as-is
└── README.md
```

---

## 1. Preview locally

Just open `index.html` in a browser — everything works from a local file.
If you'd rather use a local server (closer to how GitHub serves it):

```bash
python -m http.server 8000
```

then visit http://localhost:8000.

## 2. Publish on GitHub Pages

1. Create a new GitHub repository (public), e.g. `portfolio`.
   *If you name it `<your-username>.github.io` the site lives at the root URL.*
2. Upload the **contents** of this folder (not the folder itself) — via the GitHub
   web UI ("Add file → Upload files") or with git:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
   Branch: `main`, folder `/ (root)` → Save.
4. After a minute the site is live at `https://<your-username>.github.io/portfolio/`
   (or `https://<your-username>.github.io/` for a user-site repo).

Every later push to `main` redeploys automatically. All links are relative, so the
site works at either URL and from a local folder.

## 3. Edit your info (name, links, résumé)

Open `assets/js/site.js`. The `SITE` object at the top holds your name, tagline,
email, phone, LinkedIn, GitHub, résumé path, skills chips and the "At a glance" facts.
Leave any link as `""` to hide its button. Drop your résumé at
`assets/docs/resume.pdf` and set `resume: "assets/docs/resume.pdf"`.

The intro paragraphs and the About section are ordinary text in `index.html` —
look for the `EDIT ME` comments.

## 4. Add a project

1. Copy `projects/_template.html` → `projects/my-project.html`
   (lowercase, hyphens, no spaces).
2. Fill in the `EDIT ME` spots. Sections are plain `<h2>`/`<h3>` headings and
   `<p>` paragraphs; the "On this page" list is generated from the headings.
3. Put images in `assets/img/my-project/` and reference them as
   `../assets/img/my-project/name.png`.
4. Add one entry to the `PROJECTS` array in `assets/js/site.js`:
   ```js
   {
     file: "my-project.html",
     title: "My Project",
     summary: "One or two sentences for the card.",
     highlight: "The single best number/result.",
     tags: ["STAR-CCM+", "Python"],
     thumb: "assets/img/my-project/thumb.png"
   }
   ```
   That one entry creates the home-page card, the sidebar link on every project
   page, and the Previous/Next links. Order in the array = order on the site.

To remove a project, delete its entry from `PROJECTS` (and optionally the file).

## 5. Embedding external content

All embeds are a `<figure class="embed">` and are handled automatically by
`main.js`. Copy from `projects/_template.html`, which has a working example of each.

| You have… | Use | Notes |
|---|---|---|
| A URL that can be shown in a frame (YouTube, Vimeo, Sketchfab, Plotly/Streamlit app, Google Drive, a hosted viewer…) | `<figure class="embed" data-src="URL" data-ratio="16/9">` | Click-to-load, so heavy viewers don't slow the page. Add `data-autoload` to load immediately, `data-poster="img.png"` for a preview image, `data-height="520"` instead of a ratio. |
| A **STAR-CCM+ scene** (`.sce`) | `<figure class="embed" data-mode="scene" data-src="../assets/scenes/file.sce" data-poster="preview.png" data-title="…">` | Shows a "Download scene" button and an "Open Simcenter Web Viewer" button. See below. |
| A site that **refuses to be iframed** (blank frame / "refused to connect") | `<figure class="embed" data-mode="card" data-src="URL" data-poster="preview.png">` | Renders a preview + "Open in new tab" button instead. |
| A full `<iframe …>` embed code from a provider | Paste the `<iframe>` inside `<figure class="embed" data-ratio="16/9">` | Made responsive automatically. |

Every embed's caption gets an automatic **"Open in new tab ↗"** link as a fallback.

### STAR-CCM+ scenes and the Simcenter Web Viewer

Siemens' [Simcenter Web Viewer](https://cloud.sw.siemens.com/simcenterviewer/_) is a
free, license-less browser app that renders `.sce` files locally (nothing is
uploaded). It opens files only through its own Open dialog (`O` key) — there is no
share-link or URL parameter to auto-load a hosted scene, and the viewer can't be
placed inside an iframe. So the practical flow for a recruiter is:

1. In STAR-CCM+, right-click the scene → **Export** → choose the `.sce` Viewer file
   format. Export plots the same way if wanted.
2. Put the file in `assets/scenes/` and add a `data-mode="scene"` embed (see table).
3. The visitor clicks **Download scene**, then **Open Simcenter Web Viewer**, presses
   `O`, and picks the file. The card explains those steps for them.

Keep `.sce` files small where you can (GitHub's soft limit is 100 MB per file, and
a recruiter is downloading it). A poster screenshot (`data-poster`) means the page
still shows something useful before they download.

If you ever have a viewer session with a real public HTTPS URL (a cloud HPC
portal, a Sketchfab upload of exported geometry, a video capture on YouTube),
the plain `data-src` embed handles it. Note that a GitHub Pages site is served
over HTTPS, so browsers will block frames pointing at plain `http://` servers
(e.g. a STAR-CCM+ server on a lab machine); use `data-mode="card"` for those.

## 6. Tables, images, colours

- **Images**: `<figure class="zoomable"><img src="…" alt="…"><figcaption>…</figcaption></figure>`.
  `zoomable` makes it click-to-enlarge. Two side-by-side: wrap two figures in `<div class="fig-row">`.
- **Tables**: wrap in `<div class="table-wrap">` so they scroll on phones. Add `data-heat`
  to a `<table>` to colour numeric cells (green positive, red negative);
  `data-heat-min="-25" data-heat-max="90"` fixes the scale so several tables match.
- **Colours / font**: the top of `assets/css/style.css` has the theme tokens. Change
  `--accent` to recolour the whole site; dark mode has its own block just below.
- **Dark mode**: follows the visitor's OS setting; the moon/sun button in the nav overrides it.

## 7. Things to check before sharing

- [ ] Fill in `email` / `phone` / `linkedin` / `github` in `assets/js/site.js`
- [ ] Add `assets/docs/resume.pdf` and set `resume` in `site.js`
- [ ] Rewrite the `EDIT ME` intro/About paragraphs in `index.html` in your own words
- [ ] Check the **When** / **Role** lines at the top of each project page
- [ ] `projects/gpu-cfd.html` — the "Challenges" paragraph was unfinished in the PDF (see the TODO comment)
