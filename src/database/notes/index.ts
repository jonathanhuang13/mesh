import { Neo4jInstance } from '@src/database/neo4j';
import { TagId } from '@src/database/tags';
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

  tags: TagId[];
}

function toNote(record: any, nodeAlias: string): Note {
  const node = record[nodeAlias].properties;

  const refs = record['references'];
  if (!refs) throw new Error(`Could not find references property on node ${node.id}`);

  const refBy = record['referencedBy'];
  if (!refBy) throw new Error(`Could not find referencedBy property on node ${node.id}`);

  const tags = record['tags'];
  if (!tags) throw new Error(`Could not find tags property on node ${node.id}`);

  return {
    ...node,
    references: refs,
    referencedBy: refBy,
    tags,
    createdAt: new Date(node.createdAt.toString()),
    updatedAt: new Date(node.updatedAt.toString()),
  };
}

export interface CreateNoteParams {
  title: string;
  content: string;
  references: NoteId[];
  tags: TagId[];
}

export async function createNote(connection: Neo4jInstance, params: CreateNoteParams): Promise<Note> {
  const cypher = cyphers.getCreateNoteQuery(params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();
  if (!record) throw new Error(`Failed on createNote query. Could not get record ${JSON.stringify(result)}`);

  return toNote(record, cypher.returnAlias);
}

export type UpdateNoteParams = Partial<CreateNoteParams>;

export async function updateNote(
  connection: Neo4jInstance,
  id: NoteId,
  params: UpdateNoteParams,
): Promise<Note> {
  const note = await getNoteById(connection, id);
  if (!note) throw new Error(`Note ${id} does not exist`);

  const cypher = cyphers.getUpdateNoteQuery(id, params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();
  if (!record) throw new Error(`Failed on updateNote query. Could not get record ${JSON.stringify(result)}`);

  return toNote(record, cypher.returnAlias);
}

export async function getNotes(connection: Neo4jInstance, ids?: NoteId[]): Promise<Note[]> {
  const cypher = cyphers.getListNotesQuery({ ids });

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getNoteById(connection: Neo4jInstance, id: NoteId): Promise<Note | null> {
  const cypher = cyphers.getNoteByIdQuery(id);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();

  return record ? toNote(record, cypher.returnAlias) : null;
}

export async function getReferences(connection: Neo4jInstance, id: NoteId): Promise<Note[]> {
  const cypher = cyphers.getReferencesQuery({ id });

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function getReferencedBy(connection: Neo4jInstance, id: NoteId): Promise<Note[]> {
  const cypher = cyphers.getReferencedByQuery({ id });

  const result = await connection.write(cypher);
  const notes = result.records.map(r => {
    const result = r.toObject();
    return toNote(result, cypher.returnAlias);
  });

  return notes;
}

export async function deleteNoteById(connection: Neo4jInstance, id: NoteId): Promise<Note> {
  const note = await getNoteById(connection, id);
  if (!note) throw new Error(`Note ${id} does not exist`);

  const cypher = cyphers.getDeleteNoteByIdQuery(id);
  await connection.write(cypher);

  return note;
}
