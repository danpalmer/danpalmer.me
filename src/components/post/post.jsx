import React, { Fragment } from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Layout from "../../components/layout";
import classNames from "classnames";

import styles from "./post.module.scss";
import "../../styles/syntax-highlighting.css";

export default ({ data }) => {
  const post = data.markdownRemark;
  const bodyClasses = post.frontmatter.theme
    ? `theme-${post.frontmatter.theme}`
    : "";

  return (
    <Fragment>
      <Helmet
        title={`${post.frontmatter.title} — ${data.site.siteMetadata.title}`}
        meta={[
          {
            name: "description",
            content: data.site.siteMetadata.description
          },
          { name: "keywords", content: "engineering culture" }
        ]}
        bodyAttributes={{ class: bodyClasses }}
      />
      <Layout>
        <article className={styles.post}>
          <header>
            <h1 className="f2-m  mb1 f1-l measure-wide">
              {post.frontmatter.title}
            </h1>
            <div>
              <time className="f6">{post.frontmatter.date}</time>
            </div>
          </header>
          <section
            className={classNames(
              styles.content,
              "markdown-content measure-wide"
            )}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        theme
        date(formatString: "DD MMMM, YYYY")
      }
    }
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
