---
title: "Sike-o-fancy: Public Health, we have a problem!"
description: "Probably mistaken thoughts on the false sense of security produced by intelligent tools, the neo-Luddite counterpoint and why every discussion ends up in the same basket."
pubDate: 2026-06-29
tags: ["public health", "ai", "methodology"]
draft: false
lang: en
translation: "2026-06-29-sike-o-fancy-sanita-pubblica-we-have-a-problem"
---

> **Methodological note.** This post comes from a very partial observation: some recent discussions on different platforms, a few methodological references I already knew and a personal concern about how some tools are described in public health. It is not a systematic review, and it does not claim to settle the debate. It is a working note written from inside a practice that uses these tools and is wary of them.

Over the last few days, my online timeline has been monopolised by a fierce debate: closed models versus open models, local AI versus cloud APIs, proprietary frontier versus open weights, with the recent enthusiasm for Z.ai, DeepSeek, xAI and anything else capable of moving the boundary of what seems possible. It is a very technical discussion in places, as it should be, but it can now also be watched from outside thanks to a small mediation infrastructure: patient users explaining things under posts, context threads, Grok inside X, other AI engines, generated summaries and ELI5 ("explain like I'm five") becoming an almost implicit feature of the technical internet. People who actually work on models, hardware, inference, harnesses, benchmarks and agents therefore have good reasons to be involved up to their necks and not to bury their heads in the sand, especially as hardware costs rise, services segment and wanting something that runs locally stops being a convention fixation and becomes a practical question.

Perhaps the answer—though that is an argument for another time—will be less religious than it is usually described: the right model for the right task. In [MediFlow](https://getmediflow.dev/en), for example, the choice has been to use local models where the work remains local and reviewable: visit transcription, organisation of clinical material and heuristic support where a controllable stack is useful. That does not mean everything should be local, or that everything should live in the cloud. It only means that the tool should be chosen for the work it has to do, the data it touches and the risk it introduces.

In that world the model is not an abstract object: it either runs or it does not, costs too much or little enough, fits in memory or does not, holds context or loses it, and responds well only inside a particular harness, with a particular quantisation, on a particular machine. Enthusiasm there often comes from direct contact with the material; and so it produces fan clubs, philosophies, official defences, Amodei-shaped bogeymen, Musk-shaped bravado, open-source apologists and unsolicited lawyers for whichever multinational happens to be on trial.

How does all this connect to public health? Like every discipline worthy of the name—and therefore like every discipline sensitive to fashions—public health notices new tools, uses them, talks about them, puts them in conferences and occasionally employs them more or less openly in everyday work. The same passion running through Silicon Valley software engineering also produces small battles here: open source against closed, local against cloud, good company against bad company, with the added complication that in this field AI is not the profession, but a tool entering a profession already difficult enough to define properly.

Public health is something else, or at least would like to be: a rigorous, generally austere discipline that also begins with certain water fountains in London and now finds itself in a modernity where much of its old technical privilege has become accessible, simulable and layout-ready. In the Italian context, the specialty often has a vague character: the specialty of services, process governance, prevention, vaccinations and organisation, with a relationship to actual clinical work that is not always straightforward. Giving very powerful tools to a field still looking for its place in the world can strengthen it, but it can also amplify its insecurities.

For us, AI is not the field. It is a tool entering a field already full of its own problems: data quality, outcome definitions, protocols written after seeing the results, weak analyses, poorly built indicators and causality described too casually. In short, a field where one can produce a great deal of language and very little knowledge; and when attending events where public health is discussed, chatted about and performed, my personal impression is that the best notions often come from people who actually work in the domains, from cancer prevention to infectious diseases, from non-communicable diseases to mental health, rather than from people hovering over everything from outside with system language.

The real risk, then, is not only hallucination. That at least, when it goes wrong, can be recognised. The more serious risk is false comfort: an AI assistant produces orderly text, reads papers, builds a table, proposes a protocol, draws a slide, tidies a bibliography and generates a coherent narrative around data that may not actually be coherent. After half an hour it seems that the problem has been put in order, but often only the surface has been arranged.

This is the point that interests me: AI can make a line of reasoning look mature when it is not, give academic form to a badly posed question, give an institutional tone to an exploratory analysis and turn a draft into something that holds together visually without making it hold together methodologically.

In public health this is dangerous because the work lives precisely on the threshold between clinical practice, data, organisation and policy. If you get a dashboard wrong, you have not only got a chart wrong: you have created a representation of the service. If you get an indicator wrong, you can shift attention, resources and priorities; if you get a risk model wrong, you can build an apparently rational decision on fragile foundations. And yet the outer form will be beautiful.

That explains why I have little interest in enthusiastic round tables about AI when they remain at slogan level. "AI will transform healthcare" is too easy a sentence. The useful question is more boring: which piece of work does it transform, with which data, with which responsibility, with which accepted error and with which external verification?

The questions that matter are always the same in the end. What exactly are we studying? Is the outcome defined before or after? Is the protocol registered? Is this the right population? Are missing data an accident or the main phenomenon? Has the model been validated outside the context in which it was born? What happens when it enters the real workflow, with real people, real timings and real regional systems? If these questions remain unanswered, AI does not innovate: it decorates.

The literature on AI and medicine did not begin with chatbots. A 2020 BMJ review of deep-learning studies compared with clinicians already showed a very recognisable picture: few randomised trials, many non-prospective studies, little evidence in real-world settings, limited availability of data and code, high risk of bias in many studies and conclusions often stronger than the design allowed. It is not definitive evidence against 2026 LLMs. It would be wrong to read it that way. It is, however, a reminder that technical enthusiasm often arrives before the methodological infrastructure that should support it.

It is no coincidence that specific guidelines exist. CONSORT-AI and SPIRIT-AI for trials and protocols involving AI interventions. DECIDE-AI for early clinical evaluation of decision-support systems. TRIPOD+AI and PROBAST+AI for reporting and risk of bias in prediction models. WHO has insisted for years on transparency, safety, accountability, equity and sustainability. This whole scaffolding does not exist to make the work heavier: it exists because without scaffolding AI rapidly becomes rhetoric.

There is also a second problem, less technical and more human: sycophancy. Models tend to follow the user and give a more elegant form to what the user is already thinking. OpenAI had to correct a GPT-4o update because the model had become too accommodating. Anthropic has published work on sycophancy, the tendency of models to align with a user's opinions instead of the truth.

In a private chat this can be annoying. In a scientific or healthcare setting it can become poisonous, because we often are not really looking for a refutation: we are looking for a better sentence to say what we already wanted to say. The model almost always finds it.

This does not mean rejecting AI. That would be a lazy position. I use it and will continue to use it. But it has to be used at the right point in the process.

It is useful for building protocol checklists, checking a draft against a guideline, making assumptions explicit, writing reproducible code, looking for inconsistencies and preparing a first summary to verify. It is useful when the result has a perimeter, a source, a check and an accountable person.

It is much less useful when it becomes a machine for producing consensus: more slides, more abstracts, more infographics, more panels and more words around a question that nobody has yet defined properly.

This, for me, is the crux of public health. We do not need to look more intelligent. We need to be stricter about how we produce knowledge.

The fact that a tool makes writing easier does not make what we write truer. The fact that it makes analysis easier does not make the analysis more robust. The fact that it makes explanation easier does not mean we understand.

In Italy I feel this concern particularly strongly. Public health has very capable people and places where method, statistics and service governance are taken seriously. But it also has a share of ritual: conferences, panels, documents, systems language and a great deal of discursive production. AI fits this ritual very well, because it increases its speed and improves its appearance. That is exactly why it has to be kept short: AI yes, but inside a method; AI yes, but with traceable sources; AI yes, but with registered protocols; AI yes, but with external validation; AI yes, but with explicit human responsibility; AI yes, but without turning every well-written output into evidence.

The distinction between open and closed models will remain important for people who build tools. Privacy, cost, sovereignty, verifiability and lock-in are real issues. But in public health the question comes first: what work are we doing, and with what discipline?

Without that discipline, the best model only produces a more elegant version of the error.

Artificial intelligence can help us work better. It cannot absolve us from knowing what we are doing.

## Where the technical and scientific ideas came from

- Nagendran et al., "Artificial intelligence versus clinicians: systematic review of design, reporting standards, and claims of deep learning studies", BMJ 2020: https://www.bmj.com/content/368/bmj.m689
- CONSORT-AI, EQUATOR Network: https://www.equator-network.org/reporting-guidelines/consort-artificial-intelligence/
- SPIRIT-AI, EQUATOR Network: https://www.equator-network.org/reporting-guidelines/spirit-artificial-intelligence/
- DECIDE-AI, Nature Medicine 2022: https://www.nature.com/articles/s41591-022-01772-9
- TRIPOD+AI / PROBAST+AI: https://www.tripod-statement.org/tripodai
- WHO, "Ethics and governance of artificial intelligence for health", 2021: https://www.who.int/publications/i/item/9789240029200
- WHO, "Ethics and governance of artificial intelligence for health: guidance on large multi-modal models", WHO page updated in 2025: https://www.who.int/publications/i/item/9789240084759
- OpenAI, "Sycophancy in GPT-4o: what happened and what we're doing about it": https://openai.com/index/sycophancy-in-gpt-4o/
- Anthropic, "Towards Understanding Sycophancy in Language Models": https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models
