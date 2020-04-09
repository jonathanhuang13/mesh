import request from 'supertest';
import express from 'express';
import Bluebird from 'bluebird';

import database from '@src/database';
import { NoteId } from '@src/database/notes';
import { TagId } from '@src/database/tags';
import { createApp } from '@src/app';
import * as tagsFixtures from '@src/__fixtures__/tags';
import * as notesFixtures from '@src/__fixtures__/notes';

let app: express.Express | undefined;

async function getApp(): Promise<express.Express> {
  if (app) return app;

  app = await createApp();
  return app;
}

export async function sendRequest(
  query: string,
  variables?: { [k: string]: string | string[] },
): Promise<any> {
  const app = await getApp();
  const response = await request(app)
    .post('/graphql')
    .send({
      query,
      variables,
    });

  return response;
}

export interface InitData {
  noteIds: NoteId[];
  tagIds: TagId[];
}

export async function initDatabase(): Promise<InitData> {
  const tags = await Bluebird.map(tagsFixtures.CREATE_TAG_PARAMS, t => database.createTag(t));
  const notes = await Bluebird.map(notesFixtures.CREATE_NOTES_PARAMS, n => database.createNote(n));

  await database.updateNote(notes[1].id, { references: [notes[0].id], tags: [tags[0].id] });
  await database.updateNote(notes[2].id, {
    references: [notes[0].id, notes[1].id],
    tags: [tags[0].id, tags[1].id],
  });

  return { noteIds: notes.map(n => n.id), tagIds: tags.map(t => t.id) };
}

export async function cleanDatabase(initData: InitData): Promise<void> {
  const { noteIds, tagIds } = initData;

  await Promise.all([
    Bluebird.map(noteIds, id => database.deleteNoteById(id)),
    Bluebird.map(tagIds, id => database.deleteTagById(id)),
  ]);
}
