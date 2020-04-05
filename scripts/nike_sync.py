import json
import datetime
import logging
import os.path
import sys
import argparse

import httpx

BASE_URL = "https://api.nike.com/sport/v3/me"
OUTPUT_DIR = "data/activities"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nike_sync")


class Nike:
    def __init__(self, access_token):
        self.client = httpx.Client(headers={"Authorization": f"Bearer {access_token}"})

    def get_activities_since_timestamp(self, timestamp):
        return self.request("activities/after_time", timestamp)

    def get_activities_since_id(self, activity_id):
        return self.request("activities/after_id", activity_id)

    def get_activity(self, activity_id):
        return self.request("activity", f"{activity_id}?metrics=ALL")

    def request(self, resource, selector):
        url = f"{BASE_URL}/{resource}/{selector}"
        logger.info(f"GET: {url}")
        response = self.client.get(url)
        response.raise_for_status()
        return response.json()


def run(access_token):
    nike = Nike(access_token)
    last_id = get_last_activity_id()

    logger.info(f"Running from ID {last_id}")

    while True:
        if last_id is not None:
            data = nike.get_activities_since_id(last_id)
        else:
            data = nike.get_activities_since_timestamp(0)

        last_id = data["paging"].get("after_id")
        activities = data["activities"]

        logger.info(f"Found {len(activities)} new activities")

        for activity in activities:
            full_activity = nike.get_activity(activity["id"])
            save_activity(full_activity)

        if last_id is None or not activities:
            logger.info(f"Found no new activities, finishing")
            return


def save_activity(activity):
    activity_id = activity["id"]
    logger.info(f"Saving activity {activity_id}")
    path = os.path.join(OUTPUT_DIR, f"{activity_id}.json")
    try:
        with open(path, "w") as f:
            json.dump(sanitise_json(activity), f, indent=4)
    except Exception:
        os.unlink(path)
        raise


def activity_name(activity):
    tags = activity["tags"]
    if "com.nike.name" in tags:
        return tags["com.nike.name"]
    elif "com.nike.running.audioguidedrun" in tags:
        return tags["com.nike.running.audioguidedrun"].replace("_", " ").title()
    elif "location" in tags:
        return f"{tags['location']} run".title()
    else:
        return activity["type"].title()


def get_last_activity_id():
    activities = []

    for filename in os.listdir(OUTPUT_DIR):
        with open(os.path.join(OUTPUT_DIR, filename)) as f:
            data = json.load(f)
            activities.append((data["end_epoch_ms"], data["id"]))

    if not activities:
        return None

    last_run_ms, last_id = sorted(activities, reverse=True)[0]
    last_run = datetime.datetime.fromtimestamp(last_run_ms / 1000)
    logger.info(f"Last update from {last_run}")
    return last_id


def sanitise_json(d):
    """
    Gatsby's JSON loading for GraphQL queries doesn't support "." characters in
    names, which Nike uses a lot for reverse-domain notation.

    We recursively transform all dict keys to use underscores instead.
    """

    def _transform_key(key):
        return key.replace(".", "_")

    if isinstance(d, dict):
        return {_transform_key(k): sanitise_json(v) for k, v in d.items()}

    if isinstance(d, (tuple, list)):
        return [sanitise_json(x) for x in d]

    return d


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("access_token", help="API access token for nike.com")
    options = parser.parse_args()
    run(options.access_token)
