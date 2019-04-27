import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Project from "../components/project/project";

import styles from "./projects.module.scss";

export default ({ data }) => {
  return (
    <Layout>
      <h1>Projects</h1>
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
    </Layout>
  );
};

export const query = graphql`
  query {
    projects: allProjectsYaml {
      edges {
        node {
          id
          name
          repo
          role
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
