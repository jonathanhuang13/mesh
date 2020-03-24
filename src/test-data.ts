import { Note } from './database/note';

export const notes: Note[] = [
  {
    id: '1',
    title: 'First',
    content: '#content',
    references: ['2'],
    referencedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [{ name: 'tag1' }],
  },
  {
    id: '1',
    title: 'Second',
    content: '#content2',
    references: [],
    referencedBy: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [{ name: 'tag1' }, { name: 'tag2' }],
  },
];
