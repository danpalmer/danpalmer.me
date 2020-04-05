import React, { Fragment, useState } from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { ResponsiveCalendar } from "@nivo/calendar";
import ReactMapGL, { Source, Layer } from "react-map-gl";

import Layout from "../components/layout";

import styles from "./running.module.scss";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGFuLXBhbG1lciIsImEiOiJjazhtNTV6czkwNTFiM2VxZmMyajNuNW1vIn0.N5DKOkyvPB9OCgKLSuwyMA";

// Page

export default ({ data }) => {
  const runs = data.runs.edges.map((edge) => edge.node);
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
                description={"Calories"}
              />
            </section>
          </div>
          <div className="fl w-100 w-70-l">
            <RunMap runs={runs} />
            <RunCalendar data={dataForCalendar(runs)} />
            {runs.map((run) => (
              <Run run={run} key={run.id} />
            ))}
          </div>
        </div>
          <RunCalendar data={dataForCalendar(data.runs)} />
          {data.runs.edges.map(({ node }) => (
            <Run run={node} key={node.id} />
          ))}
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query {
    runs: allActivitiesJson(
      sort: { fields: start_epoch_ms }
      # Filter to above 60s to exclude cancelled runs
      filter: { active_duration_ms: { gt: 60000 } }
    ) {
      edges {
        node {
          id
          start_epoch_ms
          summaries {
            metric
            value
          }
          metrics {
            type
            values {
              value
            }
          }
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

const Run = ({ run }) => (
  <div className="pv3 w-100 moon-gray bb b--near-white">{run.id}</div>
);

const Stat = ({ value, description }) => (
  <div className="pb2 w-100">
    <span className="f1 fw9 i">{intComma(value)} </span>
    <span className="f3 fw6 i">{description}</span>
  </div>
);

const RunCalendar = ({ data }) => {
  const dataByYear = Object.entries(
    data.reduce((years, entry) => {
      const year = entry.day.split("-")[0];
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(entry);
      return years;
    }, {})
  );

  return (
    <div>
      {dataByYear.map(([year, data]) => (
        <div className={styles.calendarYear} key={year}>
          <ResponsiveCalendar
            data={data}
            from={`${year}-01-01`}
            to={`${year}-12-31`}
            emptyColor="#eeeeee"
            colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
            align="center"
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            isInteractive={false}
          />
        </div>
      ))}
    </div>
  );
};

// Utilities

const calcMetricTotal = (runs, metric) =>
  runs
    .reduce((distance, run) => {
      const summary = run.summaries.find((s) => s.metric === metric);
      return summary ? distance + summary.value : distance;
    }, 0)
    .toFixed(0);

const dataForCalendar = (runs) =>
  runs.map((run) => {
    return {
      day: isoDate(new Date(run.start_epoch_ms)),
      value: run.summaries.find((s) => s.metric === "distance").value,
    };
  });

const intComma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const isoDate = (d) => d.toISOString().split("T")[0];

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
