// Pre-render the blog diagrams to static inline SVG, so the site never loads
// Mermaid from a third-party CDN at runtime. The mermaid sources live in
// scripts/diagrams/*.mmd; this script renders them and rewrites the matching
// <figure class="mermaid"> blocks in the post. Idempotent — safe to re-run.
//
// Regenerazione (richiede browser headless, NON serve al build di produzione):
//   npm i -D mermaid-isomorphic playwright && npx playwright install chromium
//   node scripts/render-mermaid.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createMermaidRenderer } from 'mermaid-isomorphic';

const POST = new URL('../src/content/blog/2026-05-21-mappatura-siss.md', import.meta.url);
const DIAG = new URL('./diagrams/', import.meta.url);

// Ordine = ordine di apparizione nel post.
const DIAGRAMS = [
  { name: '01-handoff-siss', label: "Diagramma di flusso: dalla preparazione della bozza in MediFlow all'emissione dell'NRE sul portale SISS, con riconciliazione via NRE." },
  { name: '02-sequence-jsonbroker', label: 'Diagramma di sequenza: chiamate RPC sincrone (identificaCittadino, getPrestazioni, registraPrescrizione) tra prescrittore, SPA SISS, jsonBroker e Sistema TS/SOGEI.' },
];

// Tema identico alla vecchia config client, così i diagrammi restano coerenti.
const mermaidConfig = {
  startOnLoad: false,
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  theme: 'base',
  flowchart: { htmlLabels: false, curve: 'basis', padding: 18, nodeSpacing: 60, rankSpacing: 70 },
  sequence: {
    diagramMarginX: 60, diagramMarginY: 24, actorMargin: 110, width: 210, boxMargin: 16,
    messageMargin: 38, actorFontSize: 15, actorFontWeight: 700, noteFontSize: 13,
    messageFontSize: 14, bottomMarginAdj: 30,
  },
  themeVariables: {
    fontSize: '15px', background: '#0d1117', primaryColor: '#111820', primaryTextColor: '#e6edf3',
    primaryBorderColor: '#2d3a44', secondaryColor: '#14252d', tertiaryColor: '#0e6e5c',
    lineColor: '#52616d', textColor: '#e6edf3', mainBkg: '#111820', nodeBorder: '#2d3a44',
    clusterBkg: '#111820', clusterBorder: '#2d3a44', edgeLabelBackground: '#0d1117',
    actorBkg: '#111820', actorBorder: '#2d3a44', actorTextColor: '#e6edf3', actorLineColor: '#52616d',
    signalColor: '#a8b0b8', signalTextColor: '#e6edf3', labelBoxBkgColor: '#111820',
    labelBoxBorderColor: '#2d3a44', noteBkgColor: '#14252d', noteBorderColor: '#426b7f',
    noteTextColor: '#e6edf3', activationBkgColor: '#0e6e5c', activationBorderColor: '#15c47a',
  },
};

const sources = DIAGRAMS.map((d) => readFileSync(new URL(`${d.name}.mmd`, DIAG), 'utf8').trim());
const renderer = createMermaidRenderer();
const results = await renderer(sources, { mermaidConfig });

let md = readFileSync(POST, 'utf8');
results.forEach((r, i) => {
  if (r.status !== 'fulfilled') throw new Error(`Render ${DIAGRAMS[i].name} failed: ${r.reason}`);
  const { name, label } = DIAGRAMS[i];
  const figure = `<figure class="mermaid" role="img" aria-label="${label}"><!-- sorgente: scripts/diagrams/${name}.mmd · rigenera con scripts/render-mermaid.mjs -->${r.value.svg.trim()}</figure>`;
  // Sostituisce la figure esistente (match sul puntatore al sorgente) oppure,
  // alla prima esecuzione, il blocco ```mermaid corrispondente.
  const existing = new RegExp(`<figure class="mermaid"[^>]*><!-- sorgente: scripts/diagrams/${name}\\.mmd[\\s\\S]*?</figure>`);
  if (existing.test(md)) {
    md = md.replace(existing, figure);
  } else {
    md = md.replace(/```mermaid\n[\s\S]*?```/, figure); // primo fence rimasto
  }
  console.log(`${name}: ${r.value.svg.length} bytes, ${Math.round(r.value.width)}x${Math.round(r.value.height)}`);
});

writeFileSync(POST, md);
console.log('Post aggiornato con gli SVG statici.');
