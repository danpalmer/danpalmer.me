import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";

const PostItem = ({ post }) => {
  return (
    <div className="pb5">
      <Link to={post.fields.slug} className="link dim black">
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
        <div className="fl w-30 pa2">
          <section>
            <h3 className="lh-solid">About</h3>
            <p className="lh-copy">
              I'm a software developer at Thread in London, and a University of
              Southampton alumni where I studied Computer Science, specialising
              in Mobile and Secure Systems.
            </p>
            <p className="lh-copy">
              I enjoy writing software and improving engineering processes. I'm
              currently learning Haskell, and have an interest in distributed
              systems.
            </p>
            <ul>
              <li>GitHub</li>
              <li>Twitter</li>
            </ul>
          </section>
        </div>
        <div className="fl w-70 pa2">
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
