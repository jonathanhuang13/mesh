import { Tag } from '@src/database/models/tags';

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

export function toNote(record: any, nodeAlias: string, referenceAlias: string = 'references'): Note {
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
