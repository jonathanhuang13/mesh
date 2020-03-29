import * as neo4j from '@src/database/neo4j';

import { Note, NoteId, toNote } from '@src/database/models/notes';
import * as cyphers from '@src/database/models/notes/cypher';

export interface CreateNoteParams {
  title: string;
  content: string;
  references: NoteId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  const cypher = cyphers.getCreateNoteQuery(params);

  const result = await neo4j.write(cypher);
  const node = result.records[0].get(cypher.returnAlias).properties;

  return toNote(node);
}

export interface UpdateNoteParams {
  title?: string;
  content?: string;
  references?: NoteId[];
}

export async function updateNote(id: string, params: UpdateNoteParams): Promise<Note> {
  const cypher = cyphers.getUpdateNoteQuery(id, params);

  const result = await neo4j.write(cypher);
  const node = result.records[0].get(cypher.returnAlias).properties;

  return toNote(node);
}

export async function getNotes(): Promise<Note[]> {
  const cypher = cyphers.getListNotesQuery();

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const node = r.get(cypher.returnAlias).properties;
    return toNote(node);
  });

  return notes;
}

export async function getNoteById(id: string): Promise<Note | null> {
  const cypher = cyphers.getNoteByIdQuery({ id });

  const result = await neo4j.write(cypher);
  const node = result.records[0]?.get(cypher.returnAlias).properties;

  return node ? toNote(node) : null;
}

export async function getReferences(id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencesQuery({ id });

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const node = r.get(cypher.returnAlias).properties;
    return toNote(node);
  });

  return notes;
}

export async function getReferencedBy(id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencedByQuery({ id });

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const node = r.get(cypher.returnAlias).properties;
    return toNote(node);
  });

  return notes;
}
