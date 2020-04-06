import config, { DatabaseConfig } from '@src/config';
import { Neo4jInstance } from '@src/database/neo4j';

import * as notes from '@src/database/notes';
import * as tags from '@src/database/tags';

export class Database {
  connection: Neo4jInstance | undefined;
  config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.getConnection();
  }

  getConnection(): Neo4jInstance {
    if (this.connection) return this.connection;

    this.connection = new Neo4jInstance(this.config);
    return this.connection;
  }

  async close(): Promise<void> {
    if (this.connection) this.connection.closeDriver();
    this.connection = undefined;
  }

  async createNote(params: notes.CreateNoteParams): Promise<notes.Note> {
    const connection = this.getConnection();
    return notes.createNote(connection, params);
  }

  async updateNote(id: notes.NoteId, params: notes.UpdateNoteParams): Promise<notes.Note> {
    const connection = this.getConnection();
    return notes.updateNote(connection, id, params);
  }

  async getNotes(ids?: notes.NoteId[]): Promise<notes.Note[]> {
    const connection = this.getConnection();
    return notes.getNotes(connection, ids);
  }

  async getNoteById(id: notes.NoteId): Promise<notes.Note | null> {
    const connection = this.getConnection();
    return notes.getNoteById(connection, id);
  }

  async getReferences(id: notes.NoteId): Promise<notes.Note[]> {
    const connection = this.getConnection();
    return notes.getReferences(connection, id);
  }

  async getReferencedBy(id: notes.NoteId): Promise<notes.Note[]> {
    const connection = this.getConnection();
    return notes.getReferencedBy(connection, id);
  }

  async deleteNoteById(id: notes.NoteId): Promise<notes.Note> {
    const connection = this.getConnection();
    return notes.deleteNoteById(connection, id);
  }

  async createTag(params: tags.CreateTagParams): Promise<tags.Tag> {
    const connection = this.getConnection();
    return tags.createTag(connection, params);
  }

  async updateTag(id: tags.TagId, params: tags.UpdateTagParams): Promise<tags.Tag> {
    const connection = this.getConnection();
    return tags.updateTag(connection, id, params);
  }

  async getTags(): Promise<tags.Tag[]> {
    const connection = this.getConnection();
    return tags.getTags(connection);
  }

  async getTagById(id: tags.TagId): Promise<tags.Tag | null> {
    const connection = this.getConnection();
    return tags.getTagById(connection, id);
  }

  async deleteTagById(id: tags.TagId): Promise<tags.Tag | null> {
    const connection = this.getConnection();
    return tags.deleteTagById(connection, id);
  }
}

export default new Database(config.database);
