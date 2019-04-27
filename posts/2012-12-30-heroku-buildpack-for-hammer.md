---
date: '2012-12-30'
layout: post
redirect_from:
- /2012/12/heroku-buildpack-for-hammer
slug: heroku-buildpack-for-hammer
title: Heroku Buildpack for Hammer
---

I have recently been developing a few static sites using [Hammer](http://hammerformac.com), a great little Mac app that handles compiling resources and putting together parts of web pages to create static websites. Hammer is also able to publish drafts to [hammr.co](http://hammr.co/), which is great for getting some feedback and showing different versions of a design, but not suited for hosting a site in production.

Although it would be easy to put the static site on any one of the nearly infinte shared hosting or VPS services out there, I already have a few sites on Heroku, I find the deployment process easy, and I know that most of the time I can get away with staying on the free plan! For these reasons, I set out to make it easy to deploy a static site built with Hammer to Heroku.

Heroku allows custom 'buildpacks' which are scripts that can package up an 'app' or site for release. These can do some [really cool things](https://github.com/mattt/heroku-buildpack-core-data), but I just wanted to serve static content with [Nginx](http://nginx.org). There are a few static buildpacks out there, but many use Apache whereas I wanted Nginx, and the Nginx buildpacks mostly require a fair amount of configuration so would need to be forked for use on Hammer sites anyway. I have been wanting to try creating a buildpack for a while, so I thought this was a good opportunity to try.

#### Creating the Buildpack

Buildpacks are composed of three scripts:

 - `detect` -- Test to see if an application can be deployed with this buildpack.
 - `compile` -- Set up the application and anything else required to deploy it in the `BUILD_DIR`.
 - `release` -- Provide a list of required addons and process types to Heroku.

The `detect` script for my buildpack is trivial. As Hammer compiles a site to a `Build` directory it tests for the existence of this and fails if it is not found.

<script src="https://gist.github.com/4413862.js"></script>

Once this has run and determined that the application can be built with this pack, we need to download and compile Nginx in the `compile` script.

<script src="https://gist.github.com/4413883.js"></script>

At the end, this compile script creates `boot.sh`. We have a Nginx configuration file that we need to use when running the site, but at the time of building we do not yet know what port Heroku wants the application to run on. Because of this, at the moment the script is called `nginx.conf.erb` and contains a placeholder for the port. `boot.sh` will compile the template at runtime and then launch Nginx.

<script src="https://gist.github.com/4413900.js"></script>

A few things to note in this Nginx config (that I learnt the hard way) are that as Heroku expects the `boot.sh` script to run for the lifetime of the process, we must tell Nginx not to run as a daemon, which its default behaviour. Also, by default, if Nginx is not running on port 80, it will redirect links to the port it is running on. As Heroku reverse proxies traffic to the applications we do not want this to happen as visitors will access the site on port 80. To stop this, the location must have `port_in_redirect off;` set.

Finally, Heroku requires a `release` script which should return a YAML formatted configuration for the addons that are required, and for the processes that the application can run. In this case we have no addons, and only one type of process which runs `boot.sh`.

<script src="https://gist.github.com/4413947.js"></script>
<br/>

#### Using the Hammer Buildpack

Turning a site developed with Hammer into a Heroku application is easy. The directory needs to be managed with Git, but once the repository is all set up just create and deploy.

<script src="https://gist.github.com/4414082.js"></script>
<br/>

#### Future

I am hoping to get this set up to handle errors with custom error pages, but for now it is good enough for my needs.

This is the first Nginx configuration I have written, so if you think I have missed something important, please open an issue on [danpalmer/heroku-buildpack-hammer](https://github.com/danpalmer/heroku-buildpack-hammer/issues) or submit a pull-request with your changes.