import { ApolloServer } from 'apollo-server-express';

import typeDefs from '@src/graphql/schema';
import resolvers from '@src/graphql/resolvers';

import { NotesDataSource } from '@src/graphql/datasources/notes';
import { TagsDataSource } from '@src/graphql/datasources/tags';

const dataSources = () => ({
  notes: new NotesDataSource(),
  tags: new TagsDataSource(),
});

export const server = new ApolloServer({ typeDefs, resolvers, dataSources });
