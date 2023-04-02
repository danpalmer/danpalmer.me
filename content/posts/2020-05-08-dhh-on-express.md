---
title: Is this what modern web development is?
date: 2020-05-08
featured: true
---

During GitHub's annual product announcement on Wednesday, new features to edit
code online were demoed. At one point a code snippet was shown from a toy
web-app, written in Javascript using the Express server library.

Here's the code sample...

![Code sample, written in Javascript, of simple one-file Express-based server for a CRUD web-app.](/posts/images/express-code-sample.png)

After the announcement, David Heinemeier Hansson (DHH), the creator of
Ruby-on-Rails gave his thoughts on Twitter.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Is this really what modern web app development looks like to people these days? We truly are living through the dark ages. The boiler plating, the low-level distractions, the raw pool handling + sql, the configuration situps. Lordy. <a href="https://t.co/1sEhWV6il1">pic.twitter.com/1sEhWV6il1</a></p>&mdash; DHH (@dhh) <a href="https://twitter.com/dhh/status/1258074299337826304?ref_src=twsrc%5Etfw">May 6, 2020</a></blockquote>

This attracted a lot of commentary from others...

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">idk what is &quot;dark ages&quot; about access to more powerful and capable APIs, which are more suited towards real-time, low-latency services.<br><br>I&#39;ve used both Ruby on Rails and Node.js professionally before. It&#39;s not even close. Rails is child&#39;s toy compared to Node.js.</p>&mdash; Andrew Kelley (@andy_kelley) <a href="https://twitter.com/andy_kelley/status/1258085472104054789?ref_src=twsrc%5Etfw">May 6, 2020</a></blockquote>

...and...

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I used express and Sinatra in production for years, they are great for API servers. They are inherently less complex hence more performant and easier to debug. You can still build layers of abstractions for your data layer but it&#39;s an opt-in. <a href="https://t.co/djl8ZvK6ro">https://t.co/djl8ZvK6ro</a></p>&mdash; Jaana Dogan (@rakyll) <a href="https://twitter.com/rakyll/status/1258749557405446146?ref_src=twsrc%5Etfw">May 8, 2020</a></blockquote>

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Of course tweets aren't long enough to have a balanced discussion about this, so
let's break down in longer form why this code is so controversial and debate
whether it should be how we're developing modern web apps.

---

### What's wrong with Express and Javascript

DHH is right to point out that this code is handling a database pool, doing SQL
templating and has low-level HTTP server configuration in it. While these are
all things necessary for a production service, having them at the same level as
the application business logic is usually a bad idea. Separating different
levels of the stack into levels of abstraction, and keeping them somewhat
separate usually leads to more manageable and testable code.

The Javascript ecosystem is missing some of the abstractions that are common in
the Ruby ecosystem that DHH comes from (or the Python ecosystem that I'm more
familiar with). In my experience, to achieve the level of capability provided
out of the box by Rails or Django requires many Javascript libraries, a
significant amount of glue code, and extensive testing, and the end result will
be a much more brittle and less coherent developer experience.

### Why this doesn't matter

But I think DHH misses the point – that this code sample is almost all the code
for this application. Express is great for these sorts of "single file"
applications. Separation of concerns is important to help developers keep the
relevant parts of a system in their head, but if the whole system fits in their
head at once because it's ~10s of lines long, then anything more is
over-engineering and likely to create more problems than it solves.

Rails and Django provide many features that all work well together: routing,
database access, cache access, session management, upload management, storage,
logging, email, input validation, security, administration, sitemaps, session
messaging, templating, and more.

Express doesn't do many of these, at its core it pretty much only does the
routing – everything else is some form of add-on. When you need all of those
aspects that's a problem, but if you only need two or three, then it's quite
possible that with Express you'll end up with a simpler system that works just
as well. As Jaana Dogan says in her tweet above, you can build only what you
need, and will end up with a more understandable and performant system.

As we move to more use of "microservices", or focused API driven backends, more
and more applications will be a good fit for this style.

DHH is coming to the debate with a bias – he builds Basecamp, a large and
complex monolithic web application that likely uses all of the above aspects and
more. In fact Basecamp is complex enough that DHH created Rails specifically to
handle this use case. If Basecamp was built with Express it would likely be a
mess, but because Rails provides solid, and importantly, _consistent_
foundation, I'm sure it's much more manageable.

So is the Express example a bad example? No. For a small and simple web app it's
reasonable, and for focused APIs and microservices that only need a few aspects
mentioned above it's ideal. Those apps of significant complexity will get plenty
of value out of a framework like Rails or Django, but simpler apps will likely
benefit from the lower level design of Express or the buffet-style Javascript
ecosystem where you can pick and choose which technologies you actually need.

### Why the hate for Rails?

So why did DHH see so much backlash against the approach that Rails takes? I
think it comes down to the monolithic framework style of Rails (and again of
Django).

These frameworks decide up-front how things are going to work, and then build a
lot of abstractions on top. Rails is (in)famous for its domain-specific language
style of writing routing logic, database queries, access control, and more.

```ruby
def new
  @article = Article.new
end

def create
  @article = Article.new(article_params)

  if @article.save
    redirect_to @article
  else
    render 'new'
  end
end
```

Here's an example of what code can look like in a Rails "controller" (an Express
"handler", a Django "view").

This happens to support returning validation errors back to the client, it uses
named routing so that it doesn't rely on the exact URLs which is good practice
in large apps. There's no SQL, and the ability to use SQL-injection attacks is
largely mitigated. It can support default values for fields, and permissions and
all sorts of other functionality.

This is great, but there's a lot of "magic". You can't see most of this
functionality, and that means you have to just know that it's happening. Django
is slightly less magic, but still does a lot of this for you, compared to
Express or similar libraries, it's roughly the same approach as Rails.

The reason that there was so much backlash is that because of this magic,
monolithic frameworks have a reputation for being inflexible and therefore slow
to adopt modern technologies (I believe this is what Andrew Kelley was referring
to in his tweet above).

This is partially true. In Python there's a move towards doing I/O in async
operations to get higher throughput in applications. This is a complex change
and so Django doesn't yet support this, despite many smaller Express-style
libraries supporting it already.

### Why still use Rails today?

While Rails (and Django) may look like a slightly dated ecosystem, and while
much of the web development discourse is trending towards microservices, there
are many reasons why it's still a great option today.

Slower moving doesn't necessarily mean old and dated. It can mean stable and
mature. The Javascript ecosystem moves quickly, and while it's good to get
access to cutting edge technology, much of this movement often ends up being
busy-work rather than truly value creating for the end product.

I also think that it's possible to move faster as a developer with Rails.
This _really_ depends on what problem you're solving, but for your average
Create-Retrieve-Update-Delete (CRUD) web application, it's normally more
productive to think at a higher level than concatenating SQL and managing
connection pools, instead thinking about relationships between objects that your
user understands, and how the user experience (UX) of your application can be
affected by the workflow you're developing. Rails is much higher level than
Express, and as a result it's often possible to build and ship much quicker. Not
everything is a CRUD application, but most web apps are at their core, or at
least contain significant amounts of CRUD style code even if it's not their
primary purpose.

Lastly, I mentioned before that Django in particular was inflexible and slow to
adopt new technologies, but this is only partially true. One of the things that
comes with the maturity of Django (and I'm sure Rails as well) is how extensible
it is. _Many_ parts of Django can be extended to support new technologies, and
there are hooks into many parts of the Django stack to customise how it works.
This extensibility isn't just though the sorts of plugins and middleware that
Express supports, but also through allowing the developer to specify the objects
used to mediate access to almost anything, or through regular class inheritance
and extension of almost anything in Django – a level of extensibility that is
rare in the Javascript ecosystem. This is one of the things that makes it so
suitable for large codebases – it's possible to solve _most_ problems in it in
some way, without starting from scratch.

---

I hope this post sheds some light on the controversial opinions shared on
Twitter. No one was wrong, but everyone brought their biases of what they're
used to working on and the way they prefer to write applications.

There is no right answer here. Express (... Sinatra, Flask, and others) are
much simpler and that can often be of great benefit to certain kinds of
application, but the simple stuff can take a little extra time and in big
codebases it's easy to become unmanageable. Rails (... Django, Phoenix, and
others) make most simple things very quick to do and easy to understand, while
preserving the power for the developer to extend and override, but are unlikely
to be the first to get cutting edge features and may bring more than is needed
for simple applications.
