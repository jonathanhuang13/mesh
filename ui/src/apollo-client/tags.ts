import { NoteId } from './notes';

export type TagId = string;

export interface Tag {
  id: TagId;
  name: string;
  notes: NoteId[];
  createdAt: Date;
  updatedAt: Date;
}
