MATCH (n: Note) WHERE n.id IN ["d3bec52a-81ab-4ab8-baf1-c18022fc94e2", "58b86ccb-1891-4a08-b3ee-875acecac70d", "0ca266b0-51a9-4e4e-9a9b-b334cceee58b"]
  DETACH DELETE n;