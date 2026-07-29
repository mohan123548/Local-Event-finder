import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import select

from .database import Base, SessionLocal, engine
from .models import Event


def first_value(record: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = record.get(key)
        if value not in (None, ""):
            return value
    return None


def parse_datetime(value: Any) -> datetime | None:
    if not value:
        return None

    text = str(value).strip().replace("Z", "+00:00")

    try:
        return datetime.fromisoformat(text)
    except ValueError:
        pass

    for pattern in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(text, pattern)
        except ValueError:
            continue

    return None


def parse_float(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(str(value).replace(",", "."))
    except ValueError:
        return None


def normalize_records(raw_data: Any) -> list[dict[str, Any]]:
    if isinstance(raw_data, list):
        return raw_data

    if isinstance(raw_data, dict):
        for key in ("events", "festivals", "results", "records", "data"):
            value = raw_data.get(key)
            if isinstance(value, list):
                return value

    raise ValueError(
        "Unsupported JSON structure. Expected a list or an object containing "
        "'events', 'festivals', 'results', 'records', or 'data'."
    )


def import_events(json_path: Path) -> None:
    if not json_path.exists():
        raise FileNotFoundError(f"JSON file not found: {json_path}")

    Base.metadata.create_all(bind=engine)

    with json_path.open("r", encoding="utf-8") as file:
        records = normalize_records(json.load(file))

    created = 0
    skipped = 0

    with SessionLocal() as db:
        for record in records:
            if not isinstance(record, dict):
                skipped += 1
                continue

            title = first_value(
                record,
                "title",
                "name",
                "nom",
                "festival_name",
                "event_name",
            )

            if not title:
                skipped += 1
                continue

            city = first_value(record, "city", "ville", "commune", "location_city")
            start_datetime = parse_datetime(
                first_value(
                    record,
                    "start_datetime",
                    "start_date",
                    "date_debut",
                    "date_start",
                    "date",
                )
            )

            duplicate_stmt = select(Event).where(
                Event.title == str(title).strip(),
                Event.city == (str(city).strip() if city else None),
                Event.start_datetime == start_datetime,
            )
            if db.scalar(duplicate_stmt):
                skipped += 1
                continue

            event = Event(
                title=str(title).strip(),
                description=first_value(
                    record, "description", "summary", "resume", "details"
                ),
                category=first_value(
                    record, "category", "type", "categorie", "theme"
                ),
                city=str(city).strip() if city else None,
                venue=first_value(
                    record, "venue", "place", "lieu", "address", "adresse"
                ),
                start_datetime=start_datetime,
                end_datetime=parse_datetime(
                    first_value(
                        record,
                        "end_datetime",
                        "end_date",
                        "date_fin",
                        "date_end",
                    )
                ),
                latitude=parse_float(
                    first_value(record, "latitude", "lat", "geo_lat")
                ),
                longitude=parse_float(
                    first_value(record, "longitude", "lon", "lng", "geo_lon")
                ),
                image_url=first_value(
                    record, "image_url", "image", "photo", "thumbnail"
                ),
                source_url=first_value(
                    record, "source_url", "url", "website", "site_web"
                ),
                organizer=first_value(
                    record, "organizer", "organisateur", "organization"
                ),
            )

            db.add(event)
            created += 1

        db.commit()

    print(f"Import complete: {created} created, {skipped} skipped.")


if __name__ == "__main__":
    path = (
        Path(sys.argv[1])
        if len(sys.argv) > 1
        else Path("data") / "french_festivals.json"
    )
    import_events(path)
