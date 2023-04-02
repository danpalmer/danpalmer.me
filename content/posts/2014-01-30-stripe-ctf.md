---
date: 2014-01-30
layout: post
aliases:
  - /2014/01/stripe-ctf
  - /stripe-ctf
title: Stripe CTF 3.0
featured: true
---

Last Wednesday, [Stripe](http://stripe.com/) started their 3rd [Capture the Flag](http://stripe-ctf.com) competition. As a provider of online payment services, security has been critical to them, so over the last few years they have run two CTFs based around hacking and securing systems. This year they chose a different subject: distributed systems.

The CTF happened over the course of the last week, and consisted of 5 levels of supposedly increasing difficulty, with many participants hanging out on the IRC channels and creating a fun community that was full of innovative ideas.

I felt I learned loads over the course of the CTF, so this post is a summary of the failures and successes along the road to completion, and some speculation about what could be the main lessons to take away from it.

## Level 0

First off: write a spell checker. The requirements were a program that would take in the path to a dictionary file (e.g. `/usr/share/dict/words`), and accept a plain text file input from `STDIN`, preserving new lines and spaces, returning a version marked up with anything not found in the dictionary wrapped in angle brackets.

The catch? It had to be fast. The reference implementation, in Ruby, took ~6 seconds, but you needed approximately a 10x speedup to pass.

I'd been wanting to learn more Haskell for a while, so a simple challenge like this was the perfect opportunity to try it out on a 'real' problem. My first version essentially copied the orignal, using a linked list for the dictionary, but it wasn't fast enough. I then tried a hash set, and a trie, neither with much success. I also tried parallelising it, which was really easy to do with Haskell, but unfortunately even that was too slow.

My friend [Elliot](http://elliothughes.me) ended up re-writing my implementation to use `ByteString` instead of `String`, after finding some of the brilliant [profiling tools in GHC](http://book.realworldhaskell.org/read/profiling-and-optimization.html). This saved a huge amount of overhead and would have passed.

By this point I had noticed people on the IRC channel talking about Ruby solutions, so I decided to try some different data structures in Ruby. I had initially ruled out Ruby thinking it would be too slow, but with only a few lines to turn the list into a hash, I had a version that beat the level.

<script src="https://gist.github.com/danpalmer/fa709862181589a59bb7.js"></script>

## Level 1

Many people use Git for version control, but despite everyone and their [doge](http://dogecoin.com) having their own cryptocurrency, a Git based currency has yet to take off. In many ways, Git is a good candidate for a cryptocurrency: the commit history acts a bit like the block chain, commits are hashed with SHA1, which is very secure, and it's distributed.

For Level 1, Stripe had set the challenge of 'mining' a Gitcoin. This meant generating a commit that updated a ledger file to include your new bitcoin, but with the condition that the SHA1 hash of the commit had to be lexicographically _lower_ than a particular difficulty. For an added challenge, players were racing against Stripe's servers that mined a gitcoint about once a minute.

The reference implementation, a Bash script, did this by repeatedly attempting to make a commit with some random information in the message, finally making the commit and pushing the changes when it succeeded.

The downside of this approach was that in the process of calling out to git there was a heavy reliance on I/O and the filesystem. This would be the main bottleneck, so I decided the best way to optimise the process was to work out what the hash of a commit _would be_ if it were made, without touching the filesystem.

My implementation had issues with new lines in the process of sending the final correct commit message to git, and took a while to get working, but ended up mining a gitcoin in under 30 seconds.

This level had an extension, that was a public gitcoin repository which people could compete between each other on to mine the most gitcoins. I didn't attempt this because by the time I got to this point, other players had GPU based mining written, and I wanted to move on to level 2!

## Level 2

The scenario for level 2 was interesting. You're running a web service, but it's experiencing a Distributed Denial of Service attack. Create a proxy that allows legitimate traffic through, but bans malicious traffic.

The reference implementation proxied all requests, but provided code stubs which could be filled out to categorise and ban traffic.

My first implementation stored a counter of requests for each IP address, and a deferred decrement of the counter back to its original value. Then checking the counter for an IP address would give a reasonable idea of how many requests it was making in a short period of time.

<script src="https://gist.github.com/danpalmer/41bc5a45b9c76d0b5593.js"></script>

This didn't work immediately, but with tuning I think it should have been able to beat the level. During testing though, I noticed that players were penalised for leaving the backend web service 'idle'. This was a little confusing, because clearly malicious traffic shouldn't be allowed through just to keep the service busy, but I took it on board, and realised a pattern to how test requests were being made. Legitimate sources never requested more than 10 times. I changed my code to reject everything after the first 10 requests, and scored well enough to pass. I realised I was gaming the tests a bit, but I moved on to the next level.

## Level 3

Until this point, I had spent relatively little time on each level. The first took an evening, mining a gitcoin took less than a day, and level 2 took less than an hour. But this level dramatically changed things.

The problem was distributed, full-text, search. We were allowed 3 search nodes and a master search server, each of which would be spun up and given time to index a filesystem. After 4 minutes, or when the nodes reported ready, the test would start sending search requests, to which the nodes had to respond with a list of filenames and line numbers where the term was found.

The first thing I noticed was the way that the master search server was distributing requests to the search nodes.

<script src="https://gist.github.com/danpalmer/f56249f06487070619b6.js"></script>

The reference implementation we were given was in Scala, which I had no experience in, but in this function it was clear that the requests were being sent to all nodes, and only read from the first. I quickly changed this code to a round-robin style request so that each node was used in turn. This sped up the system a little, but not drastically.

Next, I found that the searching code was only storing filenames in the index, reading each one off the disk each time a search was made. I thought an index would be good here, but as a basic implementation I decided to store the full text in memory for faster searching. This gave a massive speed increase, and in the end indexing wasn't necessary to get a passing score.

After many test runs, I realised that the test harness was sending requests synchronously, waiting for each response and timing it, before moving on to the next. This was not only unrealistic, but also meant my round-robin scheduling would be providing almost no benefit. I decided to shard the searching instead, giving each node the responsibility of searching only a portion of the filesystem.

Sharding the index was easy, but with almost no Scala skills, and the serve making heavy use of clever Scala language features, and Twitter's Finagle framework, concatenating the results from the 3 servers was tricky. In the end I had the following code.

<script src="https://gist.github.com/danpalmer/95e878308584ef3d7057.js"></script>

The difficult part was that the response objects from each search node were actually in a sequence of `HttpResponse` object wrapped in `Future` monads. By collecting these results, it could be transformed into a `Future` containing a sequence of `HttpResponse` objects. It's tricky to describe, but this meant the collection of responses could be treated as if they had arrived, even if they had not, and could be concatenated before being mapped to a new `Future` of a single `HttpResponse` to be sent to the client.

This sharding implementation was enough to push my solution over the required score, and I was on to level 4.

## Level 4

The challenge in level 4 was to implement a distributed, fault-tolerant, SQL database. We would have 5 database nodes, with a lossy and unpredictable network linking them. Each would then receive queries and would have to keep the data in sync. Incorrect responses, and crashed processes, were grounds for disqualification of that test run, and network traffic gained _negative_ points, while correctly executed queries gained a significant number of points.

The reference implementation was a Go server that proxied requests to a SQLite database. It would only accept queries on the primary node which replicated data to others, had a rudimentary method for identifying network failure, and would then fail-over to a new primary node with a very poor fail-over algorithm.

It was obvious that a proper leader election algorithm would be required, but looking back over the Distributed Systems course I took at uni a few years ago, most of the algorithms were about mitigating node failure, and assumed a stable network, rather than the other way around.

Reading some of the helpful 'beginners' reading material provided on the level's description, I found that [Paxos](<http://en.wikipedia.org/wiki/Paxos_(computer_science)>) was the typical algorithm for this, and [Raft](https://ramcloud.stanford.edu/wiki/download/attachments/11370504/raft.pdf) was a simpler, newer algorithm that was gaining popularity. Luckily, I found the project [goraft](https://github.com/goraft/raft) which implemented all the consensus and leader election functionality. It even had an example project, which looked strangely familiar... It turned out the sample project had formed the basis of the reference implementation we were given.

I ended up having 3 main issues with this level: sockets, elections and proxying.

Firstly, so that the test framework could easily modify network conditions, it used unix sockets for networking. Unfortunately very few network oriented systems design for this as an option, so configuring goraft to use unix sockets for all of the parts of its communication took a while. A useful hint from [@gdb](https://twitter.com/gdb) pointed players in the direction of a commit he had made to goraft that would help with this issue.

The next issue was that leader election had some race conditions in goraft, and these were triggered for many people on the remote testing services, but not their local testing, or vice-versa. Thankfully one of the goraft developers was on the case, and submitted several pull requests to the project that fixed these issues, and after I had pulled them into my own fork of goraft, I no longer had stalled elections.

The last issue was one of the first I tackled, but I had massively underestimated how the network could affect it. In a real-world system, the requester should be responsible for talking to the primary node, and a non-primary node could 'forward' a response by returning a 301 Moved Permanently response. Unfortunately the test framework didn't respect these, and would retry a request every 100ms until it was answered. This meant to get the throughput required, a non-primary node would need to proxy the request to the primary node, and return the output again.

My first implementation of this was naive, essentially just making another HTTP request and returning the result. But with some help from [@ KennyMacDermid](https://twitter.com/KennyMacDermid), I realised that the network might fail before or after the query had actually been committed, and I couldn't differentiate between the two cases.

The only way to identify a successful query was to intercept it when that same query was made back on the node that was parodying the request, when raft sent it back for replication. This indicated that the primary node had accepted the query, and the network should include it.

After learning how to use channels in Go, with a bit of help from [@ElliotJH](https://twitter.com/ElliotJH), I submitted my final implementation and captured the flag!

---

## Review

It was clear from the outset how much effort the team at Stripe put in to making the CTF as easy to take part in, enjoyable, and educational as possible.

Every level was delivered as a git repository, with a test harness that could be run locally, and a remote server that would score your solution when you pushed it, printing the results directly into the git output (similar to Heroku code pushes).

Every level had a reference implementation that could be used as a basis for building a solution, with well written code (except for the bits that were supposed to fail). The level descriptions all included a full background to the problem, with links to related reading material that might help solve it.

The range of languages: Ruby, Bash, JavaScript (Node), Scala and Go, covered a large range of paradigms, and although lacking a purely functional language, provided a really well rounded foundation for the levels that posed a challenge at one point or another for everyone taking part.

Finally, the community on the IRC channel was fantastic, and the staff on hand to fix problems on the test servers, explain challenges in more detail and provide hints were a huge help to many of us.

## What I've Learnt

The last week has been a great learning experience, and one I think every software developer should do every so often. It has forced me to learn quickly about a range of topics, and also given me a taste of some programming languages that I hadn't considered using much before.

I'll definitely be keeping more of an eye on the Scala community, and having had the opportunity to use some of its more functional aspects, I think it could be a great general purpose language, and also a good one for me to use in the process of learning Haskell, from which it takes many of its design choices.

The Raft algorithm for distributed consensus was really interesting to learn about. I hadn't come across it before, but it's made me think about possible research topics for the research project I'll be doing this semester.

A slightly different thing I have learnt however, is that its important to be pragmatic about optimisation. Most of the failed solutions I tried weren't bad, they were just solving the _wrong_ problem. In the end, looking at the logs, working out the exact process of what was happening in the test, and then fixing _that_ case ended up being the most effective way to solve the problems.

Knowing the size of the problem also helps, because sometimes holding all the documents in memory and doing a searching them fully is a better solution than building a complex and error prone indexing system and keeping files on disk. Even easier, perhaps it's just a matter of sharding the search space?

---

Thanks to Stripe for putting on another enjoyable and educational CTF. I'm already looking forward to the next.
