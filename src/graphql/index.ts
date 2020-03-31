import { ApolloServer } from 'apollo-server-express';

import typeDefs from '@src/graphql/schema';
import resolvers from '@src/graphql/resolvers';

import { getDataSources } from '@src/graphql/datasources';

const dataSources = () => getDataSources() as any; // Type not matching ApolloServer

export const server = new ApolloServer({ typeDefs, resolvers, dataSources });
