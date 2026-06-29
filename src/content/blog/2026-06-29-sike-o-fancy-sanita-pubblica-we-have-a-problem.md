---
title: "Sike-o-fancy: Sanità Pubblica, we have a problem!"
description: "Riflessioni verosimilmente erronee sul falso senso di sicurezza prodotto dagli strumenti intelligenti, sul controcanto dei neo-luddisti e su come tutte le discussioni finiscano nel medesimo paniere."
pubDate: 2026-06-29
tags: ["sanità pubblica", "ai", "metodologia"]
draft: false
---

> **Nota metodologica.** Questo post nasce da un'osservazione molto parziale: alcune discussioni recenti su piattaforme diverse, qualche riferimento metodologico già noto e una preoccupazione personale sul modo in cui alcuni strumenti vengono raccontati in sanità pubblica. Non è una revisione sistematica, non è una posizione contrarian, non è una mappa esaustiva del campo. Sono quattro chiacchiere da sotto la doccia, né più né meno; magari con qualche fonte in più di una chiacchiera vera, ma con la stessa ambizione.

Negli ultimi giorni la mia timeline online è stata monopolizzata da un dibattito feroce: modelli chiusi contro modelli aperti, AI locale contro API cloud, frontiera proprietaria contro open weights, con il contorno dei recenti entusiasmi per Z.ai, DeepSeek, xAI e per qualunque cosa riesca a muovere di nuovo la linea del possibile. È una discussione a tratti molto tecnica, come è giusto che sia, ma oggi osservabile anche dall'esterno grazie a una piccola infrastruttura di mediazione: utenza paziente che spiega sotto i post, thread di contesto, Grok dentro X, altri motori di AI, riassunti generati, ELI5 (“explain like I'm five”) diventati ormai una funzione quasi implicita dell'internet tecnico. Chi lavora davvero su modelli, hardware, inferenza, harness, benchmark e agenti ha quindi buone ragioni per essere coinvolto fino al collo e per non nascondere la testa sotto la sabbia, anche perché i costi hardware crescono, i servizi si segmentano e la voglia di avere qualcosa che giri localmente smette di essere una fissazione da convention e diventa una domanda pratica.

Forse la risposta, ma questo è un argomento per un'altra volta, sarà meno religiosa di come viene raccontata: il modello giusto per la mansione giusta. In [MediFlow](/mediflow/), per esempio, la scelta è stata usare modelli locali dove il lavoro resta locale e revisionabile: trascrizione della visita, organizzazione del materiale clinico, supporto euristico dove serve uno stack controllabile. Questo non significa che tutto debba essere locale, né che tutto debba stare in cloud. Significa solo che lo strumento va scelto per il lavoro che deve fare, per il dato che tocca e per il rischio che introduce.

In quel mondo il modello non è un oggetto astratto: gira o non gira, costa troppo o abbastanza poco, entra in memoria o non ci entra, tiene il contesto o lo perde, risponde bene solo dentro un certo harness, con una certa quantizzazione, su una certa macchina. L'entusiasmo, lì, nasce spesso da contatto diretto con la materia; e infatti produce tifoserie, filosofie, difese d'ufficio, spauracchi alla Amodei, spacconate alla Musk, apologeti dell'open source e avvocati non richiesti della multinazionale di turno.

Come si collega tutto questo alla sanità pubblica? Come ogni disciplina che si rispetti, e quindi come ogni disciplina sensibile alle mode, anche la sanità pubblica intercetta strumenti nuovi, li usa, li racconta, li mette nei convegni e ogni tanto li impiega in modo più o meno dichiarato nel lavoro quotidiano. La stessa passione che attraversa l'ingegneria software della Silicon Valley produce anche qui piccole lotte: open source contro closed, locale contro cloud, azienda buona contro azienda cattiva, con l'aggravante che in questo campo l'AI non è il mestiere, ma un attrezzo che entra dentro un mestiere già abbastanza difficile da definire bene.

La sanità pubblica, infatti, è un'altra cosa, o almeno vorrebbe esserlo: una disciplina rigorosa, tendenzialmente austera, che nasce anche con certe fontanelle a Londra e oggi si trova in una modernità dove molto del suo antico privilegio tecnico è diventato accessibile, simulabile, impaginabile. Nel contesto italiano, poi, la specialità ha spesso una caratterizzazione vaga: specialità dei servizi, del governo dei processi, della prevenzione, delle vaccinazioni, dell'organizzazione, con un rapporto non sempre lineare con la clinica reale. Dare strumenti molto potenti a un campo che sta ancora cercando il proprio posto nel mondo può essere un modo per rafforzarlo, ma anche un volano per amplificarne le insicurezze.

Per noi l'AI non è il campo. È uno strumento che entra in un campo già pieno di problemi propri: qualità del dato, definizione degli esiti, protocolli scritti dopo avere visto i risultati, analisi deboli, indicatori costruiti male, causalità raccontata con troppa disinvoltura. Insomma, un campo in cui si può produrre moltissimo linguaggio e pochissima conoscenza; e frequentando eventi in cui si parla, si ciancia e si performa sanità pubblica, l'impressione personale è che spesso le nozioni migliori arrivino da chi nei domini ci lavora davvero, dalla prevenzione oncologica all'infettivologia, dalle malattie non trasmissibili alla salute mentale, più che da chi sorvola tutto dall'esterno con lessico di sistema.

Il rischio vero, allora, non è solo l'allucinazione. Quella almeno, quando va male, si riconosce. Il rischio più serio è il falso conforto: un assistente AI produce testo ordinato, legge articoli, costruisce una tabella, propone un protocollo, disegna una slide, sistema una bibliografia, genera una narrativa coerente attorno a dati che magari coerenti non sono. Dopo mezz'ora sembra che il problema sia stato messo in ordine, ma spesso è stata solo ordinata la superficie.

Questo è il punto che mi interessa: l'AI può far sembrare maturo un ragionamento che non lo è ancora, può dare forma accademica a una domanda posta male, può dare tono istituzionale a un'analisi esplorativa, può trasformare una bozza in una cosa che regge visivamente senza farla reggere metodologicamente.

In sanità pubblica questa cosa è pericolosa perché il lavoro vive proprio sulla soglia fra clinica, dati, organizzazione e policy. Se sbagli una dashboard, non hai solo sbagliato un grafico: hai creato una rappresentazione del servizio. Se sbagli un indicatore, puoi spostare attenzione, risorse, priorità; se sbagli un modello di rischio, puoi costruire una decisione apparentemente razionale su fondamenta fragili. E però la forma esterna sarà bella.

Questo spiega perché sono poco interessato alle tavole rotonde entusiaste sull'AI, quando restano a livello di slogan. "L'AI trasformerà la sanità" è una frase troppo facile. La domanda utile è più noiosa: quale pezzo di lavoro trasforma, con quali dati, con quale responsabilità, con quale errore ammesso, con quale verifica esterna.

Le domande che contano, alla fine, sono sempre le stesse. Che cosa stiamo studiando, esattamente? L'esito è definito prima o dopo? Il protocollo è registrato? La popolazione è quella giusta? I dati mancanti sono un accidente o il fenomeno principale? Il modello è stato validato fuori dal contesto in cui è nato? Cosa succede quando entra nel flusso reale, con persone reali, tempi reali, sistemi regionali reali? Se queste domande restano scoperte, l'AI non innova: decora.

La letteratura su AI e medicina non nasce oggi con i chatbot. Una revisione BMJ del 2020 sugli studi di deep learning confrontati con clinici mostrava già un quadro molto riconoscibile: pochi trial randomizzati, molti studi non prospettici, poca prova in contesto reale, disponibilità limitata di dati e codice, rischio di bias alto in molti lavori, conclusioni spesso più forti di quanto il disegno consentisse. Non è una prova definitiva contro gli LLM del 2026. Sarebbe scorretto leggerla così. È però un promemoria: l'entusiasmo tecnico arriva spesso prima dell'infrastruttura metodologica che dovrebbe sostenerlo.

Non a caso esistono linee guida specifiche. CONSORT-AI e SPIRIT-AI per i trial e i protocolli che coinvolgono interventi AI. DECIDE-AI per la valutazione clinica precoce dei sistemi decisionali. TRIPOD+AI e PROBAST+AI per reporting e rischio di bias nei modelli predittivi. L'OMS insiste da anni su trasparenza, sicurezza, responsabilità, equità, sostenibilità. Tutta questa impalcatura non esiste per appesantire il lavoro: esiste perché senza impalcatura l'AI diventa rapidamente retorica.

C'è poi un secondo problema, meno tecnico e più umano: la compiacenza. I modelli tendono a seguire l'utente, a dargli una forma più elegante di quello che sta già pensando. OpenAI ha dovuto correggere un aggiornamento di GPT-4o perché il modello era diventato troppo accomodante. Anthropic ha pubblicato lavori sulla sycophancy, cioè sulla tendenza dei modelli ad allinearsi alle opinioni dell'utente invece che alla verità.

In una chat privata questo può essere fastidioso. In un contesto scientifico o sanitario può diventare velenoso, perché spesso non cerchiamo davvero una confutazione: cerchiamo una frase migliore per dire quello che volevamo già dire. Il modello, quasi sempre, la trova.

Questo non significa rifiutare l'AI. Sarebbe una posizione pigra. Io la uso e continuerò a usarla. Ma va usata nel punto giusto del processo.

Va bene per costruire checklist di protocollo, ricontrollare una bozza rispetto a una linea guida, rendere esplicite le assunzioni, scrivere codice riproducibile, cercare incoerenze, preparare una prima sintesi da verificare. Va bene quando il risultato ha un perimetro, una fonte, un controllo, un responsabile.

Va molto meno bene quando diventa macchina di produzione del consenso: più slide, più abstract, più infografiche, più tavoli, più parole attorno a una domanda che nessuno ha ancora definito bene.

Qui, per me, sta il nodo della sanità pubblica. Non abbiamo bisogno di sembrare più intelligenti. Abbiamo bisogno di essere più severi con il modo in cui produciamo conoscenza.

Il fatto che uno strumento renda più facile scrivere non rende più vero quello che scriviamo. Il fatto che renda più facile analizzare non rende più solida l'analisi. Il fatto che renda più facile spiegare non significa che abbiamo capito.

In Italia questa preoccupazione la sento in modo particolare. La sanità pubblica ha persone molto brave e luoghi dove metodo, statistica e governo dei servizi sono presi sul serio. Ma ha anche una quota di ritualità: convegni, tavoli, documenti, lessico di sistema, molta produzione discorsiva. L'AI si inserisce benissimo in questa ritualità, perché ne aumenta la velocità e ne migliora l'aspetto. È esattamente per questo che va tenuta corta: AI sì, ma dentro un metodo; AI sì, ma con fonti tracciabili; AI sì, ma con protocolli registrati; AI sì, ma con validazione esterna; AI sì, ma con responsabilità umana esplicita; AI sì, ma senza trasformare ogni output ben scritto in evidenza.

La distinzione fra modelli aperti e chiusi continuerà a essere importante per chi costruisce strumenti. Privacy, costo, sovranità, verificabilità e lock-in sono temi reali. Ma in sanità pubblica la domanda viene prima: che lavoro stiamo facendo, e con quale disciplina?

Se manca quella disciplina, il modello migliore serve solo a produrre una versione più elegante dell'errore.

L'intelligenza artificiale può aiutarci a lavorare meglio. Non può assolverci dal sapere che cosa stiamo facendo.

## Da dove ho preso gli spunti tecnici e scientifici

- Nagendran et al., "Artificial intelligence versus clinicians: systematic review of design, reporting standards, and claims of deep learning studies", BMJ 2020: https://www.bmj.com/content/368/bmj.m689
- CONSORT-AI, EQUATOR Network: https://www.equator-network.org/reporting-guidelines/consort-artificial-intelligence/
- SPIRIT-AI, EQUATOR Network: https://www.equator-network.org/reporting-guidelines/spirit-artificial-intelligence/
- DECIDE-AI, Nature Medicine 2022: https://www.nature.com/articles/s41591-022-01772-9
- TRIPOD+AI / PROBAST+AI: https://www.tripod-statement.org/tripodai
- WHO, "Ethics and governance of artificial intelligence for health", 2021: https://www.who.int/publications/i/item/9789240029200
- WHO, "Ethics and governance of artificial intelligence for health: guidance on large multi-modal models", pagina OMS aggiornata al 2025: https://www.who.int/publications/i/item/9789240084759
- OpenAI, "Sycophancy in GPT-4o: what happened and what we're doing about it": https://openai.com/index/sycophancy-in-gpt-4o/
- Anthropic, "Towards Understanding Sycophancy in Language Models": https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models
