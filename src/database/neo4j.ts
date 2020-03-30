import * as neo4j from 'neo4j-driver';

import { DatabaseConfig } from '@src/config';

export interface Cypher<T extends {}> {
  query: string;
  params: T;
  returnAlias: string;
}

export class Neo4jInstance {
  private driver: neo4j.Driver;

  constructor(config: DatabaseConfig) {
    const { host, username, password } = config;

    this.driver = neo4j.driver(host, neo4j.auth.basic(username, password));
  }

  async closeDriver(): Promise<void> {
    this.driver.close();
  }

  async write<T>(cypher: Cypher<T>): Promise<neo4j.QueryResult> {
    const session = await this.getSession();
    const result = await session.writeTransaction(tx => tx.run(cypher.query, cypher.params));
    await this.closeSession(session);

    return result;
  }
  private async getSession(): Promise<neo4j.Session> {
    return this.driver.session({ defaultAccessMode: 'WRITE' });
  }

  private async closeSession(session: neo4j.Session): Promise<void> {
    return session.close();
  }
}
