---
title: The Checklist Manifesto – Atul Gawande
date: 2019-09-22
theme: checklist-manifesto
featured: true
---

Not long after a recent one to one with my manager, discussing how we could improve our
incident response process in engineering at Thread, I returned to my desk to
find a copy of [The Checklist Manifesto][checklist-manifesto] that he had kindly
got for me.

This is less of a book review and more of some highlights that I wanted to pull
out from the book. Going into it, I had already read about the effectiveness of
checklists in preventing human error, particularly in commercial aviation and
medicine, but the book still had some great points to make. I won’t mention on
any of the evidence as the book goes into plenty of detail, I’m more interested
in how checklists can be used and the effect they have had on various
professions.

#### Checklists shouldn’t be complex

Our professions are increasingly complex, with specialisation upon
specialisation becoming common practice. It’s easy to think that a checklist
needs to be complex to have impact, but the opposite is true. Checklists need to
be simple and “automate” the easy things, so that we as experts in our fields,
can use our skills on the hard things. Frequent iteration to reduce a checklist
to the bare minimum is important to prevent it from going stale, which will lead
to people skipping steps that they don’t feel are important.

#### Make it clear when a checklist must be used

A checklist that doesn’t have a defined time to be used won’t be used reliably.
We’ve seen this already at Thread. We have an incident response checklist, but
we don’t have a trigger anywhere in our process to decide that something is now
an incident – instead issues just naturally escalate in importance until, hours
in, we realise we haven’t run through the checklist. It’s important to have a
defined trigger built into process, that anyone can recognise means it’s time
for the checklist.

#### Checklists can encourage better communication

The author mentions that some studies in hospitals showed that introducing
everyone around the room before surgery improved patient outcomes. This benefit
was put down to simply knowing each others names, something that is uncommon in
hospitals above a certain size. I’m not sure how yet this might apply to a team
such as Thread, where we all know each other fairly well, but I wonder whether
always starting a new Slack channel for discussion of an incident will remove a
barrier in a similar way, as it’s easy to not want to pollute a popular channel
with lots of conversation about a topic that doesn’t apply to everyone. Incident
specific channels are something we’re trialling in our incident response
tooling.

#### Checklists can break down hierarchical barriers

In surgery there is a cultural expectation that surgeons are in control and have
more say than the rest of the staff, but this can be quite harmful as the
surgeon does not have all of the information, and important information is in
the hands of anaesthetists, nurses, and others. By having the nurse run through
the checklist, it broke down the hierarchy, reinforcing a culture of everyone in
the room being an active contributor to the success of the operation, and a
culture of being able to question authority.

I liked this point because of how much it fits with our culture at Thread. As
with all businesses, we have some necessary hierarchy, but we strive for an
environment that makes it possible for anyone to question anything because we
believe that improves accountability and the quality of decision making.
Typically our incident response is done by members of the team experienced
enough with our infrastructure to be able to address the wide range of issues
that might occur. To onboard new engineers we’ve used sometimes used pairing, so
it would be great to experiment in these cases with the less experienced
engineer being responsible for running through the response checklist.

---

The book made the point that there are many professions, from medicine to
aviation to investment banking to construction, that can benefit from
checklists. It’s a quick and engaging read, not boring as one could imagine for
a book about checklists, so I’d encourage anyone working in a field with any
sort of complexity to read it and see what lessons they can apply to their
working culture in general, as well as how checklists might be a useful addition
to their processes.

[The Checklist Manifesto][checklist-manifesto]

[checklist-manifesto]: https://amzn.to/2zScLZf
