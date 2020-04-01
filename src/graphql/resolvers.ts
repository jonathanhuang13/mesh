import { IResolvers } from 'apollo-server-express';

const resolvers: IResolvers | Array<IResolvers> = {
  Query: {
    notes: async (_parent, _args, { dataSources }) => {
      return dataSources.notes.getNotes();
    },
    note: async (_parent, args, { dataSources }) => {
      return dataSources.notes.getNoteById(args.id);
    },
    references: async (_parent, args, { dataSources }) => {
      return dataSources.notes.getReferences(args.id);
    },
    referencedBy: async (_parent, args, { dataSources }) => {
      return dataSources.notes.getReferencedBy(args.id);
    },
  },

  Mutation: {
    createNote: async (_parent, args, { dataSources }) => {
      return dataSources.notes.createNote(args);
    },

    editNote: async (_parent, args, { dataSources }) => {
      return dataSources.notes.updateNote(args);
    },

    deleteNote: async (_parent, args, { dataSources }) => {
      return dataSources.notes.deleteNote(args.id);
    },
  },
};

export default resolvers;
