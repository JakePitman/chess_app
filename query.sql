-- this file must end in a new line
CREATE TABLE lines (
  ID SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  playercolor VARCHAR NOT NULL,
  selected BOOLEAN DEFAULT TRUE,
  moves JSONB
);
