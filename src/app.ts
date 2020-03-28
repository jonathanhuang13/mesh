// import { createNote } from './database/note';
// import { closeDriver } from './database/neo4j';

// async function main(): Promise<void> {
//   const note = await createNote({ name: 'First note', content: '# First note' });
//   console.log(note);

//   await closeDriver();
// }

// main().catch(e => {
//   console.error(e);
//   process.exit(1);
// });

import express from 'express';

import { server } from '@src/graphql';

export async function createApp(): Promise<express.Express> {
  const app = express();
  server.applyMiddleware({ app });

  return app;
}
