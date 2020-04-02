import { ApolloServer } from 'apollo-server-express';

import typeDefs from '@src/graphql/schema';
import resolvers from '@src/graphql/resolvers';

import { NotesDataSource } from '@src/graphql/datasources/notes';

const dataSources = () => ({
  notes: new NotesDataSource(),
});

export const server = new ApolloServer({ typeDefs, resolvers, dataSources });
