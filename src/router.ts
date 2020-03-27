import { gql, ApolloServer, IResolvers } from 'apollo-server-express';
import * as lodash from 'lodash';

import { notes } from '@src/__fixtures__/notes';
import { Note } from '@src/database/note';

const typeDefs = gql`
  type Query {
    notes: [Note]!
    note(id: String!): Note
    references(id: String!): [Note]!
    referencedBy(id: String!): [Note]!
  }

  type Mutation {
    editNote(id: String!, title: String, content: String, references: [String!]): Note
  }

  type Note {
    id: String!
    title: String!

    content: String!
    references: [String!]!
    referencedBy: [String!]!
  }
`;

function getNoteById(id: string): Note | undefined {
  return notes.find(n => n.id === id);
}

function addReferencedBy(noteId: string, referencedById: string): void {
  const note = getNoteById(noteId);
  if (!note) return;

  const referencedBy = new Set(note.referencedBy);
  referencedBy.add(referencedById);

  note.referencedBy = Array.from(referencedBy);
}

function deleteReferencedBy(noteId: string, referencedById: string): void {
  const note = getNoteById(noteId);
  if (!note) return;

  lodash.remove(note.referencedBy, n => n === referencedById);
}

const resolvers: IResolvers | Array<IResolvers> = {
  Query: {
    notes: () => notes,
    note: (_parent, args, _context) => {
      const { id } = args;
      return getNoteById(id);
    },
    references: (_parent, args, _context) => {
      const { id } = args;

      const note = getNoteById(id);
      if (!note) return null;

      return note.references.map(noteId => getNoteById(noteId));
    },
    referencedBy: (_parent, args, _context) => {
      const { id } = args;

      const note = getNoteById(id);
      if (!note) return null;

      return note.referencedBy.map(noteId => getNoteById(noteId));
    },
  },
  Mutation: {
    editNote: (_parent, args, _context) => {
      const { id, ...rest } = args;

      const note = getNoteById(id);
      if (!note) return;

      const toUpdate = lodash.omitBy(rest, value => value === undefined);
      lodash.forIn(toUpdate, (value, key) => {
        if (key === 'references') {
          const deletedReferences = lodash.difference(note.references, value);
          const addedReferences = lodash.difference(value, note.references);

          addedReferences.map(noteId => addReferencedBy(noteId, note.id));
          deletedReferences.map(noteId => deleteReferencedBy(noteId, note.id));
        }

        note[key as keyof Note] = value;
      });

      note.updatedAt = new Date();
      return note;
    },
  },
};

export const server = new ApolloServer({ typeDefs, resolvers });
