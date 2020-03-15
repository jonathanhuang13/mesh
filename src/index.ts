import { createNote } from './database/note';
import { closeDriver } from './database/neo4j';

async function main(): Promise<void> {
  const note = await createNote({ name: 'First note', content: '# First note' });
  console.log(note);

  await closeDriver();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
