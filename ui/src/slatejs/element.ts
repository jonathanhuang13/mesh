import { Element } from 'slate';

export enum Type {
  'HeadingOne' = 'heading-one',
  'Link' = 'link',
}

export type TypeToData = {
  [Type.Link]: { url: string };
  [Type.HeadingOne]: {};
};

export interface ElementFor<T extends Type> extends Element {
  type: T;
  data: TypeToData[T];
}

export type ExtendedElement = { [T in Type]: ElementFor<T> }[Type];
