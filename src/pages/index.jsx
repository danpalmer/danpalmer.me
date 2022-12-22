import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";

const PostItem = ({ post }) => {
  return (
    <div className="pb1 cf">
      <Link to={post.fields.slug} className="link black no-underline">
        <h3 className="mb1">
          <span className="fl-l">
            {post.frontmatter.list_title || post.frontmatter.title}
          </span>
          <br className="dn-l" />
          <small className="normal f6 gray fr-l">{post.frontmatter.date}</small>
        </h3>
      </Link>
    </div>
  );
};

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <div className="fl w-100 w-30-l pb5 pr5-l">
          <section>
            <h3>About</h3>
            <p>
              I&rsquo;m a software engineer living in London. I enjoy writing
              software to solve interesting problems and improving engineering
              culture and processes.
            </p>
            <p>
              I currently work at Google on the Play Developer Ecosystem team,
              building services to help Android developers.
            </p>
            <p>
              Previously I spent 7½ years at Thread working on core product
              features, APIs, payments, integration with partners, and tools.
            </p>
            <ul className="list pl0 b pt3">
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  href="https://github.com/danpalmer"
                >
                  GitHub
                </a>
              </li>
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  href="https://twitter.com/danpalmer"
                >
                  Twitter
                </a>
              </li>
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  rel="me"
                  href="https://social.danpalmer.me/@dan"
                >
                  Mastodon
                </a>
              </li>
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  href="mailto:contact@danpalmer.me"
                >
                  Email
                </a>
              </li>
              <li className="fl mr3">
                <Link to="/colophon" className="link moon-gray no-underline">
                  Meta
                </Link>
              </li>
            </ul>
          </section>
        </div>
        <div className="fl w-100 w-70-l">
          {data.featuredPosts.edges.map(({ node }) => (
            <PostItem post={node} key={node.id} />
          ))}
          <div className="pb5 pt4">
            <Link to="/blog" className="link no-underline mid-gray">
              View full archive
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    featuredPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { hidden: { ne: true }, featured: { eq: true } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            list_title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
