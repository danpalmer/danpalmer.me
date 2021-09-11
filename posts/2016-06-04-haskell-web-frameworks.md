---
date: "2016-06-04"
layout: post
preview:
  A quick overview of 5 of the popular Haskell web frameworks, and what they
  can do to improve the state of web development.
redirect_from:
  - /2016/06/haskell-web-frameworks
slug: haskell-web-frameworks
title: Haskell Web Frameworks
theme: purple-light-gray
featured: true
---

I've been learning Haskell for a while now and am excited by the improvements it can bring to how we work as software engineers. Haskell has traditionally been used in academia, research, and financial modelling, but has only recently become a productive tool for web development. Since I come from a backend web development background this is what excites me about Haskell, so I've been looking at a few web frameworks to see what might suit my preferences in web development.

### Yesod

[Yesod](https://github.com/yesodweb/yesod) seems to pitch itself as the "Rails" of the Haskell world. My experience with Rails is relatively small, but I can certainly see where they're going with it, and it could probably be seen as more of a 'batteries included' [Sinatra](http://www.sinatrarb.com/) or [Flask](http://flask.pocoo.org/). There's less of the view controller pattern that Rails has, at least out of the box, but it does encourage certain patterns around database access (with [Persistent](https://github.com/yesodweb/persistent/)), configuration, deployment (with [Keter](https://github.com/snoyberg/keter)), forms, authorisation, templating, etc, in a [Rails way](http://david.heinemeierhansson.com/2012/rails-is-omakase.html).

One of the strengths of Yesod comes from the extensively documented template projects that it ships with. Using the build tool [Stack](http://docs.haskellstack.org/en/stable/README/) from the same developer(s) as Yesod itself, getting started is as simple as `stack new foo yesod-postgres`, or the equivalent for your database of choice. That sets up development and production configuration through files and the environment, a hot-reloading development process, database models and migrations, forms and validation, file uploads, and more. When starting with Yesod I found that this let me get going quickly and learn as I went.

Unfortunately Yesod isn't perfect – I found that it was tricky to implement the exact user-experience that I was looking for in my web application while maintaining a nice separation of concerns, because of how forms and partials worked, and it felt quite complicated to get around that – at least for a relative beginner. Coming from [Django](https://www.djangoproject.com/), it looks like this is just a sign of the relative infancy of Yesod and I imagine that it will build up the necessary abstractions and hooks over time to allow for as much flexibility as Django.

The other downside I found to Yesod was that, while it dictated a good structure in the beginning, I can't see an obvious way to scale the application up as it gets increasingly complex. I can imagine it will work well up to ~100 'handlers', however much like with Rails, where the architecture develops from there onwards is left up to the developer. While it's nice to have that flexibility as an option, I prefer the Django model of encouraging how that should be done. I work on a codebase with ~1000 'handlers', and I can't imagine that being structured as nicely with Yesod, whereas in Django, those are divided up into several hundred 'apps' of ~1-10 handlers each, making each local part very understandable and easy to maintain.

### Servant

[Servant](https://haskell-servant.github.io/) is definitely not a _framework_, but instead a library for defining APIs. It allows the definition of APIs at the _type level_, which can then be used either as the client interface to a remote API, to generate Javascript client libraries, to generate documentation, or as the routing a serialisation layer in a web API you're serving. It's this last aspect where I've been using it and it has been a mix of both wonderful and difficult to use.

It's possible to create a web API that along with the endpoints it defines, also serves up Javascript and API documentation that are guaranteed correct at compile time, something that I don't think anything else can claim. The web of APIs is becoming more and more difficult to navigate, and as a service provider, hosting an API that is performant, well documented, etc is becoming increasingly difficult. Pushing a lot of this complexity off to the compiler has the potential to increase developer productivity and service reliability, and I'm very excited to see more of this sort of thing happening over the next few years.

That said, actually building a service with Servant can be tricky for a beginner. Between figuring out how to do configuration, setting up middleware for logging, creating a Monad to hold things like your database connections and so on, is a huge hurdle to overcome when starting out, and I feel like there's a lot of best practice that I've missed out on because of it. As well as this, Servant provides no hints about how to structure your application in a way that will scale beyond a couple of files. After a little trial and error I settled on an architecture of nested modules each importing their submodules' APIs and handlers, and exporting them up the chain, and that seems to be working well, but I wouldn't feel confident that I could move to another Servant based project and immediately know where to find things.

### Snap

[Snap](http://snapframework.com/) is a framework that fits somewhere alongside Yesod in terms the amount it provides and dictates but with more of an emphasis on architecture and less on the specific mechanics. A Snap-based application is composed of multiple 'snaplets' that can be nested arbitrarily, and which can hold state, provide utilities, configuration, or handle requests.

In many ways, the snaplets are similar to Django's 'apps', although with one noticeable improvement that I've noticed so far – the real nesting. In Django, apps can be nested as normal Python modules, but the namespace is still flat, meaning there can only be one "accounts" app, even if you want to do, for example, administration accounts and user accounts as separate entities. This is a nice improvement, and if I were creating a framework from scratch it would be one of my top design decisions after working with Django.

Unfortunately as with most things, there's a trade-off. While the architecture is good, Snap lacks the API safety at the type level that Servant provides, and the benefits that come from that.

### Scotty

[Scotty](https://github.com/scotty-web/scotty) aims to be the Sinatra of the Haskell world. It essentially only provides a minimal routing system and some utilities for inspecting requests and building responses. For servers that only need a single endpoint, or for rapidly serving an existing library over HTTP, I could see it as being a good fit, however it lacks a lot of the type safety, architecture, patterns, and integrations that the other frameworks provide.

### Spock

Finally, [Spock](https://www.spock.li/) is another contender on the level of Scotty, with a few additional features such as session management and type-safe routing. The type-safe routing is interesting as it handles the parsing of URL components for you, and means you can't attach a URL handler that won't accept the right type, as well as not being able to generate URLs that your application wouldn't be able to handle.

---

This isn't an exhaustive list of frameworks and libraries for web application, but from my learning so far they seem to be the most popular. Of these, I'm particularly excited about what Servant can do for the reliability of development and maintenance of APIs, and excited about Snap's architecture could scale to very large projects. Thankfully, there's a [servant-snap](https://github.com/haskell-servant/servant-snap) library in development that should provide the bestof both worlds. I'm looking forward to trying these out in a larger project in the future.
