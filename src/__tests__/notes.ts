import database from '@src/database';

import * as fixtures from '@src/__fixtures__/notes';
import { sendRequest, initDatabase, cleanDatabase, InitData } from '@src/__fixtures__/utils';
import { Note } from '@src/database/notes';

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
  numPrevious = resp.body.data.notes.length;

  initial = await initDatabase();
});

afterEach(async () => {
  await cleanDatabase(initial);
  initial = {
    noteIds: [],
    tagIds: [],
  };
});

describe('Get notes', () => {
  it('should get notes', async () => {
    const response = await sendRequest(fixtures.LIST_QUERY);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.notes).toHaveLength(numPrevious + 3);
    expect(response.body.data.notes[0].referencedBy).toBeTruthy();
  });

  it('should get one note', async () => {
    const variable = {
      id: initial.noteIds[1],
    };

    const response = await sendRequest(fixtures.GET_BY_ID_QUERY, variable);
    expect(response.body.data.note).toBeTruthy();
    expect(response.body.data.note.referencedBy).toHaveLength(1);
    expect(response.body.data.note.referencedBy[0]).toMatchObject({ id: initial.noteIds[2] });
  });

  it('should not throw if no note exists', async () => {
    const variables = {
      id: 'abcdef',
    };

    const response = await sendRequest(fixtures.GET_BY_ID_QUERY, variables);
    expect(response.body.data.note).toBeNull();
  });

  it('should get references of a note', async () => {
    const variable = {
      id: initial.noteIds[1],
    };

    const response = await sendRequest(fixtures.GET_REFERENCES, variable);
    expect(response.body.data.references).toHaveLength(1);
    expect(response.body.data.references[0].references).toHaveLength(0);
    expect(response.body.data.references[0].referencedBy).toHaveLength(2);
  });

  it('should get referencedBy of a note', async () => {
    const variable = {
      id: initial.noteIds[0],
    };
    const response = await sendRequest(fixtures.GET_REFERENCED_BY, variable);
    expect(response.status).toEqual(200);
    expect(response.body.data.referencedBy).toHaveLength(2);

    const note1 = response.body.data.referencedBy.filter((n: Note) => n.id === initial.noteIds[1])[0];
    expect(note1).toBeTruthy();
    expect(note1.references).toHaveLength(1);
    expect(note1.referencedBy).toHaveLength(1);
  });
});

describe('Create note', () => {
  it('should create bare note with no references and no tags', async () => {
    const var1 = {
      title: 'Fourth',
      content: '#fourth',
      references: [],
      tags: [],
    };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    const { id } = response.body.data.createNote;
    expect(response.body.data.createNote).toBeTruthy();
    expect(response.body.data.createNote.references).toHaveLength(0);
    expect(response.body.data.createNote.referencedBy).toHaveLength(0);
    expect(response.body.data.createNote.tags).toHaveLength(0);
    initial.noteIds.push(id);
  });

  it('should create note with references', async () => {
    const var1 = {
      title: 'Fourth',
      content: '#fourth',
      references: [initial.noteIds[2]],
      tags: [],
    };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    const { id } = response.body.data.createNote;
    expect(response.body.data.createNote).toBeTruthy();
    expect(response.body.data.createNote.references).toHaveLength(1);
    expect(response.body.data.createNote.referencedBy).toHaveLength(0);
    expect(response.body.data.createNote.tags).toHaveLength(0);
    initial.noteIds.push(id);

    const var2 = {
      id: initial.noteIds[2],
    };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toContainEqual({ id });
  });

  it('should create note with tags', async () => {
    const var1 = {
      title: 'Fourth',
      content: '#fourth',
      references: [],
      tags: [initial.tagIds[0]],
    };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    const { id } = response.body.data.createNote;
    expect(response.body.data.createNote).toBeTruthy();
    expect(response.body.data.createNote.references).toHaveLength(0);
    expect(response.body.data.createNote.referencedBy).toHaveLength(0);
    expect(response.body.data.createNote.tags).toHaveLength(1);
    initial.noteIds.push(id);
  });

  it('should create note with references and tags', async () => {
    const var1 = {
      title: 'Fourth',
      content: '#fourth',
      references: [initial.noteIds[1], initial.noteIds[2]],
      tags: [initial.tagIds[0]],
    };
    const response = await sendRequest(fixtures.CREATE_QUERY, var1);
    const { id } = response.body.data.createNote;
    expect(response.body.data.createNote).toBeTruthy();
    expect(response.body.data.createNote.references).toHaveLength(2);
    expect(response.body.data.createNote.referencedBy).toHaveLength(0);
    expect(response.body.data.createNote.tags).toHaveLength(1);
    initial.noteIds.push(id);

    const var2 = {
      id: initial.noteIds[2],
    };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toContainEqual({ id });
  });
});

describe('Update note', () => {
  it('should update content of notes and not references or tags', async () => {
    const var1 = {
      id: initial.noteIds[1],
      title: 'New',
      content: '#new',
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.references).toHaveLength(1);
    expect(response.body.data.editNote.references[0]).toMatchObject({ id: initial.noteIds[0] });
    expect(response.body.data.editNote.tags).toHaveLength(1);
  });

  it('should remove all references', async () => {
    const var1 = {
      id: initial.noteIds[1],
      title: 'New',
      content: '#new',
      references: [],
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.references).toHaveLength(0);

    const var2 = {
      id: initial.noteIds[0],
    };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toHaveLength(1);
  });

  it('should remove some references and add other references', async () => {
    const var1 = {
      id: initial.noteIds[1],
      title: 'New',
      content: '#new',
      references: [initial.noteIds[2]],
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.references).toHaveLength(1);
    expect(response.body.data.editNote.references[0]).toMatchObject({ id: var1.references[0] });

    const var2 = {
      id: initial.noteIds[0],
    };
    const response2 = await sendRequest(fixtures.GET_BY_ID_QUERY, var2);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toHaveLength(1);

    const var3 = {
      id: initial.noteIds[2],
    };
    const response3 = await sendRequest(fixtures.GET_BY_ID_QUERY, var3);
    expect(response3.body.data.note).toBeTruthy();
    expect(response3.body.data.note.referencedBy).toHaveLength(1);
    expect(response3.body.data.note.referencedBy[0]).toMatchObject({ id: var1.id });
  });

  it('should remove all tags', async () => {
    const var1 = {
      id: initial.noteIds[2],
      title: 'New',
      content: '#new',
      tags: [],
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.tags).toHaveLength(0);
  });

  it('should remove some tags and add others', async () => {
    const var1 = {
      id: initial.noteIds[1],
      title: 'New',
      content: '#new',
      tags: [initial.tagIds[1]],
    };
    const response = await sendRequest(fixtures.UPDATE_QUERY, var1);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('New');
    expect(response.body.data.editNote.tags).toHaveLength(1);
    expect(response.body.data.editNote.tags[0]).toMatchObject({ id: var1.tags[0] });
  });
});
