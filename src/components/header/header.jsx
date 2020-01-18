import React, { Fragment } from "react";
import { Link, StaticQuery, graphql } from "gatsby";

const Header = ({ siteTitle }) => (
  <StaticQuery
    query={graphql`
      query AvatarQuery {
        avatar: allImageSharp(
          filter: {
            internal: {
              contentDigest: { eq: "6ed84bb3826dad26c27a572d9bd9e732" }
            }
          }
        ) {
          edges {
            node {
              image: fluid(srcSetBreakpoints: [32, 64, 96], quality: 100) {
                srcSet
                base64
              }
            }
          }
        }
      }
    `}
    render={data => (
      <Fragment>
        <nav className="db flex justify-between w-100 pa3 ph5-l">
          <div className="dib w-25 v-mid">
            <Link to="/" className="link dim">
              <img
                className="dib w2 h2 br-100"
                alt={siteTitle}
                srcSet={data.avatar.edges[0].node.image.srcSet}
                src={data.avatar.edges[0].node.image.base64}
              />
            </Link>
          </div>
          <div className="dib w-75 v-mid tr">
            <Link
              to="/"
              activeClassName="active"
              className="link dim f6 f5-l dib mr3 mr4-l"
            >
              Blog
            </Link>
            <Link
              to="/projects"
              activeClassName="active"
              className="link dim f6 f5-l dib mr3 mr4-l"
            >
              Projects
            </Link>
            <Link
              to="/cv"
              activeClassName="active"
              className="link dim f6 f5-l dib"
            >
              CV
            </Link>
          </div>
        </nav>
      </Fragment>
    )}
  />
);

export default Header;
