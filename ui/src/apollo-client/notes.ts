import { gql } from '@apollo/client';

import { TagId } from './tags';

export type NoteId = string;

export interface Note {
  __typename: 'Note';
  id: NoteId;
  title: string;
  content: string;

  references: NoteId[];
  referencedBy: NoteId[];

  tags: { id: TagId; name: string }[];
}

export interface ListData {
  notes: Note[];
}

export interface ListVars {
  ids?: string[];
  tagIds?: string[];
}

export const LIST_NOTES_QUERY = gql`
  query getNotes($ids: [String!], $tagIds: [String!]) {
    notes(ids: $ids, tagIds: $tagIds) {
      id
      title
      content
      references {
        id
      }
      referencedBy {
        id
      }
      tags {
        id
        name
      }
    }
  }
`;
