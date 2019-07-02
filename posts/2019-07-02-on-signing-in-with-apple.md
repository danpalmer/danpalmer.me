---
title: On Signing in with Apple
date: 2019-07-02
theme: theme-near-white-black
---

Last month at their annual Worldwide Developers Conference (WWDC), one of
Apple's most low key, but potentially high impact announcements was "Sign in
with Apple". Built to compete with Facebook, and Google's social-sign-on
offerings, Apple's SSO will eschew control over the data and analytics that
its competitors are grasping for in favour of a privacy preserving design
intended to advance Apple's pro-privacy stance and, ultimately, bring more
value to the Apple ecosystem and sell more devices.

This by itself feel like another of Apple's doomed service initiatives, except
that this time there's a gotcha.

> Sign In with Apple will be available for beta testing this summer. It will
> be required as an option for users in apps that support third-party sign-in
> when it is commercially available later this year.

After watching the announcement and the subsequent developer talks on the
subject, I feel that while I will enjoy using this feature as a user, as an
engineer on a service that may need to implement Apple's SSO, some of the
restrictions may have unintended consequences that mean many companies may
have to provide a worse service to customers using Apple's SSO, or may be
unable to provide the option at all.

Before I get into the details, I'd like to be up front that I am very much in
favour of companies collecting less data, and/or being explicit with customers
about what data they are collecting and why. I work for
[Thread](https://www.thread.com/), a company that collects data about our
users, but does this for the very specific purpose of improving
recommendations and therefore the quality of the user experience. We don't
sell advertising, we aren't looking for _engagement_, we only make money when
our customers are happy. We also don't sell our customers data.

As someone who cares a lot about privacy but wants to use the modern
conveniences we are able to build with the technology we have, Thread is
exactly the sort of product that I am happy to provide my data to.

Unfortunately, while Thread respects our customers privacy, Sign in with Apple
creates some issues for us that may mean we can't pass its benefits on to our
users. I believe Apple have underestimated the issues involved in identity,
UX, fraud, and their global market position.

### Sign in ≠ Sign up

The first issue I noticed was the fact that Apple do not differentiate between
"Sign in" and "Sign up". While I can understand this as a user experience goal
– that users shouldn't need to know if they have an account, they should just
be magically signed in, and while it may make sense for "utilities" like Uber
– I don't believe this matches reality for many services. For many kinds of
accounts, the transition that a user goes through when they _sign up_ is a
notable one. They go from no communication, to having communication from a
service, in the case of LinkedIn they go from not having a profile, to having
a filled out CV/Resume-like profile, or in the case of Thread they go from
having a non-personalised store to having one that only contains products that
would look good on them.

Thread, like many services, originally offered Facebook sign-up/sign-in. It's
accepted by many that this is just necessary for consumer services on the web,
however a number of years ago while optimising our registration flow, we found
that removing Facebook sign-up significantly improved the number of people
becoming customers. For this reason, we decided to remove Facebook sign-up.

However, we still had many thousands of customers that had signed up with
Facebook, who needed to be able to return and _sign in_ again with Facebook.
For this reason we kept the sign in button on our sign in page. When it came
to creating our [iOS
app](https://itunes.apple.com/app/apple-store/id966956740?pt=117711895&mt=8),
we implemented the same "Sign in with Facebook" button, omitting the _sign-up_
functionality as we had done on the web.

If someone who has not used Thread before clicks/taps the "Sign in with
Facebook" button instead of going through our regular registration process,
they receive an error message. We don't create them an account, we don't tie
any information from Facebook to their account if they do choose to sign up.

This brings us to the first problem with "Sign in with Apple".

> It will be required as an option for users in apps that support third-party
> sign-in when it is commercially available later this year.

Will it be required for us? Apple have not yet answered this question (FB6135661).

There are 3 potential solutions to this problem:

1. We implement "Sign in with Apple", likely Apple's preferred choice, but as
   we shall see later there may be other issues with this.

2. We remove "Sign in with Facebook", likely Apple's second favourite choice,
   but this prevents a significant proportion of our userbase from using the
   service _on Apple devices_.

3. Apple make allowances for "legacy" accounts, as long as new accounts are
   not created with the social logins. This is Thread's preferred choice, at
   least for the short-mid term.

We'll go into more issues with "Sign in with Apple" later, but for now let's
just clarify that a big problem with (1) is that implementing a new identity
provider is a significant engineering undertaking and shouldn't be taken
lightly.

For small companies, even with libraries and tools provided, and
support from open-source frameworks, this could represent a shift in focus
from working on creating value for the business and its customers, to chasing
Apple's requirements for little benefit. Many companies out-source app
development, so it could represent a large financial cost, or even not be
supported at all by off-the-shelf app creation tools and therefore be a
non-starter.

For larger companies, reliability, scalability and monitoring
concerns make this sort of task a large project, especially at such a core
part of the customer journey as sign-in.

Thread sits somewhere between these two, but has an additional concern of the
fact that we have never supported multiple social sign-in providers. We only
ever supported Facebook. As many engineers will know, going from 1 to "n" of
something is often a bigger job that going from 0 to 1 of it. Given we don't
want to put any more engineering time into adding more _Facebook_ users, we
certainly don't want to put a significant amount of engineering time into
adding a new SSO provider (and therefore supporting multiple account types)
just to maintain our current position.

In all likelihood, the result of this is that for a portion of our userbase,
on iOS only, we will build an account conversion flow that will take users out
to the web, have them sign in with Facebook, and then convert them to a
regular account (by setting a password), and then taking them back into the
app.

We can only hope that having Facebook sign-in on a web page, with the
only purpose of allowing non-Facebook sign-in, will be allowed by Apple.

This is obviously not a great user experience when a customer just wants to
sign in to an app and get on with their task. This poor UX already feels like
Apple are shooting themselves in the foot somewhat, and the UX will be far
worse if Apple choose not to allow apps to build this sort of upgrade flow.
Thread is lucky that we have a website where we can put this flow – many apps
don't and would have to have the flow in the app, something I have very little
hope of Apple allowing.

