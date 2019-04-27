import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import BuildChart from "../components/build-chart/build-chart";

import styles from "./careers.module.scss";

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h1>Engineering at Thread</h1>
        <div className="lead">
          We’re working hard to create one of the highest quality engineering
          cultures around.
        </div>
        <div className={styles.principles}>
          <div className={styles.principle}>
            <h3>Autonomy</h3>
            <p>
              We work hard to remove anything that gets in the way of shipping
              great code. This means minimal meetings, zero politics, fast
              decision making, and freedom to choose which projects you work on.
              We don’t track hours, and offer unlimited holiday (and expect
              people to take it!).
            </p>
          </div>
          <div className={styles.principle}>
            <h3>Craft</h3>
            <p>
              Code quality is one of our highest priorities. Not only is great
              code a joy to work with, it’s the only way to move quickly over
              the long-run. We take pride in our work, do thorough code reviews,
              and leave time every week to work on technical debt.
            </p>
          </div>
          <div className={styles.principle}>
            <h3>Self-iteration</h3>
            <p>
              Personal growth and candid feedback is a huge part of our culture.
              Code reviews, fortnightly one-to-ones, lunch & learns,
              retrospectives and more happen constantly. We use kanban (with a
              physical board) for the team experiments we’re currently running.
            </p>
          </div>
        </div>
        <div className={styles.sections}>
          <section>
            <h3>Thoughtful about Culture</h3>
            <p>
              A lot of people in the startup world seem to confuse culture with
              perks. We see culture as the collection of shared beliefs and
              behaviours in the team. It’s the fuzzy, intangible thing that
              keeps people working together well with minimal process.
            </p>

            <p>
              When looking for new engineers, data scientists and designers to
              join the team, we’re seeking a heterogeneity of background and
              homogeneity of values.
            </p>

            <p>Our values are:</p>
            <ul className="text-list">
              <li>User experience obsessed</li>
              <li>Uncomfortably fast</li>
              <li>Extreme clarity</li>
              <li>Candour</li>
              <li>Act like an owner</li>
              <li>Relentless self-iteration</li>
              <li>Enjoy the journey together</li>
            </ul>
            <p>
              Having values like these are meaningless if they don’t alter your
              behaviour. We assess every potential new hire to determine if they
              share similar values to us. People are rewarded and promoted
              internally for living them, and every Friday we do a short
              retrospective to discuss whether we’re getting closer or further
              away from our ideal.
            </p>

            <p>
              Company cultures tend to deteriorate as you scale, primarily
              because the values you had when you were small get watered down.
              One of our primary goals as we grow is to avoid this—and indeed
              strengthen as we scale. We all take an active role in this
              process.
            </p>
          </section>
          <aside className={styles.sectionDetail}>
            <img
              src={data.team.image.original.src}
              alt="Team Thread at a day dedicated to iterating our culture."
            />
          </aside>
          <section>
            <h3>Continuous deployment</h3>
            <p>
              One of the founding principles of Thread is we aim to move
              uncomfortably fast. We prefer to ship MVPs and collect data,
              rather than have endless debates (which usually end up with the
              most senior person’s idea being adopted).
            </p>
            <p>
              This flows into our engineering practices, too, with continuous
              deployment a key part of process. We’ve pushed more than 80,000
              commits in the few years since we founded the company in 2012.
            </p>
            <p>
              We prefer lots of rapid, small releases for a number of reasons:
              you can instantly see feedback from users and how metrics are
              affected, leading to a shorter feedback loop; it’s a lot easier to
              debug integration errors; and modular development is encouraged.
            </p>
          </section>
          <aside className={styles.sectionDetail}>
            <BuildChart />
          </aside>
          <section>
            <h3>Our stack and process</h3>
            <p>
              Some of the technologies we use to build Thread include: Python,
              JavaScript, Elm, Django, React, GraphQL, Redis, AWS, Google Cloud,
              BigQuery, Memcache, Nginx, Ansible, Jenkins, Docker, Gunicorn,
              Luigi, Pandas, Scikit-Learn, Git.
            </p>
            <p>
              We’re big believers in free software, use it extensively, and make
              time to contribute back.
            </p>
            <p>
              In terms of process, we focus on rapid, lightweight releases. We
              discuss our company goals as a team and together come up with a
              plan of how to achieve them. We pick a metric to focus on, build a
              scoreboard and display it in on a large TV in the office. (It’s
              really fun watching it move up-and-to-the-right as you release
              things!) We do weekly sprints, fortnightly retrospectives, track
              all tasks clearly in Asana, and bake in time for technical debt
              each week.
            </p>
          </section>
          <aside className={styles.sectionDetail}>
            <img
              src={data.stack.image.original.src}
              alt="An engineer working at a computer."
            />
          </aside>
          <section>
            <h3>Hard technical challenges</h3>
            <p>
              Life is too short to solve easy problems. We pride ourselves on
              taking on and solving extremely difficult technical problems. Some
              of the current or upcoming things we’re working on include:
            </p>
            <ul className="text-list">
              <li>
                Using machine learning to learn someone’s preferences and
                recommend the perfect clothing for them.
              </li>
              <li>
                Algorithmically determining which size will fit a user
                perfectly.
              </li>
              <li>
                Automatically detecting the optimal frequency and timing to
                email users based on historical behaviour.
              </li>
              <li>Building systems to scrape millions of URLs per day.</li>
              <li>
                Scaling to millions of customers and thousands of orders per
                minute.
              </li>
            </ul>
          </section>
          <aside className={styles.sectionDetail}>
            <img
              src={data.challenges.image.original.src}
              alt="An engineer demoing a new tool they've been working on."
            />
          </aside>
          <section>
            <a href="https://www.thread.com/jobs" className={styles.jobsCta}>
              View open postitions &rarr;
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    team: file(relativePath: { eq: "careers/team.jpg" }) {
      image: childImageSharp {
        original {
          src
        }
      }
    }
    challenges: file(relativePath: { eq: "careers/challenges.jpg" }) {
      image: childImageSharp {
        original {
          src
        }
      }
    }
    stack: file(relativePath: { eq: "careers/stack.jpg" }) {
      image: childImageSharp {
        original {
          src
        }
      }
    }
  }
`;
