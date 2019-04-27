---
date: '2013-06-04'
layout: post
redirect_from:
- /2013/06/initial-thoughts-on-android-development
slug: initial-thoughts-on-android-development
title: Initial Thoughts on Android Development
---

I've been writing Mac OS and iOS apps for a while now and while I haven't got a massive amount of professional experience with it, I feel I understand the core concepts quite well. However, despite having written a fair amount of Java in the past I've never attempted Android development.

After a very interesting, and promising I/O, I thought I'd give it a go.

- - -

The first experience is not a good one. It's a very opaque system, with lots of Java and XML that links together in what so far appear to be unintuitive ways. Obviously I'm coming at it as a Cocoa developer, so to a degree I'm just not used to it, but I think some of the concepts are inherently more difficult to understand.

An example of this is the view hierarchy. In iOS and on OS X, apps have a window, and within a window they have views, whereas on Android there are Activities which appear to be broadly equivalent to windows (except it is usual to have several of these), views which are equivalent to views, but also Fragments somewhere in the middle. Working out the granularity of how the user interface should be composed appears to be much more difficult on Android, with initial decisions affecting architecture heavily later on.

Another difficulty is the IDE. While I am told Andriod Studio is far better than the previous options, compared to the simplicity (without sacrificing power) and polish of Xcode, it's still a world apart. I can see the attraction of some of the more advanced features in the IntelliJ core of the IDE, but they come at a cost that isn't worth it for me, yet. Perhaps as I get used to them I might come to appreciate them more.

- - -

However it's not all bad. I must admit that most of my dislike so far has come from not being used to the development style, and my attitude of 'jump staight in and have a go without reading the documentation'. But since thinking about it more objectively, I think the way Android applications are written is much better than on iOS.

When writing an iOS app, it very much feels like you are writing a big black box that no one else can see inside. You can stucture things however you like, and when it runs, it is a single thing operating by itself. Conversely, when writing an Android app, it feels like writing a series of individual units which the operating system will compose together, along with a few of it's own, to form the app that users see.

While the learning curve for iOS much smaller (apart from Objective-C's *beautiful* syntax), it seems to me that Android apps which are properly engineered will be very elegant, and far more versatile than their iOS counterparts.

Let's look at an example of this. On iOS, when you want to move to a new 'view controller', you instantiate it, set any attributes you need to, and then push it on to the navigation stack. Nice and easy, but what if you want to expose that view controller to other applications? Currently there is no way of doing this. It is rumored for iOS 7, but due to the architecture of iOS apps, I doubt it's just going to be a drop in solution, and it's probably going to need some fundamental changes to the application lifecycle.

Compare this to Android. To launch a new 'activity', broadly analogous to a view controller, you must create an 'intent', which contains the *class* you wish to use, not an instance, and possibly serialised forms of the arguments it should be given. The power of this is that the activity doesn't need to be in your application, and since the OS is controlling the instantiation and transition, there are possibilities for much more optimisation, and also a system wide navigation stack that works between applications. This is a far more elegant way of handling inter-app navigation than [x-callback-url://](http://x-callback-url.com/). The collaboration between developers in the iOS community over URL schemes is amazing, just think what could be done with real application interoperability.

- - -

Another area that I think Android has nailed is user interfaces. On iOS you have the option of using Interface Builder to build interfaces graphically, which generates some unreadable and nasty XML behind the scenes or you can construct them all in code. Most experienced developers avoid IB as much as possible for a wide variety of reasons, but on Android it appears to be the accepted way of creating interfaces.

The other thing that was very interesting to me was the approach to interface layout on Android. Most Mac and iOS developers will be aware of Auto-Layout, a recent API from Apple for specifying relations between components on the screen so that layout is calculated automatically based on the content (for example text fields with more text can push other components away). I have tried this a few times, and so far it seems to have limited use. For a start, it doesn't work in table views, or at least not with a lot of pain, and also it has received much criticism for being unintuitive and difficult to use in Interface Builder.

On Android, layouts can be done in several ways, but *relative* layouts are essentially the same idea as Auto-Layout, but they just work. The developer has lots of control, it's easy to express the layouts for anyone who has used CSS margins and padding before, and I have yet to find an interface that isn't straightforward to build with it. Also, relative layouts were introduced in Android 1.0.

- - -

I think a lot of Apple fans are very quick to rule out Android, and in particular a lot of developers for Apple devices are quick to criticise Android development. Developing for the two platforms is *very* different. Google took on a lot of Java design patterns in Android, and with all the generic interfaces and [AbstractSingletonProxyFactoryBean][1]s, it's a lot more difficult than iOS. But Apple's technology isn't all shiny. Some of the concepts in iOS come from the NeXT days, and others are clearly far less mature than their Android counterparts.

iOS is quite good for beginners, in many ways, but many of the developers I know who have been developing for the platform for years now are pushing up against the limits of what is possible. The explosion of apps supporting callback URLs is an example of this, but it's also an issue with Apple's developer support systems. iTunes connect and the control developers have over releases just aren't up to what a serious company with many thousands of users needs. While the learning curve for Android might be steeper, once you are an established developer, I can see the road ahead being easier.

WWDC is going to be interesting as iOS 7 is likely to be announced. I look forward to seeing what changes Apple have made beyond a new interface. They might have been in the lead since the iPhone revolutionised the smartphone industry, but Google have spent their time building a solid foundation for future development, and it is only just starting to pay off.

[1]: http://static.springsource.org/spring/docs/2.5.x/api/org/springframework/aop/framework/AbstractSingletonProxyFactoryBean.html