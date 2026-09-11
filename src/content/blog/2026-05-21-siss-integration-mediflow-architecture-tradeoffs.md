---
title: "SISS integration in MediFlow: architecture and trade-offs"
description: "An observational reconstruction of the Lombardy prescribing flow: authentication, remote signing, the possibility of dedicated UIs for practice systems and differences from the current SISS portal."
pubDate: 2026-05-21
tags: ["mediflow", "healthcare", "architecture"]
draft: false
lang: en
translation: "2026-05-21-mappatura-siss"
---

> **Methodological note.** This post is an observational reconstruction of the behaviour of the Lombardy SISS portal, based on browser application traffic and public literature on electronic-prescription flows. It is not official documentation or a specification supplied by the regional operator. Endpoint names, call sequence and the allocation of signing and identity roles are working hypotheses consistent with what was observed in production, but subject to error and undocumented change. Read it as an *investigative note*, not as a regulatory reference.

An electronic prescription looks like a simple process. The prescriber fills it in, the system produces a fifteen-digit number, the **NRE** (Numero Ricetta Elettronica, Electronic Prescription Number), and the dispensing point reads that number to take charge of the prescription: the **pharmacy** for a medicine, the **CUP** (Centro Unico di Prenotazione, Single Booking Centre) or the company/regional booking system for a specialist service. The same identifier, two different downstream circuits, two distinct operational counterparts. Beneath the surface there are also at least four layers speaking different languages: the prescriber's identity, regional authorisation for the clinical act, the qualified electronic signature on the act and registration with the **Sistema TS** (Sistema Tessera Sanitaria, Health Card System), operated by SOGEI on behalf of MEF (Ministero dell'Economia e delle Finanze, Ministry of Economy and Finance). When any one of these layers gets stuck, the prescriber notices because the portal spins without going anywhere, not because the system explains what went wrong.

Over the last few weeks I have been mapping and implementing the prescribing flow in MediFlow towards **SISS** (Sistema Informativo Socio Sanitario, Socio-Health Information System) of Regione Lombardia. This post documents how one enters the mechanism, where the bottleneck is today and why a dedicated UI (user interface) could offer concrete improvements.

> **Acronym note.** This is a dense domain. Each acronym is written out at first occurrence. The recurring ones are: NRE (Numero Ricetta Elettronica), IUP (Identificativo Univoco di Prescrizione, regional Unique Prescription Identifier), SAC (Sistema di Accoglienza Centrale, Central Reception System, on the Sistema TS side), SAR (Sistema di Accoglienza Regionale, Regional Reception System, on the SISS side), CNS (Carta Nazionale dei Servizi, National Services Card), TS-CNS (Tessera Sanitaria con funzioni di CNS, Health Card with CNS functions), CUP (Centro Unico di Prenotazione), PHI (Protected Health Information), AgID (Agenzia per l'Italia Digitale, Agency for Digital Italy) and AIC (Autorizzazione all'Immissione in Commercio, marketing authorisation code for a medicine).

## Prescriber identity: CNS, remote signing and why they matter to practice systems

Before talking about prescriptions, it is worth focusing on who the prescriber is, in the system's eyes, when the portal opens.

Authentication to SISS rests on a **strong digital identity**: in Lombardy, typically CNS (Carta Nazionale dei Servizi) or TS-CNS (Tessera Sanitaria con funzioni di CNS) read from a smart card through a USB reader, with OTP (One-Time Password) delegation possible in some configurations. Identity is not just a login: the smart card contains X.509 certificates that allow the prescriber to perform legally relevant acts, including the qualified electronic signature on prescriptions.

This is where **remote signing** comes in. In many Lombardy scenarios, the smart card is not used for every act. Instead, the prescriber has a qualified signing certificate stored in an **HSM** (Hardware Security Module, a physical cryptographic device that keeps private keys from being extracted) at an AgID-accredited certification provider. Recurring names in the Italian market are Aruba, InfoCert, Namirial and Intesi Group. Each signature is activated through a static PIN plus a dynamic OTP, typically via a TOTP (Time-based One-Time Password, a six-digit code that changes every 30 seconds, the Google Authenticator standard) app or SMS.

Under the hood, the certification provider's API exposes a signing function that receives the document's **hash** (the cryptographic fingerprint, calculated client-side so the whole document does not have to be transferred) and returns the signed block. Technically, the signed payload is **PKCS#7** (the Cryptographic Message Syntax standard, a container linking the document, signature and signer's certificate) wrapped in two formats: **PAdES** (PDF Advanced Electronic Signature, for PDF documents) or **CAdES** (CMS Advanced Electronic Signature, for XML payloads such as electronic prescriptions). Access to the HSM generally happens through the provider's proprietary REST API or, in more traditional deployments, through **PKCS#11** (a standard API for communicating with cryptographic devices, originally created for smart cards and simulated here in software). The signature remains granular for each act, but the authorisation session (consent to sign) can extend over a time window or declared set of operations, effectively reducing the number of OTPs to type.

The interesting point from a practice-management perspective is this: the same identity that signs prescriptions **can be used to authenticate the prescriber to third-party services**, provided the provider exposes a compliant mechanism. There are three realistic patterns:

1. **SPID/CIE federation.** When the third-party service registers as a SAML (Security Assertion Markup Language, the XML standard for exchanging identity assertions between IdP and SP) *Service Provider*, it can accept login with SPID (Sistema Pubblico di Identità Digitale, Public Digital Identity System) or CIE (Carta d'Identità Elettronica, Electronic Identity Card).
2. **OAuth2 with OpenID Connect (OIDC).** A regional *Identity Provider* (IdP) issues a JWT (JSON Web Token) to the practice system. The qualified signing certificate can be bound to the token as *proof-of-possession*: the JWT `cnf` (confirmation) claim contains `x5t#S256`, the SHA-256 hash of the prescriber's X.509 certificate. The recipient of the token can verify that the presenter also possesses the corresponding private key.
3. **Mutual TLS server-to-server.** The practice system's backend and the regional backend authenticate one another with X.509 certificates issued by a recognised CA (Certification Authority). No username/password, no token: the channel itself is the authentication.

In any case, remote signing does more than sign: it certifies a verified identity, with a chain of trust anchored at AgID, and that identity can be reused to obtain an application session token. Real-time certificate validity checking remains the relying party's responsibility: it queries the certification provider through **OCSP** (Online Certificate Status Protocol, an HTTP query asking "is this certificate still valid?"), with a fallback to **CRL** (Certificate Revocation List, a periodic list of revoked certificates that is slower but always available).

The inference driving my architecture is this: if a practice system such as MediFlow could one day present itself to SISS with the same identity the prescriber already uses to sign, the current double passage (portal login plus manual entry) would collapse into one authentication. The portal UI, which is the only channel today, would stop being a constraint.

> What remains to be understood (and I do not verify it in this post) is **under what conditions the regional operator accepts remote-signing credentials as an application-session token**. This is exactly the point of pressure where a dedicated interface would make sense.

### SAR, SAC and the qualified signature: three layers not to confuse

Once the prescriber has been identified, the prescribing act travels through a layered infrastructure that is easy to confuse. It is worth fixing the layers in place, because each has its own operator, format and failure point.

- **SAC (Sistema di Accoglienza Centrale).** This is the national node operated by SOGEI (the MEF's IT company) for the Sistema TS. It receives the electronic prescription as XML in the format published by MEF, returns the NRE and maintains the prescription life-cycle state (issued, taken in charge, dispensed, cancelled). It is the authoritative reference for pharmacies and CUPs which, during dispensing or booking, query SAC by NRE to retrieve the signed prescription.
- **SAR (Sistema di Accoglienza Regionale).** This is the regional intermediary between the systems of healthcare organisations/practice systems and SAC. In Lombardy, SAR lives inside SISS and has two functions: route prescriptions to the national SAC and keep a regional mirror of flows for reporting, expenditure governance and regional dispensing. When the SISS portal calls `registraPrescrizione`, SAR receives, normalises, signs if necessary and forwards to SAC. SAR is also responsible for the regional IUP.
- **Qualified signature on the act.** The electronic prescription travels as XML signed according to MEF specifications (CAdES signature on the payload, compliant with **CAD**, Codice dell'Amministrazione Digitale, Legislative Decree 82/2005, and the European **eIDAS** Regulation no. 910/2014, which governs electronic identity and trust services between Member States). Operationally, the signature can be applied at two distinct moments: by the prescriber, through their remote-signing certificate, on the individual act; or by SAR on the prescriber's behalf, in a server-side signing arrangement where the CNS session counts as consent to sign within a defined perimeter. Which model applies to a given prescription depends on regional configuration and prescription type. It is not publicly documented and must be inferred from observed behaviour.

The architectural implication is that a practice system avoiding the portal would not replicate a single gateway. It would orchestrate three counterparts: the regional IdP (Identity Provider) for the session, SAR for routing and signing, and the certification provider for the qualified signature when SAR cannot delegate it. Each of the three layers has its own SLAs (Service Level Agreements), downtime patterns and error formats. A native client must manage all of them, and this is one of the deep reasons why handoff remains economically sensible today.

## The current SISS portal: legacy SPA, jsonBroker and the browser session as the only channel

The SISS prescribing portal presents as an older-generation **SPA** (Single Page Application, a web application that loads one HTML page and updates the content dynamically through JavaScript without navigating between different URLs), built on **jQuery Mobile** (a UI framework for touch devices created around 2010, no longer maintained today but then the de facto standard for "mobile-friendly" web portals). The entire prescribing flow revolves around a single server-side application-routing endpoint, observed as `POST /prescrizione/jsonBroker`, dispatched through an `operation` parameter. This means the client does not call different URLs for different operations: it always calls the same endpoint, and the server decides what to do from the `operation` field in the JSON request body. It is an **RPC** (Remote Procedure Call) pattern—a client invokes a server function as though it were local—and a simpler, less documented variation of **JSON-RPC**. The whole flow, from authentication to NRE issuance, is anchored to the browser session and cookies for the regional domain: without a live browser session, the broker cannot be called.

Building a *native* client (server-to-server, without going through the browser) in MediFlow today would mean rebuilding two parallel layers: the SISS session with server-side CNS authentication, and the downstream conversation with Sistema TS/SOGEI for registering the electronic prescription. Both would require formal accreditation as a third-party application with the regional operator, server-side X.509 certificate management and a **PHI** (Protected Health Information, personal health data subject to GDPR Article 9 and the Italian Data Protection Authority's guidance) processing perimeter much broader than the one currently needed by the practice system.

The choice adopted in MediFlow is an **explicit decoupling**: the practice system does not issue the prescription directly, but acts as a local *Draft Builder*, delegating the formal prescribing act to the SISS portal.

<figure class="mermaid" role="img" aria-label="Flow diagram: from preparing the draft in MediFlow to issuing the NRE on the SISS portal, with reconciliation through the NRE.">

```text
MediFlow: prepare draft
  -> validate patient
  -> generate audit ID
  -> handoff: copy tax code and launch
  -> open SISS web app
  -> paste tax code and complete prescription
  -> issue NRE from Sistema TS + regional IUP
  -> MediFlow: reconcile through NRE
```

<figcaption>The flow remains an assisted handoff. The diagram describes the separation of responsibilities; it is not an integration specification.</figcaption>
</figure>

## Assisted handoff: copying the tax code, two panels and synchronous RPCs on the broker

The two-panel arrangement makes it possible to consult clinical data on the left and work in SISS on the right. MediFlow opens the portal and copies the patient's Codice Fiscale (tax code) to the clipboard, simplifying the first barrier to entry: patient identification.

Using the system clipboard (the Windows/macOS "clipboard") as a handoff channel is a conscious compromise. It reduces operational friction but introduces a small risk perimeter: *clipboard hijacking* by other applications that read the clipboard without the user noticing, or persistence of the tax code in third-party clipboard managers (utilities that keep clipboard history). MediFlow clears the buffer after a short **TTL** (Time-To-Live) and the roadmap includes replacing it with a `mediflow://` protocol registered at OS level, a custom URL scheme (like `mailto:` or `tel:`) that the operating system associates with the practice system and uses to pass data directly without going through the clipboard.

The real bottleneck in the regional module is the **synchronous** sequence imposed by `jsonBroker`: each operation (identification, service search, registration) is a separate RPC call to the same endpoint, and the client must wait for the first response before it can send the second. At least in the observed traffic, there is no *batching* mechanism (putting several operations into one request) or parallel calls. The result is that the time perceived on screen is the sum of each call's round trips.

<figure class="mermaid" role="img" aria-label="Sequence diagram: prescriber, SISS browser application, jsonBroker and Sistema TS exchange patient, service and prescription data.">

```text
Prescriber -> SISS SPA (browser): enter tax code
SISS SPA -> jsonBroker: POST identificaCittadino
jsonBroker -> SISS SPA: demographics + exemptions

Prescriber -> SISS SPA: search service in regional catalogue
SISS SPA -> jsonBroker: POST getPrestazioni
jsonBroker -> SISS SPA: service codes + eligibility

Prescriber -> SISS SPA: confirm priority, question and notes
SISS SPA -> jsonBroker: POST registraPrescrizione
jsonBroker -> Sistema TS / SOGEI: send electronic prescription
Sistema TS / SOGEI -> jsonBroker: NRE (15 digits)
jsonBroker -> SISS SPA: NRE + regional IUP
```

<figcaption>The operation names are descriptive labels consistent with the observed payload, not official identifiers.</figcaption>
</figure>

> The operation names (`identificaCittadino`, `getPrestazioni`, `registraPrescrizione`) are descriptive labels consistent with the observed payload, not official identifiers. The broker exposes an RPC-like structure dispatched through an `operation` parameter or equivalent.

When looking at the output of the act, it is useful to distinguish two identifiers that the portal returns together but that live in different semantic spaces:

- **NRE.** Numero Ricetta Elettronica, 15 digits, generated by Sistema TS and serving as the national identifier for the electronic prescription. It is the code the dispensing point uses to download the prescription from SAC. **Important:** the "dispensing point" changes according to the prescription's nature. For a pharmaceutical prescription, the NRE is read by the **pharmacy** during dispensing. For a specialist prescription, the NRE is read by the **CUP** (or the regional/company booking system) when it takes charge of the request. The same identifier, two different circuits, two different downstream counterparts.
- **IUP.** A regional Identificativo Univoco di Prescrizione, useful for reconciliation inside SISS and for Lombardy reporting flows, but not sufficient for dispensing outside the regional circuit.

This dual nature of the NRE is exactly why a prescribing portal has to know, from data entry onward, **whether the item being prescribed is a medicine or a specialist service**: it changes not only the lookup catalogue (the medicine AIC database versus the specialist tariff nomenclature) but also the downstream delivery channel. It is one of the issues around which PRREG's evolution turns, and the subject of a later analysis.

The MediFlow adapter is designed to **retain neither credentials nor regional session state**. It only detects failovers in the Lombardy infrastructure. When the SISS portal returns a timeout or error on `registraPrescrizione`, the MediFlow draft is restored to *not issued*, to avoid false certainty that a prescription exists. A routing error on a medicine is an adverse event with clear responsibility.

## The open-source practice-system pattern: handoff through the SISS menu and the arrival of PRREG

MediFlow's pattern is not an eccentricity of one practice system. It is **the de facto pattern** for outpatient applications in Lombardy, especially open-source projects or small suppliers without application-accreditation pathways to SISS. The strategy is always the same: the practice system prepares a local draft, copies the Codice Fiscale to the clipboard, launches the browser on the **SISS menu** ([operatorisiss.servizirl.it/menusiss](https://operatorisiss.servizirl.it/menusiss/#)), and the prescriber works from there in the "stock" interface Regione Lombardia provides to all authenticated staff.

This leaves the formal integration burden with the regional operator alone, and keeps the practice system *outside* the prescription perimeter. It is inelegant, but it scales to any software, including something written over a weekend by one MMG (general practitioner).

The significant change under way is the arrival of **Prescrittivo Regionale (PRREG) Produzione**, exposed by the SISS menu next to the old module. PRREG is the new stock interface presumably intended to replace the historical prescribing module based on `jsonBroker`. The observed differences are not merely cosmetic:

- **Free-text service field.** Where the old portal first asked the prescriber to choose the branch (pharmaceutical or specialist) and then search the relevant catalogue, PRREG accepts one text input. The user writes what they intend to prescribe and the backend classifies it.
- **Downstream semantic understanding.** The interface tries to infer from the free string whether it is a medicine, specialist service or compound set, applying the required fields only after classification (dose and posology for a medicine, diagnostic question and priority for a specialist service). Cognitive friction moves from "which branch are we in?" to the clinical content itself. Classification is not merely cosmetic: it also determines the downstream NRE recipient, namely whether dispensing will be handled by a pharmacy or CUP. A classification error upstream is paid for in routing.
- **Fewer mandatory clicks.** Several steps in the old flow (branch selection, eligibility confirmation and intermediate saving) are collapsed or made implicit.

From the point of view of an open-source practice system that relies on handoff, this evolution is **good news at no cost**. Usability improves without the practice system touching its own code, because the stock UI is what changes. The tax-code copying pattern remains valid: the only difference is that, once in the SISS menu, the user chooses PRREG instead of the historical module.

The structural limitation remains, at least in what has been observed: PRREG is also a web app, not an API. Its semantic inferences remain inside the portal and are not exposed to anyone who might hypothetically want to present them inside a practice system's interface. Flexibility is gained in the UI, not in the integration channel.

> A deep dive into PRREG's behaviour (free-text classification, handling of multidisciplinary prescriptions, the map of observed XHR calls, payload differences from the old broker and behaviour around priority and diagnostic question) will be the subject of a **dedicated post due out soon**.

## Three operational frictions: double authentication, partial double entry and perceived latency

In summary, the current flow pays three concrete frictions:

1. **Double authentication.** The doctor is already authenticated to the practice system but must authenticate again to the SISS portal, even when the same active remote signature could already serve as proof of identity.
2. **Partial double entry.** The tax code passes through the clipboard, but the other clinical information (diagnostic question, service codes and priority) is transcribed by sight into the portal because `jsonBroker` is not a public API the practice system can use.
3. **Perceived latency.** The broker's synchronous RPCs, added to the load of the legacy SPA, make operations that are conceptually lookups and inserts feel heavy. The doctor experiences the portal as "slow", and that slowness moves into the schedule.

None of these frictions is technically insurmountable. All three depend on the fact that, today, the only channel to SISS remains the portal UI.

## Breakout scenario: UI in the practice system, identity through remote signing and regional APIs

The breakout scenario is this: the practice system provides its own prescribing UI, compliant with the minimum content of an electronic prescription, and communicates through a documented API with the regional SAR (for routing) and with Sistema TS (for registration and the NRE), presenting the identity derived from the doctor's existing remote signature as the session token.

The protocol options that could concretely be pursued in a 2026 architecture are known:

- **Accreditation of the practice system as an OAuth2/OIDC client** towards a regional IdP. OAuth2 is the standard framework for delegating access to protected resources; OIDC (OpenID Connect) is the layer built on OAuth2 that adds actual authentication. Two distinct grant types would be used: `client_credentials` for server-to-server calls without an active user session (for example, nightly catalogue synchronisation), and `authorization_code` with **PKCE** (Proof Key for Code Exchange, RFC 7636, a security extension preventing interception of the authorisation code even on public clients such as desktop apps) for acts requiring human intervention, such as signing. The remote-signing certificate would be presented as proof of possession: the JWT token's `cnf` (confirmation) claim contains `x5t#S256`, the SHA-256 hash of the X.509 certificate, so the recipient can verify the link between token and the prescriber's qualified certificate.
- **Mutual TLS (mTLS)** on the server-to-server channel between the practice system backend and SAR, with X.509 certificates issued by the regional CA at accreditation. Unlike classic TLS, where only the server presents a certificate, in mTLS *both* parties authenticate one another. It is the pattern already used between healthcare operators and Sistema TS, and has the advantage of making each call auditable on the regional side.
- **Signed webhooks** for asynchronous events (prescription taken in charge, dispensed or cancelled). A *webhook* is an HTTP call SAR sends to the practice system when something happens, the reverse of the normal client-server flow: instead of having the practice system poll the status of every NRE (repeatedly asking "has anything changed?"), SAR notifies it proactively. To prevent forgery and replay, the payload travels with an **HMAC** (Hash-based Message Authentication Code, a symmetric signature calculated with a secret shared by both parties), with anti-replay protection from a *nonce* (a number used once) and a timestamp the recipient checks for recency.
- **Local caching of the nomenclature and catalogues.** The **AIC** database (Autorizzazione all'Immissione in Commercio, the unique code assigned by AIFA to each authorised medicine pack in Italy), the tariff nomenclature for outpatient specialist services (the national and regional list of services deliverable through the SSN, with their cost charged to the national health service) and exemption codes. With nightly differential synchronisation—downloading only differences from the last local copy—eligibility lookups become local operations and SISS calls are reduced to writes (prescription registration).

The plausible operational consequences:

- One authentication per work shift. The signing PIN is entered once, and the OTP is triggered for individual acts as it already is for signed documents, but not also for re-entering the portal.
- Demographic and eligibility lookups run by the practice system in the background, so it stops "waiting for SISS" for read operations.
- Multiple prescriptions in sequence from the same clinical screen, with NREs collected and reconciled in batch in the diary, possibly with cumulative signing (one OTP authorising a declared set).
- A smaller operational PHI surface on the clipboard, because the data no longer passes through the system clipboard.
- End-to-end clinical traceability in the practice-system diary, with prescription state updated in real time through webhooks instead of reconstructed later by the prescriber.

This is explicitly an exploratory scenario. It depends on a political as well as technical condition: the regional operator must open an accreditable application channel, with public SLAs and an onboarding path practical for non-incumbent suppliers too. Until that happens, a dedicated UI remains a design exercise.

## Downstream reconciliation: the NRE as key, idempotency and a minimal PHI perimeter

In the current state, when the act is completed, the generated NRE is copied and MediFlow reconciles the prescription, updating the local clinical diary. The logic is **idempotent on the NRE**: a possible duplicate user confirmation creates neither duplicates nor resubmission attempts. The practice system remains the *source of truth* for the clinical diary; SISS retains authority over the prescribing act.

This keeps MediFlow's persistence of PHI connected to the regional flow to a minimum. The practice system keeps the link between patient, prescription and NRE; the details of the issued prescription remain in the SISS/Sistema TS circuit, where they are already subject to the processing policies of the regional data controller.

## Handoff vs native client: comparison across four dimensions (accreditation, PHI, robustness and ergonomics)

The choice of assisted handoff over a native client was weighed across four dimensions:

| Dimension | Handoff (chosen) | Native client |
| --- | --- | --- |
| Accreditation | None: the prescriber uses their own SISS credentials | Requires regional application accreditation and/or an agreement with Sistema TS |
| PHI surface | Minimal: MediFlow sees only the tax code and local draft | Extended: the application directly handles electronic prescriptions |
| Robustness to API change | High: the portal remains the human-use channel | Low: any `jsonBroker` revision can break the integration |
| Prescriber ergonomics | Medium: two panels, assisted paste | High: a linear flow in the practice system alone |

Handoff wins today on the first three rows and loses on ergonomics. It is a temporary compromise. The day Regione Lombardia exposes a documented, accreditable application interface, the robustness axis will reverse and a native client will become sustainable.

## When to reverse the choice: three assumptions to monitor

The current architecture holds as long as three assumptions remain true:

1. The SISS portal continues to be available as the primary prescribing channel, without a decommissioning announcement in the near term.
2. The regional authentication middleware does not introduce frictions that outweigh the benefit of handoff (frequent re-authentication, aggressive session expiry).
3. Prescribing volume per doctor remains in the tens per day, where copying and pasting the tax code is not the bottleneck.

If any of these assumptions fails, especially the first, the calculation reverses and it becomes rational to invest in a native client with all the accreditation complexity that entails.

## Limits of this reconstruction and what to verify yourself

Everything above has been reconstructed by observing application traffic in the context of a production integration. Endpoint names, payload schema and the exact allocation of signing and authentication roles may differ from the regional operator's actual specification and may change without notice. Anyone wishing to reproduce the pattern in another practice system should (a) verify the calls actually in use in their own environment, (b) speak with Lombardia Informatica/ARIA about the available accreditation pathways and (c) treat this post as a methodological trace, not a specification.
