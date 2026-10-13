-- Harmony Upload — schemat początkowy (D1 / SQLite).
-- Czasy: unix ms (INTEGER). Rozmiary: bajty (INTEGER).

CREATE TABLE trips (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  trip_date     TEXT,                              -- YYYY-MM-DD, opcjonalnie
  secret_hash   TEXT NOT NULL UNIQUE,              -- hex SHA-256 sekretu linku (sam sekret jest wyliczany, nie przechowywany)
  link_version  INTEGER NOT NULL DEFAULT 1,        -- zwiększane przy unieważnieniu linku
  expires_at    INTEGER NOT NULL,                  -- termin ważności linku
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  quota_bytes   INTEGER NOT NULL CHECK (quota_bytes > 0),
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE TABLE participants (
  id            TEXT PRIMARY KEY,                  -- losowe ID
  trip_id       TEXT NOT NULL REFERENCES trips(id),
  display_name  TEXT,                              -- opcjonalne "Twoje imię"
  link_version  INTEGER NOT NULL,                  -- wersja linku, z której wszedł uczestnik
  created_at    INTEGER NOT NULL,
  last_seen_at  INTEGER NOT NULL
);
CREATE INDEX idx_participants_trip ON participants(trip_id);

CREATE TABLE files (
  id             TEXT PRIMARY KEY,
  trip_id        TEXT NOT NULL REFERENCES trips(id),
  participant_id TEXT NOT NULL REFERENCES participants(id),
  client_key     TEXT NOT NULL,                    -- klucz idempotencji z przeglądarki
  original_name  TEXT NOT NULL,
  object_key     TEXT NOT NULL UNIQUE,             -- generowany po stronie serwera
  declared_size  INTEGER NOT NULL,
  verified_size  INTEGER,                          -- rozmiar potwierdzony w magazynie po złożeniu
  content_type   TEXT,                             -- deklarowany przez klienta — dane niezaufane
  status         TEXT NOT NULL DEFAULT 'uploading'
                 CHECK (status IN ('uploading', 'ready', 'cancelled', 'failed', 'expired', 'deleted')),
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  completed_at   INTEGER,
  UNIQUE (participant_id, client_key)
);
CREATE INDEX idx_files_trip_status ON files(trip_id, status);

CREATE TABLE upload_sessions (
  id                  TEXT PRIMARY KEY,            -- publiczny identyfikator sesji uploadu
  file_id             TEXT NOT NULL UNIQUE REFERENCES files(id),
  trip_id             TEXT NOT NULL REFERENCES trips(id),
  participant_id      TEXT NOT NULL REFERENCES participants(id),
  upload_id           TEXT,                        -- multipart upload id po stronie magazynu
  reserved_bytes      INTEGER NOT NULL,            -- rezerwacja limitu
  part_size           INTEGER NOT NULL,
  part_count          INTEGER NOT NULL,
  state               TEXT NOT NULL DEFAULT 'creating'
                      CHECK (state IN ('creating', 'active', 'finalizing', 'completed', 'aborted', 'expired', 'failed', 'released')),
  last_activity_at    INTEGER NOT NULL,
  expires_at          INTEGER NOT NULL,            -- ostatnia aktywność + TTL sesji
  finalize_started_at INTEGER,
  cleanup_state       TEXT NOT NULL DEFAULT 'none' CHECK (cleanup_state IN ('none', 'pending', 'done', 'error')),
  cleanup_attempts    INTEGER NOT NULL DEFAULT 0,
  cleanup_error       TEXT,
  cleanup_at          INTEGER,
  created_at          INTEGER NOT NULL
);
-- Rezerwacja liczy się tylko w stanach: creating, active, finalizing, completed.
CREATE INDEX idx_sessions_trip_state ON upload_sessions(trip_id, state);
CREATE INDEX idx_sessions_state_expires ON upload_sessions(state, expires_at);
CREATE INDEX idx_sessions_cleanup ON upload_sessions(cleanup_state);

CREATE TABLE upload_parts (
  session_id   TEXT NOT NULL REFERENCES upload_sessions(id),
  part_number  INTEGER NOT NULL,
  size         INTEGER NOT NULL,                   -- oczekiwany rozmiar liczony przez serwer
  sha256       TEXT NOT NULL,                      -- skrót zawartości części (hex), podany przez klienta przed wysyłką
  etag         TEXT,                               -- ETag z magazynu (bez cudzysłowów)
  state        TEXT NOT NULL DEFAULT 'signed' CHECK (state IN ('signed', 'uploaded')),
  updated_at   INTEGER NOT NULL,
  PRIMARY KEY (session_id, part_number)
);

CREATE TABLE audit_events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  at      INTEGER NOT NULL,
  actor   TEXT NOT NULL,                           -- e-mail admina, 'system' lub 'participant'
  action  TEXT NOT NULL,
  target  TEXT,
  detail  TEXT
);
CREATE INDEX idx_audit_at ON audit_events(at);

CREATE TABLE app_state (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);
