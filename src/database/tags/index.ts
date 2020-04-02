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

export type UpdateTagParams = Partial<CreateTagParams>;

export async function updateTag(connection: Neo4jInstance, id: TagId, params: UpdateTagParams): Promise<Tag> {
  const tag = await getTagById(connection, id);
  if (!tag) throw new Error(`Tag ${id} does not exist`);

  const cypher = cyphers.getUpdateTagQuery(id, params);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();
  if (!record) throw new Error(`Could not get record ${result}`);

  return toTag(record, cypher.returnAlias);
}

export async function getTags(connection: Neo4jInstance): Promise<Tag[]> {
  const cypher = cyphers.getListTagsQuery();

  const result = await connection.write(cypher);
  const tags = result.records.map(r => {
    const result = r.toObject();
    return toTag(result, cypher.returnAlias);
  });

  return tags;
}

export async function getTagById(connection: Neo4jInstance, id: TagId): Promise<Tag | null> {
  const cypher = cyphers.getTagByIdQuery(id);

  const result = await connection.write(cypher);
  const record = result.records[0]?.toObject();

  return record ? toTag(record, cypher.returnAlias) : null;
}

export async function deleteTagById(connection: Neo4jInstance, id: TagId): Promise<Tag> {
  const tag = await getTagById(connection, id);
  if (!tag) throw new Error(`Tag ${id} does not exist`);

  const cypher = cyphers.getDeleteTagByIdQuery(id);
  await connection.write(cypher);

  return tag;
}
