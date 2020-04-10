import { DataSource } from 'apollo-datasource';

import database from '@src/database';
import { Tag, TagId } from '@src/database/tags';

export interface CreateTagParams {
  name: string;
}

export type UpdateTagParams = { id: TagId } & Partial<CreateTagParams>;

export class TagsDataSource extends DataSource {
  constructor() {
    super();
  }

  async getTags(ids?: TagId[]): Promise<Tag[]> {
    return database.getTags(ids);
  }

  async getTagById(id: TagId): Promise<Tag | null> {
    return database.getTagById(id);
  }

  async createTag(params: CreateTagParams): Promise<Tag> {
    return database.createTag(params);
  }

  async updateTag(params: UpdateTagParams): Promise<Tag> {
    return database.updateTag(params.id, params);
  }

  async deleteTag(id: TagId): Promise<Tag | null> {
    return database.deleteTagById(id);
  }
}
