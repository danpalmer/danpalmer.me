---
title: The Rabbit R1 Pricing Myth
date: 2024-05-05
featured: true
theme: rabbit
---

Two new "AI" devices have just launched, the [Humane AI Pin][humane], and the [Rabbit R1][rabbit]. Both have [received][review-4] [broadly][review-1] [negative][review-2] [reviews][review-3], criticising a lack of features, alongside the classic issues with modern AI systems – hallucination and confidently incorrect answers. The main distinguishing factor between the two devices has been price. Where the AI Pin sells for $700 with a $24 per month subscription, the R1 is "only" $199 with _no subscription_. This is however, a myth, and while it might be temporarily true, something is going to have to change.

![Rabbit R1 product page with a price of $199 and _no subscription_](/posts/images/rabbit.png)

---

It's important to note that neither of these devices does any inference[^1] locally, they both send their queries to cloud based services in order to generate answers. This is typical, Google Assistant and Siri have been doing this[^2] for a decade, and has been covered extensively in reviews, but the R1 reviews have all missed the impact of this on its pricing.

The problem is that AI inference is _expensive_. GitHub's Copilot, which costs $20 per month, has been rumoured to cost between $40 and $80 per user per month to host, and other reports suggest that ChatGPT is also relatively expensive, although probably less than the monthly cost. AI inference services are just very low margin right now, where a typical SaaS product might be 80-90% gross margin, an AI one is likely to be 50% at best, but could be making a loss.

This loss-making isn't necessarily a problem given the amount of venture capital funding available for AI products. Costs will come down in the next few years as model efficiency is improved and hardware comes down in price. The process of turning a loss-making recurring revenue service into a profitable one is a well-worn path and while price increases may be a part of that, they are also begrudgingly expected by customers.

Herein lies the problem with the Rabbit R1: there is no subscription, but there is a _substantial_ ongoing usage cost, for which other companies are charging subscriptions.

Now an ongoing cost to maintain devices isn't uncommon. Google and Apple have backend fleet management services that cost a small amount per device, and providing software updates isn't free, but these costs don't typically scale with the customer's usage and can most likely be treated as a fixed cost over the lifetime of a device, and factored into retail pricing or licencing costs in the case of Android.

The R1 still has these costs, but in addition the primary use-case of the device is access to AI-based answers for text and image queries. These could easily cost dollars per month for an active user, or as much as tens of dollars for a power user. It appears that Rabbit are using Perplexity AI for their answers, and they charge $20 a month for their Pro tier service. It's unclear whether the R1's answers are coming from pro-tier searches or the "quick" searches that Perplexity gives away for free, but they most definitely won't be giving Rabbit free searches, as these are clearly an on-ramp to upsell users to the pro service, an on-ramp that won't work for the R1.

And then there's the "LAM", or "Large Action Model". The LAM is currently incomplete so it's hard to understand its impact on the ongoing cost of the R1, but what is clear is that the actions take place against a web browser running the web app of the service being used, which are hosted in the cloud. Running a VM in the cloud powerful enough for this is not cheap at scale, and it's again possible that the per-user per-month cost to operate this sort of service would be in the dollars range, not the cents range.

Optimistically, it's likely that the Rabbit R1 may cost $2 per user per month to run, but this could easily be as much as $10 for more active users, more demanding service integrations or with service inefficiencies[^3].

---

Where will this money come from? Hardware devices often cost around 50% of their retail price for the bill of materials, and while the R1 has been noted in reviews to feel like a cheap device with inexpensive packaging, it's also a first hardware product shipping in limited quantities which would increase that price. It's safe to estimate about a $100 landed cost[^4]. Accounting for development costs, marketing, and all other expenses, there may only be $50 available for services assuming that the device is only aiming to break even. That could be 2 years of service costs, but perhaps as little as a few months.

So what happens when the money runs out? There are a few possibilities it's worth exploring, as much is still unclear about the device and it's services.

- Rabbit is only doing cheap Perplexity calls, and the LAM either never arrives or is cheap to run when it does. Rabbit can roll the ongoing cost into the cost of the device, and it's not a problem. This is optimistic, unlikely, and a lack of LAM would frustrate early adopters.
- AI inference costs plummet over the next year, with VC funding bridging the gap, and Rabbit can just roll costs into the price of the device. This is unlikely given the highly variable costs between users, and the fact that inference looks to be hardware supply constrained for a few more years at least.
- Perplexity costs become significant for Rabbit, and the model being used is downgraded in order to optimise, causing a noticeable impact on device usefulness, and resulting in user frustration.
- Rabbit introduces a subscription to complement the device. Perhaps gating better answers behind a subscription that unlocks a better Perplexity model. Subscription revenue could offset the costs of users on the free plan, but it would be a hard sell on a device currently emphasised as having no subscription, and if free users received a model downgrade as well this could create significant backlash.

All in all, Rabbit has a big challenge in funding an expensive service, with further significant expenses coming if they ship the LAM features that they have promised. No other companies are funding expensive AI and compute services like this from one-time hardware purchases[^5]. They may do this purely through VC funding, but making a profitable company out of a fixed device price and ongoing costs is far harder than turning a subscription app or website into a profitable one. In this respect, Humane and the software-only companies are better placed for long-term sustainability than Rabbit.

As the reviews come out, the hype for the R1 dies, and the reality of the costs come into focus, I expect trouble for Rabbit unless they pivot to a subscription model, but with their brand positioning this will be a tough sell, as it would be giving up the biggest selling point they currently have. With all the hype around the device, I'm reminded of the glory days of services like Uber before they cared about profitability, and the old adage that anyone can successfully sell $1 bills for 25 cents.

[^1]: The process of generating an AI-based answer.
[^2]: Both Assistant and Siri do some processing entirely locally which significantly speeds up their responses. The AI Pin appears to do the same for queries about the current time, but it's unclear if the R1 is able to do anything locally.
[^3]: Like the kind of inefficiencies you get when you build and ship a new piece of hardware and the backend services in just 6 months as Rabbit did.
[^4]: Delivered from a factory to a distribution centre in the US.
[^5]: There are free services on device, like Google Lens or Circle to Search, but these are effectively ad-supported. There are also AI features in modern smartphones, often around photo search and editing, but these are typically computed on device and therefore have no cost to provide (photos on iOS), or are tied to an increase in storage that is charged for (iCloud/Google Photos), or are being provided by large companies with sufficient war chests.

[humane]: https://humane.com/
[rabbit]: https://www.rabbit.tech/
[review-1]: https://www.youtube.com/watch?v=TitZV6k8zfA
[review-2]: https://www.youtube.com/watch?v=ddTV12hErTc
[review-3]: https://www.theverge.com/24126502/humane-ai-pin-review
[review-4]: https://www.theverge.com/2024/5/2/24147159/rabbit-r1-review-ai-gadget
