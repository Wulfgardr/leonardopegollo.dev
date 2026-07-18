---
name: leonardopegollo.dev
description: Sito personale per lavoro clinico, dati, software locale e note.
colors:
  primary: "#0e6e5c"
  primary-deep: "#0a5848"
  signal: "#15c47a"
  amber: "#8a6a2b"
  azure: "#426b7f"
  paper: "#e9ece8"
  surface: "#ffffff"
  surface-soft: "#f3f5f2"
  ink: "#111417"
  ink-muted: "#5d6873"
  ink-light: "#6e7882"
  line: "#e2e6e9"
  line-strong: "#cfd7dd"
  print-ink: "#000000"
  print-muted: "#555555"
typography:
  display:
    fontFamily: "Helvetica Neue, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3.9rem, 7.8vw, 7.4rem)"
    fontWeight: 820
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Helvetica Neue, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.8rem)"
    fontWeight: 780
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Helvetica Neue, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 780
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body-large:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.13rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-small:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13.5px"
    fontWeight: 640
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 640
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  mark: "2px"
  card: "4px"
  code: "5px"
  media: "6px"
  icon: "8px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  reference-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: leonardopegollo.dev

## Overview

**Creative North Star: "Il foglio di lavoro clinico"**

Il sito deve sembrare preparato da una persona che usa il testo per mettere ordine nel lavoro: grande quando deve dichiarare il tema, preciso quando deve spiegare, asciutto quando deve orientare. La composizione può essere asimmetrica e ambiziosa, ma ogni scarto deve aiutare la lettura.

Non è una console, una landing SaaS o una rivista travestita da portfolio. Rifiuta il metatesto che commenta il design, le etichette d'atmosfera, i duplicati di navigazione e le decorazioni che non portano informazione.

**Key Characteristics:**

- Tipografia grande usata come struttura, non come slogan.
- Superfici piatte, bordi sottili, un solo verde operativo.
- Testi in prima persona lasciati respirare.
- Diagrammi e visualizzazioni solo quando spiegano qualcosa.
- Una destinazione per ogni voce di navigazione.

## Colors

La tavolozza usa bianco e grigi freddi come carta; il verde compare solo per orientamento, link e stato.

### Primary

- **Verde operativo:** azioni, link, stato attivo e segno del marchio. Deve restare raro.

### Secondary

- **Verde segnale:** conferme e stati realmente attivi; mai come riempitivo decorativo.

### Neutral

- **Carta fredda:** sfondo esterno del foglio su schermi larghi.
- **Superficie bianca:** piano principale di lettura.
- **Inchiostro:** titoli e testo ad alta priorità.
- **Grigi di lavoro:** paragrafi, date e informazioni secondarie.
- **Linea:** separazione fra regioni, senza creare scatole ovunque.

### Named Rules

**The One Green Rule.** Il verde indica una relazione o un'azione; non colora intere sezioni per dare carattere.

## Typography

**Display Font:** Helvetica Neue, con fallback di sistema
**Body Font:** stack di sistema
**Label/Mono Font:** SF Mono, Menlo e fallback monospace

**Character:** diretta, leggibile, con differenze di scala nette. Il display è grande e compatto; il corpo mantiene un ritmo tranquillo e una misura leggibile.

### Hierarchy

- **Display** (820, fluido, 0.88): una sola idea dominante per apertura.
- **Headline** (780, fluido, 0.95–1.08): titoli di sezione e nomi di progetto.
- **Title** (780, 1.18–2.7rem, 1.2): titoli di schede e note.
- **Body** (400, 16.5px, 1.6): testo corrente, con misura massima vicina a 70 caratteri.
- **Label** (640, 0.8rem, normale): date e dati funzionali; mai una sottopancia d'atmosfera.

### Named Rules

**The No Kicker Rule.** Un titolo non riceve una piccola etichetta sopra solo per sembrare progettato.

## Elevation

Le superfici sono piatte. La profondità arriva da scala, spazio, contrasto tonale e bordi da un pixel. L'unica ombra ambientale ammessa separa l'intero foglio bianco dallo sfondo sui monitor larghi; card, elenchi e navigazione restano senza ombra.

### Named Rules

**The Flat By Default Rule.** Se un componente ha bisogno di un'ombra per essere riconoscibile, la gerarchia non è ancora risolta.

## Components

### Buttons

- **Shape:** pillola compatta, riservata ad azioni reali.
- **Primary:** verde operativo, testo bianco, 11px per 18px.
- **Hover / Focus:** verde più profondo; focus da 2px ben visibile.
- **Secondary / Ghost:** bianco e bordo sottile, senza ombra.

### Chips

- **Style:** superficie neutra, bordo da un pixel, testo tecnico.
- **State:** solo metadati o filtri reali. Non usare chip per ripetere frasi già presenti nella pagina.

### Cards / Containers

- **Corner Style:** quasi squadrato (4px).
- **Background:** bianco o una visualizzazione a colore pieno.
- **Shadow Strategy:** nessuna ombra.
- **Border:** linea neutra da un pixel.
- **Internal Padding:** 24–48px secondo la scala del contenuto.

### Navigation

Il marchio resta a sinistra, quattro destinazioni restano a destra. Lo stato attivo usa una linea verde da 2px. Su mobile il marchio occupa la prima riga e le quattro destinazioni la seconda. MediFlow appartiene a “Lavoro” e non compare come quinta voce.

### Index Visual

Ogni fonte riceve una visualizzazione CSS distinta che ne suggerisce la grammatica. La visuale è contenuto: non viene accompagnata da etichette decorative e non sostituisce la nota critica.

## Do's and Don'ts

### Do:

- **Do** mantenere una sola destinazione per concetto e controllare i duplicati prima di pubblicare.
- **Do** conservare la voce diretta e in prima persona già presente nei testi.
- **Do** usare gerarchia tipografica, spazio e bordi sottili prima di aggiungere contenitori.
- **Do** mostrare diagrammi, dati o esempi reali quando un tema ha bisogno di un'immagine.
- **Do** lasciare che ogni sezione abbia un compito chiaro: progetto, note, indice o bio.

### Don't:

- **Don't** duplicare MediFlow fra navigazione, call to action e contenuto della stessa regione.
- **Don't** aggiungere metatesto generativo, slogan sul design, kicker, soprattitoli o piccole sottopance decorative.
- **Don't** ripetere il menu nel footer.
- **Don't** usare gradienti decorativi, griglie di sfondo, glassmorphism o card fantasma con ombre larghe.
- **Don't** arrotondare ogni superficie o mettere un'icona sopra ogni titolo.
- **Don't** trasformare il sito in una landing SaaS o in un finto magazine editoriale.
