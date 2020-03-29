import * as neo4j from 'neo4j-driver';

import config from '@src/config';

export interface Cypher<T extends {}> {
  query: string;
  params: T;
  returnAlias: string;
}

const { host, username, password } = config.database;
const driver = neo4j.driver(host, neo4j.auth.basic(username, password));

export async function closeDriver(): Promise<void> {
  driver.close();
}

export async function getSession(): Promise<neo4j.Session> {
  return driver.session({ defaultAccessMode: 'WRITE' });
}

export async function closeSession(session: neo4j.Session): Promise<void> {
  return session.close();
}

export async function write<T>(cypher: Cypher<T>): Promise<neo4j.QueryResult> {
  const session = await getSession();
  const result = await session.writeTransaction(tx => tx.run(cypher.query, cypher.params));
  await closeSession(session);

  return result;
}
