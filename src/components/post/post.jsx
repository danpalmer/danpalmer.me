import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../../components/layout';

import styles from './post.module.scss';
import '../../styles/syntax-highlighting.css';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Fragment>
      <Helmet
        title={`${post.frontmatter.title} — ${data.site.siteMetadata.title}`}
        meta={[
          {
            name: 'description',
            content: data.site.siteMetadata.description,
          },
          { name: 'keywords', content: 'engineering culture' },
        ]}
      />
      <Layout>
        <div className={styles.post}>
          <header>
            <h1 className={styles.title}>{post.frontmatter.title}</h1>
            <div className={styles.subtitle}>
              <time className={styles.subtitleDate}>
                {post.frontmatter.date}
              </time>
            </div>
          </header>
          <section
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
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
