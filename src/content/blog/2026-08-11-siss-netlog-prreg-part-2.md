---
title: "SISS part 2: inside PRREG, the new regional prescribing system"
description: "A second observational reconstruction of the Lombardy SISS: what changes with PRREG, how the browser moves, where errors emerge and why it remains a handoff."
pubDate: 2026-08-11
tags: ["mediflow", "healthcare", "architecture", "siss"]
draft: false
lang: en
translation: "2026-08-11-prreg-netlog-siss-parte-2"
---

> **Methodological note.** This post is the second part of the [mapping of the SISS prescribing flow](/en/blog/2026-05-21-siss-integration-mediflow-architecture-tradeoffs/). It comes from analysis of a Chrome NetLog collected during a real session on **Prescrittivo Regionale (PRREG) Produzione**. The log was read only in redacted form: host, path, method, status, sequence and timings. No cookies, tokens, headers, query strings, payloads, regional identifiers, patient data or clinical content are reported. Endpoint names are not a public specification and must not be treated as an integration contract. They are traces of observed behaviour.

In the first post, the thesis was cautious: the old SISS prescribing module was an older-generation SPA (Single Page Application), centred on `POST /prescrizione/jsonBroker`, an application broker repeatedly called by the browser. The architectural consequence was uncomfortable but clear: a practice system such as MediFlow could prepare context, a draft and reconciliation, but the actual prescribing act remained in the regional portal.

PRREG changes the landscape. Not in the sense that it magically becomes a public API for practice systems. It changes it because the observed traffic no longer resembles the opaque old broker. The new module exposes a more readable surface to the browser, made up of REST endpoints with domain names: service search, static data, checks, partitioning, registration preparation, registration response, printing, cancellation, history and errors.

This is the important point: PRREG is more modern and more articulated, but it remains inside the authenticated regional web app perimeter. The jump from "I can observe semantic endpoints in the browser" to "I can integrate them into MediFlow" is not technical. It is about authorisation, contracts, security and responsibility.

## The new shape of the problem

In the old module, the browser spoke almost always to the same address. The operation's semantics were in the payload: identify a citizen, search for a service, register a prescription, retrieve a PDF. At the network level you saw a hammer hitting the same nail: `jsonBroker`.

In the PRREG NetLog, the shape is different. The user enters through the SISS menu, passes through regional authentication and then lands on `/prescrittivoRegionale`. From there, separate calls start for configuration, role, structure, credentials, static data, search and the prescribing act.

Reduced to its essentials, the sequence is:

```text
SISS menu
-> CRS / SSO / remote-sign authentication
-> SAML towards operatorisiss
-> PRREG root
-> HCP4I OAuth and PILe bootstrap
-> prescribing configuration
-> service search and classification
-> prescribing checks
-> partitioning
-> registration preparation
-> send to regional services
-> registration response
-> error checks
-> print preparation
-> possible cancellation or deletion
```

This is not a cosmetic detail. In the old world, the browser seemed to speak to a generic remote function. In the new world, it speaks to a backend that gives a glimpse of domain modelling. The system is no longer merely "sending a request to the broker"; it is doing recognisable things: searching for prescribable items, mapping them into a prescription, checking their validity, splitting them when necessary, registering them, printing them and cancelling them.

For people working on a practice system this is a relevant difference. Not because it authorises consuming those endpoints, but because it makes the flow's junctions clearer.

## Authentication: the browser session still governs

The first thing the log confirms is that PRREG is not born as a freely callable standalone application. The path still goes through the SISS menu and the regional authentication perimeter.

The observed chain passes through:

- regional SISS menu;
- CRS Lombardia domains for SSO and strong authentication;
- remote-signing and role-selection steps;
- SAML redirect towards `operatorisiss`;
- application root `/prescrittivoRegionale`;
- internal bootstrap with HCP4I OAuth and PILe.

This says two things.

First: the doctor does not enter PRREG as a generic user. They enter as a profiled regional operator, with a role, structure and authorisation attributes. The web app is not merely displaying a form: it is receiving a functional context that determines what that person can do at that moment.

Second: the existence of REST endpoints does not equal the existence of an application channel for third parties. The endpoints live inside an already authenticated session, built by the browser and regional middleware. Calling them outside that context would mean rebuilding session, credential, role, consent, audit and responsibility for the act. That is exactly the boundary that made handoff sensible in the first post.

The difference is that we can now see the wall more clearly.

## Bootstrap: PRREG loads as a domain application

After entering the application root, the browser does not start with the prescription. It loads configuration first.

The log contains surfaces such as:

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

These names must be read cautiously, but the direction is clear. Before prescribing, PRREG is not just a page with fields. It is a web app that asks for:

- who the operator is;
- which role they are entering with;
- which structure or organisation is active;
- which application modules are enabled;
- which features should be turned on at login;
- which static prescribing data the client needs.

The old portal hid much of this behind the broker. PRREG makes it more visible.

From a UX (User Experience) perspective, this also explains why the first load can feel heavy: the browser is composing a rich application session, not simply downloading an HTML page.

## From free text to classification

In the first post I pointed out PRREG's most visible novelty: the free-text field. The old portal forced the user to reason by branch—pharmaceutical or specialist, then the matching catalogue, then selection. PRREG leaves more room for the natural gesture: write what you want to prescribe and let the system suggest or classify it.

The NetLog confirms that this UI experience has a backend counterpart. The traffic contains calls such as:

```text
/prescrittivoRegionale/prescription/rest/prescribable-services/search
/prescrittivoRegionale/prescription/rest/prescription-specialties-and-drugs/map-for-prescription
/prescrittivoRegionale/prescription/rest/lea/get-by-regional-service-codes
/prescrittivoRegionale/prescription/rest/diagnostic-question/search
/prescrittivoRegionale/prescription/rest/exemption/search-prest-by-esez
```

This is where the paradigm shifts.

`prescribable-services/search` suggests a broad search over prescribable objects. It is not enough to find a string: the system has to understand whether the result is a medicine, specialist service, item with LEA (Livelli Essenziali di Assistenza, Essential Levels of Care) constraints, exemption-related entry or component of a more complex prescription.

`map-for-prescription` is even more explicit: something is mapped "for the prescription". This is the point at which the search result stops being only a catalogue item and becomes an item that can be filled into the act.

This distinction matters because the starting clinical data can be ambiguous. "Cardiology visit" is not a complete prescription. It may become a first visit, a follow-up, with ECG, without ECG, with a different priority, with a mandatory diagnostic question, or with exemption or deliverability constraints. PRREG's interesting work lies precisely in the passage between human language and a coded prescribing item.

For MediFlow this reinforces a choice already made: a local draft can help, but it must not pretend to be official validation. It can remember the clinical context, propose a checklist and avoid gross omissions. It cannot say "this prescription is compliant" if compliance depends on regional catalogues and rules applied in the web app.

## The prescription as a pipeline

The most useful part of the log is the sequence of the act. PRREG does not appear to register a prescription in one leap. The web app builds a pipeline.

The observed form is this:

<figure class="prreg-viz prreg-flow" data-prreg-flow aria-labelledby="prreg-flow-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-flow-title">What happens after the SISS menu?</h3>
      <p>Choose a step. Or watch the complete sequence.</p>
    </div>
  </div>
  <div class="prreg-flow__controls" aria-label="Sequence controls">
    <button type="button" data-prreg-prev aria-label="Previous step">←</button>
    <button type="button" data-prreg-play aria-pressed="false">Start</button>
    <button type="button" data-prreg-next aria-label="Next step">→</button>
    <span class="prreg-flow__status" data-prreg-status aria-live="polite">Step 1 of 10</span>
  </div>
  <ol class="prreg-flow__track" aria-label="Observed PRREG pipeline">
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="true"><span class="prreg-step__n">01 · ENTRY</span><strong>SISS menu</strong><small>Start from the regional channel</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">02 · IDENTITY</span><strong>Authentication</strong><small>Active role and structure</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">03 · CONTEXT</span><strong>App start</strong><small>Config and static data</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">04 · CATALOGUE</span><strong>Search</strong><small>Prescribable candidates</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">05 · DOMAIN</span><strong>Association</strong><small>Result inside the prescription</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">06 · RULES</span><strong>Checks</strong><small>Completeness and consistency</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">07 · COMPOSITION</span><strong>Partitioning</strong><small>Splitting or grouping</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">08 · ACT</span><strong>Registration</strong><small>Preparation and sending</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">09 · OUTCOME</span><strong>Check</strong><small>Response and errors</small></button></li>
    <li><button class="prreg-step" type="button" data-prreg-step aria-pressed="false"><span class="prreg-step__n">10 · EXIT</span><strong>Print</strong><small>Document or receipt</small></button></li>
  </ol>
  <div class="prreg-flow__detail" aria-live="polite">
    <div data-prreg-panel><strong>SISS menu</strong><p>The path starts in the regional menu. The log does not show an independent entry from the practice system.</p></div>
    <div data-prreg-panel><strong>Authentication and profile</strong><p>Authentication and profile selection prepare the session PRREG uses.</p></div>
    <div data-prreg-panel><strong>Web app start</strong><p>PRREG loads configuration, modules, role, structure and static data.</p></div>
    <div data-prreg-panel><strong>Search</strong><p>The text produces some results. The log does not explain how PRREG orders them.</p></div>
    <div data-prreg-panel><strong>Association</strong><p>PRREG turns the selected result into a prescription item. The call name does not document every rule.</p></div>
    <div data-prreg-panel><strong>Checks</strong><p>The web app checks the prescription before registration. The redacted log does not show every applied rule.</p></div>
    <div data-prreg-panel><strong>Partitioning</strong><p>PRREG can split or group items. The initial list does not always match the final prescriptions.</p></div>
    <div data-prreg-panel><strong>Registration</strong><p>Preparation and sending are separate steps. The draft becomes an act only when the outcome confirms it.</p></div>
    <div data-prreg-panel><strong>Outcome check</strong><p>The web app reads the response and looks for possible errors. A failure here can leave the outcome uncertain.</p></div>
    <div data-prreg-panel><strong>Print</strong><p>PRREG prepares printing after checking the outcome. Completion, registration and printing are three different states.</p></div>
  </div>
  <figcaption>The log shows these steps inside the authenticated web app. It does not demonstrate the existence of an integration contract.</figcaption>
</figure>

| Stage | Observed surface | What the data shows |
| --- | --- | --- |
| Static data | `static-prescription-data/*` | The client loads configuration and vocabularies needed for completion. |
| Search | `prescribable-services/search` | The entered text is turned into prescribable candidates. |
| Association | `map-for-prescription` | Results are adapted to the prescription structure. |
| Check | `prescriptions/check` | The system assesses completeness or consistency before the next step. |
| Partitioning | `prescriptions/partition` | Items are split or grouped according to regional rules. |
| Preparation | `prepare-register-request` | The client prepares the request that will go to the regional service. |
| Sending | `pile-api/services` | PRREG passes from the web-app layer to the underlying service. |
| Response | `register-prescriptions-by-client-response` | The client receives and normalises the registration outcome. |
| Outcome check | `check-prescription-error` | The web app checks whether registration produced application errors. |
| Print | `prepare-print-request` | The system prepares the printable document or receipt. |

This table is the heart of the second part.

In the old portal we had already distinguished "create prescription" from "register prescriptions". PRREG makes this distinction even stronger. Before registration there are search, selection, mapping, checking and partitioning. Only then come registration, outcome and printing. It is a state machine, not a form with a submit button.

For a practice system this means local state should not be binary. It is not enough to have:

```text
prescription = done / not done
```

At minimum, a working taxonomy is needed:

```text
local draft
search started in portal
item selected or mapped
prescription checked
prescription registered
print prepared
prescription cancelled
prescription deleted
outcome not reconciled
error to recover
```

Not all these states need to be automated. In fact, in the handoff model many will remain declared or reconciled manually. But naming them properly prevents the worst error: treating a completed prescription form as though it were an issued prescription.

## History, import and recovery

Another interesting block concerns history:

```text
/prescrittivoRegionale/prescription/rest/prescriptions-history/count
/prescrittivoRegionale/prescription/rest/prescriptions-history/search
/prescrittivoRegionale/prescription/rest/prescriptions-history/import
/prescrittivoRegionale/prescription/rest/prescriptions-history/get-prescriptions
```

In the log, these calls precede or accompany parts of the prescribing session. PRREG appears to work on prescriptions that already exist too: it can count, search, import or retrieve them.

This is consistent with a mature regional module. A prescriber does not work on an empty page: they need to see what has already been produced, import or reuse items, check outcomes and cancel or correct.

This also reveals a performance detail: in the observed trace, `prescriptions-history/search` was the slowest surface, with durations around several seconds and peaks above eight. It is not a statistical proof, only one log. It does, however, explain part of the perceived latency: slow operations are not only registration of the act, but also reconstruction of the context.

PRREG's UX may be better than the old module, but if every history search or recovery goes through heavy regional round trips, the doctor will continue to experience the system as slow.

## Cancellation is not a detail

The observed flow also contains cancellation and deletion surfaces:

```text
/prescrittivoRegionale/prescription/rest/prescriptions/prepare-nullify-request
/prescrittivoRegionale/prescription/rest/prescriptions/nullify-prescriptions-by-client-response
/prescrittivoRegionale/prescription/rest/prescriptions/delete
```

This matters because the prescribing act does not end with the prescription number. A prescription can be cancelled, corrected, deleted from a local list or excluded from a working set. These steps have different weight.

"Delete" in a web app does not necessarily mean regional cancellation. It may mean removing an item that has not yet been registered, deleting a draft or clearing a work list. "Nullify", on the other hand, suggests cancellation of the act or a request that touches the regional prescription state.

Without the payload, we must not invent. But the lexical distinction is enough to say that a practice system must model two planes:

- deletion of something that is not yet a regional act;
- cancellation or correction of something already registered.

They are different planes clinically, administratively and medico-legally.

## Where PRREG stops: the problem for prescribers

In daily use, the problem does not appear as an orderly sequence of HTTP statuses. It appears as a timeout, a red message or a page that does not continue. Sometimes PRREG does not let the user in. At other times it stalls during completion. In the worst case, the error arrives after sending and it is not immediately clear whether the prescription was registered.

These are different situations, but for the person working they have the same effect: they interrupt prescribing and remove control over the point reached. If the block occurs before authentication, the module is never entered. If it occurs before registration, the data can be revisited and corrected. If it occurs during or after sending, immediately repeating the operation can be risky: the regional state must be checked first.

The analysed NetLog does not measure how often these problems occur and does not contain an authentication block. It does, however, show three application or network errors that can contribute to the same experience. Before isolating them, noise has to be removed: Chrome also records cache-layer errors, speculative requests, missing favicons and transaction restarts. Not everything called an "error" in the log is a PRREG failure.

<figure class="prreg-viz" aria-labelledby="prreg-errors-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-errors-title">Where the work can stop</h3>
      <p>The error code indicates the point in the flow. The operational consequence changes from case to case.</p>
    </div>
  </div>
  <ol class="prreg-errors">
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">01</span><h4>Question and service are not associated</h4></div>
      <div class="prreg-error__body">
        <p><strong>Error:</strong> 400 in the LEA rules area, on <code>lea/get-by-regional-service-codes</code>.</p>
        <p><strong>What it means:</strong> PRREG does not accept the association between the coded diagnostic question and the prescribed service.</p>
        <p><strong>How to correct it:</strong> when the coded field is used, the reason must be available for that service in the association table.</p>
      </div>
    </li>
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">02</span><h4>The connection breaks during sending</h4></div>
      <div class="prreg-error__body">
        <p><strong>Error:</strong> <code>ERR_CONNECTION_CLOSED</code> on <code>pile-api/services</code>.</p>
        <p><strong>What the log shows:</strong> the browser resumes and later calls succeed. In the sample, this is not a definitive stop.</p>
        <p><strong>What the prescriber sees:</strong> PRREG appears stuck, even though the browser is trying to recover the connection.</p>
      </div>
    </li>
    <li class="prreg-error">
      <div class="prreg-error__lead"><span class="prreg-error__n">03</span><h4>PRREG cannot retrieve the error detail</h4></div>
      <div class="prreg-error__body">
        <p><strong>Error:</strong> 500 on <code>prescription-error/last-non-storing-error</code>.</p>
        <p><strong>What it means:</strong> this is not proof that registration failed. The request used to read the last application error fails.</p>
        <p><strong>What to check:</strong> verify the state of regional services. If the outcome remains uncertain, check the prescription before repeating the act.</p>
      </div>
    </li>
  </ol>
  <figcaption>The 400 concerns the check between coded question and service. The redacted NetLog does not contain the codes used in the check.</figcaption>
</figure>

This is the real operational discomfort. The red message compresses different causes into one signal and often does not say whether to correct, wait, authenticate again or check the outcome. The more readable pipeline helps locate the failure, but it does not make it less blocking for someone with a person in front of them who has to complete a prescription.

## Latency remains, but changes where it appears

In the old module, much of the slowness seemed concentrated in synchronous `jsonBroker` calls. PRREG distributes the work across distinct steps, but it does not remove the waiting.

In the observed log:

- `prescriptions-history/search` is the slowest call, with a median around seven seconds and a maximum above eight;
- `pile-api/services` moves in the order of one or more seconds;
- `register-prescriptions-by-client-response` is around two seconds;
- search and mapping are faster, but repeated several times;
- analytics and static resources produce noise, but do not explain most of the application latency.

In the old module, the broker was the visible bottleneck. In PRREG, waiting is distributed across search, history, sending, response, error checking and printing.

The pipeline is more readable, but it is not necessarily faster. At decisive moments, the regional steps remain sequential.

## The real difference from the old prescribing module

The most honest comparison is this:

| Topic | Old prescribing module | Observed PRREG |
| --- | --- | --- |
| Frontend form | Legacy SPA with jQuery Mobile | More modern, modular regional web app |
| Visible backend surface | Almost one broker, `jsonBroker` | REST endpoints for functional subdomains |
| Search | Branch and catalogue chosen upstream | Free text and classification/mapping |
| Prescription state | Completion, summary, registration, PDF | Explicit pipeline: search, map, check, partition, register, print, nullify |
| Errors | Risk of expected JSON but received HTML | More readable application statuses, but error retrieval remains fragile |
| Practice system without regional channel | Handoff required | Handoff still required |

The last row is the important one. PRREG makes the logic clearer, perhaps the prescription more ergonomic and certainly the observed behaviour more legible. But it does not, by itself, move the integration perimeter.

<figure class="prreg-viz" aria-labelledby="prreg-boundary-title">
  <div class="prreg-viz__head">
    <div>
      <h3 id="prreg-boundary-title">What do we see, and where must we stop?</h3>
      <p>PRREG exposes more steps than the old module. The usage boundary does not change.</p>
    </div>
  </div>
  <div class="prreg-boundary__grid">
    <div class="prreg-boundary__card"><h4>Practice system without direct integration</h4><p>Prepares context and starts handoff. It does not rebuild credentials, session or regional requests.</p></div>
    <div class="prreg-boundary__arrow" aria-hidden="true">→</div>
    <div class="prreg-boundary__card observed"><h4>Authenticated PRREG web app</h4><p>Searches, associates, checks, partitions, registers and reads the outcome within the regional operational profile.</p></div>
    <div class="prreg-boundary__arrow" aria-hidden="true">→</div>
    <div class="prreg-boundary__card stop"><h4>Underlying services</h4><p>The traffic shows that they exist. It does not demonstrate stability, documentation, accreditation or terms of use for third parties.</p></div>
  </div>
  <figcaption>In the old module, semantics were concentrated in `jsonBroker`; in PRREG they are distributed across named surfaces. In both cases, this is observed behaviour of the official client.</figcaption>
</figure>

### Not all practice systems are in the same position

MediFlow sees PRREG from the authenticated web-app side. It has no direct channel to ARIA and therefore inherits the portal's blocks without being able to intervene in the session, registration or outcome recovery.

A practice system included in an official pathway may be in a different position. SISS documents both the use of web applications and [direct A2A integration](https://www.siss.regione.lombardia.it/wps/portal/site/siss/il-sistema-informativo-socio-sanitario/piattaforma-siss/integrazione-application-to-application/), in which different applications communicate through defined interfaces and regional security services. The [integration scenarios](https://siss.regione.lombardia.it/wps/portal/site/siss/servizi-per-il-territorio/scenari-di-integrazione) provide specifications and validation for third-party applications. The [SISS support page](https://www.siss.regione.lombardia.it/wps/portal/site/siss/DettaglioRedazionale/red-assistenza-servizi-siss/red-assistenza-servizi-siss/) also indicates an ARIA contact dedicated to software houses that want to learn about integration methods and activities.

This does not show that all commercial practice systems use the same channel, nor does it allow prices or contractual terms to be inferred. It does show that the difference is not only technical: it depends on a formal pathway, authorisations and responsibilities assigned to the software.

To move beyond handoff, MediFlow would therefore need to enter a regional pathway defining at least:

- the applicable scenario and technical documentation;
- onboarding and validation of the practice system;
- an integration channel and credentials issued for that purpose;
- a contract covering audit, operator role, signing, responsibility and data processing.

The NetLog demonstrates none of these conditions. It only demonstrates that the official web app, once authenticated, uses a more structured backend.

## What changes for MediFlow

For MediFlow the conclusion remains less exciting than I would like, but more solid.

The correct posture is still:

```text
MediFlow prepares the context.
The regional portal performs the act.
MediFlow reconciles the outcome minimally and in a reviewable way.
```

PRREG mainly improves the middle piece, the stock interface. That is already useful. If the regional web app reduces clicks, classifies better, groups better and prints more linearly, handoff becomes less ugly without the practice system touching the prescription.

There are, however, three practical changes to consider.

The first is the launcher. If the real operational module is `/prescrittivoRegionale`, a launcher that still points to the old `/prescrizione/` root risks being conceptually aligned with the documents but technically behind. The most cautious choice is not to call internal endpoints; it is to decide whether to open the SISS menu, the official PRREG root or both during the transition.

The second is local audit. It is no longer enough to say "prescription launched". It would be useful to distinguish at least:

```text
handoff started
PRREG opened
prescription registration declared
print/PDF viewed
cancellation declared
error declared
outcome not reconciled
```

This remains a local, uncertified taxonomy. It is meant not to lose the operational thread in the clinical diary, not to replace the regional audit.

The third is the capture protocol. The NetLog is much more useful than a screenshot when you need to understand where the flow breaks, but it is also much more sensitive. A local practice system or assistant should never archive raw logs without review. The right form is a redacted ledger: relative timestamp, host, normalised path, method, status, duration, error class, no query, no headers and no payload.

## What not to do

The obvious temptation, faced with readable endpoints, is to build a client. It is the wrong temptation.

Not because sending HTTP is technically impossible. That is the easy part. The problem is that an electronic prescription is not an e-commerce basket. It is a signed, authorised, traceable act, subject to regional and national rules, with consequences for the pharmacy/CUP circuit and the patient's administrative record.

Using endpoints observed in the browser as though they were public APIs would import into the practice system:

- credentials or session tokens;
- role and structure logic;
- signature or consent semantics;
- undocumented regional error handling;
- risk of duplication or improper cancellation;
- responsibility for complete prescription payloads.

That is exactly the step MediFlow avoids for now.

The best use of this analysis is not to bypass PRREG. It is to understand better how to assist the operator without lying about the boundary.

## Conclusion: PRREG improves the portal, not the boundary

PRREG is an important change from the old prescribing module. The observed structure is more modern, more readable and closer to the actual domain of prescribing. The free-text field is not just a visual control: behind it are search, association, checks, partitioning and preparation of the act. Errors also surface through more specific interfaces.

For MediFlow, as long as the available channel remains the authenticated web app, the correct strategy is assisted handoff. It can open the right context, reduce double entry, keep a clear local audit and reconcile only what the operator confirms. It cannot intervene in portal timeouts, store regional secrets or treat observed endpoints as contracts. Direct integration would be a different path, to be documented and authorised with SISS. The improvement is concrete: PRREG can make the regional part of the work less cumbersome. The limit is equally concrete: SISS retains authority over the act and, when the portal stops, that block still falls on the person who has to prescribe.
