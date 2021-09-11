---
date: "2018-01-04"
layout: post
redirect_from:
  - /2018/01/teaching-non-engineers-how-to-contribute-code
slug: teaching-non-engineers-how-to-contribute-code
title: How and why we teach non-engineers to use GitHub at Thread
theme: washed-blue-red
originally_on_thread: true
featured: true
---

At Thread one of our core beliefs is that technology allows for great change. This is important to our product, but it’s also important to how we work internally.

Because of this way of working, we try to represent everything in data—products, measurements, styles, suppliers, locations in our warehouse, support ticket resolutions, and many more things that you’d never even think about.

All of these data models come with a cost of needing a way for those in the company who use them to maintain the data. This means building editing interfaces, with validation, database design, and front-end work. Often we just don’t have time to do this—new features are higher priority, and besides, a engineer can just update a few data files when needed right?

While this is a much quicker solution in the short term, an engineer will have to context switch out of their work, watch the release go out and make sure nothing goes wrong—that all hurts productivity. Perhaps more importantly though, the person who needs the data updated now no longer has ownership of the whole process and are reliant on someone else’s schedule.

Ultimately this process can be useful to get a feature out of the door quickly, but causes far too much friction to work long term.

## A better solution

I remember when GitHub first launched their web editor — I wasn’t impressed. Why would anyone edit code in a web browser? Why would I use an editor that could only change one file per commit? Well years later I’ve realised that I am not the target market for the editor.

At Thread we now regularly teach those outside of the engineering team how to contribute to our codebase via the GitHub web interface, so that they are in control of updating data they need to work effectively.

We have now had more contributors to our main codebase who are in non-technical roles, than all engineers and contractors who have contributed over the years.

## Has it worked?

As a engineer on the product team, I’m able to focus my efforts on building features that will benefit our customers and move metrics, rather than on building more [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) interfaces. I’m also able to ship A/B tests faster as we can often skip the internal tooling for the test version in favour of editing data through data files to begin with. When we get to the delivery phase of a project we can then put the time into the editing interfaces as we’ll not only have an idea of the value of the feature, but also have a better idea of how our internal users would like the interfaces to work.

It’s also not limited to data files; many pages on [thread.com](https://www.thread.com/) are essentially static HTML, pages like our delivery FAQ, returns policy, or terms and conditions. By learning how to use GitHub, our operations team can keep these up-to-date without asking for help. Our talent team are also able to edit our [jobs site](https://www.thread.com/jobs), reacting on a daily basis to common questions that come up when talking to candidates.

All of this means that our team members outside of the engineering team are able to have much more ownership over their work, and have less friction to make the changes their experience tells them is necessary.

## How do we do it?

The first thing we do is run GitHub tutorials every now and again when we have a few new starters to teach. We cover the basics of what a repository is, comparing it to document revision histories on Google Docs, what it means to commit a file, and what a branch is. We only talk about these in high level ways as we don’t cover the command line interface at all in our current tutorial format.

Next up we go through how to edit a file on the GitHub web interface, how to write a commit message, what a pull request is, and what the build status reporting from Jenkins means.

Lastly we ask non-technical contributors to pick an engineer who is available on Slack to hit the merge button once the build is green.

## Issues we’ve encountered

On balance we feel this is a huge win for the team as a whole, and we’re planning to continue the training and encourage more contributors as we grow, but we have changed our process slightly as this has evolved.

Firstly, we’ve used GitHub roles and locked branches to prevent accidental commits to master. For someone who isn’t as familiar with version control and branches in particular, the GitHub web interface isn’t particularly clear about when a commit is going on to the master branch or a new branch. At Thread our master branch is continuously deployed with no manual intervention required, which resulted in several commits going out that broke the site and caused downtime.

As for all downtime issues, we ran a blameless [5 Whys](https://en.wikipedia.org/wiki/5_Whys) and realised that while _in hindsight_ we could have caught these issues with unit tests run before deployment, we likely wouldn’t catch everything and so introducing protected branches to encourage code review was a lightweight way to solve the problem.

Secondly, somewhat in response to this issue, we have started to write some unit tests that just sanity-check the structure of the data in data files, or to check that all of our Django template files successfully parse as valid templates. Particularly in the case of the data files, these wouldn’t normally be something we’d expect to test, but as we now want the files to be editable by people without a knowledge of the code, they can be handy in catching simple mistakes.

Lastly, as we’re typically using Python for our data files, we’ve found that the syntax isn’t particularly intuitive and can take some getting used to. To address this, we’ve written documentation with a little more detail than if it were written for an engineer. This documentation is also in the repo and editable by everyone, so we encourage non-engineers to update and clarify the instructions as they learn, and to teach each other how to edit certain parts of the site.

## Moving forward

We consider this experiment to be a success and will be continuing it for the foreseeable future. Where we’re designing data files to be editable, we’re going to try including detailed instructions in the files themselves, possibly including copy/pasteable examples.

We already try to make our test failures have informative error messages with details on how to fix where we can, but due to the complexity of interpreting test output we don’t currently expose Jenkins to non-technical team members, even though they can technically log in with single-sign-on. This is perhaps the next opportunity we have to improve the contribution experience and something we might trial in the next batch of new starters who go through the tutorial.

---

To finish, I’d encourage all developers to see if there are opportunities in your companies to get non-technical team members contributing to your codebases. There are benefits to productivity on both sides, more empathy between teams, and a stronger feeling of ownership over work for those who are no longer reliant on developers to make changes for them. The reduced friction also means shorter feedback cycles, which can be transformational for what others can accomplish in their work, all without the high cost of development time on editing interfaces.
