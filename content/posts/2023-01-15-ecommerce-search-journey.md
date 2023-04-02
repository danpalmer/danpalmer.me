---
title: "A Journey in E-commerce Search"
date: 2023-01-15
featured: true
---

At Thread we went through several iterations of Search, evolving the technology as we evolved the business and our understanding of what our customers wanted. Later stages went beyond my naive understanding of search at the time, and may prove useful inspiration to others.

Before we dive in, some clarification of terms. For us, _search_ meant free text entry that generated product results, whereas _filtering_ referred to distinct options that could be chosen by the user, such as filtering to next-day delivery or a particular brand.

### In the beginning there was no search

It may seem strange that an e-commerce business may not have a product search to begin with, but in the early days (from founding in 2012 before I started, to around 2015) we saw the business as recommendation-based, with just enough retail to sell products. Later we realised that a feature-complete e-commerce system was necessary for many reasons[^1].

In hindsight, search was a critical feature and the entry point to many journeys. Lesson learnt: challenge the status quo, but recognise what customers will expect regardless of how the business sees itself.

### Just use Postgres Full Text Search!

[Postgres Full Text Search][pgfts] is the go-to answer for the first implementation of any search system and scaling to bigger systems the answer is often [ElasticSearch][elasticsearch]. The other go-to answer is to outsource the problem to a service like [Algolia][algolia].

However all of these “answers” skip past the issue of what is being searched as if it's obvious and doesn't need to be questioned.

Around 2016 we implemented the obvious solution – Postgres Full Text Search across our products table[^2]. All that was involved was adding a new field and index to the table, telling Postgres which fields to pull from for the search, and setting the new field when adding or updating products. We included all the fields that would make sense: name, description, colour, brand, and a few others.

Unfortunately the search results were garbage[^3].

Thread sold clothes, so the majority of searches looked like “blue shirts” or “Nike shoes”. It turns out that most blue shirts don’t say “blue shirt” in their name or description[^4], many non-blue items still say “blue” (for trim, buttons, etc), and even some shirts won’t say “shirt”. This results in many relevant results being missed. Conversely, all Nike items will include the text “Nike”, not just shoes, and so there will be many irrelevant results.

While searching products in order to return product results was the obvious solution, it was a terrible one. Full text search is, understandably, only as good as the text that you give it. Postgres and ElasticSearch can do a lot of magic when it comes to normalising words, but they can’t know that a shirt is blue unless something says it is.

Thankfully we had the basis of a solution to this problem. All products went through extensive manual review and tagging, but all this data was represented in other tables, enums, a categorisation hierarchy, and other mechanisms that weren’t _text_ in the products table.

### We don't have to search products 🤯

We noticed that for the vast majority of searches there was an equivalent way to set up our product filtering. For example the term "blue shirts" translated to a filter to the Shirts category, and the Blue colour, and similar for "nike shoes" filtering to the Nike brand.

So why not search _filters_ instead of _products_? This would mean searching filters, taking the best result, and applying that set of filters to the products table. We embarked upon this new search implementation around 2018.

It turns out this was fairly straightforward to implement[^5]! Consider the following table in ORM-pseudocode.

```python
class SearchItem(Model):
  id = PrimaryKey()

  text = TextField()
  filters = JSONField()

  # For Postgres Full Text Search
  search_vector = SearchVectorField()
```

We then used generators like this[^6]:

```python
class BrandXCategory(Generator):
  def generate(self):
    for brand in get_brands():
      for category in get_categories():
        yield SearchItem(
          text=f"{brand.name} {category.name}"
          filters={'brand': brand.id, 'category': category.id},
        )
```

There were many generators covering all types of filter that would often be combined – brand, category, brand+category, category+colour, material, material+category, and so on. Every day, or when major filtering changes were made, a search indexer would run over all the generator classes, generating all the search items, and updating the search items table.

When searching, the user would enter some text and get suggested results as is common in many search results. The user would select one of these (often the pre-selected top one by hitting enter), and would be taken to a regular filtered product listing. From here they could further tweak the filtering.

There were many advantages to this approach...

- Search results couldn't be wrong. Apart from incorrect tagging of products (relatively rare), the search query was almost guaranteed to return items that were exactly relevant.
- Because relevance was boolean, rather than being a ranking like it is in most search implementations, products could be ranked by the recommendation engine to surface the most suitable products at the top of results.
- As the text being searched was synthesised and _not user visible_, we could keyword-stuff this as much as we liked. Brands had a list of alternative spellings/formulations of their names, colours, categories, and materials had synonyms.
- Postgres FTS has the ability to search different fields with different priorities, so we actually had `text1`, `text2`, and `text3`, with corresponding priorities, and could put less relevant words further down the hierarchy.

This system worked well and lasted us for a few years with few complaints. We improved the search index content over time, but for the most part it required little to no maintenance.

### Joins don't scale[^7]

Product filtering was implemented exactly how you'd expect, just a bunch of `JOIN` and `WHERE` clauses. This was great for simplicity, but as filtering became more complex and involved more tables, speed became a limiting factor. Customer facing searches could take around 100ms just for the products query, while internal users who had access to a few more filters could easily reach 10 seconds.

The trigger for solving this however was SEO optimisation. This has a bad reputation, but the reasonable side of it is essentially showing search engines how your information hierarchy works, and telling them not to scan areas that don't matter. For Thread, this meant correctly marking-up filtering controls so that search engines could understand the map of results pages.

However, multiplying out all possible filter combinations would result in _millions_ of results pages, most of which would be empty. We therefore wanted to know, for any given combination of filters, _how many matching products were there_? The search indexer already computed this, but it only covered filter combinations that were indexed, and was only updated daily, so could be quite out of date.

Making filtering fast could bring other benefits:

- Internal tools would return results a lot faster.
- Because of this, we could improve the UX to update as filters were applied, improving productivity and possibly the results of work done with those tools.
- Many user-facing surfaces could be made significantly faster – e.g. related products.
- Requested features such as suggested filters would become much easier to implement in a performant way.

Around 2020, while on a Friday afternoon Zoom call during lockdown, we had a breakthrough: what if we pre-computed filters as in-memory bitmaps?

Each filter would be a bitmap with each index corresponding to a product ID, set to 1 if that product applied to that filter, otherwise 0. To find products matching a set of filters, those corresponding bitmaps would be `AND`'d together, and the 1-valued indices read out of the results.

For example, given 3 products:

| ID  | Category | Brand  | Colour |
| --- | -------- | ------ | ------ |
| 1   | Shoes    | Nike   | Blue   |
| 2   | Shoes    | Nike   | Red    |
| 3   | Shoes    | Adidas | White  |

The bitmaps may look like:

| Filter | Bitmap |
| ------ | ------ |
| Nike   | `110`  |
| Adidas | `001`  |
| Blue   | `100`  |
| Red    | `010`  |
| White  | `001`  |
| Shoes  | `111`  |

For a user search query of Nike Shoes, the bitmaps `110` and `111` would be combined to produce `110`, indicating products 1 and 2, corresponding to the 1 indices, are matches.

This was _fast_. Processors are fast at performing boolean logic on large binary blobs. We were able to compute complex filters in several milliseconds.

The only downside was the memory usage. The scheme required one bit for every integer product ID, for every filter. While probably [_manageable_][doesitfitinmemory], it was unlikely to be _ergonomic_, introducing operational issues and making local development harder. It would also necessitate storing data in another system, rather than in-process on webservers, adding network latency to queries.

We found a neat solution in the form of [Roaring Bitmaps][roaringbitmaps]. These could compress the bitmap data by several orders of magnitude. While we expected a significant overhead at query time, this wasn't born out in initial testing, possibly because there was so much less data that needed to be processed.

I left Thread before we managed to put this into production. A colleague implemented a prototype that worked fantastically, and that we believed would solve all of the challenges we'd had with the existing filtering system and open the door to new product features.

---

Implementing search at Thread was a journey in understanding the _problem_ of search in _our product_, and in understanding how our technology could address that problem. There was no one piece of off the shelf technology that would have solved this for us, nor any SaaS we could have dumped our data into to fix search[^9].

I learnt a lot throughout this process, and consider it one of my formative experiences in developing as an engineer. I hope that others can learn something from the journey too.

[^1]: While recommendations were always the core of the business, the secret sauce, and the primary draw for our customers, it was often a gateway into the user further refining selections through a more standard e-commerce experience where customers expected things like: search, sorting by price low-to-high, next-day delivery, gift vouchers, and more.
[^2]: Falsehoods programmers believe about e-commerce: there is a single "products" table.
[^3]: Thread actually scraped inventory from the websites of many partners (with explicit permission and contracts), so we often didn't know what inventory we had until we sold it. The search results were garbage if you were a customer looking for something specific, but could be great fun for staff looking for the most ridiculous products we, a _clothing retailer_, were selling. Classics included: Trump candles, weed candles, lots of candles, a 3 seater sofa, and a folding garden chair which someone actually ordered, and our warehouse staff happily received, packaged, and dispatched to the office.
[^4]: Why would they? An image tells a thousand words, so there's no need to have the words "blue shirt" next to a photo of a blue shirt. This is only a half-truth, as for SEO there may be reasons to include this, but that data is still unstructured, may be in key words rather than the description, and likely won't cover synonyms. Additionally, brands often have brand guidelines to follow that include particular names for categories that can be non-standard, and the closer you get to the luxury end of the market the less SEO matters and the more out there product descriptions can get.
[^5]: After the latest round of user feedback about terrible search I rage-implemented this in a Pret on a Saturday afternoon.
[^6]: There were a few more pieces to the API, for example actually applying the filtering to check how many products it applied to at that time, and filtering out combinations with no products – we didn't want to show Nike Suits. Another part of the API was search-time formatting of the result, which allowed tweaking the user-visible text. This allowed for translation and internationalisation, and also generating the fallback `Search "foo"` item for free text search.
[^7]: SQL JOINs scale perfectly well, until they don't. This is a complex and nuanced topic. Anyone selling a NoSQL database by saying joins don't scale, hasn't tried. Similarly, anyone saying joins have no problems hasn't used enough to hit the Postgres genetic query plan optimiser yet.
[^8]: To represent price the idea was to segment pricing into brackets such as <£1, <£2, <£3, ... <£1000, <£1100, and so on, with closer grouping and therefore more sensitivity, lower down the scale.
[^9]: Several times people in the company would raise the idea of services like Algolia and say "can we just use this". Explaining why this wouldn't Just Work™ was sometimes a tricky conversation as it's easy to come across as another engineer promoting [Not Invented Here syndrome][nih], but the end result was a better understanding of the problem across the company and more buy-in to solutions, and therefore ultimately an important process to go through.

[doesitfitinmemory]: https://yourdatafitsinram.net/
[roaringbitmaps]: https://www.roaringbitmap.org/
[algolia]: https://www.algolia.com/
[pgfts]: https://www.postgresql.org/docs/current/textsearch.html
[elasticsearch]: https://www.elastic.co/elasticsearch/
[nih]: https://en.wikipedia.org/wiki/Not_invented_here
