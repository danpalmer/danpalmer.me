---
title: On Signing in with Apple
date: 2019-07-02
theme: near-white-black
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
user experience (UX), fraud, and their global market position.

## Sign in ≠ Sign up

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

#### Engineering cost

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

#### How big is this problem?

Thread needs to differentiate between sign-up and sign-in, and for historical
reasons, allows one but not the other. While this isn't going to be an
extremely common scenario, anecdotally it feels relatively common to me. I
went through a period of using "Sign in with Twitter" everywhere I could, but
this option seems to have gone out of fashion, and I am finding that I have to
hunt for these options more and more, where they have been superseded by
Facebook and Google, the two clearly dominant social sign-in providers.

Authentication is hard, even if you outsource the problem to social sign-in
providers. This means authentication systems stick around for a long time.
Given how they are used and the relatively uncommon practice of getting users
to reconfigure their authentication, they tend to accumulate code paths that
have to be supported for a long time to come. I'm willing to bet that many
companies are not in a position to change their authentication situation, and
that a significant number are in the process of phasing out some options.

#### Isn't _removing_ Facebook sign-in exactly what Apple wants?

Yes and no. They ultimately want to sell more Apple devices. One method of
doing that is creating more lock-in, which "Sign in with Apple" will do. The
other method is by pushing their brand, and their current favourite way of
doing this is emphasising the privacy benefit.

I don't believe that forcing companies with existing users to remove Facebook
_sign-in_ (assuming they don't offer _sign-up_) does either of these. It
doesn't create more lock-in because it's not introducing Apple's SSO, but more
importantly I don't believe it really enhances user privacy. There are three
main points at which Facebook receive information from a social sign-in: at
sign-up, at the point the app/site/service registers an account conversion
with Facebook, and at re-authentication time when the user signs in again.
It's very likely that the first two have already happened by this point, and
they contain the bulk of the interesting data – Facebook knows that you use
the app, they know all the data about you that the app chose to share when
marking you as "converted", they likely know where you came from to install
the app or sign up for an account (i.e. the marketing channel).

#### What this means for customers

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

## Fighting Fraud

## Why would I sign in with Apple?

When discussing Apple with people I like to joke that they make products for
Phil Schiller. They make products for that target well off, 35-55 year-olds,
with a few kids and a dog, who work white-collar jobs, use a Mac at work,
commute in a car, and live on one of the coasts of the USA.

The last part is what really matters here. Apple has a bigger market share, as
well as more respect and brand awareness in the USA than here in Europe, and
from what I understand the same is true for India, China, Africa, or pretty
much everywhere that is not North America. Most of my friends, family, and
colleagues do not use an iPhone, most people don't have Macs.

I think it's very reasonable for an iPhone user to choose to "Sign in with
Apple" on that phone. When that same user visits a website does it make sense
for them to do the same? I don't think so. Apple's suggestion is that it's
convenient because they will already be signed in to their Apple device, but
if they aren't on an Apple device it's unlikey they would be signed in to
Apple – whereas it's relatively likely that they would be signed in to
Facebook or Google.

That's for a user who uses an iPhone and perhaps understands the Apple
ecosystem, but what about an Android user, on a Windows computer, browsing in
Chrome? This is probably the largest segment of desktop users. These users are
unlikely to have Apple accounts, unlikely to be signed in to them, and
unlikely to understand why that would even be an option on a website. Facebook
makes sense, they've just followed an advert from there, and Google makes
sense – they're browsing the web using Google Chrome and signed in to YouTube
after all, but Apple? What's that doing here?

This confusion is going to hit a significant number of users. Even for those
who understand the web, authentication, tech companies, etc, "Sign in with
Apple" appearing around the web is likely to cause momentary confusion, and
most users do not understand the web at that level.

This doesn't even begin to address the confusion of a "Sign in with Apple"
button in an app on Android.

The simple solution would be to only include the Apple SSO option on iOS, but
for almost all services that have the notion of an account, users are going to
expect that this account works everywhere the service is available. Some
services may choose to go with this strategy anyway, but may be risking some
other poor user experiences, such as a user signing up on Android with the
same email address associated with their Apple SSO account that they can't log
in with, because they have replaced their iPhone with and Android phone.

#### Why does this matter?

This matters because it's a bad user experience. Anything that causes doubt or
confusion in a user's mind, and distracts them from the job they are looking
to do with your app/site/service is a bad experience for them.

More than this though, this confusion can be damaging to a business. As
mentioned earlier, we A/B tested Facebook login in our registration process
and found that it was a positive change to remove it. It's possible that
adding "Sign in with Apple" would reduce the number of users signing up, and
even a small reduction at a point in the customer journey as this could mean a
noticeable change in the business. These changes will vary from business to
business, but this is something that businesses should be able to choose, to
experiment with, and to be in control of.

---

## Next steps

While I'm excited about the future of "Sign in with Apple", and keen for the
privacy enhancing properties that it may bring to many apps, I'm concerned
that Apple has not given enough thought to how it interacts with the complex
ecosystem of authentication, fraud checks, and what the user experience will
be for most people.

I would have liked for Apple to launch this as a purely opt-in service for the
first year or so, to see how it is adopted and to work with those in the
community who depend on email addresses for fraud detection to explore other
options that may prevent the need for passing an email address through every
third party, but could retain the same behaviour.

Since this is unfortunately not the direction they have chosen, I would like
to see the following from Apple, all of which I feel are aligned with their
ultimate goals:

- Distinguish between signing _in_ and signing _up_, "[grandfather
  in](https://en.wikipedia.org/wiki/Grandfather_clause)" any accounts that
  are not created on iOS, allowing them to continue to sign in, without the
  app or service being required to adopt Apple's SSO.

- Allow apps to use social sign-ins, without adopting Apple's SSO, when the
  purpose of the sign-in is to convert the account into a non-social
  account, allowing apps a migration path away from social sign-in instead
  of requiring the adoption of Apple's SSO.

- Allow apps to _require_ a real email address at sign-up, perhaps if they
  can justify it in the app review process, perhaps requiring the developer
  to provide a textual description of why that can be shown to the user.

- Provide apps an easy way to request a real email address, to "upgrade"
  from the Apple private email address, after account creation.

These would address my concerns for whether Thread will be able to use "Sign
in with Apple", and whether it will create a better user experience for our
customers, instead of making Thread more difficult to use. However these are
only _our_ issues, and I would urge Apple consider more of the nuances of the
ecosystem before putting strict requirements on third party developers that
could harm their businesses, and worsen user experience across iOS, the web,
and all other platforms.
