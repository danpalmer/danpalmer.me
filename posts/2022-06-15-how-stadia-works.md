---
title: How Stadia Works
date: 2022-06-15
theme: checklist-manifesto
featured: true
---

Stadia is Google's cloud gaming service. Users who sign up can play games they purchase on nearly any device, as the game runs "in the cloud". This is a new concept that has only just become possible in the last few years, with advancements in internet connections, video encoding, and web browsers.

I frequent Reddit's [r/Stadia](https://old.reddit.com/r/stadia) subreddit, and have noticed some misunderstandings about what Stadia is and isn't. This post is an attempt to clear up misunderstandings.

Disclaimer: I work for Google as a software engineer, but I don't work on Stadia. I have no insider knowledge of Stadia, its technology, or the future plans for the platform. Nothing in this post is anything I have learnt since starting at Google this year, my understanding of Stadia and everything here is based on my experience as a user before joining and in a few cases, some light speculation based on my experience as a software engineer.

---

There are 3 parts to how Stadia works...

- The servers, machines in "the cloud" that actually run the game.
- The internet connection, whether that's over a hard-wired connection, Wifi, 4G, 5G, Starlink, or anything else, is how the video of the gameplay is transferred to the user (and each of these types brings their own considerations).
- And lastly the device the player uses to play – a Chromecast or a PC running the Chrome browser, and the Stadia controller.

There are common misconceptions with each of these parts, but we'll cover them all in detail, busting some myths and helping you get a better intuition about where Stadia will work well.

### Where does the game run?

Before we get into how Stadia works, let's cover what happens without Stadia. When you play a game on a gaming PC, or a console like an Xbox or Playstation, the game's code runs on that hardware. In simple terms, a game is a loop of:

1. Get some input from the controller or keyboard and mouse.
2. Use the CPU to run the "rules" of the game.
3. Use the GPU to draw what needs to be shown to the player.
4. Display that on the screen.
5. Go back to #1

In order to hit 60 frames per second, the computer only actually has 16.7ms to draw each frame (this number is important and we'll come back to it). For now, it's just important to know that the CPU and GPU have to do a lot of work to produce each frame, and this is why gaming computers are expensive, specialist machines.

With Stadia, these computers run in "the cloud". All this means is that the computer sits in a datacenter somewhere, plugged into the internet. The process looks a little different though. If you were playing in Stadia on a PC, it would look a little like this...

1. (On your PC) Get some input from the controller or keyboard and mouse.
2. (PC) Send that to Stadia
3. (Stadia) Use the CPU to run the "rules" of the game.
4. (Stadia) Use the GPU to draw what needs to be shown to the player.
5. (Stadia) Encode that to a frame of video and send it back to the player's PC.
6. (PC) Decode the frame of video from Stadia.
7. (PC) Display the frame of video in the web browser.
8. Go back to #1

As you can see the PC here isn't doing much at all – it's only gathering input and sending it to Stadia, receiving and decoding the video, and then putting that video frame on the screen at the end. This is almost exactly what happens when you watch YouTube! The PC receives frames of video that is streamed from the internet, decodes them, and puts them on the screen. Almost all PCs are able to play YouTube videos with no problem, and that's because it doesn't need a high spec CPU or GPU, it's easy to do.

This is why Stadia is so well suited to running on Chromecasts, mobile devices, or old PCs – almost none of the work actually happens on the device!

Stadia servers aren't anything particularly special. They don't have any RGB lighting or fancy cases, but they are just a computer, with a motherboard, a CPU, a GPU, RAM, everything in pretty much the same place as you'd expect with a gaming PC. Google may have slightly different hardware in some cases, but nothing that makes Stadia servers that different from a gaming PC or console in any way that matters to you as a player.[^1]

##### Game installations

Another advantage of the whole game running on Stadia's servers, and your PC or Chromecast only receiving video, is that the device you use does not need to have the game installed. Most gamers are familiar with issues of games taking up too much space, taking ages to download and install, and having to decide whether to install on an SSD and have a fast game, but expensive storage, or install on a hard drive and have loads of room but slow loading times.

Stadia _probably_[^2] stores all the game files on network file servers, a bit like a home NAS, but bigger and faster. By doing this, many computers can share the same game files. There may only be a few copies of each game in a whole datacenter, but any computer could use those files nearly as fast as if there were on an SSD inside the computer itself.

##### Game saves

Like game installations, game saves are also not stored on the computer running the game, but instead on cloud storage of some kind. By doing this, there's a lower risk of data loss, and saves can be re-accessed from anywhere.

### Fast internet

We all know that Stadia needs a "fast" internet connection, but what does that actually mean?

Connection speeds can be measured in _bandwidth_ and _latency_. Traditionally internet is sold as faster when the _bandwidth_ is higher, this is the number of megabits-per-second (Mb/s), or if you're lucky, gigabits-per-second (Gb/s). This is important because each frame of video that you receive from Stadia is a fairly large image, and as we move to 4K gaming, more bandwidth is necessary because each image is even larger.

However, more importantly for gameplay is _latency_. This is the time it takes for any data at all to get from your computer to Stadia, and back. If you play online multiplayer games you'll know this as "ping", and a slow ping causes lag and jittery gameplay. In the same way, with Stadia, if you have a high ping or latency, the video frames will take too long to get back to your computer and the game will be impossible to play.

Google do a lot of work to try to maximise speed, both bandwidth and latency, for Stadia...

##### High bandwidth servers

The first and most obvious thing is that Google have very high bandwidth connections to the internet. This will never get in the way of your gaming on Stadia, you're only limited by the bandwidth of _your_ connection, not Google's.

##### Servers that are close to you

The next thing that Stadia does is have servers that are close to the players. This reduces the latency by just having less distance for the data to travel down the wires to you. For a connection to get from one side of the world to the other takes around 200ms. If you remember that one frame is drawn every 16.7ms, this would mean you would always be 11 frames behind, and if you count the time for input to get to Stadia as well you'll be nearly 1/3rd of a second behind, and that's under near perfect conditions. This would be terrible latency and gaming would be impossible.

Google solve this by having many datacenters for Stadia all around the world. This is why Stadia is only available in certain countries – Google know that if they launch in a country that doesn't yet have one or more Stadia datacenters, the experience will be terrible.

What does this mean for different types of internet connection?

- For home internet, as long as you're on fibre in a country with Stadia available, you should be fine.
- If you're using WiFi, 5GHz is better than 2.4GHz as it's lower latency.
- Mobile 3G and 4G internet typically have high latency, they'll probably be unusable.
- 5G made huge advancements on latency and may be ok, but a lot of 5G is still using bits of 4G so it's not guaranteed[^3].
- Starlink is in low Earth orbit, relatively close, so latency isn't too high, but the connection still needs to get back to the ground in a place that is close to Stadia servers. This is hit and miss, and while Starlink may at some times be playable, it's never going to be great as there is just too much distance covered.
- Traditional satellite internet uses geostationary satellites which are 35,000km away. This has way too much latency and will never be playable.
- WiFi on planes typically uses traditional satellite internet and is unlikely to work.
- WiFi on trains typically uses 4G internet and is unlikely to work until train operators upgrade this to 5G in the coming years.
- VPNs add more distance to get to the Stadia servers, and will make it slower. Unless the VPN is in the same region as you are, it'll probably be unplayable.

##### VP9 Encoding

VP9 is talked about a lot on r/Stadia, but not everyone knows why it's important. Uncompressed frames of video are far too big to transfer over the internet quickly enough to play a game with low latency, so it's important to compress the video.

Traditional video compression algorithms can take a long time to compress/decompress, because this doesn't really matter for most types of video. However when it comes to games, and particularly decompressing on lower powered mobile devices, this performance really matters. VP9 can be noticeably faster to decompress, while maintaining a high video quality, and a low file size. All of this makes it better for bandwidth and latency.

##### The Stadia Controller

The last way that Stadia helps reduce latency is with the Stadia controller. As the controller connects to WiFi directly, input can be sent straight to the Stadia servers, instead of going over Bluetooth to your PC first. While Bluetooth itself may only add 2-4ms of latency, there's also latency added by the PC in receiving the input and sending it to Stadia. Even 5ms of latency is worth optimising, so this is probably worthwhile.

There's an added reliability aspect to using WiFi as well. Bluetooth is notorious for pairing issues, and has a relatively low range. Many players play on a Chromecast that is behind a TV, and maintaining a stable connection behind a large electrical device such as a TV can be hard to do reliably.

### Is Stadia a console?

A question that comes up a lot is whether Stadia is a console, and there's no simple answer.

_Games consoles are just computers._ They have a CPU, GPU, RAM, storage, an operating system, all the parts that make them a computer. Early consoles were a little different, but modern consoles are basically just small gaming PCs.

So what really makes a console a console? I think there are 2 things that define consoles:

- Special purpose gaming OS – you can only run games[^4].
- Platform validation to make sure the game works well.

There are a few more things you can do on an Xbox or Playstation other than play games, but they aren't _general purpose_, you can't install an email app or write documents on them, you're mostly limited to playing games or doing game related tasks. On a gaming PC on the other hand, you can install whatever you like.

And Microsoft, Sony, and Nintendo, have a lot of control over their platforms. To publish a game on a console requires lots of time spent on testing, quality assurance, and validation. This is done by the platform owners to ensure that games all run smoothly and work well on their systems, and to maintain a good player experience. While there is some validation on PC gaming platforms like Steam, it's _much_ less than what happens on consoles.

So, in these two ways, I would say that Stadia _is_ a console. It's special purpose, designed for games only, and Google test and validate the games going onto it in a way that mostly isn't done for PC games, with the result that the player experience is much more consistent.

Thinking about performance when considering if Stadia is a console or not is a red herring. There's nothing about consoles that means they have to be lower performance, in fact in general consoles have a better output for the same hardware as a PC[^4].

What about the other cloud gaming services, are they consoles? I think so. In the case of Xbox Cloud they are literally Xboxes... in the cloud, but even considering services like GeForce Now that run Windows and PC games, these are still special-purpose services with more validation, testing, and optimisation than happens for regular PC game publishing[^5].

---

So what are the important takeaways?

- Because everything runs on the Stadia servers, you don't need a gaming computer or any fancy hardware to play a Stadia game. If you can play YouTube videos without your computer slowing down you're good to go.

- Fast internet matters, but _latency_ is more important than _bandwidth_. This is why satellite internet, 4G, and VPNs, are mostly incompatible with Stadia.

- Stadia is probably a console, but maybe not in the way that you think. Whether it's a console or not doesn't matter much to game developers or when actually playing games.

[^1]: There's a little bit of speculation here, I can't be certain that they don't have some magic, but remember that games are designed to run on computers that look and work like PCs and consoles, and Stadia must be very similar or no games would work.
[^2]: This is speculation based on my experience as a software engineer. I've solved similar problems in the past with technologies like EBS volumes on AWS. I don't know for sure how Stadia achieves this, but it's likely close enough.
[^3]: Some 5G is actually rebranded 4G, and doesn't have the latency improvements. Even if it's not rebranded 4G, some 5G uses 4G for the upload side, and while with Stadia there isn't much to upload (only your controller input), the latency impact will be too much.
[^4]: This is a big topic that I'm not going to go into detail on, but consoles have less running than a typical PC, and have more stable environments so can therefore be optimised for by game developers, resulting in better performance on equivalent hardware.
[^5]: To be clear, PC games do tend to get extensive testing and quality assurance. The difference is that there isn't usually another company forcing that to happen. Anyone can write a game and publish it for PC and have people buy it. That is not possible on consoles without getting approval from the console platform owner in some way.
