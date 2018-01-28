---
layout: post
title: A Crowdfunded Cryptography Nightmare
slug: crowdfunded-cryptography
---



Today I found [DyNAcrypt](http://www.indiegogo.com/projects/dynacrypt-introducing-the-fractalizing-random-abstraction-ciphering-transputer/x/4092978) on IndieGoGo, and was disappointed to see yet another example of terrible cryptography practice in a project looking for crowdfunding.

I don't know whether the creators of DyNAcrypt are trying to scam people, or just ignorant, but either way, I'm going to go through some concerns I had while reading the project description. Reading the project description, and watching the video strongly suggests that the project creators are 'trolling', making very obvious technical, and grammatical, mistakes. Even if this is the case, there *are* people who still get cryptography as wrong as this project does.
- - -

> Most encryption methods (algorithms) in use today, are well-established and/or thoroughly documented. This presents at least three major problems: powerful computers can be set-up to work out encryption keys, or; make repeated attempts to guess the encryption pin, password, or keys, and; some encryption solutions have provided back-door mechanisms to allow those who feel they must, to have access via a secretly easy way in.

Most encryption methods in use today are well-established and thoroughly documented. This is a *good thing*. [Kirchoff's Principle](http://en.wikipedia.org/wiki/Kerckhoffs's_principle) is that a cryptosystem should be secure, even if the enemy knows every detail about the system, as long as the key used is secret.

The reason for this is that it is really easy to work out how a system works, and reverse engineer it, but often difficult to crack the key used. This was the first thing I ever learnt about cryptography, and I've seen it confirmed time and time again.

Also, the first two 'reasons' given in that section are actually the same, and the last one doesn't follow from the original statement in any way. This isn't a flaw in their cryptosystem, it just betrays a general lack of thought and consideration to how the systems actually work.

> Some of the most popular encryption methods are based on algorithms conceived in the previous century, when technology could only achieve a tiny fraction of the throughput possible today.

This is true, and it's the reason why 10 years ago a 512-bit RSA key was sufficient, but has now been broken. However one-time-pads are a provably 'perfect' encryption mechanism and were invented in 1882. Many encryption standards invented in the last 30 years are still acceptable today if large enough keys are used.

> Without the correct 'keys', there is simply not enough information in the encrypted file to ever decrypt it, even if the algorithms had been published in detail!

Then show us.

> Absolute secrecy of the algorithms involved; this means there are no public white-papers, patents, or articles, describing the algorithms created for DyNAcrypt.

I heard a story once about a proprietary cryptosystem being sold to businesses that ended up being just an XOR with some static data.

> Use of the DyNAcrypt algorithms will be by means of an ASIC (silicon-chip for a specific purpose) with the algorithms securely embedded within. At no stage will the algorithms be publicly available in software, thus removing the possibility of the algorithms being hacked / reverse-engineered.

Dedicated hardware for cryptography isn't such a bad idea, in fact many banks and other businesses who needed very secure crypto use [Hardware Security Modules](http://en.wikipedia.org/wiki/Hardware_security_module) to isolate their encryption. However if you have access to the physical hardware, it is usually possible to recover the keys or algorithms being used.

A quick search on [Mendeley](https://mendeley.com) for the term "ASIC analysis" turned up a few papers on analysing computation being performed on ASICs.

 - [Power-analysis attack on an ASIC AES implementation](http://www.mendeley.com/catalog/poweranalysis-attack-asic-aes-implementation/)
 - [Differential power analysis of AES ASIC implementations with various S-box circuits](http://www.mendeley.com/catalog/differential-power-analysis-aes-asic-implementations-various-sbox-circuits/)

I don't know this subject area, but even just a cursory glance at literature appears to indicate that it might be possible to retrieve information from a running ASIC. Similar methods of power analysis have been used to [crack the MIFARE DESFire triple-DES implementation](http://www.iacr.org/workshops/ches/ches2011/presentations/Session%205/CHES2011_Session5_1.pdf).

> DyNAcrypt can use and generate, keys of up to 2,048 bits. This means there are way-more possible 'keys' than there are, 'atoms in all the humans combined on the planet today'!

The key length means very little without an understanding of the algorithm. RSA keys currently need to be 2048 bits or more to have a reasonable assumption of security, but AES keys are typically 256 bits. AES is no 'less secure', it's just a very different type of algorithm, and therefore it is relatively meaningless to compare key sizes. As for the comparison to the number of atoms in the human race, this is also meaningless and serves only to give those without an understanding of cryptography a false sense of security.

> DyNAcrypt uses brand-new algorithms, with extremely special mathematical properties, that have surprisingly remained un-invented until now, and therefore undocumented anywhere on the Internet.

It's not impossible that they have invented a new algorithm, but it seems very unlikely. Of course without publishing the algorithm, we have no idea whether they are telling the truth about this or not.

> These mathematical properties would no-doubt be patentable, but if patented would result in the secrets of the algorithms becoming accessible, to everyone, including criminals trying to access your private data. Thus we have decided against publishing and/or patenting at this time, to provide further protection and peace of mind.

This gives me the opposite of 'peace of mind', it gives me great cause for concern.

> We asked 107 people via Twitter:
> "Assuming the on-line service only stored your file whilst it processed it, and then completely removed it from the system once complete: Would you use a secure on-line encryption service to encrypt your files?"
> Yes: 38 - Maybe: 33 - No: 36

All this tells me is that 66% of people are ignorant about security issues. Sending unencrypted files to an untrusted party is asking for trouble. If you're trying to emphasise security, this just isn't how you go about doing it. Instead an approach like [MEGA](https://mega.co.nz) where encryption is done in the browser before transmission, and the keys never hit the remote servers is a much better system.

- - -

The "frequently asked questions" section of the project description is just as bad as the rest...

##### Anything I wanted to encrypt I would encrypt using one of the plethora of free encryption tools available today.
> How secure are these free products, and why are they free?

They are free because thousands of developers donate their time and effort to making them publicly available and highly secure. The open-source community has a much better track record of secure software, and fixing security flaws in insecure software, than that of the commercial software industry.

##### The very idea of transmitting, unencrypted, something I wanted to encrypt over the internet completely defeats the purpose of doing so.
>Would you do online banking on your banks secured https website? We would use the same secure protocol for the upload and download of your files.

You might use HTTPS, but you still receive an unencrypted file and store it for a period of time on your servers.

##### If the service went offline, would I be stuck with unusable files?
> We plan to provide at multiple servers from the start, to help avoid any downtime. The absolute best protection against this possibility, would be to own your own DyNAcrypt Encryption device.

Another reason for public encryption protocols is that you don't have to rely on a single provider, their availability, reliability, pricing, or security. You have the choice to move to another provider, or even implement your own system.

##### If Google/Apple and the like can be back doored by the NSA, then anyone can.
> The algorithms do not provide a back-door to anyone.

The algorithms don't have to. The NSA have intercepted data in data centres before it has been stored in an encrypted form. In fact it's because [Lavabit](https://lavabit.com) were instructed to do allow for this that they shut down. This has nothing to do with the algorithm.

##### Unless the encryption algorithm is public, I wouldn't trust it.
> We are extremely confident that the algorithms within the ASIC's, are undiscoverable, and believe this secrecy can only multiply the security of your encrypted files. Other encryption algorithm providers, may not see this benefit.

The fact that the project creators have discovered the algorithm themselves shows that this is just wrong, but even if the algorithm isn't rediscovered by someone else, I suspect there are ways to recover some detail about the algorithm and keys from the ASIC. Recently a 4096 bit RSA key has been recovered from a computer with [acoustic cryptanalysis](http://www.cs.tau.ac.il/~tromer/acoustic/) - a fancy way of saying they pointed a microphone at it.

- - -

These points only scratch the surface of what's wrong with this project. It might be an over-engineered joke, it might be a scam, but these problems exist in many real-world products and cryptosystems.

I hope the project doesn't reach the required funding level, bad cryptography can be dangerously misused. However looking at how much funding has been pledged, I doubt that will be a problem.