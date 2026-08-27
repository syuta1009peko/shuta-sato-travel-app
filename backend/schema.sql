PRAGMA foreign_keys = ON;

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name_ja TEXT NOT NULL,
  summary_ja TEXT NOT NULL
);

CREATE TABLE places (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities (id),
  name_ja TEXT NOT NULL,
  category TEXT NOT NULL,
  area TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  open_label TEXT NOT NULL,
  close_label TEXT NOT NULL,
  price_range INTEGER NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  description_ja TEXT NOT NULL,
  reason_hint_ja TEXT NOT NULL,
  image_url TEXT,
  lat REAL NOT NULL,
  lng REAL NOT NULL
);

CREATE TABLE place_tags (
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (place_id, tag)
);

CREATE TABLE place_lifestyles (
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  lifestyle TEXT NOT NULL,
  PRIMARY KEY (place_id, lifestyle)
);

CREATE TABLE place_time_slots (
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  PRIMARY KEY (place_id, time_slot)
);

CREATE TABLE place_translations (
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  reason_hint TEXT NOT NULL,
  PRIMARY KEY (place_id, locale)
);