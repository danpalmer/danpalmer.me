---
title: GraphQL Interfaces vs Unions
date: 2018-10-28
originally_on_thread: true
theme: navy-light-red
---

GraphQL’s type system allows us to make many invalid states impossible to
represent, which improves the usability and reliability of our APIs. Two
features of the type system that contribute significantly to this are
Interfaces and Unions, however they can be used to address similar design
considerations so it’s not always obvious which is the right option.

In this post we’ll look at several examples from the Thread API, and explore
whether using an interface or a union is the right option. It’s not always
obvious, and in some cases we got it wrong the first time, but after reading
this post we hope you’ll have more tools to hand to help you choose the option
that’s the best fit in each circumstance.

### “Ideas Feed” content – a Union

The first example we’re going to cover is the Thread Ideas Feed. This is a
feed of content that can come in different types. These content items
represent recommendations from the user’s stylist contain products and
personalised descriptions. In the future we want to experiment with many more
types of content than the _Collections_ and _Combinations_ that we have at the
moment.

The items we have in the feed, “Ideas”, currently have some common fields such
as the date time they were created, a stylist, a photo, a title, etc. Given
all these shared fields it’s tempting to define the ideas as an interface:

```graphql
type IdeasFeed {
    ideas: [Idea!]!
}

interface Idea {
    title: String!
    description: String!
    image: URL!
    stylist: Stylist!
    created: DateTime!
    products: [Product!]!
}

type Collection implements Idea {
}

type Combination implements Idea {
}
```

However, this doesn't feel like a great implementation. We’ve ended up with
two empty types for the different kinds of ideas. This suggests that we should
have used an `IdeaType` enum and made `Idea` a type instead of an interface.

This alternative wouldn't take us very far though. Consider adding a type
`StyleQuiz` that asks users a few questions about their style preferences.
This would not have any products, so we’d need to return an empty list of
products. It might not have an image, so we’d need to update our interface to
allow for a nullable image URL. Considering this new type, the interface
pattern begins to break down. Radically different types such as this would
result in an explosion of nullable fields – either on the `Idea` type if we
used an enum, or on the interface.

Lastly, an interface doesn’t reflect how we want clients to use these types.
This is because feed items may have the same fields, but the design of them
and how the user interacts with them may be completely different. We might
create a new content type that should be rendered in a very different way, but
which the client might not recogise and might render in an existing style or
layout. This could be fixed by the client checking the `__typename` field, but
as this isn’t enforced by the API, it’s easy to get wrong, rather than easy to
get right.

Some requirements are forming here:

1. Clients should understand the exact content type they are rendering, and
   how to render it, rather than using the fields on that content in generic
   ways.
2. Feed items must be able to have radically different formats, without losing
   type safety.

A design based around Unions may be a better fit here:

```graphql
type IdeasFeed {
  ideas: [Idea!]!
}

union Idea = Collection | Combination

type Collection {
  title: String!
  description: String!
  image: URL!
  stylist: Stylist!
  created: DateTime!
  products: [Product!]!
}

type Combination {
  title: String!
  description: String!
  image: URL!
  stylist: Stylist!
  created: DateTime!
  products: [Product!]!
}
```

This looks like a lot of repeated structure, and right now it is, but because
the fields must be accessed through the different types and not through a
common interface, it forces the client to understand them. This is illustrated
by these two queries in the client. With an interface:

```graphql
query {
  ideasFeed {
    ideas {
      title
      description
      image
      stylist
      created
      products
    }
  }
}
```

and with the union:

```graphql
query {
  ideasFeed {
    ideas {
      ... on Collection {
        title
        description
        image
        stylist
        created
        products
      }
      ... on Combination {
        title
        description
        image
        stylist
        created
        products
      }
    }
  }
}
```

In a situation where collections and combinations _look_ very different in the
feed (even though they have the same fields), this is a key piece of
documentation in the API, and makes it difficult to use the API incorrectly.
This addresses the first requirement we had.

To address the second point in our requirements, this now makes it much easier
to get the full type safety on new types of content. To use the example of a
Style Quiz, rather than having to make products, image, and stylist all
nullable so that it can conform to the interface, or even worse, rather than
providing useless or contrived data in those fields, we can encode exactly
what we want.

```graphql
union Idea = Collection | Combination | StyleQuiz

type StyleQuiz {
  title: String!
  questions: [Question!]!
}
```

In this case a union has worked for us because there is nothing fundamentally
shared in our use case. There are instances where there may be shared fields,
and in fact in all the types we have at the moment the fields are all shared,
but the use-case is that we have data types that are totally independent.
While it felt that an interface made sense given the number of shared fields,
it didn’t make sense in the design of the API and for how we want clients to
use it. It would fail to document the fact that these types _should_ be
treated separately.

### Cart line items – an Interface

The second example we’re going to cover is line items in a shopping cart.

Line items are things that contribute to a total. They could be a product, or
they could be the shipping cost, or even a gift voucher. These are all quite
different types of data, and our clients would likely render them in totally
different ways, which is why we first wrote the cart as:

```graphql
type Cart {
  lineItems: [LineItem!]!
  total: Int!
}

union LineItem = Product | Shipping | GiftVoucher

type Product {
  name: String!
  price: Int!
  size: String!
}

type Shipping {
  price: Int!
  nextDay: Boolean!
}

type GiftVoucher {
  amount: Int!
  code: String!
}
```

(These types have been simplified, to not include irrelevant details)

Our expectation was that the client would read these out and render each line
item in a different way. We show products as a block with an image, name,
size, etc, we show shipping as a banner indicating if you have free shipping,
gift vouchers are a subtraction at the bottom, and the total is the last
entry.

This could be better though. We have two core requirements:

1.  The cart total value _must_ be correct.
2.  Everything contributing to the total must be presented to the user.

The first is difficult to get right because the total is presented as a
separate field – the total, and the prices of the line items could
theoretically get out of sync.

The second is also difficult to get right in a world where we have clients
running old code. This API will be used in a mobile app, and if that app
hasn’t been updated to handle, say, a site-wide 10% off discount, then it
won’t be selecting it in its query:

```graphql
query {
  cart {
    lineItems {
      ... on Product {
        ...ProductFragment
      }
      ... on Shipping {
        ...ShippingFragment
      }
      ... on GiftVoucher {
        ...GiftVoucherFragment
      }
    }
  }
}
```

This means that while the total will be correct, it won’t display all
components. While users might be ok with their cart being cheaper than they
expected, they tend to stop buying things when it’s the other way around, so
we wanted to design an API that is more resilient to server-side updates on
out of date clients.

We decided to switch to using an Interface approach.

```graphql
type Cart {
  lineItems: [LineItem!]!
}

interface LineItem {
  description: String!
  value: Int!
}

type Product implements LineItem {
  size: String!
}

type Shipping implements LineItem {
  nextDay: Boolean!
}

type GiftVoucher implements LineItem {
  code: String!
}
```

Everything in the cart implements the `LineItem` interface, which defines a
`value` and a `description`. The `value` is the contribution of that line item
to the cart total. For a product this will be positive, but for a Gift Voucher
this would be negative, and for free shipping it might just be zero.

It is now the client’s responsibility to calculate the total by summing all of
the values of the line items in the cart. The server guarantees that they will
sum correctly. This still requires validation work on the server, but it means
that there is only one way to get the total, and that restricts the scope for
bugs, helping to address our first requirement.

The second feature of this is that because everything in the cart must
implement the `LineItem` interface, as required by the type of the `lineItems`
field, the client knows that everything will always have a value and a
description.

This means that clients can code a fallback representation of anything that
might go in the cart. If the server decides to add a new `Discount` type that
older clients don’t support yet, they can at least render a line of text
describing the line item, and show the value contribution to the cart total.
This addresses our second requirement, older clients are always able to show
everything in the cart.

In this case the reason an interface worked for us was because there is are
attributes of line items that are fundamental to their ability to work which
can be put into an interface. A union didn’t work because it relies on clients
always being up to date to be able to get information out of instances in
them.

### User accounts – a Union of Interfaces

This brings us to the final example from Thread’s API: user accounts. There
are many different types of user on Thread, we have:

- users who signed up for the “styling experience”, this is most users
- users who only came to buy one thing and who might come back, but for now
  don’t have the styling experience part of the service
- users who closed their account
- users who have not authenticated themselves, so we don’t know who they
  are

Users also have certain abilities that they may or may not be able to perform,
depending on their account status:

- They may be able to buy things
- They may be able to communicate with a stylist
- We may know their personal details so that we can address them by their
  name or send them an email

Most of the time clients only need to care about the presence of certain
properties, not about the underlying type, but the server needs to compose
those properties in different combinations.

The solution we went with here was a Union of types that conformed to
interfaces.

```graphql
union User = Full | Limited | Restricted | Anonymous

interface Styling {
    ideasFeed: IdeasFeed!
}

interface Ecommerce {
    cart: Cart!
    checkout: Checkout!
}

interface Named {
    informalName: String!
    fullName: String!
}

type Full implements Styling, Ecommerce, Named {
}

type Limited implements Ecommerce, Named {
}

type Restricted implements Named {
}

type Anonymous implements Ecommerce {
}
```

This structure allows the server to return the type of user it wants, and
allows the client to select fields based on how it wants to use the data.

For example, to get the cart the client could use the query:

```graphql
query {
  viewer {
    ... on Ecommerce {
      cart {
        ...CartFragment
      }
    }
  }
}
```

Or to get the ideas feed the client could use the query:

```graphql
query {
  viewer {
    ... on Styling {
      ideasFeed {
        ...IdeasFeedFragment
      }
    }
  }
}
```

These queries mean that the client doesn’t need to understand the types of
users available, or how various site features map to those types — this is the
main benefit of interfaces. However the use of a union for `User` means that
we can have many different interfaces represented, and compose them together
on different types in that union.

---

Hopefully these case studies provide deeper context to some of the design
decisions we made in the Thread API. These are designs that we didn’t get
right the first time, but after iterating the design and trying to understand
how it would be used in the client and how we would evolve it over time, we
managed to find the designs we currently have.

In summary:

- Unions are good for documenting, and forcing the client to understand how
  different types should be treated.
- There isn’t always an advantage to grouping shared fields into interfaces,
  it depends on the use-case.
- Interfaces are good for when the types have a fundamental commonality in
  how they should be used.
- Interfaces can be used to allow clients to be forwards compatible with new
  types that the server might introduce, which can be important for mobile
  apps that may not be updated frequently.
- Unions and interfaces can be combined to compose together behaviours into
  more complex types, but to still allow the client to select the fields it
  needs in each situation.
