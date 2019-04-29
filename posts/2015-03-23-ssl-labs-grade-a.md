---
date: "2015-03-23"
layout: post
preview:
  Qualys have become well known in the recent crop of SSL and TLS vulnerabilities
  as a first-responder with automated testing and validation, but scoring top marks
  on their SSL Labs test can be difficult. I explored what was required to score full
  marks.
redirect_from:
  - /2015/03/ssl-labs-grade-a
slug: ssl-labs-grade-a
title: Achieving Full Marks on Qualys SSL Labs
theme: near-black-light-yellow
---

Qualys have become well known in the recent crop of SSL and TLS vulnerabilities as a first-responder with automated testing and validation. Their [SSL server test](https://www.ssllabs.com/ssltest/index.html) checks for protocol support, key exchange security, and the security of the certificate used.

After deploying TLS on my website, I checked the configuration and was disappointed to be awarded a C grade. Fixing this was not a simple process, and I encountered a few issues along the way, this post is my experience attempting to implement a secure TLS deployment that follows modern best practices.

Note: TLS is the successor to SSL. I have therefore used the term TLS, however many places, including nginx's configuration, still refer to it as SSL.

---

The deployment setup used a basic [nginx](http://nginx.org/) and [Gunicorn](http://gunicorn.org/) configuration that I found online. It was out of date and not designed to be secure, so the initial grade C from SSL Labs was unsurprising.

##### Certificate

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="100">
    100%
  </div>
</div>

##### Protocol Support

<div class="progress">
  <div class="progress-bar progress-bar-warning" role="progressbar" data-value="70">
    70%
  </div>
</div>

##### Key Exchange

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="80">
    80%
  </div>
</div>

##### Cipher Strength

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="90">
    90%
  </div>
</div>

<div class="alert alert-danger">
    This server is vulnerable to the POODLE attack. If possible, disable SSL 3 to mitigate. Grade capped to C.
</div>

---

The first warning was that the server was vulnerable to the POODLE attack, and therefore capped to a grade C.

The POODLE attack allows a 'man in the middle' attacker to force a downgrade of the connection from one of the newer TLS protocols (1.0-1.2) to SSL 3. This older protocol itself is vulnerable, allowing 1 byte of plaintext to be revealed in, on average, 256 requests.

Some implementations of TLS, when using CBC mode ciphers, are also vulnerable.

As the warning explained, the solution to this was as simple as disabling SSL 3, which required a quick modification to the nginx configuration.

<script src="https://gist.github.com/danpalmer/6b6f5e06e3c8edc35061.js"></script>

---

<div class="alert alert-warning">
    The server supports only older protocols, but not the current best TLS 1.2. Grade capped to B.
</div>

Removing the cap for POODLE raised the grade to a B, but it was still being capped due to lack of support for TLS 1.2. Thankfully this was just as easy to fix.

<script src="https://gist.github.com/danpalmer/5ea49ab65ff1994d257c.js"></script>

---

<div class="alert alert-warning">
    This server's certificate chain is incomplete. Grade capped to B.
</div>

Unfortunately the score was still capped to a grade B because the certificate chain was incomplete. _What exactly does this mean?_

TLS provides both _encryption_ of the data being communicated, and _validation_ that the other party is in fact who they say they are. The remediations undertaken so far have been to fix aspects of the encryption, but this one deals with validation.

The server's X.509 certificate, that is provided by the _certificate authority_, is a statement that the server's private key is trusted, and is signed with the certificate authority's key. This means that a client can issue a challenge to the server which it will respond to, and then validate that the response comes from the same private key that the certificate authority validated.

In practice, there are often multiple layers of trust. A reseller (such as [Gandi.net](https://www.gandi.net/)) may resell certificates from [Comodo](https://www.comodo.com/), who sign requests with their USERTrust certificate, which is itself signed by their AddTrust certificate. This last certificate is what is called the "Root CA", it's a certificate that is trusted by default by browsers, operating systems, and devices, and any other certificate with a signing chain that reaches it will also be trusted.

Browsers and operating systems are smart enough that if they see a certificate, such as the one for `danpalmer.me` that is signed by another they don't recognise, they will attempt to retrieve that, and follow the chain. However this process takes time, slowing the TLS handshake and therefore the site as well, and is considered bad practice, hence the cap to grade B.

Getting the intermediate certificates is as easy as concatenating the certificate data on to the end of the existing certificate. In the section "Certification Paths", SSL Labs will show the full certificate chain, and any that are missing. Searching Google for the fingerprints will often yield the missing certificate.

<script src="https://gist.github.com/danpalmer/8b991d9be7b704a322e6.js"></script>

---

<div class="alert alert-warning">
    Session resumption (caching): No (IDs assigned but not accepted)
</div>

While the grade was now high, the scores could still be improved. One suggestion given by SSL Labs was to enable session caching. This speeds up the TLS handshake after the first request.

The [nginx documentation](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache), suggests this as a reasonable configuration for a small to medium sized website. Larger sites may wish to tune their session cache for their traffic profile.

<script src="https://gist.github.com/danpalmer/3a312e839d5647b2277e.js"></script>

---

Unfortunately TLS caching, while good practice, did not increase the grade. The next area to tackle was _Cipher Strength_ (I could have tried Key Exchange next, but I had a suspicion this might be significantly more work).

The existing cipher suite list was `HIGH:!aNULL:!MD5;` (the syntax is explained in the [OpenSSL Cipher List Format documentation](https://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT)), which translates roughly to:

- "High" strength ciphers, those with key lengths of over 128 bits, or in some cases, those with key lengths of 128 bits.
- Disable suites that offer no authentication, such as anonymous DH or ECDH. These are vulnerable to 'man-in-the-middle' attacks.
- Disable suites using MD5.

After reading the documentation, it was immediately obvious that `eNULL` was missing from this list, meaning that suites which offer no encryption at all are not disabled. This may not be an issue if the aim of using TLS is to authenticate who you are, but in the case of encrypting traffic, this is a huge issue.

Mozilla provide several recommended lists on their wiki page for [Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) which are tuned for different trade-offs between security, and support for older browsers and devices. As I was not aiming to support legacy devices and browsers, I chose the "modern" list, and extended it with GCM mode DHE ciphers.

```
ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!LOW:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS;
```

Notably, this list disables a large number of old suites based on MD5, DES and Triple-DES, RC4, pre-shared keys, and the NULL suites. Unfortunately, this also did not improve the grade.

---

At this point I consultated the [documentation for the tests conducted by SSL Labs](https://www.ssllabs.com/downloads/SSL_Server_Rating_Guide.pdf). This explains how the scores are calculated for different suites based on key length:

- 0 bits (no encryption) 0%
- < 128 bits (e.g., 40, 56) 20%
- < 256 bits (e.g., 128, 168) 80%
- > = 256 bits (e.g., 256) 100%

For calculating the final score, the following algorithm is used:

1. Start with the score of the strongest cipher.
2. Add the score of the weakest cipher.
3. Divide the total by 2.

This means I needed to remove the 128 bit cipher suites. This results in the following list:

```
ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!LOW:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS
```

While this does increase the score to 100% for _Cipher Strength_, it does so at the cost of support for many devices, notably Android pre-4.4, Internet Explorer before version 11, and anything before Windows 7.

##### Cipher Strength

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="100">
    100%
  </div>
</div>

---

The next area for improvement was _Key Exchange_ with a score of 80. Looking at the [SSL Labs docs](https://www.ssllabs.com/downloads/SSL_Server_Rating_Guide.pdf)...

> For suites that rely on DHE or ECDHE key exchange, the strength of DH parameters is taken into account when determining the strength of the handshake as a whole. Many servers that support DHE use DH parameters that provide 1024 bits of security. On such servers, the strength of the key exchange will never go above 1024 bits, even if the private key is stronger (usually 2048 bits).

The solution to this is to generate a larger 'P' component for the DH key exchange. This is just a large prime number, but by default, OpenSSL does not generate a very large one, because it is computationally expensive to do so. Generating a new one is easy, but takes a while. The value does not have to be kept private, in fact it is published in the TLS handshake, however it should be one generated by a trusted party.

```
openssl dhparams -out dhparams.pem 4096
```

Once the parameters were generated, I updated the nginx config to use it.

<script src="https://gist.github.com/danpalmer/ff81fd1453a9999facbd.js"></script>

This achieved 10 more points on _Key Exchange_, but was limited because the actual private key was only 2048 bits. Increasing the private key to 4096 bits raised this to 100.

##### Key Exchange

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="100">
    100%
  </div>
</div>

---

The final section to tackle was _Protocol Support_. From the SSL Labs documentation:

> Protocol Score
> SSL 2.0 0%
> SSL 3.0 80%
> TLS 1.0 90%
> TLS 1.1 95%
> TLS 1.2 100%

> 1.  Start with the score of the best protocol.

2. Add the score of the worst protocol.
3. Divide the total by 2.

While my website doesn't need to support lots of different browsers (it's not an ecommerce site), I do want some people to be able to access it. I checked the handshake simulation in the report from SSL Labs to see what would fail if TLS 1.2 support was removed.

##### Handshake Simulation

| Platform                     | Cipher Suite                          | Result |
| ---------------------------- | ------------------------------------- | ------ |
| Android 2.3.7                | Protocol or cipher suite mismatch     | Fail   |
| Android 4.0.4                | Protocol or cipher suite mismatch     | Fail   |
| Android 4.1.1                | Protocol or cipher suite mismatch     | Fail   |
| Android 4.2.2                | Protocol or cipher suite mismatch     | Fail   |
| Android 4.3                  | Protocol or cipher suite mismatch     | Fail   |
| Android 4.4.2                | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | 256    |
| BingBot Dec 2013             | Protocol or cipher suite mismatch     | Fail   |
| BingPreview Jun 2014         | Protocol or cipher suite mismatch     | Fail   |
| Chrome 39 / OS X R           | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA    | 256    |
| Firefox 31.3.0 ESR / Win 7   | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA    | 256    |
| Firefox 34 / OS X R          | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA    | 256    |
| Googlebot Jun 2014           | Protocol or cipher suite mismatch     | Fail   |
| IE 6 / XP No 1               | Protocol or cipher suite mismatch     | Fail   |
| IE 7 / Vista                 | Protocol or cipher suite mismatch     | Fail   |
| IE 8 / XP No 1               | Protocol or cipher suite mismatch     | Fail   |
| IE 8-10 / Win 7 R            | Protocol or cipher suite mismatch     | Fail   |
| IE 11 / Win 7 R              | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA    | 256    |
| IE 11 / Win 10 Preview R     | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | 256    |
| IE 11 / Win 8.1 R            | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | 256    |
| IE Mobile 10 / Win Phone 8.0 | Protocol or cipher suite mismatch     | Fail   |
| IE Mobile 11 / Win Phone 8.1 | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA    | 256    |
| Java 6u45                    | Protocol or cipher suite mismatch     | Fail   |
| Java 7u25                    | Protocol or cipher suite mismatch     | Fail   |
| Java 8b132                   | Protocol or cipher suite mismatch     | Fail   |
| OpenSSL 0.9.8y               | Protocol or cipher suite mismatch     | Fail   |
| OpenSSL 1.0.1h               | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | 256    |
| Safari 5.1.9 / OS X 10.6.8   | Protocol or cipher suite mismatch     | Fail   |
| Safari 6 / iOS 6.0.1 R       | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | 256    |
| Safari 7 / iOS 7.1 R         | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | 256    |
| Safari 8 / iOS 8.0 Beta R    | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | 256    |
| Safari 6.0.4 / OS X 10.8.4 R | Protocol or cipher suite mismatch     | Fail   |
| Safari 7 / OS X 10.9 R       | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | 256    |
| Yahoo Slurp Jun 2014         | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | 256    |
| YandexBot Sep 2014           | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | 256    |

This confirms that it's only out of date browsers and devices that fail. Of those that succeed, they all managed to connect with TLS 1.2, so I removed TLS 1.1 support.

<script src="https://gist.github.com/danpalmer/0eeceddaac6bfa0dfa16.js"></script>

This raised the score for _Protocol Support_ to 100%.

##### Protocol Support

<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" data-value="100">
    100%
  </div>
</div>

---

At this point, the individual scores were as high as they could be, but the grade was still only an A, not the elusive A+.

The last thing needed to achieve an A+ is HSTS. This is a mechanism for preventing downgrade attacks. Servers can specify a header in HTTP responses that tells clients not to accept an unsecured connection for a given amount of time. If the client attempts to reach the server after seeing this header, and is unable to do so over a secure connection, it will refuse to connect.

<script src="https://gist.github.com/danpalmer/3aacb008a43cda26058a.js"></script>

<div class="alert alert-success">
    This server supports HTTP Strict Transport Security with long duration. Grade set to A+.
</div>

---

While the steps so far achieved the top grade, there was still one best practice that could be added: OCSP Stapling.

The Online Certificate Status Protocol created a large load for the certificate authorities, as the certificate had to be checked to ensure it hadn't been revoked for every TLS session. Stapling moves that load to the server that is presenting a certificate. They must retrieve a signed OCSP response from the certificate authority and deliver it to the client as part of the session handshake.

This was tricky to implement due to the server itself, in this case nginx, requiring outbound network access. In addition, as the OCSP response must be validated, nginx needs the certificate of the appropriate certificate authorities for validation, this can be done by pointing nginx at the server's certificate store.

The main issue in implementing OCSP stapling that nginx does not use the system provided DNS servers, and therefore has no way of resolving the hostnames of the OCSP servers. Adding the [Google DNS](https://developers.google.com/speed/public-dns/docs/using) services was easy enough.

The ideal situation would be to run a local resolver that uses the system's default DNS resolution (which it should get from DHCP), or even a custom resolver that _only_ responds for lookups for domain names of the OCSP servers, but these solutions are out of the scope of this blog post.

Note that nginx's uses a per-worker cache for OCSP responses, with no sharing between processes, and therefore the first request to each worker will not receive an OCSP response, but will cause that worker to get it for future requests.

<script src="https://gist.github.com/danpalmer/0151c008b14162e7b091.js"></script>

---

After implementing all of these changes, I was left with a very secure TLS deployment that followed most best practices. It is far from the most _compatible_ deployment, and therefore inappropriate for websites that depend on traffic, especially from legacy devices, however the process itself taught me a lot about the intricacies of TLS configuration.

You can find the current SSL Labs report for danpalmer.me [here](https://www.ssllabs.com/ssltest/analyze.html?d=danpalmer.me). If you see any problems, please do let me know. I will attempt to keep this post up to date with developments in TLS deployment.
