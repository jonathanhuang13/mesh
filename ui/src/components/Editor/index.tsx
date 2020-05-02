import React, { useCallback, useMemo, useState } from 'react';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import Element from './element';
import Leaf from './leaf';
import Toolbar from '../Toolbar';

const HOTKEYS: { [k: string]: string } = {
  'mod+b': 'bold',
};

// const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export default function EditorPage() {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter text..."
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (event.key === 'b') {
              event.preventDefault();
              // const mark = HOTKEYS[hotkey]
              hotkey;
              const mark = 'bold';
              mark;
            }
          }
        }}
      />
    </Slate>
  );
}

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
