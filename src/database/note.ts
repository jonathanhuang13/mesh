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

function toNote(node: any): Note {
  return {
    ...node,
    createdAt: new Date(node.createdAt.toString()),
    updatedAt: new Date(node.updatedAt.toString()),
    deletedAt: node.deletedAt ? new Date(node.deletedAt.toString()) : undefined,
  };
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
  const node = result.records[0].get('note').properties;

  return toNote(node);
}

interface CreateNoteCypher {
  id: string;
  content: string;
  references: NoteId[];
  createdAt: string;
  updatedAt: string;
}

function getCreateNoteQuery(p: CreateNoteParams): neo4j.Cypher<CreateNoteCypher> {
  const id = uuidv4();

  const params: CreateNoteCypher = {
    ...p,
    id,
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: p.updatedAt?.toISOString() ?? new Date().toISOString(),
  };

  const query = `CREATE (note:Note {id: $id, title: $title, content: $content, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    WITH note
    MATCH refs=(r:Note) WHERE r.id IN $references
    FOREACH (ref IN nodes(refs) | CREATE (note)-[:REFERENCES]->(ref))
    RETURN note`;

  return { query, params };
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

function getListNotesQuery(): neo4j.Cypher<{}> {
  const query = `MATCH (n: Note) RETURN n`;
  return { query, params: {} };
}

export async function getNoteById(id: string): Promise<Note | null> {
  const cypher = getNoteByIdQuery({ id });

  const result = await neo4j.write(cypher);
  const node = result.records[0]?.get('n').properties;

  return node ? toNote(node) : null;
}

interface GetNoteByIdCypher {
  id: string;
}

function getNoteByIdQuery(params: GetNoteByIdCypher): neo4j.Cypher<GetNoteByIdCypher> {
  const query = `MATCH (n: Note {id: $id}) RETURN n`;
  return { query, params };
}
