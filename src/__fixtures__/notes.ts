import { Note } from '@src/database/notes';
import { Tag } from '@src/database/tags';

export const CREATE_QUERY = `mutation createNote($title: String!, $content: String!, $references: [String!]!) {
      createNote (title: $title, content: $content, references: $references) {
        id
        references
        referencedBy
      }
    }`;

export const UPDATE_QUERY = `mutation editNote ($id: String!, $title: String, $content: String, $references: [String!]) {
      editNote (id: $id, title: $title, content: $content, references: $references) {
        id
        title
        references
      }
    }`;

export const DELETE_QUERY = `mutation deleteNote($id: String!) {
      deleteNote (id: $id) {
        id
      }
    }`;

export const LIST_QUERY = `query getNotes {
      notes {
        id
        title
        references
        referencedBy
      }
    }
    `;

export const GET_BY_ID_QUERY = `query getNote($id: String!) {
      note (id: $id) {
        id
        references
        referencedBy
      }
    }`;

export const GET_REFERENCES = `query getReferences($id: String!) {
      references (id: $id) {
        id
        references
        referencedBy
      }
    }`;

export const GET_REFERENCED_BY = `query getReferencedBy($id: String!) {
      referencedBy (id: $id) {
        id
        references
        referencedBy
      }
    }`;

export const tags: Tag[] = [
  {
    id: '1',
    name: 'tag1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'tag2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const notes: Note[] = [
  {
    id: '1',
    title: 'First',
    content: '#content',
    references: ['2'],
    referencedBy: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [tags[0]],
  },
  {
    id: '2',
    title: 'Second',
    content: '#content2',
    references: ['1', '3'],
    referencedBy: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [tags[0], tags[1]],
  },
  {
    id: '3',
    title: 'Third',
    content: '#content3',
    references: [],
    referencedBy: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  },
];
