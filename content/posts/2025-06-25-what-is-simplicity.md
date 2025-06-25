---
title: What is Simplicity?
date: 2025-06-25
featured: true
theme: washed-yellow-dark-grey
---

It's uncontroversial to say that the code we write should be simple. In a discipline that is all about grappling with complexity, keeping things simple is critical to software development efforts, team productivity, scalability, and maintainability. Despite well known satirical counter-examples such as [Enterprise FizzBuzz][fizzbuzz], simplicity is a goal for most software engineers.

But what is simplicity? Despite this near universal agreement that it's important, throughout my career I've seen numerous instances of friction in design and code review where both parties are convinced that their solution is the simpler option. These disagreements are notoriously hard to resolve because **we lack the language to talk about our preferences when it comes to simplicity**, and simplicity is not a single concept or direction, but a set of competing priorities and trade-offs.

My ability to reason about _complexity_ improved substantially when I learnt the difference between _essential_ and _accidental_ complexity ([Brooks, 1986][nosilverbullet]), and I believe the same can happen when we break down simplicity into its constituent parts.

The fundamental tension in simplicity is the use of abstraction. Abstraction lets us wrap up the details of a process in a convenient unit with a name, so that when using this unit of code we don't need to understand the details. This is both good and bad, both _simple_ and _not_, depending on your perspective and preferences.

### Illustrations

Take for example these two methods for counting lines in a file:

```python
# Example A
def count_lines(path):
    count = 0
    f = open(path, 'rt')
    try:
        while True:
            char = f.read(1)
            if char is None:
                break
            if char == '\n':
                count += 1
    finally:
        f.close()
    return count
```

```python
# Example B
def count_lines(path):
    count = 0
    for char in read_file(path):
        if char == '\n':
            count += 1
    return count
```

In Example A we can see that this code reads the file in chunks, and won't hold the whole contents in memory at any time, whereas in Example B we don't know what the behaviour of the file reading is, perhaps it streams the file, perhaps it reads everything into memory at once. The return type of the read function in B could suggest a possibility (an iterator might imply that the file is not stored in memory), but the true detail is hidden from us.

Which of these is better is certainly up for debate. Example A is simpler for the fact that it requires less knowledge, Example B is simpler for the fact that it doesn't expose the mechanics of reading a file. In performance sensitive situations Example A may be preferred, and in complex business logic Example B may be preferred for its ability to move some details out of scope.

Let's look at another pair of examples for finding the top _k_ words by instances in a list of words:

```swift
// Example C
func topKWords(words: [String], k: Int) -> [String] {
    let wordCounts = Dictionary(grouping: words, by: { $0 })
        .mapValues { $0.count }
    return wordCounts
        .sorted(by: { $0.value > $1.value })
        .prefix(k)
        .map(\.key)
}
```

```go
// Example D
func topKWords(words []string, k int) []string {
    counts := make(map[string]int)
    for _, w := range words {
        counts[w]++
    }
    type wc struct {
        w string
        c int
    }
    var sorted []wc
    for w, c := range counts {
        sorted = append(sorted, wc{w, c})
    }
    sort.Slice(sorted, func(i, j int) bool {
        return sorted[i].c > sorted[j].c
    })
    l := k
    if len(sorted) < k {
        l = len(sorted)
    }
    res := make([]string, l)
    for i := 0; i < l; i++ {
        res[i] = sorted[i].w
    }
    return res
}
```

Example C is in Swift, a language with great structures for building abstractions. In this case we see the use of `Dictionary(grouping:by:)` to abstract away the mechanics of the grouping. Sorting is handled by a lambda function that need not (and cannot) access the whole collection, increasing safety, and taking the first _k_ words is handled with just two named functions that will be known to all Swift developers.

Example D is in Go, a language that strongly prioritises duplicating code, and only the necessary code, rather than building complex abstractions that might do more than is strictly necessary in any given case. In this example we build a map to count, transform that into a structure that can be sorted, perform the sort, then transform this again into a structure suitable in size and type for the return value, before this is filled out.

Where C hides these transformations between each step, D exposes them. I'll admit that I _don't know_ how these transformations are implemented in Swift, but it's clear how they are implemented in the Go example because they are included in the example itself.

Which is simpler? One could argue that the Go example is simpler because there are no hidden details (apart from perhaps the implementation of `sort.Slice`). One could also argue that the Swift example is simpler because there is less code to hold in your head to understand how the code works.

### Naming concepts

Giving names to concepts can help us understand and communicate about them. I've seen this work well with _accidental_ and _essential_ complexity, both in my own understanding and in building a shared understanding with colleagues. I believe naming these simplicity trade-offs can do the same.

- **Abstracted simplicity**: implementation details are wrapped up in abstractions such that when reading code, irrelevant parts can be skipped or understood in a summarised form.
- **Flattened simplicity**: abstractions are avoided, in favour of flattening code paths such that when reading code, details are not hidden.

These are two ends of a spectrum that in reality, and most code will not exhibit just one of these. Programming itself is, after all, an abstraction to allow for hardware to be more generic and re-usable, and code is an abstraction to allow humans to effectively program computers without understanding the hardware.

Rather than being about absolutes, I see these two types of simplicity as being most useful when discussing localised decisions, typically traversing the levels of abstraction only within a given codebase or application.

### Reserving judgement

So which is better? Neither. As with so many things in engineering it's all about trade-offs and context. In some places abstraction can be incredibly powerful, simplifying understanding, and in others it can stand in the way of simplicity, requiring the reader to understand not only what is happening in the code, but also how the levels of abstraction are traversed.

There's a close relationship here to accidental and essential complexity. In some cases abstraction can introduce accidental complexity in the mechanics of the abstraction. In other cases, flattening can introduce accidental complexity in the sheer amount of code to be read, or code copy-pasted again and again due to a lack of available abstractions.

Different languages and ecosystems take different stances on these trade-offs. Go is a strong advocate for _flattened_ simplicity, Ruby is a strong advocate for _abstracted_ simplicity. Both are loved and criticised for these stances.

[fizzbuzz]: https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition
[nosilverbullet]: http://www.cs.unc.edu/techreports/86-020.pdf
