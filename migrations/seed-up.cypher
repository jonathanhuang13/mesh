CREATE (n: Note {id: "d3bec52a-81ab-4ab8-baf1-c18022fc94e2", title: "Title 1", content: "#Content1", createdAt: "2020-04-06T14:58:24.771Z", updatedAt: "2020-04-06T14:58:24.771Z"})
  RETURN n;

CREATE (n: Note {id: "0ca266b0-51a9-4e4e-9a9b-b334cceee58b", title: "Title 2", content: "#Content2", createdAt: "2020-04-06T14:59:24.771Z", updatedAt: "2020-04-06T14:59:24.771Z"})
  RETURN n;

MATCH (n: Note {id: "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"})
  WITH n
  MATCH (r: Note {id: "d3bec52a-81ab-4ab8-baf1-c18022fc94e2"})
  WITH n, r
  CREATE (n)-[:REFERENCES]->(r)
  RETURN n, COLLECT(DISTINCT r.id) AS references;


CREATE (n: Note {id: "58b86ccb-1891-4a08-b3ee-875acecac70d", title: "Title 3", content: "#Content3", createdAt: "2020-04-06T15:59:24.771Z", updatedAt: "2020-04-06T15:59:24.771Z"})
  RETURN n;

MATCH (n: Note {id: "58b86ccb-1891-4a08-b3ee-875acecac70d"})
  WITH n
  MATCH refs=(r: Note) WHERE r.id IN ["d3bec52a-81ab-4ab8-baf1-c18022fc94e2", "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"]
  FOREACH (ref IN nodes(refs) | CREATE (n)-[:REFERENCES]->(ref))
  RETURN n, COLLECT(DISTINCT r.id) AS references;