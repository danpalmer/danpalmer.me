---
date: 2014-03-01
layout: post
redirect_from:
  - /2014/03/imessage-security
slug: imessage-security
title: iMessage Security
---

Apple recently released [detailed descriptions](https://ssl.apple.com/iphone/business/docs/iOS_Security_Feb14.pdf) of how many of their iOS security components work. This is a great step towards better security and transparency about security on iOS, and I'm really glad they have published the information.

Included in the document were details about how iMessage is implemented from a security point of view, and it looks like a good system built on strong public-key crypto. Theoretically Apple don't have the ability to read the messages you send, and that's a good thing. TechCrunch wrote a [good summary](http://techcrunch.com/2014/02/27/apple-explains-exactly-how-secure-imessage-really-is/?utm_campaign=fb&ncid=fb) of the iMessage security protocol and summarised it as follows.

> Unless Apple is omitting something or there’s some backdoor tucked into their many-layers-deep encryption (which, while unlikely, isn’t inconceivable) they really can’t read your iMessages without a fairly insane amount of effort.

This is true, but highlights an essential detail – it's not inconceivable that there's a backdoor.

While the "goto fail" issue that's been going on over the last week may well not have been a deliberate backdoor in Apple's SSL implementation, it's entirely plausible that it might have been. The actual error appeared innocent enough, it had great plausible deniability and would have made a very good backdoor even if it wasn't actually one.

That's in an open source project. iMessage has the added advantage that it's closed source. It would be very easy, and relatively undetectable to break the cryptography in iMessage in a subtle way that would be nearly undetectable even at first inspection of the source code. Even worse, Apple may be flat-out lying in the technical description, iMessage may do none of what they say, and it's unlikely we'd find out.

But can't people decompile the application? Can't they analyse the binary?

Of course they can, but I don't think they're likely to find anything. Without a formal test, targeted at cryptography, performed by an external company, the chances of anything being found are low because the skill level required to be able to analyse iMessage is so high, and there's not much incentive - Apple don't run a bug bounty. Such a test may well have been performed, I'd be surprised if it hasn't, but the details would never be disclosed to the public.

#### What should Apple do?

Release the source code of iMessage.

It's really quite simple. It's an iOS application, written in Objective-C, using the Cocoa libraries, so releasing the source code isn't going to help any competitors. It would take much longer to do a direct port to Android, for example, than it would to just write it from scratch.

Apple can hold on to the name iMessage, releasing the code is not a licence to let anyone use the name.

Sure, it's possible some people will write alternative clients, but those can be kept off the App Store by the approval process. And anyway, by viewing network traffic you should be able to reverse engineer the protocol already, as [some applications](http://imessageonandroid.com/) appear to be doing.

#### Why does this help?

If it's possible to download the source code for iMessage and check it for security vulnerabilities, or backdoors, we can a much higher level of confidence about our data being secure. It would be far easier for researchers to critique the security of the code.

But what if Apple just distributed a different version?

It was suspected that this was happening to [TrueCrypt](http://www.truecrypt.org/). TrueCrypt distributes both binaries and the source code, however for a long time 3rd party developers were unable to reproduce the same build results, when they compiled the source code, they got a different result to what was being distributed. This led many to believe that TrueCrypt had been backdoored. However, near the end of last year, a researcher finally [managed to reproduce](https://madiba.encs.concordia.ca/~x_decarn/truecrypt-binaries-analysis/) the exact build of TrueCrypt.

By matching the hashes of the compiled application, we can confirm to a _very_ high degree of confidence that what we compiled is the same as another build. For iMessage, this would mean we could tell if Apple was distributing a different, and possibly malicious, version of the application with iOS.

Wouldn't they have to release the source code of the server component?

This would be much more of a security risk for Apple. If they released the source code for the iMessage server, and someone found a vulnerability, it could compromise Apple's web services and the data of millions of users. However because of the solid design of iMessage, this isn't actually required. All the server does is act as a public key store, and mediator between devices in communications. It doesn't look at the messages, perform any crypto, or interfere with data in any meaningful way.

In fact, with a secure client implementation, the iMessage servers could be run by the NSA, and it wouldn't matter. All of the messages passing through the server should be unintelligible if the client is implemented correctly.

#### Is Apple really going to do this?

Not in a million years. Not only is it very uncommon for companies like Apple, it's also very unlike Apple themselves. This is one reason I was so surprised to see the document get released in the first place, Apple aren't good at transparency like this, and releasing the source code to one of their applications would be far too transparent.

If they were serious about security. Not just from a marketing "iMessage keeps your data private" point of view, but actually serious about doing it right to address the incredibly small minority of users who know and care about this, then releasing the source code would be the way to do it. But Apple don't address small minorities of their users, and arguably have no business case for doing so.
