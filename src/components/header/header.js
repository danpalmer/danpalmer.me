import React from "react";
import { Link } from "gatsby";

import avatar from "./danpalmer.jpg";

const Header = ({ siteTitle }) => (
  <nav class="db dt-l w-100 border-box pa3 ph5-l">
    <Link
      to="/"
      className="db dtc-l v-mid mid-gray link dim w-100 w-25-l tc tl-l mb2 mb0-l"
    >
      <img src={avatar} class="dib w2 h2 br-100" alt={siteTitle} />
    </Link>
    <div class="db dtc-l v-mid w-100 w-75-l tc tr-l">
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
