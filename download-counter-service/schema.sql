CREATE TABLE IF NOT EXISTS download_counts (
  slug TEXT PRIMARY KEY,
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0)
);

INSERT OR IGNORE INTO download_counts (slug, total)
VALUES ('alvo-dumbledore', 0);
