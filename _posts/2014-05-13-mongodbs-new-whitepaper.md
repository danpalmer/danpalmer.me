---
layout: post
title: MongoDB Misinformation
slug: mongodbs-new-whitepaper
---



MongoDB, [the company behind MongoDB](http://www.mongodb.com/press/10gen-announces-company-name-change-mongodb-inc) published a new whitepaper this month, about 'quanityfing business avantage'. As I've recently completed a research project at university where I critically analysed the design decisions taken in MongoDB, I thought it would be interesting to see how the company sells it. I'll write about my research sometime, but for now, I'm going to pull out a few quotes from the whitepaper. You can download the paper [here](http://info.mongodb.com/rs/mongodb/images/MongoDB_Quantifying_BizAdvantage.pdf), that's a directly link so you don't have to sign up to their newsletter to get a copy.

> A Tier 1 investment bank rebuilt its globally distributed reference data platform on a new database technology, enabling it to save $40M over five years through reduced infrastructure and development costs, coupled with the elimination of regulatory penalties.

This sounds pretty great. Obviously it makes no mention of what proportion they saved, $40m saving on $1bn isn't particularly great, but I'll assume it was quite a significant saving. I wonder what platform they were using before? From what I've seen, many of these large enterprises are using things like MSSQL on Windows Server, which means licencing of thousands of dollars a year *per CPU core*. Alternatively if they were on IBM mainframes, which is not unlikely, they could have been paying extortionate amounts for hardware and software.

It sounds much more plausible that this saving was due to a switch from Windows to an open-source alternative - even paying RedHat for support would probably be much cheaper. On top of this, changing the database from one where you have to pay per core it runs on, to one where it's free for everything but support would save a large amount as well, and you could achieve the same with Cassandra, buying support from DataStax or Acunu, or Postgres with any one of a large range of commercial support options.

> MetLife prototyped a new critical business application in two weeks, and deployed to production in just 90 days. It had been trying for 2 years to build the same application with a relational database.

As far as I can see, document oriented databases such as MongoDB provide roughly the same abilities as relational databases (in fact it has been shown that MongoDB provides full support for the relational model, just slowly). If the problem isn't suitable for a relational database, then it's probably either much simpler, and could be modelled with a key-value store, or it's a graph problem, in which case a graph database would be the most appropriate solution.

I realise this might just be my lack of experience, but I have a hard time envisioning a problem that couldn't be solved in 2 years with a relational database, but could be solved in 2 weeks with MongoDB. If it had been solved in 2 weeks with Neo4j, I could believe it, but unless it made very heavy use of the schemaless design of MongoDB, and very little data is *actually* schemaless, then I can't see this being the whole truth. Perhaps after 2 years the team was restructured with an injection of new talent, they all got a load of training in MongoDB, and then managed it, but again, that's not specific to MongoDB.

> Intuit now has the agility to push application updates once per day, enabling their users to enjoy new features much faster.

This has literally nothing to do with MongoDB, and everything to do with poor internal business process.

> “Introducing technology like MongoDB to our development teams created a buzz and excitement that motivated and empowered teams to deliver work in months that would typically take years.”

This sounds more like you have employees demotivated by old and dated technology that is difficult to use, who have seen what modern software development can be like, and have jumped at the opportunity to learn new things.

- - -

The message I take away from this paper is that moving away from expensive licencing on proprietary platforms, and moving away from old development techniques and business practices results in better value, and faster development. This is in no way specific to MongoDB, however much the paper tries to claim it is. Unfortunately I think MongoDB (the company) know how to market to enterprise customers, and know the right language. The effort they put behind MongoDB (the product) is unmatched by most other open-source databases. MongoDB is really good at what they do (the company, unfortunately not the database).
