import database from '@src/database';
import * as fixtures from '@src/__fixtures__/tags';
import { sendRequest, initDatabase, cleanDatabase, InitData } from '@src/__fixtures__/utils';

afterAll(async () => {
  await database.close();
});

let numPrevious = 0;
let initial: InitData = {
  noteIds: [],
  tagIds: [],
};

beforeEach(async () => {
  const resp = await sendRequest(fixtures.LIST_QUERY);
  numPrevious = resp.body.data.tags.length;

  initial = await initDatabase();
});

afterEach(async () => {
  await cleanDatabase(initial);
  initial = {
    noteIds: [],
    tagIds: [],
  };
});

describe('Get tags', () => {
  it('should get tags', async () => {
    const response = await sendRequest(fixtures.LIST_QUERY);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.tags).toHaveLength(numPrevious + initial.tagIds.length);
    expect(response.body.data.tags[0].name).toBeTruthy();
  });

  it('should get one note', async () => {
    const variable = { id: initial.tagIds[0] };

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
    // TODO: Delete created tag

    const var2 = { id: response.body.data.createTag.id };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.tag).toBeTruthy();
    expect(response2.body.data.tag.name).toBe('Second');
  });
});

describe('Update tag', () => {
  it('should update tag', async () => {
    const var1 = { id: initial.tagIds[0], name: 'New' };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editTag).toBeTruthy();
    expect(response.body.data.editTag.name).toBe('New');
  });
});

describe('Delete tag', () => {
  it('should delete tag', async () => {
    const var1 = { name: 'Second' };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    expect(response.body.data.createTag).toBeTruthy();

    const var2 = { id: response.body.data.createTag.id };
    const response2 = await sendRequest(fixtures.DELETE_QUERY, var2);
    expect(response2.body.data.deleteTag).toBeTruthy();

    const var3 = { id: var2.id };
    const response3 = await sendRequest(fixtures.GET_BY_ID_QUERY, var3);
    expect(response3.body.data.tag).toBeNull();
  });
});
