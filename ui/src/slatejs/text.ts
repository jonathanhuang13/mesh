import { Text } from 'slate';

export enum AttributeType {
  'Bold' = 'bold',
  'Italic' = 'italic',
  'Code' = 'code',
}

export type ExtendedText = Text & { [T in AttributeType]: boolean };
