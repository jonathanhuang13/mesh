import Bluebird from 'bluebird';

import database from '@src/database';
import * as fixtures from '@src/__fixtures__/tags';
import { sendRequest } from '@src/__fixtures__/utils';

afterAll(async () => {
  await database.close();
});

let numPrevious = 0;
let initialIds: string[] = [];

beforeEach(async () => {
  const resp = await sendRequest(fixtures.LIST_QUERY);
  numPrevious = resp.body.data.tags.length;

  const var1 = { name: 'First' };
  const response = await sendRequest(fixtures.CREATE_QUERY, var1);
  const { id } = response.body.data.createTag;
  initialIds.push(id);
});

afterEach(async () => {
  await Bluebird.map(initialIds, async id => {
    const response = await sendRequest(fixtures.DELETE_QUERY, { id });

    expect(response.status).toEqual(200);
  });

  initialIds = [];
});

describe('Get tags', () => {
  it('should get tags', async () => {
    const response = await sendRequest(fixtures.LIST_QUERY);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.tags).toHaveLength(numPrevious + 1);
    expect(response.body.data.tags[0].name).toBeTruthy();
  });

  it('should get one note', async () => {
    const variable = { id: initialIds[0] };

    const response = await sendRequest(fixtures.GET_BY_ID_QUERY, variable);
    expect(response.status).toEqual(200);
    expect(response.body.data.tag).toBeTruthy();
    expect(response.body.data.tag.name).toBeTruthy();
  });
});

describe('Create tag', () => {
  it('should create tag', async () => {
    const var1 = { name: 'Second' };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    expect(response.body.data.createTag).toBeTruthy();

    const var2 = { id: response.body.data.createTag.id };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.tag).toBeTruthy();
    expect(response2.body.data.tag.name).toBe('Second');
  });
});

describe('Update tag', () => {
  it('should update tag', async () => {
    const var1 = { id: initialIds[0], name: 'New' };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editTag).toBeTruthy();
    expect(response.body.data.editTag.name).toBe('New');
  });
});

describe('Delete tag', () => {
  it('should delete tag', async () => {
    const var1 = { id: initialIds[0] };
    const response = await sendRequest(fixtures.DELETE_QUERY, var1);
    expect(response.body.data.deleteTag).toBeTruthy();

    const var2 = { id: var1.id };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.body.data.tag).toBeNull();
  });
});
