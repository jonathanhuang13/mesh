import { ApolloServer } from 'apollo-server-express';

import typeDefs from '@src/graphql/schema';
import resolvers from '@src/graphql/resolvers';
import { NotesDataSource } from '@src/graphql/datasources/notes';
import { notes } from '@src/__fixtures__/notes';

const dataSources = () => ({
  notes: new NotesDataSource(notes),
});

export const server = new ApolloServer({ typeDefs, resolvers, dataSources });
