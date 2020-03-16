import { gql, ApolloServer } from 'apollo-server-express';

const notes = [{ name: 'First' }, { name: 'Second' }];

const typeDefs = gql`
  type Query {
    notes: [Note]
  }

  type Note {
    name: String
  }
`;

const resolvers = {
  Query: { notes: () => notes },
};

export const server = new ApolloServer({ typeDefs, resolvers });
console.log(server.graphqlPath);
