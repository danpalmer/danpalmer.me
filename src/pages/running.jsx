import React, { Fragment, useState } from "react";
import { format as formatDate } from "date-fns";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import { ViewportProvider, useDimensions } from "react-viewport-utils";

import Layout from "../components/layout";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./running.module.scss";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGFuLXBhbG1lciIsImEiOiJjazhtNTV6czkwNTFiM2VxZmMyajNuNW1vIn0.N5DKOkyvPB9OCgKLSuwyMA";

// Page

export default ({ data }) => {
  const runs = data.runs.nodes;
  return (
    <Fragment>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <Layout>
        <div className="mb5">
          <div className="w-100">
            <h1 className="f1 fw9 i">Running</h1>
          </div>
          <div className="fl w-100 w-30-l pb5 pr5-l">
            <section className="pb4">
              <p>
                I go through phases of running regularly. This page tracks my
                running habits over time in an attempt to motivate me.
              </p>
              <p>
                Runs are tracked with{" "}
                <a className="dark-gray b" href="https://www.nike.com/nrc-app">
                  Nike Run Club
                </a>{" "}
                app, where I use the Guided Runs feature to stay motivated.
              </p>
            </section>
            <section>
              <Stat value={data.runs.totalCount} description={"Runs"} />
              <Stat
                value={calcMetricTotal(runs, "distance")}
                description={"KM"}
              />
              <Stat
                value={calcMetricTotal(runs, "calories")}
                description={"kcal"}
              />
            </section>
          </div>
          <div className="fl w-100 w-70-l">
            <RunMapWithViewport runs={runs} />
            <RunTable runs={runs} />
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query {
    runs: allActivitiesJson(
      sort: { fields: start_epoch_ms, order: DESC }
      # Filter to above 60s to exclude cancelled runs
      filter: { active_duration_ms: { gt: 60000 } }
    ) {
      nodes {
        id
        start_epoch_ms
        summaries {
          metric
          value
          summary
        }
        metrics {
          type
          values {
            value
          }
        }
        tags {
          name: com_nike_name
          audioGuideKey: com_nike_running_audioguidedrun
          temperature: com_nike_temperature
          weatherKey: com_nike_weather
          location
          terrain
        }
      }
      totalCount
    }
  }
`;

// Child components

const RunMap = ({ runs }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 51.543,
    longitude: 0.01,
    zoom: 11.5,
  });

  const [lastWidth, setLastWidth] = useState(0);

  const dimensions = useDimensions({
    deferUpdateUntilIdle: true,
    disableScrollUpdates: true,
  });

  if (lastWidth !== dimensions.width) {
    setTimeout(() => {
      setViewport({ width: "100%", ...viewport });
      setLastWidth(dimensions.width);
    }, 0);
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <Source id="data" type="geojson" data={geoJsonForRuns(runs)}>
        <Layer
          id="runs"
          type="line"
          paint={{
            "line-color": "rgb(224,237,94)",
            "line-width": 2,
          }}
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

const RunMapWithViewport = (props) => (
  <ViewportProvider>
    <RunMap {...props} />
  </ViewportProvider>
);

const RunTable = ({ runs }) => (
  <div className={styles.tableContainer}>
    <table className={styles.runTable} cellSpacing="0" cellPadding="0">
      <thead>
        <tr>
          <th></th>
          <th>KM</th>
          <th>KCAL</th>
          <th>Pace</th>
          <th>BPM</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <RunRow run={run} key={run.id} />
        ))}
      </tbody>
    </table>
  </div>
);

const RunRow = ({ run }) => {
  const distance = run.summaries.find(
    (x) => x.summary === "total" && x.metric === "distance"
  );

  const calories = run.summaries.find(
    (x) => x.summary === "total" && x.metric === "calories"
  );

  const pace = run.summaries.find(
    (x) => x.summary === "mean" && x.metric === "pace"
  );

  const paceParts = pace ? decimalToMinsSecs(pace.value) : null;

  const heartRate = run.summaries.find(
    (x) => x.summary === "mean" && x.metric === "heart_rate"
  );

  return (
    <tr className={styles.runRow}>
      <td>{titleForRun(run)}</td>
      <td>{distance && distance.value.toFixed(2)}</td>
      <td>{calories && calories.value.toFixed(0)}</td>
      {pace && (
        <td>
          {paceParts.minutes}:
          {paceParts.seconds < 10 ? `0${paceParts.seconds}` : paceParts.seconds}{" "}
        </td>
      )}
      <td>{heartRate && heartRate.value.toFixed(0)}</td>
      <td className={styles.runDate}>
        {formatDate(new Date(run.start_epoch_ms), "do MMM yyyy")}
      </td>
    </tr>
  );
};

const Stat = ({ value, description }) => (
  <div className="pb2 w-100">
    <span className="f1 fw9 i">{intComma(value)} </span>
    <span className="f3 fw6 i">{description}</span>
  </div>
);

// Utilities

const calcMetricTotal = (runs, metric) =>
  runs
    .reduce((distance, run) => {
      const summary = run.summaries.find((s) => s.metric === metric);
      return summary ? distance + summary.value : distance;
    }, 0)
    .toFixed(0);

const intComma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const geoJsonForRuns = (runs) => ({
  type: "FeatureCollection",
  features: runs
    .map((run) => {
      const points = pathForRun(run);
      if (!points) {
        return null;
      }

      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: points,
        },
      };
    })
    .filter((x) => !!x),
});

const pathForRun = (run) => {
  try {
    const lats = run.metrics
      .find((x) => x.type === "latitude")
      .values.map((x) => x.value);
    const longs = run.metrics
      .find((x) => x.type === "longitude")
      .values.map((x) => x.value);
    return longs.map((x, idx) => [x, lats[idx]]);
  } catch (err) {
    console.log(`No lat/long for ${run.id}`);
    return [];
  }
};

const titleForRun = (run) => {
  if (run.tags.name) {
    return run.tags.name;
  }

  if (run.tags.audioGuideKey) {
    return run.tags.audioGuideKey
      .replace(/_/g, " ")
      .replace("HS", "Headspace")
      .replace("EOD", "End of the Day")
      .replace("FTR", "Fuel the Run")
      .replace(/\w\S*/g, capWord);
  }

  if (run.tags.location) {
    return `${capWord(run.tags.location)} Run`;
  }

  return "Run";
};

const capWord = (word) => {
  word = word.toLowerCase();

  const ignores = ["a", "the", "of", "to", "with"];

  if (ignores.includes(word)) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.substr(1);
};

const decimalToMinsSecs = (value) => {
  const minutes = Math.floor(value);
  const rem = value - minutes;
  const seconds = (60 * rem).toFixed(0);
  return { minutes, seconds };
};
