export type IndexVisualKind =
  | 'gallery'
  | 'story'
  | 'notebook'
  | 'atlas'
  | 'river'
  | 'product';

export interface IndexEntry {
  slug: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  why: string;
  observe: string[];
  transferable: string;
  limits: string;
  visual: IndexVisualKind;
}

export const indexEntries: IndexEntry[] = [
  {
    slug: 'brik-gallery',
    title: 'Brik Gallery',
    url: 'https://brik.space/Gallery',
    source: 'Galleria web',
    summary: 'Una raccolta di siti che tratta il web come materiale visivo, non come una serie di template.',
    why: 'Mi serve per ricordare che un indice può avere ritmo senza diventare rumoroso.',
    observe: [
      'Come alterna densità e vuoto.',
      'La varietà delle anteprime, senza una griglia troppo regolare.',
      'Il modo in cui ogni sito resta riconoscibile.',
    ],
    transferable: 'La varietà può stare nella composizione, non nel numero di componenti.',
    limits: 'Una galleria si può permettere più disorientamento di un sito personale.',
    visual: 'gallery',
  },
  {
    slug: 'the-pudding',
    title: 'The Pudding',
    url: 'https://pudding.cool/',
    source: 'Visual essays',
    summary: 'Storie spiegate con dati, disegno e interazione. Il formato cambia quando cambia la domanda.',
    why: 'È il riferimento più utile quando una visualizzazione deve portare avanti il ragionamento, non decorarlo.',
    observe: [
      'La domanda arriva prima della tecnica.',
      'Testo e grafica si dividono il lavoro.',
      'Ogni storia costruisce la propria forma.',
    ],
    transferable: 'Una visualizzazione vale quando toglierla renderebbe il testo meno chiaro.',
    limits: 'Richiede tempo editoriale e dati solidi: imitarne solo la superficie non serve.',
    visual: 'story',
  },
  {
    slug: 'observable',
    title: 'Observable',
    url: 'https://observablehq.com/',
    source: 'Notebook e dati',
    summary: 'Notebook reattivi e strumenti per esplorare dati direttamente nel browser.',
    why: 'Rende visibile il passaggio fra domanda, codice e risultato senza separare artificialmente le tre cose.',
    observe: [
      'La prossimità fra spiegazione e oggetto interattivo.',
      'Il feedback immediato quando cambia un dato.',
      'La possibilità di leggere il metodo oltre al risultato.',
    ],
    transferable: 'Quando il processo conta, va mostrato accanto all’esito e non relegato in una nota tecnica.',
    limits: 'La libertà del notebook può diventare dispersione se manca una domanda precisa.',
    visual: 'notebook',
  },
  {
    slug: 'our-world-in-data',
    title: 'Our World in Data',
    url: 'https://ourworldindata.org/',
    source: 'Ricerca e grafici',
    summary: 'Ricerca, serie storiche e strumenti di esplorazione sui grandi problemi globali.',
    why: 'Mostra quanto può essere sobria una pagina quando fonti, definizioni e confronti sono davvero parte del contenuto.',
    observe: [
      'Le definizioni restano vicine al grafico.',
      'Il lettore può cambiare confronto senza perdere il contesto.',
      'Fonti e download non sono nascosti.',
    ],
    transferable: 'Un dato è più utile quando si vede da dove arriva e cosa misura.',
    limits: 'La sua architettura serve un archivio enorme; su un sito piccolo sarebbe eccessiva.',
    visual: 'atlas',
  },
  {
    slug: 'datawrapper-river',
    title: 'Datawrapper River',
    url: 'https://river.datawrapper.de/',
    source: 'Archivio visuale',
    summary: 'Una raccolta di grafici, mappe e tabelle pubblicati con Datawrapper.',
    why: 'È un catalogo operativo: aiuta a scegliere una forma guardando come è stata usata su dati reali.',
    observe: [
      'La leggibilità delle anteprime anche in piccolo.',
      'La quantità di variazioni ottenute con una grammatica coerente.',
      'Il rapporto fra titolo, annotazioni e grafico.',
    ],
    transferable: 'Prima di inventare un formato conviene vedere come regge su esempi già pubblicati.',
    limits: 'Il catalogo aiuta a scegliere una forma, non sostituisce il giudizio sul dato.',
    visual: 'river',
  },
  {
    slug: 'linear',
    title: 'Linear',
    url: 'https://linear.app/',
    source: 'Prodotto software',
    summary: 'Un prodotto complesso che mantiene una superficie calma e una gerarchia leggibile.',
    why: 'È un buon controllo contro l’istinto di rendere visibile ogni funzione nello stesso momento.',
    observe: [
      'Le azioni principali hanno peso, le altre restano disponibili.',
      'Spaziatura e contrasto fanno più lavoro delle cornici.',
      'Le transizioni spiegano dove ci si trova.',
    ],
    transferable: 'La calma non viene dal vuoto: viene da una gerarchia decisa bene.',
    limits: 'L’efficienza di un’app non va copiata alla lettera in un sito da leggere.',
    visual: 'product',
  },
];
