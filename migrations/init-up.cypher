CREATE CONSTRAINT note_unique_name ON (n:Note) ASSERT n.name IS UNIQUE;

CREATE CONSTRAINT note_name_exists on (n:Note) ASSERT EXISTS (n.name);

CREATE CONSTRAINT note_created_at_exists on (n:Note) ASSERT EXISTS (n.createdAt);