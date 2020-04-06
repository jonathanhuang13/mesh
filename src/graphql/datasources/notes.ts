import { DataSource } from 'apollo-datasource';

import database from '@src/database';
import { Note, NoteId } from '@src/database/notes';
import { TagId } from '@src/database/tags';

export interface CreateNoteParams {
  title: string;
  content: string;
  references: string[];
  tags: TagId[];
}

export type UpdateNoteParams = { id: NoteId } & Partial<CreateNoteParams>;

export class NotesDataSource extends DataSource {
  constructor() {
    super();
  }

  async getNotes(ids?: NoteId[]): Promise<Note[]> {
    return database.getNotes(ids);
  }

  async getNoteById(id: NoteId): Promise<Note | null> {
    return database.getNoteById(id);
  }

  async getReferences(id: NoteId): Promise<Note[]> {
    return database.getReferences(id);
  }

  async getReferencedBy(id: NoteId): Promise<Note[]> {
    return database.getReferencedBy(id);
  }

  async createNote(params: CreateNoteParams): Promise<Note> {
    return database.createNote(params);
  }

  async updateNote(params: UpdateNoteParams): Promise<Note> {
    return database.updateNote(params.id, params);
  }

  async deleteNote(id: NoteId): Promise<Note> {
    return database.deleteNoteById(id);
  }
}
