---
title: Trust in SaaS
date: 2024-03-23
featured: true
---

There's a lie at the core of the SaaS ecosystem. In such a wide ranging category of services there are few commonalities, but arguably the main differentiator between SaaS and more traditional businesses is the notion of self-service. A customer can sign up, provide an email address and credit card, and be successful with the product. This is increasingly proving to be a lie, and customers are losing out because of it.

We are in an age of ever more adversarial computing. As cryptocurrencies have made it easier to exploit compute for profit, as more of our lives move online and phishing is more profitable and easier to pull off, as companies look to profitability and no longer want to subsidise free usage, there has been a necessary[^1] crack-down on _untrusted use_.

> Ask HN: Can anybody help me reactivate my $Payment account?

> Help me Reddit, $Cloud has banned my account and turned off all my VMs!

> PSA tweeps, $Email just stopped us sending email to our customers.

These sorts of discussions are far too common in tech circles. A classic is accounts being shut down for nebulous reasons and loosely cited terms of service violations[^2], but when we dig into the details there's a common pattern: a lack of trust.

When a customer enters a credit card number in to an online platform and starts paying monthly, there exists almost no trust between them and the service provider. They don't know who the customer is, they don't know what they use the service for, they don't know if the next charge they make will go through, and they have little recourse if it doesn't.

It could be argued that there exists more trust than for a user on a free plan, but free plans typically come with significant anti-abuse mechanisms[^3] and stolen credit card details are easy to come by so even that is debatable.

So why are people surprised when critical parts of their company infrastructure is shut down? The lie of the modern SaaS model is that a credit card and an email address is all that is needed[^4], and with those comes trust and a _right_ to be a customer.

In reality SaaS companies are constantly battling against spam, bots, misuse, illegal content hosting, cryptocurrency mining, and more. In many cases there is little difference between these uses and legitimate new accounts, especially when a company has tight security controls that prevent analysis of customer data, or when they haven't had the time to develop such signals.

- - - 

So what's the solution? Building trust.

Having a call with a sales rep means being in the sales pipeline. This may not directly prevent an account being suspended, but means there's someone inside incentivised to get an account unsuspended. Illegitimate customers will aim to fly under the radar and are unlikely to have a sales call.

Getting an account manager or "customer success rep" means similar – someone on the inside who is incentivised to solve issues and communicate about what is going on.

Lastly, having a contract is often a good way to avoid these sorts of issues. Contracts may still have clauses regarding terms of service violations, but with many SaaS businesses accounts with contracts are going to be treated differently, perhaps with a human or lawyer reviewing contracts before account suspension happens. Contracts also mean predictability for the SaaS provider, as they can be more sure about payments, and predictability means less necessity to pre-emptively suspend accounts based on usage. These are often a pre-requisite for higher quotas.

- - -

But SaaS businesses won't be interested in sales calls for small companies?

This is just untrue. Small companies grow. Usage typically grows and building that sales relationship from the beginning may be valuable to a SaaS business. Account managers are a sales channel for new products. SaaS businesses often have a few "whales" and want to diversify their income so that one large customer leaving isn't business-ending. Growth from existing customers is often a better growth plan than marketing to new customers. All of these and more are reasons for a SaaS business to engage with customers of all sizes[^5].

- - -

If a service is critical to your business, make sure you can trust it. Part of that is making sure they can trust you. Engage with sales, become known to the company. Differentiate yourself from bots and spammers.

[^1]: Cracking down on illegal operations is legally necessary, cracking down on other usage is economically necessary in order to not go out of business, an outcome that would result in a bad experience for all customers.
[^2]: There are oft-overlooked legal liability issues here. It's often not possible to say explicitly why an account has been suspended, as this can be read as an accusation that could be challenged in court and lead to defamation cases.
[^3]: Cloud providers have quotas of resources, CI providers have low caps. ID verification to prevent duplication accounts may still be required.
[^4]: Sometimes a billing address may be needed, in some cases there may even by KYC/AML checks that change the equation a bit, but it's still a long way from the level of trust that is possible.
[^5]: Anecdotally, at my previous company I spoke to many SaaS companies across tech infra services, and heard about more from other members of the team. We were never "too small", despite being objectively small.
