MATCH (t: Tag) WHERE t.id IN ["14f49102-c5ad-4a16-a1f8-09039680f6a2", "eb90fddf-4162-461b-8f1c-cb1dc979efdf"]
  DETACH DELETE t;

MATCH (n: Note) WHERE n.id IN ["d3bec52a-81ab-4ab8-baf1-c18022fc94e2", "58b86ccb-1891-4a08-b3ee-875acecac70d", "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"]
  DETACH DELETE n;