import { v4 as uuidv4 } from 'uuid';

import * as neo4j from '@src/database/neo4j';
import { CreateTagParams, TagId } from '@src/database';

interface CreateTagCypher {
  id: TagId;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function getCreateTagQuery(p: CreateTagParams): neo4j.Cypher<CreateTagCypher> {
  const id = uuidv4();

  const now = new Date().toISOString();
  const params: CreateTagCypher = {
    ...p,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const alias = 't';
  const query = `CREATE (${alias}:Tag {id: $id, name: $name, createdAt: datetime($createdAt), updatedAt: datetime($updatedAt)})
    RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}
