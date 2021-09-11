---
title: Design Issues of Sign in with Apple
date: 2019-07-05
theme: sign-in-with-apple
hidden: false
featured: true
---

Last month at their annual Worldwide Developers Conference (WWDC), most
interesting announcements was **Sign in with Apple**. Built to compete with
Facebook and Google's single-sign-on (or social sign-on, SSO) offerings,
Apple's SSO will eschew control over the data and analytics that its
competitors seek in favour of a privacy preserving design intended to advance
Apple's pro-privacy stance and ultimately to sell more devices by bringing
more value to the Apple ecosystem.

By itself this feels like another of Apple's forays into the world of
developer services, where Apple Maps, MusicKit, and others appear to have had
limited impact. This time however could be different as Apple will be forcing
it upon many apps and services through their AppStore requirements.

> **Sign In with Apple** will be available for beta testing this summer. It
> will be required as an option for users in apps that support third-party
> sign-in when it is commercially available later this year.

Having watched the announcement and the subsequent developer talks on the
subject I feel that while I will enjoy using this feature as a user, as an
engineer on a service that may need to implement it, some of the restrictions
may have unintended consequences that mean companies may end up providing a
worse user experience (UX) to customers using Apple's SSO, or may be unable to
provide the option at all, which could result in tricky conflicts with Apple's
new requirement.

After thinking about **Sign in with Apple** in the context of
[Thread](https://www.thread.com/) (the product I work on) I suspect that it
will end up being a blunt tool, where the design and policy choices made to
enhance privacy end up restricting the user experience with no privacy gain.
The opinion that Apple seem to be pushing with their SSO service is that data
sharing is bad, ignoring and impeding the cases where, with informed user
consent, it can be a powerful tool on the modern web. I also believe that
Apple are viewing the user experience through a US focus, where in the global
service marketplace their position is far less strong, and **Sign in with
Apple** could be a confusing concept to many.

---

## Sign in ≠ Sign up

The first issue to cover is the lack of differentiation between "Sign in" and
"Sign up". While it is understandable as a user experience goal—that that
users shouldn't need to know if they have an account and should just be
magically signed in when needed, and while it may make sense for "utilities"
like Uber, I don't believe this pattern works for all services.

For many kinds of accounts, the transition that a user goes through when they
_sign up_ is important to them. They go from no communication, to having
communication from a service. In the case of LinkedIn they go from not having
a profile, to having a filled out CV/Resume-like profile after filling out
their profile to achieve 100%. In the case of Thread they go from having a
non-personalised store to having one that only contains products that would
look good on them, after indicating which styles of outfit they like.

#### Thread ⨉ Facebook

Thread, like many services, originally offered Facebook as a way to
authenticate in our sign-up and sign-in flows. It's accepted by many that this
is just necessary for consumer services on the web, however a number of years
ago while optimising our registration flow, we found that removing Facebook
sign-up significantly improved the number of people becoming customers[^1].
For this reason, we decided to remove Facebook sign-up.

However we still have many thousands of customers that _signed up_ with
Facebook, and who needed to be able to return and _sign in_ again. For this
reason we still have the **Sign in with Facebook** button on our sign in page.
When it came to creating our [iOS
app](https://itunes.apple.com/app/apple-store/id966956740?pt=117711895&mt=8),
we implemented the same **Sign in with Facebook** button on the sign-in
screen, omitting it from our _sign-up_ flow as we had done on the web. If
someone who has not used Thread before clicks/taps the **Sign in with
Facebook** button instead of going through our regular registration process,
they receive an error message. We don't create them an account, we don't tie
any information from Facebook to their account if they do choose to sign up.

This brings us to the first problem with **Sign in with Apple**.

> It will be required as an option for users in apps that support third-party
> sign-in when it is commercially available later this year.

Will it be required for Thread? Apple have not yet answered this question in
their documentation, nor have they responded to a request for clarification
(FB6135661).

There are three potential solutions to this problem:

1. Apple make allowances for "legacy" accounts, as long as new accounts are
   not created with the social logins. This is Thread's preferred choice, at
   least for the short-mid term.

2. We implement **Sign in with Apple**, likely Apple's preferred choice, but
   as we shall see later there may be other issues with this.

3. We remove **Sign in with Facebook**, likely Apple's second favourite
   choice, but this prevents a significant proportion of our userbase from
   using the service _on Apple devices_.

#### Engineering cost

We'll go into more issues with **Sign in with Apple** later, but for now it's
worth mentioning that a major issue with (2) above is that implementing a new
identity provider is a significant engineering undertaking.

For small companies, even with libraries and tools provided and support from
open-source frameworks, this will represent a shift in focus from working on
creating value for the business and its customers, to chasing Apple's
requirements. For some, this will be worth it for their customers, for others
it won't be. Many companies out-source app development, where this could
represent a large financial cost. Some companies use off-the-shelf app
creation tools which may not even support this, at least not for a while.

For larger companies, reliability, scalability and monitoring concerns make
this sort of task a large project, especially at such a core part of the
customer journey as sign-in.

Thread sits somewhere between these two, but has an additional concern of the
fact that we have never supported multiple social sign-in providers, we only
ever supported Facebook. As many engineers will know, going from 1 to "n" of
something is often a bigger job that going from 0 to 1 of it. This makes this
a bigger engineering task than it may appear, and in the context of us no
longer wanting Facebook sign-up, a hard one to justify.

#### How big is this problem?

Thread needs to differentiate between sign-up and sign-in, and for historical
reasons allows one but not the other. While this isn't going to be an
extremely common scenario, anecdotally it feels relatively common to me. I
went through a period of using **Sign in with Twitter** everywhere I could,
but this option seems to have gone out of fashion and I am finding that I have
to hunt for these options more and more where they have been superseded by
Facebook and Google.

Authentication is hard, even if outsourcing the problem to social sign-in
providers. This means authentication systems stick around for a long time.
Given how they are used and the relatively uncommon practice of getting users
to reconfigure their authentication, they tend to accumulate code paths that
have to be supported for a long time to come. I'm willing to bet that many
companies are not in a position to change their authentication situation, and
that a significant number are in the process of phasing out some options.

#### Isn't _removing_ Facebook sign-in exactly what Apple wants?

Yes and no. Apple want to sell more Apple devices and one method of doing that
is creating more lock-in which **Sign in with Apple** will do. The other
method is by pushing their brand, and their current favourite way of doing
this is emphasising the privacy benefit over competitors.

While forcing products to remove Facebook _sign-up_ achieves this, forcing the
removal of _sign-in_ does not. On the one hand it doesn't create more lock-in
because it's not adding Apple's SSO, and on the other I don't believe it
really enhances user privacy[^2]. Given that it achieves neither of Apple's
goals, is it worth doing, or is it just an unintended side-effect of a blunt
instrument?

#### What this means for customers

In all likelihood, the result of this is that for a portion of our userbase,
on iOS only, we will build an account conversion flow that will take users out
to the web, have them sign in with Facebook, and then convert them to a
regular account (by setting a password) and then taking them back into the
app.

We can only hope that Apple allow having Facebook sign-in on a web page with
the only purpose of allowing non-Facebook sign-in.

This is not a great user experience when a customer just wants to sign-in to
an app and get on with their task. This poor UX already feels like Apple are
shooting themselves in the foot somewhat (as it will only apply on Apple
devices), and the UX will be far worse if Apple choose not to allow apps to
build this sort of upgrade flow[^3].

---

## Fighting Fraud

One of the headlining features of Apple's SSO service is that users have the
option to hide their email address from the service they are signing up to,
instead relaying any email through Apple's servers.

Instead of the service seeing the address _contact@danpalmer.me_, the service
will be provided an address such as _521d61ae4d@private.relay.apple.com_. Each
service the user signs up for will see a different email address. This is
great for users as they can immediately stop all email from that service at
any time, so if a service is hacked and their email address leaked, they have
an easy way to prevent spam.

#### Background on "Paying Later"

Let's take a moment to talk about a common concern in retail, financing. Many
purchases are above what people can afford at the time they are made, so we
often prefer to split the cost of a purchase over time, or prefer trial a
product and pay only when we've decided that we will keep the purchase.

Thread offers this latter option, to "pay later" in our checkout process so
that customers can order clothing, try it on at home, send back what they
don't like or doesn't fit, and then only pay for what they keep which may even
be nothing. This may not sound the same as a loan to spread the cost over
months or years, but at a basic level it is, and the UK's Financial Conduct
Authority (FCA) certainly consider it to be the same.

Those providing this credit must be FCA approved to offer this in the UK. This
is quite a burden, so like most retailers we outsource this to a third party
payments provider who take on the responsibility of being FCA approved, as
well as the fraud risk and the risk of a customer just "forgetting" to pay
(often called "friendly fraud"). Since the third party provider are providing
credit to the customer, they do a credit check (in this case one that is not
recorded on their credit history). In order to perform this we share basic
user details with them only for the purpose of performing this check, and on
the basis of this check the provider will either agree or decline to offer the
credit.

If the customer decides to take the credit, the outstanding balance is added
to an account with the payments provider, and they can pay it off any time
they like over the next 30 days.

A crucial detail is that this account with the provider will also hold any
balance that the customer may have by using that payment provider with _other
retailers_. Any outstanding balance, payment history, and payment issues that
may have occured in the past are some of the main deciding factors in whether
the customer is offered the credit or not[^4].

How does the payments provider know if the customer has an outstanding
balance? They use the customer's email address.

#### Correlating Email Addresses

This brings us to the crux of the privacy advantage of **Sign in with Apple**,
but also the biggest _problem_: with the private email addresses services can
no longer correlate email addresses between each other. In many ways this is
great – preventing a service from telling Facebook that you signed up with
that email address prevents Facebook from learning something about you and
that's good for privacy. It prevents advertising networks from building the
links that are so valuable to them, the cost of which is completely hidden
from the user[^5].

But what about our pay-later example? In this case the email address isn't
going into a "network", it's just being used to look up an existing
account[^6]. It's not a hidden side-effect with no benefit to our customers,
in this case it's a feature of our service, being used with the consent of our
customers, in order to provide direct value to them.

Use of data is not inherently bad, and this is a great example of where
something that wasn't before possible – taking on the risk of providing a loan
in this way – is now possible (at a low enough cost) for it to be a feature
that a payment provider can offer, and that we can make available for our
customers to improve their shopping experience.

#### Apple's Answer

Apple do have an answer to the question of fraud, whether it's satisfying
depends on what is considered fraud, and what behaviour a service is trying to
limit.

On account creation, Apple will return a boolean value to the app that
represents whether the user is a "trusted" user. True means that Apple has a
high confidence this user is legitimate, likely because their Apple account
has years of history of legitimate use. False means that Apple does not know
if this user is legitimate (it doesn't mean they are _illegitimate_ in any
way).

This is a novel feature and I think it's likely to have a very low false
positive rate as Apple have so much account history, purchase history, and
device activity for most legitimate users. For services such as social
networks who are trying to limit fake accounts, this may be a very effective
tool.

However the design is a very _account centric_ design. It's only intended to
assess whether the user signing up to a service with Apple's SSO is a real
person or a "bot". It is not intended to assess whether the user intends to
commit fraud – intentionally or not – on that account.

Unfortunately this is completely ineffective for the pay-later scenario, which
depends on being able to correlate user accounts. Further, it's probably
unsuitable for most retail or the sale of most goods.

#### What can we do about this?

There are a couple of directions this could go.

1. Using the trustworthiness flag that Apple pass through.

2. Collecting real email addresses at account creation, or "upgrading" to a
   real address later on if required.

3. A trusted partnership programme where select third parties can translate a
   relay email address to a real one directly with Apple.

4. Services disable features for those accounts that signed up with "Sign in
   with Apple".

I don't believe that Apple's trustworthiness flag (1) represents enough for
all possible use-cases, so while this may be a useful feature for services to
combat fake accounts, I don't believe it will provide much more benefit, and
will be insufficient for retail. In addition, since this is just a boolean and
not a signed statement provided by Apple, third party services such as payment
providers are unlikely to accept it as a useful input to fraud models.

Apple does provide the option for a user to give their real email address to
the service they are signing up for (2), but users making this choice can't be
depended on. Services could build a flow to detect that a user has given us a
relay address and "upgrade" to their real address later in the account
lifecycle at the point that we need to provide the email address to third
parties. Building this and maintaning a good user experience is complex, and a
cumbersome UX in parts of a user journey such as checkout could have a
significant business impact. Apple could provide a flow in their API for doing
this with a relatively frictionless user experience, but so far appear not to
offer this as an option.

While this may work for some products, there are others where a real email
address being used is fundamental to the service being provided – Gravatar
comes to mind as an example. These products have no way to _enforce_ that
users sign up with a real email address, and will simply have to detect
Apple's relay addresses and reject the new account, a poor user experience,
the cause of which may be difficult to communicate to the user. This may not
be allowed under Apple's policy.

Potentially the least-worst option here, is for Apple to create a partnership
programme for sharing email addresses (3). This would allow select partners,
who have committed to some terms of use from Apple, to convert a relay address
to a real address. This way a user would sign up to Thread choosing to provide
a relay email address instead of their real one. We would then pass this relay
address to our payment provider as normal, with our customer's permission,
with no changes to our process, and they would be able to look this up in
order to correlate it to an existing address in their system[^7].

Unfortunately, the easiest option of the lot here is that these features are
simply not offered to users who signed up for the service with Apple's SSO.
This will result in pain for users, who will miss out on features, pain for
product teams who have to work around poor user experiences, pain for customer
support teams who will have to explain why features are not available, and all
with potentially no benefit to customer privacy in cases where sharing is
being done for legitimate customer interest.

---

## Apple's "Email" Relay

The last issue to cover, and potentially the most difficult to reconcile, is
Apple's [policies around sending email to their relay
service](https://help.apple.com/developer-account/#/devf822fb8fc). This is the
service that relays email from the private addresses like
_521d61ae4d@private.relay.apple.com_ to the original accounts.

> In order to send email messages through the relay service to the users’
> personal inboxes, you will need to register your outbound email domains. All
> registered domains must create Sender Policy Framework (SPF) DNS TXT records
> in order to transit Apple's private mail relay. You can register up to 10
> domains and communication emails.

This has the potential to render services useless, as it requires developers
to either:

- know up front the domains they will send from (limited to 10), and _prove
  ownership of those domains_, or...

- know up front which email addresses they will send from (limited to 10).

It's not clear whether the 10 limit is across domains and emails, or a
separate limit for each.

There are many problems with these restrictions.

1. Services that use dynamic domains (for example thread.foobar.com) will be
   unable to authenticate all of their domains.

2. Best practice for email deliverability suggests that senders should send
   from a different domain per category of email that they send[^8]. This
   mostly applies to larger products, but 10 domains is too limiting.

3. For third parties who email users on behalf of the service they signed up
   for, it will be impossible to prove ownership of the domain for each
   partner they work with, and they may not be able to provide the specific
   addresses that they send from, or these may change over time, creating
   significant business risk.

4. Third parties who email users on behalf of the service they signed
   up for may not have implemented the requisite Sender Policy Framework
   measures, and may be unable or unwilling to do this.

The first two are difficult requirements to meet, and could alone rule out the
use of **Sign in with Apple** for some products, however they are at least
fully within the control of the product. The latter two are more concerning.
Let's dive into a specific example...

#### Collection Delivery

Thread delivers orders with a regular parcel service, but also offers
_collection delivery_, where parcels are dropped off at a store of some sort,
and the customer can collect it at their convenience. For Thread this works
like a typical shipping provider, but once it arrives at the store and is
available for collection, the customer receives an email with a pickup code
that they must provide when collecting their parcel. This email with the
pickup code is sent by the _shipping provider_, not by Thread. There are
multiple reasons why this is the case, but it's worth noting that may not be
within Thread's control – it may be a requirement of the shipping
provider[^9].

This presents a problem. We cannot prove ownership of the domain the provider
use to send their email. We don't own it, but even if we could send the proof
document that Apple provide to the provider to upload to their servers, this
process would only be possible for a single customer of that shipping
provider, unless email for each retailer was sent from a separate domain.

We could ask the shipping provider which email addresses they will contact the
customer from, but if we assume that they have 3 – one for pickup codes, one
for customer support, one for service updates, this would use 30% of our email
address limit with Apple, and we currently have at least 4 third party
services in a similar situation to this provider. Retailers that operate in
multiple countries could easily have hundreds of such suppliers, and require
thousands of email addresses.

This also creates a problem if or when the provider chooses to change how they
send email. In the case of this provider, their tech is provided by another
company that they have a partnership with. This means that when changing the
address or domain they send email from, a product manager or similar at the
tech company, who have no business relationship with Thread, must notify some
sort of partnerships manager, who must notify our shipping provider, who must
notify someone at Thread, who must notify someone with enough knowledge of the
requirements of **Sign in with Apple** to know that this means something needs
changing. That's a long chain of communication that needs to work perfectly,
as well as needing to jump from being an _operations_ conversation to being
one about _authentication_ – two otherwise unrelated areas. It is unreasonable
of Apple to believe that this will happen.

#### Potential solutions

There are a couple of potential solutions here but none are guaranteed to
work, which means that it's almost certain that some companies will be left in
a bad situation.

- Thread could send the pickup code emails.

  This assumes that the shipping provider would allow us to do this, which is
  not a given (for the pay-later payments provider sending invoices is almost
  certainly something we will not be able to do).

- Entire industries could become stricter about how they send email, and how
  they _change_ how they send email, understanding many more stakeholders in
  that process.

  The logistics industry and payments industry are the two covered here, and
  both are unlikely to change for this as they are typically very slow moving,
  planning technology changes a decade out in some cases. The understanding of
  the stakeholders is unlikely to happen as this is already a problem in
  technology and the web in particular that hasn't been solved in 30+ years,
  so will probably not happen before the end of this year because of Apple's
  requiremnts.

- Apple could treat relay email like real email, and not limit the number of
  senders or where email comes from in any special way.

  Email providers like Apple (iCloud), Google, and Microsoft, already apply
  many restrictions to email delivery. Spam detection is pretty good, it's far
  more possible to authenticate senders now than it was not that long ago.
  Legitimate email senders are used to these restrictions and understand them
  relatively well.

---

## Next steps

While I'm excited about the future of **Sign in with Apple**, and keen for the
privacy enhancing properties that it may bring to many apps, I'm concerned
that Apple has not given enough thought to how it interacts with the complex
ecosystem of authentication, fraud checks, and inter-service operability. I
believe that a significant number of products will be unable to continue to
operate within the policy.

In its current form **Sign in with Apple** is a blunt instrument – marketed as
improving user privacy, but instead preventing whole classes of data use
regardless of their actual privacy impact or the UX benefits that may no
longer be possible. In the EU where GDPR restricts what companies may do with
customer data, this leaves Apple's SSO providing little to no benefit over
what is already required by law.

Apple should have launch this as a purely opt-in service for the first 2 years
to see how it is adopted, and to work with those in the community who depend
on email addresses for fraud detection and other services to explore options
that may prevent the need for passing an email address through every third
party.

Since this is unfortunately not the direction they have chosen, I would like
to see the following from Apple, all of which I feel are aligned with their
ultimate goals:

- Drop the policies around email going through the relay service. Perform spam
  filtering and detection of bad actors as normal, but otherwise treat this as
  any other email provider would.

- Distinguish between signing _in_ and signing _up_, "[grandfather
  in](https://en.wikipedia.org/wiki/Grandfather_clause)" any accounts that are
  not created on iOS, allowing them to continue to sign in, without the app or
  service being required to adopt Apple's SSO.

- Allow apps to use social sign-ins, without adopting Apple's SSO, when the
  purpose of the sign-in is only to convert the account into a non-social
  account, allowing apps a migration path away from social sign-in instead of
  requiring the adoption of Apple's SSO.

- Allow apps to _require_ a real email address at sign-up, if doing so can be
  shown to be a core requirement of the service they provide.

- Provide apps an easy way to request a real email address, to "upgrade" from
  the Apple private email address, after account creation.

These would address my concerns for whether Thread will be able to use **Sign
in with Apple** and around the UX impact for our customers. However these are
only _our_ issues, and Thread is only a moderately complex online service with
a retail side, large online retailers will be harder hit than us, complex
online services may find it more difficult than us to integrate, and other
industries could be hit in completely different ways. How does this affect
travel, event ticketing, service marketplaces? I'd be willing to bet that each
industry will have its own nuances that will be difficult or impossible to
reconcile with Apple's policies.

I would urge Apple consider more of the nuances of these ecosystem before
putting strict requirements on third party developers that could harm their
businesses, and worsen user experience across iOS, the web, and all other
platforms.

---

#### P.S.

One of my colleagues once told me about the idea of "feature complexity",
applying the concept of [algorithmic
complexity](https://www.geeksforgeeks.org/analysis-algorithms-big-o-analysis/)
in algorithms to features of products. Changing the text on a page might be an
_O(1)_ feature – it (naively) has no knock-on effects or maintenance. Adding
an API to the product though might be an _O(nm)_ feature, _n_ work needs to be
done to support the API for every _m_ other feature that needs to be available
in the API, a far more expensive feature to create and therefore one that must
be considered carefully. This isn't intended to be a perfect measure, but it
can be a useful thought experiment.

While much of this post is written from my perspective as someone who helps
create a product for customers, I think much of my gut response to this comes
from my perspective as an engineer, seeing the design choices of **Sign in
with Apple** leak out from authentication into so many aspects of the product,
the process of maintenance for that product over time, the features we can
offer, and so on.

Apple have, maybe unintentionally, created an _O(nm)_ feature in the number of
platforms a product works across and the number of third party services that
depend on an email address, or potentially higher if more factors need to be
considered. I worry that years down the line we will be making important
decisions about user experience or even how we deliver our products to
customers, based on the fact that some portion of users use Apple's SSO to
sign-up.

As a user a look forward to having this option, but as an engineer on a
product that respects user privacy, complies with some of the strictest laws
in the world around it, and that uses user data to create great experiences
for those users, I am disappointed in all of the possible resolutions
available within Apple's policies.

[^1]:
    Since this distinction may be nuanced, it's worth noting that this is not
    just the number of users completing sign-up, but more measured as the value
    to the business in them becoming customers. While I can't remember if this
    distinction was relevant in this particular test, one thing we have seen in
    changes to the registration process is that they can reduce the number of
    sign-ups, but increase the number of customers.

[^2]:
    There are three main points at which Facebook receive information from a
    social sign-in: at sign-up, at the point the app/site/service registers an
    account conversion with Facebook, and at re-authentication time when the
    user signs in again. It's very likely that the first two have already
    happened by this point, and they contain the bulk of the interesting data –
    Facebook knows that you use the app, they know all the data about you that
    the app chose to share when marking you as "converted", they likely know
    where you came from to install the app or sign up for an account (i.e. the
    marketing channel).

[^3]:
    Thread is lucky that we have a website where we can put this flow – many
    apps don't and would have to have the flow in the app, something I have very
    little hope of Apple allowing, as this would mean that a **Sign in with
    Facebook** button would still exist in the app, without the requisite **Sign
    in with Apple** button.

[^4]:
    If you've paid off a £100 balance three times before, they may well let you
    do the same for £500. If you paid late (with a fee) on a £100 balance, they
    may not let you take credit again (these numbers are an example and may not
    be entirely accurate, but are representative of how this may work).

[^5]:
    As these addresses start to become more pervasive, the quality of the hidden
    "knowledge graph" of user data will begin to deteriorate. I wonder whether
    Apple's SSO has the power alone to cause this enough to materially impact
    the industry. I suspect it may be a little like herd immunity, in that total
    coverage may not be needed to sufficiently deteriorate the data quality, to
    make it nearly worthless.

[^6]:
    I'm not entirely familiar with the terms of service of our payment
    provider, so potentially they may not be as innocent as I make out, however
    I suspect they probably do not forward this on as selling customer data does
    not appear to be in their business model, could very well breach FCA
    regulations, and would likely violate GDPR.

[^7]:
    The address conversion could even be done to a normalised and hashed email
    address so that the third party service must already know about the address
    in order to reveal it, and would be unable to harvest new addresses from the
    programme.

[^8]:
    This is a huge simplification, but roughly transactional email, marketing
    email, notifications, and service updates should be split across different
    domains. This allows for email providers to understand the separate patterns
    that each of these will have, and tailor their handling of the email
    accordingly.

[^9]:
    I can't speak to whether it actually is in this case, but different
    providers have different approaches. Some are happy to be just a carrier,
    and have almost all aspects of their service be "whitelabelled" and branded
    or controlled by the client (Thread). Others prefer to own more of the
    customer relationship, and have a brand presence, therefore requiring that
    they own communication with the customer. Issues are similar for payment
    providers – it's rare to see a Stripe logo on a page or email as they are
    happy to be "infrastructure" in that way, but you never pay with PayPal
    without going _through_ PayPal and seeing plenty of their branding. It's a
    complex topic, and one that Apple are not going to simply force by sheer
    weight.
