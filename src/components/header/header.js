import React from "react";
import { Link } from "gatsby";

const Header = ({ siteTitle }) => (
  <div className="global-navigation-wrapper">
    <header className="global-navigation navigation-fixed loaded">
      <div className="navigation-container">
        <section className="navigation-brand">
          <h1>
            <Link to="/">{siteTitle}</Link>
          </h1>
        </section>

        <section className="navigation-primary">
          <ul>
            <li>
              <Link to="/" activeClassName="active">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/projects" activeClassName="active">
                Projects
              </Link>
            </li>
            <li>
              <Link to="#" activeClassName="active">
                CV
              </Link>
            </li>
          </ul>
        </section>

        <section className="navigation-secondary">
          <ul>
            <li className="signin-item">
              <a href="https://www.thread.com/">Visit Thread &rarr;</a>
            </li>
          </ul>
        </section>
      </div>
    </header>
  </div>
);

export default Header;
