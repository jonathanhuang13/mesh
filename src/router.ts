import { gql, ApolloServer, IResolvers } from 'apollo-server-express';

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
    changeTitle(id: String!, newTitle: String!): Note
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
    changeTitle: (_: any, { id, newTitle }: { id: string; newTitle: string }) => {
      const note = notes.find(n => n.id === id);
      if (!note) return;

      note.title = newTitle;
      return note;
    },
  },
};

export const server = new ApolloServer({ typeDefs, resolvers });
