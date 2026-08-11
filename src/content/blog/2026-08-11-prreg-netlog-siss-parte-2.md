---
title: "SISS parte 2: dentro PRREG, il nuovo prescrittivo regionale"
description: "Seconda ricostruzione osservazionale sul SISS lombardo: cosa cambia con PRREG, come si muove il browser, dove emergono errori e perché resta un handoff."
pubDate: 2026-08-11
tags: ["mediflow", "sanità", "architettura", "siss"]
draft: false
---

> **Nota metodologica.** Questo post è la seconda parte della [mappatura del flusso prescrittivo SISS](/blog/2026-05-21-mappatura-siss/). Nasce dall'analisi di un Chrome NetLog raccolto durante una sessione reale sul **Prescrittivo Regionale (PRREG) Produzione**. Il log è stato letto solo in forma redatta: host, path, metodo, status, sequenza e tempi. Non sono riportati cookie, token, header, query string, payload, identificativi regionali, dati paziente o contenuti clinici. I nomi degli endpoint non sono una specifica pubblica e non vanno trattati come contratto d'integrazione. Sono tracce di comportamento osservato.

Nel primo post la tesi era prudente: il vecchio modulo prescrittivo SISS era una SPA (Single Page Application) di generazione precedente, imperniata su `POST /prescrizione/jsonBroker`, cioè su un broker applicativo centrale chiamato ripetutamente dal browser. La conseguenza architetturale era scomoda ma netta: un gestionale come MediFlow poteva preparare contesto, bozza e riconciliazione, ma l'atto prescrittivo vero restava nel portale regionale.

PRREG cambia il paesaggio. Non lo cambia nel senso che diventa magicamente un'API pubblica per i gestionali. Lo cambia perché il traffico osservato non assomiglia più al vecchio broker opaco. Il nuovo modulo espone al browser una superficie più leggibile, fatta di endpoint REST con nomi di dominio: ricerca prestazioni, dati statici, check, partizionamento, preparazione registrazione, risposta di registrazione, stampa, annullamento, storico, errori.

Questo è il punto importante: PRREG è più moderno e più articolato, ma resta dentro il perimetro della webapp regionale autenticata. Il salto da "posso osservare endpoint semantici nel browser" a "posso integrarli da MediFlow" non è tecnico, è autorizzativo, contrattuale, di sicurezza e di responsabilità.

## La nuova forma del problema

Nel vecchio modulo il browser parlava quasi sempre con lo stesso indirizzo. La semantica dell'operazione stava nel payload: identifica cittadino, cerca prestazione, registra prescrizione, recupera PDF. A livello di rete vedevi un martello che batteva sullo stesso chiodo: `jsonBroker`.

Nel NetLog PRREG la forma è diversa. Si entra dal menu SISS, si passa attraverso l'autenticazione regionale, poi il browser atterra su `/prescrittivoRegionale`. Da lì partono chiamate separate per configurazione, ruolo, struttura, credenziali, dati statici, ricerca e atto prescrittivo.

Ridotta all'osso, la sequenza è questa:

```text
Menu SISS
-> autenticazione CRS / SSO / firma remota
-> SAML verso operatorisiss
-> root PRREG
-> bootstrap HCP4I OAuth e PILe
-> configurazione prescrittiva
-> ricerca e classificazione prestazioni
-> controlli prescrittivi
-> partizionamento
-> preparazione registrazione
-> invio ai servizi regionali
-> risposta di registrazione
-> controllo errori
-> preparazione stampa
-> eventuale annullamento o cancellazione
```

Non è un dettaglio cosmetico. Nel vecchio mondo il browser sembrava parlare con una funzione remota generica. Nel nuovo mondo parla con un backend che lascia intravedere una modellazione del dominio. Il sistema non sta più solo "mandando una richiesta al broker"; sta facendo cose riconoscibili: cercare elementi prescrivibili, mapparli in una prescrizione, controllarne la validità, dividerli quando serve, registrarli, stamparli, annullarli.

Per chi lavora su un gestionale è una differenza rilevante. Non perché autorizzi a consumare quegli endpoint, ma perché chiarisce meglio dove stanno gli snodi del flusso.

## Autenticazione: è ancora la sessione browser a governare

La prima cosa che il log conferma è che PRREG non nasce come applicazione standalone liberamente richiamabile. Il percorso continua a passare dal menu SISS e dal perimetro di autenticazione regionale.

La catena osservata attraversa:

- menu SISS regionale
- domini CRS Lombardia per SSO e autenticazione forte
- passaggi di remote sign e selezione ruolo
- redirect SAML verso `operatorisiss`
- root applicativa `/prescrittivoRegionale`
- bootstrap interno con HCP4I OAuth e PILe

Questo dice due cose.

La prima: il medico non entra in PRREG come utente generico. Entra come operatore regionale profilato, con ruolo, struttura e attributi autorizzativi. La webapp non sta solo mostrando un form: sta ricevendo un contesto funzionale che determina cosa può fare quella persona in quel momento.

La seconda: l'esistenza di endpoint REST non equivale all'esistenza di un canale applicativo per terzi. Gli endpoint vivono dentro una sessione già autenticata, costruita dal browser e dal middleware regionale. Chiamarli fuori da quel contesto significherebbe ricostruire sessione, credenziale, ruolo, consenso, audit e responsabilità dell'atto. È esattamente il confine che nel primo post rendeva sensato l'handoff.

La differenza è che ora vediamo meglio il muro.

## Bootstrap: PRREG si carica come applicazione di dominio

Dopo l'ingresso nella root applicativa, il browser non parte subito dalla prescrizione. Prima carica configurazioni.

Nel log compaiono superfici come:

```text
/prescrittivoRegionale/hcp4i-oauth/rest/configService/getConfigs
/prescrittivoRegionale/hcp4i-oauth/rest/applicationService/appModulesConfig
/prescrittivoRegionale/hcp4i-oauth/rest/feature/getConfigurationsOnLogin
/prescrittivoRegionale/hcp4i-oauth/rest/operatorService/getUserData
/prescrittivoRegionale/hcp4i-oauth/rest/structures/getStructureDetails
/prescrittivoRegionale/prescription/rest/static-prescription-data/configuration
/prescrittivoRegionale/prescription/rest/static-prescription-data/static-data
/prescrittivoRegionale/prescription/rest/prescribable-services/getConfigurationEnte
```

Questi nomi vanno letti con cautela, ma la direzione è chiara. PRREG non è soltanto una pagina con campi. È una webapp che, prima di prescrivere, chiede:

- chi è l'operatore;
- con quale ruolo entra;
- quale struttura o ente è attivo;
- quali moduli applicativi sono abilitati;
- quali feature vanno accese al login;
- quali dati statici prescrittivi servono al client.

Il vecchio portale nascondeva molto di questo dietro il broker. PRREG lo rende più visibile.

Dal punto di vista della UX (User Experience) questo spiega anche perché il primo caricamento può sembrare pesante: il browser sta componendo una sessione applicativa ricca, non solo scaricando una pagina HTML.

## Dal campo libero alla classificazione

Nel primo post avevo segnalato la novità più visibile di PRREG: il campo libero. Il vecchio portale obbligava a ragionare per ramo: farmaceutica o specialistica, poi catalogo coerente, poi selezione. PRREG lascia più spazio al gesto naturale: scrivi cosa vuoi prescrivere e lascia che il sistema proponga o classifichi.

Il NetLog conferma che questa esperienza UI ha un corrispettivo backend. Nel traffico compaiono chiamate come:

```text
/prescrittivoRegionale/prescription/rest/prescribable-services/search
/prescrittivoRegionale/prescription/rest/prescription-specialties-and-drugs/map-for-prescription
/prescrittivoRegionale/prescription/rest/lea/get-by-regional-service-codes
/prescrittivoRegionale/prescription/rest/diagnostic-question/search
/prescrittivoRegionale/prescription/rest/exemption/search-prest-by-esez
```

Qui si vede il cambio di paradigma.

`prescribable-services/search` suggerisce una ricerca ampia sugli oggetti prescrivibili. Non basta trovare una stringa: il sistema deve capire se il risultato è farmaco, prestazione specialistica, elemento con vincoli LEA (Livelli Essenziali di Assistenza), voce legata a esenzioni, o componente di una prescrizione più complessa.

`map-for-prescription` è ancora più esplicito: qualcosa viene mappato "per la prescrizione". È il punto in cui il risultato della ricerca smette di essere solo item di catalogo e diventa elemento compilabile dentro l'atto.

Questa distinzione è importante perché il dato clinico di partenza può essere ambiguo. "Visita cardiologica" non è una prescrizione completa. Può diventare prima visita, controllo, con ECG incluso, senza ECG, con priorità diversa, con quesito diagnostico obbligatorio, con vincoli di esenzione o di erogabilità. Il lavoro interessante di PRREG sta proprio nel passaggio fra testo umano e item prescrittivo codificato.

Per MediFlow questo rafforza una scelta già fatta: una bozza locale può aiutare, ma non deve spacciarsi per validazione ufficiale. Può ricordare il contesto clinico, proporre una checklist, evitare omissioni grossolane. Non può dire "questa ricetta è conforme" se quella conformità dipende da cataloghi e regole regionali applicati nella webapp.

## La prescrizione come pipeline

La parte più utile del log è la sequenza dell'atto. PRREG non sembra registrare una ricetta con un singolo salto. La webapp costruisce una pipeline.

La forma osservata è questa:

<figure class="prreg-viz prreg-flow" data-prreg-flow aria-labelledby="prreg-flow-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-flow-title">Che cosa succede dopo il menu SISS?</h3>
      <p>Scegli un passaggio. Oppure guarda la sequenza completa.</p>
    </div>
  </div>
  <div class="prreg-flow__controls" aria-label="Controlli della sequenza">
    <button type="button" data-prreg-prev aria-label="Passaggio precedente">←</button>
    <button type="button" data-prreg-play aria-pressed="false">Avvia</button>
    <button type="button" data-prreg-next aria-label="Passaggio successivo">→</button>
    <span class="prreg-flow__status" data-prreg-status aria-live="polite">Passaggio 1 di 10</span>
  </div>
  <ol class="prreg-flow__track" aria-label="Pipeline PRREG osservata">
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="true"><span class="prreg-step__n">01 · INGRESSO</span><strong>Menu SISS</strong><small>Avvio dal canale regionale</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">02 · IDENTITÀ</span><strong>Autenticazione</strong><small>Ruolo e struttura attivi</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">03 · CONTESTO</span><strong>Avvio app</strong><small>Config e dati statici</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">04 · CATALOGO</span><strong>Ricerca</strong><small>Candidati prescrivibili</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">05 · DOMINIO</span><strong>Associazione</strong><small>Risultato nella prescrizione</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">06 · REGOLE</span><strong>Controlli</strong><small>Completezza e coerenza</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">07 · COMPOSIZIONE</span><strong>Partizionamento</strong><small>Divisione o raggruppamento</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">08 · ATTO</span><strong>Registrazione</strong><small>Preparazione e invio</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">09 · ESITO</span><strong>Controllo</strong><small>Risposta ed errori</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">10 · USCITA</span><strong>Stampa</strong><small>Documento o ricevuta</small></button></li>
  </ol>
  <div class="prreg-flow__detail" aria-live="polite">
    <div data-prreg-panel><strong>Menu SISS</strong><p>Il percorso parte dal menu regionale. Il log non mostra un ingresso autonomo dal gestionale.</p></div>
    <div data-prreg-panel><strong>Autenticazione e profilo</strong><p>L'autenticazione e la scelta del profilo preparano la sessione usata da PRREG.</p></div>
    <div data-prreg-panel><strong>Avvio della webapp</strong><p>PRREG carica configurazioni, moduli, ruolo, struttura e dati statici.</p></div>
    <div data-prreg-panel><strong>Ricerca</strong><p>Il testo produce alcuni risultati. Il log non spiega come PRREG li ordina.</p></div>
    <div data-prreg-panel><strong>Associazione</strong><p>PRREG trasforma il risultato scelto in un elemento della prescrizione. Il nome della chiamata non documenta tutte le regole.</p></div>
    <div data-prreg-panel><strong>Controlli</strong><p>La webapp controlla la prescrizione prima della registrazione. Il log redatto non mostra tutte le regole applicate.</p></div>
    <div data-prreg-panel><strong>Partizionamento</strong><p>PRREG può dividere o raggruppare gli elementi. L'elenco iniziale non coincide sempre con le ricette finali.</p></div>
    <div data-prreg-panel><strong>Registrazione</strong><p>Preparazione e invio sono due passaggi distinti. La bozza diventa un atto solo se l'esito lo conferma.</p></div>
    <div data-prreg-panel><strong>Controllo dell'esito</strong><p>La webapp legge la risposta e cerca eventuali errori. Un guasto qui può lasciare l'esito incerto.</p></div>
    <div data-prreg-panel><strong>Stampa</strong><p>PRREG prepara la stampa dopo il controllo dell'esito. Compilazione, registrazione e stampa sono tre stati diversi.</p></div>
  </div>
  <figcaption>Il log mostra questi passaggi nella webapp autenticata. Non dimostra l'esistenza di un contratto d'integrazione.</figcaption>
</figure>

| Fase | Superficie osservata | Cosa mostra il dato |
| --- | --- | --- |
| Dati statici | `static-prescription-data/*` | Il client carica configurazioni e vocabolari necessari alla compilazione. |
| Ricerca | `prescribable-services/search` | Il testo inserito viene trasformato in candidati prescrivibili. |
| Associazione | `map-for-prescription` | I risultati vengono adattati alla struttura della prescrizione. |
| Controllo | `prescriptions/check` | Il sistema valuta completezza o coerenza prima del passo dispositivo. |
| Partizionamento | `prescriptions/partition` | Gli item vengono divisi o raggruppati secondo regole regionali. |
| Preparazione | `prepare-register-request` | Il client prepara la richiesta che andrà al servizio regionale. |
| Invio | `pile-api/services` | PRREG passa dal livello webapp al servizio sottostante. |
| Risposta | `register-prescriptions-by-client-response` | Il client riceve e normalizza l'esito di registrazione. |
| Controllo esito | `check-prescription-error` | La webapp verifica se la registrazione ha prodotto errori applicativi. |
| Stampa | `prepare-print-request` | Il sistema prepara il documento stampabile o la ricevuta. |

Questa tabella è il cuore della seconda parte.

Nel vecchio portale avevamo già distinto "crea ricetta" e "registra ricette". PRREG rende questa distinzione ancora più forte. Prima della registrazione esistono ricerca, selezione, mapping, controllo e partizionamento. Solo dopo arrivano registrazione, esito e stampa. È una macchina a stati, non un form con submit.

Per un gestionale questo significa che lo stato locale non dovrebbe essere binario. Non basta:

```text
prescrizione = fatta / non fatta
```

Serve almeno una tassonomia di lavoro:

```text
bozza locale
ricerca avviata nel portale
item selezionato o mappato
prescrizione controllata
prescrizione registrata
stampa preparata
prescrizione annullata
prescrizione cancellata
esito non riconciliato
errore da recuperare
```

Non tutti questi stati devono essere automatizzati. Anzi: nel modello handoff molti resteranno dichiarati o riconciliati manualmente. Però nominarli bene evita l'errore peggiore: trattare una ricetta compilata come se fosse una ricetta emessa.

## Storico, import e recupero

Un altro blocco interessante riguarda lo storico:

```text
/prescrittivoRegionale/prescription/rest/prescriptions-history/count
/prescrittivoRegionale/prescription/rest/prescriptions-history/search
/prescrittivoRegionale/prescription/rest/prescriptions-history/import
/prescrittivoRegionale/prescription/rest/prescriptions-history/get-prescriptions
```

Nel log queste chiamate precedono o accompagnano parti della sessione prescrittiva. PRREG sembra lavorare anche su prescrizioni già presenti: può contarle, cercarle, importarle o recuperarle.

Questo è coerente con un modulo regionale maturo. Chi prescrive non vive in una pagina vuota: deve poter vedere cosa è già stato prodotto, importare o riusare elementi, verificare esiti, annullare o correggere.

Qui emerge anche un dato prestazionale: nel tracciamento osservato `prescriptions-history/search` è stata la superficie più lenta, con durate intorno a diversi secondi e punte oltre gli otto. Non è una prova statistica, è un singolo log. Però spiega bene una parte della latenza percepita: le operazioni lente non sono solo la registrazione dell'atto, ma anche la ricostruzione del contesto.

La UX di PRREG può essere migliore del vecchio modulo, ma se ogni ricerca di storico o recupero passa da round trip regionali pesanti, il medico continuerà a vivere il sistema come lento.

## L'annullamento non è un dettaglio

Nel flusso osservato compaiono anche superfici di annullamento e cancellazione:

```text
/prescrittivoRegionale/prescription/rest/prescriptions/prepare-nullify-request
/prescrittivoRegionale/prescription/rest/prescriptions/nullify-prescriptions-by-client-response
/prescrittivoRegionale/prescription/rest/prescriptions/delete
```

Questo è rilevante perché l'atto prescrittivo non finisce con il numero di ricetta. Una ricetta può essere annullata, corretta, cancellata da una lista locale o esclusa da un set in lavorazione. Questi passaggi hanno peso diverso.

"Delete" in una webapp non equivale necessariamente ad annullamento regionale. Può voler dire rimuovere un item non ancora registrato, eliminare una bozza, pulire una lista di lavoro. "Nullify", invece, suggerisce un annullamento dell'atto o una richiesta che tocca lo stato regionale della prescrizione.

Senza payload non bisogna inventare. Ma la distinzione lessicale è già sufficiente per dire che un gestionale deve modellare due piani:

- cancellazione di ciò che non è ancora atto regionale;
- annullamento o rettifica di ciò che è già stato registrato.

Sono piani diversi sul piano clinico, amministrativo e medico-legale.

## Quando PRREG si ferma: il problema per chi prescrive

Nell'uso quotidiano, il problema non si presenta come una sequenza ordinata di status HTTP. Si presenta come un timeout, un messaggio rosso o una pagina che non prosegue. A volte PRREG non lascia entrare. Altre volte si blocca durante la compilazione. Nel caso peggiore, l'errore arriva dopo l'invio e non è subito chiaro se la prescrizione sia stata registrata.

Sono situazioni diverse, ma per chi sta lavorando producono lo stesso effetto: interrompono la prescrizione e fanno perdere il controllo sul punto raggiunto. Se il blocco avviene prima dell'autenticazione, non si entra nel modulo. Se avviene prima della registrazione, si può tornare sui dati e correggere. Se avviene durante o dopo l'invio, ripetere subito l'operazione può essere rischioso: prima va verificato lo stato regionale.

Il NetLog analizzato non misura quanto spesso accadano questi problemi e non contiene un blocco di autenticazione. Permette però di vedere tre errori applicativi o di rete che possono contribuire a quella stessa esperienza. Prima di isolarli bisogna togliere il rumore: Chrome registra anche errori del cache layer, richieste speculative, favicon mancanti e restart di transazioni. Non tutto ciò che nel log si chiama “errore” è un guasto di PRREG.

<figure class="prreg-viz" aria-labelledby="prreg-errors-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-errors-title">Dove il lavoro si può fermare</h3>
      <p>Il codice di errore indica il punto del flusso. La conseguenza operativa cambia da caso a caso.</p>
    </div>
  </div>
  <ol class="prreg-errors">
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">01</span><h4>Quesito e prestazione non sono associati</h4></div>
      <div class="prreg-error__body">
        <p><strong>Errore:</strong> 400 nell'area delle regole LEA, su <code>lea/get-by-regional-service-codes</code>.</p>
        <p><strong>Cosa significa:</strong> PRREG non accetta l'associazione tra il quesito diagnostico codificato e la prestazione prescritta.</p>
        <p><strong>Come si corregge:</strong> quando si usa il campo codificato, il motivo deve essere previsto per quella prestazione nella tabella di associazione.</p>
      </div>
    </li>
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">02</span><h4>La connessione si interrompe durante l'invio</h4></div>
      <div class="prreg-error__body">
        <p><strong>Errore:</strong> <code>ERR_CONNECTION_CLOSED</code> su <code>pile-api/services</code>.</p>
        <p><strong>Cosa mostra il log:</strong> il browser riprende e le chiamate successive vanno a buon fine. Nel campione non è un arresto definitivo.</p>
        <p><strong>Cosa vede chi prescrive:</strong> PRREG sembra bloccato, anche se il browser sta tentando di recuperare la connessione.</p>
      </div>
    </li>
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">03</span><h4>PRREG non recupera il dettaglio dell'errore</h4></div>
      <div class="prreg-error__body">
        <p><strong>Errore:</strong> 500 su <code>prescription-error/last-non-storing-error</code>.</p>
        <p><strong>Cosa significa:</strong> non è la prova che la registrazione sia fallita. Fallisce la richiesta usata per leggere l'ultimo errore applicativo.</p>
        <p><strong>Cosa controllare:</strong> verificare lo stato dei servizi regionali. Se l'esito resta incerto, controllare la prescrizione prima di ripetere l'atto.</p>
      </div>
    </li>
  </ol>
  <figcaption>Il 400 riguarda il controllo fra quesito codificato e prestazione. Il NetLog redatto non contiene i codici usati nel controllo.</figcaption>
</figure>

Qui sta il vero disagio operativo. Il messaggio rosso comprime cause diverse in un solo segnale e spesso non dice se bisogna correggere, attendere, autenticarsi di nuovo o controllare l'esito. La pipeline più leggibile aiuta a localizzare il guasto, ma non lo rende meno bloccante per chi ha una persona davanti e deve completare una prescrizione.

## La latenza resta, ma cambia dove emerge

Nel vecchio modulo, gran parte della lentezza sembrava concentrata nelle chiamate sincrone al `jsonBroker`. PRREG distribuisce il lavoro su passaggi distinti, ma non risolve l'attesa.

Nel log osservato:

- `prescriptions-history/search` è la chiamata più lenta, con mediana intorno a sette secondi e un massimo oltre otto;
- `pile-api/services` si muove nell'ordine di uno o più secondi;
- `register-prescriptions-by-client-response` sta intorno ai due secondi;
- ricerca e mapping sono più rapidi, ma ripetuti più volte;
- analytics e risorse statiche producono rumore, ma non spiegano il grosso della latenza applicativa.

Nel vecchio modulo il broker era il collo di bottiglia visibile. In PRREG l'attesa si distribuisce fra ricerca, storico, invio, risposta, controllo dell'errore e stampa.

La pipeline è più leggibile, ma non è necessariamente più veloce. Nei momenti decisivi, i passaggi regionali restano sequenziali.

## La differenza vera rispetto al vecchio prescrittivo

Il confronto più onesto è questo:

| Tema | Vecchio prescrittivo | PRREG osservato |
| --- | --- | --- |
| Forma frontend | SPA legacy jQuery Mobile | Webapp regionale più moderna e modulare |
| Superficie backend visibile | Broker quasi unico, `jsonBroker` | Endpoint REST per sottodomini funzionali |
| Ricerca | Ramo e catalogo scelti a monte | Campo libero e classificazione/mapping |
| Stato ricetta | Compilazione, riepilogo, registrazione, PDF | Pipeline esplicita: search, map, check, partition, register, print, nullify |
| Errori | Rischio JSON atteso ma HTML ricevuto | Status applicativi più leggibili, ma error retrieval ancora fragile |
| Gestionale senza canale regionale | Handoff necessario | Handoff ancora necessario |

La riga più importante è l'ultima. PRREG rende più chiara la logica, forse più ergonomica la prescrizione, certamente più leggibile il comportamento osservato. Ma non sposta da sola il perimetro di integrazione.

<figure class="prreg-viz" aria-labelledby="prreg-boundary-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-boundary-title">Che cosa vediamo, e dove dobbiamo fermarci?</h3>
      <p>PRREG mostra più passaggi del vecchio modulo. Il confine d'uso non cambia.</p>
    </div>
  </div>
  <div class="prreg-boundary__grid">
    <div class="prreg-boundary__card"><h4>Gestionale senza integrazione diretta</h4><p>Prepara il contesto e avvia l'handoff. Non ricostruisce credenziali, sessione o richieste regionali.</p></div>
    <div class="prreg-boundary__arrow" aria-hidden="true">→</div>
    <div class="prreg-boundary__card observed"><h4>Webapp PRREG autenticata</h4><p>Ricerca, associa, controlla, partiziona, registra e legge l'esito nel profilo operativo regionale.</p></div>
    <div class="prreg-boundary__arrow" aria-hidden="true">→</div>
    <div class="prreg-boundary__card stop"><h4>Servizi sottostanti</h4><p>Il traffico mostra che esistono. Non ne dimostra stabilità, documentazione, accreditabilità o condizioni d'uso per terzi.</p></div>
  </div>
  <figcaption>Nel vecchio modulo la semantica era concentrata nel <code>jsonBroker</code>; in PRREG è distribuita su superfici nominate. In entrambi i casi, qui è osservato il comportamento del client ufficiale.</figcaption>
</figure>

### Non tutti i gestionali sono nella stessa posizione

MediFlow vede PRREG dal lato della webapp autenticata. Non dispone di un canale diretto con ARIA e quindi eredita i blocchi del portale senza poter intervenire nella sessione, nella registrazione o nel recupero dell'esito.

Un gestionale inserito in un percorso ufficiale può trovarsi in una posizione diversa. Il SISS documenta sia l'uso di web application sia l'[integrazione diretta A2A](https://www.siss.regione.lombardia.it/wps/portal/site/siss/il-sistema-informativo-socio-sanitario/piattaforma-siss/integrazione-application-to-application/), nella quale applicazioni diverse dialogano tramite interfacce definite e servizi di sicurezza regionali. Gli [scenari di integrazione](https://siss.regione.lombardia.it/wps/portal/site/siss/servizi-per-il-territorio/scenari-di-integrazione) prevedono specifiche e validazione per gli applicativi di terze parti. La [pagina di assistenza SISS](https://www.siss.regione.lombardia.it/wps/portal/site/siss/DettaglioRedazionale/red-assistenza-servizi-siss/red-assistenza-servizi-siss/) indica anche un contatto ARIA dedicato alle software house per conoscere modalità e attività di integrazione.

Questo non dimostra che tutti i gestionali commerciali usino lo stesso canale, né permette di ricavare prezzi o condizioni contrattuali. Dimostra però che la differenza non è solo tecnica: dipende da un percorso formale, dalle autorizzazioni e dalle responsabilità assegnate al software.

Per superare l'handoff, MediFlow dovrebbe quindi entrare in un percorso regionale che definisca almeno:

- scenario e documentazione tecnica applicabili;
- onboarding e validazione del gestionale;
- canale di integrazione e credenziali rilasciati per quello scopo;
- contratto su audit, ruolo operatore, firma, responsabilità e trattamento dati.

Il NetLog non dimostra nessuna di queste condizioni. Dimostra solo che la webapp ufficiale, una volta autenticata, usa un backend più strutturato.

## Cosa cambia per MediFlow

Per MediFlow la conclusione resta meno eccitante di quanto vorrei, ma più solida.

La postura corretta è ancora:

```text
MediFlow prepara il contesto.
Il portale regionale compie l'atto.
MediFlow riconcilia l'esito in modo minimale e revisionabile.
```

PRREG migliora soprattutto il pezzo centrale, cioè l'interfaccia stock. Questo è già utile. Se la webapp regionale riduce i click, classifica meglio, raggruppa meglio e stampa in modo più lineare, l'handoff diventa meno brutto senza che il gestionale tocchi la ricetta.

Ci sono però tre modifiche pratiche da considerare.

La prima è il launcher. Se il modulo operativo reale è `/prescrittivoRegionale`, un launcher che punta ancora alla vecchia root `/prescrizione/` rischia di essere concettualmente allineato ai documenti ma tecnicamente arretrato. La scelta più prudente non è chiamare endpoint interni; è decidere se aprire il menu SISS, la root PRREG ufficiale, o mantenere entrambe le opzioni durante la transizione.

La seconda è l'audit locale. Oggi non basta più dire "prescrizione lanciata". Sarebbe utile distinguere almeno:

```text
handoff avviato
PRREG aperto
prescrizione registrata dichiarata
stampa/PDF visualizzato
annullamento dichiarato
errore dichiarato
esito non riconciliato
```

Questa resta una tassonomia locale, non certificata. Serve a non perdere il filo operativo nel diario clinico, non a sostituire l'audit regionale.

La terza è il protocollo di cattura. Il NetLog è molto più utile di uno screenshot quando bisogna capire dove si rompe il flusso, ma è anche molto più sensibile. Un gestionale o un assistente locale non dovrebbe mai archiviare log grezzi senza revisione. La forma giusta è un ledger redatto: timestamp relativo, host, path normalizzato, metodo, status, durata, classe errore, niente query, niente header, niente payload.

## Cosa non bisogna fare

La tentazione ovvia, davanti a endpoint leggibili, è costruire un client. È la tentazione sbagliata.

Non perché sia tecnicamente impossibile mandare HTTP. Quello è il pezzo facile. Il problema è che una ricetta dematerializzata non è un carrello e-commerce. È un atto firmato, autorizzato, tracciato, sottoposto a regole regionali e nazionali, con conseguenze sul circuito farmacia/CUP e sul fascicolo amministrativo del paziente.

Usare endpoint osservati dal browser come se fossero API pubbliche significherebbe importare nel gestionale:

- credenziali o token di sessione;
- logica di ruolo e struttura;
- semantica di firma o consenso;
- gestione di errori regionali non documentati;
- rischio di duplicazione o annullamento improprio;
- responsabilità su payload prescrittivi completi.

È esattamente il passaggio che MediFlow, per ora, evita.

Il miglior uso di questa analisi non è bypassare PRREG. È capire meglio come assistere l'operatore senza mentire sul confine.

## Conclusione: PRREG migliora il portale, non cambia il confine

PRREG è un cambiamento importante rispetto al vecchio prescrittivo. La struttura osservata è più moderna, più leggibile e più vicina al dominio reale della prescrizione. Il campo libero non è solo un controllo grafico: dietro ci sono ricerca, associazione, controlli, partizionamento e preparazione dell'atto. Anche gli errori emergono su superfici più specifiche.

Per MediFlow, finché il canale disponibile resta la webapp autenticata, la strategia corretta è l'handoff assistito. Può aprire il contesto giusto, ridurre il doppio inserimento, mantenere un audit locale chiaro e riconciliare solo ciò che l'operatore conferma. Non può intervenire sui timeout del portale, conservare segreti regionali o trattare gli endpoint osservati come contratti. Un'integrazione diretta sarebbe un percorso diverso, da documentare e autorizzare con il SISS. Il miglioramento è concreto: PRREG può rendere meno macchinosa la parte regionale del lavoro. Il limite resta altrettanto concreto: il SISS conserva l'autorità sull'atto e, quando il portale si blocca, quel blocco ricade ancora su chi deve prescrivere.
