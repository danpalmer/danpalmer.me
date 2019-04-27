import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import Project from "../components/project/project";

import styles from "./blog.module.scss";

const PostItem = ({ post }) => {
  return (
    <div className={styles.postItem}>
      <Link to={post.fields.slug}>
        <h3>
          {post.frontmatter.title}
          <br />
          <small>{post.frontmatter.date}</small>
        </h3>
        <p>{post.excerpt}</p>
      </Link>
    </div>
  );
};

export default ({ data }) => {
  return (
    <Layout>
      <h1>Thread Engineering</h1>
      <div className={styles.blog}>
        <div className={styles.posts}>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <PostItem post={node} key={node.id} />
          ))}
        </div>
        <div className={styles.sidebar}>
          <section>
            <h4>Open Source</h4>
            {data.projects.edges.map(({ node }) => (
              <div className={styles.project} key={node.id}>
                <Project project={node} languages={[]} />
              </div>
            ))}
            <p>
              <Link to="/open-source">View more</Link>
            </p>
          </section>
          <section>
            <h4>Careers at Thread</h4>
            <p>
              We’re working hard to create one of the highest quality
              engineering cultures around.
            </p>
            <p>
              <Link to="/careers">Careers at Thread</Link>
            </p>
          </section>
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
    projects: allProjectsYaml(
      filter: { role: { eq: "Maintainer" } }
      limit: 3
    ) {
      edges {
        node {
          id
          name
          repo
          languages
        }
      }
    }
  }
`;
