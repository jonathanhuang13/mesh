import * as neo4j from '@src/database/neo4j';
import { v4 as uuidv4 } from 'uuid';

import { NoteId, CreateNoteParams, UpdateNoteParams, TagId } from '@src/database';

interface CreateNoteCypher {
  id: NoteId;
  content: string;
  references: NoteId[];
  tags: TagId[];
  createdAt: string;
  updatedAt: string;
}

// Note: All tags and references must be created before creating a note
export function getCreateNoteQuery(p: CreateNoteParams): neo4j.Cypher<CreateNoteCypher> {
  const id = uuidv4();

  const now = new Date().toISOString();
  const params: CreateNoteCypher = {
    ...p,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const alias = 'n';
  const query = `CREATE (${alias}:Note {id: $id, title: $title, content: $content, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    WITH ${alias} 
    OPTIONAL MATCH refs=(r:Note) WHERE r.id IN $references
    FOREACH (ref IN nodes(refs) | CREATE (${alias})-[:REFERENCES]->(ref))
    WITH ${alias}, r
    OPTIONAL MATCH (${alias})<-[:REFERENCES]-(b:Note)
    RETURN  ${alias}, COLLECT(DISTINCT r.id) AS references, COLLECT(DISTINCT b.id) AS referencedBy`;

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
      OPTIONAL MATCH refs=(r:Note) WHERE r.id IN $references
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
    OPTIONAL MATCH(${alias})<-[:REFERENCES]-(b:Note)
    RETURN ${alias}, COLLECT(DISTINCT r.id) as references, COLLECT(DISTINCT b.id) as referencedBy`;

  return { query, params, returnAlias: alias };
}

export function getListNotesQuery(): neo4j.Cypher<{}> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note) 
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(r:Note)
    OPTIONAL MATCH (${alias})<-[:REFERENCES]-(b:Note)
    RETURN ${alias}, COLLECT(DISTINCT r.id) AS references, COLLECT(DISTINCT b.id) AS referencedBy`;

  return { query, params: {}, returnAlias: alias };
}

interface GetNoteByIdCypher {
  id: string;
}

export function getNoteByIdQuery(params: GetNoteByIdCypher): neo4j.Cypher<GetNoteByIdCypher> {
  const alias = 'n';
  const query = `MATCH (${alias}: Note {id: $id})
  OPTIONAL MATCH (${alias})-[:REFERENCES]->(r:Note)
  OPTIONAL MATCH (${alias})<-[:REFERENCES]-(b:Note)
  RETURN ${alias}, COLLECT(DISTINCT r.id) AS references, COLLECT(DISTINCT b.id) AS referencedBy`;

  return { query, params, returnAlias: alias };
}

interface GetReferencesCypher {
  id: string;
}

export function getReferencesQuery(params: GetReferencesCypher): neo4j.Cypher<GetReferencesCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})-[:REFERENCES]->(${alias}: Note) 
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(second:Note)
    OPTIONAL MATCH (${alias})<-[:REFERENCES]-(b:Note)
    RETURN ${alias}, COLLECT(DISTINCT second.id) AS references, COLLECT(DISTINCT b.id) AS referencedBy`;

  return { query, params, returnAlias: alias };
}

interface GetReferencedByCypher {
  id: string;
}

export function getReferencedByQuery(params: GetReferencedByCypher): neo4j.Cypher<GetReferencedByCypher> {
  const alias = 'r';
  const query = `MATCH (n: Note {id: $id})<-[:REFERENCES]-(${alias}: Note) 
    OPTIONAL MATCH (${alias})-[:REFERENCES]->(second:Note)
    OPTIONAL MATCH (${alias})<-[:REFERENCES]-(b:Note)
    RETURN ${alias}, COLLECT(DISTINCT second.id) AS references, COLLECT(DISTINCT b.id) AS referencedBy`;

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
