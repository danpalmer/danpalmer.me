---
date: "2012-05-09"
layout: post
redirect_from:
  - /2012/05/the-problem-with-square-and-paypal-here
slug: the-problem-with-square-and-paypal-here
title: The Problem with Square and PayPal Here
---

In the last decade, PayPal has slowly become a mainstream service, thanks mostly to it's tight integration with and later purchase by eBay. This has given rise to competitors such as Google Wallet and Amazon Payments which, while they each have a slightly different purpose or target audience, have contributed to revolutionising online payments. When I buy things online now I rarely enter my billing and shipping details, and instead choose to use one of these other, simpler and easier, methods.

But what about physical payments? I still have to carry cash everywhere, and when my housemates pick up groceries for me while they are shopping I end up paying them back in cash because anything else is either too much effort for a few pounds, or charges enough that it's not worth it. It seems to me that change is coming, and I can't wait.

Square [recently announced](http://gigaom.com/2012/04/25/no-slowing-down-square-processing-5-billion-a-year/) that they are now processing $5 billion a year, up from $4 billion just a month before, and in fact at their current rate of growth they would process $7 billion this year. Clearly they are taking off in a big way. From the noise of the Twitterverse and popular tech news websites it would seem that every independent coffee shop, café, or ice-cream stand is using them and receiving huge increases in sales because of it. And of course it's beneficial for people as well as businesses because they can take card payments on their phones for the bits and bobs they sell on eBay.

![PayPal Here and Square](/assets/images/blog/mobile-payments-square-paypal.png)

This is the big one though: [people can pay with their name](https://squareup.com/pay-with-square). I haven't had a chance to use the system unfortunately, but Pay With Square sounds like the revolution I think we all need. I will always have my phone on me, I use it for everything, so if I can 'notify' a shop that I am about to arrive, and pay just by saying my name, I think that is amazing.

![Pay With Square](/assets/images/blog/mobile-payments-pay-with-square.png)

_However, there is a problem_.

I live in the UK. Now I realise we don't get some of the cool stuff coming out of Silicon Valley and the surrounding area immediately, but this is almost always due to just international shipping, sales people trained for European markets, and so on. However when it comes to payment systems there is a more core problem.

The magnetic stripe.

Both Square and PayPal Here, as well as devices such as the [iCache Geode](http://www.kickstarter.com/projects/1404403369/geode-from-icache) depend on one crucial piece of technology, the good old magstripe. And it is old, it was invented in the 1960s at IBM and hasn't changed a lot since. It seems that in the US this is still considered a normal method of payment, but here in the UK it's far from it.

Over the last decade, Europay, Mastercard and Visa have developed and rolled-out a system imaginatively called 'EMV' (but known as Chip & PIN in the UK). This uses microprocessors on smart-cards rather than magstripes in order to provide supposedly much more secure transactions. This security is arguable, as Ross Anderson of Cambridge University has made clear in his paper [Chip & PIN is Broken](http://www.cl.cam.ac.uk/~sjm217/papers/oakland10chipbroken.pdf), however this point doesn't really matter anymore as the pervasiveness of EMV throughout the UK and most of Europe is huge, and growing every year.

For those of you who don't know the details of the two systems, here is a brief breakdown:

<img src="/assets/images/blog/mobile-payments-magstripe.jpg" alt="EMV Card"/>
**Magstripe**

- Static information
- Easy to read
- No encryption
- Very easy to clone
- Relies on signature verification

<img src="/assets/images/blog/mobile-payments-emv-card.jpg" alt="EMV Card"/>
**Chip & PIN / EMV**

- Dynamic information
- More difficult to read
- Encrypted
- Difficult or impossible to clone
- Usually uses PIN verification
- Usually contacts bank for authorisation

### What are the Problems?

There are 3 main issues facing any company wishing to 'revolutionise' payments in Europe:

#### 1. Bureaucracy

A device taking payments using the EMV system needs to be approved by the EMV board before it can be used commercially. They will mainly look at the physical security of the device, in particular how easy it is to hijack and monitor PIN entry with.

On a jailbroken iPhone running the Square app, I imagine it would be possible, and dare I say it, trivial, to record PINs entered. Perhaps I am being pessimistic, and perhaps the Square team will come up with a brilliantly engineered way to prevent this from happening, but convincing the organisations behind the technology that taking in PINs on your phone is safe will be a tough challenge.

The other factor that EMV approval will take into account is the behaviour of the device when contacting the bank. There are some card reader devices out there which do not contact the bank for verification at the time of purchase, most commonly those used on trains, or where a mobile internet connection isn't guaranteed. These need to store information for a time until they can send it off to the bank, so must have top-notch security, something mobile phones definitely don't have. So that means the apps would need to communicate 'live' with the bank either directly or through servers that would need to be based in the EU and adhere to strict rules. I am sure similar rules exist in the US, but there will be a whole new set of standards that need to be understood and implemented in order to begin EU operations.

#### 2. Public Perception of Security

Consumers here _expect_ that shops will use their PIN and now many find it strange if they are asked for a signature. Couple this with a strange new device on a mobile phone that they haven't seen before, and many consumers just won't trust the system enough to use it. We have been told for the last 10 years that Chip & PIN is more secure than magstripe and a signature, any new service either needs to put in a large amount of work to take advantage of that, or they need to go up against it and try to convinve people they are secure enough.

Public perception is never something to be underestimated, but especially when it comes to financial security. Card fraud by means of 'card skimming' on ATMs and readers in the UK is a well known problem and many people are quite vigilant when it comes to spotting skimmers. I suspect a significant number of people have avoided using a particular ATM because it looked suspicious. Square is very different to what people know, and in their minds a step backwards in terms of technology.

Finally, it is already the case that many retailers refuse to accept cards that don't use EMV. Even back in 2009 when I was working in a shop we were not allowed to accept magstripe payments, despite most tourists not having EMV cards, because of the big threat of card fraud. If a service utilising the magstripe launched in the UK, I expect the adoption by businesses to be low because of that threat. Very few businesses except for the major supermarkets even have the facility to take magstripe payments The final thing to note with this point is that there will come a time in the not-too-distant future, when cards in the UK no longer have a magstripe on them, or at least when card processors no longer accept them. It could be argued that they will stay around to enable people to use their cards abroad, but they may well be disabled in the UK.

#### 3. Hardware

The final major problem I see for Square and others is the hardware. Both Square and PayPal have designed really neat little devices that use the audio jack on phones, but this can't work for EMV. Not only does the software need to have two way communication with the card for the authentication, which isn't possible with the audio jack, but also to reach and read the chip, and ensure correct card positioning, the device would need to be much larger. _It probably wouldn't be square anymore_.

It appears to me, from watching the news coverage of Square and PayPal Here, that much of the brand identity lies in the devices themselves and these will need to change drastically to accommodate EMV. Apple have received media attention for their use of iOS devices in their stores as a method of taking payments, but while the process resembles Square in the US, a simple swipe of the card, in the UK it involves a much larger device with a keypad for PIN entry and probably it's own dedicated wireless receiver as I doubt passing it through the main device would be approved by the EMV board.

### Solution?

While researching for this article I stumbled upon [iZettle](https://www.izettle.com/), a Swedish company attempting to be the Square of Europe. While they haven't yet launched, they have raised money from investors and seem to have a fairly complete system lined up, featuring an iPhone app and an iPad app with more functionality for shops (that both look very similar to Square's offerings).

<center><img src="/assets/images/blog/mobile-payments-izettle-reader.jpg" alt="iZettle Reader"/></center>

iZettle has solved some of the issues that payment services coming from the US will face, they have developed the far more complex hardware required into a low cost device, which they will be giving away for free. They have been approved by the EMV standards body, which means they could probably roll out throughout Europe fairly quickly. And along with both of these things it seems like they will provide a very similar solution to Square with daily deposits and no monthly fees. Have we found the perfect product for Europe?

There is just one problem with iZettle: it still doesn't use PINs. This is not an insurmountable problem, and probably depends on public perception in the individual countries, and in particular the point in the EMV roll-out that they are in. Germany for example is just beginning the roll-out so iZettle probably has a chance of embedding itself into the market before consumers lose trust in the use of signatures. However the UK finished the roll-out in 2006 and they will therefore have to overcome the uncertainty that many customers may have when asked to sign for payment, something they may have not done in years.

### What Will Happen in the Future?

There is no question that the new wave of mobile payment solutions coming out of the US have a lot of problems to overcome, in fact I would argue they have had it easy, starting in an area with seemingly less red-tape, a simpler system banking system and fewer languages. On the other hand, iZettle is starting in a much more difficult environment. If they survive and build a substantial user base in Europe, they might be very tough competition for Square and PayPal.

Square clearly has a lot of power over the payment industry now, and is gaining more power all the time. With the amount they are processing in transactions they have a lot of klout when it comes to making demands. This could help them when they transition to Europe, which must be on the cards, but I think they need to do this before iZettle takes hold if they want to corner the market. They have a fantastic product and I doubt PayPal will be much of a competitor, but iZettle is clearly very well thought out making the only real difference the experience that Square has already gained.

What actually needs to happen for Square, PayPal and others to take hold of the UK and maybe the rest of Europe?

1.  Battle with the red-tape of Europay, Mastercard and Visa to get approval for their hardware, and with EU financial industry regulations for their backend services.
2.  Overcome 10 years of a bad public image of signature authentication and convince businesses to go backwards in their fight against card fraud.
3.  Redesign their hardware, possily losing their brand identity in the process.

On a closing note, 'contactless payments' are beginning to roll-out here in the UK, with banks such as Barclays offering cards that work using RFID. This technology is almost identical in the way the services and software work to EMV, but obviously without a normal card reader. They also don't use a PIN. Adoption of the new cards seems to be a little slow, perhaps the security risk is a part of this? Either way if any of the companies I have talked about decide to go down this route they still face many issues related to hardware, red-tape and public perception.

<hr/>

<p><small>Disclaimer: I do not live in the US, and haven't visited since I was a child. While I follow a large number of people from America and am quite familiar with Square and other similar products, I haven't had 'hands-on' experience with them so there may be a few inaccuracies. If you spot something that isn't right, please <a href="mailto:dan.palmer@me.com">tell me</a>.</small></p>
