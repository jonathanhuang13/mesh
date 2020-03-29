import * as neo4j from '@src/database/neo4j';
import { v4 as uuidv4 } from 'uuid';

import { NoteId } from '@src/database/models/notes';
import { CreateNoteParams, UpdateNoteParams } from '@src/database/models/notes/query';

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
    RETURN  ${alias}, collect(r.id) AS references`;

  return { query, params, returnAlias: alias };
}

type UpdateNoteCypher = UpdateNoteParams & {
  id: string;
  updatedAt: string;
};

export function getUpdateNoteQuery(id: string, p: UpdateNoteParams): neo4j.Cypher<UpdateNoteCypher> {
  const alias = 'n';
  const params: UpdateNoteCypher = {
    ...p,
    id,
    updatedAt: new Date().toISOString(),
  };

  const titleQuery = params.title ? `SET ${alias}.title = $title` : ``;
  const contentQuery = params.content ? `SET ${alias}.content = $content` : ``;

  let referencesQuery = '';
  if (params.references) {
    referencesQuery = `WITH ${alias}
      MATCH (${alias})-[l:REFERENCES]->(:Note)
      DELETE l
      
      WITH ${alias}
      MATCH refs=(r:Note) WHERE r.id IN $references
      FOREACH (ref IN nodes(refs) | MERGE (${alias})-[:REFERENCES]->(ref))
      `;
  }

  const query = `MATCH (${alias}:Note {id: $id})
    SET ${alias}.updatedAt = $updatedAt
    ${titleQuery}
    ${contentQuery}

    ${referencesQuery}

    WITH ${alias}
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(r:Note)
    RETURN ${alias}, collect(r.id) as references`;

  return { query, params, returnAlias: alias };
}

export function getListNotesQuery(): neo4j.Cypher<{}> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note) 
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(r:Note)
    RETURN ${alias}, collect(r.id) AS references`;

  return { query, params: {}, returnAlias: alias };
}

interface GetNoteByIdCypher {
  id: string;
}

export function getNoteByIdQuery(params: GetNoteByIdCypher): neo4j.Cypher<GetNoteByIdCypher> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note {id: $id})
  OPTIONAL MATCH (${alias})-[:REFERENCES]->(r:Note)
  RETURN ${alias}, collect(r.id) AS references`;

  return { query, params, returnAlias: alias };
}

interface GetReferencesCypher {
  id: string;
}

export function getReferencesQuery(params: GetReferencesCypher): neo4j.Cypher<GetReferencesCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})-[:REFERENCES]->(${alias}: Note) 
  OPTIONAL MATCH (${alias})-[:REFERENCES]->(second:Note)
  RETURN ${alias}, collect(second.id) AS references`;

  return { query, params, returnAlias: alias };
}

interface GetReferencedByCypher {
  id: string;
}

export function getReferencedByQuery(params: GetReferencedByCypher): neo4j.Cypher<GetReferencedByCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})<-[:REFERENCES]-(${alias}: Note) 
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(second:Note)
    RETURN ${alias}, collect(second.id) AS references`;

  return { query, params, returnAlias: alias };
}

interface DeleteNoteByIdCypher {
  id: string;
}

export function getDeleteNoteByIdQuery(params: DeleteNoteByIdCypher): neo4j.Cypher<DeleteNoteByIdCypher> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note {id: $id}) 
    DETACH DELETE ${alias}`;

  return { query, params, returnAlias: alias };
}
