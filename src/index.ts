import 'module-alias/register';

import { createApp } from '@src/app';

async function main(): Promise<void> {
  const app = await createApp();
  app.listen(4000, () => console.log('Server listening on port 4000'));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
