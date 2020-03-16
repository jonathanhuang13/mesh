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

import { server } from './router';

const app = express();
server.applyMiddleware({ app });

app.listen(4000, () => console.log('Server listening on port 4000'));
