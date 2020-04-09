import { IResolvers } from 'apollo-server-express';

import { Note } from '@src/database/notes';
import { Tag } from '@src/database/tags';

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

    tags: async (_parent, _args, { dataSources }) => {
      return dataSources.tags.getTags();
    },
    tag: async (_parent, args, { dataSources }) => {
      return dataSources.tags.getTagById(args.id);
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

    createTag: async (_parent, args, { dataSources }) => {
      return dataSources.tags.createTag(args);
    },
    editTag: async (_parent, args, { dataSources }) => {
      return dataSources.tags.updateTag(args);
    },
    deleteTag: async (_parent, args, { dataSources }) => {
      return dataSources.tags.deleteTag(args.id);
    },
  },

  Note: {
    references: (parent, _args, { dataSources }) => {
      const noteIds = (parent as Note).references;
      return dataSources.notes.getNotes(noteIds);
    },

    referencedBy: (parent, _args, { dataSources }) => {
      const noteIds = (parent as Note).referencedBy;
      return dataSources.notes.getNotes(noteIds);
    },
  },

  Tag: {
    notes: (parent, _args, { dataSources }) => {
      const noteIds = (parent as Tag).notes;
      return dataSources.notes.getNotes(noteIds);
    },
  },
};

export default resolvers;
