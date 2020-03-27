import { gql, ApolloServer } from 'apollo-server-express';

import { notes } from '@src/__fixtures__/notes';

const typeDefs = gql`
  type Query {
    notes: [Note]!
    note(id: String!): Note!
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

const resolvers = {
  Query: {
    notes: () => notes,
    note: (_: any, { id }: { id: string }) => {
      return notes.find(n => n.id === id);
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
