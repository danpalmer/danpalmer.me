---
title: "Developing Raycast Extensions"
date: 2022-09-13
featured: true
---

I've just started using Raycast, an application launcher for macOS. Like every other launcher before it, it does a lot more than just launch applications, and most of that functionality comes from extensions. Also like several other launchers before it, I decided to have a go at writing an extension and see what the process is like.

Back in the mid-2000s I was an avid user of Quicksilver. It was the first launcher I used, and was quite extensible, but extensions were native code (typically Objective-C) written against the Apple developer APIs, in Xcode, bundled up and injected into Quicksilver in a sort of plugin model. Writing extensions was cumbersome, poorly documented, and had a relatively long feedback cycle.

I started using Alfred within a few days of its release and have been a loyal user ever since. While I preferred the concept behind Quicksilver (building "sentences"), Alfred was far more capable with features like clipboard history, which I use more than the launcher itself. Alfred is also much easier to extend, with both a simplified drag-and-drop scripting interface, and the ability to write scripts in a range of languages that can provide search results over stdin/stdout.

Raycast feels like the next evolution, and a more modern take on this problem space. Where Alfred placed an emphasis on built-in functionality, Raycast is mostly powered through extensions (many of which are included by default and form the basic functionality). And where Alfred opted for a simple scripting interface, Raycast offers deep and _fast_ integrations via an embedded scripting engine.

### What's great in Raycast extension development

Raycast extensions are developed with NodeJS and React. This wasn't great news to me as I find Node to be a low quality ecosystem and I'm not a fan of the direction React has taken. However Raycast has made a few choices that make it a much better environment to develop for than regular Node and React.

First up, Typescript. The decision to use Typescript is an obvious one nowadays, and I'm glad to see Raycast support this by default. Arguably this is just _table stakes_ in modern Node development, but it's good to see nonetheless.

The next notable thing is that while Raycast uses React, it's not using a DOM or the browser model, but rather scripting their own UI that is built natively. This removes a lot of cruft and means a much simpler API, particularly for styling, and overall makes it much nicer to use than browser-based React or React Native.

One thing that I found strange on first starting was that everything is driven from the creation of the UI. This is normal for React, but felt strange for what I was trying to achieve. An example of this was wanting to use Raycast's built-in text search over items in a list in my extension. What I expected was a function to call to achieve this, whereas what is provided is a flag on a React component that tells Raycast that it should search the sub-components in a rendered list. I find this counter-intuitive because React is being used to model both UI and data. I suppose it could be seen as modelling an abstract version of a UI that is itself data, but I still think more separation would be better. After some time using it though I'm happy enough with the code architecture and I can see the React-first nature being beneficial for extensions with complex UI requirements.

Something I appreciated about the developer experience was the template projects. Creating a new extension is initiated in Raycast, which presents a form to collect a few basic details. After this it spits out a project codebase for you to work on. There are a few things to note about this project that I think are great moves by Raycast:

- It already does something, often non-trivial. For example the dynamic search results template implementing a basic NPM package search. This shows how developers can get started with things like asynchronous operations, networking, etc, and I was able to become productive quickly without reading too much documentation.
- It's set up with typescript, with enough configuration for everything to Just Work – editor integration, linting and errors, auto formatting, JSX, imports, and more. It's also a relatively strict configuration which I like. This doesn't take ages to do, but as someone who dips in and out of the JS/TS ecosystem once or twice a year, having a complete and opinionated out-of-the-box experience is great.
- Dependencies install and the build runs with no warnings or errors. I don't think I've ever seen a Node codebase that has managed this before, and it's wonderful to see.

The last thing that I loved was the feedback loop. The default development action `npm run develop` rebuilds and loads into Raycast with almost no overhead. Technically this is true for Alfred as just saving the file is sufficient to update, but Raycast takes this a step further as, with its deeper integration, extensions may be displaying UI, and this is also hot-reloaded. Hot-reloading isn't anything new for the web world, but to see it in extension development for a native application, and to have it work by default with no extra steps, is a joy.

### What needs improvement

##### Publishing and version control

Currently extensions are all committed into the official extensions repository – <https://github.com/raycast/extensions>. This is a perfectly reasonable first-pass, but there are two issues with it for extension developers.

Firstly, should developers create and maintain extensions in a fork of the repository, or should they run their own source control? Developing in the main repository isn't ideal as there will always be a lot of unrelated activity going on. Developing in their own source control isn't ideal because when it comes time to submit they lose their history when copying over to the main repository (submodules don't appear to be used). For my own extension, due to indecision as to which is the better option, I've ended up doing neither, resulting in no source control, and a slightly worse developer experience.

The best approach (while keeping the official extensions repository) would probably be to have developers create and maintain extensions in their own repository, and for only a reference to be committed into the main extensions repository. This reference would probably target a commit hash for security, and probably some other metadata like the changelog and README. This might lead to some duplication with the extension repository though.

The second issue is that the extensions repository is _large_. It's 4.06 GB on disk at the time of writing, but this is due to get a lot bigger, quickly. Most of the size is taken up with screenshots of each extension, with each screenshot weighing in at 1-2 MB, however Raycast has recently added an option to include a GIF of the extension being used, and the few GIFs already added are 10-20 MB each. There are currently 571 extensions, projecting this out to 1000 extensions, each with 3 screenshots and a GIF, that's going to be 13 GB just for the current state, let alone history.

This leads me on to what I think is the best solution to both of these problems – just drop the extensions repository. Raycast supports private extensions (on paid plans) which are not included in the repository, so they have the backend set up for this already. The primary UI for extensions is in Raycast itself, the secondary UI is their website, so the repository isn't providing much additional visibility. While it's nice to see the change history for extensions, if developers are maintaining elsewhere and copying extensions in this is already providing limited benefit, and Raycast could still link to developer repositories. Internally Raycast could keep using a repository to power the extensions backend, with a bunch of automation built around it, but this would be an implementation detail for them to decide rather than something that I think developers should be exposed to. Submitting either via Raycast, either by uploading the files or pointing to a commit on a git repo for Raycast to pull in feels like the best way forward for developers.

##### Security

Security might be more of a user concern than a developer experience one, but it impacts developers and I'd like to see more effort put in here.

Extensions are easily installed, pseudo-trustworthy code, and thus pose a relatively high risk. While they are notionally human-reviewed at the code level by the fact they are committed into the official extensions repository, human review is notoriously bad at catching malicious actors, and as mentioned above, I think the days are numbered for the official repository and its current review flow.

As extensions are run in a Node environment they are already sandboxed by the battle-hardened V8. With some work, it should be possible to at the very least audit, and ideally manage and ask permission for extensions to access the network, filesystem, and other system resources. Filesystem access is theoretically guarded by macOS already, but extensions will inherit whatever permissions Raycast has already, which given its scope of functionality are going to be wide-reaching.

I think a great implementation of this would look something like...

- Extensions listing in their metadata which file paths and domains they will use, including perhaps a magic `$HOME` for the user's home directory. This would be included on their listing pages, and access to these would always be allowed with no prompt.
- Extensions can ask at runtime to access anything under a particular path or on a particular domain, if they are unable to know this ahead of time. This would be asynchronous, and the user is asked if they wish to allow that access. If granted, the extension can access files under that path as normal.
- Access to any other file or domain causes the extension execution to be blocked as the user is asked for permission. The user can choose some form of "allow all access" to not be prompted again. Subsequent access would work as normal if permission is granted.

I believe this would lead to a good user experience for most extensions, unnoticeable for many, while still preventing malicious extensions.

- Most extensions either don't use the network, or use a fixed set of domains (e.g. a GitHub Issues client).
- Most extensions either don't use the filesystem, or use a fixed set of files (e.g. a Todo app client that uses the local database).
- Well behaved extensions can still ask for reasonable access and handle permissions gracefully.
- A malicious NPM package being included in an otherwise well-behaved extension will likely be unable to operate or will give itself away.

One unresolved issue with this approach is the running of other programs by extensions. My extension happens to run `/usr/local/bin/prlctl` to control Parallels Desktop, but many others run AppleScript via `/usr/bin/osascript`, or use other utilities. It should still be possible to build controls around this for commands that don't use a shell, perhaps just with the described filesystem permissions. Full shell access is harder to lock down, but could be guarded by a clear warning on the extension's listing page saying that it has "full system access" or something else equally scary.

None of this proposal is perfect by any means, but I believe it would defend against the most likely attack vectors of malicious commands, and commands that depend on malicious NPM packages. As Raycast ultimately controls the networking and filesystem access happening in its process, and as V8 is designed to execute untrusted code, this should all be possible and hopefully not an insurmountable task.

---

This post isn't intended to be a review of Raycast, others have done that much better than I can. Instead it's intended to be a brief look into what the developer experience is like, and where I think it could go in the future. Raycast as a platform is _exciting_, and developing an extension for it was fun, straightforward, and I felt like I was doing good engineering rather than hacking something together. I suspect I'm not alone in this last point, because the scope of some Raycast extensions is significant – where Alfred plugins are often relatively surface level (variations on custom searches), Raycast extensions often have many features including complex integrations with third-party services.
