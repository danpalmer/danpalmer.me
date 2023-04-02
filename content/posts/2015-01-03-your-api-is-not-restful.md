---
date: 2015-01-03
layout: post
preview:
  RESTful APIs are a popular thing, but is anyone really doing it properly?
  This post highlights some common flaws in RESTful APIs, and explains why it's important
  that we improve them beyond the current standard.
redirect_from:
  - /2015/01/your-api-is-not-restful
slug: your-api-is-not-restful
title: Your API is not RESTful
featured: true
---

This is a post that I have been meaning to write for quite a while. 3 years ago, during an internship I was introduced to the concept of a RESTful web service, while integrating with various APIs such as those provided by Amazon S3, CloudApp, and several others. I ended up writing very similar, code for each, but there were enough differences, the authentication mechanism, where it wanted files uploaded, and so on, that meant each had to be implemented separately, with little code re-use. However, I learnt that this shouldn't be the case.

If you looked at the documentation for APIs that called themselves 'RESTful', you'd be forgiven for thinking that it means they are delivered over HTTP, and talk in JSON. That's the extent of the commonalities between most RESTful web services.

However, this is very far from what REST (Representation State Transfer) is designed to be. In fact REST was developed by Roy Fielding as part of his Phd thesis, as a response to the very wide variety of ways networked services would communicate.

### What does it mean to be RESTful?

REST defined 6 constraints for services:

1. There are clients and servers, separated by API boundaries over a network. Clients take care of presentation, servers take care of logic and storage.
2. Communication is stateless, every request contains all the information required to service that request.
3. Messages are cacheable by the server, client, or any proxy in between, or when not appropriate, mark themselves as not cacheable.
4. A client cannot tell whether it is connected directly to the source of the service, there can be any number of layers in between, facilitating load balancing, caching, and more.
5. Additional code for presentation is provided to the client on demand.
6. Data and functionality are accessed through a uniform interface.

With the way the internet, and HTTP work, we (mostly) get 1 through 5 for free when developing networked APIs. The internet is client-server, HTTP has caching semantics, is stateless (except at the application level sometimes) and applications deliver JavaScript on demand to aid in presentation.

The difficult bit is the uniform interface, and this is where so many developers trip up. This constrain is typically broken down into 4 separate sub-constraints:

1. Uniform identification of resources, both in URIs on the web, and in representation format, such as JSON/XML.
2. Manipulation through resource representations and their attached metadata.
3. Messages are self-descriptive, including enough information to know how to use them, for example with MIME types.
4. Hypermedia as the Engine of Application State.

### Hypermedia as the Engine of Application State

This is the crux of why most "RESTful" APIs are not actually RESTful. In order to evaluate whether an API is using 'HATEOAS', we can ask the question – "What do I need to know in advance to use this service?". The correct answer is the domain, and the protocol. That's all. Given that information, it should be possible to fully explore everything the service has to offer.

If we think about it, this is exactly how the web works. To use "Amazon", I have to know that it lives at `amazon.com`, and that I can communicate with it over HTTP. To browse the service, I can load up `amazon.com`, and it will present me with a range of links to other resources I can go to, for example Books and DVDs, and a list of actions I can take as forms, such as searching or logging in. I didn't need any documentation to tell me that to search I had to go to `/search?q=something`, and I didn't need to be told that books were at `/products/books`.

How many APIs do this? Most have a documentation site that lists all of the types of resource and actions that can be performed. But when I `GET` the root of the service domain, the service doesn't provide hyperlinks to navigate its data and functionality, and resources don't contain URIs for related resources, instead relying on application specific identifiers, such as an `id` or `username` field, that must be supported by the client.

### Richardson Maturity Model

This is a simple way of evaluating how RESTful a web service is. It's not perfect, and it assumes most of the constraints simply because they are guaranteed by the web architecture, but it's a good indicator. The model has 3 levels (and 0 – not really RESTful in any meaningful way).

1. **Resources** – rather than using RPC on a single endpoint, data is broken out into separate resources, at separate locations. Communication is not method names and arguments, but instead the resources being manipulated.
2. **HTTP Verbs** – rather than using HTTP `POST` for everything (as was the standard for SOAP APIs over HTTP for a while), we use `GET`, `POST`, `PUT` and `DELETE` as appropriate. `GET` is idempotent, `POST` creates a new resource in a collection, `PUT` updates a resource, and `DELETE` deletes it.
3. **Hypermedia** – resources contain links to related resources and collections, and also links to perform actions on the resources themselves. APIs are now _self-documenting_ and _discoverable_.

Each level is a condition for the next, so the only way for a service to qualify for level 3 is for it to also support levels 1 and 2.

### RESTful Web Services

Let's look at a few examples. Take [Mandrill](https://mandrillapp.com/api/docs) for example. This API claims to be "mostly RESTful", but it's barely RESTful at all.

- Endpoints are _functions_ in a Remote Procedure Call style, not resources, meaning that to get a user you 'call' `info`, providing an argument of a user ID, rather than performing a `GET` on a resource of `/user/:id`. This fails level 1 of the maturity model.
- All requests must be HTTP `POST`, therefore failing level 2.
- There are no links, and no self-documentation in responses about actions that can be taken, therefore failing level 3.

The Mandrill API is RESTful only in that it works over the web, and therefore satisfies many of the constraints automatically. Nothing at the level of the application itself is RESTful, it is instead just an RPC API that communicates in JSON.

Perhaps the new Digital Ocean API will be better? They make bold claims about it being "fully RESTful", even linking to the [Wikipedia article for REST](https://en.wikipedia.org/wiki/Representational_state_transfer), to back up their claims. However, although it uses HTTP methods properly, returns correct status codes, and has good documentation, there are no hypermedia controls, and little support for generic REST clients.

Twitter's REST API was one of the first major APIs to make REST 'trendy', at least in terms of popularity and widespread use. However on closer inspection it's not particularly RESTful.

- Endpoints are resources, so the API passes level 1.
- HTTP verbs are used, although whether their usage is good practice or not is up for debate. For example, to delete a tweet, a `POST` request must be issued to `/statuses/destroy/:id`, therefore encoding the action in the URI rather than the verb. Perhaps a better way would be to issue a `DELETE` to `/statuses/:id`. The API arguably fails level 2.
- There are no links, and no self-documentation in responses, so the API fails level 3 entirely.

### Why be _fully_ RESTful?

The current state of Web APIs is fundamentally broken. The 'officially supported' way of accessing many APIs is to use one of usually half a dozen client libraries created by the service provider, or to read the documentation and construct your own. If, as is often the case, a library is not provided for your language, and any third party versions aren't in active development, or the documentation is lacking, then making full use of the API's abilities is often not possible. When the libraries do exist, they all do essentially the same thing: they make web requests, and based on the data they receive, they figure out how to make more requests.

If this doesn't sound like a bad state of affairs, imagine what it would be like if each website published their own browser, that you had to use to browse the site, just because they have decided to publish content in different formats, or have an obscure and proprietary way of linking to other content.

Some client libraries published by API providers claim additional features (over what your own implementation might have) such as smart caching, performance enhancements for slow connections on mobile data, and 'live' connections. But all of these are possible with open web standards, and a well written _generic_ REST library could support all of them and more, for any service that provided full REST support.

Imagine the following:

- Writing an application that consumed many web services, and all the implementation specific code you had to write was the list of links you wanted to traverse.
- Not having to re-write or update your library when changes were made to the API, being able to take advantage of performance improvements in the API with no additional development.
- Querying a web service being no different to using an ORM to query your database, even across services from multiple providers.

All of this is possible. We don't yet have all the standards we need, but they aren't going to come about until developers are actively using, providing, and requesting REST APIs.

##### Related Resources

- [Richardson Maturity Model](http://martinfowler.com/articles/richardsonMaturityModel.html)
- [Wikipedia – Representation State Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [Roy Fielding's Thesis – Architectural Styles and
  the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) - [Chapter 5 – Representation State Transfer](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
