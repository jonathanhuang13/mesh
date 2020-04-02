import { DataSource } from 'apollo-datasource';

import database from '@src/database';
import { Note } from '@src/database/notes';

export interface CreateNoteParams {
  title: string;
  content: string;
  references: string[];
  tags: string[];
}

export type UpdateNoteParams = { id: string } & Partial<CreateNoteParams>;

export class NotesDataSource extends DataSource {
  constructor() {
    super();
  }

  async getNotes(): Promise<Note[]> {
    return database.getNotes();
  }

  async getNoteById(id: string): Promise<Note | null> {
    return database.getNoteById(id);
  }

  async getReferences(id: string): Promise<Note[]> {
    return database.getReferences(id);
  }

  async getReferencedBy(id: string): Promise<Note[]> {
    return database.getReferencedBy(id);
  }

  async createNote(params: CreateNoteParams): Promise<Note> {
    return database.createNote(params);
  }

  async updateNote(params: UpdateNoteParams): Promise<Note> {
    return database.updateNote(params.id, params);
  }

  async deleteNote(id: string): Promise<Note> {
    return database.deleteNoteById(id);
  }
}
