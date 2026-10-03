---
title: LLM Performance and Following Requirements
date: 2026-08-09
featured: true
---

There's a disconnect between the experiences different people are having with LLMs. Some find them transformational, others find them incapable. Partly this is down to skill, partly this is down to a dislike of the technology and it's social implications, but I think there's a further issue. This post is not trying to be pro-AI or anti-AI, I think the social issues are real, I don't believe LLMs live up to all of the hype, but I do find using them can be extremely productive.

So what's the problem? It stems from how LLMs meet requirements, and possibly how humans express them. Let's do a review of where LLMs work well and fall short to observe some patterns...

### Where LLMs work well

This is not to say that LLMs work perfectly for all of these things, but rather that they generally work better, and need less guidance.

**Vibe coding** – by this I mean deferring all programming to an LLM, not writing any code, not reviewing any code, and focusing on one-shot or few-shot implementations. Clearly LLMs are very good at this, and an ecosystem of products has emerged around it.

**Security testing** – LLMs are also seemingly amazing at finding vulnerabilities in code and systems. The longer the trajectories, the more capable LLMs are at finding vulnerabilities.

**Short creative works** – LLMs excel at things like poetry and songwriting. There's a separate question of artistic value[^1], but it's undeniable that LLMs can produce perfectly reasonable poems, songs, short form creative writing, and change the voice or nature of existing documents.

### Where LLMs fall short

Similarly to where LLMs work well, this is not to say that LLMs fail on these next areas, but rather that they struggle, perform worse (in quality, time, tokens), or require more guidance and human vigilance to achieve the desired outcome.

**Code maintenance** – LLMs are not good at keeping codebases in good condition, being generally poor at balancing forward progress with maintenance.

**Writing for a technical audience** – LLMs produce poor technical writing, almost always failing to convey the correct level abstraction, missing nuances, or misunderstanding the amount of historical context that should be included.

**Evolving a codebase** – Producing code _over time_ is very different to producing it once, needing to account for cross-system dependencies, backward compatibility, data migrations, deployment cadence, and even building confidence in changes. LLMs struggle with all of these.

**Research** – LLMs often _appear_ to be great at research, whether it's researching how a codebase works, or researching a topic and preparing a report, but as any expert can attest to, they often miss subtleties and produce text that may be technically valid, but emphasises the wrong things or tells a story in the wrong way such as to miss the point.

### Drawing out a pattern

My hypothesis is that the pattern between the good and the bad is down to _requirements_.

LLMs work well when there are few requirements, and struggle when there are many. They also work well when the requirements are clear, but I don't think that's the main driver.

Let's take vibe coding as an example. There are very few requirements given with vibe coding. The user specifies some high level goal, and the model is free to do whatever it wants to get there. Does a React frontend work well, or match the training data more? Then let's use a React frontend. Is a Postgres backend close to the median in the training data, let's use that. The user doesn't care, and the model is free to run wild, introducing new dependencies anywhere, multiple ways of doing the same thing, and all manner of other engineering sins.

What about security? Finding security vulnerabilities is hard, but we actually lack much data about the counterfactuals. How many runs with LLMs failed to find anything? This field works well because it is fundamentally unconstrained, and again the model is free to explore. The actual exploit also doesn't need to be well built, it only needs to work.

Creative works similarly tend to have few requirements, all explicit in the user prompt. The space of valid outputs is large.

On the other hand, LLMs struggle with evolving codebases over time. A codebase is essentially a collection of requirements – which APIs are available and should be used, how each subsystem works, schemas, and so on. If one were to exhaustively list the constraints on a codebase, it would be a vast trove of information, and would likely blow up the context window far beyond what is practical.

Many of those requirements are also _very_ implicit. Backwards compatibility is a subtle issue and can be hard to measure. Performance requirements are implicit and hard to measure. And a codebase is not fixed in time, but development requires a complex series of commits, deploys, and migrations to evolve it over time.

Writing for a technical audience trips up on some of the same aspects, nuance is key. The requirements are based on the audience and their experience, knowledge, and state of mind. Documentation requires telling a story that uses all three to convey complex concepts. Research output is also similar.

### But what about loops?

...I hear you ask. We can give LLMs a tool that verifies requirements, and just tell them to run the tool and work until it passes!

I think this misses the point. Firstly, many of these requirements cannot be measured, there is no tool that can verify them. But even in areas where we could measure everything (e.g. a codebase with 100% test coverage, linting, etc), aren't we just hill-climbing towards a solution that passes the tool's checks, rather than actually engaging with the requirements? It could be argued that we have in fact only reduced the number of requirements to one: "pass the checks".

That's not to say this approach is useless, I'm in fact proposing the opposite – that LLMs are bad at meeting requirements so to get the best performance from them we must remove and reduce requirements, and tools are a fairly effective way of doing that.

### Isn't this just context engineering?

You could argue that the problem is just context engineering, and that if we can get all the requirements into the context then the model will do fine. This is true in some ways – an explicit requirement in the context is certainly going to work better – but this too misses the point.

Humans are reasonably good at _implicitly_ following _implicit_ requirements. That is to say that we often don't realise we've done something the right way, we just get it right the first time anyway[^2], even when when no one asked.

There's no amount of context, at least not one we can forsee with current LLM technology, that will make up for this.

### Requirements are hard

Requirements are hard, in software engineering and beyond. They always have been. LLMs seem, in my experience, to scale in ability based on the complexity of requirements. Explicit is better than implicit, verifiable better than unverifiable, and those that depend on time and human factors are the most challenging.

Humans are also bad at writing requirements, and that's a contributing factor to LLM performance here, but I think humans are better at following requirements, particularly implicit ones. We develop intuition over time, intuition for what the requirements of a system, or audience are, and we use that intuition to guide our decisions. It's often the case that we know to do something without knowing why until we step back and think about it.

LLMs don't develop intuition. They can develop _knowledge_ via various retrieval augmented generation (RAG) techniques, but that's just another way to get more detail in the context and produces the same problem of following requirements. It's LLM training that is the closest analogy to human intuition, and we don't yet have the technology for continuous training. I think when we develop such a step forward it'll make this whole problem largely obsolete.

In the mean time, better training will continue to improve LLM performance and close the gap for transferrable skills[^3], but until they can develop their own intuition, there's always going to be a ceiling on tasks that have many and varied requirements. Despite the advent of skills, training data is still critical.

### Building my own intuition

Based on all of this, I'm developing my own intuition for where LLMs are likely to succeed and fail, and it all comes down to how many requirements there are for them to follow. The more I can leave up to the model, the better it will do. Unfortunately that doesn't align well with development in large, mature codebases, but it's great for isolated components, prototyping, greenfield work, and exploring optimisations. I'm also starting to structure projects in a way that shifts more of the work towards these aspects.

[^1]: I have no interest in AI generated poetry and songs, but _mechanically_ they are capable of producing the necessary format of writing with the right words in the right place.

[^2]: I'm not talking here about big complex problems, I'm talking about muscle memory, small, learned steps and interactions that we don't even think about.

[^3]: LLMs used to struggle with git operations for example, but we've trained that into them. If you use git then they'll naturally get a lot of steps right without "thinking" about it. If you don't use git, good luck.
