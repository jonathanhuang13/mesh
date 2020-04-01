import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    notes: [Note]!
    note(id: String!): Note
    references(id: String!): [Note]!
    referencedBy(id: String!): [Note]!
  }

  type Mutation {
    createNote(title: String!, content: String!, references: [String!]!): Note!
    editNote(id: String!, title: String, content: String, references: [String!]): Note
    deleteNote(id: String!): Note
  }

  type Note {
    id: String!
    title: String!

    content: String!
    references: [String!]!
    referencedBy: [String!]!
  }
`;

export default typeDefs;
