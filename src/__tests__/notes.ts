import request from 'supertest';

import { createApp } from '@src/app';

describe('Get notes', () => {
  it('should get notes', async () => {
    const query = `query getNotes {
      notes {
        id
      }
    }
    `;

    const app = await createApp();
    const response = await request(app)
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toEqual(200);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data.notes).toHaveLength(2);
  });

  it('should get one note', async () => {
    const query = `query getNote {
      note (id: "1") {
        id
      }
    }`;

    const app = await createApp();
    const response = await request(app)
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeTruthy();
  });

  it('should not throw if no note exists', async () => {
    const query = `query getNote {
      note (id: "abcdef") {
        id
      }
    }`;

    const app = await createApp();
    const response = await request(app)
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toEqual(200);
    expect(response.body.data.note).toBeNull();
  });

  it('should get references of a note', async () => {
    const query = `query getReferences {
      references (id: "1") {
        id
      }
    }`;

    const app = await createApp();
    const response = await request(app)
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toEqual(200);
    expect(response.body.data.references).toHaveLength(1);
  });
  it('should get referencedBy of a note', async () => {
    const query = `query getReferences {
      referencedBy (id: "2") {
        id
      }
    }`;

    const app = await createApp();
    const response = await request(app)
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toEqual(200);
    expect(response.body.data.referencedBy).toHaveLength(1);
  });
});
