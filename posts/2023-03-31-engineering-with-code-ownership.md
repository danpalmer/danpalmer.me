---
title: "Engineering with Code Ownership"
date: 2023-03-31
featured: true
---

Code Ownership is the practice of assigning explicit owners to areas of codebases. Before Google I worked at small companies where it's easy to know who should review each code change, but that doesn't scale far. Even in a team of 10 it wasn't always obvious who knew an area of code the best, and it was certainly less clear for new starters.

Various tools have been developed to help with this. At Google, directories in the main code repository can contain an `OWNERS` file that lists those responsible for reviewing and _approving_ changes to the code. This can be seen in action in the [Chromium][chromeowners] and [Kubernetes][k8sowners] repositories, and it inspired the `CODEOWNERS` files that GitHub [supports][codeowners].

This was something I was aware of before joining Google, but I hadn't fully understood the _consequences_ of code ownership, and how it can impact engineering processes.

## 1. Explicit owners

In a small team ownership is typically implicit. Engineers either already know who will know about some code, or they can ask someone and likely receive an immediate and direct answer, or they can `git blame` to find who modified code most recently for a good starting point.

None of these approaches scale however. In a big enough company it's more than likely that no one on a team would know who is responsible for another piece of code, and tools like `git blame` can be misleading in large repositories as bulk-edits, or even just extensive contributions from other teams can cloud the true ownership.

Explicit ownership is therefore the first, and most obvious benefit. Having owners written down means there's a canonical way to find out who is responsible for some code.

Furthermore, by _enforcing_ ownership at code review time, there is incentive to maintain _accurate_ and _precise_ ownership data. If ownership is inaccurate, then those actually responsible may need to get sign-off for changes from others, which is a good trigger for updating ownership data. If ownership is imprecise, for example a CTO hypothetically being the top-level owner of all code, then there's incentive to make ownership more precise in order to balance workload and improve the signal to noise ratio of code reviews.

## 2. Ownership forces usage visibility

As products expand, code boundaries are introduced to manage complexity. These often take the form of libraries, packages, APIs, and schemas, and they all serve to loosen the coupling between teams, introducing abstractions that allow them to move faster.

However managing these boundaries over the long term is hard. When considering whether a library can be deprecated, or an API endpoint removed, it helps to know who the users are. This is beneficial both at a technical level, to understand whether the boundaries can safely change, and at an organisational level, to understand who is responsible for the client code and who might be able to advise about usage.

Ownership, coupled with various access control mechanisms, can serve to enforce practices around visibility of usage.

Consider two services, _a_ and _b_, where _a_ makes requests to _b_. If _b_ implements some access control, which could be as simple as a hard-coded list of services that it will respond to, as long as that list is implemented _in the b codebase_, all new usage of that service must be reviewed by the owners of service _b_. When service _a_ adds an API call to _b_, they also add themselves to the client list, requiring a review from the _b_ owners, who then have the chance to review usage.

The build system Bazel (and the similar Google internal Blaze), implement this [visibility][visibility] concept.

```python
java_library(
    name = "MyLibrary"
    visibility = [
        "//package:MyServer"
    ],
    # ...
)

java_binary(
    name = "MyServer"
    deps = ["//package:MyLibrary"]
)
```

In this example, `MyServer` depends on `MyLibrary`, but Bazel won't compile `MyServer` unless it's also listed in the `visibility` list of `MyLibrary`. Most targets are public, or have wide visibility allowing large parts of the codebase to access them, but in cases such as libraries or APIs this can be a great tool.

Some practical examples include...

- When a library is deprecated, the public visibility is replaced with a hard-coded list of all current dependencies, so that new dependencies can be disallowed or added on a case-by-case basis. This also acts as a ratchet, ensuring that if a dependency is removed it can't be re-added.
- All APIs at Google have schema definitions, normally in protobuf format, and visibility on protobuf files ensures new clients can be reviewed.
- Adding code references to global registries (e.g. adding a new route to a webserver) can ensure that a platform team have the opportunity to review code being added by a feature team.

## 3. Ownership by bots

The last interesting consequence of engineering with ownership is what can be done when an owner is a bot. The explicitly written down ownership is already conducive to automation and tooling as it's typically done in a machine-readable format, but allowing bots to be owners takes this to the next level.

Bots as owners are most useful when automating process checks. Checks that relate to the _code_ are most appropriately built as continuous integration processes, but sometimes there are checks that relate to the context of the contribution – the author, the pull request, the time, etc – and these can be hard to work into a CI system that assumes a stable output based on the code being changed.

The best example of this are [Contributor Licence Agreement][cla] checks. To contribute to many open-source projects, one must sign a CLA. It's common for a bot to check whether an author has signed a CLA before allowing them to contribute code. On GitHub, CLA checks tend to be implemented as separate automated processes, but could be implemented via the code review process.

Another practical example that I've encountered is bots that approve contributions only during certain hours. While less than ideal, limiting contributions to certain hours of the day, for example, business hours where there may be an engineer able to help with rollbacks, can be a practical solution.

Requiring approvals from owners for contributions, combined with making bots the owners, can be a lightweight way to implement checks and process automation.

---

Ownership is a tool that can be used to solve a wide variety of problems. At Google it's a fundamental feature of our engineering processes and powers many processes.

While it may be unnecessary for small teams, I had overestimated the bureaucracy of it, and underestimated the benefits that could be taken from it. Having worked in the Google codebase for over a year now I have an appreciation for the benefits to engineering culture, human processes, and automation that it brings.

[codeowners]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
[k8sowners]: https://www.kubernetes.dev/docs/guide/owners/
[chromeowners]: https://chromium.googlesource.com/chromium/src/+/master/docs/code_reviews.md
[visibility]: https://bazel.build/concepts/visibility
[cla]: https://en.wikipedia.org/wiki/Contributor_License_Agreement
