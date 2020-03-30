import * as lodash from 'lodash';
import bluebird from 'bluebird';
import { DataSource } from 'apollo-datasource';

import { Note } from '@src/database/notes';

export interface CreateNoteParams {
  title: string;
  content: string;
  references: string[];
}

export type UpdateNoteParams = { id: string } & Partial<CreateNoteParams>;

export class NotesDataSource extends DataSource {
  notes: Note[]; // TODO: change to use neo4j

  constructor(notes: Note[] = []) {
    super();

    this.notes = notes;
  }

  async getNotes(): Promise<Note[]> {
    return this.notes;
  }

  async getNoteById(id: string): Promise<Note> {
    const note = this.notes.find(n => n.id === id);
    if (!note) throw new Error(`Could not find note ${id}`);

    return note;
  }

  async getReferences(id: string): Promise<Note[]> {
    const note = await this.getNoteById(id);
    return bluebird.map(note.references, id => this.getNoteById(id));
  }

  async getReferencedBy(id: string): Promise<Note[]> {
    const note = await this.getNoteById(id);
    return bluebird.map(note.referencedBy, id => this.getNoteById(id));
  }

  async createNote(params: CreateNoteParams): Promise<Note> {
    const id = '4'; //FIXME
    params.references.map((ref: string) => this.addReferencedBy(ref, id));

    const newNote: Note = {
      id,
      title: params.title,
      content: params.content,
      references: params.references,
      referencedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };

    this.notes.push(newNote);
    return newNote;
  }

  async updateNote(params: UpdateNoteParams): Promise<Note> {
    const { id, ...rest } = params;

    const note = await this.getNoteById(id);

    for (const key in rest) {
      const value = rest[key as keyof CreateNoteParams]; // FIXME
      if (value === undefined) continue;

      if (key === 'references') {
        const addedReferences = lodash.difference(value, note.references);
        const deletedReferences = lodash.difference(note.references, value);

        await bluebird.map(addedReferences, noteId => this.addReferencedBy(noteId, note.id));
        await bluebird.map(deletedReferences, noteId => this.deleteReferencedBy(noteId, note.id));
      }

      note[key as keyof CreateNoteParams] = value as string & string[]; // FIXME
    }

    note.updatedAt = new Date();
    return note;
  }

  private async addReferencedBy(noteId: string, referencedById: string): Promise<Note> {
    const note = await this.getNoteById(noteId);

    const referencedBy = new Set(note.referencedBy);
    referencedBy.add(referencedById);

    note.referencedBy = Array.from(referencedBy);
    return note;
  }

  private async deleteReferencedBy(noteId: string, referencedById: string): Promise<Note> {
    const note = await this.getNoteById(noteId);

    lodash.remove(note.referencedBy, n => n === referencedById);
    return note;
  }
}
