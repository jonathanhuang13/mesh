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
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  const cypher = getCreateNoteQuery(params);

  const result = await neo4j.write(cypher);
  const note = result.records[0].get('note').properties;

  return note as Note;
}

function getCreateNoteQuery(params: CreateNoteParams): neo4j.Cypher<CreateNoteParams> {
  return {
    query: 'CREATE (note:Note {name: $name, content: $content}) RETURN note',
    params,
  };
}
