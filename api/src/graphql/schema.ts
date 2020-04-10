import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    notes(ids: [String!], tagIds: [String!]): [Note]!
    note(id: String!): Note
    references(id: String!): [Note]!
    referencedBy(id: String!): [Note]!

    tags: [Tag]!
    tag(id: String!): Tag
  }

  type Mutation {
    createNote(title: String!, content: String!, references: [String!]!, tags: [String!]!): Note!
    editNote(id: String!, title: String, content: String, references: [String!], tags: [String!]): Note
    deleteNote(id: String!): Note

    createTag(name: String!): Tag!
    editTag(id: String!, name: String): Tag
    deleteTag(id: String!): Tag
  }

  type Note {
    id: String!
    title: String!

    content: String!
    references: [Note!]!
    referencedBy: [Note!]!
    tags: [Tag!]!
  }

  type Tag {
    id: String!
    name: String!
    notes: [Note!]!
  }
`;

export default typeDefs;
