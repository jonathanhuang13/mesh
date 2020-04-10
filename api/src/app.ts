import express from 'express';

import { server } from '@src/graphql';

export async function createApp(): Promise<express.Express> {
  const app = express();
  server.applyMiddleware({ app });

  return app;
}
