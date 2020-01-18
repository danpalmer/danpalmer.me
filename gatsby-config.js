const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Dan Palmer",
    siteUrl: "https://danpalmer.me",
    description: "Personal site and blog",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Personal site and blog of Dan Palmer",
        short_name: "Dan Palmer",
        start_url: "/",
        background_color: "#c8e1ff",
        theme_color: "#c8e1ff",
        display: "minimal-ui",
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-responsive-iframe",
          "gatsby-remark-smartypants",
          "gatsby-remark-widows",
          "gatsby-remark-external-links",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 600,
              quality: 80,
              withWebp: { quality: 80 },
            },
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 600,
              height: 338, // 16:9
            },
          },
          {
            resolve: "gatsby-remark-vscode",
            options: {
              colorTheme: "GitHub Plus",
              extensionDataDirectory: path.resolve("./vendor"),
              extensions: [
                {
                  identifier: "justusadam.language-haskell",
                  version: "2.7.0",
                },
                {
                  identifier: "thenikso.github-plus-theme",
                  version: "1.2.1",
                },
                {
                  identifier: "kumar-harsh.graphql-for-vscode",
                  version: "1.15.3",
                },
              ],
            },
          },
        ],
      },
    },
    "gatsby-plugin-netlify",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: "gatsby-plugin-sass",
      options: {
        precision: 8,
      },
    },
    "gatsby-transformer-yaml",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./data/",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/posts/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-redirect-from",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          query {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              query {
                allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC },
                  filter: {frontmatter: {hidden: {ne: true}}}
                ) {
                  totalCount
                  edges {
                    node {
                      excerpt(pruneLength: 300)
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Dan Palmer",
          },
        ],
      },
    },
  ],
};
