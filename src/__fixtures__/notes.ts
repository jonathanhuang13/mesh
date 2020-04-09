import { CreateNoteParams } from '@src/database/notes';

export const CREATE_QUERY = `mutation createNote($title: String!, $content: String!, $references: [String!]!, $tags: [String!]!) {
      createNote (title: $title, content: $content, references: $references, tags: $tags) {
        id
        references {
          id
        }
        referencedBy {
          id
        }
        tags {
          id
        }
      }
    }`;

export const UPDATE_QUERY = `mutation editNote ($id: String!, $title: String, $content: String, $references: [String!], $tags: [String!]) {
      editNote (id: $id, title: $title, content: $content, references: $references, tags: $tags) {
        id
        title
        references {
          id
        }
        tags {
          id
        }
      }
    }`;

export const DELETE_QUERY = `mutation deleteNote($id: String!) {
      deleteNote (id: $id) {
        id
      }
    }`;

export const LIST_QUERY = `query getNotes ($ids: [String!], $tagIds: [String!]) {
      notes (ids: $ids, tagIds: $tagIds){
        id
        title
        references {
          id
        }
        referencedBy {
          id
        }
        tags {
          id
        }
      }
    }
    `;

export const GET_BY_ID_QUERY = `query getNote($id: String!) {
      note (id: $id) {
        id
        references {
          id
        }
        referencedBy {
          id
        }
        tags {
          id
        }
      }
    }`;

export const GET_REFERENCES = `query getReferences($id: String!) {
      references (id: $id) {
        id
        references {
          id
        }
        referencedBy {
          id
        }
        tags {
          id
        }
      }
    }`;

export const GET_REFERENCED_BY = `query getReferencedBy($id: String!) {
      referencedBy (id: $id) {
        id
        references {
          id
        }
        referencedBy {
          id
        }
        tags {
          id
        }
      }
    }`;

export const CREATE_NOTES_PARAMS: CreateNoteParams[] = [
  {
    title: 'First',
    content: '#first',
    references: [],
    tags: [],
  },
  {
    title: 'Second',
    content: '#second',
    references: [],
    tags: [],
  },
  {
    title: 'Third',
    content: '#third',
    references: [],
    tags: [],
  },
];
