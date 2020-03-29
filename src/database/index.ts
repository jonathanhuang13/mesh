import 'module-alias/register';

import { createNote } from './note';
import { closeDriver } from './neo4j';

async function main(): Promise<void> {
  const note = await createNote({ title: 'First note', content: '# First note', references: [] });
  console.log(note);

  await closeDriver();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
