import { CreateTagParams } from '@src/database/tags';

export const CREATE_QUERY = `mutation createTag($name: String!) {
      createTag (name: $name) {
        id
        name
        notes {
          id
        }
      }
    }`;

export const UPDATE_QUERY = `mutation editTag ($id: String!, $name: String) {
      editTag (id: $id, name: $name) {
        id
        name
        notes {
          id
        }
      }
    }`;

export const DELETE_QUERY = `mutation deleteTag($id: String!) {
      deleteTag (id: $id) {
        id
        name
      }
    }`;

export const LIST_QUERY = `query getTags {
      tags {
        id
        name
        notes {
          id
        }
      }
    }
    `;

export const GET_BY_ID_QUERY = `query getTag($id: String!) {
      tag (id: $id) {
        id
        name
        notes {
          id
        }
      }
    }`;

export const CREATE_TAG_PARAMS: CreateTagParams[] = [{ name: 'Name 1 Tag' }, { name: 'Name 2 Tag' }];
