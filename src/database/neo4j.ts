import * as neo4j from 'neo4j-driver';

import { DatabaseConfig } from '@src/config';

export interface Cypher<T extends {}> {
  query: string;
  params: T;
  returnAlias: string;
}

export class Neo4jInstance {
  private driver?: neo4j.Driver;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;

    this.openDriver(this.config);
  }

  private openDriver(config: DatabaseConfig): neo4j.Driver {
    const { host, username, password } = config;

    this.driver = neo4j.driver(host, neo4j.auth.basic(username, password));
    return this.driver;
  }

  async closeDriver(): Promise<void> {
    this.driver?.close();
  }

  async write<T>(cypher: Cypher<T>): Promise<neo4j.QueryResult> {
    const session = await this.getSession();
    const result = await session.writeTransaction(tx => tx.run(cypher.query, cypher.params));
    await this.closeSession(session);

    return result;
  }
  private async getSession(): Promise<neo4j.Session> {
    let driver = this.driver;
    if (!driver) driver = this.openDriver(this.config);

    return driver.session({ defaultAccessMode: 'WRITE' });
  }

  private async closeSession(session: neo4j.Session): Promise<void> {
    return session.close();
  }
}
