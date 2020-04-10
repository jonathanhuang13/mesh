// Notes

CREATE (n: Note {id: "d3bec52a-81ab-4ab8-baf1-c18022fc94e2", title: "Title 1", content: "#Content1", createdAt: "2020-04-06T14:58:24.771Z", updatedAt: "2020-04-06T14:58:24.771Z"})
  RETURN n;

CREATE (n: Note {id: "0ca266b0-51a9-4e4e-9a9b-b334cceee58b", title: "Title 2", content: "#Content2", createdAt: "2020-04-06T14:59:24.771Z", updatedAt: "2020-04-06T14:59:24.771Z"})
  RETURN n;

CREATE (n: Note {id: "58b86ccb-1891-4a08-b3ee-875acecac70d", title: "Title 3", content: "#Content3", createdAt: "2020-04-06T15:59:24.771Z", updatedAt: "2020-04-06T15:59:24.771Z"})
  RETURN n;


// Tags

CREATE (t: Tag {id: "14f49102-c5ad-4a16-a1f8-09039680f6a2", name: "Name 1", createdAt: "2020-04-06T15:55:03.208Z", updatedAt: "2020-04-06T15:55:03.208Z"})
  RETURN t;

CREATE (t: Tag {id: "eb90fddf-4162-461b-8f1c-cb1dc979efdf", name: "Name 2", createdAt: "2020-04-06T15:57:03.208Z", updatedAt: "2020-04-06T15:57:03.208Z"})
  RETURN t;

// Relationships

MATCH (n: Note {id: "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"})
  WITH n
  MATCH (r: Note {id: "d3bec52a-81ab-4ab8-baf1-c18022fc94e2"})
  WITH n, r
  MATCH (t: Tag {id: "14f49102-c5ad-4a16-a1f8-09039680f6a2"})
  WITH n, r, t
  CREATE (n)-[:REFERENCES]->(r)
  CREATE (n)-[:IS_TAGGED_WITH]->(t)
  RETURN n, COLLECT(DISTINCT r.id) AS references;


MATCH (n: Note {id: "58b86ccb-1891-4a08-b3ee-875acecac70d"})
  WITH n
  MATCH refs=(r: Note) WHERE r.id IN ["d3bec52a-81ab-4ab8-baf1-c18022fc94e2", "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"]
  FOREACH (ref IN nodes(refs) | CREATE (n)-[:REFERENCES]->(ref))

  WITH n, COLLECT(DISTINCT r.id) AS references
  MATCH tags=(t: Tag) WHERE t.id IN ["14f49102-c5ad-4a16-a1f8-09039680f6a2", "eb90fddf-4162-461b-8f1c-cb1dc979efdf"]
  FOREACH (tag IN nodes(tags) | CREATE (n)-[:IS_TAGGED_WITH]->(t))
  RETURN n, references, COLLECT(DISTINCT t) AS tags;

