import * as neo4j from './neo4j';
import { Tag } from './tag';

export type NoteID = string;

export interface Note {
  id: NoteID;
  name: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  content: string;
  references: Note[];
  referencedBy: Note[];

  tags: Tag[];
}

export interface CreateNoteParams {
  name: string;
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
