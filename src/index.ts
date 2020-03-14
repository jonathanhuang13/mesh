async function main(): Promise<void> {
  return log();
}

async function log(): Promise<void> {
  console.log('Hello world');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
