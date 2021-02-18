import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";

export default () => {
  return (
    <Layout>
      <article className="cv flex flex-wrap">
        <div className="w-70">
          <h1 className="f3-m  mb1 f2-l show-print">
            Dan Palmer &mdash; Software Engineer
          </h1>
          <section>
            <h2 className="f3-m  mb1 f2-l hide-print">Experience</h2>
            <div className="mb1">
              <h5 className="f6 gray mt4">
                <span className="black">Thread</span>
                &nbsp;&ndash; Software Engineer (Level 4), September 2020
                &mdash; Present
              </h5>
              <p>
                As a senior member of the engineering team at Thread I am
                responsible for the technical architecture of our services and
                improving how we work as engineers. I'm trusted across the
                business to deliver independently. In addition, I have been...
                <ul>
                  <li>
                    Tech lead for new business line, whitelabelling of Thread
                    app and service for an international clothing brand. Started
                    in March 2020. Responsible for overall architecture and
                    technical outcome. Implemented partner integration and
                    backend, involved in iOS implementation.
                  </li>
                  <li>
                    Tech lead for cloud migration, moving Thread services from
                    "bare-metal" machines to Google Cloud Platform.
                  </li>
                </ul>
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">Coefficient</span>
                &nbsp;&ndash; Contract Software Engineer, May 2020 – September
                2020 (Part Time)
              </h5>
              <p>
                Supported data scientists and client development teams with code
                review and turning prototypes into production-ready code to
                support core business operations. Rapidly built out website and
                internal tools for training course booking, with a custom CMS,
                checkout and payments.
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">Thread</span>
                &nbsp;&ndash; Software Engineer (Level 3), October 2017 &mdash;
                September 2020
              </h5>
              <p>
                Delivered a number of high impact engineering projects,
                including:
                <ul>
                  <li>
                    Modernising payment processing to support EU Strong Customer
                    Authentication legislation.
                  </li>
                  <li>
                    Architecting and implementing the first API, using GraphQL,
                    for a new iOS app. Now used across all frontends.
                  </li>
                  <li>Backend engineer on Thread's first iOS app.</li>
                  <li>
                    Defined current practices for observability in the
                    engineering team.
                  </li>
                </ul>
                Also a core part of the hiring team for engineering roles, and
                continued to be deeply involved in product iterations and the
                direction of the engineering team. Involved in new-hire training
                across the company.
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">Thread</span>
                &nbsp;&ndash; Software Engineer (Level 2), June 2014 &mdash;
                October 2017
              </h5>
              <p>
                Delivered many customer product iterations in a fast-paced
                product team, typically focused on improving specific business
                metrics such as customer acquisition cost or lifetime value.
                Supported teams across the business, such as operations,
                styling, and support. Notable projects include reducing orders
                affected by out of stock products by ~90%, and improving
                scalability of styling effort, allowing Thread to scale at low
                cost.
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">MWR InfoSecurity</span>
                &nbsp;&ndash; Security Research and Development, Summer 2013
              </h5>
              <p>
                Built a new security product from idea to fully featured
                prototype in order to explore a new potential business
                opportunity for the company. This was successful and development
                continued, being spun out into a new company – Countercept,
                growing to around 100 people before being acquired along with
                MWR by F-Secure in 2018.
              </p>
              <p>
                Found critical vulnerability in a well-known communication app,
                as part of a penetration testing project. Reviewed and approved
                the client's fix.
              </p>
              <p>
                Assisted in incident response for an attack by a suspected
                "Advanced Persistent Threat" actor, analysing a piece of malware
                to reverse engineer the cryptography being used by it.
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">GoSquared</span>
                &nbsp;&ndash; Software Developer, Summer 2012
              </h5>
              <p>
                Re-built backend services for real-time visitor stats in web
                analytics and introduced new unit-testing framework to the team.
                Services built with Node.js and Redis. Completed technical
                evaluation of Cassandra for analytics storage.
              </p>
              <h5 className="f6 gray mt4">
                <span className="black">Realmac Software</span>
                &nbsp;&ndash; Software Developer (Intern), Summer 2011
              </h5>
              <p>
                Contributed to in-house frameworks that were shared between
                several applications, and helped put the finishing touches on{" "}
                <em>Analog</em> prior to release. Focused mainly on client-side
                integrations with webservice APIs such as Facebook, Twitter, and
                Amazon S3, working in Objective-C for macOS.
              </p>
            </div>
          </section>
        </div>
        <div className="w-70">
          <section>
            <h2 className="f3-m  mb1 f2-l">Qualifications</h2>
            <div className="mb1">
              <p>
                <strong>
                  MEng Computer Science with Mobile and Secure Systems
                </strong>
                <br />
                University of Southampton (2010-2014)
                <ul>
                  <li>Programming Principles: 92%</li>
                  <li>Secure Systems: 82%</li>
                  <li>Winner of 3rd Year Netcraft Prize</li>
                </ul>
              </p>
            </div>
          </section>
          <section className="pt3">
            <h2 className="f3-m mb1 f2-l">Talks</h2>
            <div>
              <p>
                <ul>
                  <li>
                    <a
                      className="link gray underline-hover"
                      href="https://skillsmatter.com/skillscasts/11718-django-enumfield"
                    >
                      Managing Special Cases with Django Enumfield – London
                      Django Meetup 2018
                    </a>
                  </li>
                  <li>
                    <a
                      className="link gray underline-hover"
                      href="https://www.youtube.com/watch?v=jBBcORHhfV0"
                    >
                      Scaling Django Codebases – PyConUK 2017
                    </a>
                  </li>
                </ul>
              </p>
            </div>
          </section>
          <section className="pt3">
            <h2 className="f3-m  mb1 f2-l">Skills</h2>
            <div>
              <h5>Technical</h5>
              <p>
                <ul>
                  <li>
                    Currently using Python, Django, Kubernetes, Swift,
                    Javascript, React and Git
                  </li>
                  <li>
                    Experience with building and maintaining Continuous
                    Integration and Delivery processes
                  </li>
                  <li>Experience using Postgres and Redis in production</li>
                  <li>
                    Previously worked on Objective-C, C# .NET MVC, Elm, and
                    Node.js codebases on professional projects
                  </li>
                  <li>
                    Some experience with Haskell and Ruby for personal projects
                  </li>
                  <li>Used Java, C and Io in university projects</li>
                  <li>
                    Knowledge of, and interest in, computer security issues
                  </li>
                  <li>
                    Found account takeover vulnerability in GitHub and
                    information disclosure vulnerability in Django (
                    <Link to="/2020-06-07-django-memcache-vulnerability/">
                      CVE-2020-13254
                    </Link>
                    )
                  </li>
                  <li>
                    Basic knowledge, and interest in penetration testing and
                    malware analysis
                  </li>
                  <li>Experience with good software design practices</li>
                </ul>
              </p>
              <h5>Non-Technical</h5>
              <p>
                <ul>
                  <li>
                    Strong emphasis on empathy, candour and clarity in
                    communication
                  </li>
                  <li>Extensive experience with code review</li>
                  <li>Experience in hiring for software engineering roles</li>
                  <li>
                    Experience with project management tools, bug tracking and
                    testing feedback
                  </li>
                  <li>Great written and spoken communication</li>
                  <li>
                    Experience working in an environment with constant
                    re-prioritisation of work
                  </li>
                  <li>Keen and able to learn new problem domains quickly</li>
                </ul>
              </p>
            </div>
          </section>
          <section className="pt3">
            <h2 className="f3-m  mb1 f2-l">Contact</h2>
            <p>
              You can contact me at{" "}
              <a
                className="link gray underline-hover"
                href="mailto:cv@danpalmer.me"
              >
                cv@danpalmer.me
              </a>
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
};
