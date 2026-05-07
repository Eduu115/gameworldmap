CREATE TABLE IF NOT EXISTS countries (
  id          VARCHAR(10) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  flag        VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS studios (
  id          SERIAL PRIMARY KEY,
  rawg_id     INTEGER UNIQUE,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255),
  country_id  VARCHAR(10) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS games (
  id          SERIAL PRIMARY KEY,
  rawg_id     INTEGER UNIQUE NOT NULL,
  title       VARCHAR(500) NOT NULL,
  slug        VARCHAR(500),
  cover_url   TEXT,
  year        SMALLINT,
  rating      NUMERIC(3,1),
  country_id  VARCHAR(10) REFERENCES countries(id),
  synced_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: a game can have multiple studios
CREATE TABLE IF NOT EXISTS game_studios (
  game_id     INTEGER REFERENCES games(id) ON DELETE CASCADE,
  studio_id   INTEGER REFERENCES studios(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, studio_id)
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_game_tracks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id     INTEGER REFERENCES games(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'playing', 'abandoned', 'wishlist')),
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

-- Index para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_games_country    ON games(country_id);
CREATE INDEX IF NOT EXISTS idx_games_year       ON games(year);
CREATE INDEX IF NOT EXISTS idx_studios_country  ON studios(country_id);
CREATE INDEX IF NOT EXISTS idx_tracks_user      ON user_game_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_game_studios_g   ON game_studios(game_id);
CREATE INDEX IF NOT EXISTS idx_game_studios_s   ON game_studios(studio_id);
