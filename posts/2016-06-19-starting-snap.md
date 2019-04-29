---
date: "2016-06-19"
layout: post
preview:
  Following on from my previous post about Haskell web frameworks, I've dived
  into making a non-trivial web application, with type-safe database access.
redirect_from:
  - /2016/06/starting-snap
slug: starting-snap
title: Starting a Snap site with Stack and Persistent
theme: light-gray-purple
---

Following on from my [previous post](https://danpalmer.me/blog/haskell-web-frameworks) about Haskell web frameworks, I wanted to dive into actually making something with my favourite of the lot. Snap gives you a lot right out of the box, but setting up an application to the point where it can talk to a database in a useful way (i.e. not untyped raw queries) takes a little bit of work.

Note: Since my goal here is to _learn_, and do things the "right way", I'm not worrying too much about productivity or whether these solutions are proportionate to the problem I'm trying to solve. There are certainly simpler ways that would have sufficed (i.e. dropping authentication, using a simpler templating system, or using [postgresql-simple](https://hackage.haskell.org/package/postgresql-simple)).

My requirements for this project were:

- To write _idiomatic_ Snap, making good use of Snaplets.
- To use modern Haskell development tooling, like Stack, and up-to-date libraries.
- To interface to the database with a high-level, type-safe interface, in this case Persistent and Esqueleto.

### Setting up Snap

In the interests of writing idiomatic Snap code, I wanted to start from a project template. The `snap` binary has the ability to generate several template projects, so I installed it into my global Stack environment, and ran `snap init` in a new directory.

The snap starter template is a little out of date, with a few packages that need updating if we want to use the latest LTS from Stackage, and with support for older versions of packages and the GHC compiler that we're unlikely to need.

First off, let's remove the flag for the old version of `base`, we won't need it. [747aba1f](https://github.com/danpalmer/snap-starter/commit/747aba1fe276d79acce8e0af3c7ac2a10f8a8e45)

Next, we can remove support for GHC 6.x. We're on 7.x and 8.x is now out, so we won't need this either. [6ec44529](https://github.com/danpalmer/snap-starter/commit/6ec445292ac62ed85f810e09cc7e84c55bcb6656)

The snap template gives us a Cabal-based project, but we don't have the necessary configuration for Stack yet. It's generally easy to add this with `stack init`, however there are a few dependencies that we can't resolve with the project in its current state. By bumping a few versions and adding other packages as extra dependencies, we can create a basic `stack.yml` [6ec44529...72ffda4f](https://github.com/danpalmer/snap-starter/compare/6ec445292ac62ed85f810e09cc7e84c55bcb6656...72ffda4fb66f1af42f11a5dc5d3c8b17a100c97b).

At this point, we should be able to run `stack build`, then `stack exec snap-starter` (or whatever your project is called). You should see a basic site served on port 8000.

Another thing to note in the project cabal file is that there's a flag for compiling in development mode. This changes some of the behaviour in `Main.hs` to enable hot-reloading of the site on each request. This obviously slows it down significantly, but also speeds up development time.

##### Sidenote – gitignores

The standard snap template, and development builds, leave some files around that we won't want to commit into version control. For this reason it's a good idea to add a `.gitignore` file. I've used the standard GitHub Haskell file, with a few additions [6261a585](https://github.com/danpalmer/snap-starter/commit/6261a585bca5a5d7e1b5e153f2e0fd90b2e6ba4c).

In addition to this, later on, the auth and persistent snaplets will write development configuration files. You may want to ignore these, depending on your development process.

### Adding a database

We can use a snaplet to provide an adapter to a Persistent-based database backend. This gives us the advantages of easy model definitions, type-safe querying, and so on, but requires a little set-up. There's a handy [snaplet-persistent], but unfortunately it's a little out of date and won't work with our current dependencies. For now, I've forked a version and bumped the dependencies, but this is so far untested [941b4d29](https://github.com/danpalmer/snap-starter/commit/941b4d299731efcf909eb16200e8e56eb0b94e56).

First off, let's define a simple model to use for testing.

```haskell
module Models where

import Database.Persist.TH

share [mkPersist sqlSettings, mkMigrate "migrateAll"] [persistLowerCase|
  BlogPost
    title String
    content String
    deriving Eq Show
|]
```

Note: some extra language extensions are needed for this, read the [full diff](https://github.com/danpalmer/snap-starter/commit/d4b15434e245e23cb4be97bcfa2db1a96e281548) for more details.

We also need a few more packages [35aa5299](https://github.com/danpalmer/snap-starter/commit/35aa5299d0d9a35636d6fe0d8c67b81d070b879c).

Next up Persistent requires some state, specifically a connection pool, which we can add to our app state structure:

```haskell
import Snap.Snaplet.Persistent

data App = App
    { _heist :: Snaplet (Heist App)
    , _sess :: Snaplet SessionManager
    , _auth :: Snaplet (AuthManager App)
    , _db :: Snaplet PersistState
    }
```

We can then initialise this state when we make our snaplet:

```haskell
app :: SnapletInit App App
app = makeSnaplet "app" "An snaplet example application." Nothing $ do
    -- ...
    p <- nestSnaplet "" db $ initPersist (runMigrationUnsafe migrateAll)
    -- ...
    return $ App h s a p
```

When initialising the Persistent snaplet, we can pass it a function to run within the SQL context once initialised. The intented use of this is that we can run our migrations, so we just pass the migration function that Persistent generates for us.

### Persistent Authentication

The snap template includes a basic authentication system for us which backs on to a flat JSON file on disk. While the auth system is relatively capable, a JSON flat file isn't an ideal backend, and although snap ships with a [postgresql-simple](https://hackage.haskell.org/package/postgresql-simple) backend, it would be nice to use Persistent so that we can enforce foreign key constraints and types in Haskell.

Thankfully, `snaplet-persistent` ships with a backend for it, and with a quick modification to the authentication system's initialisation, we can take adavantage of it [eef404a4](https://github.com/danpalmer/snap-starter/commit/eef404a427daa206133b2ad7df0cd142f2afba95). The only slightly tricky bit here is that we've got to pass the persistent auth manager the connection pool that's buried within the persistent snaplet.

```haskell
app :: SnapletInit App App
app = makeSnaplet "app" "An snaplet example application." Nothing $ do
    -- ...
    p <- nestSnaplet "" db $ initPersist (runMigrationUnsafe migrateAll)
    a <- nestSnaplet "auth" auth $ initPersistAuthManager sess (persistPool $ view snapletValue p)
    -- ...
    return $ App h s a p
```

Finally, we need to ensure that the User model for authentication gets created in the database, which we can do by adding it to the list of entities that we're going to create [c16d140f](https://github.com/danpalmer/snap-starter/commit/c16d140f2d21592eb2ed2ac784d78f108d22c702).

```haskell
import Snap.Snaplet.Auth.Backends.Persistent (authEntityDefs)

share [mkPersist sqlSettings, mkMigrate "migrateAll"] $ authEntityDefs ++ [persistLowerCase|
  BlogPost
    title String
    content String
    deriving Eq Show
|]
```

When we compile and run this, we will be able to see Persistent creating the user model in the database.

### Querying the Database

The last step is to figure out how to query the database for useful results to display on a page.

While Persistent does have a way to query the database, it's low level, and designed to work for every persistent backend, rather than work well for relational databases. Because of this, I'm going to use [Esqueleto](https://hackage.haskell.org/package/esqueleto) instead, which provides an EDSL for SQL queries.

After adding a few dependencies ([3a7274ae](https://github.com/danpalmer/snap-starter/commit/3a7274ae96105a4b0a5860e620a03f6cec155d1f)) we must provide a way for Persistent to find the connection pool in our application state. To do this, we must implement `HasPersistPool` over the `Handler` for our app.

```haskell
instance HasPersistPool (Handler a App) where
    getPersistPool = with db getPersistPool
```

Unfortunately, this isn't all we need – some of our handlers use authentication, and therefore we're actually running in a `Handler a (AuthManager App)` instead, so we also need an instance for that. With this instance, the `withTop` function is able to traverse back to our `App` state.

```haskell
instance HasPersistPool (Handler App (AuthManager App)) where
    getPersistPool = withTop db getPersistPool
```

We can now write a query with Esqueleto. The full extent of this query is out of the scope of this blog post, but there's some great documentation, and plenty of examples of Esqueleto around the web.

```haskell
selectBlogPosts :: MonadIO m => E.SqlPersistT m [BlogPost]
selectBlogPosts = do
    posts <-
        E.select $
        E.from $ \blogPost -> do
            E.orderBy [E.asc (blogPost E.^. BlogPostTitle)]
            E.limit 3
            return blogPost
    return $ E.entityVal <$> posts
```

Finally, we can use this query to render a page. Here we first query for the blog posts, and then construct a splice for the blog posts that repeats its contents once for each element, along with child splices which expose the title and content of each post on each iteration through that list.

```haskell
handleBlogPosts :: Handler App (AuthManager App) ()
handleBlogPosts = do
  blogPosts <- runPersist selectBlogPosts
  renderWithSplices "blog_posts" (splices blogPosts)
  where
    splices bps =
      "blogPosts" ## I.mapSplices (I.runChildrenWith . splicesFromBlogPost) bps

    splicesFromBlogPost p = do
      "title" ## I.textSplice (T.pack (blogPostTitle p))
      "postContent" ## I.textSplice (T.pack (blogPostContent p))
```

The result of this (along with a few other imports and a template in [67f3b423](https://github.com/danpalmer/snap-starter/commit/67f3b423d7fe1aa331b313f38461ba7ca0f4a09d)) is that we can visit `/posts` on our application and see a list of the top 3 posts, ordered by name ascending.

---

That's all for now. We have a barebones Snap application that uses the out of the box authentication, a database with an interface using Persistent for models and Esqueleto for querying, and we've seen how we can expose data to Heist for rendering HTML. The next things I'm looking at are form validation and background tasks, as both are crucial to a web application of any real complexity.
