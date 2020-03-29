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
  const record = result.records[0]?.toObject();

  return toNote(record, cypher.returnAlias);
}

export interface UpdateNoteParams {
  title?: string;
  content?: string;
  references?: NoteId[];
}

export async function updateNote(id: string, params: UpdateNoteParams): Promise<Note> {
  const cypher = cyphers.getUpdateNoteQuery(id, params);

  const result = await neo4j.write(cypher);
  const record = result.records[0]?.toObject();

  return toNote(record, cypher.returnAlias);
}

export async function getNotes(): Promise<Note[]> {
  const cypher = cyphers.getListNotesQuery();

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getNoteById(id: string): Promise<Note | null> {
  const cypher = cyphers.getNoteByIdQuery({ id });

  const result = await neo4j.write(cypher);
  const record = result.records[0]?.toObject();

  return record ? toNote(record, cypher.returnAlias) : null;
}

export async function getReferences(id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencesQuery({ id });

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getReferencedBy(id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencedByQuery({ id });

  const result = await neo4j.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function deleteNoteById(id: string): Promise<Note> {
  const note = await getNoteById(id);
  if (!note) throw new Error(`Note ${id} does not exist`);

  const cypher = cyphers.getDeleteNoteByIdQuery({ id });
  await neo4j.write(cypher);

  return note;
}
