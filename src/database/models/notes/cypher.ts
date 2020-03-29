import * as neo4j from '@src/database/neo4j';
import { v4 as uuidv4 } from 'uuid';

import { NoteId } from '@src/database/models/notes';
import { CreateNoteParams } from '@src/database/models/notes/query';

interface CreateNoteCypher {
  id: string;
  content: string;
  references: NoteId[];
  createdAt: string;
  updatedAt: string;
}

export function getCreateNoteQuery(p: CreateNoteParams): neo4j.Cypher<CreateNoteCypher> {
  const id = uuidv4();

  const params: CreateNoteCypher = {
    ...p,
    id,
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: p.updatedAt?.toISOString() ?? new Date().toISOString(),
  };

  const query = `CREATE (note:Note {id: $id, title: $title, content: $content, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    WITH note
    MATCH refs=(r:Note) WHERE r.id IN $references
    FOREACH (ref IN nodes(refs) | CREATE (note)-[:REFERENCES]->(ref))
    RETURN note`;

  return { query, params };
}

export function getListNotesQuery(): neo4j.Cypher<{}> {
  const query = `MATCH (n: Note) RETURN n`;
  return { query, params: {} };
}

interface GetNoteByIdCypher {
  id: string;
}

export function getNoteByIdQuery(params: GetNoteByIdCypher): neo4j.Cypher<GetNoteByIdCypher> {
  const query = `MATCH (n: Note {id: $id}) RETURN n`;
  return { query, params };
}
