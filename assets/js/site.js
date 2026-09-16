/* =====================================================================
   SITE CONFIG  —  this is the file you edit most.
   ---------------------------------------------------------------------
   • Your name, tagline and links live in SITE (used by the nav, home
     page hero, contact section and footer, so you only change them once).
   • Every project gets ONE entry in PROJECTS. The home page cards, the
     "Other projects" sidebar and the Previous/Next links are all built
     from this list, in this order.
   • Paths are relative to the site root (the folder with index.html).
   ===================================================================== */

const SITE = {
  name: "Sushant Chadha",
  tagline: "CFD, fluid–structure interaction and simulation automation for the Texas A&M SAE Aero Design team.",
  location: "Texas A&M University · College Station, TX",   // shown in the "At a glance" box; leave "" to hide

  // Contact / social links. Leave any value as "" to hide that button.
  email:    "chadhasushant7@outlook.com",                                 // e.g. "you@example.com"
  phone:    "+1 (609) 613-8466",                                                           // e.g. "+1 (979) 555-0123" — shown on the home page; "" to hide
  linkedin: "https://www.linkedin.com/in/sushant-chadha-5b0b96231/",                                 // e.g. "https://www.linkedin.com/in/your-handle"
  github:   "https://github.com/chadhasushant7",                                 // e.g. "https://github.com/your-handle"
  resume:   "assets/docs/Resume - Sushant Chadha.pdf",                                 // e.g. "assets/docs/resume.pdf"  (drop the file in assets/docs/)
  portfolioPdf: "assets/docs/Portfolio - Sushant Chadha.pdf",    // the original PDF portfolio; "" to hide

  // Chips shown under the intro on the home page.
  skills: [
    "Simcenter STAR-CCM+", "Ansys Mechanical APDL", "Python", "CFD", "FEA",
    "Fluid–Structure Interaction", "Virtual Disk / Blade Element Method",
    "GPU-accelerated CFD", "HPC System Automation", "Multi-physics Simulation", 
    "Aerodynamics", "Aeroelasticity", "Aerospace Engineering"
  ],

  // Shown in the "At a glance" box on the home page (label → value).
  facts: [
    ["Focus",   "Aerodynamics & simulation"],
    ["Team",    "Texas A&M SAE Aero Design"],
    ["Tools",   "STAR-CCM+ · Ansys · Python"],
    ["Compute", "TAMU HPRC (Grace) — CPU & GPU nodes"]
  ]
};

/* ---------------------------------------------------------------------
   PROJECTS — add, remove or reorder entries here.
   To add a project:
     1. Copy projects/_template.html → projects/my-project.html and fill it in.
     2. Add an entry below with file: "my-project.html".
   Fields:
     file       – file name inside the projects/ folder
     title      – shown on the card and as the page's prev/next label
     summary    – 1–2 sentences for the card
     highlight  – the single most impressive number/result (shown on the card)
     tags       – short tool/skill chips on the card
     thumb      – image path (relative to site root) for the card thumbnail
   --------------------------------------------------------------------- */
const PROJECTS = [
  {
    file: "fsi-simulation.html",
    title: "Two-Way Fluid–Structure Interaction Simulation",
    summary: "A Python-driven coupling loop between Ansys Mechanical APDL and STAR-CCM+ to quantify how a thin-airfoil wing's structural deflection changes its aerodynamics.",
    highlight: "4.46 in tip deflection on a 5 ft half-span changed lift by only −1.1% and L/D by −0.44%.",
    tags: ["STAR-CCM+", "Ansys APDL", "Python", "FSI"],
    thumb: "assets/img/fsi/total-deflection.png"
  },
  {
    file: "propeller-modeling.html",
    title: "Propeller Modeling in STAR-CCM+",
    summary: "Virtual Disk (Blade Element Method) modeling of a four-propeller powertrain to study how motor placement changes lift, stabilizer downforce, pitching moment and trim on two aircraft.",
    highlight: "Motor placement shifted the biplane's trim AoA from 2.5° to 6.4° across configurations.",
    tags: ["STAR-CCM+", "Virtual Disk", "BEM", "Propeller wash"],
    thumb: "assets/img/propeller/velocity-xz-9aoa.png"
  },
  {
    file: "gpu-cfd.html",
    title: "GPU-Accelerated CFD Simulations",
    summary: "A resource and runtime study of STAR-CCM+ GPU solvers on Texas A&M's Grace supercomputer (A100, RTX 6000, T4) across 2M–40M cell meshes, used to justify the team's version migration.",
    highlight: "Up to 86% less solver time and 68% fewer service units on A100 nodes vs. CPU-only runs.",
    tags: ["STAR-CCM+", "GPU", "HPC", "Benchmarking"],
    thumb: "assets/img/gpu/gpu-savings-chart.svg"
  }
];
