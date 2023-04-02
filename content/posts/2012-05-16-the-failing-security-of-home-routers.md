---
date: "2012-05-16"
layout: post
redirect_from:
  - /2012/05/the-failing-security-of-home-routers
slug: the-failing-security-of-home-routers
title: The Failing Security of Home Routers
---

There are basically 2 options for internet in the UK: BT (phone line based)
connections through BT themselves and resellers, with a maximum speed of around
24Mb, or Virgin Media (fibre based) connections which max out at about 120Mb
currently, although the technology supports >400Mb. For a house of 8 Computer
Science students, we don't really have an option but to go with the latter.

It is the standard now in the UK for all ISPs to provide a modem and router, or a combined box that does both, free with a connection. Great!

Well no actually, as with most things, you get what you pay for, and so the
quality of the routers is somewhat lacking.

### The BE-Box - Technicolor TG582

This is the standard box that BE have been giving out for a while now, and while
the interface is a little clunky, on the surface it seems to be quite a
capable router. When I used it for the first time I was impressed at the range
of features it had for wireless networking, guest networks, multiple users,
everything you could want on Port Forwarding, and more. However on the security
side it's a bit weird.

There are 2 issues with it, and I'm not even sure the first is a security issue.
Unfortunately at the time I am writing this our BE-Box is out of action, having
been replaced by our new Virgin Media router, and having not worked properly
for the last month anyway, so I can't give in-depth examples.

#### Mangling Passwords

When you browse to the router's IP address, 192.168.1.254 by default, there is
what appears to be a very standard login form, however on closer inspection it
seems it isn't very standard at all. The first issue I noticed was with our
first BE-Box, the 'enter' key did not submit the form and my password manager,
[1Password](https://agilebits.com/) did not work on it. I ignored this until we
got a replacement router (the first stopped working) with a later firmware
version on it. This form refused to work in Safari or Chrome at all.

One of my housemates decided to have a look at the source of the page and see
what was preventing it from working, and to our horror we found a really nasty
client-side encryption system (we think) which after staring at and debugging
in Safari for an hour we still hadn't fully figured out the purpose of.

If you send a login form with a password in it over HTTP, that will be sent in
plaintext, which is far from ideal, despite this it was only last year that
Facebook and Twitter stopped doing this by default. It is relatvely easy to run
HTTPS on a server to make sure communication is encrypted, and I doubt the
router hardware would be too low spec to support this, so I don't think there
is an excuse for not using it. Perhaps the manufacturers didn't want to fork out
for an SSL certificate?

The alternative that Technicolor had opted for was to encrypt the passwords in
the browser. This introduced a considerable amount of complexity and was
probably the cause of our problems using the page in Safari and Chrome. The
algorithm they used was very strange, and involved computing the MD5 hash of
the password, concatenating this with some other values which looked like CSRF
protection or a '[nonce](http://en.wikipedia.org/wiki/Cryptographic_nonce)'.
The algorithm then calculated the MD5 of this result, and concatenated the
second result with details like the HTTP method being used (despite it
always being POST), the IP address I think, another nonce, the make and model of the router (yes, seriously), and the string <code>abc123</code> (no, I'm not joking).

I don't know what this exactly was trying to achieve. It looked a lot to me like
'[security through obscurity](http://en.wikipedia.org/wiki/Security_through_obscurity)' which is almost never a good thing, and it
seemed to introduce more problems than it sovlved. I am by no means an expert on
OAuth, but I have used it a little, and the algorithm reminded me a little of
signing a request for an OAuth service. Perhaps the developer had read something
like the [Twitter documentation on OAuth signatures](https://dev.twitter.com/docs/auth/creating-signature) and totally misunderstood the purpose or how
it worked. Certainly, the inclusion of the hashing, the HTTP method, server
address and the nonce, all look a little similar.

#### Leaving the Backdoor Open

It might be debatable whether the first issue I had was an annoyance and bad
programming or a security issue. However this one isn't. There is an important
distinction in computer security between public and private information, and
users need to know the difference. Your username should always be public, your
password shouldn't. What about your router's serial number? There may be
opposing opinions on this, but I do not consider a serial number to be private.
If I am calling tech support and they ask for my router serial number for
reference I would have no problem giving it to them, the same cannot be said for
my password.

I found out after port scanning the BE-Box (why not?) that it ran a telnet
service. This isn't great for security, but if I have control over the users on
the router then it doesn't matter too much. I logged in and had a look around,
and to my surprise, found an extra user account called 'BeTech' listed that didn't show up in the web interface. After speaking to tech support it turns out
this is their remote assistance account and the password is by default set to
the serial number of the router.

Now many routers come with fairly poor default passwords set and while I don't
think this is good, at least they tell people to change them. Not only was I
never prompted to change the default password on this account, _the account
wasn't even visible_. As I said before as well, the serial number, is not
protected information so finding it by
[social engineering](<http://en.wikipedia.org/wiki/Social_engineering_(security)>)
would be relatively easy.

### The Virgin Media SuperHub - Netgear VMDG480/CG3101D

This is the router that prompted me to write this article. This afternoon I had
a new connection installed (yay, 100Mb) and I have had a few hours to play
around with the SuperHub that came with it. Unlike the BE-Box which was a
relatively standard DSL modem that I could easily have bought a replacement for,
the SuperHub connects directly to the coaxial cable that comes in from the road
and I haven't heard of alternatives to it so far.

#### Telnet

The first issue I found with the router is that it has telnet running on it,
however unlike with the BE-Box, I am unable to log in to it with the credentials
for the web interface. I have tried every 'defualt' username and password
combination I can find online for it, and have yet to get anything that works.
The router is a rebranded Netgear model with custom firmware from Virgin so most
of the information I can find on it doesn't apply.

I contact tech support about this, assuming it would be a similar case to BE
with them having remote access with a particular username and password, but I
got a strange answer. Apparently they switched telnet off on the routers in a
recent firmware update.

![Superhub Telnet Login](/posts/images/superhub-1.png)

Now maybe there are other ways of disabling telnet, but when I am told "there is
no telnet access", I expect the port to be closed. I certainly don't expect
a login prompt when connecting to it.

If Virgin have indeed disabled telnet in some other way, they have created a
problem for themselves in that it is unverifiable. As far as I can see, these
are exactly the results that I would expect to see from a device that has
telnet _enabled_, so short of trying every username and password combination I
can, there is no way for me to tell if it has been disabled, or if I just don't
know the credentials. From a security point of view, I have no choice but to
assume there is an active and working telnet service running on the router, and
that I am not in control of it, either the tech support for Virgin, who have
never shown themselves to be very technically knowledgeable, or the developer
of the router software who I do not trust with security due to the next issue,
is the one that holds a key to my home network security. That's not good enough.

#### Plaintext Passwords

If you have done any development on systems that have passwords you will know
the rules of storing passwords:

1.  Do not store passwords in plaintext.
2.  DO NOT store passwords in plaintext.

This is such a fundamental rule, I cannot express how important it is. What it
means is that after you have entered the password into a website/device/app it
is actually impossible to retrieve it. The password isn't even 'encrypted', it
no longer exists. However it is still possible to check someone has the correct
password. Here is an analogy:

1. Let's equate passwords to paint colours.
2. When I set my password (red), the system will mix it with it's own colour
   which never changes, blue for example, and then store the result, which is
   purple.

3. If I want to 'log in', I give it my shade of red, it mixes it to form purple,
   and can see that it matches the purple it has on file.

4. However, if the system is broken and someone steals the purple, it's only
   a mixture and they cannot separate the colours that originally made it up.

People who know password security well might pick holes in the finer details of
this analogy, but I think it explains the concept well enough. It is possible
to store a password in such a way that you can know if someone has the correct
password, but without storing enough information to ever get back to that
password.

Now that explanation is out the way, you might have guessed what is coming.
**The SuperHub stores passwords in plaintext**. There is no excuse for this,
there is no technical reason why it needs to do this, it is just totally
unacceptable.

So far I have found 2 ways to get access to the passwords for the router. This
information would then enable an attacker to get the WiFi password and join
the secured network, or perform various other attacks on the internal network.

##### Exploit 1

When logged in to the router, clicking on the 'change password' link will take
you to a page with 2 password boxes _pre-filled_ with the current password.

The second rule of passwords: never send the password back to the user.

This is again, totally unnaceptable practice, and in fact the first time I have
encountered this in a real product. Again, I can't express how terrible this is,
and if this made its way into a product I was managing the development of,
someone would be fired because of it. It's that serious.

##### Exploit 2

This is a little less obvious, but when you back up the router configuration,
the configuration file it sends you contains all the usernames and passwords
clearly available for anyone who wants to read them. It would be very easy to
leave the remote management site logged in on a public computer, or in a
similar situation, and any attacker can easily download the file. For less
technically knowledgeable users, this is also a prime candidate for social
engineering exploitation.

![Superhub Configuration Password Dump](/posts/images/superhub-2.png)

Not only are all the passwords here, they are here again and again and again. I
have carefully omitted the password for the account which actually works on the
web interface, but I can assure you that each account's details are here at
least 3 times each. This doesn't actually pose any more of a security risk than
the passwords being stored once, but shows incomptance on the part of the
system's developers, there is almost no situation in which you would need to
store the passwords multiple times.

<hr/>

I am very disappointed to see these security flaws in the SuperHub, for the amount we are paying for our internet connection you would have thought Virgin
would include a high-end router, but sadly not. This also makes me angry because
I know not to make these mistakes, I know how to avoid problems like these, and
I am just a university student. Someone being paid to develop systems like this
should know better, and the fact that these flaws exist is an embarrasment to
the industry.

One final thing to note is the implication of there being this many obvious
security issues. If a non-expert like myself managed to find these within a few
hours of owning a SuperHub, what could an expert find in a few days of research,
or what is there lying underneath the surface just waiting to be exploited? I
have no confidence in the ability of the developers based on what I have seen
today, and I would never voluntarily put a network's security in their hands.
I have raised these issues with Virgin Media and will be making a formal
complaint.
