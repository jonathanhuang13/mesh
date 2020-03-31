import request from 'supertest';
import Bluebird from 'bluebird';
import express from 'express';

import { createApp } from '@src/app';
import * as fixtures from '@src/__fixtures__/notes';
import { getDataSources } from '@src/graphql/datasources';

let app: express.Express | undefined;

async function getApp(): Promise<express.Express> {
  if (app) return app;

  app = await createApp();
  return app;
}

async function sendRequest(query: string, variables?: { [k: string]: string | string[] }): Promise<any> {
  const app = await getApp();
  const response = await request(app)
    .post('/graphql')
    .send({
      query,
      variables,
    });

  return response;
}

afterAll(async () => {
  const dataSources = getDataSources();
  await dataSources.notes.close();

  app = undefined;
});

let numPrevious = 0;
let initialIds: string[] = [];

beforeEach(async () => {
  const resp = await sendRequest(fixtures.LIST_QUERY);
  expect(resp.status).toEqual(200);
  numPrevious = resp.body.data.notes.length;

  const var1 = {
    title: 'First',
    content: '#first',
    references: [],
  };

  const response = await sendRequest(fixtures.CREATE_QUERY, var1);
  expect(response.status).toEqual(200);
  const { id } = response.body.data.createNote;
  initialIds.push(id);

  const var2 = {
    title: 'Second',
    content: '#second',
    references: [id],
  };

  const response2 = await sendRequest(fixtures.CREATE_QUERY, var2);
  expect(response2.status).toEqual(200);
  const { id: id2 } = response2.body.data.createNote;
  initialIds.push(id2);

  const var3 = {
    title: 'Third',
    content: '#third',
    references: [id, id2],
  };

  const response3 = await sendRequest(fixtures.CREATE_QUERY, var3);
  expect(response3.status).toEqual(200);
  const { id: id3 } = response3.body.data.createNote;
  initialIds.push(id3);
});

afterEach(async () => {
  await Bluebird.map(initialIds, async id => {
    const response = await sendRequest(fixtures.DELETE_QUERY, { id });

    expect(response.status).toEqual(200);
  });

  initialIds = [];
});

describe('Get notes', () => {
  it('should get notes', async () => {
    const response = await sendRequest(fixtures.LIST_QUERY);
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.notes).toHaveLength(numPrevious + 3);
  });

  it('should get one note', async () => {
    const variable = {
      id: initialIds[1],
    };

    const response = await sendRequest(fixtures.GET_BY_ID_QUERY, variable);
    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeTruthy();
  });

  it('should not throw if no note exists', async () => {
    const variables = {
      id: 'abcdef',
    };

    const response = await sendRequest(fixtures.GET_BY_ID_QUERY, variables);
    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeNull();
  });

  it('should get references of a note', async () => {
    const variable = {
      id: initialIds[1],
    };

    const response = await sendRequest(fixtures.GET_REFERENCES, variable);
    expect(response.status).toEqual(200);
    expect(response.body.data.references).toHaveLength(1);
  });

  it('should get referencedBy of a note', async () => {
    const variable = {
      id: initialIds[0],
    };
    const response = await sendRequest(fixtures.GET_REFERENCED_BY, variable);
    expect(response.status).toEqual(200);
    expect(response.body.data.referencedBy).toHaveLength(2);
  });
});

describe('Create note', () => {
  it('should create note and update references', async () => {
    const var1 = {
      title: 'Fourth',
      content: '#fourth',
      references: [initialIds[2]],
    };

    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    expect(response.status).toEqual(200);
    expect(response.body.data.createNote).toBeTruthy();
    const { id } = response.body.data.createNote;
    initialIds.push(id);

    const var2 = {
      id: initialIds[2],
    };

    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toContain(id);
  });
});

describe('Update note', () => {
  it('should update note and references', async () => {
    const var1 = {
      id: initialIds[1],
      title: 'New',
      content: '#new',
      references: [initialIds[2]],
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.status).toEqual(200);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.references).toHaveLength(1);
    expect(response.body.data.editNote.references[0]).toBe(initialIds[2]);

    const var2 = {
      id: initialIds[0],
    };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toHaveLength(1);

    const var3 = {
      id: initialIds[2],
    };
    const response3 = await sendRequest(fixtures.GET_BY_ID_QUERY, var3);
    expect(response3.status).toEqual(200);
    expect(response3.body.data.note).toBeTruthy();
    expect(response3.body.data.note.referencedBy).toHaveLength(1);
    expect(response3.body.data.note.referencedBy).toContain(var1.id);
  });
});
