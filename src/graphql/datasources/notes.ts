import { DataSource } from 'apollo-datasource';

import * as db from '@src/database';
import { DatabaseConfig } from '@src/config';

export interface CreateNoteParams {
  title: string;
  content: string;
  references: string[];
}

export type UpdateNoteParams = { id: string } & Partial<CreateNoteParams>;

export class NotesDataSource extends DataSource {
  connection: db.Neo4jInstance;

  constructor(config: DatabaseConfig) {
    super();

    this.connection = new db.Neo4jInstance(config);
  }

  async close(): Promise<void> {
    await this.connection.closeDriver();
  }

  async getNotes(): Promise<db.Note[]> {
    return db.getNotes(this.connection);
  }

  async getNoteById(id: string): Promise<db.Note | null> {
    return db.getNoteById(this.connection, id);
  }

  async getReferences(id: string): Promise<db.Note[]> {
    return db.getReferences(this.connection, id);
  }

  async getReferencedBy(id: string): Promise<db.Note[]> {
    return db.getReferencedBy(this.connection, id);
  }

  async createNote(params: CreateNoteParams): Promise<db.Note> {
    return db.createNote(this.connection, params);
  }

  async updateNote(params: UpdateNoteParams): Promise<db.Note> {
    return db.updateNote(this.connection, params.id, params);
  }

  async deleteNote(id: string): Promise<db.Note> {
    return db.deleteNoteById(this.connection, id);
  }
}
