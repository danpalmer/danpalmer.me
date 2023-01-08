---
title: "Activity Pub vs Web Frameworks"
date: 2023-01-08
hidden: true
---

In an attempt to self-host a low-cost fediverse node, I started with [GoToSocial][gotosocial], but later decided to switch to [Mastodon][mastodon] for better compatibility. This transition presented some challenges and got me thinking about whether existing web frameworks are well designed for linked data services.

Activity Pub, the underlying protocol for the fediverse, necessitates storing URIs to resources on other nodes in the network, and as such, even after running GoToSocial for 24 hours, there were already many links to the node. Fully preserving these links when moving from GoToSocial to Mastodon would require significant work to migrate and transform data, extend Mastodon, and/or add manual redirects to the frontend webserver.

## Background on linked data

Rather than numbers or strings used as identifiers, a core concept in linked data, and by extension, Activity Pub, is that all identifiers are URIs, that when resolved, return the identified content. In practice this means that when one piece of data (e.g. a social media post) references another piece (e.g. a user), that reference is by URI, rather than by some arbitrary identifier, and by following that URI the entity it points to is returned.

##### Example
In a typical web application we might see the following:
```json
// Post
{
    "id": 38274923842,
    "content": "Lorem ipsum dolor sit amet",
    "user": 1024,
}

// User 1024
{
    "id": 1024,
    "name": "Dan Palmer"
}
```

In a linked data application, this would instead look like...
```json
// Post
{
    "id": "https://example.social/posts/38274923842",
    "content": "Lorem ipsum dolor sit amet",
    "user": "https://example.social/users/1024",
}

// User 1024
{
    "id": "https://example.social/users/1024",
    "name": "Dan Palmer"
}
```


The main benefit of this is that following a relationship requires no additional knowledge. It's just a link, and links have well-defined semantics. The client does not need to know how to build a URI for the content it's seeking. This is of particular benefit in federated systems, where the servers are heterogenous, but all implementing the same spec.

This is a powerful design that has existed for many years with other forms of linked data, and it's great to see it take off in a new way with Activity Pub.

## URIs in REST-ish and linked data applications

Inherent in linked data specifications is that _parts_ of the URI have no semantics. In other words, there's no difference between `/users/dan` and `/929ee2ad/6a4f/42a3/b2af/4a739599c340`.

This is in direct contrast to typical REST-ish APIs that may use arbitrary identifiers. In these systems, clients _must_ understand the identifiers and how they compose into paths to be used as URIs to request content.

There are advantages to URIs such as `/users/123` – they are inherently debuggable, building monitoring based on the structure can provide insight into performance or usage analytics, and they're developer friendly. For these reasons they may still be appropriate for linked data systems, as long as they are not the source of truth for routing.

Unfortunately almost all web frameworks are designed for the REST-_ish_ applications where the client constructs URIs, and have the concept of a router based on path segments. A segment like `/users/:int` would route to a controller for the users collection, and then match an integer typically for querying from a database. This works well for REST-_ish_ APIs, but falls down when it comes to federated linked data systems.

## Challenges in for linked data applications

When migrating between systems, this difference presents a problem. Because the semantics of the URI structure differs between systems, a migration is not as simple as moving the data, because external systems will still have pointers to the old URI structure.

This issue is not limited to migrating between entire systems, but can crop up as requirements change within an existing system. It's also not limited to linked data applications, but is an old and well known issue on the web[^1] – [cool URIs don't change][cooluris].

For engineers working with the code itself this is a pain point, but not insurmountable. However for non-engineers working with applications and configuration – such as the average Mastodon or Wordpress admin – this is nearly impossible to achieve.

As Activity Pub requires the storing of URIs as identifiers on federated servers (i.e. servers storing data pointing to content on other servers), a single instance can't simply change its URI structure. Doing so would break the federation, causing data to become inconsistent. Posts would be unavailable at their identifying URI, but perhaps still cached. Users would disappear from the network, but others may still be following them. Chaos would ensue.

## Traditional solutions won't work

There are three standard solutions to preserving URIs after a structural change.

1. Do nothing, breaking links. Unfortunately common for blogs and smaller websites.
2. Hard-coded redirects. Quick and easy to do, but doesn't scale. Often requires editing code or configuration for a frontend webserver, not something in the skillset of all operators.
3. Redirects stored in a database. Often built into blogging platforms, but higher cost. Can scale far, but can be expensive to compute for every single request, and can be tricky to integrate nicely[^2],

As _everything_ is a linked data object in Activity Pub – every post, user, photo, poll, link, follow, etc – there are just too many to handle. A typical single user may generate tens of thousands of these links every year.

In order to not break federation, rendering users unable to interact with the fediverse, (1) is not an option. (2) would be unlikely to be workable for any scale, and (3) would require significant engineering effort to make a reality.

## Alternative solutions

If current web frameworks aren't ideal for linked data applications such as Activity Pub servers, perhaps there's room for a framework that addresses these issues. The main aim of a framework for linked data would be to treat URIs as atomic identifiers, potentially even with fully opaque identifiers.

For such a system there would likely be two litmus tests:
1. Can the framework function in most of the ways we'd expect from a modern web framework, but with every URI being a UUID?
2. Can arbitrary documents be imported into the framework and supported on an ongoing basis ("cool URIs don't change").

These requirements suggest that the framework would likely be _content based_, rather than _route based_ – looking up content by URI and then calling code to act on that content, rather than looking up code based on a route, and that code potentially looking up content.

Being content based implies database queries for every request as in the previously mentioned option (3), but by raising this functionality to the framework level, more optimisations may be implemented, and correctness ensured, in one place, likely resulting in a lower impact of those additional queries.

This has some knock-on effects. It would make it hard to create RPC-style APIs, but perhaps this is a benefit? There may be issues around paginated collections (how do pagination control parameters work?), but this is already a problem with specifications such as Activity Pub, where there is _no_ defined way to do pagination other than URIs to first/last/next/previous pages, and leaking the details of how query parameters work for pagination would go against the idea of opaque URIs anyway. (I'm exploring what a framework in this style would look like and the challenges associated with it.)

##### Existing solutions?

Perhaps a new framework would be re-inventing the wheel. One of the conclusions that is often reached when working through the impacts of this is that the server is necessarily relatively simple, at least compared to a typical web application. Perhaps then, the focus should be on smart _clients_, and servers should be mostly a data store.

One possible solution would be using a [triple-store][triplestore] as a source of truth (likely with metadata for permissions). An Activity Pub implementation may be little more than a triple-store with rewrites from the URI being served to a query to execute. The structure of the data could be mostly defined by the specification. (This is an area I have not dug deep into or used in production however so there may be more to it in practice.)

## Conclusion

Current web frameworks work in ways that are often ill-suited to linked data applications. This presents challenges in building, maintaining, migrating, and administrating these systems.

As Activity Pub hits the mainstream, the effects of this will become noticeable by end users, as broken links in the fediverse graph become broken user experiences in the social network.

A linked data approach to building frameworks may alleviate these issues, but more work is needed to understand the full impacts of such a framework and whether it would be a good way to build such applications.


[mastodon]: https://joinmastodon.org/
[gotosocial]: https://gotosocial.org/
[cooluris]: https://www.w3.org/Provider/Style/URI.html
[triplestore]: https://en.wikipedia.org/wiki/Triplestore
[^1]: Arguably the web _is_ a linked data system – it has links, people don't generally hand construct URIs from documentation and data on web pages, they just follow links. However this is a fairly philosophical point of debate and perhaps not useful to go into in this post.
[^2]: Typically this mechanism would be integrated using a request middleware so as to be run before routing, but would either need to return a response or route successfully. The former may mean leaving behind all existing controller infrastructure, depending on the framework,  and is therefore less than ideal, and the latter requires valid mappings between URIs which limits the ability to solve redirections.
