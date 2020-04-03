import request from 'supertest';
import express from 'express';

import { createApp } from '@src/app';

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
