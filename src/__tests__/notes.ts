import request from 'supertest';

import { createApp } from '@src/app';

describe('Get notes', () => {
  it('should get notes', async () => {
    const query = `query test {
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
});
