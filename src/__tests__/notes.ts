import request from 'supertest';

import { createApp } from '@src/app';

async function sendRequest(query: string): Promise<any> {
  const app = await createApp();
  const response = await request(app)
    .post('/graphql')
    .send({
      query,
    });

  return response;
}

describe('Get notes', () => {
  it('should get notes', async () => {
    const query = `query getNotes {
      notes {
        id
      }
    }
    `;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.notes).toHaveLength(3);
  });

  it('should get one note', async () => {
    const query = `query getNote {
      note (id: "1") {
        id
      }
    }`;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeTruthy();
  });

  it('should not throw if no note exists', async () => {
    const query = `query getNote {
      note (id: "abcdef") {
        id
      }
    }`;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeNull();
  });

  it('should get references of a note', async () => {
    const query = `query getReferences {
      references (id: "1") {
        id
      }
    }`;
    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.references).toHaveLength(1);
  });
  it('should get referencedBy of a note', async () => {
    const query = `query getReferences {
      referencedBy (id: "2") {
        id
      }
    }`;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.referencedBy).toHaveLength(1);
  });
});

describe('Create note', () => {
  it('should create note and update references', async () => {
    const query = `mutation createNote {
      createNote (title:"new", content: "##new", references: ["1"]) {
        id
      }
    }`;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.createNote).toBeTruthy();
    const id = response.body.data.createNote.id;

    const query2 = `query getNote {
      note (id: "1") {
        id
        referencedBy
      }
    }`;

    const response2 = await sendRequest(query2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toContain(id);
  });
});

describe('Update note', () => {
  it('should update note and references', async () => {
    const query = `mutation editNote{
      editNote (id: "1", title:"new", content: "##new", references: ["3"]) {
        id
        title
        references
      }
    }`;

    const response = await sendRequest(query);
    expect(response.status).toEqual(200);
    expect(response.body.data.editNote).toBeTruthy();
    expect(response.body.data.editNote.title).toBe('new');
    expect(response.body.data.editNote.references).toHaveLength(1);
    expect(response.body.data.editNote.references[0]).toBe('3');

    const query2 = `query getNote {
      note (id: "2") {
        id
        referencedBy
      }
    }`;

    const response2 = await sendRequest(query2);
    expect(response2.status).toEqual(200);
    expect(response2.body.data.note).toBeTruthy();
    expect(response2.body.data.note.referencedBy).toHaveLength(0);

    const id = response.body.data.editNote.id;
    const query3 = `query getNote {
      note (id: "3") {
        id
        referencedBy
      }
    }`;

    const response3 = await sendRequest(query3);
    expect(response3.status).toEqual(200);
    expect(response3.body.data.note).toBeTruthy();
    expect(response3.body.data.note.referencedBy).toHaveLength(2);
    expect(response3.body.data.note.referencedBy).toContain(id);
  });
});
