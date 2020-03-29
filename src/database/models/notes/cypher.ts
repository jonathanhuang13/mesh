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

  const alias = 'n';
  const query = `CREATE (${alias}:Note {id: $id, title: $title, content: $content, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    WITH ${alias} 
    MATCH refs=(r:Note) WHERE r.id IN $references
    FOREACH (ref IN nodes(refs) | CREATE ( ${alias})-[:REFERENCES]->(ref))
    RETURN  ${alias}`;

  return { query, params, returnAlias: alias };
}

export function getListNotesQuery(): neo4j.Cypher<{}> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note) RETURN ${alias}`;

  return { query, params: {}, returnAlias: alias };
}

interface GetNoteByIdCypher {
  id: string;
}

export function getNoteByIdQuery(params: GetNoteByIdCypher): neo4j.Cypher<GetNoteByIdCypher> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note {id: $id}) RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}

interface GetReferencesCypher {
  id: string;
}

export function getReferencesQuery(params: GetReferencesCypher): neo4j.Cypher<GetReferencesCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})-[:REFERENCES]->(${alias}: Note) RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}

interface GetReferencedByCypher {
  id: string;
}

export function getReferencedByQuery(params: GetReferencedByCypher): neo4j.Cypher<GetReferencedByCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})<-[:REFERENCES]-(${alias}: Note) RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}
