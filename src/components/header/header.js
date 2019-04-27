import React from 'react';
import { Link } from 'gatsby';

import './header.scss';

const Header = ({ siteTitle }) => (
  <div className="global-navigation-wrapper">
    <header className="global-navigation navigation-fixed loaded">
      <div className="navigation-container">
        <section className="navigation-brand">
          <h1>
            <Link to="/">
              <svg viewBox="0 0 116.13 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m0 8.47h24v15.53h-1.41v-14.12h-1.41v14.12h-1.42v-14.12h-1.41v14.12h-1.41v-14.12h-1.41v14.12h-1.41v-14.12h-1.41v14.12h-1.42v-1.74l-1.62 1.74h-1.94l3.56-3.8v-2.06l-5.49 5.86h-1.93l7.42-7.93v-2.07l-9.36 10h-1.93l11.29-12.06v-2.06l-11.29 12.06v-2.07l9.36-10h-1.94l-7.42 7.93v-2.06l5.49-5.86h-1.94l-3.55 3.79v-2.06l1.62-1.73h-1.62zm0-1.41h24v-1.42h-24zm0-2.83h24v-1.41h-24zm0-4.23v1.41h24v-1.41zm35.35 19.2h2.46v-12.2h5.06v-2.2h-12.56v2.2h5zm10.19 0h2.46v-6.09h6.72v6.09h2.48v-14.4h-2.47v6.09h-6.73v-6.09h-2.46zm26.1-4.81v4.81h-2.47v-4.2c0-1.07-.31-1.37-1.38-1.37h-4.42v5.57h-2.47v-14.4h6.48c2.55 0 4.47 1.65 4.47 3.91a3.6 3.6 0 0 1 -2.41 3.64c1.56 0 2.2.65 2.2 2.04zm-2.26-5.25c0-1.42-.91-2.14-2.62-2.14h-3.39v4.44h3.39c1.71 0 2.62-.92 2.62-2.3zm8.23 7.86v-4.09h7v-2.21h-7v-3.7h8.27v-2.2h-10.74v14.4h11v-2.2zm24.51 2.2h-2.59l-1.36-3.52h-6.4l-1.35 3.52h-2.58l5.7-14.4h3zm-4.81-5.74-2.31-6.09-2.34 6.09zm18.82-1.46c0 4.65-2.8 7.2-7 7.2h-5.1v-14.4h5c4.24 0 7.1 2.55 7.1 7.2zm-2.47 0c0-3.56-1.87-5-4.77-5h-2.37v10h2.37c2.9 0 4.77-1.44 4.77-5z"
                  fill="#101124"
                />
              </svg>
            </Link>
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
              <Link to="/open-source" activeClassName="active">
                Open Source
              </Link>
            </li>
            <li>
              <Link to="/careers" activeClassName="active">
                Careers
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
