import React, { useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import Element from './element';
import Leaf from './leaf';
import Toolbar from '../Toolbar';

import { Note } from '../../apollo-client/notes';
import { toggleMark, Format } from '../../slatejs/mark';

const HOTKEYS: { [k: string]: Format } = {
  'mod+b': Format.Bold,
};

// const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const initialValue: Node[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
];

export interface Props {
  note: Note | null;
}

export default function EditorPage(_: Props): JSX.Element {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(renderProps => <Element {...renderProps} />, []);
  const renderLeaf = useCallback(renderProps => <Leaf {...renderProps} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={v => setValue(v)}>
      <Toolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter text..."
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
}
