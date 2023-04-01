---
title: "Cross-Cutting Concerns in Library Design"
date: 2021-05-03
featured: true
---

_A mental framework for library design_

For those with plenty of experience managing complexity in large complex
codebases, this post will likely be nothing new. However many open-source
libraries, frameworks, and tools make mistakes in how they handle _cross-cutting
concerns_ and end up being difficult to use as a result. I'm no stranger to
this, and have several times found myself unsatisfied with the design of a
library that I've created only to realise that it's due to mishandling of
cross-cutting concerns.

This post is a not a set of rules, but rather a framework for thinking about the
design of libraries and tools. It's also not intended to be the only framework
used to think about the design, there are lots of ways of slicing the design
problem that each provide value in a different way.

The post focuses on libraries as this issue tends to matter more at the point of
integration between systems, but much could apply to frameworks and tools, the
line is often blurred between these anyway.

---

Careful consideration of which cross-cutting concerns the code has an opinion
on, which it defers to the user, and which don't apply, will lead to code that
is more usable and that is a better citizen in the ecosystems it's a part of.

What are cross-cutting concerns and why do they matter so much when building
libraries? The term "cross-cutting concern" originates from Aspect Oriented
Programming where it has a more specific meaning, but here it's used to mean
shared concerns that affect multiple areas of the code – that "cut across" the
core functionality with supporting, secondary functionality.

Logging, configuration, connection pooling, authorisation – there are many that
crop up time and time again. The reason they matter for library design is that
if these concerns don't line up with the contexts in which the libraries are
being used, it creates an impedance mismatch that makes integration harder or
impractical.

Taking logging as an example, there are many different ways of using logs.

- Some teams don't use logs, their usefulness depends on what you're building.
- Other teams might only use logs in development and be happy with any output
  that helps them debug.
- Some may want all their logs to be written to disk and managed with
  [logrotate](https://linux.die.net/man/8/logrotate), necessitating certain file
  handle use.
- Others may be legally required to store their logs centrally in specified
  formats for a minimum period of time for auditing purposes.

Authors of open source packages are usually trying to solve a problem they have.
An author in the first group may not include any logging, preventing others from
using it. An author in the second group may write their own file handling making
it difficult for those in the later groups to control their logging. An author
in the last group may write a package that requires so much logging
configuration that the first two groups would find the package unapproachable.

None of these issues have anything to do with the core functionality of the
package, they just take an opinion on a cross-cutting concern that is
accidentally incompatible with the requirements of some users.

### Worked example

To further illustrate the point, consider a Twitter API client library. It
provides a language-native interface to the Twitter API in the language of your
choice, turning raw HTTP requests and responses into functions, classes,
methods, or another language appropriate interface.

Each cross-cutting concern needs to be handled in one of three ways...

#### Irrelevant concerns

Handling irrelevant concerns is by far the easiest, they don't need handling.
The important thing is to be aware of the existence of the concerns and to
knowingly ignore them.

_Example: code discovery_

There is no concept of finding units of code for a Twitter API library. A plugin
system doesn't make sense, but double checking whether it makes sense and
actively deciding to ignore this concern is important.

_Example: logging_

A gotcha to be avoided here is that in some cases ignoring is as good as
not-supporting, which is itself an opinion on the concern that will limit who
can use some code. While it may be reasonable to some for a Twitter API library
to not have any logging in it, pushing responsibility to the callsite, there may
be use-cases that require logging on network calls or at some other point, and
not having any logging excludes these use-cases.

#### Opinionated concerns

Next easiest is probably the concerns that the library is going to have an
opinion about. Again these are fairly easy because by deciding to take ownership
of the decisions, the author is able to achieve these however they choose.

Some of these are uncontroversial, but for many the tricky bit is not the
implementation, but making the right decision and backing it up.

_Example: service discovery_

This example is likely uncontroversial. A Twitter API client could allow for
defining API endpoints for arbitrary services that happen to be implementing the
API contract, but a library that hard-codes this to `twitter.com` is unlikely to
cause issues for most. In a way this is a core part of the library, not a
cross-cutting concern, and therefore it's reasonable for a library to have an
opinion on it rather than making it configurable.

_Example: concurrency_

This example however could be much more complex, depending on the language. Most
of the Python ecosystem is still using synchronous code, while newer codebases
for things like web services that are often I/O bound are starting to use
asynchronous I/O to improve throughput. Supporting both is often difficult so
many libraries decide to either be synchronous or asynchronous. Another example
is the use of Promises or callbacks in the Node JS ecosystem.

While neither of these are insurmountable, it's possible to use a library
designed for one in the environment of another, the "glue code" to make that
work is more code to maintain and can often be challenging to write.

Being opinionated on a cross-cutting concern usually makes sense for details
that don't matter, and a small number of major details, where it may be possible
for an alternative open-source package to fill the space left on the other side
of the decision. This typically does not make sense for large numbers of
decisions in a piece of software, unless it's a large framework. For the Twitter
API library example it would be reasonable for it to be asyncio based, or
Promise based, or the equivalent for other ecosystems, and to leave it up to
alternative libraries to fill the other use-cases.

_Example: secrets management_

An example of a concern that should probably not be opinionated for the case of
a Twitter API client library would be credentials management.

One possible design would be to read the API key from a file on disk in a
specific place. This would be easy to use, but raises a number of questions:
_How does the file get there? What are the permissions on the file? Where do the
credentials pass through to get there? Who else has access because it's on
disk?_ Each of these could prevent a user from using this library either due to
technical constraints or security policy constraints.

Taking the API key as an argument to functions in the library is likely a much
better decision as that shifts responsibility to the user, allowing them to use
the file strategy if they like, or environment variables, or an existing config
or secrets management system.

#### Unopinionated concerns

Lastly there are those concerns that are unopinionated. These are often the
hardest, because to remain neutral on them means creating the extensibility
necessary to hand off responsibility to the user, and because it's so easy to
miss something and unintentionally take an opinion.

What engineers identify here will often depend on what they've had issues with
in the past – if they have never worked on a codebase with translation support
they may not consider it a high priority or may forget about it as a concern
entirely.

Unopinionated concerns are hard to handle because of the myriad of ways to hand
off responsibility to the user. This could be as simple as adding an argument to
a function so that the user can pass in some data, or as complex as a plugin
system so that users can implement plugins that interface with systems unknown
to the library author. Developing an instinct for the best solutions to these
problems typically means having a wide experience of the particular ecosystem
the code exists in.

_Example: logging_

Python comes with its own built-in logging system. Because of this, the best
choice for software written in Python that wants to be unopinionated about
logging is to use the built-in logging system. This ensures that the user has
control over the logging in a well-defined and documented way and that it plays
the part of a good citizen in the ecosystem.

Opinions on Python's logging system are mixed, and so it would be easy for an
author to believe they can do it better, but the fact that it is standardised
between most libraries and frameworks means that there's an ecosystem of
components that replace the core logging functionality and which can be used
without needing support from the library author. This is a great example of the
benefits of playing nicely with the ecosystem.

In the Twitter API library example, it would be important to choose a logging
mechanism that is most likely to fit with the rest of the ecosystem. Allowing
the user to control formatting and log redirection is important, as is naming
log sources such that they can be filtered if necessary.

_Example: serialisation_

Serialisation and deserialisation formats are often decided by external systems
so not something that can be changed. However this isn't always the case.

To use the Twitter API library example one last time – Tweets may be returned as
objects with properties, and it may be necessary to persist these objects to
some form of storage, maybe an on-disk cache. It would be easy to implement a
`to_json` method that returns a serialised string but there are many cases where
this isn't an appropriate format. A better alternative may be to provide a
public interface for all the state to be read out of the Tweet, and another to
re-construct that Tweet from the raw data. This would allow users to implement
their own serialisation and deserialisation however they like, but in some
languages this may not be very ergonomic or may require a lot of boilerplate.

Swift has a language defined protocol called `Codable` that allows any object
that implements it to be serialised/encoded by any other object that implements
`Encoder`, without each requiring knowledge of the other. The Swift version of
the Twitter API library should probably implement `Codable` for `Tweet` and let
users choose the encoder.

While these are two examples of "unopinionated" concerns, they are still in fact
opinionated in that they force the use of Python logging or Swift's Codable,
each decisions that will limit usability in some way.

The best choices here come from a deep experience in an ecosystem –
understanding how libraries and tools interact and how they are used in order to
find the best way of relinquishing responsibility to the user for each
cross-cutting concern. There's no precise definition of what's opinionated and
what's unopinionated, it's up to the standards of the ecosystems – the
languages, frameworks, operating systems, communities, and organisations.

---

This isn't the only way to think about design, in fact there's nothing here
about how to design the core functionality of a library or tool, but hopefully
this is a useful mental framework or thought experiment that can be used to
check the suitability of design ideas.

### Cross-cutting concerns to consider

These are just a few that came to mind while writing this post. I'll be
referring back to this list when I write my own libraries and tools.

- Logging
- Metrics
- Tracing
- Authorisation
- Dates, Times, Timezones
- Localisation, Internationalisation, Translation
- Accessibility
- UI Styling
- Database access
- Credentials – where they are stored and security requirements
- Configuration – location, format, support for hot-reloading
- Execution control – threads, green-threads, promises, futures
- Code discovery – plugins, test discovery
- Scheduling – cron or time-based scheduled tasks
- Service discovery
- Connection management – TCP, HTTP, databases, connection pooling
- File storage – filesystem, cloud storage
- Serialisation
- Randomness – controllable sources, seeding of pseudo-random sources
