---
title: "Who owns the tools of healthcare?"
description: "MediFlow, everyday operations, and the possibility of building public infrastructure in code as well."
pubDate: 2026-09-09
tags: ["public health", "mediflow", "open source"]
draft: false
lang: en
translation: "2026-09-09-di-chi-sono-gli-strumenti-della-sanita"
---

Developing a tool like MediFlow is interesting because it lets you experiment with the tools you use every day, the ones you sometimes take for granted precisely because they are part of how a healthcare organisation operates. A medical record, a prescribing system, an interface for reading a report: eventually you get used to how they work, and it becomes difficult to separate their design from the way you imagine the work itself.

Working on them is a way of getting your hands into operations. If my management master's taught me anything, it was to look inside the processes and tools that shape the work. Because the tools we use do shape it: understanding them better gives us a clearer view of processes, a better ability to identify bottlenecks and, perhaps, a few more ideas about how to address them.

As I work towards completing version 0.8.6, I keep coming back to this. Thinking about how to put a tool that handles someone's health data into responsible use also brings up broader questions: privacy, control over data, responsibility for handling such sensitive information. And I think this is where scalability in healthcare comes in too: the ability to grow while retaining control over the processes and responsibilities that come with it.

## An amateur project, a public question

MediFlow certainly began as an amateur project. But above all, it began as a way of giving substance to a question: how can we encourage a discussion about a public, open-source healthcare platform that developers can assess, alongside the people who actually use these tools?

Organisations often face the question of dependence on major suppliers. The debate about open office suites such as OpenOffice or LibreOffice, compared with Microsoft, is a familiar example: reducing external dependence, containing costs, having more control over formats. That does not mean the transition is painless. Small compatibility problems exist and can add up in everyday work. In healthcare, being able to open a file is not enough: the information also needs to retain its meaning.

The idea of an open platform also comes from a question that, in my view, still receives too little attention. Making code visible allows people outside the project to assess it. That does not automatically make a tool secure: it takes people who read the code, testing and maintenance. But it makes broader scrutiny possible and, potentially, offers a more direct route for suggestions from the community using it.

A democratic, perhaps even grassroots approach to development has something I recognise in the spirit of Italy's National Health Service. Provided that the opportunity to contribute comes with clear responsibility for what is accepted, maintained and put into use. Opening the code is a starting point; making it dependable remains a job that someone has to do.

## Resilience shows up in everyday work

Another aspect is operational resilience. I am interested in a tool that allows basic work to continue when the connection is unavailable: writing a clinical report, exporting a patient's data, using the coding resources already available on the computer. Functions that depend on external services will have different constraints, but essential work should be able to continue.

That matters beyond low-resource settings too. Think of software for a street outreach team, a Red Cross activity or work in the community. These are examples of what such a tool might support, not settings in which I am claiming MediFlow has already been validated. They do help make a question concrete: what must remain possible when conditions are less than ideal?

Thinking about public health also means getting into the details of these tools. We cannot always stay at the level of grand systems. If we want to give a training programme or a perspective on health a distinctive character, I think we need to bring together the broad view and an understanding of what makes the everyday delivery of a service possible.

Public ownership can concern buildings, staff and activities, but technological infrastructure too. Imagining an open, inspectable public infrastructure at regional or even national level means trying to extend that responsibility to the tools themselves. Open code is not the same thing as public ownership; it can, however, be one of the conditions for building infrastructure that truly belongs to everyone. That feels consistent with the spirit of public healthcare, and with the times we live in.

## When feedback meets a limit


I am a doctor first and a technology enthusiast second. There are certainly people far better qualified than I am to develop software or examine these concepts. Over the years, though, when I have been asked to contribute to regional platforms, software or services because I was directly involved in using them, I have often found it difficult to accept how little effect feedback had.

Not because I thought my opinion should carry extraordinary weight. The point is that, as with many colleagues, the need was real. Yet meeting certain requests seemed to run into substantial technical limits. As a user, I could not always know how much was due to technology, contracts, resources or priorities. Still, that distance remained between a concrete need and the possibility of addressing it.

Assisted development tools now allow ideas to reach the real world that would previously have required time, money and expertise that were difficult to bring together. If you are sufficiently informed and willing to study a little outside your own field, you can achieve satisfying results. The need to understand what you are building, test it and recognise its limits remains. What changes is the possibility of trying.

The sophistication I can explore in development today interests me even when it does not directly concern a patient-facing function. It can concern architecture, infrastructure, how information is managed, how an interface presents content, and how the systems holding data communicate. These things may be less visible, but they have a profound effect on the work.

## Closing the distance

Healthcare and the public sector often experience major technological upheavals at something of a distance. For better or worse, that delay allows time to digest some developments, while also limiting the impact new technologies might have. Intelligent systems need to enter the discussion partly to make more room for the people doing the work: clinical and administrative staff, as well as, of course, patients.

The European Union is moving. The [European Health Data Space](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en) provides a concrete reference for control over and exchange of health data, with implementation taking place progressively. It is not a programme to make all healthcare open source, and an individual project does not automatically constitute a compliant implementation. But it is part of the broader framework worth engaging with.

What I find encouraging is the possibility of reducing the distance between the intentions and plans produced by authoritative institutions and the ideas of individuals. Giving an idea a form that can be shown, shared and discussed. Having something concrete to think about together, including to understand where it does not work.

Much depends on the strength of the idea and the quality of its implementation. And the value I see in MediFlow may be influenced by the fact that I am developing it. Even if the result were not good enough, though, I think there would already be merit in the question it could raise. Sometimes it takes very little to start a discussion.

For me, MediFlow is also this: a way of getting my hands into operations and, from there, returning to a bigger question. How public should healthcare be in the tools through which it works?
