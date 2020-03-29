import 'module-alias/register';

import { createNote } from './note';
import { closeDriver } from './neo4j';

async function main(): Promise<void> {
  const note = await createNote({
    title: 'Fourth note',
    content: '# fourth note',
    references: ['cce3bf99-18ea-4e7d-962e-41bf0549c6bd', 'be7c0a85-136f-45b8-9d1a-9cb0368dbede'],
  });
  console.log(note);

  await closeDriver();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
