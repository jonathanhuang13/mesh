import { Tag } from '@src/database/models/tags';

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

export function toNote(node: any): Note {
  return {
    ...node,
    createdAt: new Date(node.createdAt.toString()),
    updatedAt: new Date(node.updatedAt.toString()),
    deletedAt: node.deletedAt ? new Date(node.deletedAt.toString()) : undefined,
  };
}
