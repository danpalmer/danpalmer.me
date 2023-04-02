---
title: Joins Don't Scale
date: 2023-04-02
featured: true
---

A classic part of the NoSQL sales pitch is that SQL `JOIN`s are too expensive
and don't scale, and a classic response is to point to [big
websites][stackoverflow] running smoothly on SQL databases. The reality, as
always, is a bit more complicated than that.

### Types of scale

When engineers talk about scale, they're almost always referring to some sort of
usage scale, but even this is not always clear. Usage scale can take the form
of:

- traffic
- amount of data stored
- number of records stored
- amount of data processed
- number of servers running the code

There is however another type of scale – complexity. This can also take many
forms:

- complexity of data model
- interdependencies between components
- complexity of organisation and coordination
  - number of engineers
  - communication about the system

It's important in discussion to be precise about what we mean by scale, as
otherwise there's scope for misunderstanding of requirements.

### Scale in databases

Applying this, and being more specific about the scale in databases, we can
roughly boil it down to three axes.

**Scale of traffic** The number of queries served per time interval. Often a
necessary part of this is some soft deadline, as users expect a certain level of
service.

**Cardinality of data** How many records are being stored. The size of those
records can often be ignored for database discussions, unless it's extremely big
(PB) or extremely small (MB), storage will probably be boring local disks or
nearby cloud volumes. The number of records however affects how joins work.

**Scale of data model** How many tables are there, how many fields, how many
foreign keys, how many relationships (in the general sense of the word) between
pieces of data?

### Joins don't scale

At a certain level of _data model complexity_, combined with a certain scale of
_data cardinality_, joins do indeed fall apart.

Queries that join many tables, query many rows, and perform complex filtering,
are rarely going to be performant enough for interactive use. Clever tuning,
good index selection, and manually breaking apart queries to make
application-specific optimisations, can all extend the lifetime of a database,
but they only go so far.

At this point, a NoSQL[^1] approach can indeed win out, but that doesn't have to
be in a NoSQL database. What has failed is the complexity of reading normalised
data. The solution is to de-normalise the data. Once the relational model has
been left behind, the technology backing it doesn't matter much.

### Denormalised data doesn't scale

The flip side to "Joins don't scale" is that the alternative – denormalised data
– doesn't scale either.

At a certain level of data model complexity, and potentially traffic, there's
just too much bookkeeping to do to ensure consistency across the data. This is
because denormalising necessarily entails creating copies of data, so updating
that data necessarily becomes more complex.

Additionally, the engineering complexity of managing complex data models, with
schema migrations[^2], code to update denormalised data, application level code
to ensure data consistency, and more code to optimise all of those things
because there's so much more of it to do... all gets out of hand. It takes more
engineering effort because the database is doing less out of the box.

### A rule of thumb

The exact solution depends on the specifics of each product, but in general I
like to try to make sure that all data[^3] falls into one of two categories:

- Low cardinality and/or low traffic, high complexity
- High cardinality and/or high traffic, low complexity

There's a possibility for some variation on the cardinality and traffic, but
roughly these two categories define data that should be normalised and that
which should be denormalised.

The first category should cover core [CRUD][crud] data models, and often complex
business processes. Even things like payments and order management are often not
actually as high traffic as people think (customers load a lot more pages than
they do make payments), and are much easier to manage correctly with a well
designed data model, enforced by constraints in a DBMS. This category is
normally the best default.

The second category typically covers data that has been denormalised for
efficient serving. It's simple in structure, often because it has been flattened
from many sources. It's also often directly keyed, and requested by that key
rather than filtered and sorted in complex ways.

### Case study

At Thread we had a complex data model covering products, orders, payments,
inventory management, warehouse processes, content, and more. In almost all
circumstances, this worked well – tables and relationships were well considered,
and constraints and types could mostly be relied upon to make it difficult or
impossible to represent incorrect data. An example of the power of relational
data was in our order management codebase, where a completed and shipped
customer order may have been split across 20-30 tables.

However there was one table that caused no end of issues: the user feed. This
table was roughly equivalent to an Instagram or Facebook feed, although with
entries added by Thread rather than by other users. In later years, this table
represented around 50% of the production database, about 1.5TB of data.

As a result, querying this table in any way other than chronologically ordered
for a single user was nearly impossible, and even that core use-case was
unacceptably slow when querying more than a short time range.

While most of our data was low cardinality, low traffic, high complexity, this
table was the opposite. There was little benefit in maintaining relational
integrity between it and other tables, and having just one table served from a
different database wouldn't add a significant overhead as it's easy to write
special-case code paths for that. We were already doing this for performance
anyway.

### Step-by-step

Based on this rule of thumb, a good approach to scaling data is to follow the
following three steps:

1. **Start with a relational database with good consistency guarantees[^4].**

   This provides a general purpose foundation that is unlikely to be unable to
   do something. This is the fastest way to get started and may suffice for
   years.

   [Basecamp][basecamp] is an example of a relatively big service that has never
   needed to progress further, and most companies should be able to operate in
   this way indefinitely.

2. **When one table or area of the schema becomes problematic due to too much
   data or too much traffic, move it to a specialised database.**

   The normalised source of truth may still stay in the relational database and
   this may only be a denormalised cache, or it may replace the relational
   database entirely for this data. This adds a small overhead, but allows
   scaling _much_ further. There shouldn't be more than a couple of things for
   which this is needed.

   [Stack Overflow][stackoverflow] is an example of a very large web service
   that has operated at this level for many years.

3. **When _many_ areas are failing to scale, divide the data model, define
   strong boundaries, and move to services owning their own data stores.**

   This introduces significant overhead as communication and coordination
   between services becomes harder, and teams are needed to manage
   infrastructure and operations. There are other reasons to reach this point
   before database scaling necessitates it, but most companies won't need to do
   this purely for reasons of scaling data.

   Companies like Google operate at this scale, and have the resources to be
   able to effectively work with this scale of traffic and complexity, but it's
   still a costly endeavour.

Joins don't scale, but neither does denormalised data. Staying on capable
general purpose relational databases by default, and only moving to specialised,
denormalised database when needed is a great way to maintain productivity as
teams and products scale.

[^1]:
    "NoSQL" as a term is a bit 2014, but the practice is alive and well in the
    form of many open-source databases.

[^2]:
    Schema-less just means the schema is poorly defined, and the schema
    migrations are therefore likely even more poorly defined, further adding to
    the maintenance complexity.

[^3]:
    Only thinking about persistent data here, caches are a third type with their
    own trade-offs.

[^4]:
    And all of ACID, but consistency is the most important for most web
    services.

[crud]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[stackoverflow]: https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/
[amazon100ms]: http://glinden.blogspot.com/2006/12/slides-from-my-talk-at-stanford.html
[basecamp]: https://basecamp.com/
