# leonardopegollo.dev

Sito personale. Home, white paper di MediFlow, blog. Statico, costruito con Astro, pubblicato su Cloudflare Pages.

Dominio: **leonardopegollo.dev** (registrato su Cloudflare Registrar, zona DNS già gestita da Cloudflare).

---

## Indice

1. [Cosa c'è dentro](#1-cosa-cè-dentro)
2. [Avviare il sito in locale](#2-avviare-il-sito-in-locale)
3. [Spostare il progetto in un repo dedicato](#3-spostare-il-progetto-in-un-repo-dedicato)
4. [Pubblicare su Cloudflare Pages](#4-pubblicare-su-cloudflare-pages)
5. [Collegare il dominio leonardopegollo.dev](#5-collegare-il-dominio-leonardopegollodev)
6. [Email su @leonardopegollo.dev (gratis)](#6-email-su-leonardopegollodev-gratis)
7. [Scrivere un nuovo post](#7-scrivere-un-nuovo-post)
8. [Modificare il white paper o la home](#8-modificare-il-white-paper-o-la-home)
9. [Costi attesi](#9-costi-attesi)
10. [Estensioni future](#10-estensioni-future)

---

## 1. Cosa c'è dentro

```
leonardopegollo.dev/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Nav.astro
│   │   └── Scene.astro
│   ├── content/
│   │   ├── blog/
│   │   │   └── 2026-05-04-benvenuto.md
│   │   └── config.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   ├── mediflow/
│   │   │   └── index.astro
│   │   └── rss.xml.js
│   └── styles/
│       └── global.css
├── .gitignore
├── astro.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

Le rotte pubbliche corrispondono ai file in `src/pages/`:

| URL | File | Cosa è |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Home personale |
| `/about` | `src/pages/about.astro` | Chi sono |
| `/mediflow` | `src/pages/mediflow/index.astro` | White paper di MediFlow |
| `/blog` | `src/pages/blog/index.astro` | Lista dei post |
| `/blog/<slug>` | `src/pages/blog/[...slug].astro` | Singolo post (generato dai markdown in `src/content/blog/`) |
| `/rss.xml` | `src/pages/rss.xml.js` | Feed RSS del blog |
| `/sitemap-index.xml` | generato da Astro | Sitemap automatica |

---

## 2. Avviare il sito in locale

Servono **Node.js 20+** e **npm**.

Se non hai Node, su macOS il modo più pulito è installare `nvm` (Node Version Manager) e poi una versione LTS di Node:

```bash
# se non hai brew, parti da https://brew.sh
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install 20
nvm use 20
node -v   # dovrebbe mostrare v20.x.x
```

Poi entri nel progetto e installi le dipendenze:

```bash
cd ~/Antigravity/leonardopegollo.dev
npm install
npm run dev
```

Apri `http://localhost:4321`. Modifichi un file e il sito si aggiorna da solo.

Per simulare la versione di produzione:

```bash
npm run build      # crea la cartella dist/
npm run preview    # serve dist/ come la vedrebbe Cloudflare
```

---

## 3. Spostare il progetto in un repo dedicato

Adesso questa cartella sta dentro `medical-record-app/leop-dev-site` come zona di staging.
La spostiamo a `~/Antigravity/leonardopegollo.dev` e ne facciamo un repo Git autonomo.

```bash
# 1. Sposta la cartella fuori dal progetto medical-record-app
mv ~/Antigravity/medical-record-app/leop-dev-site ~/Antigravity/leonardopegollo.dev

# 2. Inizializza un repository Git
cd ~/Antigravity/leonardopegollo.dev
git init
git add .
git commit -m "Setup iniziale: home, white paper MediFlow, blog"
git branch -M main
```

Crea il repo su GitHub:

- Vai su `https://github.com/new`
- Nome: **`leonardopegollo.dev`** (lo stesso del dominio, comodo per non confondere)
- Visibilità: pubblico va bene (è un sito personale, non c'è nulla di sensibile)
- **Non** spuntare "Add a README" né altre opzioni: lo abbiamo già

Collega e pubblica:

```bash
git remote add origin git@github.com:<tuo-username>/leonardopegollo.dev.git
git push -u origin main
```

Se non hai mai usato `git` con SSH, il modo più rapido è autenticarti tramite GitHub CLI:

```bash
brew install gh
gh auth login   # segui il flusso, scegli HTTPS, autorizza nel browser
gh repo create leonardopegollo.dev --public --source . --remote origin --push
```

Quest'ultimo comando fa repo + remote + push in un colpo solo.

---

## 4. Pubblicare su Cloudflare Pages

Una volta che il repo è su GitHub, collegarlo a Pages prende 5 minuti. Il dominio è già su Cloudflare quindi salti tutta la parte DNS che fanno gli altri.

### 4.1 Apri Cloudflare Pages

Da `https://dash.cloudflare.com`:

- menu laterale → **Workers & Pages**
- bottone **Create application**
- tab **Pages**
- **Connect to Git**

Autorizza l'integrazione GitHub (la prima volta ti chiede un consenso).
Seleziona il repo `leonardopegollo.dev`. Branch: `main`.

### 4.2 Configurazione build

Compila i campi così:

| Campo | Valore |
| --- | --- |
| **Project name** | `leonardopegollo-dev` (Cloudflare non accetta il punto qui) |
| **Production branch** | `main` |
| **Framework preset** | **Astro** |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory (advanced)** | (lascia vuoto) |
| **Environment variables** | aggiungi `NODE_VERSION` = `20` |

> La variabile `NODE_VERSION` è importante: senza, Cloudflare prova un Node troppo vecchio per Astro 4 e la build fallisce.

Salva. Parte il primo deploy. In 1-2 minuti hai un URL `https://leonardopegollo-dev.pages.dev` funzionante.

### 4.3 Verifica

Apri l'URL `*.pages.dev`. Controlla:

- la home si vede e ha lo stile liquid glass corretto
- `/mediflow` mostra il white paper
- `/blog` mostra il post di benvenuto
- `/rss.xml` apre il feed RSS

Se qualcosa non torna, vai nei "Deployments" della Pages app e leggi il log di build: dice esattamente cosa è andato storto.

---

## 5. Collegare il dominio leonardopegollo.dev

Dentro la Pages app:

- tab **Custom domains**
- bottone **Set up a custom domain**
- inserisci `leonardopegollo.dev`
- conferma

Cloudflare riconosce che il dominio è gestito dallo stesso account: aggiunge automaticamente il record DNS necessario nella zona `leonardopegollo.dev` ed emette un certificato HTTPS via Let's Encrypt. Tutto in pochi minuti.

Ripeti il passaggio per `www.leonardopegollo.dev` se vuoi che funzioni anche con `www` davanti (consigliato: redirect automatico al dominio principale).

A propagazione completata, `https://leonardopegollo.dev` apre il sito con HTTPS valido.

### Fissaggio HTTPS e cose da abilitare

Sempre nel pannello Cloudflare, sezione `leonardopegollo.dev`:

- **SSL/TLS** → modalità: **Full (strict)** (Cloudflare Pages è già su HTTPS dietro le quinte)
- **SSL/TLS → Edge Certificates** → attiva **Always Use HTTPS** (redirect automatico da http a https)
- **Speed → Optimization → Brotli** → attivo (compressione, gratis)
- **Caching → Configuration** → `Browser Cache TTL`: standard va bene

Puoi opzionalmente attivare **Web Analytics** (gratis, senza cookie, senza tracker di terze parti): da `Analytics & Logs → Web Analytics → Add a site`. Ti dà numero di visite e pagine viste, niente più.

---

## 6. Email su @leonardopegollo.dev (gratis)

Cloudflare Email Routing ti permette di **ricevere** email su `qualsiasi-cosa@leonardopegollo.dev` e farle inoltrare alla tua casella personale (gmail, fastmail, ecc.). Costo: zero.

> Per **inviare** email da `@leonardopegollo.dev` serve un servizio terzo (Fastmail, Google Workspace, Migadu). Email Routing fa solo ricezione e forwarding. Per uno sito personale ti basta avere un indirizzo che riceve.

### Setup in 3 minuti

Pannello Cloudflare → zona `leonardopegollo.dev` → menu laterale **Email → Email Routing**:

1. Bottone **Get started**.
2. Cloudflare aggiunge automaticamente i record MX, SPF e DKIM richiesti. Conferma.
3. **Destination addresses** → aggiungi la tua casella personale (es. `leonardo.pegollo@gmail.com`). Cloudflare manda una email di verifica, clicchi il link.
4. **Routes** → "Create address":
   - per esempio: `hello@leonardopegollo.dev` → forward a `leonardo.pegollo@gmail.com`
   - puoi creare quanti alias vuoi: `info@`, `me@`, `feedback@`, ecc.
5. Opzionale ma consigliato: attiva la **catch-all rule** che inoltra tutto quello che arriva a `*@leonardopegollo.dev` alla tua casella. Pratica nei moduli web dove vuoi un alias usa-e-getta.

A propagazione completata (qualche minuto), provando a scrivere a `hello@leonardopegollo.dev` ti arriva nella casella di destinazione.

---

## 7. Scrivere un nuovo post

Crea un file in `src/content/blog/` con nome `YYYY-MM-DD-titolo-breve.md`.

Compila il frontmatter (intestazione tra `---`):

```markdown
---
title: "Titolo del post"
description: "Una riga di descrizione, massimo 220 caratteri."
pubDate: 2026-05-15
tags: ["sanita-pubblica", "indicatori"]
draft: false
---

Il contenuto del post in markdown.

## Sezione

Testo, **grassetto**, *corsivo*, `codice inline`, [link](https://example.com).

> Citazioni con il maggiore.
```

Poi:

```bash
git add src/content/blog/2026-05-15-titolo-breve.md
git commit -m "Nuovo post: titolo del post"
git push
```

Cloudflare ricostruisce e pubblica. In meno di un minuto è online.

Per tenere un post in bozza senza pubblicarlo: `draft: true`. Verrà ignorato dall'indice e dal feed RSS.

---

## 8. Modificare il white paper o la home

Il white paper è in un solo file: `src/pages/mediflow/index.astro`.

La home è in `src/pages/index.astro`.

La pagina "Chi sono" è in `src/pages/about.astro`.

Lo stile (liquid glass, palette colori, animazioni) è in `src/styles/global.css`. Cambiando le variabili CSS in cima al file (`:root { ... }`) si propaga a tutto il sito. Le variabili importanti:

- `--bg-0`, `--bg-1` colori di sfondo
- `--ink-0`, `--ink-1`, `--ink-2`, `--ink-3` gerarchia di colore del testo
- `--teal`, `--azure`, `--violet` colori di accento (la palette liquid glass)

---

## 9. Costi attesi

| Voce | Costo annuo | Note |
| --- | --- | --- |
| Dominio `leonardopegollo.dev` | ~12 € | Cloudflare Registrar è "at-cost", nessun ricarico |
| Hosting Cloudflare Pages | 0 € | piano Free: 500 build/mese, banda illimitata, dominio custom + HTTPS gratis |
| Certificato HTTPS | 0 € | emesso automaticamente da Cloudflare |
| Email su `@leonardopegollo.dev` (ricezione) | 0 € | Cloudflare Email Routing |
| Email su `@leonardopegollo.dev` (invio) | dipende | per inviare serve un servizio terzo (es. Fastmail ~3 $/mese) |
| Web Analytics | 0 € | Cloudflare Web Analytics, opzionale |

A regime paghi solo il rinnovo annuale del dominio.

---

## 10. Estensioni future

Non ti servono adesso, ma quando le vorrai:

- **Newsletter**: integrazione con Buttondown o EmailOctopus, free tier generoso fino a qualche centinaio di iscritti.
- **Commenti sui post**: [Giscus](https://giscus.app/) (gratis, basato su GitHub Discussions, niente account terzi richiesti al lettore).
- **Form contatti**: Cloudflare Pages Functions (gratis fino a 100k invocazioni/giorno).
- **Multilingua (IT/EN)**: configurazione manuale di `src/pages/en/...` o pacchetto `astro-i18n`.
- **Dark/Light theme switcher**: oggi il sito è solo dark; aggiungerlo è una variabile CSS in più e un piccolo toggle in nav.
- **Tag pages del blog**: una pagina per tag, generata automaticamente da `getStaticPaths()`.

Niente di tutto questo è necessario all'inizio.

---

## Risorse

- [Astro · documentazione](https://docs.astro.build/)
- [Cloudflare Pages · documentazione](https://developers.cloudflare.com/pages/)
- [Cloudflare Email Routing · guida](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)
- [Markdown reference](https://www.markdownguide.org/cheat-sheet/)

---

## Promemoria

Le risposte stanno nel codice. Se proprio non le trovi, scrivimi a `hello@leonardopegollo.dev`
(funzionerà non appena attivato Cloudflare Email Routing, vedi sezione 6).
