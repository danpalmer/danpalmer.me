---
title: Implicit Hiring Criteria
date: 2021-09-11
theme: blue-washed-red
featured: true
---

At Thread I'm involved in hiring engineers for frontend, backend and iOS roles.
One of the things I have become more aware of as I have gained experience in
hiring and interviewing is how my biases affect the outcomes of interviews. This
is something I'm always trying to improve – to understand what biases I have, to
mitigate their effects – and in the process I have found a mental model that has
helped me.

Hiring, and scoring candidates, is usually framed around criteria or
competencies, that we are _explicitly hiring for_, but this is only one of 4
categories of assessment criteria.

It follows that if there are things we _are_ hiring for, there must therefore be
things we _aren't_ hiring for. Additionally, if there are things we are
_explicitly_ looking for, there may be things we are _implicitly_ looking for.

We can draw up a table to explore all of these cases.

|              | **Looking for**                                              | **Not looking for**                                       |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------------- |
| **Explicit** | **(1)** Competencies, the skills we're seeking for this role | **(2)** Limits to what we are looking for                 |
| **Implicit** | **(4)** Things we require from candidates without knowing it | **(3)** Things we don't realise are important to the role |

Let's look at each of these in detail. We'll go by the numbers above as this
will help us to get a full understanding of the model.

### 1. Explicitly looking for

This is the easiest, it's our traditional criteria or competencies. Let's use an
(infamous) example: asking a software engineer to write the algorithm for
reversing a binary tree on a whiteboard. In this case the criteria may be:

- Candidate is able to parse and understand a problem description.
- Candidate can produce working code to solve a straightforward problem.

These are reasonable criteria for a software engineer, and while this particular
interview has its problems, it is likely to give us some signal on these
criteria that will help us decide if the candidate is suitable for the role.

This category of requirement is the basis of all hiring, and well understood.

### 2. Explicitly not looking for

This category of criteria is sometimes used, but in my experience could often be
used more. Essentially we're asking what attributes are _not_ important for us
in a candidate. A concrete example of this is in the pair programming interview
I do with candidates at Thread.

We have decided as a team that we are not looking for _Python engineers_, and
that we believe that a good engineer will become a good Python engineer
regardless of whether they already know Python or not.

For backend engineers I run this interview in Python, as I have a good
understanding of what is possible in the solutions. However because we have
decided that Python is something we are _explicitly not looking for_, I know to
exclude certain kinds of missteps a candidate might make from my assessment. I
also know that I should provide as much help as I can on Python syntax and
understanding without penalising candidates.

Being clear within the hiring team about what is _not_ important means more
alignment in the hiring team, and fewer opportunities for bias to creep in.
A good way to achieve this is with explicit rubrics for interviews.

### 3. Implicitly not looking for

These are criteria that we haven't realised are needed for the role, and
therefore aren't assessing for.

For example, how much of a software engineer's role is writing code, and how
much is tech meetings, email, reviewing code, explaining technical topics, and
other forms of communication? Are we assessing for communication at all, or in
enough detail?

Another example of this may be culture fit. Many companies assess for this
badly and introduce bias into their process, but when this is done well it can
result in a team that is diverse on most axes, but has a shared set of agreed
upon values.

- Does the team value collaboration, or value individuals going deep on topics
  by themselves?
- Does the team value craft and reliable engineering, or does it value moving
  quickly and responding to changing priorities?
- Does the team value performance or readability of code?
- Does the team value a theoretical approach, or a practical one?

These are all on a spectrum (as well as being simplifications to illustrate a
point), with very few teams falling completely at one end. All teams will have
different views on what's important and by understanding these views, and
interviewing for engineers whose views align, it's possible to build a team that
works well together. It's important to note that this can be a way to
unknowingly introduce bias into your hiring, so this needs to be done carefully.

### 4. Implicitly looking for

This is the category I find most interesting, and the one I have learnt the most
about since I started interviewing.

For an example, let's return to our whiteboard test from before. While there are
a few criteria that we want to assess with this, there are also some hidden
criteria we may not realising we're assessing:

- Can the candidate speak in front of a (small) audience?
- Does the candidate know specifically what a binary tree is and how to reverse
  it?
- Is the candidate physically able to write on a whiteboard?

It's easy to explain these away...

> You can ask questions and figure out roughly what a binary tree is if you
> don't know it already, and who doesn't know it anyway?!

Not everyone comes from a Computer Science degree, some people may have come
from web design, games testing, QA, IT, etc. They may never have learnt what a
binary tree is, at least not enough to remember confidently in an interview
context. Is this _really_ important for the role? It may be, but it's important
to make an _explicit_ decision, rather than fall into an _implicit_ one.

> Who isn't able to physically write on a whiteboard? If they can't, they'll
> just say so.

Candidates with dyspraxia may struggle to write on a whiteboard. Assuming that a
candidate will push back on an aspect of an interview if they have a reason to
is a big assumption – interviews have strong power dynamics that people deal
with in very different ways.

Another good example of things implicitly sought in interview processes is with
take-home tests. These are often open ended, which selects for candidates who
have significant free time to spend on the test. Is having lots of free time a
necessary criteria for the role? Probably not, and so it's important to not
make it an implicit criteria.

It's important to know what skills an interview is _implicitly_ selecting for.
Are they really important?

---

I think all criteria being assessed in interviews will fall into one of these
four categories. Which one will depend on the role, the team, the interviewers,
but there's one approach I think everyone could benefit from: make everything
explicit.

By trying to find what's **implicit** in your current process and making it
**explicit**, you may have the opportunity to further refine your job spec,
further understand what you're looking for, and further eliminate bias from your
process. It's not easy to find the implicit criteria, but it can be made easier
by talking to candidates, having retrospectives in the hiring team after each
candidate, using resources such as
[_Hire More Women In Tech_](https://www.hiremorewomenintech.com), and constantly
iterating your hiring descriptions and interview rubrics.

This is certainly not a catch-all solution to biases and diversity in hiring,
but it is a mental model that I have found useful to help improve my
understanding of the topic and improve how I interview.
