---
title: Interview Assessment Grid Model
date: 2019-04-25
---

At Thread I'm involved in hiring engineers for frontend, backend and iOS roles.
One of the things I have become more aware of as I have gained experience in
hiring and interviewing is how my biases affect the outcomes of interviews. This
is something I'm always trying to improve – to understand what biases I have, to
mitigate their effects – and in the process I have found a mental model that has
helped me.

Hiring, and scoring candidates, is usually framed around criteria or
competencies, that we are _explicitly hiring for_, but this is only one of 4
types of of assessment criteria.

From this, it follows that if there are things we _are_ hiring for, there must
therefore be things we _aren't_ hiring for. Additionally, if there are
things we are _explicitly_ looking for, there may be things we are _implicitly_
looking for.

We can draw up a truth table of these cases.

|              | **Looking for**         | **Not looking for**                                  |
| ------------ | ----------------------- | ---------------------------------------------------- |
| **Explicit** | 1. Competencies, skills | 2. Limits to what we are looking for                 |
| **Implicit** | 4. Biased hiring        | 3. Things we don't realise are important to the role |

Let's look at each of these in detail. We'll go by the numbers above as this
will help us to get a full understanding of the model.

### 1. Explicitly looking for

This is the easiest, it's our traditional criteria or competencies.

Let's use an infamous example: asking a software engineer to write the algorithm
for reversing a binary tree on a whiteboard.

In this case the criteria may be:

- Candidate is able to parse and understand a problem description.
- Candidate can produce working code to solve a straightforward problem.

These are reasonable criteria for a software engineer, and while this particular
interview has many problems, it's likely to give us some signal on these
criteria that will help us decide if the candidate is suitable for the role.

There's not much more to say for this, it's the basis of all hiring, and well
understood.

### 2. Explicitly not looking for

This group of criteria is sometimes used, but in my experience could often be
used more. Essentially we're asking what attributes are _not_ important for us
in a candidate. A concrete example of this is in the pair programming interview
I do with candidates at Thread.

We have decided as a team that we are not looking for _Python engineers_, and
that we believe that a good engineer will become a good Python engineer
regardless of whether they already know Python or not.

For backend engineers I run this interview in Python, as it gives me a good
understanding of what is possible in the solutions. Because we have decided that
Python is something we are _explicitly not looking for_, I know to exclude
certain kinds of missteps a candidate might make from my assessment. I also know
that I should provide as much help as I can on Python syntax and understanding
without penalising candidates.

Being clear within the hiring team about what is _not_ important, we can get on
the same page, and likely have more alignment of scoring. A good way to achieve
this is with explicit rubrics for interviews.

### 3. Implicitly not looking for

These are criteria that you haven't realised you need, and therefore aren't
assessing for.

For example, how much of a software engineer's role is writing code, and how
much is tech meetings, email, reviewing code, explaining technical topics, and
other forms of communication? Are you assessing for communication at all? Are
you assessing it in enough detail?

Another example of this may be culture fit. Many companies assess for this badly, and introduce bias into their process, but when this is done well, it can result in a team that is diverse on most axes, but has a shared set of values.

- Does the team value collaboration, or value individuals going deep on topics by themselves?
- Does the team value craft and reliable engineering, or does it value moving quickly and responding to changing priorities?
- Does the team value performance or readability of code?
- Does the team value a theoretical approach, or a practical one?
