import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { ExtendedText } from '../../slatejs/text';

export type Props = RenderLeafProps & {
  leaf: ExtendedText;
  text: ExtendedText;
};

export default function Leaf(props: Props): JSX.Element {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.code) children = <code>{children}</code>;

  return <span {...attributes}>{children}</span>;
}
