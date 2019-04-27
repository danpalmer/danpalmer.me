---
date: '2013-10-12'
layout: post
redirect_from:
- /2013/10/objective-c
slug: objective-c
title: Objective-C
---

If I mentioned that I like C, C++ or Python to other students on my course, or colleagues, there would be no reaction. There are things you can criticise about each one, but they are all very safe bets. When I tell people that I enjoy writing Objective-C however, they are confused and often quite hostile towards the language.

I am by no means an Objective-C expert, but I've been thinking through the reasons *why* I like it, so this is a random collection of reasons why I enjoy using the language.

- - -

#### The Syntax

The very first thing that is mentioned, every single time I talk to a non-Objective-C developer, is the syntax.

> What are all these square brackets for?
> Why do strings have an @ in front of them?

There are two possible answer to these questions. The first is that, at the time Objective-C was created in 1983, the 'C-style' syntax that most developers are so familiar with wasn't as well known and standard as we take for granted now. The syntax has been used in various froms in C, C++, Java, JavaScript, C# and arguably Perl and PHP, but of these only C pre-dates Objective-C. Simply put, Objective-C doesn't look *normal* because our concept of *normal* didn't exist when it was created.

The second answer to this is taken from Apple's documentation...

> Objective-C is a superset of the ANSI version of the C programming language and supports the same basic syntax as C.

When I first read this years ago, I read it as "You know all that C code? You can use that too!". In a way it opens up more scope for development. However I've come to realise that it can also be read as "You know all that C code? We can't conflict with that at all in the things we've added.".

Objective-C defines some extra symbols that you could have previously used in C, so that some old C code won't compile, but in terms of syntax it is a strict superset, meaning that any extra syntax that has been added will not conflict with C syntax.

Take strings for example. If a string is defined between double quotes, like in Java or C#, it's not a string object, it's a <code>char *</code>, and it must remain a <code>char *</code> for compatability.

Nowadays this compatability is less important as most Objective-C applications probably don't have 'raw C' components (apart from those in the frameworks), but 30 years ago I'm sure that was a very different case, and still today, it is common in games to write lower level code, or code that interacts directly with OpenGL in C.

Objective-C adds a number of new features to the C language, but almost all are prefixed with an <code>@</code>, so are very easy to spot, and more importantly, anything that looks like a C behaviour *is* a C behaviour and should work in exactly the same way.


#### <del>Method Calling</del> Message Passing

The most obvious difference in Objective-C to most widely used languages is its very different syntax for calling methods on objects. So why is this different?

<script src="https://gist.github.com/danpalmer/5994242.js"></script>

The first line here could be from C++, Java or any other similar language. It expresses a call to a known method on an object, that is, the compiler *knows* where in memory that method will reside, or at least will have a valid pointer to it after the linking stage of compilation.

This line essentially translates to <code>100</code> (and a few other contextual details) being put in a known location, and the processor receiving a jump instruction to the method location in memory where it will continue executing from.

The second line is Objective-C, and it's expressing a very different concept. The compiler does not know where the method is, or if it exists, and if it doesn't, it may be handled in a range of different ways.

This line translates directly into the following C function call. This function will look up the method name, called the *selector* in Objective-C terminology, at *runtime* in the method table on the *receiver* of the message, in this case <code>robot</code>.

<script src="https://gist.github.com/danpalmer/5994278.js"></script>

Once the lookup has found the method to call, it will jump into that code as in the C++ style example above. However that lookup process can be manipulated in many ways to replace methods with new implementations, redirect to other objects without the caller's knowledge, or even generate methods on the fly.

This power comes with an overhead, but caches, optimisation in the language runtime, and the fact that the code is compiling to native binaries mean that it's not as big as a fully dynamic language like Python or Ruby. At WWDC 2013 in fact, Apple engineers announced that they have reduced the 'fast-path' through `objc_msgSend` to just 11 instructions on the CPU.

##### A Side Note About 'Named Parameters'

Objective-C doesn't have 'named parameters'. In Python and Ruby you can call a method with a list of key-value pairs that act as arguments. While Objective-C method calls may at times look like this, they are in fact not.

<script src="https://gist.github.com/danpalmer/5994301.js"></script>

In this method call, there are 3 arguments: <code>someURL</code>, <code>NSURLRequestUseProtocolCachePolicy</code> and <code>60.0</code>. The *selector*, or name, of the method is <code>requestWithURL:cachePolicy:timeoutInterval:</code>. Any selector may be split up by colon delimiters, between which the arguments can be interspersed. I quite like this approach as it results in very good readability, but allows the IDE to 'know' more about the code and the parameters, because it's not as dynamic as passing a dictionary. However, it's a very different paradigm to most other languages, and arguably the style of passing named parameters that other languages take is more 'pure'.


#### Design Patterns

I've done a fair bit of Java development as part of my university course, and I think the reason it's taught so much is because it implements almost every design pattern you can imagine. This is good for teaching, but when writing code for real projects, I think constraining development possibilities a little and forcing certain patterns allows for more understandable code.

Frameworks in Objective-C use the delegate pattern a lot. In some places it might not be as appropriate as others, but it does mean that when I see an object with a 'delegate' property, I immediately know much more about how the object might be used, where to find more documentation (it will likely have a protocol in it's header file that I should implement) and how to eventually use it.

I think some of this comes down to personal preference. In Java I often find that there are too many different 'valid' ways of designing functionality which results in not knowing which direction to go down. Conversely, in JavaScript, I find there is a severe lacking of common design patterns and ways of structuring code, unless you use a very well defined framework, and in many cases I've seen this result in poor code quality, both from myself and others. For me, Objective-C is a pretty good point in the middle.


#### APIs

Much of the relative ease or difficulty of using a 'language' is actually down to the APIs provided within the standard library, or available libraries and frameworks from the community.

I have found the APIs to be very well designed, and designed to suit the language and it's strengths and design patterns. The delegate pattern is used a considerable amount throughout the frameworks on OS X and iOS, and makes it very easy to do common tasks like getting data into list views, something I found noticeably more difficult on Android in Java.

I understand that a language is not it's APIs, but in so many real-world uses, they might as well be the same thing. Until very recently with the work [Xamarin](http://xamarin.com/) are doing, writing C# meant using .NET for almost all C# developers, Javascript commonly gets confused with jQuery and Node.js, and the widespread success of Ruby was at least in the beginning of its popularity, down to Rails.

One API I am a big fan of is *Grand Central Dispatch*. This is an open source library developed by Apple for handling asynchronous and background task queues in Objective-C. It's by far the easiest threading system I've used in a language, and only languages with built in primitives for similar functionality (like Go's goroutines) provide better implementations from what I've seen so far.

<script src="https://gist.github.com/danpalmer/5994709.js"></script>

Here I've created a concurrent queue, added 50 'processing jobs' to it, and added a 'barrier' to be executed at the end. This prints out the following:

```
Finished Dispatch
Continuing Execution
Block 1 finished
Block 2 finished
...
Block n finished
Completed
```
<br/>
The blocks may not execute in order, but we can know when all of them have finished executing. Crucially, this process takes just over 3 seconds to run, because grand central dispatch is able to move on to other processing when blocks call `sleep`, and return to them once they need to continue processing.

Similar things are possible in many languages and with many different libraries, but I've rarely found them to be as powerful as this for the ease of use. The equivalent in Java, using thread pools, requires considerably more manual setup.


#### Open-Source Community

I've now spent a reasonable amount of time working with code from the C#, JavaScript (Node.js) and Objective-C communities.

Working with libraries in C# it felt like many developers were perpetuating the Microsoft licencing model and a less agile development model. Paid libraries are a very common thing, and everything wants XML configuration, everything is designed to work across a dev team, testing team, and deployment team, with no one having to recompile the source. This is great for large enterprises working in a waterfall-like development process, but when you're a single developer or on a small team, it's not required, and instead creates a large learning overhead.

The JavaScript community was better in many ways I felt. But there are a large number of packages in NPM, the Node.js package manager, which are terribly written and give no thought to production usage or reliability. I think this comes from the fact that it's a much younger development community, both in terms of the time Node.js has been around, and also the experience that developers have.

The Objective-C community appears to fall somewhere in the middle. The popular CocoaPods system has a fairly large number of open source libraries now available on it, and I'm often impressed with them for several reasons. Firstly there are some very experienced, very good developers, out there in the community. But also everyone seems to take inspiration from Apple's frameworks in creating easy to use, but powerful APIs, often achieving better results than Apple themselves. I feel like there's a serious commitment to quality in the community.

- - -

#### Some Things I Don't Like

Objective-C is very old, and recently programming has been moving in a more declarative direction. Technologies like QtQuick which is used to develop applications on Ubuntu Touch are far ahead of languages like C# and Java, and possibly even further ahead of Objective-C. C# and Java both have Attributes/Annotations which are a really great way to reuse code, make code more readable, and abstract away implementation details. The AutoLayout APIs on Mac OS and iOS are possibly a hint at moving in this direction, but are still a long way off.

For me, it's becoming more noticeable that Objective-C lacks namespaces. Apple are working towards this, but we're probably still 2 years off being able to create our own namespaces/packages.

The standard Foundation and Cocoa libraries are lacking features that I would really like. String, array and dictionary manipulation aren't as good as they could be, and while the community are doing some great stuff to help with this, like [NSString+Ruby](https://github.com/zdavison/NSString-Ruby), and while the language provides features, like categories, that make these features easy enough to add, I think some more data manipulation and functional programming style methods would be a really nice thing to have in the standard classes.

- - -

### Conclusion

Objective-C is an old language, and I believe many of the differences that programmers often dislike about it stem from the fact it doesn't follow the 'modern' practices that they are used to, probably because it came before those practices became the norm. But is that really a bad thing?

In the case of missing features like namespaces, it probably is, but these features are coming more quickly now that the language has experienced a sharp uptake, so I'm not sure they will remain missing for long. As for not following the standard practices, with the rise in popularity of languages like Scala, Clojure, Go or even Javascript, I think the standard practices of C++ and Java are becoming less and less relevant.