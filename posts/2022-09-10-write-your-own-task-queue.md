---
title: "Write Your Own Task Queue"
date: 2022-09-10
hidden: true
---

This is not a tutorial on _how_ to write your own task queue, but rather an attempt to convince you that you _should_ write your own.

What's a "task queue" in this context? For the purposes of this post, a task queue is a system for performing work out of band from a user interaction, often at some later time. Typically this is a core component of many web apps, and is used for performing long running tasks or things that can fail and may need to be retried like sending emails.

So, why write your own? In short: task queues have many properties and tradeoffs that make it hard to find one that fits requirements perfectly, and with the world class open-source software we have available today they can be relatively quick to write from scratch[^1].

# Properties and trade-offs

Task queues exist at the intersection of many technology and product decisions. In terms of technology problems, task queues often interact with:

- Language - which language and ecosystem the task queue is designed for
- Deployments - how do runners stop and start, what's the behaviour for in-flight tasks
- Orchestration - how are runners scaled
- Packaging - how are task runners packaged and what do they look like when running (e.g. containers, processes)
- Process signals - how are signals used, if at all, to control the runners
- Storage - how are tasks stored
- Capacity - when it is provisioned, both for the task queue as a whole, and for individual types of work
- Logging and Error Reporting - where the data goes and whether it is sampled or not
- Metrics - where performance tracking for tasks goes and how it is computed

As for product or business requirements, there are many more things to consider:

- Priorities - how do tasks of different priorities behave in relation to each other
- Deadlines - whether there are deadlines for work and how to ensure they are hit
- Idempotency - how tasks are treated when run multiple times
- Queueing semantics – whether tasks are run at-least-once, or at-most-once
- Retries - whether failed tasks should be reattempted and with what behaviour
- Results - whether tasks have a resulting value that needs to be stored

Each of these topics could be a blog post in its own right, discussing the options, pros, cons, and tradeoffs. The important thing to take away from these however is that each task queue implementation is going to make decisions on each of these and if those decisions aren't the right ones they can cause engineering or operational issues and take a lot of effort to work around.

Some of the more popular open-source task queue implementations try not to make too many decisions and instead make as much as possible configurable. This approach can work in moderation, but often ends up introducing far more complexity than is strictly necessary as most teams don't need multiple options for each decision, they only need the one option that works best for them. [Celery](celery) is a good example of this – it's very configurable, but as a result it's much more complex than necessary for almost any of its users.

# Building from scratch

Today it is easier than ever to build a task queue from scratch due to the amazing open-source infrastructure we have available, and the great libraries available in most mainstream languages for things like process control, I/O management, logging, serialisation, and more.

There are many good options for databases:

- Postgres can bring strong consistency and options for idempotency control.
- Redis can bring speed and simplicity.
- RabbitMQ can bring complex queue topologies and behaviours, with strong consistency and scalability.
- Kafka can bring performance benefits for large scale high performance systems.

Between using an open-source database for storage and existing language libraries, and minimising features to exactly what is needed, implementations can be surprisingly small. A recent example is [WakaTime](wakatime), who replaced Celery with a custom-built queue. This effort took one week to build and productionise, and consisted of just 1,264 lines of Python. At [Thread](thread) we also had our own [task queue implementation](dlq)[^2] which was similarly small and built around exactly what we needed.

There are multiple advantages to building your own task queue. By only solving the problems necessary for the team, code is typically much smaller and more straightforward than open-source libraries that try to solve everyone's problems. This makes the task queue easier to understand and it's reasonable for the team as a whole to have a very deep understanding of the code. Simpler code is also simpler to operate in production, and easier to reason about the behaviour and performance of. Finally, rather than trying to make every behaviour configurable or pluggable and guess ahead of time where customisation is needed, the codebase can be modified as needed in response to changing product and technical requirements, making it easier to adapt over time and minimising the technical debt introduced by incorrect or unnecessary abstractions.

# When not to build your own

Despite this advice, there are times when it may be the wrong choice to build your own task queue. If the main way that work will be enqueued is by an off the shelf piece of software rather than an in-house one, there's probably an existing task queue that the software is best paired with. Another time when this approach may be inappropriate is in a team with diverse and competing requirements, for example one with many different types of workload, different clients, or needing to back on to multiple different storage layers.

Before embarking on the mission of creating a new task queue do survey the existing options, but make sure not to underestimate the hidden costs of using one, or the benefits that may come with writing one from scratch.

---

So go and write your own task queue! Most solutions out there won't satisfy all of your requirements, or will be very complex, and there has never been a better time to build on open-source infrastructure and code to create your own high quality task queue that works perfectly for your team.

[^1]: One could argue that building on top of millions of lines of existing code in an open-source database is not "from scratch", but this just depends on which level of abstraction you view the problem at. Considering database code to be at the same level as first-party code developed in-house is not a productive approach for most teams.
[^2]: Technically open source, but in line with the message of this post I wouldn't recommend its usage as it's mostly designed for Thread's use-cases.

[wakatime]: https://wakatime.com/blog/56-building-a-distributed-task-queue-in-python
[celery]: https://docs.celeryq.dev/en/stable/index.html
[thread]: https://www.thread.com/
[dlq]: https://github.com/thread/django-lightweight-queue
