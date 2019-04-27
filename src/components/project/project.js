import React from 'react';

import styles from './project.module.scss';

export default ({ project, languages }) => {
  return (
    <div className={styles.project}>
      <h3>
        {project.name}
        <br />
        <small>
          <a href={`https://github.com/${project.repo}`}>{project.repo}</a>
        </small>
      </h3>
      <p>{project.description}</p>
      <ul className={styles.languages}>
        {project.languages.map(languageName =>
          languages
            .filter(language => language.name === languageName)
            .map(language => (
              <li key={language.id}>
                <span style={{ backgroundColor: language.colour }} />
                {language.name}
              </li>
            ))
        )}
      </ul>
    </div>
  );
};
