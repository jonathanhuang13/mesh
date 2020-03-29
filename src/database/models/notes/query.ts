import * as neo4j from '@src/database/neo4j';

import { Note, NoteId, toNote } from '@src/database/models/notes';
import { getCreateNoteQuery, getListNotesQuery, getNoteByIdQuery } from '@src/database/models/notes/cypher';

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
  const node = result.records[0].get('note').properties;

  return toNote(node);
}

export async function getNotes(): Promise<Note[]> {
  const cypher = getListNotesQuery();

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const node = r.get('n').properties;
    return toNote(node);
  });

  return notes;
}

export async function getNoteById(id: string): Promise<Note | null> {
  const cypher = getNoteByIdQuery({ id });

  const result = await neo4j.write(cypher);
  const node = result.records[0]?.get('n').properties;

  return node ? toNote(node) : null;
}
