---
title: "The Doctor of Instruments"
description: "A personal argument about public-health physicians and the instruments through which population-level intent becomes care."
pubDate: 2026-08-17
updatedDate: 2026-08-17
tags:
  - public health
  - global health
  - digital health
  - assisted workflows
draft: false
---

There is a distance that opens when a physician enters public health. It feels closer to deep space than to an ordinary professional worry. The objects that once gave medicine its immediate shape begin to drift away. Diagnosis becomes reflection on epidemiology. Treatment becomes policy. Prognosis becomes a measuring point, placed somewhere along a pathway and compared with the same point in other people.

The patient is still there, although increasingly mediated by categories, rates, services and time. I have never been completely satisfied with the usual answer to this unease: the public-health physician is the *doctor of populations*. The expression is correct. It describes the scale of responsibility. It does not identify the object of the craft.

> **Methodological note.** This is a personal and professional argument, built from practice and from work on health-service instruments. The examples are concrete; the proposed identity is mine.

I trained in public health, disease control and chronicity, while clinical practice remained a necessary counterweight. It is difficult to become entirely abstract when the working day still includes neuropathies in people with diabetes, disability and frailty beside heart failure, pulmonary disease, adherence and the struggle around therapy. The same is true when care involves underrepresented communities, where a language barrier or cultural distance can change what is understood, accepted, prescribed and eventually done.

Clinical medicine keeps returning the body to the argument. Public health extends the argument across many bodies, institutions and years. The professional problem is finding something equally concrete to hold.

## The missing object of work

I think the missing object is the instrument.

A registry. A referral pathway. A waiting list. A queue. A prescribing rule. A screening invitation. A denominator in a dashboard. A data contract. A stock-management process. Software that decides which information appears, which action is allowed and who becomes invisible.

These are sometimes treated as secondary objects, placed below strategy, policy or clinical knowledge. In practice they determine whether strategy, policy and clinical knowledge can travel at all. A service may have a sound purpose and still fail because the denominator is wrong, the handoff is ambiguous, the rule cannot be represented, or the information reaches the right professional in the wrong form.

Building MediFlow and reconstructing prescribing flows inside Lombardy’s SISS made abstraction difficult to sustain. A prescribing rule would become a field, an identity boundary, a denominator, an error message, an unavailable endpoint or a handoff between people who did not share the same view of the process. Each translation changed what could happen next. The instrument had entered care itself.

The way information is served matters for the same reason. Apps and smartphones have made it obvious that hierarchy, timing, density and placement change what people notice. In medicine these choices are often dismissed as interface details. They are part of the cultural and epistemological functioning of care: they influence which concept appears primary, which uncertainty remains visible, which action feels normal and which patient is difficult to find.

There is a long practical tradition behind this observation. Global health has worked for decades on implementation, logistics and local technical capacity. Open-source systems such as DHIS2, OpenMRS, OpenLMIS and Open Hospital are useful reminders that operational public health did not begin with contemporary models. Claiming otherwise would erase the people who built and maintained it under far harder constraints.

The present change lies elsewhere and, whilst I do not take credit for noticing something obvious, there is still merit in pointing out what the future holds.

## What assisted workflows actually change

By *assisted workflows* I mean a structured path from a question to a reviewable artefact: a query, a workflow map, a data specification, a test, a prototype, a small application or a documented transformation from one system state to another.

Reviewable matters more than fast.

I am making no universal productivity claim. Some tasks become quicker, others slower, and verification can cancel the time initially saved. Speed is a weak foundation for a professional identity anyway. Reachability is more consequential: the distance between domain knowledge and a technical artefact can become short enough for a public-health professional to cross it, inspect what has been produced and return with better questions.

The distance remains though. Production software still requires engineering. Security, maintenance, governance and specialist review remain real disciplines. A prototype can be unsafe, a query can contain a bad denominator, and an elegant workflow map can describe an organisation that exists only in the author’s head.

Yet something has moved. A physician who governs a process can approach its technical form earlier and more directly. A clinical concern can become a testable specification before it is diluted through several layers of translation. A vague operational complaint can become an artefact that an engineer, analyst or service lead can challenge.

For me this requires a shift from a predominantly medical mentality towards an engineering mentality. Medical reasoning asks what is happening, what may explain it and what should be done. Engineering reasoning adds another family of questions: under which conditions does the process work, where does it fail, how is failure observed, what state can be recovered, and which assumption has been fixed inside the system?

The two mentalities need each other. The practical consequence is clear: technical opacity becomes less professionally acceptable. Learning enough to inspect and question the machinery matters more than acquiring the title of programmer.

## The doctor of instruments

This is why I keep returning to the phrase *doctor of instruments*.

I mean it as a moral and professional identity grounded in stewardship. Physicians do not acquire ownership of digital health by learning to inspect a data flow. Public health remains multidisciplinary because its objects exceed any single profession. Engineers, nurses, pharmacists, statisticians, administrators, social scientists, laboratory professionals and communities themselves hold knowledge that medicine cannot replace.

Stewardship begins with responsibility for the consequences of an instrument, including consequences produced by parts one did not personally build.

What exactly does an indicator measure? Who is absent from the denominator? Where does a referral pathway lose people? Which judgment has become executable logic? Who can override it, and under what conditions? What happens when connectivity is lost? Can an output be traced to its source? Which people become easier to serve because of the system, and which become harder to see?

Instrument literacy is the capacity to remain professionally present through those questions. It includes the ability to inspect, challenge and govern. Hands-on prototyping may help when it makes a claim visible, although the deeper obligation is to understand where a process becomes data, where data becomes software and where software changes the range of available action.

WHO SMART Guidelines and the WHO work on digital-health competencies offer limited reference points. They acknowledge that recommendations must survive translation into testable digital components and that health work increasingly involves data, informatics, technical proficiency and administration. No official document creates the identity I am proposing. The thesis comes from my attempt to reconcile medicine, public health and the machinery between them.

## Reviewability

This argument continues a concern from my earlier piece, [“Sike-o-fancy”](/blog/2026-06-29-sike-o-fancy-sanita-pubblica-we-have-a-problem/). Intelligent tools can make immature reasoning look mature. They can produce clean prose, plausible protocols, polished dashboards and coherent explanations around questions that remain badly formed. The surface improves faster than the method.

The constructive response is reviewability.

Assisted intelligence cannot carry the authority of method. It can help create an artefact that method can inspect: something with assumptions, states, boundaries, tests and traces. The artefact may be rejected. That is already useful. A rejection attached to a visible object teaches more than a disagreement with a vague idea.

For public-health training, this means retaining epidemiology, biostatistics, prevention, causal reasoning, health economics and policy, then adding instrument literacy as a practical layer: provenance, workflow modelling, interoperability, privacy boundaries, validation, version control and failure analysis. The aim is accountability when population-level intent is translated into operational reality.

That translation has always existed. Assisted workflows make it reachable by more people and reviewable earlier. They offer the public-health physician a more concrete craft without reducing the discipline to technology, and a way to approach the system with the same seriousness once reserved for the individual clinical problem.

## Sources and further reading

- World Health Organization, [SMART Guidelines](https://www.who.int/teams/digital-health-and-innovation/smart-guidelines)
- World Health Organization, [*Competency frameworks and standards for digital health: a landscape analysis*](https://www.who.int/publications/i/item/9789240119765), 2026
- [DHIS2](https://dhis2.org/)
- [OpenMRS](https://openmrs.org/)
- [OpenLMIS](https://openlmis.org/)
- [Open Hospital](https://www.open-hospital.org/)

The population is still the patient.
The instruments are how we touch it.
