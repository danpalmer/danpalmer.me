---
date: 2012-04-19
layout: post
redirect_from:
  - /2012/04/githubs-security-vulnerabilities
slug: githubs-security-vulnerabilities
title: GitHub's Security Vulnerabilities
featured: true
---

The security of GitHub's website and systems has been the focus of a fair amount of news in the industry over recent months, this is an account of my experience finding a vulnerability, getting it fixed, and also my opinions on the recent 'mass assignment' exploit that was publicly demonstrated on GitHub.

This was the first security issue I noticed in the wild, a problem with how GitHub was handling authentication for one of their API endpoints that provided an RSS feed of account activity. I had purchased an application that used the feed to track my activity and was poking around inside it's resources to see if it had a plugin system that I could create more plugins for. It didn't, but it did have cached data for each of the web services it was using, and after a cursory glance it was obvious it wasn't _my_ data, but that of the developers.

The cached data for GitHub included the URL that the data had originated at, in this case the RSS feed URL, however this included <code>?access_token=ad50f95e2189eb0012c2c940a16571c0</code> - a dead giveaway that this was something to do with authentication. So I put the URL into my address bar, I got the feed, and then left to go to my GitHub account. But I was now logged in as the developer the access token belonged to.

I had full account access, I could have taken control of the developer's account, code, client work, and more, but I think responsible disclosure is very important, and I instead contacted the developer through email and phone to notify them as quickly as possible, after all, their access token was being distributed on the Mac App Store for the bargain price of a few dollars.

The developer responded very quickly, changed his password, and assumed everything would be fine. And if you know about how most access tokens work this would make sense: changing the account password regenerates the access token as a simple way to revoke access to 3rd party applications. But this didn't happen.

I am not sure exactly how the problem arose, but I suspect it was something along these lines:

- GitHub has API access by means of an access token, revocation happens when you change your password.
- This is an old approach so they decide to implement OAuth and give each application it's own access token and give the user the ability to revoke access on a per-app basis.
- Now that we have per-app revocation, we don't want to revoke access on changing the account password.
- However we need to keep legacy API access around in some form.

Result: _changing the account password no longer changes the access token, but there is no way to revoke access to that token as it's not an OAuth authorised app._

There was also the related issue that simply visiting the URL with the access token would log-in the user, even if they were logged in with a different account, despite no password being provided. If the API proided write access this would probably give little or no extra control than via the API, but this issue removes much of the obfuscation gained by denying all access for tokens on the web interface.

I don't think this vulnerability was avoidable. It could be argued that better code reviews, more testing, more _security_ testing, or other things could have prevented it, but in reality they will only reduce the likelihood, and I am sure GitHub have very good measures in place for these already. In the end it just came down to human error in a particularly crucial point of migration from one authorisation system to another.

GitHub dealt with this in exactly the right way. I reported it as soon as I had worked out exactly what it was, and I received a reply saying it had been corrected within a few hours. I didn't disclose it anonymously, perhaps one should when dealing with companies who can sue you, but I had been careful not to do anything which I could get in trouble for, and the developer who's account I breached was supportive of the disclosure.

---

A few months after finding this issue another arose in the form of the Ruby-on-Rails mass attribute update vulnerability. After it was publicly demonstrated by the hacker who found it by committing to [<code>rails/master</code>](http://github.com/rails/rails), many criticised GitHub's approach to handling the issue, and I feel this criticism is unfairly directed at them.

1. The hacker raised an issue with the Rails team explaining that one of their default options left many sites open to the vulnerability. The ticket was immediately closed as 'not being an issue'.
   - **Problem 1:** one of the main reasons for using web frameworks is to prevent the most common attacks. The default option they used was to blacklist assignments instead of whitelist them. I don't think this was the correct choice to make.
   - **Problem 2:** the Rails team should have taken a serious look at the issue raised, and if they still decided to close the ticket, they should have given good reasoning for it. The hacker should not have been simply pushed off like he was.
2. The hacker experimented with the vulnerability a bit in his own repositories and account on GitHub and reported to the security team that timestamps could be manipulated on comments. GitHub notified him that they would check the issue and work on it.
   - **Problem 3:** it could be argued that GitHub should never have been vulnerable in the first place if written well. I would say that GitHub hires some of the best people in the industry and if _they_ had the problem, it is probably more of an issue with the Rails documentation not making it clear.
3. The hacker added his public key to the Rails organisation and then committed a change to the master branch of Rails. GitHub suspended his account as soon as they were made aware of this.
   - **Success 1:** this was one of the main criticism points for GitHub, but personally I think if someone is going around your site publicly demonstrating their ability to compromise any account, you have a _duty_ to suspend their access as soon as possible.
4. The whole fiasco was resolved and...
   - **Success 2:** GitHub clarified their 'responsible disclosure' policy as well as publishing a list of those who had helped in the past by disclosing issues in a professional manner. I am very grateful to them for including me on the list, and I hope it will encourage more people to act in the same way.

While it was a serious problem that shouldn't have occurred, and while it all came out in a very public way, nothing was damaged in the process as far as we know and it was someone with fairly good intentions who found it, so I think that's a good result. I hope that the fact is has been so public has raised security awareness within the industry and that the changes made are for the better in the long term.
