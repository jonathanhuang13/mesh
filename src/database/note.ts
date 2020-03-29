import { v4 as uuidv4 } from 'uuid';

import * as neo4j from '@src/database/neo4j';
import { Tag } from '@src/database/tag';

export type NoteId = string;

export interface Note {
  id: NoteId;
  title: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  content: string;
  references: NoteId[];
  referencedBy: NoteId[];

  tags: Tag[];
}

export interface CreateNoteParams {
  title: string;
  content: string;
  references: NoteId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  const cypher = getCreateNoteQuery(params);

  const result = await neo4j.write(cypher);
  const note = result.records[0].get('note').properties;

  return note as Note;
}

interface CreateNoteCypher {
  id: string;
  content: string;
  references: NoteId[];
  createdAt: string;
  updatedAt: string;
}

function getCreateNoteQuery(params: CreateNoteParams): neo4j.Cypher<CreateNoteCypher> {
  const id = uuidv4();

  const cypherParams: CreateNoteCypher = {
    ...params,
    id,
    createdAt: params.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: params.updatedAt?.toISOString() ?? new Date().toISOString(),
  };

  const query = `CREATE (note:Note {id: $id, title: $title, content: $content, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    WITH note
    MATCH refs=(r:Note) WHERE r.id IN $references
    FOREACH (ref IN nodes(refs) | CREATE (note)-[:REFERENCES]->(ref))
    RETURN note`;

  return {
    query,
    params: cypherParams,
  };
}
