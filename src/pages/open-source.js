import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Project from '../components/project/project';

import styles from './open-source.module.scss';

export default ({ data }) => {
  return (
    <Layout>
      <h1>Open Source</h1>
      <p>
        Members of the Thread engineering team have published many open source
        libraries and tools over the years. Here is a showcase of those we are
        currently maintaining and using in production. These projects were
        designed from the outset to be open source, and maintained for the long
        term.
      </p>
      <div className={styles.primaryProjects}>
        {data.primaryProjects.edges.map(({ node }) => (
          <div className={styles.project} key={node.id}>
            <Project
              project={node}
              languages={data.allLanguagesYaml.edges.map(e => e.node)}
            />
          </div>
        ))}
      </div>
      <hr />
      <h3>Other Projects</h3>
      <p>
        These projects originated as part of Thread’s infrastructure but have
        since been split out and are now primarily maintained by the community.
        We still contribute to these and use them in production.
      </p>
      <div className={styles.secondaryProjects}>
        {data.secondaryProjects.edges.map(({ node }) => (
          <div className={styles.project} key={node.id}>
            <Project
              project={node}
              languages={data.allLanguagesYaml.edges.map(e => e.node)}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    primaryProjects: allProjectsYaml(filter: { primary: { eq: true } }) {
      edges {
        node {
          id
          name
          repo
          description
          languages
        }
      }
    }
    secondaryProjects: allProjectsYaml(filter: { primary: { ne: true } }) {
      edges {
        node {
          id
          name
          repo
          description
          languages
        }
      }
    }
    allLanguagesYaml {
      edges {
        node {
          id
          name
          colour
        }
      }
    }
  }
`;
