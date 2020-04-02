import { v4 as uuidv4 } from 'uuid';

import * as neo4j from '@src/database/neo4j';
import { CreateTagParams, UpdateTagParams, TagId } from '@src/database';
import {} from '.';

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

type UpdateTagCypher = UpdateTagParams & {
  id: TagId;
  updatedAt: string;
};

export function getUpdateTagQuery(id: TagId, p: UpdateTagParams): neo4j.Cypher<UpdateTagCypher> {
  const alias = 't';
  const params: UpdateTagCypher = {
    ...p,
    id,
    updatedAt: new Date().toISOString(),
  };

  const nameQuery = params.name ? `SET ${alias}.name = $name` : ``;

  const query = `MATCH (${alias}:Tag {id: $id})
    ${nameQuery}
    SET ${alias}.updatedAt = datetime($updatedAt)
    RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}

export function getListTagsQuery(): neo4j.Cypher<{}> {
  const alias = 't';
  const query = `MATCH (${alias}: Tag) RETURN ${alias}`;

  return { query, params: {}, returnAlias: alias };
}

interface GetTagByIdCypher {
  id: string;
}

export function getTagByIdQuery(id: TagId): neo4j.Cypher<GetTagByIdCypher> {
  const params = { id };

  const alias = 't';
  const query = `MATCH (${alias}:Tag {id: $id}) RETURN ${alias}`;

  return { query, params, returnAlias: alias };
}

interface DeleteTagByIdCypher {
  id: string;
}

export function getDeleteTagByIdQuery(id: TagId): neo4j.Cypher<DeleteTagByIdCypher> {
  const params = { id };

  const alias = 't';
  const query = `MATCH (${alias}:Tag {id: $id}) 
    DETACH DELETE ${alias}`;

  return { query, params, returnAlias: alias };
}
