import { Editor } from 'slate';

export enum Format {
  'Bold' = 'bold',
}

export type Mark = {
  [K in Format]: boolean;
};

export function isMarkActive(editor: Editor, format: Format): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: Format): void {
  const isActive = isMarkActive(editor, format);

  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}
