import { Neo4jInstance } from '@src/database';
import * as cyphers from '@src/database/tags/cypher';

export type TagId = string;

export interface Tag {
  id: TagId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

function toTag(record: any, nodeAlias: string): Tag {
  const node = record[nodeAlias].properties;

  return {
    id: node.id,
    name: node.name,
    createdAt: new Date(node.createdAt.toString()),
    updatedAt: new Date(node.updatedAt.toString()),
  };
}

export interface CreateTagParams {
  name: string;
}

export async function createTag(connection: Neo4jInstance, params: CreateTagParams): Promise<Tag> {
  const cypher = cyphers.getCreateTagQuery(params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();
  if (!record) throw new Error(`Could not get record ${result}`);

  return toTag(record, cypher.returnAlias);
}
