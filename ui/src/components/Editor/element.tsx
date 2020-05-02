import React from 'react';
import { RenderElementProps } from 'slate-react';

import { Type, ExtendedElement } from '../../slatejs/element';

export type Props = RenderElementProps & {
  element: ExtendedElement;
};

export default function Element(props: Props) {
  const { element, attributes, children } = props;

  switch (element.type) {
    case Type.HeadingOne:
      return <h1 {...attributes}>{children}</h1>;
    case Type.Link:
    default:
      return <p {...attributes}>{children}</p>;
  }
}
