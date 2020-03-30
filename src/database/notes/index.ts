import { Neo4jInstance } from '@src/database/neo4j';
import { Tag } from '@src/database/tags';
import * as cyphers from '@src/database/notes/cypher';

export type NoteId = string;

export interface Note {
  id: NoteId;
  title: string;

  createdAt: Date;
  updatedAt: Date;

  content: string;
  references: NoteId[];
  referencedBy: NoteId[];

  tags: Tag[];
}

function toNote(record: any, nodeAlias: string, referenceAlias: string = 'references'): Note {
  const node = record[nodeAlias].properties;
  const refs = record[referenceAlias];
  if (!refs) throw new Error(`Could not find references property on node ${node.id}`);

  return {
    ...node,
    references: refs ?? [],
    createdAt: new Date(node.createdAt.toString()),
    updatedAt: new Date(node.updatedAt.toString()),
  };
}

export interface CreateNoteParams {
  title: string;
  content: string;
  references: NoteId[];
}

export async function createNote(connection: Neo4jInstance, params: CreateNoteParams): Promise<Note> {
  const cypher = cyphers.getCreateNoteQuery(params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();

  return toNote(record, cypher.returnAlias);
}

export type UpdateNoteParams = Partial<CreateNoteParams>;

export async function updateNote(
  connection: Neo4jInstance,
  id: string,
  params: UpdateNoteParams,
): Promise<Note> {
  const cypher = cyphers.getUpdateNoteQuery(id, params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();

  return toNote(record, cypher.returnAlias);
}

export async function getNotes(connection: Neo4jInstance): Promise<Note[]> {
  const cypher = cyphers.getListNotesQuery();

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getNoteById(connection: Neo4jInstance, id: string): Promise<Note | null> {
  const cypher = cyphers.getNoteByIdQuery({ id });

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();

  return record ? toNote(record, cypher.returnAlias) : null;
}

export async function getReferences(connection: Neo4jInstance, id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencesQuery({ id });

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getReferencedBy(connection: Neo4jInstance, id: string): Promise<Note[]> {
  const cypher = cyphers.getReferencedByQuery({ id });

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function deleteNoteById(connection: Neo4jInstance, id: string): Promise<Note> {
  const note = await getNoteById(connection, id);
  if (!note) throw new Error(`Note ${id} does not exist`);

  const cypher = cyphers.getDeleteNoteByIdQuery({ id });
  await connection.write(cypher);

  return note;
}
