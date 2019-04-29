import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout.jsx";
import Project from "../components/project/project.jsx";

export default ({ data }) => {
  return (
    <Layout>
      <div className="pv3 flex flex-wrap">
        {data.projects.edges.map(({ node }) => (
          <div key={node.id} className="w-100-m w-50-l">
            <Project
              project={node}
              languages={data.languages.edges.map(e => e.node)}
            />
          </div>
        ))}
      </div>
      <hr className="bb b--black-20 mt5" />
      <h5 className="w-100 lightgrey f3 moon-gray">Experiments</h5>
      <div className="pv3 flex flex-wrap">
        {data.experiments.edges.map(({ node }) => (
          <div key={node.id} className="w-100-m w-50-l">
            <Project
              project={node}
              languages={data.languages.edges.map(e => e.node)}
            />
          </div>
        ))}
      </div>
      <hr className="bb b--black-20 mt5" />
      <h5 className="w-100 lightgrey f3 moon-gray">Legacy</h5>
      <div className="pv3 flex flex-wrap">
        {data.legacy.edges.map(({ node }) => (
          <div key={node.id} className="w-100-m w-50-l">
            <Project
              project={node}
              languages={data.languages.edges.map(e => e.node)}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    projects: allProjectsYaml(filter: { status: { eq: "live" } }) {
      edges {
        node {
          id
          name
          repo
          role
          description
          languages
          status
        }
      }
    }
    experiments: allProjectsYaml(filter: { status: { eq: "experimental" } }) {
      edges {
        node {
          id
          name
          repo
          role
          description
          languages
          status
        }
      }
    }
    legacy: allProjectsYaml(filter: { status: { eq: "legacy" } }) {
      edges {
        node {
          id
          name
          repo
          role
          description
          languages
          status
        }
      }
    }
    languages: allLanguagesYaml {
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
