-- this file must end in a new line
CREATE TABLE lines (
  ID SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  variation VARCHAR,
  playercolor VARCHAR NOT NULL,
  selected BOOLEAN DEFAULT TRUE,
  moves JSONB
);
