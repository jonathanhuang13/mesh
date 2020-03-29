import { Note } from '@src/database/models/notes';

export const notes: Note[] = [
  {
    id: '1',
    title: 'First',
    content: '#content',
    references: ['2'],
    referencedBy: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [{ name: 'tag1' }],
  },
  {
    id: '2',
    title: 'Second',
    content: '#content2',
    references: ['1', '3'],
    referencedBy: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [{ name: 'tag1' }, { name: 'tag2' }],
  },
  {
    id: '3',
    title: 'Third',
    content: '#content3',
    references: [],
    referencedBy: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  },
];
