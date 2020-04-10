CREATE CONSTRAINT note_unique_id ON (n:Note) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT note_title_exists on (n:Note) ASSERT EXISTS (n.title);

CREATE CONSTRAINT note_created_at_exists on (n:Note) ASSERT EXISTS (n.createdAt);