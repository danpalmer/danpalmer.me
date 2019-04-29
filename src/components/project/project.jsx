import React from "react";
import classNames from "classnames";

import styles from "./project.module.scss";

export default ({ project, languages }) => {
  return (
    <div className="mr5">
      <h3
        className={classNames("pt5 mv0 lh-solid", {
          "f3-ns f2-m f1-l": !project.is_experiment,
          "f5-ns f4-m f3-l": project.is_experiment
        })}
      >
        {project.name}
      </h3>
      <p className="pt2 mv0">
        <a href={`https://github.com/${project.repo}`}>{project.repo}</a>
      </p>
      <h4 className="pt2 mv0 silver">{project.role}</h4>
      <p className="pt2 mv0 lh-copy">{project.description}</p>
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
