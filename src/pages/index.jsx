import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";

const PostItem = ({ post }) => {
  return (
    <div className="pb5">
      <Link to={post.fields.slug} className="link dim black no-underline">
        <h3 className="mb1 lh-solid">
          {post.frontmatter.title}
          <br />
        </h3>
        <small className="f6 gray">{post.frontmatter.date}</small>
        <p className="lh-copy">{post.excerpt}</p>
      </Link>
    </div>
  );
};

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <div className="fl w-100 w-30-l pa2 pb5 pr5-l">
          <section>
            <h3>About</h3>
            <p>
              I'm a software developer at Thread in London, and an alumnus
              University of Southampton where I studied Computer Science
              specialising in Mobile and Secure Systems. I enjoy writing
              software and improving engineering processes.
            </p>
            <ul className="list pl0 b pt3">
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  href="https://www.github.com/danpalmer"
                >
                  GitHub
                </a>
              </li>
              <li className="fl mr3">
                <a
                  className="link mid-gray no-underline"
                  href="https://www.twitter.com/danpalmer"
                >
                  Twitter
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
            </ul>
          </section>
        </div>
        <div className="fl w-100 w-70-l pa2">
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <PostItem post={node} key={node.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt(pruneLength: 300)
          fields {
            slug
          }
        }
      }
    }
  }
`;
