import React from "react";
import { Link } from "gatsby";

import avatar from "./danpalmer.jpg";

const Header = ({ siteTitle }) => (
  <nav className="db flex justify-between w-100 pa3 ph5-l">
    <div className="dib w-25 v-mid mid-gray">
      <Link to="/" className="link dim">
        <img src={avatar} className="dib w2 h2 br-100" alt={siteTitle} />
      </Link>
    </div>
    <div className="dib w-75 v-mid tr">
      <Link
        to="/"
        activeClassName="active"
        className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
      >
        Blog
      </Link>
      <Link
        to="/projects"
        activeClassName="active"
        className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
      >
        Projects
      </Link>
      <Link
        to="#"
        activeClassName="active"
        className="link dim dark-gray f6 f5-l dib"
      >
        CV
      </Link>
    </div>
  </nav>
);

export default Header;
