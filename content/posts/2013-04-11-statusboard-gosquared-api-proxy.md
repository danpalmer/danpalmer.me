---
date: 2013-04-11
layout: post
redirect_from:
  - /2013/04/statusboard-gosquared-api-proxy
  - /blog/articles/2013-04-11-statusboard-gosquared-api-proxy.html
slug: statusboard-gosquared-api-proxy
title: GoSquared API Proxy for Panic's Status Board
---

Yesterday [Panic](http://panic.com), a well known Mac and iOS development company, launched a new app for iPad. [Status Board](http://panic.com/statusboard) is based on their famous [office status board](http://www.panic.com/blog/2010/03/the-panic-status-board/).

Since I worked at [GoSquared](http://gosquared.com/) last summer, know the API and use the service, so I thought it would be nice to get the timeline of current visitors and top pages from my site into a panel on my status board.

I've set up a public API for this so that you can use it with no setup at all. But the code is all on GitHub so you can self-host it.

#### Timeline

![GoSquared Statusboard Graph](/posts/images/statusboard-gosquared.png)

<a href="http://statusboard.danpalmer.me/timeline/demo/GSN-181546-E">http://statusboard.danpalmer.me/timeline/<code>API_KEY</code>/<code>SITE_TOKEN</code>/<code>COLOUR?</code></a>

**Note: this service is no longer provided, GoSquared now provide first-class support for Panic's Statusboard, see [here](https://www.gosquared.com/statusboard/) for more details.**

The colour of the graph is defined in the JSON returned, and defaults to "blue". Colours that Status Board will display are _red_, _blue_, _green_, _yellow_, _orange_, _purple_, _aqua_, or _pink_.

#### Pages

![GoSquared Statusboard List](/posts/images/statusboard-gosquared-pages.png)

<a href="http://statusboard.danpalmer.me/pages/demo/GSN-181546-E">http://statusboard.danpalmer.me/pages/<code>API_KEY</code>/<code>SITE_TOKEN</code></a>

You can find your API key and site tokens [here](https://www.gosquared.com/home/developer).

<script src="/assets/scripts/jquery-1.7.2.min.js"></script>
<script src="/assets/scripts/jquery.githubrepowidget.js"></script>
<div class="github-widget" data-repo="danpalmer/statusboard-gosquared"></div>

<small>**Note:** The API may be taken offline at some point in the future if I am no longer able to maintain it. I take no responsibility for any inconvenience caused by the API not being available.</small>

### Deployment

There are a few ways you can deploy this for your own use. I've done a manual setup of Node.js running a local only server on port 8000 as an Upstart service. I use Nginx to reverse proxy to this on the _statusboard_ subdomain.

My Upstart script in `/etc/init/statusboard-gosquared.conf` looks something like this:

<script src="https://gist.github.com/danpalmer/5372062.js"></script>

Nginx can then be configured as a reverse proxy with something like this (formatting is a bit different so that it fits properly in the embedded Gist):

<script src="https://gist.github.com/danpalmer/5372091.js"></script>

If you don't have a VPS, or don't want to go through the hassle of setting this up, the API should work well on a singly dyno Heroku application instance. You'll need to modify the repository a bit to get it ready for Heroku, it needs a Procfile and a different version of Node specified, but it should just work. For more details on how to do this, have a look at [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/nodejs). Also note that the bottom of <code>api.js</code> will need to be modified to run on the port given to your application by Heroku, and you will also need to remove the <code>"127.0.0.1"</code> argument to the listen function.
