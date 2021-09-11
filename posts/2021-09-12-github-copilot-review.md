I've been using GitHub Copilot for about a month now. While there is much
controversy over the data provenance, licencing, and security, I haven't seen
much discussion of the usability and how it affects the development process.

This is my impression after using it for enough time to get used to it. Context
is everything, so beware that this is only my experience and may not translate
to how others are experiencing it. GitHub claim that Copilot works well in many
languages, but again for context, I'm using it to write Python in a relatively
large codebase of around 400k lines.

### Copilot's new approach

#### Static Analysis vs Machine Learning

Where traditional code completion is done using static analysis, Copilot uses a
machine learning approach. The rough approach of static analysers is to
understand the rules of the code first, and then to predict completions within
those rules. While this means that many predictions are valid, they are also
simple. Predictions are minor completions, rather than fully new constructs in
code.

Copilot's approach is almost backwards. Trained on a large corpus of open source
code, it attempts to understand all the things that one may wish to write,
making far more creative predictions. Conversely its intelligence about what is
possible within the rules the code is far more limited. It understands syntax so
is unlikely to suggest something syntactically incorrect, but it doesn't
generally know much about the symbols and constructs in our code.

As an example, consider the following Python enum

```python
class PriceType(Enum):
	FULL_PRICE = 1
	MARKDOWN = 2
	PROMOTIONAL = 3
```

A static analysis based completion engine will understand this as being an enum,
and will know the possible items in it.

```python
class Price(NamedTuple):
    type: PriceType
	value: int

price = Price(value=100, type=...)
```

In this example, a static analysis approach to completions should have no
problem with predicting completions in the `...` – the types line up, and it
knows about the enum.

Copilot on the other hand may not know about the enum, and it is unlikely to see
that the types line up. If the enum, the containing structure, and the place
that we're completing are all in the same file, it may manage it, but this is
unlikely in larger codebases.

This brings me to the first issue I've had with Copilot. Given an example like
this, it has suggested completions like this:

```python
price = Price(value=100, type=PriceType.DISCOUNT)
```

This makes _linguistic_ sense. Someone with no knowledge of what's in the enum
could guess some things that might be in it, and some will be right, but in this
case it happened to be wrong. Copilot is good because of all of the code it has
been trained on, "discount" is an impressive guess, but Copilot is limited by
the fact that it doesn't actually know what the options are in this case.

#### Creativity

Now while Copilot has issues with cases like this, it does have strengths. In
many ways it feels more creative, like it has an imagination. Here's a real
example, character for character, that I came upon recently:

```python
# Now we have a candidate list of external prices, but the prices may
# not always ascend, so we discard any not in ascending order.
external_prices = list(external_prices_by_group.values())
external_prices = functools.reduce(
	lambda xs, x:
```

This is the code that I had written, without the completion. While the comment
isn't perfect, it does avoid spelling out what I'm actually about to do in code
step by step, instead focusing more on the why. There were more similar comments
above. Here's the completion:

```python
external_prices = functools.reduce(
	lamba xs, x: xs + [x] if xs and xs[-1].price < x.price else xs,
```

To say I was blown away was an understatement. To call out a few of the features
here:

- The reduce function (lambda) is functionally correct for the way that a reduce
  function must work, i.e. it handles accumulation of a sequence of values.
- It has correctly deduced that we're reducing into a list, and must wrap new
  values into a single item list in order to concatenate with the list.
- The last (-1 index) value of that accumulated list is used to check that
  values are ascending.
- The `price` attribute on the data structures that we're iterating over has
  been used correctly, this isn't just a list of numbers.

There is no way that a static analysis based approach can come close to
completions like this.

#### Moving from development to code review

After sharing this with my colleagues, finishing up my code, and writing some
tests, I realised my next problem with Copilot: this code is incorrect. If the
initial value is falsey, as it is initially, no values are ever appended, so the
return value of the reduce is always the initial value.

The bug itself is not particularly bad, I could easily have written it myself.
More interesting to me is that in making such complex completions as this,
Copilot shifts the development process from one of writing code to one of
reviewing code.

I see this as a problem because, in general, humans are worse at reviewing code
than they are at writing it. At Thread many of our code style guidelines are
focused around making code easier to review precisely to attempt to rebalance
this, and we do catch bugs during code review, but it's hard and there are many
we don't spot.

It's easier to understand the data flow, the edge cases, the expected values of
data structures at each point in the flow of execution, when we are writing the
code out. When reading code it's too easy to miss these subtle interactions.

Completions that fill in values we already knew we were going to write are
valuable because they let us communicate our thoughts to the computer faster.
Completions that write new code that we have not yet figured fully on the other
hand, remove the need for us to understand the problem fully.

It's easy to say that tests caught the issue so it's not a problem, but not
everyone writes tests, and even when they do it's easy to miss edge cases or
even write tests that actually silently fail to exercise the cases we're
expecting. Taking this further, if Copilot is doing the same level of authoring
in tests as it is doing in non-test code, there's the potential for similar
subtle testing bugs to be introduced.

#### Copilot is a programmer, not an engineer

I like to think of the difference between programming and engineering as being a
difference in context. Programming is working without context, where the scope
of the work ends at the point of submitting code for review. Engineering on the
other hand is done in the context of a company with a product, a customer with a
problem, a team building a solution.

Copilot is a programmer. It doesn't know about the company, the product, the
customer, the team, and it doesn't know what the solution is or even could be.
Copilot's context only extends as far as the code it writes, not how that code
fits into a bigger picture, or whether it makes sense as a solution.

During the piece of pricing work alluded to above, there have been many subtle
design decisions, with complex requirements from across the business. Designing
a system to support all the financial reporting, tax, marketing, and user
experience requirements means we must be careful about naming and about how
concepts are defined and communicated.

When writing out the `PriceType` enum (which actually has 8 different types),
Copilot was eager to suggest names, but they were all _guesses_, good ones based
on billions of lines of code, but guesses nonetheless. It's a strength of
Copilot that it is able to suggest new names for things, often its suggestions
for temporary variables used in small contexts are fine. The problem would be in
accepting some of these choices for wider naming conventions.

Ultimately, as engineers, we know the problems better than Copilot does, and as
a result I think that suggestions for some kinds of code should be accepted
_carefully_. I'd almost like to disable these sorts of suggestions to save the
temptation.

Another example of how Copilot doesn't understand context is first thing I used
it for. To test it's completions I opened the file that defines our
shipping/delivery partners and tab-completed an entire delivery partner
definition:

```python
class Post Office(DeliveryPartner):
	value = 70
	slug = 'post_office'
	display = "Post Office"
	tpl_delivery_service_name = "Post Office"
	status = DeliveryPartnerStatusEnum.ENABLED
	supports_label_rendering = False
	# TODO: Explicitly false for now, we'll enable this once the integration
	# work is complete. Note: also uncomment the button in the 3PL portal.
	shippable_from_3pl = False
```

- The `value` field has a slightly peculiar behaviour, but Copilot got it right.
- The `slug` and `display` fields here are formatted correctly.
- All required fields are included
- The comment is broadly correct and matches the flag that follows it.
- The class name is not syntactically correct, but it's close.

The problem is that the "Post Office" is not a delivery company. We're not using
them as a service provider. If they hypothetically were, and we decided to use
them, who's to know if they support label rendering or not, or if they will be
shippable from our 3PL (third party logistics provider).

Every line of this essentially makes sense next to all the others, but because
Copilot knows nothing about our business partnerships, product roadmap, service
offerings from other companies, and so on, these completions don't actually mean
anything.

This is an extreme case. Asking Copilot to complete line after line with little
prompting is the equivalent of "ask a stupid question, get a stupid answer". The
fact that Copilot is able to come up with a coherent answer at all is
impressive, but speaks to the amount of "guesswork" that is being done without
the necessary context. If Copilot is willing to take wild stabs in the dark
about things that it cannot know, there's a high risk that it will be providing
completions that are at best obviously incorrect, and at worst, subtly
incorrect.

### Practical Issues

Beyond the issues I have encountered with Copilot's approach there have been
some practical ones.

#### Speed

Copilot is slow. Completions can often take up to 2 seconds which is too slow to
be useful while typing. I tend to notice Copilot suggestions the most when I
have stopped typing to think, rather than when I am in the flow of writing which
is often the opposite of what I want. When typing I typically want to finish
what I'm typing as quickly as I can so that I can get back to thinking, and
that's where completions can help the most.

##### Lack of Completions

Perhaps more important than the speed is the fact that Copilot often fails to
provide any suggestions. I imagine that much of this down to the understanding
of the code context and that this will improve significantly over time, but I
also suspect that some of this problem is down to issues in the plugin
implementation.

As far as I can tell, good suggestions are thrown away quite often. While typing
it may take me several characters of typing to realise that Copilot has made a
suggestion, for me to parse that suggestion, and for me to decide to use it.
While my normal editor auto-complete is very happy for me to type over it and
stays available for me to use, Copilot sees my continued typing as a signal that
I do not want its suggestion, even if what I'm typing is what it was suggesting.

Hopefully this is just something they haven't got around to sorting yet, and
that it will be fixed in a future plugin update.

In the long term I imagine that reactivity to what the developer is typing as
they are typing it, adjusting suggestions at each step to account for new input,
will be one of Copilot's strengths and places where it can deliver the most
value.

```python
user = {
	"name": "...",
	"country": "UK",
	"address": {"city": "London"},
}

# ... name = user["name"]
c # ... country = user["country"]
ci # ... city = user["address"]["city"]
```

These three suggestions are an example of what could be possible with Copilot. A
traditional static analysis approach would never be able to suggest the path
into a data structure like the dictionary above based on a partial name of a new
variable. For this to be truly useful it'll need to be fast, probably sub 100ms
for each character.

The last teething issue I've noticed is that Copilot doesn't support
multi-cursor editing. I do a lot of multi-cursor editing, even for small numbers
of cursors and just a few characters at a time. Copilot currently works but only
fills the suggestion on the first cursor which throws the cursors out of
alignment.

Full multi-cursor support that suggests for each cursor separately could be
good, but would mean that one bad suggestion could ruin the whole batch. Based
on my editing habits, simply using the suggestion from the first cursor for all
other cursors would solve the majority of cases.

### Conclusion

Copilot is the smartest auto-complete that I have used and it has left me
speechless several times. However like many technologies that become more
"lifelike", I think it has reached its own sort of _uncanny valley_.

For Copilot, this means that while it looks very smart at first glance, upon
closer inspection it's still got a long way to go, and that disconnect may cause
more harm than good in some circumstances.

I am concerned by Copilot's shifting of the development process away from
writing code and towards review, as I have seen several times that this can
result in code that is incorrect in subtle ways.

While I'm in favour of breaking down barriers to entry for new software
engineers, I suspect that relying on Copilot while learning to code (and
consequently learning less through coding and more through review) could make
that process harder rather than easier because of this.

Copilot is at its best when it's finishing the code you were going to write, but
quicker than you could have written it, increasing the bandwidth between your
brain and the computer.

To become even more useful, I think that Copilot needs a better understanding of
where it is _not_ adding that value, where it may be overstepping, or guessing
at things that it does not know. In these cases falling back to basic static
analysis to suggest valid local symbols is probably more useful and safer.

I'm going to keep using Copilot for a while, but I'm interested to try tools
like TabNine that have a more mature editor integration. I suspect that this,
combined with suggestions computed locally, could solve some of the more
practical issues I've had with Copilot.
