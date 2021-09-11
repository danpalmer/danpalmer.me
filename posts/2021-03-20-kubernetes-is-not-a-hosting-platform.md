---
title: "Kubernetes is Not a Hosting Platform"
date: 2021-03-20
featured: true
---

There's a common theme in software engineering communities of software that's
too complex. Slack and other Electron apps are frequent targets – why do we need
yet another "web browser" using 2GB of RAM when IRC worked perfectly well?

While I can empathise with the performance issues, the question often betrays a
misunderstanding of the problem being solved or the target audience of the
software. Slack is not designed primarily for software engineers who grew up on
the internet in the 90s, it's designed for non-engineers. People who are used to
spending half their day in their email, or who want to send files to each other
without having to ask corporate IT to allow larger email attachments or bump
their quota on the shared drive. Slack solves these problems very well.

There's another example of this: Kubernetes ("K8s"). Some of the common
criticisms include...

- There are too many moving parts.
- It takes a ton of configuration to be production ready.
- Developers need to write lots of YAML boilerplate for "simple things".
- systemd can do all of this.
- The same functionality can be composed together with existing open-source
  tools.
- A new startup will spend all their time figuring out K8s instead of shipping
  their application.

I believe this is the same phenomenon as with Slack. I think these are valid
criticisms for engineers who do not need K8s, but who actually need either a
traditional Linux-based application deployment, or who need a hands-off hosting
platform. But these criticisms miss an understanding of the problems K8s is
aiming to solve.

## Kubernetes as a hosting platform?

Despite what web development trends may imply, Kubernetes isn't about running
web apps. They are a thing you can build out of the parts it provides, but at
its core K8s is a bunch of state machines and dependency resolvers. If what is
needed is a hosting solution for a web app, K8s will indeed be far too complex
and will bring a lot of maintenance overhead with it.

In fact as a "hosting platform", K8s asks far more questions than it answers:

- How are apps defined? K8s works at a lower level than an "app".
- How are secrets used? K8s "secrets" are only obfuscated configuration, more of
  a solution is needed for secure production apps.
- Where does my database live? Persistent data requires more work in K8s.
- Monitoring? Metrics and logging? Certificate provisioning?

There are answers to all of these[^1], but each has an operational overhead and
introduces complexity. A good _hosting platform_ should answer some or all of
these.

Those who need a hosting platform are likely to get further, faster, with either
a managed hosting platform such as Heroku that will address these needs, or a
simpler and more understandable system built out of well known open source
components[^2] that allow a team to have more control and understanding at a
lower level.

## Kubernetes as a workload orchestrator!

If a system is too complex, if it has too many moving parts, and a more static
hosting solution is failing to capture dependencies and meet requirements, this
is the point at which K8s becomes useful, taking responsibility for
orchestrating the many moving parts and reducing the burden on the engineering
team.

In K8s the user provides the desired state and the orchestrator will
progressively change things under its control until the world matches that
state, and then attempt to maintain it should anything outside of its control
change in the future.

There are two interesting details to highlight from this:

- The obvious one, that if a server fails the services running on it will be
  moved elsewhere, giving services a level of resiliency in the face of failure.
- The less obvious one, that an engineer making changes to a system doesn't have
  to usefully reason about the impact of their changes – K8s will do this for
  them – they can let the constraint resolution do its work and check the
  output.

If you can hold the state of your system in your head, if your scaling concerns
come down to a single number of web server processes or queue workers, then a
managed hosting platform or a more static bare-server based deployment with well
known tools is likely to be a better fit.

Not only are _many_ services in this category, but we should also be striving to
create services and deployments that are simple enough that they can be deployed
with simple tools.

However, when a service, or more likely a multi-service deployment, gets too
complex the need for K8s arises. There are a few examples that I've seen that I
believe illustrate where it can make a real difference. While all of these would
be possible without K8s, they are examples of where it can reduce complexity[^3]
rather than increase it.

### [Hey! email service][hey]

One of the main concerns for Hey! is costs. Basecamp, the company behind it, are
used to low infrastructure costs as they typically host things on bare-metal
servers that they manage themselves. Hey! runs in the cloud so that it can
scale, but the team use K8s to manage their costs in two ways.

The first is that their services run mostly on AWS spot instances – servers that
can be turned off at short notice, but which are substantially cheaper as a
result. They use K8s to ensure that their service components are scaled
correctly even when machines are coming and going underneath them, without
interaction from engineers.

The second is by using K8s to efficiently pack services onto machines. Because
services define their required resources upfront, K8s can [bin-pack][bin-pack]
these services onto the available hardware. When paired with an autoscaler for
the underlying server pool, this will often result in a more efficient use of
resources than on a static bare-metal deployment.

### [OpenAI research cluster][openai]

OpenAI uses GPUs on their servers to accelerate machine learning, but GPUs and
their driver setup can be flaky. They use K8s to manage the lifecycle of
servers, bringing new hardware online in a testing state, running tests to check
that the hardware and drivers are configured correctly, before releasing the
hardware to the pool for training use.

They also use K8s primitives such as taints to implement a lightweight quota
system, scheduling team work onto separate regions of the cluster, while also
allowing low priority workloads to run on unused capacity from other teams.
While K8s doesn't have a particularly advanced quota system, the fact that these
simple requirements could be encoded in it speaks to the flexibility of it for
defining complex workflows. K8s also provides APIs and customisation points for
things like more advanced quota systems to be plugged in should they be needed.

### Thread's recommendations service

Thread's recommendation service needs up to date data about our products, in
particular their stock levels. This data must be distributed to each service
instance several times an hour. As well as this, we also need to ensure that
there's a minimum availability of the recommendation service based on the
current load from customers and batch processing jobs.

Originally we distributed the data by pushing it to cloud storage and having a
systemd timer on every server downloading the updated data on a regular
schedule. This was quick to implement and easy to understand, but unfortunately
failed to solve the problem. When the timer ran, all the servers would go
offline at once resulting in downtime. Even after we added some random variance
to the timers, we were trading off between the data being too old and being
over-provisioned so that even during a dip in available servers we'd still have
enough capacity.

By versioning the data as a container in our recommendation service's pods,
we're able to treat pushing new data out to the cluster as a service deployment.
This way we benefit from the K8s deployment primitives, allowing us to maintain
the service at the right scale (accounting for pod autoscaling) not taking too
many instances offline at the same time. K8s will also verify that instances
return to service successfully and will halt a roll-out should they fail health
checks.

Given that our recommendation service scales from single digits of pods to
hundreds running together, across reliable and unreliable[^4] nodes, with code
deployments potentially happening at the same time, we can push a lot of the
complexity into K8s to be orchestrated for us.

---

When used to solve the problems it sets out to solve, Kubernetes can be a
powerful component of a mature cloud service deployment. It can be used to
efficiently combine requirements across scalability and reliability, and can
encode workflows in a way that scales as systems become more complex.

As software engineers we are uniquely positioned to criticise software but it's
important to remember that we may not always be the target audience, and where
the design choices in a system may not align with what we need, there may be
those for whom it does.

[^1]:
    At Thread we use kustomize, kapp, kbld, sops, Cloud SQL, Datadog,
    cert-manager, and more. Each is good, but in aggregate it was a lot of work
    to set up.

[^2]:
    A fairly typical setup might be Ubuntu LTS, with systemd to manage
    services, and a tool such as Ansible to provision servers. This sort of
    setup is likely to be stable for years at a time, and while building such a
    system isn't easy, information and guidance on this sort of server
    administration is plentiful.

[^3]:
    It doesn't really reduce complexity, it just offloads it to Kubernetes'
    internals. However we have APIs to hide complexity like this. Boundaries can
    reduce accidental complexity on all sides, and can provide a nice interface
    for testing. Ultimately Kubernetes is likely to have a better implementation
    of rolling deployments, for example, than most home-grown implementations
    given its extensive review, testing, and well defined semantics.

[^4]:
    We have a node pool of pre-emptible instances for batch operations in our
    Kubernetes cluster on Google Cloud, along side our regular node pool that
    runs on regular instances.

[pid]: https://en.wikipedia.org/wiki/PID_controller
[bin-pack]: https://en.wikipedia.org/wiki/Bin_packing_problem
[hey]: https://www.lastweekinaws.com/podcast/screaming-in-the-cloud/hey-we-re-building-better-email-with-blake-stoddard/
[openai]: https://openai.com/blog/scaling-kubernetes-to-7500-nodes/
